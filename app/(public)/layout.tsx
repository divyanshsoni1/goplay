/**
 * app/(public)/layout.tsx
 * Shared layout for all public-facing pages.
 * Renders the single Navbar and Footer so individual pages don't have to.
 * Route group "(public)" has no effect on URL paths.
 */

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
