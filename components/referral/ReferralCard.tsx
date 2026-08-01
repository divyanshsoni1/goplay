"use client";

/**
 * components/referral/ReferralCard.tsx
 *
 * Dashboard card showing the user's referral link, copy button, share button,
 * and successful referral count.
 *
 * Features:
 *  - Fetches referral data from GET /api/referral on mount
 *  - Copy to clipboard with fallback (execCommand) + toast notification
 *  - Native Share API (navigator.share) with ShareModal fallback
 *  - WhatsApp / SMS share via deep-links in the modal
 *  - Loading skeleton while fetching
 *  - Full keyboard + ARIA accessibility
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { ShareModal } from "./ShareModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReferralData {
  referralCode: string;
  referralCount: number;
  referralUrl: string;
}

type ToastState = "idle" | "copied" | "error";

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ state }: { state: ToastState }) {
  if (state === "idle") return null;
  const isError = state === "error";
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,
        padding: "10px 20px",
        borderRadius: 10,
        background: isError ? "rgba(239,68,68,0.95)" : "rgba(34,197,94,0.95)",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        animation: "slideUp 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {isError ? "⚠️ Could not copy. Try manually." : "✓ Link copied!"}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading referral information"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "28px",
        marginBottom: 24,
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1 }
          50% { opacity: 0.5 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px) }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) }
        }
      `}</style>
      <div style={{ height: 20, width: "40%", background: "rgba(255,255,255,0.08)", borderRadius: 6, marginBottom: 16 }} />
      <div style={{ height: 14, width: "70%", background: "rgba(255,255,255,0.06)", borderRadius: 6, marginBottom: 20 }} />
      <div style={{ height: 46, background: "rgba(255,255,255,0.06)", borderRadius: 10, marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ height: 42, flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 10 }} />
        <div style={{ height: 42, flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 10 }} />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ReferralCard() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toastState, setToastState] = useState<ToastState>("idle");
  const [showModal, setShowModal] = useState(false);
  const [copyBusy, setCopyBusy] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch referral data ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/referral")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) {
          setData(json.data as ReferralData);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Toast helpers ────────────────────────────────────────────────────────
  const showToast = useCallback((state: "copied" | "error") => {
    setToastState(state);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastState("idle"), 2800);
  }, []);

  // ── Copy to clipboard ────────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    if (!data?.referralUrl || copyBusy) return;
    setCopyBusy(true);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data.referralUrl);
      } else {
        // Fallback for older browsers / insecure contexts
        const el = document.createElement("textarea");
        el.value = data.referralUrl;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      showToast("copied");
    } catch {
      showToast("error");
    } finally {
      setCopyBusy(false);
    }
  }, [data?.referralUrl, copyBusy, showToast]);

  // ── Share ────────────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!data?.referralUrl || shareBusy) return;
    setShareBusy(true);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: "Join GoPlay",
          text: "Join GoPlay using my referral link and start playing!",
          url: data.referralUrl,
        });
      } else {
        // Navigator.share not supported — open fallback modal
        setShowModal(true);
      }
    } catch (err) {
      // User cancelled the native share — not an error
      if (err instanceof Error && err.name !== "AbortError") {
        setShowModal(true);
      }
    } finally {
      setShareBusy(false);
    }
  }, [data?.referralUrl, shareBusy]);

  // ── Cleanup toast timer on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // ── Render: loading ──────────────────────────────────────────────────────
  if (loading) return <Skeleton />;

  // ── Render: error ────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div
        role="alert"
        style={{
          background: "rgba(239,68,68,0.07)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 16,
          padding: "24px 28px",
          marginBottom: 24,
          color: "rgba(255,255,255,0.6)",
          fontSize: 14,
        }}
      >
        Unable to load referral information. Please refresh the page.
      </div>
    );
  }

  const { referralUrl, referralCount } = data;

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px) }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) }
        }
        .ref-copy-btn:hover:not(:disabled) { background: rgba(255,255,255,0.1) !important; }
        .ref-copy-btn:focus-visible { outline: 2px solid #ff5b16; outline-offset: 2px; border-radius: 10px; }
        .ref-share-btn:hover:not(:disabled) { background: #e04a0e !important; }
        .ref-share-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; border-radius: 10px; }
        @media (max-width: 480px) {
          .ref-btn-row { flex-direction: column !important; }
          .ref-btn-row button { width: 100% !important; }
        }
      `}</style>

      {/* ── Main card ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="referral-card-heading"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "28px",
          marginBottom: 24,
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div>
            <h2
              id="referral-card-heading"
              style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}
            >
              🎉 Invite Friends
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>
              Earn rewards by inviting your friends to GoPlay.
            </p>
          </div>

          {/* Referral count badge */}
          <div
            aria-label={`${referralCount} successful referral${referralCount !== 1 ? "s" : ""}`}
            style={{
              background: "rgba(255,91,22,0.12)",
              border: "1px solid rgba(255,91,22,0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              textAlign: "center",
              minWidth: 90,
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: "#ff5b16", lineHeight: 1 }}>
              {referralCount}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Successful{"\n"}Referral{referralCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Link label */}
        <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
          Your Referral Link
        </div>

        {/* Link display */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            marginBottom: 14,
            overflow: "hidden",
          }}
        >
          <div
            role="textbox"
            aria-label="Your referral link"
            aria-readonly="true"
            style={{
              flex: 1,
              padding: "12px 14px",
              fontSize: 13,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
            }}
          >
            {referralUrl}
          </div>
        </div>

        {/* Action buttons */}
        <div
          className="ref-btn-row"
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          <button
            type="button"
            className="ref-copy-btn"
            onClick={handleCopy}
            disabled={copyBusy}
            aria-label="Copy referral link to clipboard"
            style={{
              flex: 1,
              minWidth: 120,
              padding: "12px 20px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: copyBusy ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.15s",
              opacity: copyBusy ? 0.6 : 1,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copyBusy ? "Copying…" : "Copy Link"}
          </button>

          <button
            type="button"
            className="ref-share-btn"
            onClick={handleShare}
            disabled={shareBusy}
            aria-label="Share referral link"
            style={{
              flex: 1,
              minWidth: 120,
              padding: "12px 20px",
              background: "#ff5b16",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: shareBusy ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "background 0.15s",
              opacity: shareBusy ? 0.7 : 1,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {shareBusy ? "Opening…" : "Share"}
          </button>
        </div>
      </section>

      {/* Share modal fallback */}
      {showModal && (
        <ShareModal
          referralUrl={referralUrl}
          onClose={() => setShowModal(false)}
          onCopy={() => { setShowModal(false); handleCopy(); }}
        />
      )}

      {/* Toast notification */}
      <Toast state={toastState} />
    </>
  );
}
