/**
 * app/admin/layout.tsx
 * Admin-only layout — requireAdmin() redirects to /login or /403.
 */

import { requireAdmin } from "@/lib/auth/utils";
import { auth } from "@/auth";
import Link from "next/link";
import { UserNav } from "@/components/auth/UserNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Goplay",
  robots: { index: false, follow: false },
};

const adminLinks: [string, string][] = [
  ["Dashboard", "/admin"],
  ["Users",     "/admin/users"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const session = await auth();

  return (
    <div style={{ minHeight: "100vh", background: "#060616", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header role="banner" style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(6,6,22,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,91,22,0.15)",
        padding: "0 24px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link href="/" aria-label="Goplay — home" style={{ fontSize: 20, fontWeight: 800, color: "#fff", textDecoration: "none" }}>
            Goplay
          </Link>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", background: "rgba(255,91,22,0.2)", border: "1px solid rgba(255,91,22,0.4)", borderRadius: 6, color: "#ff5b16", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Admin
          </span>
        </div>
        <nav aria-label="Admin navigation" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {adminLinks.map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
          {session && <UserNav session={session} />}
        </nav>
      </header>

      <main id="main-content" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
