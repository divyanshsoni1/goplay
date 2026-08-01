/**
 * lib/referral.ts
 * Referral system utilities.
 *
 * - generateReferralCode   : creates a cryptographically random, URL-safe code
 * - getOrCreateReferralCode: idempotent — returns existing code or creates a new one
 * - resolveReferrerByCode  : validates a referral code and returns the referring user id
 * - recordReferral         : atomically creates the Referral row and increments referralCount
 *
 * All functions are server-side only.
 */

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Length of the generated referral code (characters). */
const CODE_LENGTH = 8;

/** Characters used in the referral code — uppercase + digits, no ambiguous chars. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Maximum retries when a generated code collides with an existing one. */
const MAX_RETRIES = 5;

/** Cookie / localStorage key used client-side to persist the pending ref code. */
export const REFERRAL_COOKIE_NAME = "gp_ref";

/** How long (in seconds) the referral cookie lives before expiring — 30 days. */
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

// ─── Code generation ─────────────────────────────────────────────────────────

/**
 * Generates a cryptographically random referral code using the Web Crypto API
 * (available in both Node.js 18+ and Edge runtimes).
 *
 * Produces codes like: "A3KP9Z2M"
 * - Not sequential, not guessable, URL-safe.
 */
function generateCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the user's existing referral code, or generates and persists a new one.
 * The code is immutable once created — this function is idempotent.
 *
 * @param userId  The authenticated user's DB id
 * @returns       The user's unique referral code string
 */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  // Fast path — already has a code
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });

  if (user?.referralCode) return user.referralCode;

  // Slow path — generate a unique code (retry on collision)
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const code = generateCode();

    // Check uniqueness before writing
    const collision = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });

    if (collision) {
      logger.warn("Referral code collision — retrying", { attempt, code });
      continue;
    }

    // Atomic write: only update if the field is still null
    // (guards against a race where two requests hit the slow path simultaneously)
    const updated = await prisma.user.updateMany({
      where: { id: userId, referralCode: null },
      data: { referralCode: code },
    });

    if (updated.count > 0) {
      logger.info("Referral code created", { userId, code });
      return code;
    }

    // Another request won the race — fetch whatever was set
    const fresh = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });

    if (fresh?.referralCode) return fresh.referralCode;
  }

  throw new Error(`Failed to generate a unique referral code for user ${userId} after ${MAX_RETRIES} attempts`);
}

// ─── Resolve referrer ─────────────────────────────────────────────────────────

/**
 * Looks up a referral code and returns the referrer's user id, or null if:
 * - The code doesn't exist / has been tampered with
 * - The code belongs to the newly-registered user themselves (self-referral)
 *
 * @param code          The referral code from the cookie/query param
 * @param newUserId     The id of the user who just registered (to block self-referral)
 */
export async function resolveReferrerByCode(
  code: string,
  newUserId: string
): Promise<string | null> {
  if (!code || typeof code !== "string") return null;

  // Sanitise: only allow characters from our alphabet and correct length
  const sanitised = code.trim().toUpperCase();
  if (!/^[A-Z0-9]{6,12}$/.test(sanitised)) return null;

  const referrer = await prisma.user.findUnique({
    where: { referralCode: sanitised },
    select: { id: true, isActive: true },
  });

  if (!referrer) return null;
  if (!referrer.isActive) return null;

  // Prevent self-referral
  if (referrer.id === newUserId) {
    logger.warn("Self-referral attempt blocked", { userId: newUserId, code: sanitised });
    return null;
  }

  return referrer.id;
}

// ─── Record referral ─────────────────────────────────────────────────────────

/**
 * Atomically records a successful referral:
 *  1. Creates a Referral row (senderId → receiverId)
 *  2. Increments the sender's referralCount
 *  3. Sets the receiver's referredById
 *
 * Idempotent — if the receiver was already referred, silently returns false.
 *
 * @param senderId    The referring user's id
 * @param receiverId  The newly-registered user's id
 * @returns           true if the referral was recorded, false if it was a duplicate
 */
export async function recordReferral(
  senderId: string,
  receiverId: string
): Promise<boolean> {
  try {
    await prisma.$transaction([
      // Create referral row — will throw on duplicate receiverId (unique constraint)
      prisma.referral.create({
        data: { senderId, receiverId },
      }),
      // Increment referral count for the sender
      prisma.user.update({
        where: { id: senderId },
        data: { referralCount: { increment: 1 } },
      }),
      // Record who referred the new user
      prisma.user.update({
        where: { id: receiverId },
        data: { referredById: senderId },
      }),
    ]);

    logger.info("Referral recorded", { senderId, receiverId });
    return true;
  } catch (error) {
    // P2002 = Prisma unique constraint violation — duplicate referral
    if (
      error instanceof Error &&
      (error as { code?: string }).code === "P2002"
    ) {
      logger.warn("Duplicate referral ignored", { senderId, receiverId });
      return false;
    }
    logger.error("Failed to record referral", {
      senderId,
      receiverId,
      error: String(error),
    });
    throw error;
  }
}
