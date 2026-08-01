"use client";

/**
 * components/layout/Navbar.tsx
 *
 * Public navbar with full auth-state awareness.
 *
 * Auth states handled:
 *   - "loading"       → skeleton placeholder (no flash of wrong UI)
 *   - unauthenticated → Login (ghost) + Register (filled) buttons
 *   - authenticated   → avatar / initials + user name + Logout button
 *
 * SessionProvider is already in app/layout.tsx so useSession() works here.
 */

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

/* ── Nav links ────────────────────────────────────────────────────────── */

const navLinks: [string, string][] = [
  ["App Download Guide", "/app-download-guide"],
  ["Blog",               "/blog"],
  ["FAQ",                "/faq"],
  ["About Us",           "/about-us"],
  ["Contact Us",         "/contact-us"],
];

/* ── Small reusable pieces ────────────────────────────────────────────── */

/** Orange "◆" bullet used on active mobile links */
function ActiveDot() {
  return (
    <span aria-hidden="true" className="text-orange-500 text-xs leading-none">
      ◆
    </span>
  );
}

/** Avatar circle — image if available, initials otherwise */
function Avatar({
  image,
  name,
  email,
  size = 28,
}: {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  size?: number;
}) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() ?? "U";

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.43 }}
      className="flex items-center justify-center rounded-full bg-orange-500 font-bold text-white flex-shrink-0"
    >
      {initials}
    </span>
  );
}

/** Skeleton bar — prevents layout shift while session loads */
function AuthSkeleton() {
  return (
    <div
      className="hidden md:flex items-center gap-2"
      aria-hidden="true"
      aria-label="Loading authentication state"
    >
      <span className="h-8 w-16 animate-pulse rounded-md bg-gray-200" />
      <span className="h-8 w-20 animate-pulse rounded-md bg-gray-200" />
    </div>
  );
}

/* ── Desktop auth section ─────────────────────────────────────────────── */

