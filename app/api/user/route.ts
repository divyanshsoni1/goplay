/**
 * GET /api/user
 * Returns the current authenticated user's full profile from DB.
 * Requires: authenticated session.
 */

import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { rateLimit, apiLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/audit";
import {
  ok,
  unauthorized,
  notFound,
  serverError,
  tooManyRequests,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Rate limit
  const ip = getClientIp(request);
  const rl = rateLimit(ip, apiLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  // Auth
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

    if (!user) return notFound("User");

    return ok(user);
  } catch (error) {
    logger.error("GET /api/user failed", { error: String(error), userId: currentUser.id });
    return serverError();
  }
}
