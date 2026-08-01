/**
 * PATCH  /api/admin/user/[id]  — update role, isActive, name
 * DELETE /api/admin/user/[id]  — soft-delete (set isActive = false)
 * Requires: ADMIN role.
 */

import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { rateLimit, adminLimiter } from "@/lib/rate-limit";
import { getClientIp, writeAuditLog, getUserAgent } from "@/lib/audit";
import { adminUpdateUserSchema, cuidSchema } from "@/lib/validators";
import {
  ok,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  tooManyRequests,
  validationError,
  badRequest,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

type Params = { params: Promise<{ id: string }> };

// ─── PATCH ────────────────────────────────────────────────────────────────────

export async function PATCH(request: NextRequest, { params }: Params) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, adminLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  // Validate route param
  const { id } = await params;
  const idParsed = cuidSchema.safeParse(id);
  if (!idParsed.success) return badRequest("Invalid user ID");

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError("Invalid JSON body");
  }

  const parsed = adminUpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { name, role, isActive } = parsed.data;

  if (name === undefined && role === undefined && isActive === undefined) {
    return validationError("Nothing to update");
  }

  // Prevent admins from stripping their own ADMIN role
  if (id === currentUser.id && role && role !== "ADMIN") {
    return badRequest("You cannot remove your own admin role");
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });
    if (!target) return notFound("User");

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
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
        emailVerified: true,
      },
    });

    const action = role && role !== target.role ? "ROLE_CHANGE" : "UPDATE_USER";
    await writeAuditLog({
      action,
      userId: currentUser.id,
      ip,
      userAgent: getUserAgent(request),
      metadata: {
        targetUserId: id,
        ...(role ? { newRole: role, oldRole: target.role } : {}),
      },
    });

    return ok(updated);
  } catch (error) {
    logger.error("PATCH /api/admin/user/[id] failed", { error: String(error) });
    return serverError();
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(request: NextRequest, { params }: Params) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, adminLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  const currentUser = await getCurrentUser();
  if (!currentUser) return unauthorized();
  if (currentUser.role !== "ADMIN") return forbidden();

  const { id } = await params;
  const idParsed = cuidSchema.safeParse(id);
  if (!idParsed.success) return badRequest("Invalid user ID");

  // Prevent self-deletion
  if (id === currentUser.id) {
    return badRequest("You cannot delete your own account");
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!target) return notFound("User");

    // Soft-delete: deactivate rather than cascade-delete
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    await writeAuditLog({
      action: "DELETE_USER",
      userId: currentUser.id,
      ip,
      userAgent: getUserAgent(request),
      metadata: { targetUserId: id },
    });

    return ok({ id, deleted: true });
  } catch (error) {
    logger.error("DELETE /api/admin/user/[id] failed", { error: String(error) });
    return serverError();
  }
}
