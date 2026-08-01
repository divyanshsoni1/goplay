"use client";

/**
 * components/referral/RefCapture.tsx
 *
 * Invisible client component mounted in the public layout.
 * On first render it checks the URL for ?ref=<CODE> and, if present,
 * calls POST /api/referral/capture to store the code in a secure HttpOnly cookie.
 *
 * Design decisions:
 *  - useSearchParams() reads the query string client-side without causing
 *    a full page reload or server round-trip on every navigation.
 *  - The POST is fire-and-forget: failures are silently swallowed so the
 *    page never shows an error because of a referral.
 *  - A sessionStorage flag prevents re-firing on the same browser tab.
 *  - The component renders nothing — purely side-effectful.
 *
 * Must be wrapped in <Suspense> by the parent because useSearchParams()
 * requires it in Next.js 13+ App Router.
 */

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SESSION_KEY = "gp_ref_captured";

function RefCaptureInner() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  useEffect(() => {
    // Nothing to capture
    if (!refCode) return;

    // Already attempted in this browser session (tab) — avoid duplicate POSTs
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    // Fire-and-forget — any failure is silently ignored
    fetch("/api/referral/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: refCode }),
    })
      .then(() => {
        // Mark as attempted for this session regardless of response
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_KEY, "1");
        }
      })
      .catch(() => {
        // Network failure — silently ignore
      });
  }, [refCode]);

  // Renders nothing
  return null;
}

/**
 * Export wrapped in Suspense so the parent layout doesn't need to care.
 * The fallback is null — nothing is rendered during the suspended phase.
 */
export function RefCapture() {
  return (
    <Suspense fallback={null}>
      <RefCaptureInner />
    </Suspense>
  );
}
