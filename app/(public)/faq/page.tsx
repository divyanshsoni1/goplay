import type { Metadata } from "next";
import styles from "../../page.module.css";
import { Breadcrumbs, JsonLd, SectionHeader, breadcrumbSchema } from "../../ui";
import FaqAccordion from "./faq-accordion";
import { faqs } from "./faqs-data";

export const metadata: Metadata = {
  title: "Goplay FAQ – Common Questions Answered",
  description:
    "Answers to common Goplay questions: is it free, Android support, how to install, registration, game categories, updates, login issues, and more.",
  alternates: { canonical: "https://goplay11game.net/faq" },
};

export default function Page() {
  const breadcrumb = breadcrumbSchema("FAQ", "/faq");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumb, faqSchema]} />
      <main id="main-content" className={styles.innerPage}>

        {/* Breadcrumb */}
        <div className={styles.container}>
          <Breadcrumbs current="FAQ" />
        </div>

        {/* Hero */}
        <section className={styles.pageHero} aria-label="Page hero">
          <div className={styles.container}>
            <h1>Frequently Asked Questions</h1>
            <p>
              Clear answers to the most common Goplay questions. For the latest
              platform details always refer to the official app or channel.
            </p>
          </div>
        </section>

        {/* FAQ accordion */}
        <section className={styles.contentSection} aria-label="FAQ accordion">
          <div className={styles.container}>
            <SectionHeader
              label="YOUR QUESTIONS"
              title="Everything You Want to Know About Goplay"
            />
            <FaqAccordion items={faqs} />
          </div>
        </section>

        {/* Quick links */}
        <section className={styles.contentSection} aria-label="Helpful links">
          <div className={styles.container}>
            <div className={styles.guideGrid}>
              <div className={styles.contentCard}>
                <span className={styles.icon} aria-hidden="true">📥</span>
                <h3>Download Guide</h3>
                <p>
                  Step-by-step instructions for safely downloading and installing
                  the Goplay APK on Android.
                </p>
                <a href="/app-download-guide">Read the guide →</a>
              </div>
              <div className={styles.contentCard}>
                <span className={styles.icon} aria-hidden="true">📖</span>
                <h3>Blog &amp; Guides</h3>
                <p>
                  In-depth articles covering installation tips, gaming categories,
                  performance, and platform updates.
                </p>
                <a href="/blog">Browse articles →</a>
              </div>
              <div className={styles.contentCard}>
                <span className={styles.icon} aria-hidden="true">💬</span>
                <h3>Contact Support</h3>
                <p>
                  Can&apos;t find your answer here? Send us a message and we&apos;ll
                  get back to you as soon as possible.
                </p>
                <a href="/contact-us">Get in touch →</a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
