/**
 * GET  /api/profile  — returns current user's profile
 * PATCH /api/profile  — updates name and/or image
 * Requires: authenticated session.
 */

import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { rateLimit, apiLimiter } from "@/lib/rate-limit";
import { getClientIp, writeAuditLog } from "@/lib/audit";
import { updateProfileSchema } from "@/lib/validators";
import {
  ok,
  unauthorized,
  notFound,
  serverError,
  tooManyRequests,
  validationError,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, apiLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();

  try {
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return notFound("Profile");
    return ok(user);
  } catch (error) {
    logger.error("GET /api/profile failed", { error: String(error) });
    return serverError();
  }
}

// ─── PATCH ────────────────────────────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, apiLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();

  // Parse body safely
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError("Invalid JSON body");
  }

  // Validate
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { name, image } = parsed.data;

  // Nothing to update
  if (name === undefined && image === undefined) {
    return validationError("Nothing to update");
  }

  try {
    const updated = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(image !== undefined ? { image: image || null } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await writeAuditLog({
      action: "UPDATE_USER",
      userId: currentUser.id,
      ip,
      metadata: { fields: Object.keys(parsed.data).join(",") },
    });

    return ok(updated);
  } catch (error) {
    logger.error("PATCH /api/profile failed", { error: String(error) });
    return serverError();
  }
}
