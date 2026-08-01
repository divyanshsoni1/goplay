/**
 * app/(auth)/register/page.tsx
 * Registration page — full name / email / password / confirm password.
 * Password strength meter + live validation. Same glassmorphism style.
 */

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback, useId } from "react";
import Link from "next/link";

// ─── Icons ────────────────────────────────────────────────────────────────────

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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────

interface StrengthResult {
  score: number;   // 0–4
  label: string;
  color: string;
}

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

// ─── Register form component ──────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const uid = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [pwTouched, setPwTouched] = useState(false);

  const strength = getPasswordStrength(password);
  const isAnyLoading = loading || googleLoading;

  // ── Google sign-up ──────────────────────────────────────────────────────
  const handleGoogleSignUp = useCallback(async () => {
    if (isAnyLoading) return;
    setGoogleLoading(true);
    setServerError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard", redirect: true });
    } catch {
      setGoogleLoading(false);
      setServerError("Google sign-up failed. Please try again.");
    }
  }, [isAnyLoading]);

  // ── Client-side validation ──────────────────────────────────────────────
  function validate() {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required";
    else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    else if (name.trim().length > 100) errors.name = "Name is too long";

    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = "Enter a valid email address";

    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(password)) errors.password = "Add at least one uppercase letter";
    else if (!/[a-z]/.test(password)) errors.password = "Add at least one lowercase letter";
    else if (!/[0-9]/.test(password)) errors.password = "Add at least one number";
    else if (!/[^A-Za-z0-9]/.test(password)) errors.password = "Add at least one special character";

    if (!confirm) errors.confirm = "Please confirm your password";
    else if (confirm !== password) errors.confirm = "Passwords do not match";

    return errors;
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isAnyLoading) return;

      const errors = validate();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setServerError("");
      setLoading(true);

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            confirmPassword: confirm,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setServerError(data?.error?.message ?? "Registration failed. Please try again.");
          setLoading(false);
          return;
        }

        // Auto-sign in after registration
        const result = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          callbackUrl: "/dashboard",
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          // Account created but auto-login failed — send to login
          router.push("/login?registered=1");
        }
      } catch {
        setServerError("Something went wrong. Please try again.");
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, email, password, confirm, isAnyLoading, router]
  );

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)" }}
    >
      {/* Blobs */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
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
          maxWidth: 460,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "36px 36px 32px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Link href="/" aria-label="Goplay — home" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff", textDecoration: "none", display: "inline-block" }}>
            Goplay
          </Link>
          <h1 style={{ margin: "8px 0 4px", fontSize: 20, fontWeight: 700, color: "#fff" }}>
            Create your account
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
            Free forever — no credit card required
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <div role="alert" aria-live="assertive" style={{ marginBottom: 18, padding: "12px 16px", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.4)", borderRadius: 10, color: "#fca5a5", fontSize: 13, lineHeight: 1.5 }}>
            {serverError}
          </div>
        )}

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isAnyLoading}
          aria-busy={googleLoading}
          aria-label="Sign up with Google"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", padding: "12px 20px",
            background: isAnyLoading ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.95)",
            color: isAnyLoading ? "rgba(255,255,255,0.4)" : "#1f1f1f",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12,
            fontSize: 14, fontWeight: 600,
            cursor: isAnyLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { if (!isAnyLoading) (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
          onMouseLeave={(e) => { if (!isAnyLoading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.95)"; }}
          onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.5)"; }}
          onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
        >
          {googleLoading ? <Spinner /> : <GoogleIcon />}
          <span>{googleLoading ? "Redirecting…" : "Continue with Google"}</span>
        </button>

        {/* Divider */}
        <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} noValidate aria-label="Create account with email">

          {/* Full Name */}
          <div style={{ marginBottom: 14 }}>
            <label htmlFor={`${uid}-name`} style={labelStyle}>Full name</label>
            <input
              id={`${uid}-name`}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="Jane Smith"
              disabled={isAnyLoading}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? `${uid}-name-err` : undefined}
              style={{ ...inputStyle, borderColor: fieldErrors.name ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)", opacity: isAnyLoading ? 0.6 : 1 }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5b16"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.2)"; }}
              onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = fieldErrors.name ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }}
            />
            {fieldErrors.name && <p id={`${uid}-name-err`} role="alert" style={{ marginTop: 5, fontSize: 12, color: "#fca5a5" }}>{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label htmlFor={`${uid}-email`} style={labelStyle}>Email address</label>
            <input
              id={`${uid}-email`}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
              placeholder="you@example.com"
              disabled={isAnyLoading}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? `${uid}-email-err` : undefined}
              style={{ ...inputStyle, borderColor: fieldErrors.email ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)", opacity: isAnyLoading ? 0.6 : 1 }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5b16"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.2)"; }}
              onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = fieldErrors.email ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }}
            />
            {fieldErrors.email && <p id={`${uid}-email-err`} role="alert" style={{ marginTop: 5, fontSize: 12, color: "#fca5a5" }}>{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 14 }}>
            <label htmlFor={`${uid}-password`} style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                id={`${uid}-password`}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwTouched(true); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="Create a strong password"
                disabled={isAnyLoading}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={`${uid}-pw-strength${fieldErrors.password ? ` ${uid}-pw-err` : ""}`}
                style={{ ...inputStyle, paddingRight: 44, borderColor: fieldErrors.password ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)", opacity: isAnyLoading ? 0.6 : 1 }}
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
                        <span aria-hidden="true">{req.re.test(password) ? "✓" : "○"}</span>
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 18 }}>
            <label htmlFor={`${uid}-confirm`} style={labelStyle}>Confirm password</label>
            <div style={{ position: "relative" }}>
              <input
                id={`${uid}-confirm`}
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setFieldErrors((p) => ({ ...p, confirm: undefined })); }}
                placeholder="Repeat your password"
                disabled={isAnyLoading}
                aria-invalid={!!fieldErrors.confirm}
                aria-describedby={fieldErrors.confirm ? `${uid}-confirm-err` : undefined}
                style={{ ...inputStyle, paddingRight: 44, borderColor: fieldErrors.confirm ? "rgba(220,38,38,0.7)" : confirm && confirm === password ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.15)", opacity: isAnyLoading ? 0.6 : 1 }}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isAnyLoading}
            aria-busy={loading}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "13px 20px",
              background: isAnyLoading ? "rgba(255,91,22,0.4)" : "#ff5b16",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700,
              cursor: isAnyLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { if (!isAnyLoading) (e.currentTarget as HTMLButtonElement).style.background = "#e54e10"; }}
            onMouseLeave={(e) => { if (!isAnyLoading) (e.currentTarget as HTMLButtonElement).style.background = "#ff5b16"; }}
            onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.5)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
          >
            {loading ? (<><Spinner /><span>Creating account…</span></>) : "Create Account"}
          </button>
        </form>

        {/* Footer links */}
        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 20 }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#ff5b16", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 12, lineHeight: 1.6 }}>
          By creating an account you agree to our{" "}
          <Link href="/privacy-policy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Privacy Policy</Link>
          {" "}and{" "}
          <Link href="/disclaimer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Terms</Link>.
        </p>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>← Back to home</Link>
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
