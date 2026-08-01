import type { Metadata } from "next";
import Link from "next/link";
import styles from "../page.module.css";
import { Footer, Header } from "../components";
import { Breadcrumbs, JsonLd, SectionHeader, breadcrumbSchema } from "../ui";

export const metadata: Metadata = {
  title: "About Goplay – Who We Are",
  description:
    "Learn about Goplay — a mobile gaming platform designed for entertainment and interactive gameplay on Android. Our mission, values, and approach to responsible usage.",
  alternates: { canonical: "https://goplay11game.net/about-us" },
};

const values = [
  ["🎮", "Entertainment First",   "Goplay is built for enjoyment. Every feature, category, and interface decision is made with the player's experience in mind."],
  ["📱", "Mobile-First Design",   "The platform is designed from the ground up for Android — touch controls, lightweight performance, and fast navigation are built in, not bolted on."],
  ["🛡️", "Safe & Trusted",        "We guide users to download only from trusted sources, protect their credentials, and keep their devices secure throughout their experience."],
  ["🧭", "Clear Information",     "This site exists to explain the platform clearly — download steps, features, FAQs, and troubleshooting — so users can make informed decisions."],
  ["⚡", "Performance Focus",     "Smooth gameplay and fast loading are not optional features. They are the baseline Goplay is measured against with every update."],
  ["♿", "Accessible Experience", "Navigation, content hierarchy, and interface elements are designed to work for all users regardless of device age or ability."],
];

const platformFeatures = [
  ["Casual Games",   "Easy-to-learn titles suitable for all skill levels and quick sessions."],
  ["Card Games",     "Classic and modern card-based games with strategic depth."],
  ["Strategy Games", "Category requiring forward thinking and tactical decision-making."],
  ["Skill Games",    "Titles that reward practice and improve with repeated play."],
  ["Quick Play",     "Short-format games designed for on-the-go entertainment."],
];

const stats = [
  ["5M+",  "Active players on the platform"],
  ["5",    "Gaming categories available"],
  ["⚡",   "Fast app loading speed"],
  ["📱",   "Android optimised"],
];

export default function Page() {
  const jsonLd = [
    breadcrumbSchema("About Us", "/about-us"),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Goplay",
      url: "https://goplay11game.net/about-us",
      description:
        "Goplay is a mobile gaming platform designed for entertainment and interactive gameplay on Android.",
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <main id="main-content" className={styles.innerPage}>

        {/* Breadcrumb */}
        <div className={styles.container}>
          <Breadcrumbs current="About Us" />
        </div>

        {/* Hero */}
        <section className={styles.pageHero} aria-label="Page hero">
          <div className={styles.container}>
            <h1>About Goplay</h1>
            <p>
              A mobile gaming platform designed for entertainment and interactive
              gameplay — fast, lightweight, and built for Android.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className={styles.contentSection} aria-label="Platform mission">
          <div className={styles.container}>
            <div className={styles.twoCol}>
              <div>
                <h2>What is Goplay?</h2>
                <p>
                  Goplay is a mobile gaming platform designed for entertainment and
                  interactive gameplay. The app is mainly used on Android devices and
                  provides users with access to different gaming categories through a
                  simple and fast interface.
                </p>
                <p style={{ marginTop: 16 }}>
                  Users prefer Goplay because it combines smooth performance with an
                  interface that doesn&apos;t require a learning curve. Whether you
                  have five minutes or an hour, the platform is ready to deliver a
                  comfortable gaming experience.
                </p>
                <p style={{ marginTop: 16 }}>
                  This website — Goplay11Game.net — is the resource hub for the
                  platform. It provides a download guide, installation instructions,
                  feature information, troubleshooting, security guidance, and answers
                  to common questions.
                </p>
              </div>

              {/* Quick stats */}
              <div className={styles.metricGrid} style={{ gridTemplateColumns: "1fr 1fr", alignContent: "start" }}>
                {stats.map(([val, label]) => (
                  <article className={styles.metric} key={label}>
                    <span aria-hidden="true">{val}</span>
                    <small>{label}</small>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section
          className={styles.contentSection}
          style={{ background: "var(--surface-alt, #f3f4f5)", paddingTop: 48 }}
          aria-label="Our values"
        >
          <div className={styles.container}>
            <SectionHeader
              label="OUR VALUES"
              title="What Drives the Goplay Experience"
              subtitle="Six principles that shape how the platform is built, maintained, and documented."
            />
            <div className={styles.guideGrid} role="list">
              {values.map(([icon, title, body]) => (
                <article className={styles.contentCard} key={title} role="listitem">
                  <span className={styles.icon} aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Game categories */}
        <section className={styles.contentSection} aria-label="Gaming categories">
          <div className={styles.container}>
            <h2>Gaming Categories</h2>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 24 }}>
              Goplay currently provides access to five gaming categories. Availability
              may vary — check the in-app dashboard for the latest selection.
            </p>
            <table className={styles.table} aria-label="Gaming categories table">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {platformFeatures.map(([cat, desc]) => (
                  <tr key={cat}>
                    <th scope="row">{cat}</th>
                    <td>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Responsible usage */}
        <section className={styles.contentSection} aria-label="Responsible usage">
          <div className={styles.container}>
            <div className={styles.responsibleBox} role="note">
              <div className={styles.responsibleIcon} aria-hidden="true">⚠️</div>
              <div>
                <h2>Responsible Usage</h2>
                <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 16 }}>
                  Goplay is designed for entertainment purposes only. We encourage
                  all users to:
                </p>
                <ul className={styles.responsibleList}>
                  {[
                    "Manage screen time and take regular breaks",
                    "Keep account credentials private and secure",
                    "Download only from official, trusted sources",
                    "Use the app in a way that complements daily life",
                    "Reach out for support if gaming feels compulsive",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Company info placeholder */}
        <section className={styles.contentSection} id="company" aria-label="Company information">
          <div className={styles.container}>
            <div className={styles.notice} role="note">
              <h2>Company Information</h2>
              <p>
                <strong>[INSERT REAL COMPANY INFO]</strong> — Add the operator&apos;s
                verified legal entity name, registration details, registered address,
                and contact information here before publishing to production.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.contentSection} aria-label="Get started">
          <div className={styles.container} style={{ textAlign: "center" }}>
            <h2>Ready to Start Playing?</h2>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 28, maxWidth: 560, margin: "0 auto 28px" }}>
              Follow our step-by-step download guide to get Goplay running on your
              Android device safely and quickly.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link className={styles.primaryButton} href="/app-download-guide">
                Download Guide <b>→</b>
              </Link>
              <Link className={styles.secondaryButton}
                    href="/faq"
                    style={{ background: "transparent", border: "2px solid var(--navy)", color: "var(--navy)" }}>
                Read the FAQ
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
