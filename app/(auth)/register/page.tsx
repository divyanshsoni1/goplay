/**
 * app/(auth)/register/page.tsx
 * Sign-up page — same glassmorphism style as login.
 * Google OAuth creates an account automatically on first sign-in,
 * so this page is a friendly re-entry point that calls signIn("google").
 */

"use client";

import { signIn } from "next-auth/react";
import { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function RegisterInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const handleGoogleSignUp = useCallback(async () => {
    if (status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await signIn("google", { callbackUrl, redirect: true });
    } catch {
      setStatus("error");
      setErrorMsg("Sign-up failed. Please try again.");
    }
  }, [status, callbackUrl]);

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}
      >
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,91,22,0.1) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,6,102,0.3) 0%, transparent 70%)" }} />
      </div>

      {/* Card */}
      <div
        role="region"
        aria-label="Create account"
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
          <Link href="/" aria-label="Goplay — home" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff", textDecoration: "none", display: "inline-block" }}>
            Goplay
          </Link>
          <h1 style={{ margin: "10px 0 6px", fontSize: 22, fontWeight: 700, color: "#fff" }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
            Join Goplay and start playing today
          </p>
        </div>

        {/* Benefits */}
        <ul
          aria-label="Account benefits"
          style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10 }}
        >
          {[
            "✓  Free account — no credit card required",
            "✓  Access your personal dashboard",
            "✓  Download the Goplay app instantly",
          ].map((item) => (
            <li key={item} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 8 }}>
              {item}
            </li>
          ))}
        </ul>

        {/* Error */}
        {(errorMsg) && (
          <div role="alert" aria-live="assertive" style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: 10, color: "#fca5a5", fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {/* Google sign-up button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={status === "loading"}
          aria-busy={status === "loading"}
          aria-label="Sign up with Google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            width: "100%",
            padding: "13px 20px",
            background: status === "loading" ? "rgba(255,91,22,0.3)" : "#ff5b16",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            marginBottom: 16,
          }}
          onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.5)"; }}
          onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
        >
          {status === "loading" ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ animation: "spin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span>Creating account…</span>
            </>
          ) : (
            <>
              <GoogleIcon />
              <span>Sign up with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 20px" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Login link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#ff5b16", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>

        {/* Fine print */}
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 20, lineHeight: 1.6 }}>
          By creating an account you agree to our{" "}
          <Link href="/privacy-policy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Privacy Policy</Link>
          {" "}and{" "}
          <Link href="/disclaimer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Terms</Link>.
        </p>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
            ← Back to home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *:focus-visible { outline: 2px solid #ff5b16; outline-offset: 2px; }
      `}</style>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)" }} aria-label="Loading">
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Loading…</div>
      </div>
    }>
      <RegisterInner />
    </Suspense>
  );
}
