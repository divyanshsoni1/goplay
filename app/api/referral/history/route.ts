/**
 * GET /api/referral/history
 * Returns a paginated list of users referred by the authenticated user.
 *
 * Query params:
 *   page     (default 1)
 *   pageSize (default 10, max 50)
 *
 * Response shape per item:
 *   id        — referred user's id (for React key only, not displayed)
 *   name      — referred user's display name (or "Anonymous" if null)
 *   joinedAt  — ISO date string of when they registered
 *   status    — always "Successful" (only rows where referral completed exist)
 *
 * Authentication: required (401 if missing)
 * Privacy: only name + joinedAt exposed — no email or other PII.
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ok, unauthorized, serverError } from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) return unauthorized();

  const userId = session.user.id;

  // ── Pagination params ─────────────────────────────────────────────────────
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const skip = (page - 1) * pageSize;

  try {
    // ── Fetch referral rows for this sender ────────────────────────────────
    const [referrals, total] = await prisma.$transaction([
      prisma.referral.findMany({
        where: { senderId: userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          createdAt: true,
          receiver: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.referral.count({ where: { senderId: userId } }),
    ]);

    const items = referrals.map((r) => ({
      id: r.id,
      name: r.receiver.name ?? "Anonymous",
      joinedAt: r.createdAt.toISOString(),
      status: "Successful" as const,
    }));

    return ok({
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    logger.error("GET /api/referral/history failed", {
      userId,
      error: String(error),
    });
    return serverError();
  }
}
