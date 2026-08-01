/**
 * POST /api/auth/forgot-password
 * Generates a password-reset token and stores its bcrypt hash in the DB.
 *
 * Security:
 *  - Always returns 200 (never reveals whether an email exists)
 *  - Token is a 48-byte cryptographically random hex string
 *  - Only the hash is stored; the raw token is returned for the email link
 *  - Token expires in 15 minutes
 *  - Rate limited (authLimiter: 10 req/min per IP)
 *
 * In production wire this up to your email provider (Resend, SendGrid, etc.)
 * The token/link is returned in the response body for development convenience
 * and must be removed / replaced with an email send before going live.
 */

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { rateLimit, authLimiter } from "@/lib/rate-limit";
import { getClientIp, writeAuditLog } from "@/lib/audit";
import { forgotPasswordSchema } from "@/lib/validators";
import { ok, validationError, serverError, tooManyRequests } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

const TOKEN_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes
const BCRYPT_COST = 10; // Lower cost for tokens — they're already random

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

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { email } = parsed.data;

  // Always respond 200 — never expose whether the email exists
  const genericResponse = ok({
    message:
      "If an account with that email exists, you will receive a password reset link shortly.",
  });

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, provider: true },
    });

    // No user found, or Google-only user (no password set) — return generic ok
    if (!user || !user.password) {
      return genericResponse;
    }

    // ── Generate token ────────────────────────────────────────────────────
    const rawToken = randomBytes(48).toString("hex"); // 96 hex chars
    const hashedToken = await bcrypt.hash(rawToken, BCRYPT_COST);
    const expires = new Date(Date.now() + TOKEN_EXPIRY_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: expires,
      },
    });

    await writeAuditLog({
      action: "LOGIN", // Closest available action; extend AuditAction if desired
      userId: user.id,
      ip,
      metadata: { event: "PASSWORD_RESET_REQUESTED" },
    });

    logger.info("Password reset token generated", { userId: user.id });

    // ── TODO: Send email ──────────────────────────────────────────────────
    // Replace the block below with your email provider call, e.g.:
    //   await sendPasswordResetEmail({ to: email, token: rawToken });
    //
    // The reset link format:
    const resetLink = `${process.env.NEXTAUTH_URL ?? ""}/reset-password?token=${rawToken}`;
    logger.info("Reset link (dev only — remove before production)", {
      resetLink,
    });

    // In production: return the generic response only (no token in body)
    if (process.env.NODE_ENV === "production") {
      return genericResponse;
    }

    // Development: return token so it can be tested without an email provider
    return ok({
      message: "Password reset link generated (dev mode).",
      resetLink,
    });
  } catch (error) {
    logger.error("POST /api/auth/forgot-password failed", {
      error: String(error),
    });
    return serverError();
  }
}
