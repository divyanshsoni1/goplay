/**
 * app/components.tsx
 *
 * Barrel file — re-exports shared utilities so existing imports keep working.
 *
 * Navbar and Footer have been moved to:
 *   components/layout/Navbar.tsx
 *   components/layout/Footer.tsx
 *
 * They are rendered automatically via app/(public)/layout.tsx for all public
 * pages. Import them directly from the components/layout path if you need
 * them outside of the (public) route group (e.g. not-found.tsx).
 */

/* Server-safe utilities */
export { Breadcrumbs, breadcrumbSchema, JsonLd, SectionHeader } from "./ui";

/* Layout components — re-exported for convenience */
export { Navbar as Header } from "@/components/layout/Navbar";
export { Footer } from "@/components/layout/Footer";
