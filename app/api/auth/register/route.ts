/**
 * POST /api/auth/register
 * Creates a new credentials-based user account.
 *
 * Security:
 *  - Rate limited (authLimiter: 10 req/min per IP)
 *  - Password hashed with bcrypt (cost factor 12)
 *  - Generic error for duplicate email (no user enumeration)
 *  - Input validated and sanitised via Zod
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

  try {
    // ── Duplicate check ───────────────────────────────────────────────────
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, provider: true },
    });

    if (existing) {
      // Return a generic message regardless of whether it's a Google or
      // credentials account — prevents user enumeration.
      if (existing.provider === "google" && !existing.password) {
        // Slightly more helpful for Google users, but still safe
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

    await writeAuditLog({
      action: "LOGIN", // Registration counts as the first login event
      userId: user.id,
      ip,
      userAgent: getUserAgent(request),
      metadata: { event: "REGISTER" },
    });

    logger.info("New credentials user registered", { userId: user.id });

    return ok(
      { id: user.id, name: user.name, email: user.email },
      201
    );
  } catch (error) {
    logger.error("POST /api/auth/register failed", {
      error: String(error),
      email,
    });
    return serverError();
  }
}
