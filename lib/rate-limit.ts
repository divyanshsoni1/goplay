/**
 * lib/rate-limit.ts
 * In-memory sliding-window rate limiter.
 *
 * Supports ≥5 req/s per IP by default (configurable per endpoint).
 *
 * Architecture note: This uses a Map stored in Node.js module memory.
 * In a multi-instance production deployment, swap `store` with a
 * Redis-backed implementation (e.g. ioredis + ZADD/ZREMRANGEBYSCORE)
 * without changing the public `rateLimit()` API.
 *
 * Cleanup runs automatically every 5 minutes to prevent unbounded growth.
 */

import type { RateLimitResult } from "@/types";

interface WindowEntry {
  timestamps: number[]; // sorted request timestamps (ms)
}

// ─── In-memory store ──────────────────────────────────────────────────────────
// Key: `${limiterId}:${identifier}` (e.g. "auth:1.2.3.4")
const store = new Map<string, WindowEntry>();

// Cleanup stale entries every 5 min
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        // Remove entries with no recent timestamps
        if (entry.timestamps.length === 0) {
          store.delete(key);
          continue;
        }
        // Keep only entries that have activity in the last 5 minutes
        const oldest = entry.timestamps[0];
        if (now - oldest > 5 * 60 * 1000) {
          store.delete(key);
        }
      }
    },
    5 * 60 * 1000
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface RateLimitOptions {
  /** Unique name for this limiter (e.g. "auth", "contact") */
  id: string;
  /** Maximum number of requests allowed within `windowMs` */
  limit: number;
  /** Sliding window duration in milliseconds */
  windowMs: number;
}

/**
 * Check and record a request for `identifier` (typically an IP address).
 * Returns whether the request is allowed plus remaining quota.
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { id, limit, windowMs } = options;
  const key = `${id}:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Evict timestamps outside the sliding window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= limit) {
    // Calculate when the oldest timestamp exits the window
    const resetAt = entry.timestamps[0] + windowMs;
    return { allowed: false, remaining: 0, resetAt };
  }

  // Record this request
  entry.timestamps.push(now);
  const remaining = limit - entry.timestamps.length;
  const resetAt = entry.timestamps[0] + windowMs;

  return { allowed: true, remaining, resetAt };
}

// ─── Pre-configured limiters ──────────────────────────────────────────────────

/** Auth endpoints: 10 requests per minute */
export const authLimiter: RateLimitOptions = {
  id: "auth",
  limit: 10,
  windowMs: 60_000,
};

/** Contact form: 5 requests per 10 minutes */
export const contactLimiter: RateLimitOptions = {
  id: "contact",
  limit: 5,
  windowMs: 10 * 60_000,
};

/** Download endpoint: 20 requests per minute */
export const downloadLimiter: RateLimitOptions = {
  id: "download",
  limit: 20,
  windowMs: 60_000,
};

/** General API: 60 requests per minute (≥5/s burst capacity) */
export const apiLimiter: RateLimitOptions = {
  id: "api",
  limit: 60,
  windowMs: 60_000,
};

/** Admin API: 30 requests per minute */
export const adminLimiter: RateLimitOptions = {
  id: "admin",
  limit: 30,
  windowMs: 60_000,
};
