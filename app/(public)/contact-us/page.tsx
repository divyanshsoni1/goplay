import type { Metadata } from "next";
import styles from "../../page.module.css";
import { Breadcrumbs, JsonLd, breadcrumbSchema } from "../../ui";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Goplay Support",
  description:
    "Get in touch with Goplay — send a message via our contact form, email us directly, or use the in-app support channel for account-specific questions.",
  alternates: { canonical: "https://goplay11game.net/contact-us" },
};

const channels = [
  {
    icon: "📧",
    title: "Email Support",
    body: "Send a message to our support team for website-related questions.",
    action: "support@goplay11game.net",
    href: "mailto:support@goplay11game.net",
    label: "Email us",
  },
  {
    icon: "📱",
    title: "In-App Support",
    body: "For account, payment, or gameplay questions use the verified help option inside the official Goplay app.",
    action: null,
    href: null,
    label: null,
  },
  {
    icon: "📖",
    title: "Help Resources",
    body: "Check our FAQ and download guide — most common questions are already answered there.",
    action: "Browse FAQ",
    href: "/faq",
    label: "Browse FAQ →",
  },
];

export default function Page() {
  const jsonLd = [
    breadcrumbSchema("Contact Us", "/contact-us"),
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Goplay Support",
      url: "https://goplay11game.net/contact-us",
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main-content" className={styles.innerPage}>

        {/* Breadcrumb */}
        <div className={styles.container}>
          <Breadcrumbs current="Contact Us" />
        </div>

        {/* Hero */}
        <section className={styles.pageHero} aria-label="Page hero">
          <div className={styles.container}>
            <h1>Contact Goplay Support</h1>
            <p>
              Send a message about this website, or use verified in-app help for
              account-specific questions. We aim to respond to all enquiries as
              promptly as possible.
            </p>
          </div>
        </section>

        {/* Main layout: form + channels */}
        <section className={styles.contentSection} aria-label="Contact options">
          <div className={styles.container}>
            <div className={styles.twoColWide}>

              {/* Contact form */}
              <div className={styles.contentCard}>
                <h2>Send a Message</h2>
                <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 24 }}>
                  Use this form for general website enquiries, feedback, or to
                  report an issue with the site content. All fields are required.
                </p>
                <ContactForm />
              </div>

              {/* Support channels */}
              <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
                <h2 style={{ color: "var(--navy)", margin: 0 }}>Support Channels</h2>
                {channels.map((c) => (
                  <div className={styles.contentCard} key={c.title}>
                    <span className={styles.icon} aria-hidden="true">{c.icon}</span>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                    {c.href && (
                      <a href={c.href}
                         style={{ color: "var(--orange)", fontWeight: 700, fontSize: 14 }}>
                        {c.label}
                      </a>
                    )}
                  </div>
                ))}

                {/* Security reminder */}
                <div className={styles.notice} role="note">
                  <strong>⚠️ Security reminder:</strong> Never share your password,
                  OTP, or payment details with anyone claiming to be from Goplay
                  support. All official support happens through in-app channels only.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Response times */}
        <section className={styles.contentSection} aria-label="Response times">
          <div className={styles.container}>
            <h2>Response Times</h2>
            <table className={styles.table} aria-label="Support response times">
              <thead>
                <tr>
                  <th scope="col">Channel</th>
                  <th scope="col">Typical Response</th>
                  <th scope="col">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>In-App Support</td>
                  <td>Fastest</td>
                  <td>Account, payments, gameplay issues</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>1–3 business days</td>
                  <td>Website feedback, content queries</td>
                </tr>
                <tr>
                  <td>Contact Form</td>
                  <td>1–3 business days</td>
                  <td>General enquiries, site issues</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </>
  );
}
