/**
 * proxy.ts  (project root)
 * Next.js 16 renamed "middleware.ts" to "proxy.ts".
 * This file is the successor to middleware.ts — identical logic, new name.
 *
 * Responsibilities:
 *  1. Enforce authentication on protected routes (/dashboard, /admin)
 *  2. Enforce ADMIN role on /admin/* — redirect non-admins to /403
 *  3. Redirect already-authenticated users away from /login and /register
 *  4. Apply security headers on every response
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

// ─── Route constants ──────────────────────────────────────────────────────────

const ADMIN_PREFIX = "/admin";
const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const AUTH_PAGES = ["/login", "/register"];

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// ─── Security headers ─────────────────────────────────────────────────────────

function applySecurityHeaders(response: NextResponse): NextResponse {
  const h = response.headers;

  h.set("X-Frame-Options", "DENY");
  h.set("X-Content-Type-Options", "nosniff");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
  );

  if (process.env.NODE_ENV === "production") {
    h.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  h.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://accounts.google.com https://*.neon.tech",
      "frame-src https://accounts.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  h.delete("X-Powered-By");
  return response;
}

// ─── Proxy handler ────────────────────────────────────────────────────────────

export default auth(function proxy(req: NextAuthRequest) {
  const pathname = req.nextUrl.pathname;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  // 1. Redirect authenticated users away from auth pages
  if (isLoggedIn && startsWithAny(pathname, AUTH_PAGES)) {
    const dest = userRole === "ADMIN" ? "/admin" : "/dashboard";
    return applySecurityHeaders(
      NextResponse.redirect(new URL(dest, req.url))
    );
  }

  // 2. Require authentication for protected routes
  if (!isLoggedIn && startsWithAny(pathname, PROTECTED_PREFIXES)) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // 3. Require ADMIN role for /admin/*
  if (isLoggedIn && pathname.startsWith(ADMIN_PREFIX) && userRole !== "ADMIN") {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/403", req.url))
    );
  }

  // 4. Apply security headers to all other responses
  return applySecurityHeaders(NextResponse.next());
} as Parameters<typeof auth>[0]);

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
