/**
 * lib/audit.ts
 * Centralized audit log writer.
 * Fire-and-forget — never throws, so a logging failure never breaks the request.
 */

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import type { AuditAction, AuditMeta } from "@/types";

interface AuditOptions {
  action: AuditAction;
  userId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: AuditMeta;
}

export async function writeAuditLog(options: AuditOptions): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: options.action,
        userId: options.userId ?? null,
        ip: options.ip ?? null,
        userAgent: options.userAgent ?? null,
        metadata: options.metadata ?? {},
      },
    });
  } catch (error) {
    // Audit log failure must never crash the application
    logger.error("Failed to write audit log", {
      action: options.action,
      userId: options.userId,
      error: String(error),
    });
  }
}

/**
 * Extract client IP from a Next.js Request object.
 * Checks common proxy headers before falling back to socket remoteAddress.
 */
export function getClientIp(request: Request): string {
  const headers = [
    "x-real-ip",
    "x-forwarded-for",
    "cf-connecting-ip",
    "x-client-ip",
  ] as const;

  for (const header of headers) {
    const value = (request.headers as Headers).get(header);
    if (value) {
      // x-forwarded-for may contain a comma-separated list; take the first
      return value.split(",")[0].trim();
    }
  }

  return "unknown";
}

/**
 * Extract User-Agent string from request headers.
 */
export function getUserAgent(request: Request): string {
  return (request.headers as Headers).get("user-agent") ?? "unknown";
}
