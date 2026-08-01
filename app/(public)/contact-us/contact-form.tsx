"use client";

import { useRef, useState } from "react";
import styles from "../../page.module.css";

type FieldErrors = { name?: string; email?: string; subject?: string; message?: string };

function validate(name: string, email: string, subject: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "Name is required.";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

  if (!email.trim()) errors.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Enter a valid email address.";

  if (!subject.trim()) errors.subject = "Subject is required.";
  else if (subject.trim().length < 3) errors.subject = "Subject must be at least 3 characters.";

  if (!message.trim()) errors.message = "Message is required.";
  else if (message.trim().length < 20) errors.message = "Message must be at least 20 characters.";

  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "rate-limited">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const clearFieldError = (field: keyof FieldErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "");

    const fieldErrors = validate(name, email, subject, message);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      setTimeout(() => errorSummaryRef.current?.focus(), 50);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (res.status === 429) {
        setStatus("rate-limited");
        return;
      }

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const msg = (json as { error?: { message?: string } })?.error?.message;
        if (msg) setErrors({ message: msg });
        setStatus("idle");
        setTimeout(() => errorSummaryRef.current?.focus(), 50);
        return;
      }

      setStatus("success");
      formRef.current?.reset();
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={styles.formSuccess}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 16,
          padding: "24px",
          color: "#166534",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span style={{ fontSize: "1.5rem" }} aria-hidden="true">
            ✅
          </span>
          <div>
            <strong style={{ fontSize: "1.05rem", display: "block", marginBottom: 4 }}>
              Message sent successfully!
            </strong>
            Thank you for reaching out — we&apos;ll get back to you as soon as possible. For
            account-specific questions, please use the in-app support channel.
          </div>
        </div>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  // Clean Light input style with high clarity
  const inputBaseStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: "0.975rem",
    lineHeight: "1.5",
    transition: "all 0.2s ease-in-out",
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "#0f172a";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15, 23, 42, 0.15)";
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    hasFieldError?: boolean
  ) => {
    e.currentTarget.style.borderColor = hasFieldError ? "#dc2626" : "#cbd5e1";
    e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.03)";
  };

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      style={{
        display: "grid",
        gap: 22,
        opacity: status === "loading" ? 0.75 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      {/* Error summary */}
      {hasErrors && (
        <div
          ref={errorSummaryRef}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            padding: "16px 20px",
            color: "#991b1b",
            fontSize: "0.9rem",
            outline: "none",
          }}
        >
          <strong style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
            Please resolve the following before proceeding:
          </strong>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
            {Object.values(errors).map(
              (err) => err && <li key={err}>{err}</li>
            )}
          </ul>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label
          htmlFor="cf-name"
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: "0.875rem",
            marginBottom: 6,
            color: "#1e293b",
          }}
        >
          Name <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "cf-name-error" : undefined}
          disabled={status === "loading"}
          placeholder="Enter your full name"
          style={{
            ...inputBaseStyle,
            borderColor: errors.name ? "#dc2626" : "#cbd5e1",
          }}
          onInput={() => clearFieldError("name")}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, !!errors.name)}
        />
        {errors.name && (
          <span
            id="cf-name-error"
            className={styles.fieldError}
            role="alert"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#dc2626",
              fontSize: "0.825rem",
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            ⚠️ {errors.name}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="cf-email"
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: "0.875rem",
            marginBottom: 6,
            color: "#1e293b",
          }}
        >
          Email address <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "cf-email-error" : undefined}
          disabled={status === "loading"}
          placeholder="you@example.com"
          style={{
            ...inputBaseStyle,
            borderColor: errors.email ? "#dc2626" : "#cbd5e1",
          }}
          onInput={() => clearFieldError("email")}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, !!errors.email)}
        />
        {errors.email && (
          <span
            id="cf-email-error"
            className={styles.fieldError}
            role="alert"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#dc2626",
              fontSize: "0.825rem",
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            ⚠️ {errors.email}
          </span>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label
          htmlFor="cf-subject"
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: "0.875rem",
            marginBottom: 6,
            color: "#1e293b",
          }}
        >
          Subject <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
        </label>
        <input
          id="cf-subject"
          name="subject"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "cf-subject-error" : undefined}
          disabled={status === "loading"}
          placeholder="Brief summary of your inquiry"
          style={{
            ...inputBaseStyle,
            borderColor: errors.subject ? "#dc2626" : "#cbd5e1",
          }}
          onInput={() => clearFieldError("subject")}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, !!errors.subject)}
        />
        {errors.subject && (
          <span
            id="cf-subject-error"
            className={styles.fieldError}
            role="alert"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#dc2626",
              fontSize: "0.825rem",
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            ⚠️ {errors.subject}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="cf-message"
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: "0.875rem",
            marginBottom: 6,
            color: "#1e293b",
          }}
        >
          Message <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-error" : "cf-message-hint"}
          disabled={status === "loading"}
          placeholder="How can we help you today?"
          style={{
            ...inputBaseStyle,
            resize: "vertical",
            minHeight: 130,
            fontFamily: "inherit",
            borderColor: errors.message ? "#dc2626" : "#cbd5e1",
          }}
          onInput={() => clearFieldError("message")}
          onFocus={handleFocus}
          onBlur={(e) => handleBlur(e, !!errors.message)}
        />
        {errors.message ? (
          <span
            id="cf-message-error"
            className={styles.fieldError}
            role="alert"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#dc2626",
              fontSize: "0.825rem",
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            ⚠️ {errors.message}
          </span>
        ) : (
          <span
            id="cf-message-hint"
            style={{
              color: "#64748b",
              fontSize: "0.8rem",
              marginTop: 6,
              display: "block",
            }}
          >
            Minimum 20 characters
          </span>
        )}
      </div>

      {/* Submit button */}
      <button
        className={styles.primaryButton}
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        style={{
          width: "100%",
          maxWidth: "240px",
          padding: "12px 28px",
          fontSize: "0.95rem",
          fontWeight: 600,
          borderRadius: 12,
          border: "none",
          background: "#0f172a",
          color: "#ffffff",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "all 0.2s ease-in-out",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 6,
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
        }}
        onMouseEnter={(e) => {
          if (status !== "loading") e.currentTarget.style.background = "#1e293b";
        }}
        onMouseLeave={(e) => {
          if (status !== "loading") e.currentTarget.style.background = "#0f172a";
        }}
      >
        {status === "loading" ? (
          <>
            <span aria-hidden="true">⏳</span> Sending…
          </>
        ) : (
          <>
            Send Message <span aria-hidden="true" style={{ fontWeight: 700 }}>→</span>
          </>
        )}
      </button>

      {status === "rate-limited" && (
        <div
          role="alert"
          style={{
            color: "#92400e",
            fontSize: "0.875rem",
            fontWeight: 500,
            background: "#fef3c7",
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #fde68a",
          }}
        >
          ⚠️ Too many requests. Please wait a few minutes before submitting again.
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          style={{
            color: "#991b1b",
            fontSize: "0.875rem",
            fontWeight: 500,
            background: "#fef2f2",
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #fecaca",
          }}
        >
          Something went wrong. Please try again or reach out directly at{" "}
          <a
            href="mailto:support@goplay11game.net"
            style={{ color: "#2563eb", textDecoration: "underline", fontWeight: 600 }}
          >
            support@goplay11game.net
          </a>
          .
        </div>
      )}
    </form>
  );
}