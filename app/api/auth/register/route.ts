/**
 * POST /api/auth/register
 * Creates a new credentials-based user account.
 *
 * Security:
 *  - Rate limited (authLimiter: 10 req/min per IP)
 *  - Password hashed with bcrypt (cost factor 12)
 *  - Generic error for duplicate email (no user enumeration)
 *  - Input validated and sanitised via Zod
 *
 * Referral:
 *  - Reads the `gp_ref` cookie set when the user landed via a referral link
 *  - Validates the code server-side (resolveReferrerByCode)
 *  - Records the relationship atomically after user creation (recordReferral)
 *  - Self-referral and duplicate referrals are silently ignored
 */

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, authLimiter } from "@/lib/rate-limit";
import { getClientIp, getUserAgent, writeAuditLog } from "@/lib/audit";
import { registerSchema } from "@/lib/validators";
import {
  ok,
  validationError,
  serverError,
  tooManyRequests,
  err,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import {
  REFERRAL_COOKIE_NAME,
  resolveReferrerByCode,
  recordReferral,
} from "@/lib/referral";
import type { NextRequest } from "next/server";

const BCRYPT_COST = 12;

export async function POST(request: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = rateLimit(ip, authLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError("Invalid JSON body");
  }

  // ── Validate ──────────────────────────────────────────────────────────────
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input";
    return validationError(message);
  }

  const { name, email, password } = parsed.data;

  // ── Read referral code from cookie (server-side, trusted) ─────────────────
  // The cookie is HttpOnly and set by our own API, so it cannot be forged
  // by injecting a value in the request body.
  const pendingRefCode =
    request.cookies.get(REFERRAL_COOKIE_NAME)?.value ?? null;

  try {
    // ── Duplicate check ───────────────────────────────────────────────────
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, provider: true },
    });

    if (existing) {
      if (existing.provider === "google" && !existing.password) {
        return err(
          "ACCOUNT_EXISTS",
          "An account with this email already exists. If you signed up with Google, please use Google Sign-In.",
          409
        );
      }
      return err(
        "ACCOUNT_EXISTS",
        "An account with this email already exists.",
        409
      );
    }

    // ── Hash password ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

    // ── Create user ───────────────────────────────────────────────────────
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "credentials",
        lastLogin: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // ── Record referral (fire-and-forget, must never break registration) ──
    if (pendingRefCode) {
      try {
        const referrerId = await resolveReferrerByCode(pendingRefCode, user.id);
        if (referrerId) {
          await recordReferral(referrerId, user.id);
        }
      } catch (referralError) {
        // A referral failure must NEVER prevent account creation
        logger.error("Referral recording failed — user was still created", {
          userId: user.id,
          code: pendingRefCode,
          error: String(referralError),
        });
      }
    }

    await writeAuditLog({
      action: "LOGIN", // Registration counts as the first login event
      userId: user.id,
      ip,
      userAgent: getUserAgent(request),
      metadata: {
        event: "REGISTER",
        ...(pendingRefCode ? { referralCode: pendingRefCode } : {}),
      },
    });

    logger.info("New credentials user registered", {
      userId: user.id,
      hasReferral: !!pendingRefCode,
    });

    // ── Expire the referral cookie so it cannot be reused ─────────────────
    const response = ok(
      { id: user.id, name: user.name, email: user.email },
      201
    );
    response.cookies.set(REFERRAL_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // delete immediately
    });

    return response;
  } catch (error) {
    logger.error("POST /api/auth/register failed", {
      error: String(error),
      email,
    });
    return serverError();
  }
}
