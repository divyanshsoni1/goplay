/**
 * GET /api/referral
 * Returns the authenticated user's referral info:
 *   - referralCode  (created on first call if not yet set)
 *   - referralCount (number of successful referrals)
 *   - referralUrl   (full share URL, built from NEXTAUTH_URL or request origin)
 *
 * Authentication: required (401 if missing)
 * No sensitive data is leaked — only the requesting user's own referral data.
 */

import { auth } from "@/auth";
import { getOrCreateReferralCode } from "@/lib/referral";
import { ok, unauthorized, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const userId = session.user.id;

  try {
    // ── Ensure referral code exists (idempotent) ───────────────────────────
    const referralCode = await getOrCreateReferralCode(userId);

    // ── Fetch current referral count ──────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCount: true },
    });

    // ── Build referral URL ────────────────────────────────────────────────
    // Prefer NEXTAUTH_URL (set in production env) — fall back to request origin
    const baseUrl =
      process.env.NEXTAUTH_URL?.replace(/\/$/, "") ??
      request.nextUrl.origin;

    const referralUrl = `${baseUrl}/?ref=${referralCode}`;

    return ok({
      referralCode,
      referralCount: user?.referralCount ?? 0,
      referralUrl,
    });
  } catch (error) {
    logger.error("GET /api/referral failed", {
      userId,
      error: String(error),
    });
    return serverError();
  }
}
