/**
 * app/admin/page.tsx
 * Admin dashboard — real stats from DB, no dummy data.
 */

import { requireAdmin } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard | Goplay" };

// Re-validate every 60 seconds
export const revalidate = 60;

export default async function AdminDashboardPage() {
  await requireAdmin();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeUsers,
    todayLogins,
    totalDownloads,
    recentUsers,
    recentContacts,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.auditLog.count({
      where: { action: "LOGIN", createdAt: { gte: todayStart } },
    }),
    prisma.downloadStats.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true, name: true, email: true,
        image: true, role: true, isActive: true, createdAt: true,
      },
    }),
    prisma.contactMessage.count({ where: { status: "PENDING" } }),
  ]);

  const stats = [
    { label: "Total Users",      value: totalUsers,      color: "#4ade80", icon: "👥" },
    { label: "Active Users",     value: activeUsers,     color: "#60a5fa", icon: "✅" },
    { label: "Today's Logins",   value: todayLogins,     color: "#facc15", icon: "🔐" },
    { label: "Total Downloads",  value: totalDownloads,  color: "#f97316", icon: "📥" },
    { label: "Pending Messages", value: recentContacts,  color: "#c084fc", icon: "✉️" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Admin Dashboard</h1>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 40 }}>
        Real-time overview — updates every 60 seconds
      </p>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
        {stats.map(({ label, value, color, icon }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: "22px 20px",
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }} aria-hidden="true">{icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color, marginBottom: 4, lineHeight: 1 }}>
              {value.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        overflow: "hidden",
      }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>Recent Users</h2>
          <Link href="/admin/users" style={{ fontSize: 13, color: "#ff5b16", textDecoration: "none", fontWeight: 600 }}>
            View all →
          </Link>
        </div>

        <div role="table" aria-label="Recent users">
          {/* Header */}
          <div role="row" style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
            padding: "10px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            fontSize: 11,
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}>
            <span role="columnheader">Name</span>
            <span role="columnheader">Email</span>
            <span role="columnheader">Role</span>
            <span role="columnheader">Status</span>
            <span role="columnheader">Joined</span>
          </div>

          {recentUsers.map((u) => {
            const initials = u.name
              ? u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
              : u.email[0].toUpperCase();

            return (
              <div
                key={u.id}
                role="row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                  padding: "14px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <div role="cell" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {u.image ? (
                    <Image src={u.image} alt={u.name ?? "avatar"} width={30} height={30} style={{ borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#ff5b16", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {initials}
                    </div>
                  )}
                  <span style={{ color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.name ?? "—"}
                  </span>
                </div>
                <div role="cell" style={{ color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {u.email}
                </div>
                <div role="cell">
                  <span style={{
                    padding: "2px 8px",
                    background: u.role === "ADMIN" ? "rgba(255,91,22,0.2)" : "rgba(255,255,255,0.07)",
                    border: `1px solid ${u.role === "ADMIN" ? "rgba(255,91,22,0.3)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    color: u.role === "ADMIN" ? "#ff5b16" : "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}>
                    {u.role}
                  </span>
                </div>
                <div role="cell">
                  <span style={{
                    padding: "2px 8px",
                    background: u.isActive ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                    border: `1px solid ${u.isActive ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 700,
                    color: u.isActive ? "#4ade80" : "#f87171",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div role="cell" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                  {new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            );
          })}

          {recentUsers.length === 0 && (
            <div style={{ padding: "32px 24px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              No users yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
