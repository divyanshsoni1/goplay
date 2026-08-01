import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "./ui";

/* ─── Site-wide metadata defaults ──────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://goplay11game.net"),
  title: {
    default: "Goplay – Mobile Gaming App | Download, Play & Explore",
    template: "%s | Goplay",
  },
  description:
    "Goplay is a mobile gaming platform for Android with smooth gameplay, fast loading, and multiple gaming categories. Download the APK guide, explore features, and get started today.",
  keywords: [
    "Goplay",
    "Goplay app",
    "mobile gaming",
    "Android game app",
    "gaming platform",
    "Goplay download",
    "APK download",
  ],
  authors: [{ name: "Goplay" }],
  creator: "Goplay",
  publisher: "Goplay",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://goplay11game.net",
    siteName: "Goplay",
    title: "Goplay – Mobile Gaming App | Download, Play & Explore",
    description:
      "A mobile gaming platform with smooth gameplay, fast loading, and multiple categories. Download guide, features, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Goplay mobile gaming platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goplay – Mobile Gaming App",
    description:
      "Smooth gameplay, fast loading, and multiple gaming categories. Get the Goplay app on Android.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://goplay11game.net",
  },
};

/* ─── Viewport ──────────────────────────────────────────────────────────── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000666",
};

/* ─── Site-wide JSON-LD ─────────────────────────────────────────────────── */
const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Goplay",
    url: "https://goplay11game.net/",
    logo: "https://goplay11game.net/logo.png",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@goplay11game.net",
      contactType: "customer support",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Goplay",
    url: "https://goplay11game.net/",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://goplay11game.net/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  },
];

/* ─── Root Layout ───────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <JsonLd data={siteJsonLd} />
        {children}
      </body>
    </html>
  );
}
