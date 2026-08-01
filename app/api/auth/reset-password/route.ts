/**
 * POST /api/auth/reset-password
 * Validates a password-reset token, hashes the new password, updates the user,
 * and invalidates the token.
 *
 * Security:
 *  - Constant-time bcrypt comparison prevents timing attacks
 *  - Token is single-use (cleared after successful reset)
 *  - Token expires after 15 minutes
 *  - Rate limited (authLimiter: 10 req/min per IP)
 *  - Generic error messages — never reveals token validity details
 */

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, authLimiter } from "@/lib/rate-limit";
import { getClientIp, writeAuditLog } from "@/lib/audit";
import { resetPasswordSchema } from "@/lib/validators";
import {
  ok,
  validationError,
  serverError,
  tooManyRequests,
  err,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

const BCRYPT_COST = 12;

export async function POST(request: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = rateLimit(ip, authLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  // ── Parse & validate ──────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError("Invalid JSON body");
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { token, password } = parsed.data;

  const invalidTokenResponse = err(
    "INVALID_TOKEN",
    "This password reset link is invalid or has expired. Please request a new one.",
    400
  );

  try {
    // ── Find users with a pending reset token ─────────────────────────────
    // We can't query by the raw token (only the hash is stored), so we fetch
    // all non-expired candidates and compare with bcrypt. In practice there
    // will be at most one; we add the expiry filter to keep the set small.
    const candidates = await prisma.user.findMany({
      where: {
        passwordResetToken: { not: null },
        passwordResetExpires: { gte: new Date() },
      },
      select: {
        id: true,
        passwordResetToken: true,
        passwordResetExpires: true,
      },
    });

    if (candidates.length === 0) return invalidTokenResponse;

    // ── Find matching candidate (constant-time per candidate) ─────────────
    let matchedUserId: string | null = null;
    for (const candidate of candidates) {
      if (!candidate.passwordResetToken) continue;
      const matches = await bcrypt.compare(token, candidate.passwordResetToken);
      if (matches) {
        matchedUserId = candidate.id;
        break;
      }
    }

    if (!matchedUserId) return invalidTokenResponse;

    // ── Hash new password & update user ───────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

    await prisma.user.update({
      where: { id: matchedUserId },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    await writeAuditLog({
      action: "UPDATE_USER",
      userId: matchedUserId,
      ip,
      metadata: { event: "PASSWORD_RESET_COMPLETED" },
    });

    logger.info("Password reset completed", { userId: matchedUserId });

    return ok({ message: "Your password has been reset. You can now sign in." });
  } catch (error) {
    logger.error("POST /api/auth/reset-password failed", {
      error: String(error),
    });
    return serverError();
  }
}
