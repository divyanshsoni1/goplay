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
  ["Device",       "Android smartphone or tablet (primary supported platform)"],
  ["OS Version",   "Updated Android OS — check the official app for minimum version"],
  ["Storage",      "Sufficient free space for the APK and future update files"],
  ["Internet",     "Stable Wi-Fi or mobile data connection recommended"],
  ["Battery",      "Charge device to at least 30 % before installing"],
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
    checklist: ["Enough free storage space", "Stable internet throughout download", "Battery charged above 30 %"],
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
  ["Password",                  "Your account password — never share this with anyone"],
  ["Internet connection",       "Stable connection required to authenticate"],
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
        <section className={styles.pageHero} aria-label="Page hero">
          <div className={styles.container}>
            <h1>How to Download the Goplay App</h1>
            <p>
              A safe, step-by-step Android download and installation guide with
              system requirements, troubleshooting, and account setup.
            </p>
          </div>
        </section>

        {/* System Requirements */}
        <section className={styles.contentSection} aria-label="System requirements">
          <div className={styles.container}>
            <h2>System Requirements</h2>
            <table className={styles.table} aria-label="System requirements table">
              <tbody>
                {systemReqs.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row" style={{ whiteSpace: "nowrap" }}>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6-Step Guide */}
        <section className={styles.contentSection} aria-label="Download steps">
          <div className={styles.container}>
            <SectionHeader
              label="INSTALLATION GUIDE"
              title="Six Steps to Get Goplay Running"
              subtitle="Follow each step in order for a smooth, safe installation."
            />
            <div className={styles.steps} role="list">
              {steps.map((step) => (
                <article className={styles.step} key={step.num} role="listitem">
                  <b aria-hidden="true">{step.num}</b>
                  <div className={styles.stepDot} aria-hidden="true" />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>

                  {step.checklist && (
                    <ul className={styles.stepChecklist} aria-label="Checklist">
                      {step.checklist.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {step.instructions && (
                    <ol className={styles.stepInstructions}
                        style={{ paddingLeft: 18, margin: "10px 0 0", color: "var(--body)", fontSize: 13, lineHeight: 1.7 }}
                        aria-label="Step-by-step instructions">
                      {step.instructions.map((ins) => (
                        <li key={ins}>{ins}</li>
                      ))}
                    </ol>
                  )}

                  {step.note && (
                    <p className={styles.stepInstructions}
                       style={{ marginTop: 10, background: step.type === "warning" ? "#fff8f4" : "transparent",
                                padding: step.type === "warning" ? "8px 10px" : 0,
                                borderRadius: 6, fontStyle: "italic" }}>
                      {step.type === "warning" ? "⚠️ " : "ℹ️ "}{step.note}
                    </p>
                  )}
                </article>
              ))}
            </div>

            <div style={{ marginTop: 40 }}>
              <Link className={styles.primaryButton} href="#troubleshooting">
                Troubleshooting Help <b>↓</b>
              </Link>
            </div>
          </div>
        </section>

        {/* Registration */}
        <section className={styles.contentSection} aria-label="Account registration">
          <div className={styles.container}>
            <div className={styles.twoCol}>
              <div>
                <h2>Creating Your Account</h2>
                <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 20 }}>
                  Registration is straightforward. Once the app is installed, follow
                  these steps to set up your account:
                </p>
                <ol style={{ paddingLeft: 20, display: "grid", gap: 10 }}>
                  {registration.map((step) => (
                    <li key={step} style={{ color: "var(--body)", fontSize: 15, lineHeight: 1.6 }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h2>Login Requirements</h2>
                <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 16 }}>
                  To log in to an existing account you will need:
                </p>
                <table className={styles.table} aria-label="Login requirements">
                  <tbody>
                    {loginReqs.map(([req, detail]) => (
                      <tr key={req}>
                        <th scope="row">{req}</th>
                        <td>{detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section
          className={styles.contentSection}
          id="troubleshooting"
          aria-label="Troubleshooting"
        >
          <div className={styles.container}>
            <h2>Troubleshooting</h2>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: 24 }}>
              If you run into issues during download or installation, check the
              relevant item below.
            </p>
            <div className={styles.troubleshootWrap}>
              {troubles.map((t) => (
                <details className={styles.troubleItem} key={t.q}>
                  <summary>{t.q}</summary>
                  <div className={styles.troubleBody}>
                    <h4>Possible reasons</h4>
                    <ul>
                      {t.reasons.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                    <h4>Solutions</h4>
                    <ul>
                      {t.fixes.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Security reminder */}
        <section className={styles.contentSection} aria-label="Security reminder">
          <div className={styles.container}>
            <div className={styles.notice} role="note">
              <h2>Security Reminder</h2>
              <p>
                Always download the Goplay APK from the official source or this
                guide. Never pay anyone claiming to provide early access or premium
                account unlocks. Keep your Unknown Sources setting disabled when
                it is no longer needed, and review app permissions during
                installation.
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
