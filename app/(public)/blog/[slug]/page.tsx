import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../../page.module.css";
import { Breadcrumbs, JsonLd, breadcrumbSchema } from "../../../ui";
import { posts, type Post } from "../posts";

/* ── Static params ────────────────────────────────────────────────────── */
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

/* ── Metadata ─────────────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://goplay11game.net/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

/* ── Article content map ──────────────────────────────────────────────── */
type ArticleContent = {
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  conclusion: string;
};

const content: Record<string, ArticleContent> = {
  "how-to-download-goplay-apk": {
    intro:
      "Downloading an APK outside the Google Play Store requires a few extra steps on Android, but when done correctly from an official source it is safe and straightforward. This guide walks through each step clearly.",
    sections: [
      {
        heading: "Why APK Downloads Require Extra Steps",
        paragraphs: [
          "Android restricts installs from sources outside the Play Store by default. This protection exists to prevent malware. You temporarily allow installation for a specific app, then disable the permission again — the whole process takes under a minute.",
          "The most important rule: always start from the official Goplay website or this download guide. Third-party APK sites are not verified and carry a much higher risk of modified or malicious files.",
        ],
      },
      {
        heading: "Before You Download",
        paragraphs: [
          "Check that you have enough free storage space for the APK and any future updates. Connect to a stable Wi-Fi network to avoid a partial download. Charge your device to at least 30 % so the install process is not interrupted.",
          "Note your Android version (Settings → About Phone) and confirm it meets the minimum requirement listed on the official Goplay download page.",
        ],
      },
      {
        heading: "Enabling Unknown Sources Safely",
        paragraphs: [
          "Go to Settings → Security → Install Unknown Apps. Select the browser or file manager you are using to download the APK. Toggle Allow from this source. This applies only to that app — other apps cannot install unknown packages.",
          "Once Goplay is installed, return to the same settings screen and disable the permission. This is best practice and only takes a moment.",
        ],
      },
      {
        heading: "After Installation",
        paragraphs: [
          "Open Goplay from your home screen and complete the registration or log-in process. Use a strong, unique password and keep it private. If the app asks for an OTP during verification, enter it only within the app — never share it with anyone else.",
        ],
      },
    ],
    conclusion:
      "Following these steps keeps your device secure and your account safe. Bookmark this guide for reference when future updates are released.",
  },

  "goplay-gaming-categories-explained": {
    intro:
      "Goplay organises its library into five distinct categories, each designed for a different style of play. Understanding what each category offers helps you find the right game faster.",
    sections: [
      {
        heading: "Casual Games",
        paragraphs: [
          "Casual games are the most accessible category. They are designed to be picked up instantly — minimal learning curve, short sessions, and simple controls. They are suitable for any skill level and ideal for short breaks.",
          "If you are new to Goplay, starting with the Casual category lets you get comfortable with the app interface before exploring more demanding titles.",
        ],
      },
      {
        heading: "Card Games",
        paragraphs: [
          "The Card Games category includes both classic and modern card-based titles. Some require memorisation and pattern recognition; others introduce unique rule sets. Most have a quick-start tutorial accessible from the game menu.",
        ],
      },
      {
        heading: "Strategy Games",
        paragraphs: [
          "Strategy games reward planning and forward thinking. Sessions tend to be longer, and outcomes depend more heavily on decision quality than reflex speed. If you enjoy thinking through problems, this is the category to explore.",
        ],
      },
      {
        heading: "Skill Games",
        paragraphs: [
          "Skill games are designed around measurable improvement. Performance tends to increase with practice, and many titles track progress over time. These are popular with players who enjoy a clear feedback loop.",
        ],
      },
      {
        heading: "Quick Play",
        paragraphs: [
          "Quick Play is the on-the-go category. Sessions are deliberately short — typically two to five minutes — making them ideal for commutes or brief pauses in the day. The controls are simple and games resolve quickly.",
        ],
      },
    ],
    conclusion:
      "Category availability can change with platform updates. Check the in-app dashboard for the current selection and any newly added titles.",
  },

  "goplay-performance-tips": {
    intro:
      "Goplay is designed to run efficiently on a wide range of Android devices. That said, a few straightforward adjustments can make a noticeable difference to loading speed and gameplay smoothness.",
    sections: [
      {
        heading: "1. Close Background Apps Before Playing",
        paragraphs: [
          "Background apps consume RAM and CPU resources even when you are not actively using them. Before launching Goplay, swipe away apps you are not using. On most Android devices, the recent apps button shows everything currently running.",
          "A device with more available RAM delivers consistently smoother frame performance. This is the single highest-impact step for most users.",
        ],
      },
      {
        heading: "2. Keep Goplay Updated",
        paragraphs: [
          "Each update typically includes performance improvements and bug fixes alongside new features. Download updates from the same official source you used for the original installation.",
          "Avoid skipping multiple versions — updating regularly is easier than resolving compatibility issues that can appear after a large version jump.",
        ],
      },
      {
        heading: "3. Use a Stable Internet Connection",
        paragraphs: [
          "A weak or fluctuating connection causes lag in network-dependent game modes. Use Wi-Fi where possible, or ensure a strong mobile data signal. Restarting your router or toggling airplane mode can resolve many temporary connectivity issues.",
        ],
      },
      {
        heading: "4. Restart Your Device Periodically",
        paragraphs: [
          "Android devices accumulate cached processes over time. A full restart clears these and gives the operating system a clean state to work from. If Goplay has been running slowly for several sessions, a device restart often resolves it.",
        ],
      },
      {
        heading: "5. Free Up Storage Space",
        paragraphs: [
          "When device storage is nearly full, Android performance degrades across all apps. Aim to keep at least 10–15 % of storage free. Delete unused apps, clear media you have already backed up, and check for large files in your Downloads folder.",
        ],
      },
    ],
    conclusion:
      "Most performance issues on Goplay trace back to one of these five factors. Work through the list from the top and you should notice an improvement after the first or second step.",
  },
};

