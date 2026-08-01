/**
 * app/dashboard/page.tsx
 * User dashboard — displays profile info, download button, and referral section.
 * Server Component — fetches user from DB for freshness.
 */

import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ReferralCard } from "@/components/referral/ReferralCard";
import { ReferralHistory } from "@/components/referral/ReferralHistory";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard | Goplay",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const currentUser = await requireAuth();

  // Fetch fresh data from DB
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      lastLogin: true,
      _count: { select: { downloadStats: true } },
    },
  });

  const downloadUrl = process.env.DOWNLOAD_LINK ?? "/";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const lastLoginDate = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "First login";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: "#fff" }}>
        Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 40 }}>
        Manage your account and download the Goplay app
      </p>

      {/* ── Profile card ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "28px 28px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {/* Avatar */}
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User avatar"}
            width={72}
            height={72}
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(255,91,22,0.4)",
            }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff5b16, #e04a0e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 800,
              color: "#fff",
              border: "3px solid rgba(255,91,22,0.4)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}

        {/* Info */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}
          >
            {user?.name ?? "Goplay User"}
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
            }}
          >
            {user?.email}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "2px 10px",
                background:
                  user?.role === "ADMIN"
                    ? "rgba(255,91,22,0.2)"
                    : "rgba(255,255,255,0.08)",
                border: `1px solid ${
                  user?.role === "ADMIN"
                    ? "rgba(255,91,22,0.4)"
                    : "rgba(255,255,255,0.12)"
                }`,
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                color:
                  user?.role === "ADMIN"
                    ? "#ff5b16"
                    : "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {user?.role ?? "USER"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          { label: "Member since", value: joinedDate },
          { label: "Last login", value: lastLoginDate },
          { label: "Downloads", value: String(user?._count.downloadStats ?? 0) },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "18px 20px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 8,
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Referral Card ──────────────────────────────────────────────────── */}
      {/*
        Client component — fetches referral data on mount.
        Displays referral link, copy button, share button, and referral count.
      */}
      <ReferralCard />

      {/* ── Referral History ───────────────────────────────────────────────── */}
      {/*
        Client component — fetches paginated referral history on mount.
        Shows name, joined date, and status for each referred user.
      */}
      <ReferralHistory />

      {/* ── Download button ────────────────────────────────────────────────── */}
      <div
        style={{
          background: "rgba(255,91,22,0.08)",
          border: "1px solid rgba(255,91,22,0.25)",
          borderRadius: 16,
          padding: "28px 28px",
          marginBottom: 24,
        }}
      >
        <h2
          style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}
        >
          Download Goplay
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 20,
            lineHeight: 1.6,
          }}
        >
          Get the latest version of the Goplay app. Compatible with Android devices.
        </p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download the Goplay app"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 28px",
            background: "#ff5b16",
            color: "#fff",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download App
        </a>
      </div>

      {/* ── Admin shortcut ─────────────────────────────────────────────────── */}
      {user?.role === "ADMIN" && (
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
            You have admin access
          </span>
          <Link
            href="/admin"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ff5b16",
              textDecoration: "none",
            }}
          >
            Open Admin Panel →
          </Link>
        </div>
      )}
    </div>
  );
}
