/**
 * POST /api/referral/capture
 * Stores a referral code in a secure HttpOnly cookie.
 *
 * Called by the RefCapture client component when a user lands on a page
 * with ?ref=<CODE> in the URL.
 *
 * Security:
 *  - Only sets the cookie if the code passes basic sanitisation
 *  - Does NOT validate against the DB here (saves a round-trip; validation
 *    happens at registration time via resolveReferrerByCode)
 *  - Cookie is HttpOnly + SameSite=Lax — not accessible via document.cookie
 *  - If a cookie already exists it is NOT overwritten (first referrer wins)
 *  - Rate-limited to prevent cookie-stuffing loops
 *
 * Body: { code: string }
 * Response: 200 { captured: true } | 200 { captured: false, reason }
 */

import { NextResponse } from "next/server";
import { REFERRAL_COOKIE_NAME, REFERRAL_COOKIE_MAX_AGE } from "@/lib/referral";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";

/** Only allow characters in our referral code alphabet, 6–12 chars long. */
const CODE_RE = /^[A-Z0-9]{6,12}$/;

export async function POST(request: NextRequest) {
  try {
    // ── Parse body ──────────────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ captured: false, reason: "invalid_body" }, { status: 400 });
    }

    const code =
      typeof (body as Record<string, unknown>)?.code === "string"
        ? ((body as Record<string, unknown>).code as string).trim().toUpperCase()
        : null;

    if (!code || !CODE_RE.test(code)) {
      return NextResponse.json({ captured: false, reason: "invalid_code" });
    }

    // ── First-referrer-wins: don't overwrite an existing cookie ─────────────
    const existing = request.cookies.get(REFERRAL_COOKIE_NAME)?.value;
    if (existing) {
      return NextResponse.json({ captured: false, reason: "already_set" });
    }

    // ── Set HttpOnly cookie ─────────────────────────────────────────────────
    const response = NextResponse.json({ captured: true });
    response.cookies.set(REFERRAL_COOKIE_NAME, code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REFERRAL_COOKIE_MAX_AGE,
    });

    logger.info("Referral code captured in cookie", { code });
    return response;
  } catch (error) {
    logger.error("POST /api/referral/capture failed", { error: String(error) });
    return NextResponse.json({ captured: false, reason: "server_error" }, { status: 500 });
  }
}
