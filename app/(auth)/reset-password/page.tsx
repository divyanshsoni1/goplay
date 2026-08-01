/**
 * app/(auth)/reset-password/page.tsx
 * Password reset page — user enters new password + confirm using the token
 * from the URL query string (?token=...).
 */

"use client";

import { useState, useId, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// ─── Icons ────────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Strength helpers ─────────────────────────────────────────────────────────

interface StrengthResult { score: number; label: string; color: string; }

function getPasswordStrength(pw: string): StrengthResult {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: StrengthResult[] = [
    { score: 0, label: "", color: "transparent" },
    { score: 1, label: "Weak", color: "#ef4444" },
    { score: 2, label: "Fair", color: "#f97316" },
    { score: 3, label: "Good", color: "#eab308" },
    { score: 4, label: "Strong", color: "#22c55e" },
  ];
  return map[score];
}

const REQUIREMENTS = [
  { re: /.{8,}/, label: "At least 8 characters" },
  { re: /[A-Z]/, label: "One uppercase letter" },
  { re: /[a-z]/, label: "One lowercase letter" },
  { re: /[0-9]/, label: "One number" },
  { re: /[^A-Za-z0-9]/, label: "One special character" },
];

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  color: "#fff",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "rgba(255,255,255,0.7)",
  marginBottom: 6,
};

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = useId();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});
  const [pwTouched, setPwTouched] = useState(false);

  const strength = getPasswordStrength(password);

  // ── No token — show invalid link state ─────────────────────────────────
  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Invalid reset link</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 24 }}>
          This password reset link is missing or invalid. Please request a new one.
        </p>
        <Link href="/forgot-password" style={{ display: "inline-block", padding: "11px 28px", background: "#ff5b16", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
          Request new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const errors: { password?: string; confirm?: string } = {};
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(password)) errors.password = "Add at least one uppercase letter";
    else if (!/[a-z]/.test(password)) errors.password = "Add at least one lowercase letter";
    else if (!/[0-9]/.test(password)) errors.password = "Add at least one number";
    else if (!/[^A-Za-z0-9]/.test(password)) errors.password = "Add at least one special character";
    if (!confirm) errors.confirm = "Please confirm your password";
    else if (confirm !== password) errors.confirm = "Passwords do not match";

    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword: confirm }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message ?? "Reset failed. The link may have expired.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Password updated!</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 24 }}>
          Your password has been reset. Redirecting you to sign in…
        </p>
        <Link href="/login" style={{ display: "inline-block", padding: "11px 28px", background: "#ff5b16", color: "#fff", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
          Sign in now
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Set new password</h1>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
          Choose a strong password to secure your account.
        </p>
      </div>

      {error && (
        <div role="alert" aria-live="assertive" style={{ marginBottom: 16, padding: "12px 16px", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: 10, color: "#fca5a5", fontSize: 13 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Password */}
        <div style={{ marginBottom: 14 }}>
          <label htmlFor={`${uid}-pw`} style={labelStyle}>New password</label>
          <div style={{ position: "relative" }}>
            <input
              id={`${uid}-pw`}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPwTouched(true); setFieldErrors((p) => ({ ...p, password: undefined })); }}
              placeholder="Create a strong password"
              disabled={loading}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={`${uid}-pw-strength${fieldErrors.password ? ` ${uid}-pw-err` : ""}`}
              style={{ ...inputStyle, paddingRight: 44, borderColor: fieldErrors.password ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)", opacity: loading ? 0.6 : 1 }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5b16"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.2)"; }}
              onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = fieldErrors.password ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} tabIndex={-1}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", padding: 2 }}>
              <EyeIcon open={showPassword} />
            </button>
          </div>
          {fieldErrors.password && <p id={`${uid}-pw-err`} role="alert" style={{ marginTop: 5, fontSize: 12, color: "#fca5a5" }}>{fieldErrors.password}</p>}

          {/* Strength meter */}
          {pwTouched && password && (
            <div id={`${uid}-pw-strength`} aria-label={`Password strength: ${strength.label}`} style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.score ? strength.color : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {strength.label && <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</span>}
                <ul aria-label="Password requirements" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  {REQUIREMENTS.map((req) => (
                    <li key={req.label} style={{ fontSize: 11, color: req.re.test(password) ? "#4ade80" : "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 4 }}>
                      <span aria-hidden="true">{req.re.test(password) ? "✓" : "○"}</span>{req.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Confirm */}
        <div style={{ marginBottom: 20 }}>
          <label htmlFor={`${uid}-confirm`} style={labelStyle}>Confirm new password</label>
          <div style={{ position: "relative" }}>
            <input
              id={`${uid}-confirm`}
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setFieldErrors((p) => ({ ...p, confirm: undefined })); }}
              placeholder="Repeat your new password"
              disabled={loading}
              aria-invalid={!!fieldErrors.confirm}
              aria-describedby={fieldErrors.confirm ? `${uid}-confirm-err` : undefined}
              style={{ ...inputStyle, paddingRight: 44, borderColor: fieldErrors.confirm ? "rgba(220,38,38,0.7)" : confirm && confirm === password ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.15)", opacity: loading ? 0.6 : 1 }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5b16"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.2)"; }}
              onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = fieldErrors.confirm ? "rgba(220,38,38,0.7)" : confirm && confirm === password ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }}
            />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"} tabIndex={-1}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", padding: 2 }}>
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {fieldErrors.confirm && <p id={`${uid}-confirm-err`} role="alert" style={{ marginTop: 5, fontSize: 12, color: "#fca5a5" }}>{fieldErrors.confirm}</p>}
          {!fieldErrors.confirm && confirm && confirm === password && (
            <p style={{ marginTop: 5, fontSize: 12, color: "#4ade80" }}>✓ Passwords match</p>
          )}
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
          {loading ? (<><Spinner /><span>Updating…</span></>) : "Reset password"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 24 }}>
        <Link href="/login" style={{ color: "#ff5b16", fontWeight: 600, textDecoration: "none" }}>← Back to sign in</Link>
      </p>
    </>
  );
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
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
        aria-label="Reset password"
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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" aria-label="Goplay — home" style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff", textDecoration: "none", display: "inline-block" }}>
            Goplay
          </Link>
        </div>

        <Suspense fallback={<div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center" }}>Loading…</div>}>
          <ResetPasswordInner />
        </Suspense>

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
