/**
 * app/(auth)/login/page.tsx
 * Modern glassmorphism sign-in page.
 * Handles: loading, error, disabled, redirect-after-login states.
 */

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─── Google icon ─────────────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/* ─── Inner component (uses useSearchParams — must be inside Suspense) ─────── */
function LoginInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Surface NextAuth error codes as readable messages
  const authError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const errorMessages: Record<string, string> = {
    OAuthSignin: "Could not initiate Google sign-in. Please try again.",
    OAuthCallback: "Google sign-in was cancelled or failed.",
    OAuthCreateAccount: "Could not create your account. Please try again.",
    EmailCreateAccount: "Could not create your account. Please try again.",
    Callback: "Something went wrong during sign-in. Please try again.",
    OAuthAccountNotLinked:
      "This email is already linked to a different sign-in method.",
    AccountInactive: "Your account has been deactivated. Contact support.",
    AccessDenied: "Access denied. You do not have permission to sign in.",
    Verification: "Your verification link has expired. Please sign in again.",
    Default: "An unexpected error occurred. Please try again.",
  };

  const handleGoogleSignIn = useCallback(async () => {
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await signIn("google", { callbackUrl, redirect: true });
    } catch {
      setStatus("error");
      setErrorMsg("Sign-in failed. Please try again.");
    }
  }, [status, callbackUrl]);

  const displayError =
    errorMsg ||
    (authError
      ? (errorMessages[authError] ?? errorMessages.Default)
      : null);

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,91,22,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,6,102,0.4) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Card */}
      <div
        role="region"
        aria-label="Sign in"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link
            href="/"
            aria-label="Goplay — home"
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "#fff",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Goplay
          </Link>
          <p
            style={{
              marginTop: 8,
              fontSize: 14,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.5,
            }}
          >
            Sign in to access your dashboard and download the app
          </p>
        </div>

        {/* Error banner */}
        {displayError && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              marginBottom: 20,
              padding: "12px 16px",
              background: "rgba(220,38,38,0.15)",
              border: "1px solid rgba(220,38,38,0.4)",
              borderRadius: 10,
              color: "#fca5a5",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {displayError}
          </div>
        )}

        {/* Google sign-in button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={status === "loading"}
          aria-busy={status === "loading"}
          aria-label="Continue with Google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            width: "100%",
            padding: "13px 20px",
            background:
              status === "loading"
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.95)",
            color: status === "loading" ? "rgba(255,255,255,0.4)" : "#1f1f1f",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            outline: "none",
          }}
          onMouseEnter={(e) => {
            if (status !== "loading")
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,1)";
          }}
          onMouseLeave={(e) => {
            if (status !== "loading")
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.95)";
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 0 3px rgba(255,91,22,0.5)";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          {status === "loading" ? (
            <>
              {/* Spinner */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                style={{ animation: "spin 0.8s linear infinite" }}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="#ff5b16"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span>Signing in…</span>
            </>
          ) : (
            <>
              <GoogleIcon />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "24px 0",
          }}
        >
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            OR
          </span>
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }}
          />
        </div>

        {/* Register link */}
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
          }}
        >
          New to Goplay?{" "}
          <Link
            href="/register"
            style={{
              color: "#ff5b16",
              fontWeight: 600,
              textDecoration: "none",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                "underline";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.textDecoration =
                "none";
            }}
          >
            Create a free account
          </Link>
        </p>

        {/* Back to home */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link
            href="/"
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *:focus-visible { outline: 2px solid #ff5b16; outline-offset: 2px; }
      `}</style>
    </main>
  );
}

/* ─── Page export (wraps inner in Suspense for useSearchParams) ──────────── */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)",
          }}
          aria-label="Loading sign-in page"
        >
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Loading…
          </div>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
