/**
 * app/(auth)/forgot-password/page.tsx
 * Forgot password page — user submits their email to receive a reset link.
 */

"use client";

import { useState, useId, useCallback } from "react";
import Link from "next/link";

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;

      if (!email.trim()) { setError("Email is required"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Enter a valid email address");
        return;
      }

      setError("");
      setLoading(true);

      try {
        await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        // Always show the success state — never reveal whether email exists
        setSubmitted(true);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, loading]
  );

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.07)",
    border: `1px solid ${error ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)"}`,
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)" }}
    >
      {/* Blobs */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,91,22,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,6,102,0.35) 0%, transparent 70%)" }} />
      </div>

      {/* Card */}
      <div
        role="region"
        aria-label="Forgot password"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" aria-label="Goplay — home" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff", textDecoration: "none", display: "inline-block" }}>
            Goplay
          </Link>
        </div>

        {submitted ? (
          /* ── Success state ─────────────────────────────────────────────── */
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Check your email</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 28 }}>
              If an account exists for <strong style={{ color: "rgba(255,255,255,0.8)" }}>{email}</strong>, we&apos;ve sent a password reset link. It expires in 15 minutes.
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>
              Didn&apos;t receive it? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={() => { setSubmitted(false); setEmail(""); }}
                style={{ background: "none", border: "none", color: "#ff5b16", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 }}
              >
                try again
              </button>.
            </p>
            <Link
              href="/login"
              style={{ display: "inline-block", padding: "11px 28px", background: "#ff5b16", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          /* ── Form state ─────────────────────────────────────────────────── */
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                Forgot your password?
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                Enter your email and we&apos;ll send you a secure reset link.
              </p>
            </div>

            {error && (
              <div role="alert" aria-live="assertive" style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: 10, color: "#fca5a5", fontSize: 13 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor={`${uid}-email`} style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
                  Email address
                </label>
                <input
                  id={`${uid}-email`}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  disabled={loading}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${uid}-email-err` : undefined}
                  style={{ ...inputStyle, opacity: loading ? 0.6 : 1 }}
                  onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5b16"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.2)"; }}
                  onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = error ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "13px 20px",
                  background: loading ? "rgba(255,91,22,0.4)" : "#ff5b16",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#e54e10"; }}
                onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#ff5b16"; }}
                onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.5)"; }}
                onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
              >
                {loading ? (<><Spinner /><span>Sending…</span></>) : "Send reset link"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 24 }}>
              Remember your password?{" "}
              <Link href="/login" style={{ color: "#ff5b16", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
            </p>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>← Back to home</Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *:focus-visible { outline: 2px solid #ff5b16; outline-offset: 2px; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(10,10,46,0.9) inset;
          -webkit-text-fill-color: #fff;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </main>
  );
}
