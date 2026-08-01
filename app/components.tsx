"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

/* Re-export server-safe utilities so existing imports keep working */
export { Breadcrumbs, breadcrumbSchema, JsonLd, SectionHeader } from "./ui";

/* ─────────────────────────────────────────────
   HEADER  (sticky, mobile drawer, active links)
───────────────────────────────────────────── */
export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: [string, string][] = [
    ["App Download Guide", "/app-download-guide"],
    ["Blog",               "/blog"],
    ["FAQ",                "/faq"],
    ["About Us",           "/about-us"],
    ["Contact Us",         "/contact-us"],
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <header className={styles.header} role="banner">
        <nav className={styles.nav} aria-label="Main navigation">
          <Link className={styles.logo} href="/" aria-label="Goplay – home">
            Goplay
          </Link>

          {/* Desktop links */}
          <div className={styles.navLinks} role="list">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                role="listitem"
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>

          <Link
            className={styles.downloadSmall}
            href="/app-download-guide"
            aria-label="Download the Goplay app"
          >
            Download App
          </Link>

          {/* Mobile hamburger */}
          <button
            className={styles.menuToggle}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile drawer */}
        <div
          id="mobile-nav"
          className={`${styles.mobileNav}${menuOpen ? ` ${styles.open}` : ""}`}
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            className={styles.downloadSmall}
            href="/app-download-guide"
            onClick={() => setMenuOpen(false)}
            style={{ marginTop: 8, textAlign: "center" }}
          >
            Download App
          </Link>
        </div>
      </header>
    </>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <section aria-label="Goplay brand">
            <Link className={styles.footerLogo} href="/" aria-label="Goplay – home">
              Goplay
            </Link>
            <p>
              A mobile gaming platform designed for entertainment and interactive
              gameplay. Fast, lightweight, and easy to navigate.
            </p>
            <div className={styles.socials} aria-label="Social media links">
              <a href="#" aria-label="Facebook"       rel="noopener noreferrer">f</a>
              <a href="#" aria-label="X (Twitter)"    rel="noopener noreferrer">𝕏</a>
              <a href="#" aria-label="Instagram"      rel="noopener noreferrer">◎</a>
            </div>
          </section>

          {/* Pages */}
          <section aria-label="Site pages">
            <h3>Pages</h3>
            <Link href="/app-download-guide">Download Guide</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about-us">About Us</Link>
            <Link href="/contact-us">Contact Us</Link>
          </section>

          {/* Legal */}
          <section aria-label="Legal links">
            <h3>Legal</h3>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/responsible-gaming">Responsible Usage</Link>
          </section>

          {/* Security */}
          <section aria-label="Security information">
            <h3>Security</h3>
            <div className={styles.security} aria-label="Security badges">
              <b>SSL</b>
              <b>Secure</b>
              <b>Trusted</b>
            </div>
          </section>
        </div>

        <div className={styles.finePrint}>
          This platform is intended for entertainment purposes only. Play
          responsibly and manage your screen time.
          <br />
          © {new Date().getFullYear()} Goplay. All rights reserved. |{" "}
          <Link href="/privacy-policy" style={{ color: "inherit" }}>
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/disclaimer" style={{ color: "inherit" }}>
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
}
