import type { Metadata } from "next";
import Link from "next/link";
import styles from "../../page.module.css";
import { Breadcrumbs, JsonLd, SectionHeader, breadcrumbSchema } from "../../ui";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Goplay Blog – Guides, Tips & Platform Updates",
  description:
    "Guides, tips, and platform information for Goplay users — download instructions, gaming category overviews, performance advice, and more.",
  alternates: { canonical: "https://goplay11game.net/blog" },
};

export default function Page() {
  const jsonLd = [
    breadcrumbSchema("Blog", "/blog"),
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Goplay Blog",
      url: "https://goplay11game.net/blog",
      description:
        "Guides, tips, and platform information for Goplay users.",
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        datePublished: p.date,
        description: p.excerpt,
        url: `https://goplay11game.net/blog/${p.slug}`,
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main-content" className={styles.innerPage}>

        {/* Breadcrumb */}
        <div className={styles.container}>
          <Breadcrumbs current="Blog" />
        </div>

        {/* Hero */}
        <section className={styles.pageHero} aria-label="Page hero">
          <div className={styles.container}>
            <h1>Goplay Blog</h1>
            <p>
              Practical guides, platform tips, and installation help for Goplay
              users on Android.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className={styles.contentSection} aria-label="Blog posts">
          <div className={styles.container}>
            <SectionHeader
              label="LATEST ARTICLES"
              title="Guides & Platform Information"
              subtitle="Everything you need to download, install, and get the most from Goplay."
            />
            <div className={styles.blogGrid} role="list">
              {posts.map((post) => (
                <article
                  className={styles.articleCard}
                  key={post.slug}
                  role="listitem"
                  aria-label={post.title}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <time dateTime={post.date} className={styles.articleCard.toString()}>
                      {post.dateLabel}
                    </time>
                    <span
                      style={{
                        background: "var(--surface-alt)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        color: "var(--muted)",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 10px",
                        letterSpacing: ".3px",
                      }}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h2>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`}>
                    Read article →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.contentSection} aria-label="Download CTA">
          <div className={styles.container}>
            <div className={styles.notice} style={{ background: "var(--navy)", color: "#fff", border: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                <div>
                  <h3 style={{ color: "#fff", margin: "0 0 8px" }}>Ready to Install Goplay?</h3>
                  <p style={{ color: "rgba(255,255,255,.8)", margin: 0, fontSize: 14 }}>
                    Follow our step-by-step guide to download and install safely on Android.
                  </p>
                </div>
                <Link className={styles.primaryButton} href="/app-download-guide">
                  Download Guide <b>→</b>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
