import type { Metadata } from "next";
import Link from "next/link";
import styles from "../../page.module.css";
import { Breadcrumbs, JsonLd, SectionHeader, breadcrumbSchema } from "../../ui";

export const metadata: Metadata = {
  title: "Goplay App Download Guide – Step-by-Step (2026)",
  description:
    "How to download and install the Goplay app safely on Android — system requirements, 6-step install guide, troubleshooting, and security tips.",
  alternates: { canonical: "https://goplay11game.net/app-download-guide" },
};

/* ── Data ─────────────────────────────────────────────────────────────── */

const systemReqs = [
  ["Device", "Android smartphone or tablet (primary supported platform)"],
  ["OS Version", "Updated Android OS — check the official app for minimum version"],
  ["Storage", "Sufficient free space for the APK and future update files"],
  ["Internet", "Stable Wi-Fi or mobile data connection recommended"],
  ["Battery", "Charge device to at least 30% before installing"],
];

const steps = [
  {
    num: "01",
    title: "Visit the Official Download Source",
    body: "Start from the verified Goplay website or this download guide page — not a third-party APK listing.",
    note: "Always download from trusted, official sources only.",
    type: "warning" as const,
  },
  {
    num: "02",
    title: "Tap Download",
    body: "Locate the download button and tap it. Your browser will confirm before the file transfer begins.",
    note: "Wait until the download progress completes before proceeding.",
    type: "info" as const,
  },
  {
    num: "03",
    title: "APK Saved to Storage",
    body: "The APK file saves to your device's Downloads folder. Verify these before continuing:",
    checklist: ["Enough free storage space", "Stable internet throughout download", "Battery charged above 30%"],
    type: "checklist" as const,
  },
  {
    num: "04",
    title: "Enable Install from Unknown Sources",
    body: "Android blocks third-party APKs by default. Follow these steps to allow installation:",
    instructions: [
      "Open Settings",
      "Tap Security (or Privacy on some devices)",
      "Select Install Unknown Apps",
      "Choose your browser or file manager",
      "Toggle Allow from this source",
    ],
    note: "Disable this setting again after installation is complete.",
    type: "instructions" as const,
  },
  {
    num: "05",
    title: "Open the APK and Install",
    body: "Locate the downloaded file in your file manager or notification tray, tap it, then tap Install. Wait for the installation to complete.",
    type: "info" as const,
  },
  {
    num: "06",
    title: "Open Goplay — Register or Log In",
    body: "Launch the app from your home screen. Create a new account or log in with existing credentials, then explore the dashboard.",
    checklist: ["Open app", "Register or log in", "Explore dashboard and categories"],
    type: "checklist" as const,
  },
];

const registration = [
  "Open the Goplay app after installation",
  "Tap Register and enter your details",
  "Create a secure password and keep it private",
  "Verify your account if prompted (OTP or email)",
  "Complete any remaining setup steps and tap Finish",
];

const loginReqs = [
  ["Mobile number or username", "The credential you used during registration"],
  ["Password", "Your account password — never share this with anyone"],
  ["Internet connection", "Stable connection required to authenticate"],
];

