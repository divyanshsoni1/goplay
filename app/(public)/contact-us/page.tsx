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
    label: "support@goplay11game.net",
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

const responseTimes = [
  { channel: "In-App Support", time: "Fastest", bestFor: "Account, payments, gameplay issues" },
  { channel: "Email", time: "1–3 business days", bestFor: "Website feedback, content queries" },
  { channel: "Contact Form", time: "1–3 business days", bestFor: "General enquiries, site issues" },
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

        {/* Hero Section */}
        <section className={styles.pageHero} aria-label="Page hero" style={{ paddingBottom: 40 }}>
          <div className={styles.container}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                maxWidth: 680,
                margin: "0 auto",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--primary, #2563eb)",
                  background: "var(--primary-soft, #dbeafe)",
                  padding: "6px 18px",
                  borderRadius: 100,
                  marginBottom: 20,
                }}
              >
                Get in Touch
              </span>
              <h1
                style={{
                  fontSize: "clamp(2.2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: 16,
                  letterSpacing: "-0.025em",
                  color: "#D3D3D3",
                }}
              >
                Contact <span style={{ color: "var(--primary, #2563eb)" }}>Goplay</span> Support
              </h1>
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#708090",
                  maxWidth: 580,
                  margin: "0 auto",
                }}
              >
                Send a message about this website, or use verified in-app help for account-specific
                questions. We aim to respond to all enquiries as promptly as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className={styles.contentSection} aria-label="Contact options" style={{ paddingTop: 0 }}>
          <div className={styles.container}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
                gap: 32,
                alignItems: "start",
              }}
            >
              {/* Left Column: Contact Form */}
              <div
                style={{
                  background: "#ffffff",
                  marginTop:"1rem",
                  borderRadius: 20,
                  padding: "clamp(20px, 4vw, 36px)",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.03)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    marginBottom: 8,
                    letterSpacing: "-0.015em",
                    color: "#0f172a",
                  }}
                >
                  Send a Message
                </h2>
                <p
                  style={{
                    color: "#64748b",
                    lineHeight: 1.6,
                    marginBottom: 28,
                    fontSize: "0.925rem",
                  }}
                >
                  Use this form for general website enquiries, feedback, or to report an issue with the site content. All fields are required.
                </p>
                <ContactForm />
              </div>

              {/* Right Column: Support Channels & Warning */}
              <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
                <h2
                  style={{
                    fontSize: "1.35rem",
                    marginTop:"1rem",
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                    marginBottom: 4,
                    color: "#0f172a",
                  }}
                >
                  Support Channels
                </h2>
                {channels.map((c) => (
                  <div
                    key={c.title}
                    style={{
                      background: "#ffffff",
                      borderRadius: 16,
                      padding: "22px 24px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: "1.6rem", lineHeight: 1 }} aria-hidden="true">
                        {c.icon}
                      </span>
                      <h3
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: 600,
                          margin: 0,
                          color: "#0f172a",
                        }}
                      >
                        {c.title}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        color: "#475569",
                        margin: "0 0 12px 0",
                      }}
                    >
                      {c.body}
                    </p>
                    {c.href && (
                      <a
                        href={c.href}
                        style={{
                          color: "var(--primary, #2563eb)",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        {c.label}
                      </a>
                    )}
                    {!c.href && c.action && (
                      <span
                        style={{
                          color: "#64748b",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {c.action}
                      </span>
                    )}
                  </div>
                ))}

                {/* Security Reminder */}
                <div
                  style={{
                    background: "#fffbeb",
                    borderRadius: 16,
                    padding: "18px 20px",
                    border: "1px solid #fef3c7",
                    fontSize: "0.875rem",
                    color: "#92400e",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    lineHeight: 1.5,
                  }}
                  role="note"
                >
                  <span style={{ fontSize: "1.25rem", lineHeight: 1 }} aria-hidden="true">
                    ⚠️
                  </span>
                  <div>
                    <strong style={{ display: "block", marginBottom: 2 }}>Security reminder:</strong>
                    Never share your password, OTP, or payment details with anyone claiming to be from Goplay support. All official support happens through in-app channels only.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Times Table */}
        <section className={styles.contentSection} aria-label="Response times" style={{ paddingTop: 0 }}>
          <div className={styles.container}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "clamp(20px, 4vw, 32px)",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  marginBottom: 4,
                  color: "#0f172a",
                }}
              >
                Response Times
              </h2>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.925rem",
                  marginBottom: 20,
                }}
              >
                Typical response times for each support channel.
              </p>
              <div style={{ overflowX: "auto" }}>
                <table
                  className={styles.table}
                  aria-label="Support response times"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.9rem",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                      <th
                        scope="col"
                        style={{
                          textAlign: "left",
                          padding: "12px 16px",
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        Channel
                      </th>
                      <th
                        scope="col"
                        style={{
                          textAlign: "left",
                          padding: "12px 16px",
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        Typical Response
                      </th>
                      <th
                        scope="col"
                        style={{
                          textAlign: "left",
                          padding: "12px 16px",
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        Best For
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseTimes.map((row) => (
                      <tr key={row.channel} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b" }}>
                          {row.channel}
                        </td>
                        <td style={{ padding: "12px 16px", color: "#475569" }}>{row.time}</td>
                        <td style={{ padding: "12px 16px", color: "#475569" }}>{row.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}