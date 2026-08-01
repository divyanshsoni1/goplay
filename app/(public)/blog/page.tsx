// app/blog/page.tsx
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
        <section className={styles.pageHero} aria-label="Page hero" style={{ paddingBottom: 32 }}>
          <div className={styles.container}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: 680,
              margin: "0 auto",
            }}>
              <span style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--primary, #2563eb)",
                background: "var(--primary-soft, #dbeafe)",
                padding: "4px 16px",
                borderRadius: 100,
                marginBottom: 20,
              }}>
                Blog & Resources
              </span>
              <h1 style={{
                fontSize: "clamp(2.4rem, 5vw, 3.2rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}>
                Guides, Tips & <span style={{ color: "var(--primary, #2563eb)" }}>Platform</span> Updates
              </h1>
              <p style={{
                fontSize: "1.1rem",
                lineHeight: 1.7,
                color: "var(--body, #4b5563)",
                maxWidth: 540,
                margin: "0 auto",
              }}>
                Practical guides, platform tips, and installation help for Goplay
                users on Android.
              </p>
            </div>
          </div>
        </section>

        {/* Posts grid */}
        <section className={styles.contentSection} aria-label="Blog posts" style={{ paddingTop: 0 }}>
          <div className={styles.container}>
            <SectionHeader
              label="LATEST ARTICLES"
              title="Guides & Platform Information"
              subtitle="Everything you need to download, install, and get the most from Goplay."
            />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 28,
              marginTop: 32,
            }} role="list">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  role="listitem"
                  aria-label={post.title}
                  style={{
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: "28px 24px",
                    border: "1px solid var(--border-light, #f0f0f0)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="blogCard"
                >
                  {/* Meta row */}
                  <div style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 14,
                    flexWrap: "wrap",
                  }}>
                    <time dateTime={post.date} style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "var(--muted, #6b7280)",
                      letterSpacing: "0.02em",
                    }}>
                      {post.dateLabel}
                    </time>
                    <span style={{
                      background: "var(--surface-alt, #f3f4f6)",
                      border: "1px solid var(--border-light, #e5e7eb)",
                      borderRadius: 100,
                      color: "var(--muted, #6b7280)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      padding: "2px 12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}>
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    marginBottom: 10,
                    letterSpacing: "-0.01em",
                  }}>
                    <Link href={`/blog/${post.slug}`} style={{
                      textDecoration: "none",
                      color: "var(--heading, #111827)",
                      transition: "color 0.2s",
                    }}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p style={{
                    fontSize: "0.92rem",
                    lineHeight: 1.7,
                    color: "var(--body, #4b5563)",
                    margin: "0 0 18px 0",
                    flex: 1,
                  }}>
                    {post.excerpt}
                  </p>

                  {/* Read link */}
                  <Link href={`/blog/${post.slug}`} style={{
                    color: "var(--primary, #2563eb)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    transition: "gap 0.2s",
                  }}>
                    Read article →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.contentSection} aria-label="Download CTA" style={{ paddingTop: 0, paddingBottom: 56 }}>
          <div className={styles.container}>
            <div style={{
              background: "var(--navy, #0f172a)",
              borderRadius: 24,
              padding: "36px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 20,
              boxShadow: "0 8px 30px rgba(15, 23, 42, 0.15)",
            }}>
              <div>
                <h3 style={{
                  color: "#fff",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  margin: "0 0 6px",
                  letterSpacing: "-0.01em",
                }}>
                  Ready to Install Goplay?
                </h3>
                <p style={{
                  color: "rgba(255,255,255,0.8)",
                  margin: 0,
                  fontSize: "0.95rem",
                }}>
                  Follow our step-by-step guide to download and install safely on Android.
                </p>
              </div>
              <Link
                href="/app-download-guide"
                style={{
                  background: "#ffffff",
                  color: "var(--navy, #0f172a)",
                  padding: "10px 28px",
                  borderRadius: 40,
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "transform 0.1s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                Download Guide →
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Style block for blog card hover */}
      <style>{`
        .blogCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.06);
        }
        .blogCard:hover h2 a {
          color: var(--primary, #2563eb);
        }
        .blogCard:hover a:last-child {
          gap: 8px;
        }
      `}</style>
    </>
  );
}