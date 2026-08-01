/**
 * GET /api/download
 * Records a download event and returns the download URL from env.
 * Works for both authenticated and anonymous users.
 */

import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { rateLimit, downloadLimiter } from "@/lib/rate-limit";
import { getClientIp, writeAuditLog } from "@/lib/audit";
import { downloadQuerySchema } from "@/lib/validators";
import {
  ok,
  serverError,
  tooManyRequests,
  validationError,
  err,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Rate limit — apply to all, by IP
  const ip = getClientIp(request);
  const rl = rateLimit(ip, downloadLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  // Validate query params
  const { searchParams } = new URL(request.url);
  const parsed = downloadQuerySchema.safeParse({
    source: searchParams.get("source") ?? "web",
  });
  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? "Invalid params");
  }

  const { source } = parsed.data;

  // Get download URL from env — never hardcoded
  const downloadUrl = process.env.DOWNLOAD_LINK;
  if (!downloadUrl || downloadUrl === "/") {
    logger.warn("DOWNLOAD_LINK env variable is not configured");
    return err("DOWNLOAD_NOT_CONFIGURED", "Download link is not configured", 503);
  }

  // Get optional auth (download is available to all)
  const currentUser = await getCurrentUser().catch(() => null);

  try {
    // Record the download stat
    await prisma.downloadStats.create({
      data: {
        source,
        ip,
        userId: currentUser?.id ?? null,
      },
    });

    // Audit log
    await writeAuditLog({
      action: "DOWNLOAD",
      userId: currentUser?.id ?? null,
      ip,
      metadata: { source },
    });

    return ok({ url: downloadUrl, source });
  } catch (error) {
    logger.error("GET /api/download failed", { error: String(error) });
    return serverError();
  }
}
