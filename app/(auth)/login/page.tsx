/**
 * app/(auth)/login/page.tsx
 * Sign-in page — Google OAuth + Email/Password credentials.
 * Matches the existing glassmorphism design language.
 */

"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, Suspense, useId } from "react";
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
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#ff5b16" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Error message map ────────────────────────────────────────────────────────

const AUTH_ERRORS: Record<string, string> = {
  OAuthSignin: "Could not initiate Google sign-in. Please try again.",
  OAuthCallback: "Google sign-in was cancelled or failed.",
  OAuthCreateAccount: "Could not create your account. Please try again.",
  EmailCreateAccount: "Could not create your account. Please try again.",
  Callback: "Something went wrong during sign-in. Please try again.",
  OAuthAccountNotLinked: "This email is already linked to a different sign-in method.",
  AccountInactive: "Your account has been deactivated. Please contact support.",
  GoogleAccountOnly: "This account uses Google Sign-In. Please continue with Google below.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  CredentialsSignin: "Invalid email or password. Please try again.",
  Default: "An unexpected error occurred. Please try again.",
};

// ─── Shared input styles ──────────────────────────────────────────────────────

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

// ─── Main inner component ─────────────────────────────────────────────────────

function LoginInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const uid = useId();

  const authError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  // Google state
  const [googleLoading, setGoogleLoading] = useState(false);

  // Credentials state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credLoading, setCredLoading] = useState(false);
  const [credError, setCredError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const displayError =
    credError ||
    (authError ? (AUTH_ERRORS[authError] ?? AUTH_ERRORS.Default) : null);

  // ── Google sign-in ──────────────────────────────────────────────────────
  const handleGoogleSignIn = useCallback(async () => {
    if (googleLoading || credLoading) return;
    setGoogleLoading(true);
    setCredError("");
    try {
      await signIn("google", { callbackUrl, redirect: true });
    } catch {
      setGoogleLoading(false);
      setCredError("Google sign-in failed. Please try again.");
    }
  }, [googleLoading, credLoading, callbackUrl]);

  // ── Credentials sign-in ─────────────────────────────────────────────────
  const handleCredentialsSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (credLoading || googleLoading) return;

      // Client-side validation
      const errors: { email?: string; password?: string } = {};
      if (!email.trim()) errors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        errors.email = "Enter a valid email address";
      if (!password) errors.password = "Password is required";

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setCredError("");
      setCredLoading(true);

      try {
        const result = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          callbackUrl,
          redirect: false,
        });

        if (result?.error) {
          if (result.error === "GoogleAccountOnly") {
            setCredError(AUTH_ERRORS.GoogleAccountOnly);
          } else {
            setCredError(AUTH_ERRORS.CredentialsSignin);
          }
          setCredLoading(false);
          return;
        }

        if (result?.ok) {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch {
        setCredError("Sign-in failed. Please try again.");
        setCredLoading(false);
      }
    },
    [email, password, callbackUrl, credLoading, googleLoading, router]
  );

  const isAnyLoading = googleLoading || credLoading;

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)" }}
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,91,22,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,6,102,0.4) 0%, transparent 70%)" }} />
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
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" aria-label="Goplay — home" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff", textDecoration: "none", display: "inline-block" }}>
            Goplay
          </Link>
          <h1 style={{ margin: "8px 0 4px", fontSize: 20, fontWeight: 700, color: "#fff" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
            Sign in to your account
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

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isAnyLoading}
          aria-busy={googleLoading}
          aria-label="Continue with Google"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            width: "100%",
            padding: "12px 20px",
            background: isAnyLoading ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.95)",
            color: isAnyLoading ? "rgba(255,255,255,0.4)" : "#1f1f1f",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: isAnyLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { if (!isAnyLoading) (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
          onMouseLeave={(e) => { if (!isAnyLoading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.95)"; }}
          onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.5)"; }}
          onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
        >
          {googleLoading ? <Spinner /> : <GoogleIcon />}
          <span>{googleLoading ? "Signing in…" : "Continue with Google"}</span>
        </button>

        {/* Divider */}
        <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Credentials form */}
        <form onSubmit={handleCredentialsSignIn} noValidate aria-label="Sign in with email and password">
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor={`${uid}-email`} style={labelStyle}>
              Email address
            </label>
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
              style={{
                ...inputStyle,
                borderColor: fieldErrors.email ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)",
                opacity: isAnyLoading ? 0.6 : 1,
              }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5b16"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.2)"; }}
              onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = fieldErrors.email ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }}
            />
            {fieldErrors.email && (
              <p id={`${uid}-email-err`} role="alert" style={{ marginTop: 5, fontSize: 12, color: "#fca5a5" }}>
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label htmlFor={`${uid}-password`} style={{ ...labelStyle, marginBottom: 0 }}>
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{ fontSize: 12, color: "#ff5b16", textDecoration: "none", fontWeight: 500 }}
                tabIndex={0}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                id={`${uid}-password`}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                placeholder="Enter your password"
                disabled={isAnyLoading}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? `${uid}-pw-err` : undefined}
                style={{
                  ...inputStyle,
                  paddingRight: 44,
                  borderColor: fieldErrors.password ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)",
                  opacity: isAnyLoading ? 0.6 : 1,
                }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#ff5b16"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.2)"; }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = fieldErrors.password ? "rgba(220,38,38,0.7)" : "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.4)",
                  display: "flex",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {fieldErrors.password && (
              <p id={`${uid}-pw-err`} role="alert" style={{ marginTop: 5, fontSize: 12, color: "#fca5a5" }}>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isAnyLoading}
            aria-busy={credLoading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "13px 20px",
              marginTop: 8,
              background: isAnyLoading ? "rgba(255,91,22,0.4)" : "#ff5b16",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: isAnyLoading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { if (!isAnyLoading) (e.currentTarget as HTMLButtonElement).style.background = "#e54e10"; }}
            onMouseLeave={(e) => { if (!isAnyLoading) (e.currentTarget as HTMLButtonElement).style.background = "#ff5b16"; }}
            onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 0 3px rgba(255,91,22,0.5)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
          >
            {credLoading ? (
              <>
                <Spinner />
                <span>Signing in…</span>
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 24 }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "#ff5b16", fontWeight: 600, textDecoration: "none" }}>
            Create one free
          </Link>
        </p>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>
            ← Back to home
          </Link>
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

// ─── Page export ──────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #000666 0%, #0a0a2e 50%, #1a0533 100%)" }}
          aria-label="Loading sign-in page"
        >
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Loading…</div>
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
