"use client";

/**
 * components/referral/ShareModal.tsx
 *
 * Fallback share modal shown when navigator.share is unavailable.
 * Displays WhatsApp, SMS, and Copy Link options in a polished card UI.
 * Accessible: focus-trapped, keyboard-dismissible, ARIA-labelled.
 */

import { useEffect, useRef, useCallback } from "react";

interface ShareModalProps {
  referralUrl: string;
  onClose: () => void;
  onCopy: () => void;
}

export function ShareModal({ referralUrl, onClose, onCopy }: ShareModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const shareText = `Join GoPlay using my referral link and start playing!\n${referralUrl}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const smsUrl = `sms:?body=${encodeURIComponent(shareText)}`;

  // Focus the close button on open
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        .share-option-btn:hover { background: rgba(255,255,255,0.08) !important; transform: translateY(-1px); }
        .share-option-btn:focus-visible { outline: 2px solid #ff5b16; outline-offset: 2px; }
        .share-modal-close:hover { background: rgba(255,255,255,0.1) !important; }
        .share-modal-close:focus-visible { outline: 2px solid #ff5b16; outline-offset: 2px; }
      `}</style>

      {/* Card */}
      <div
        style={{
          background: "#0f0f2e",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "28px 24px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          animation: "slideUp 0.2s ease",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2
            id="share-modal-title"
            style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}
          >
            Share via
          </h2>
          <button
            ref={closeButtonRef}
            className="share-modal-close"
            onClick={onClose}
            aria-label="Close share modal"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.6)",
              fontSize: 16,
              transition: "background 0.15s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="share-option-btn"
            aria-label="Share via WhatsApp"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              textDecoration: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s, transform 0.15s",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(37,211,102,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              💬
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>WhatsApp</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                Send to contacts
              </div>
            </div>
          </a>

          {/* SMS */}
          <a
            href={smsUrl}
            className="share-option-btn"
            aria-label="Share via SMS"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              textDecoration: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s, transform 0.15s",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(59,130,246,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              📱
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>Messages / SMS</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                Text a friend
              </div>
            </div>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            className="share-option-btn"
            onClick={() => { onCopy(); onClose(); }}
            aria-label="Copy referral link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s, transform 0.15s",
              width: "100%",
              textAlign: "left",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(255,91,22,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              🔗
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>Copy Link</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                Paste anywhere
              </div>
            </div>
          </button>
        </div>

        {/* Link preview */}
        <div
          style={{
            marginTop: 20,
            padding: "10px 14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 8,
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            wordBreak: "break-all",
          }}
        >
          {referralUrl}
        </div>
      </div>
    </div>
  );
}
