/**
 * app/(public)/layout.tsx
 * Shared layout for all public-facing pages.
 * Renders the single Navbar and Footer so individual pages don't have to.
 * Route group "(public)" has no effect on URL paths.
 *
 * RefCapture is mounted here so that any public page visited via a referral
 * link (e.g. /?ref=ABC123) captures the code into a secure HttpOnly cookie.
 */

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RefCapture } from "@/components/referral/RefCapture";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Invisible — captures ?ref= query param into a secure HttpOnly cookie */}
      <RefCapture />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
