import type { Metadata } from "next";
import Link from "next/link";
import styles from "../../page.module.css";
import { Breadcrumbs, JsonLd, SectionHeader, breadcrumbSchema } from "../../ui";

export const metadata: Metadata = {
  title: "Responsible Usage – Goplay",
  description:
    "Goplay is for entertainment only. Learn how to manage screen time, protect your account, play safely, and find support resources.",
  alternates: { canonical: "https://goplay11game.net/responsible-gaming" },
};

const tips = [
  {
    icon: "⏱️",
    title: "Manage Screen Time",
    body: "Set a daily time limit for gaming and use your device's built-in screen time tools to track and enforce it. Regular breaks improve focus and wellbeing.",
  },
  {
    icon: "☕",
    title: "Take Breaks",
    body: "Step away from the screen every 30–60 minutes. Rest your eyes, move around, and return to gaming refreshed. Short breaks maintain enjoyment over time.",
  },
  {
    icon: "🔐",
    title: "Protect Your Account",
    body: "Use a strong, unique password. Never share your login credentials, OTPs, or PINs with anyone — including people claiming to be support staff.",
  },
  {
    icon: "⚖️",
    title: "Balance with Daily Life",
    body: "Gaming should complement your daily routine, not replace important activities. If you notice gaming affecting work, sleep, or relationships, take a step back.",
  },
  {
    icon: "📥",
    title: "Download Safely",
    body: "Only download the Goplay APK from official or trusted sources. Untrusted APKs can contain malware that harms your device.",
  },
  {
    icon: "💬",
    title: "Seek Support When Needed",
    body: "If gaming feels compulsive or is causing distress, speak to someone you trust or contact a digital wellbeing helpline in your country.",
  },
];

const signals = [
  "Spending more time gaming than you planned",
  "Feeling irritable or anxious when not playing",
  "Gaming to avoid responsibilities or problems",
  "Neglecting sleep, meals, or social activities",
  "Continuing to play despite wanting to stop",
];

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("Responsible Usage", "/responsible-gaming")} />
      <main id="main-content" className={styles.innerPage}>
        <div className={styles.container}>
          <Breadcrumbs current="Responsible Usage" />
        </div>

        <section className={styles.pageHero} aria-label="Page hero">
          <div className={styles.container}>
            <h1>Responsible Usage</h1>
            <p>
              Goplay is designed for entertainment. These guidelines help you enjoy
              it safely and keep gaming in healthy balance.
            </p>
          </div>
        </section>

        {/* Tips grid */}
        <section className={styles.contentSection} aria-label="Responsible usage tips">
          <div className={styles.container}>
            <SectionHeader
              label="GUIDELINES"
              title="Play Responsibly"
              subtitle="Six practical steps to keep your gaming experience positive and balanced."
            />
            <div className={styles.guideGrid} role="list">
              {tips.map(({ icon, title, body }) => (
                <article className={styles.contentCard} key={title} role="listitem">
                  <span className={styles.icon} aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Warning signs */}
        <section
          className={styles.contentSection}
          style={{ background: "var(--surface-alt)" }}
          aria-label="Warning signs"
        >
          <div className={styles.container}>
            <div className={styles.responsibleBox} role="note">
              <div className={styles.responsibleIcon} aria-hidden="true">⚠️</div>
              <div>
                <h2>Signs to Watch For</h2>
                <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 16 }}>
                  If you recognise any of the following patterns in yourself or
                  someone you know, consider taking a break and speaking to someone:
                </p>
                <ul className={styles.responsibleList}>
                  {signals.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* For parents */}
        <section className={styles.contentSection} aria-label="For parents and guardians">
          <div className={styles.container}>
            <div className={styles.twoCol}>
              <div>
                <h2>For Parents &amp; Guardians</h2>
                <p>
                  This website and the Goplay platform are intended for users aged 18
                  and above. If you are a parent or guardian, we recommend:
                </p>
                <ul style={{ paddingLeft: 20, display: "grid", gap: 8, marginTop: 12 }}>
                  {[
                    "Using parental controls available on Android devices",
                    "Having open conversations about responsible app use",
                    "Monitoring app download and install activity on shared devices",
                    "Setting agreed screen time limits with your family",
                  ].map((item) => (
                    <li key={item} style={{ color: "var(--body)", fontSize: 15, lineHeight: 1.6 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>Account Security</h2>
                <p>
                  Keeping your account secure is part of responsible usage. Follow
                  these steps:
                </p>
                <ul style={{ paddingLeft: 20, display: "grid", gap: 8, marginTop: 12 }}>
                  {[
                    "Use a unique password not used on other services",
                    "Never share credentials with anyone",
                    "Log out on shared or public devices",
                    "Download updates only from official sources",
                    "Contact in-app support if you suspect unauthorised access",
                  ].map((item) => (
                    <li key={item} style={{ color: "var(--body)", fontSize: 15, lineHeight: 1.6 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className={styles.contentSection} aria-label="Platform disclaimer">
          <div className={styles.container}>
            <div className={styles.notice} role="note">
              <h2>Platform Disclaimer</h2>
              <p>
                Goplay is a mobile gaming platform intended solely for entertainment.
                It is not a gambling platform. No real money is wagered through the
                app. Any promotional offers or rewards described on this site are
                subject to current platform terms and availability. Always review
                in-app details before participating.
              </p>
              <p style={{ marginTop: 12 }}>
                If you have concerns about your usage patterns, please reach out to a
                digital wellbeing resource or mental health service in your region.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.contentSection} aria-label="Further resources">
          <div className={styles.container} style={{ textAlign: "center" }}>
            <h2>More Helpful Resources</h2>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 28, maxWidth: 520, margin: "0 auto 28px" }}>
              Explore our other guides for safe downloading, common questions, and
              how to get support.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className={styles.primaryButton} href="/faq">
                Read the FAQ <b>→</b>
              </Link>
              <Link
                className={styles.secondaryButton}
                href="/contact-us"
                style={{ background: "transparent", border: "2px solid var(--navy)", color: "var(--navy)" }}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
