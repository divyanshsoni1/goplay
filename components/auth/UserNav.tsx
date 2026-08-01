"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import type { Session } from "next-auth";

interface Props {
  session: Session;
}

export function UserNav({ session }: Props) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = session.user;
  const isAdmin = (user as { role?: string }).role === "ADMIN";

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`User menu for ${user?.name ?? user?.email}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 10,
          padding: "5px 10px",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "User avatar"}
            width={28}
            height={28}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#ff5b16", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff",
          }}>
            {initials}
          </div>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.name?.split(" ")[0] ?? "Account"}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="User menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 200,
            background: "#0d0d2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "8px 0",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 100,
          }}
        >
          {/* User info */}
          <div style={{ padding: "10px 14px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name ?? "User"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email}
            </div>
          </div>

          {/* Menu items */}
          <Link role="menuitem" href="/dashboard" onClick={() => setOpen(false)}
            style={{ display: "block", padding: "9px 14px", fontSize: 13, color: "rgba(255,255,255,0.8)", textDecoration: "none" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            Dashboard
          </Link>

          {isAdmin && (
            <Link role="menuitem" href="/admin" onClick={() => setOpen(false)}
              style={{ display: "block", padding: "9px 14px", fontSize: 13, color: "rgba(255,91,22,0.9)", textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
            >
              Admin Panel
            </Link>
          )}

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 4 }}>
            <button
              role="menuitem"
              onClick={async () => {
                setLoggingOut(true);
                setOpen(false);
                await signOut({ callbackUrl: "/" });
              }}
              disabled={loggingOut}
              style={{
                width: "100%",
                padding: "9px 14px",
                background: "transparent",
                border: "none",
                textAlign: "left",
                fontSize: 13,
                color: loggingOut ? "rgba(255,255,255,0.3)" : "#fca5a5",
                cursor: loggingOut ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => { if (!loggingOut) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