/* ── Page ─────────────────────────────────────────────────────────────── */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: Post | undefined = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const article = content[slug];
  if (!article) notFound();

  const jsonLd = [
    breadcrumbSchema(post.title, `/blog/${slug}`),
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { "@type": "Organization", name: "Goplay" },
      publisher: { "@type": "Organization", name: "Goplay", url: "https://goplay11game.net" },
      url: `https://goplay11game.net/blog/${slug}`,
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
        <section className={styles.pageHero} aria-label="Article hero">
          <div className={styles.container}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
              <span
                style={{
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.3)",
                  borderRadius: 12,
                  color: "#deddf9",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "3px 12px",
                  letterSpacing: ".4px",
                  textTransform: "uppercase",
                }}
              >
                {post.category}
              </span>
              <time
                dateTime={post.date}
                style={{ color: "#c0bff1", fontSize: 13 }}
              >
                {post.dateLabel}
              </time>
            </div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </div>
        </section>

        {/* Article body */}
        <article className={styles.contentSection} aria-label="Article content">
          <div className={styles.container}>
            <div className={styles.policyContent}>

              <p style={{ fontSize: 16, lineHeight: 1.75, color: "var(--body)", marginBottom: 32 }}>
                {article.intro}
              </p>

              {article.sections.map((section) => (
                <div key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              ))}

              <h2>Conclusion</h2>
              <p>{article.conclusion}</p>

              <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "40px 0 32px" }} />

              {/* Internal links */}
              <div
                style={{
                  background: "var(--surface-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "24px 28px",
                }}
              >
                <h3 style={{ color: "var(--navy)", marginTop: 0 }}>Related Resources</h3>
                <ul style={{ paddingLeft: 20, display: "grid", gap: 8 }}>
                  <li>
                    <Link href="/app-download-guide" style={{ color: "var(--orange)", fontWeight: 700 }}>
                      Full Goplay App Download Guide →
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" style={{ color: "var(--orange)", fontWeight: 700 }}>
                      Goplay FAQ — Common Questions Answered →
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" style={{ color: "var(--orange)", fontWeight: 700 }}>
                      ← Back to all articles
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </article>

      </main>
    </>
  );
}
