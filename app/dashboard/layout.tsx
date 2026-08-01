/**
 * app/dashboard/layout.tsx
 * Protected layout — requireAuth() redirects to /login if unauthenticated.
 * Renders a minimal topbar with UserNav; no public Header/Footer.
 */

import { requireAuth } from "@/lib/auth/utils";
import { auth } from "@/auth";
import Link from "next/link";
import { UserNav } from "@/components/auth/UserNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Goplay",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Will redirect to /login if not authenticated
  await requireAuth();
  const session = await auth();

  return (
    <div style={{ minHeight: "100vh", background: "#070720", color: "#fff" }}>
      {/* Top bar */}
      <header
        role="banner"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(7,7,32,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          aria-label="Goplay — home"
          style={{ fontSize: 20, fontWeight: 800, color: "#fff", textDecoration: "none" }}
        >
          Goplay
        </Link>
        <nav aria-label="Dashboard navigation" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/dashboard" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
            Dashboard
          </Link>
          {session && <UserNav session={session} />}
        </nav>
      </header>

      <main id="main-content">
        {children}
      </main>
    </div>
  );
}
