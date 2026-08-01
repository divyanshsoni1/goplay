/**
 * POST /api/contact
 * Accepts contact form submissions and stores them in the database.
 * Rate-limited, Zod-validated, fully logged.
 */

import { prisma } from "@/lib/prisma";
import { rateLimit, contactLimiter } from "@/lib/rate-limit";
import { getClientIp, getUserAgent, writeAuditLog } from "@/lib/audit";
import { contactSchema } from "@/lib/validators";
import {
  ok,
  serverError,
  tooManyRequests,
  validationError,
} from "@/lib/api-response";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // Rate limit — 5 per 10 minutes per IP
  const ip = getClientIp(request);
  const rl = rateLimit(ip, contactLimiter);
  if (!rl.allowed) return tooManyRequests(rl.resetAt - Date.now());

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError("Invalid JSON body");
  }

  // Validate
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return validationError(
      firstError ? `${firstError.path.join(".")}: ${firstError.message}` : "Invalid input"
    );
  }

  const { name, email, subject, message } = parsed.data;

  try {
    const record = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        ip,
        userAgent: getUserAgent(request),
        status: "PENDING",
      },
      select: { id: true, createdAt: true },
    });

    await writeAuditLog({
      action: "CONTACT_SUBMIT",
      ip,
      metadata: { email, contactId: record.id },
    });

    logger.info("Contact form submitted", { id: record.id, email });

    return ok({ id: record.id, submitted: true }, 201);
  } catch (error) {
    logger.error("POST /api/contact failed", { error: String(error) });
    return serverError();
  }
}
