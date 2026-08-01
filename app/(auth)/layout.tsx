/**
 * app/(auth)/layout.tsx
 * Shared layout for all auth pages: /login, /register, /auth/error
 * Minimal — no Header/Footer so the auth UI is the sole focus.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell" aria-label="Authentication">
      {children}
    </div>
  );
}
