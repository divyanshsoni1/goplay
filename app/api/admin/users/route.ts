/**
 * GET /api/admin/users
 * Lists all users with optional filtering and pagination.
 * Requires: ADMIN role.
 */

import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { rateLimit, adminLimiter } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/audit";
import { adminListUsersSchema } from "@/lib/validators";
import {
  ok,
  unauthorized,
  forbidden,
  serverError,
  tooManyRequests,
  validationError,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";
import type { PaginatedData, SafeUser } from "@/types";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  // Rate limit
  const ip = getClientIp(request);
  const rl = rateLimit(ip, adminLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  // Auth + RBAC
  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  // Parse + validate query params
  const { searchParams } = new URL(request.url);
  const raw = {
    page: searchParams.get("page") ?? "1",
    pageSize: searchParams.get("pageSize") ?? "20",
    role: searchParams.get("role") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    isActive: searchParams.get("isActive") ?? undefined,
  };

  const parsed = adminListUsersSchema.safeParse(raw);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Invalid query");
  }

  const { page, pageSize, role, search, isActive } = parsed.data;
  const skip = (page - 1) * pageSize;

  // Build where clause
  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  try {
    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
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
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    const payload: PaginatedData<SafeUser> = {
      items: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    return ok(payload);
  } catch (error) {
    logger.error("GET /api/admin/users failed", { error: String(error) });
    return serverError();
  }
}
