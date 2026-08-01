import type { Metadata } from "next";
import styles from "../page.module.css";
import { Footer, Header } from "../components";
import { Breadcrumbs, JsonLd, breadcrumbSchema } from "../ui";

export const metadata: Metadata = {
  title: "Disclaimer – Goplay",
  description:
    "Read the Goplay website disclaimer. This site provides information and guides about the Goplay mobile gaming app for entertainment purposes only.",
  alternates: { canonical: "https://goplay11game.net/disclaimer" },
};

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("Disclaimer", "/disclaimer")} />
      <Header />
      <main id="main-content" className={styles.innerPage}>
        <div className={styles.container}>
          <Breadcrumbs current="Disclaimer" />
        </div>

        <section className={styles.pageHero} aria-label="Page hero">
          <div className={styles.container}>
            <h1>Disclaimer</h1>
            <p>Please read this disclaimer carefully before using this website.</p>
          </div>
        </section>

        <section className={styles.contentSection} aria-label="Disclaimer content">
          <div className={styles.container}>
            <div className={styles.policyContent}>
              <p className={styles.lastUpdated}>Last updated: August 1, 2026</p>

              <h2>Website Purpose</h2>
              <p>
                Goplay11Game.net is an informational website that provides guides,
                tips, and documentation about the Goplay mobile gaming application.
                This site is not the official Goplay app store or download platform.
              </p>

              <h2>No Warranties</h2>
              <p>
                The information provided on this website is offered on an
                &ldquo;as-is&rdquo; basis without any warranties, express or implied.
                We make no representations about the accuracy, completeness, or
                suitability of any information for any purpose. Content may change
                without notice as platform features are updated.
              </p>

              <h2>Third-Party Links</h2>
              <p>
                This website may contain links to external websites. We have no
                control over the content, privacy policies, or practices of third-party
                sites. Inclusion of a link does not imply endorsement.
              </p>

              <h2>Download Responsibility</h2>
              <p>
                Downloading and installing any application is done entirely at your
                own risk. We strongly recommend downloading only from official or
                verified sources. We are not responsible for any damage to devices or
                data resulting from downloading software from any source.
              </p>

              <h2>Entertainment Only</h2>
              <p>
                Goplay is a mobile gaming platform intended for entertainment purposes
                only. Nothing on this website constitutes financial, legal, or
                professional advice of any kind.
              </p>

              <h2>Promotional Offers</h2>
              <p>
                Any references to rewards, bonuses, or promotional offers on this
                website are illustrative and subject to change. Always refer to the
                official in-app terms for current offers and their conditions.
              </p>

              <h2>Age Requirement</h2>
              <p>
                This platform and website are intended for users aged 18 and above.
                By using this website you confirm that you meet the minimum age
                requirement applicable in your jurisdiction.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Goplay11Game.net and its
                operators shall not be liable for any direct, indirect, incidental,
                or consequential damages arising from your use of this website or the
                information contained herein.
              </p>

              <h2>Changes to This Disclaimer</h2>
              <p>
                We reserve the right to update this disclaimer at any time. Continued
                use of the website after changes are posted constitutes acceptance of
                the revised disclaimer.
              </p>

              <h2>Contact</h2>
              <p>
                If you have questions about this disclaimer, please contact us at{" "}
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
