/**
 * app/403/page.tsx
 * Forbidden page — shown when an authenticated non-admin accesses /admin.
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 Forbidden | Goplay",
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "48px 36px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "rgba(255,91,22,0.15)",
            lineHeight: 1,
            letterSpacing: "-4px",
            marginBottom: 16,
          }}
        >
          403
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 12,
          }}
        >
          Access Forbidden
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
            marginBottom: 36,
          }}
        >
          You don&apos;t have permission to view this page.
          <br />
          This area is restricted to administrators only.
        </p>

        <div
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "block",
              padding: "12px 24px",
              background: "#ff5b16",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
