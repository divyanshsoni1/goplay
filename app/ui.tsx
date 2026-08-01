/**
 * ui.tsx — Pure server-safe utility components.
 * No "use client" — safe to import in any Server Component.
 */
import Link from "next/link";
import styles from "./page.module.css";

/* ─── JSON-LD ──────────────────────────────────────────────────────────── */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ─── Breadcrumb schema helper ─────────────────────────────────────────── */
export function breadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://goplay11game.net/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: `https://goplay11game.net${path}`,
      },
    ],
  };
}

/* ─── Breadcrumbs nav ─────────────────────────────────────────────────── */
export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span aria-hidden="true">›</span>
      <b aria-current="page">{current}</b>
    </nav>
  );
}

/* ─── Section header ──────────────────────────────────────────────────── */
export function SectionHeader({
  label,
  title,
  subtitle,
  light = false,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div
      className={`${styles.centerTitle}${light ? ` ${styles.lightTitle}` : ""}`}
    >
      {label && <p className={styles.sectionLabel}>{label}</p>}
      <h2>{title}</h2>
      {subtitle && <span>{subtitle}</span>}
    </div>
  );
}
