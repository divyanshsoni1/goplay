"use client";

import { useRef, useState } from "react";
import styles from "../page.module.css";

type FieldErrors = { name?: string; email?: string; subject?: string; message?: string };

function validate(name: string, email: string, subject: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "Name is required.";
  else if (name.trim().length < 2) errors.name = "Name must be at least 2 characters.";

  if (!email.trim()) errors.email = "Email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Enter a valid email address.";

  if (!subject.trim()) errors.subject = "Subject is required.";

  if (!message.trim()) errors.message = "Message is required.";
  else if (message.trim().length < 20) errors.message = "Message must be at least 20 characters.";

  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name    = String(data.get("name") ?? "");
    const email   = String(data.get("email") ?? "");
    const subject = String(data.get("subject") ?? "");
    const message = String(data.get("message") ?? "");

    const fieldErrors = validate(name, email, subject, message);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      // Move focus to error summary
      setTimeout(() => errorSummaryRef.current?.focus(), 50);
      return;
    }

    setStatus("loading");
    try {
      // Simulate network call — replace with real endpoint
      await new Promise<void>((resolve) => setTimeout(resolve, 900));
      setStatus("success");
      formRef.current?.reset();
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.formSuccess} role="status" aria-live="polite" tabIndex={-1}>
        ✅ <strong>Message sent.</strong> Thank you — we&apos;ll get back to you as
        soon as possible. For account-specific questions, use the in-app support
        channel.
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
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
            border: "1px solid #fca5a5",
            borderRadius: 6,
            padding: "14px 18px",
            color: "#991b1b",
            fontSize: 14,
          }}
        >
          <strong>Please fix the following errors:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {Object.values(errors).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Name */}
      <label htmlFor="cf-name">
        Name <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
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
        />
        {errors.name && (
          <span id="cf-name-error" className={styles.fieldError} role="alert">
            {errors.name}
          </span>
        )}
      </label>

      {/* Email */}
      <label htmlFor="cf-email">
        Email address <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
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
        />
        {errors.email && (
          <span id="cf-email-error" className={styles.fieldError} role="alert">
            {errors.email}
          </span>
        )}
      </label>

      {/* Subject */}
      <label htmlFor="cf-subject">
        Subject <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
        <input
          id="cf-subject"
          name="subject"
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "cf-subject-error" : undefined}
          disabled={status === "loading"}
        />
        {errors.subject && (
          <span id="cf-subject-error" className={styles.fieldError} role="alert">
            {errors.subject}
          </span>
        )}
      </label>

      {/* Message */}
      <label htmlFor="cf-message">
        Message <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
        <textarea
          id="cf-message"
          name="message"
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-error" : "cf-message-hint"}
          disabled={status === "loading"}
        />
        {errors.message ? (
          <span id="cf-message-error" className={styles.fieldError} role="alert">
            {errors.message}
          </span>
        ) : (
          <span id="cf-message-hint" style={{ color: "var(--muted)", fontSize: 12 }}>
            Minimum 20 characters
          </span>
        )}
      </label>

      {/* Submit */}
      <button
        className={styles.primaryButton}
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        style={{ width: "fit-content" }}
      >
        {status === "loading" ? (
          <>
            <span aria-hidden="true">⏳</span> Sending…
          </>
        ) : (
          <>Send Message <b>→</b></>
        )}
      </button>

      {status === "error" && (
        <div role="alert" style={{ color: "#dc2626", fontSize: 14, fontWeight: 600 }}>
          Something went wrong. Please try again or email us directly at{" "}
          <a href="mailto:support@goplay11game.net">support@goplay11game.net</a>.
        </div>
      )}
    </form>
  );
}
