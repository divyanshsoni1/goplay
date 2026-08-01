/**
 * lib/api-response.ts
 * Standardised JSON response helpers.
 * All API routes use these to ensure consistent shape.
 */

import { NextResponse } from "next/server";
import type { ApiError, ApiSuccess } from "@/types";

// ─── Success ──────────────────────────────────────────────────────────────────

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

// ─── Error ────────────────────────────────────────────────────────────────────

export function err(
  code: string,
  message: string,
  status: number
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}

// ─── Convenience shorthands ───────────────────────────────────────────────────

export const unauthorized = () =>
  err("UNAUTHORIZED", "Authentication required", 401);

export const forbidden = () =>
  err("FORBIDDEN", "You do not have permission to access this resource", 403);

export const notFound = (resource = "Resource") =>
  err("NOT_FOUND", `${resource} not found`, 404);

export const badRequest = (message: string) =>
  err("BAD_REQUEST", message, 400);

export const tooManyRequests = (retryAfterMs: number) =>
  NextResponse.json(
    {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please slow down.",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
        "X-RateLimit-Reset": String(retryAfterMs),
      },
    }
  );

export const serverError = (message = "An unexpected error occurred") =>
  err("INTERNAL_SERVER_ERROR", message, 500);

export const validationError = (message: string) =>
  err("VALIDATION_ERROR", message, 422);
