/**
 * lib/auth/utils.ts
 * Server-side auth helpers.
 * Use these in Server Components, Route Handlers, and Server Actions.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/types";
import type { Role } from "@prisma/client";

// ─── Get current session ──────────────────────────────────────────────────────

/**
 * Returns the current session, or null if unauthenticated.
 * Safe to call in Server Components — no throws.
 */
export async function getSession() {
  return auth();
}

/**
 * Returns the authenticated user, or null if the session is missing/invalid.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.email) return null;

  return {
    id: session.user.id as string,
    name: session.user.name ?? null,
    email: session.user.email,
    image: session.user.image ?? null,
    role: (session.user as { role: Role }).role ?? "USER",
  };
}

// ─── Guards ───────────────────────────────────────────────────────────────────

/**
 * Asserts the user is authenticated.
 * Redirects to /login if not.
 * Use in Server Components / Route Handlers that require a session.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Asserts the user is authenticated AND has the ADMIN role.
 * Redirects to /403 if authenticated but not admin.
 * Redirects to /login if unauthenticated.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/403");
  return user;
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

export function isAdmin(role: Role | undefined | null): boolean {
  return role === "ADMIN";
}

export function hasRole(
  userRole: Role | undefined | null,
  required: Role
): boolean {
  if (required === "USER") return !!userRole;
  if (required === "ADMIN") return userRole === "ADMIN";
  return false;
}
