"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: Record<string, { title: string; description: string }> = {
  OAuthSignin:        { title: "Sign-in failed",         description: "Could not initiate Google sign-in. Please try again." },
  OAuthCallback:      { title: "Sign-in cancelled",      description: "Google sign-in was cancelled or failed. Please try again." },
  OAuthCreateAccount: { title: "Account creation failed", description: "We couldn't create your account. Please try again." },
  EmailCreateAccount: { title: "Account creation failed", description: "We couldn't create your account. Please try again." },
  OAuthAccountNotLinked: { title: "Account conflict",    description: "This email is already linked to a different sign-in method." },
  AccountInactive:    { title: "Account deactivated",    description: "Your account has been deactivated. Please contact support." },
  AccessDenied:       { title: "Access denied",          description: "You do not have permission to access this resource." },
  Verification:       { title: "Link expired",           description: "Your verification link has expired. Please sign in again." },
  Default:            { title: "Something went wrong",   description: "An unexpected error occurred. Please try again." },
};

function AuthErrorInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("error") ?? "Default";
  const { title, description } = errorMessages[code] ?? errorMessages.Default;

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)" }}
    >
      <div
        role="alert"
        aria-live="assertive"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(220,38,38,0.3)",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }} aria-hidden="true">⚠️</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{title}</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 32 }}>
          {description}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link
            href="/login"
            style={{
              display: "block",
              padding: "12px 20px",
              background: "#ff5b16",
              color: "#fff",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Try again
          </Link>
          <Link
            href="/"
            style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)" }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Loading…</div>
      </div>
    }>
      <AuthErrorInner />
    </Suspense>
  );
}
