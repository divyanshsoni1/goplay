"use client";

import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import type { Session } from "next-auth";

interface Props {
  session: Session | null;
  className?: string;
}

export function SignInButton({ session, className }: Props) {
  const [loading, setLoading] = useState(false);

  if (session?.user) {
    return (
      <button
        onClick={async () => {
          setLoading(true);
          await signOut({ callbackUrl: "/" });
        }}
        disabled={loading}
        aria-busy={loading}
        className={className}
        style={{
          padding: "8px 18px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: 8,
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        {loading ? "Signing out…" : "Sign out"}
      </button>
    );
  }

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await signIn("google", { callbackUrl: "/dashboard" });
      }}
      disabled={loading}
      aria-busy={loading}
      className={className}
      style={{
        padding: "8px 18px",
        background: "#ff5b16",
        border: "none",
        borderRadius: 8,
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.15s",
      }}
    >
      {loading ? "Loading…" : "Sign in"}
    </button>
  );
}
