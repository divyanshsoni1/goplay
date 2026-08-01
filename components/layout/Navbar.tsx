"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks: [string, string][] = [
  ["App Download Guide", "/app-download-guide"],
  ["Blog", "/blog"],
  ["FAQ", "/faq"],
  ["About Us", "/about-us"],
  ["Contact Us", "/contact-us"],
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-4 focus:text-black"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-gray-200/30 bg-white/70 backdrop-blur-sm transition-shadow">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-blue-600"
            aria-label="Goplay – home"
          >
            Goplay
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 md:flex" role="list">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                role="listitem"
                className={`text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/app-download-guide"
            className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 md:inline-block"
            aria-label="Download the Goplay app"
          >
            Download App
          </Link>

          {/* Mobile hamburger */}
          <button
            className="inline-flex items-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
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
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 border-t border-gray-200/30" : "max-h-0"
          } bg-white/80 backdrop-blur-sm md:hidden`}
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          <div className="flex flex-col space-y-2 px-4 pb-4 pt-2">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`}
                aria-current={isActive(href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/app-download-guide"
              className="mt-2 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMenuOpen(false)}
            >
              Download App
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}