import Link from "next/link";
import { Gamepad2, ShieldCheck, Smartphone, Download } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#0b1120] to-[#020617] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Top */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-bold text-white"
            >
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 p-2 shadow-lg shadow-blue-500/25">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <span>
                Go<span className="text-cyan-400">Play</span>
              </span>
            </Link>
            <p className="mt-5 leading-7 text-slate-300">
              Goplay is a modern mobile gaming platform designed for smooth
              gameplay, fast performance, lightweight experience, and easy
              navigation for Android users.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full border border-slate-700 p-3 transition hover:border-blue-500 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full border border-slate-700 p-3 transition hover:border-pink-500 hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                aria-label="X"
                className="rounded-full border border-slate-700 p-3 transition hover:border-white hover:bg-white hover:text-black hover:shadow-lg hover:shadow-white/20"
              >
                <FaXTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                Home
              </Link>
              <Link href="/about-us" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                About Us
              </Link>
              <Link href="/app-download-guide" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                Download Guide
              </Link>
              <Link href="/faq" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                FAQ
              </Link>
              <Link href="/contact-us" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                Contact
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Resources
            </h3>
            <div className="flex flex-col gap-3">
              <Link href="/blog" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                Blog
              </Link>
              <Link href="/privacy-policy" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                Privacy Policy
              </Link>
              <Link href="/disclaimer" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                Disclaimer
              </Link>
              <Link href="/responsible-gaming" className="text-slate-300 transition hover:text-cyan-400 hover:underline underline-offset-2">
                Responsible Usage
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Why GoPlay?
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3 transition hover:bg-white/10">
                <Download className="text-cyan-400" size={20} />
                <span className="text-slate-300">Fast APK Download</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3 transition hover:bg-white/10">
                <Smartphone className="text-cyan-400" size={20} />
                <span className="text-slate-300">Android Optimized</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3 transition hover:bg-white/10">
                <ShieldCheck className="text-cyan-400" size={20} />
                <span className="text-slate-300">Secure Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-5 text-center text-sm text-slate-400 md:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">GoPlay</span>
            . All Rights Reserved.
          </p>
          <p className="max-w-xl text-slate-300">
            GoPlay is designed for entertainment purposes only. Please play
            responsibly, manage your screen time, and download the application
            only from trusted sources.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="transition hover:text-cyan-400 hover:underline underline-offset-2"
            >
              Privacy
            </Link>
            <Link
              href="/disclaimer"
              className="transition hover:text-cyan-400 hover:underline underline-offset-2"
            >
              Disclaimer
            </Link>
            <Link
              href="/responsible-gaming"
              className="transition hover:text-cyan-400 hover:underline underline-offset-2"
            >
              Responsible Usage
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}