function DesktopAuth({
  onLogout,
  loggingOut,
}: {
  onLogout: () => void;
  loggingOut: boolean;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return <AuthSkeleton />;

  /* Guest */
  if (!session?.user) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Link
          href="/login"
          aria-label="Log in to your account"
          aria-current={pathname === "/login" ? "page" : undefined}
          className={`rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#000666]
            ${pathname === "/login"
              ? "border-[#000666] bg-[#000666] text-white"
              : "border-[#000666] bg-transparent text-[#000666] hover:bg-[#000666] hover:text-white"
            }`}
        >
          Login
        </Link>
        <Link
          href="/register"
          aria-label="Create a new account"
          aria-current={pathname === "/register" ? "page" : undefined}
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#ff5b16]
            ${pathname === "/register"
              ? "bg-[#d94a10]"
              : "bg-[#ff5b16] hover:bg-[#d94a10]"
            }`}
        >
          Register
        </Link>
      </div>
    );
  }

  /* Authenticated */
  const user = session.user;
  const firstName = user.name?.split(" ")[0] ?? "Account";

  return (
    <div className="hidden md:flex items-center gap-3">
      {/* User chip */}
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm">
        <Avatar image={user.image} name={user.name} email={user.email} size={26} />
        <span className="max-w-[100px] truncate text-sm font-semibold text-gray-800">
          {firstName}
        </span>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        aria-busy={loggingOut}
        aria-label={loggingOut ? "Signing out…" : "Sign out of your account"}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loggingOut ? (
          <span className="flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round"
              />
            </svg>
            Signing out…
          </span>
        ) : (
          "Sign out"
        )}
      </button>
    </div>
  );
}

/* ── Mobile auth section (inside drawer) ─────────────────────────────── */

function MobileAuth({
  onLogout,
  loggingOut,
  onClose,
}: {
  onLogout: () => void;
  loggingOut: boolean;
  onClose: () => void;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100" aria-hidden="true">
        <span className="h-11 w-full animate-pulse rounded-md bg-gray-100" />
        <span className="h-11 w-full animate-pulse rounded-md bg-gray-100" />
      </div>
    );
  }

  /* Guest */
  if (!session?.user) {
    return (
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
        <Link
          href="/login"
          aria-label="Log in to your account"
          aria-current={pathname === "/login" ? "page" : undefined}
          onClick={onClose}
          className={`flex min-h-[44px] items-center rounded-md border px-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#000666]
            ${pathname === "/login"
              ? "border-[#000666] bg-[#000666] text-white"
              : "border-[#000666] text-[#000666] hover:bg-[#000666] hover:text-white"
            }`}
        >
          Login
        </Link>
        <Link
          href="/register"
          aria-label="Create a new account"
          aria-current={pathname === "/register" ? "page" : undefined}
          onClick={onClose}
          className={`flex min-h-[44px] items-center justify-center rounded-md text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff5b16]
            ${pathname === "/register"
              ? "bg-[#d94a10]"
              : "bg-[#ff5b16] hover:bg-[#d94a10]"
            }`}
        >
          Register
        </Link>
      </div>
    );
  }

  /* Authenticated */
  const user = session.user;

  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
      {/* User info row */}
      <div className="flex items-center gap-3 rounded-md bg-gray-50 px-3 py-2.5">
        <Avatar image={user.image} name={user.name} email={user.email} size={32} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800">
            {user.name ?? "User"}
          </p>
          <p className="truncate text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Dashboard link */}
      <Link
        href="/dashboard"
        onClick={onClose}
        className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#000666]"
        aria-label="Go to your dashboard"
      >
        Dashboard
      </Link>

      {/* Logout */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onLogout();
        }}
        disabled={loggingOut}
        aria-busy={loggingOut}
        aria-label={loggingOut ? "Signing out…" : "Sign out of your account"}
        className="flex min-h-[44px] items-center rounded-md border border-red-200 px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loggingOut ? (
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Signing out…
          </span>
        ) : (
          "Sign out"
        )}
      </button>
    </div>
  );
}

/* ── Main Navbar export ───────────────────────────────────────────────── */

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  /* Close mobile menu on route change */
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setMenuOpen(false);
      prevPathnameRef.current = pathname;
    }
  }, [pathname]);

  /* Prevent body scroll when menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  /** Centralised logout — prevents double-clicks, handles errors */
  const handleLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      /* signOut typically navigates away; if it throws, reset state */
      setLoggingOut(false);
    }
  }, [loggingOut]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:rounded focus:bg-[#ff5b16] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/90 shadow-sm backdrop-blur-sm"
        role="banner"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex-shrink-0 text-2xl font-extrabold tracking-tight text-[#000666] transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#000666] focus:ring-offset-2 rounded"
            aria-label="Goplay – home"
          >
            Goplay
          </Link>

          {/* ── Desktop nav links ─────────────────────────────────── */}
          <div className="hidden items-center gap-5 md:flex" role="list">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                role="listitem"
                aria-current={isActive(href) ? "page" : undefined}
                className={`text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#000666] focus:ring-offset-1 rounded px-1 py-0.5
                  ${isActive(href)
                    ? "text-[#ff5b16] border-b-2 border-[#ff5b16] pb-0"
                    : "text-gray-600 hover:text-[#000666] border-b-2 border-transparent"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Desktop right side ────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Download CTA */}
            <Link
              href="/app-download-guide"
              aria-label="Download the Goplay app"
              className="rounded-md bg-[#ff5b16] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#d94a10] hover:shadow focus:outline-none focus:ring-2 focus:ring-[#ff5b16] focus:ring-offset-1"
            >
              Download App
            </Link>

            {/* Auth buttons / user chip */}
            <DesktopAuth onLogout={handleLogout} loggingOut={loggingOut} />
          </div>

          {/* ── Mobile hamburger ──────────────────────────────────── */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#000666] md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
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
              className="transition-transform duration-200"
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

        {/* ── Mobile drawer ─────────────────────────────────────────── */}
        <div
          id="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden
            ${menuOpen ? "max-h-[32rem] border-t border-gray-200/60" : "max-h-0"}
            bg-white/95 backdrop-blur-sm`}
        >
          <div className="flex flex-col gap-1 px-4 pb-5 pt-3">
            {/* Nav links */}
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                onClick={closeMenu}
                className={`flex min-h-[44px] items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#000666]
                  ${isActive(href)
                    ? "bg-orange-50 text-[#ff5b16]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#000666]"
                  }`}
              >
                {isActive(href) && <ActiveDot />}
                {label}
              </Link>
            ))}

            {/* Download CTA */}
            <Link
              href="/app-download-guide"
              onClick={closeMenu}
              aria-label="Download the Goplay app"
              className="mt-1 flex min-h-[44px] items-center justify-center rounded-md bg-[#ff5b16] text-sm font-bold text-white transition hover:bg-[#d94a10] focus:outline-none focus:ring-2 focus:ring-[#ff5b16]"
            >
              Download App
            </Link>

            {/* Mobile auth */}
            <MobileAuth
              onLogout={handleLogout}
              loggingOut={loggingOut}
              onClose={closeMenu}
            />
          </div>
        </div>
      </header>
    </>
  );
}
