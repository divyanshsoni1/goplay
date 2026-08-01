import type { Metadata } from "next";
import styles from "../page.module.css";
import { Footer, Header } from "../components";
import { Breadcrumbs, JsonLd, breadcrumbSchema } from "../ui";

export const metadata: Metadata = {
  title: "Privacy Policy – Goplay",
  description:
    "Goplay privacy policy — how we collect, use, and protect information on the Goplay11Game.net website.",
  alternates: { canonical: "https://goplay11game.net/privacy-policy" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("Privacy Policy", "/privacy-policy")} />
      <Header />
      <main id="main-content" className={styles.innerPage}>
        <div className={styles.container}>
          <Breadcrumbs current="Privacy Policy" />
        </div>

        <section className={styles.pageHero} aria-label="Page hero">
          <div className={styles.container}>
            <h1>Privacy Policy</h1>
            <p>How Goplay11Game.net collects, uses, and protects your information.</p>
          </div>
        </section>

        <section className={styles.contentSection} aria-label="Privacy policy content">
          <div className={styles.container}>
            <div className={styles.policyContent}>
              <p className={styles.lastUpdated}>Last updated: August 1, 2026</p>

              <h2>Introduction</h2>
              <p>
                This Privacy Policy describes how Goplay11Game.net (&ldquo;we&rdquo;,
                &ldquo;us&rdquo;, or &ldquo;our&rdquo;) handles information when you
                visit this website. We are committed to protecting your privacy and
                being transparent about our practices.
              </p>

              <h2>Information We Collect</h2>
              <p>We may collect the following categories of information:</p>
              <ul>
                <li>
                  <strong>Contact form submissions:</strong> Name, email address,
                  subject, and message content when you use the Contact Us form.
                </li>
                <li>
                  <strong>Usage data:</strong> Pages visited, time spent, browser
                  type, device type, and referring URL — collected through standard
                  web analytics tools.
                </li>
                <li>
                  <strong>Cookies:</strong> Small files placed on your device to
                  remember preferences and measure traffic. See the Cookies section
                  below.
                </li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>Information collected is used to:</p>
              <ul>
                <li>Respond to contact form enquiries</li>
                <li>Improve website content and navigation</li>
                <li>Analyse site traffic and user behaviour in aggregate</li>
                <li>Ensure the technical operation and security of the website</li>
              </ul>
              <p>
                We do not sell, rent, or trade your personal information with third
                parties for marketing purposes.
              </p>

              <h2>Cookies</h2>
              <p>
                This website may use essential and analytics cookies. Essential cookies
                are required for the website to function. Analytics cookies help us
                understand how visitors use the site. You can disable cookies in your
                browser settings; doing so may affect some website functionality.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                We may use third-party services such as analytics providers. These
                services have their own privacy policies and may collect information
                independently. We are not responsible for the privacy practices of
                third parties.
              </p>

              <h2>Data Retention</h2>
              <p>
                Contact form data is retained only as long as necessary to respond to
                your enquiry. Analytics data is retained in aggregate form and does
                not identify individual users.
              </p>

              <h2>Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have rights to access,
                correct, or delete personal information we hold about you. To exercise
                these rights, contact us at{" "}
                <a href="mailto:support@goplay11game.net">support@goplay11game.net</a>.
              </p>

              <h2>Children&apos;s Privacy</h2>
              <p>
                This website is not directed at children under the age of 18. We do
                not knowingly collect personal information from minors. If you believe
                we have inadvertently collected such information, please contact us
                immediately.
              </p>

              <h2>Security</h2>
              <p>
                We implement reasonable technical and organisational measures to
                protect information collected through this website. However, no
                transmission over the internet is completely secure, and we cannot
                guarantee absolute security.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The &ldquo;Last
                updated&rdquo; date at the top of this page reflects the most recent
                revision. Continued use of the website after updates constitutes
                acceptance of the revised policy.
              </p>

              <h2>Contact Us</h2>
              <p>
                For privacy-related questions or requests, contact us at{" "}
                <a href="mailto:support@goplay11game.net">support@goplay11game.net</a>{" "}
                or via the{" "}
                <a href="/contact-us">Contact Us</a> page.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
