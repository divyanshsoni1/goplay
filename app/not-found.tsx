import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { Footer, Header } from "./components";

export const metadata: Metadata = {
  title: "Page Not Found – Goplay",
  description: "The page you are looking for could not be found. Return to the Goplay homepage or browse our guides.",
  robots: { index: false, follow: true },
};

const helpLinks = [
  { href: "/",                    label: "Home",                icon: "🏠" },
  { href: "/app-download-guide", label: "Download Guide",      icon: "📥" },
  { href: "/faq",                 label: "FAQ",                 icon: "❓" },
  { href: "/blog",                label: "Blog",                icon: "📖" },
  { href: "/contact-us",          label: "Contact Support",     icon: "💬" },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Header />
      <main id="main-content">
        <section className={styles.notFoundPage} aria-label="Page not found">
          <div className={styles.notFoundInner}>
            <p className={styles.notFoundCode} aria-label="Error 404">
              4<span>0</span>4
            </p>
            <h1>Page Not Found</h1>
            <p>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
              Try one of the links below to get back on track.
            </p>

            <nav aria-label="Helpful links" style={{ marginBottom: 32 }}>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "center",
                }}
              >
                {helpLinks.map(({ href, label, icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        background: "var(--surface-alt, #f3f4f5)",
                        border: "1px solid var(--border, #c6c5d4)",
                        borderRadius: 8,
                        color: "var(--navy, #000666)",
                        fontSize: 14,
                        fontWeight: 700,
                        padding: "10px 18px",
                        textDecoration: "none",
                        transition: "box-shadow 0.2s ease, transform 0.2s ease",
                      }}
                    >
                      <span aria-hidden="true">{icon}</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className={styles.notFoundActions}>
              <Link className={styles.primaryButton} href="/">
                Back to Home <b>→</b>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