const troubles = [
  {
    q: "App not installing",
    reasons: ["Insufficient storage space", "APK downloaded from an untrusted source", "Unknown Sources not enabled for your browser"],
    fixes: ["Free up storage and retry", "Re-download from the official source only", "Enable Install Unknown Apps for the correct browser in Settings > Security"],
  },
  {
    q: "Login issues",
    reasons: ["Incorrect username or password", "Poor internet connection", "Account not yet verified"],
    fixes: ["Check credentials carefully — passwords are case-sensitive", "Switch to a stable network and retry", "Complete account verification if the app prompts you"],
  },
  {
    q: "Slow performance",
    reasons: ["Low available device RAM", "Background apps consuming resources", "Outdated app version"],
    fixes: ["Close background apps before launching Goplay", "Restart your device and try again", "Update to the latest app version from the official source"],
  },
  {
    q: "App crashing",
    reasons: ["Corrupted APK file", "Incompatible Android version", "Insufficient RAM"],
    fixes: ["Delete and re-download the APK from the official source", "Check that your Android version meets the minimum requirement", "Restart device and relaunch the app"],
  },
];

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function Page() {
  const jsonLd = [
    breadcrumbSchema("App Download Guide", "/app-download-guide"),
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Download and Install the Goplay App",
      description:
        "A step-by-step guide to safely downloading and installing the Goplay Android app.",
      step: steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.body,
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <main id="main-content" className={styles.innerPage}>

        {/* Breadcrumb */}
        <div className={styles.container}>
          <Breadcrumbs current="App Download Guide" />
        </div>

        {/* Hero */}
        <section className={styles.pageHero} aria-label="Page hero" style={{ paddingBottom: 32 }}>
          <div className={styles.container}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: 720,
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
                Download Guide
              </span>
              <h1 style={{
                fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}>
                How to Download <br />
                <span style={{ color: "var(--primary, #2563eb)" }}>the Goplay App</span>
              </h1>
              <p style={{
                fontSize: "1.15rem",
                lineHeight: 1.7,
                color: "var(--body, #4b5563)",
                maxWidth: 580,
                margin: "0 auto",
              }}>
                A safe, step-by-step Android download and installation guide with
                system requirements, troubleshooting, and account setup.
              </p>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className={styles.contentSection} aria-label="System requirements" style={{ paddingTop: 0 }}>
          <div className={styles.container}>
            <div style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: "32px 28px",
              border: "1px solid var(--border-light, #f0f0f0)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
            }}>
              <h2 style={{
                fontSize: "1.4rem",
                fontWeight: 600,
                marginBottom: 4,
                letterSpacing: "-0.01em",
              }}>
                System Requirements
              </h2>
              <p style={{
                color: "var(--body, #4b5563)",
                fontSize: "0.95rem",
                marginBottom: 20,
              }}>
                Ensure your device meets these basic requirements before downloading.
              </p>
              <div style={{ overflowX: "auto" }}>
                <table className={styles.table} aria-label="System requirements table" style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.92rem",
                }}>
                  <tbody>
                    {systemReqs.map(([label, value]) => (
                      <tr key={label} style={{ borderBottom: "1px solid var(--border-light, #f3f4f6)" }}>
                        <th scope="row" style={{
                          textAlign: "left",
                          padding: "12px 16px",
                          fontWeight: 600,
                          color: "var(--heading, #111827)",
                          whiteSpace: "nowrap",
                          width: "30%",
                        }}>
                          {label}
                        </th>
                        <td style={{
                          padding: "12px 16px",
                          color: "var(--body, #4b5563)",
                        }}>
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 6-Step Guide */}
        <section className={styles.contentSection} aria-label="Download steps" style={{ paddingTop: 0 }}>
          <div className={styles.container}>
            <SectionHeader
              label="INSTALLATION GUIDE"
              title="Six Steps to Get Goplay Running"
              subtitle="Follow each step in order for a smooth, safe installation."
            />
            <div style={{
              display: "grid",
              gap: 24,
              marginTop: 32,
            }} role="list">
              {steps.map((step) => (
                <article
                  key={step.num}
                  role="listitem"
                  style={{
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: "28px 28px",
                    border: "1px solid var(--border-light, #f0f0f0)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                  }}
                  className="stepCard"
                >
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    {/* Step number */}
                    <span style={{
                      fontSize: "2.2rem",
                      fontWeight: 700,
                      color: "var(--primary, #2563eb)",
                      lineHeight: 1,
                      flexShrink: 0,
                      minWidth: 52,
                    }} aria-hidden="true">
                      {step.num}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: "1.15rem",
                        fontWeight: 600,
                        margin: "0 0 6px 0",
                        letterSpacing: "-0.01em",
                      }}>
                        {step.title}
                      </h3>
                      <p style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                        color: "var(--body, #4b5563)",
                        margin: "0 0 8px 0",
                      }}>
                        {step.body}
                      </p>

                      {step.checklist && (
                        <ul style={{
                          paddingLeft: 20,
                          margin: "8px 0 0",
                          display: "grid",
                          gap: 4,
                        }}>
                          {step.checklist.map((item) => (
                            <li key={item} style={{
                              fontSize: "0.9rem",
                              color: "var(--body, #4b5563)",
                              lineHeight: 1.6,
                            }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {step.instructions && (
                        <ol style={{
                          paddingLeft: 20,
                          margin: "8px 0 0",
                          display: "grid",
                          gap: 4,
                        }}>
                          {step.instructions.map((ins) => (
                            <li key={ins} style={{
                              fontSize: "0.9rem",
                              color: "var(--body, #4b5563)",
                              lineHeight: 1.6,
                            }}>
                              {ins}
                            </li>
                          ))}
                        </ol>
                      )}

                      {step.note && (
                        <p style={{
                          marginTop: 12,
                          fontSize: "0.9rem",
                          background: step.type === "warning" ? "#fef9e7" : "var(--surface-alt, #f3f4f6)",
                          padding: "8px 14px",
                          borderRadius: 8,
                          color: step.type === "warning" ? "#92400e" : "var(--body, #4b5563)",
                          borderLeft: `3px solid ${step.type === "warning" ? "#f59e0b" : "var(--primary, #2563eb)"}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}>
                          <span style={{ fontSize: "1.1rem" }} aria-hidden="true">
                            {step.type === "warning" ? "⚠️" : "ℹ️"}
                          </span>
                          {step.note}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Registration & Login */}
        <section className={styles.contentSection} aria-label="Account registration" style={{ paddingTop: 0 }}>
          <div className={styles.container}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 28,
            }}>
              {/* Registration */}
              <div style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "28px 24px",
                border: "1px solid var(--border-light, #f0f0f0)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}>
                <h2 style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}>
                  Creating Your Account
                </h2>
                <p style={{
                  color: "var(--body, #4b5563)",
                  lineHeight: 1.7,
                  marginBottom: 16,
                  fontSize: "0.95rem",
                }}>
                  Registration is straightforward. Once the app is installed, follow
                  these steps to set up your account:
                </p>
                <ol style={{
                  paddingLeft: 20,
                  display: "grid",
                  gap: 8,
                }}>
                  {registration.map((step) => (
                    <li key={step} style={{
                      color: "var(--body, #4b5563)",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Login Requirements */}
              <div style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "28px 24px",
                border: "1px solid var(--border-light, #f0f0f0)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}>
                <h2 style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}>
                  Login Requirements
                </h2>
                <p style={{
                  color: "var(--body, #4b5563)",
                  lineHeight: 1.7,
                  marginBottom: 16,
                  fontSize: "0.95rem",
                }}>
                  To log in to an existing account you will need:
                </p>
                <div style={{ overflowX: "auto" }}>
                  <table className={styles.table} aria-label="Login requirements" style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.9rem",
                  }}>
                    <tbody>
                      {loginReqs.map(([req, detail]) => (
                        <tr key={req} style={{ borderBottom: "1px solid var(--border-light, #f3f4f6)" }}>
                          <th scope="row" style={{
                            textAlign: "left",
                            padding: "10px 12px",
                            fontWeight: 600,
                            color: "var(--heading, #111827)",
                            width: "40%",
                          }}>
                            {req}
                          </th>
                          <td style={{
                            padding: "10px 12px",
                            color: "var(--body, #4b5563)",
                          }}>
                            {detail}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section
          className={styles.contentSection}
          id="troubleshooting"
          aria-label="Troubleshooting"
          style={{ paddingTop: 0 }}
        >
          <div className={styles.container}>
            <div style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: "32px 28px",
              border: "1px solid var(--border-light, #f0f0f0)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
            }}>
              <h2 style={{
                fontSize: "1.4rem",
                fontWeight: 600,
                marginBottom: 4,
                letterSpacing: "-0.01em",
              }}>
                Troubleshooting
              </h2>
              <p style={{
                color: "var(--body, #4b5563)",
                lineHeight: 1.7,
                marginBottom: 24,
                fontSize: "0.95rem",
              }}>
                If you run into issues during download or installation, check the
                relevant item below.
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                {troubles.map((t, index) => (
                  <details
                    key={t.q}
                    style={{
                      border: "1px solid var(--border-light, #f0f0f0)",
                      borderRadius: 12,
                      padding: "0 16px",
                      transition: "border-color 0.2s",
                    }}
                    className="troubleItem"
                  >
                    <summary style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      padding: "14px 0",
                      fontSize: "1rem",
                      color: "var(--heading, #111827)",
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <span>{t.q}</span>
                      <span style={{ color: "var(--primary, #2563eb)", fontSize: "1.2rem" }} aria-hidden="true">
                        ▼
                      </span>
                    </summary>
                    <div style={{
                      padding: "0 0 16px 0",
                      borderTop: "1px solid var(--border-light, #f0f0f0)",
                    }}>
                      <div style={{ marginTop: 16 }}>
                        <h4 style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--heading, #111827)",
                          margin: "0 0 6px 0",
                        }}>
                          Possible reasons
                        </h4>
                        <ul style={{
                          paddingLeft: 20,
                          margin: "0 0 14px 0",
                          display: "grid",
                          gap: 4,
                        }}>
                          {t.reasons.map((r) => (
                            <li key={r} style={{
                              fontSize: "0.9rem",
                              color: "var(--body, #4b5563)",
                              lineHeight: 1.6,
                            }}>
                              {r}
                            </li>
                          ))}
                        </ul>
                        <h4 style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--heading, #111827)",
                          margin: "0 0 6px 0",
                        }}>
                          Solutions
                        </h4>
                        <ul style={{
                          paddingLeft: 20,
                          margin: 0,
                          display: "grid",
                          gap: 4,
                        }}>
                          {t.fixes.map((f) => (
                            <li key={f} style={{
                              fontSize: "0.9rem",
                              color: "var(--body, #4b5563)",
                              lineHeight: 1.6,
                            }}>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Security Reminder */}
        <section className={styles.contentSection} aria-label="Security reminder" style={{ paddingTop: 0, paddingBottom: 56 }}>
          <div className={styles.container}>
            <div style={{
              background: "var(--warning-soft, #fef9e7)",
              borderRadius: 20,
              padding: "28px 28px",
              border: "1px solid var(--warning-border, #fcd34d)",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }} role="note">
              <span style={{ fontSize: "2rem", lineHeight: 1 }} aria-hidden="true">🔒</span>
              <div>
                <h2 style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "var(--warning-text, #92400e)",
                  margin: "0 0 6px 0",
                  letterSpacing: "-0.01em",
                }}>
                  Security Reminder
                </h2>
                <p style={{
                  color: "var(--warning-text, #92400e)",
                  lineHeight: 1.7,
                  margin: 0,
                  fontSize: "0.95rem",
                }}>
                  Always download the Goplay APK from the official source or this
                  guide. Never pay anyone claiming to provide early access or premium
                  account unlocks. Keep your Unknown Sources setting disabled when
                  it is no longer needed, and review app permissions during
                  installation.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Hover styles for cards and details */}
      <style>{`
        .stepCard:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.04);
        }
        .troubleItem:hover {
          border-color: var(--border, #e5e7eb);
        }
        .troubleItem summary::-webkit-details-marker {
          display: none;
        }
        .troubleItem[open] summary span:last-child {
          transform: rotate(180deg);
        }
        .troubleItem summary span:last-child {
          transition: transform 0.2s ease;
        }
      `}</style>
    </>
  );
}