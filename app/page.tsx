import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import { Footer, Header } from "./components";
import { JsonLd, SectionHeader } from "./ui";

export const metadata: Metadata = {
  title: "Goplay – Mobile Gaming App | Download, Play & Explore",
  description:
    "Goplay is a mobile gaming platform for Android with smooth gameplay, fast loading, and multiple gaming categories. Download the APK, explore features, and start playing today.",
  alternates: { canonical: "https://goplay11game.net/" },
};

/* ── Data ─────────────────────────────────────────────────────────────── */

const trustMetrics = [
  ["⚡", "Fast", "Instant app loading"],
  ["🎮", "Smooth", "Lag-free gameplay"],
  ["📱", "Lightweight", "Minimal storage use"],
  ["🛡️", "Trusted", "Safe download source"],
];

const features = [
  ["⚡", "Fast Loading",      "The app launches quickly and responds without delay, even on modest hardware."],
  ["🎮", "Smooth Gameplay",   "Fluid controls and stable frame performance keep every session enjoyable."],
  ["🪶", "Lightweight",       "The APK is compact so it won't strain your storage or slow your device."],
  ["👆", "User-Friendly",     "A clean layout means new and returning players navigate with ease."],
  ["🧭", "Easy Navigation",   "All sections are one tap away with a well-organised menu structure."],
  ["📱", "Mobile Optimised",  "Built for Android from the ground up — touch controls feel natural."],
  ["🔔", "Notifications",     "Stay informed about updates, events, and new game category releases."],
  ["🔒", "Secure Access",     "Account protection guidance and trusted download sources are clearly provided."],
];

const categories = [
  ["🎲", "Casual Games",    "Easy to pick up, fun to play anytime."],
  ["🃏", "Card Games",      "Classic and modern card-based challenges."],
  ["♟️", "Strategy Games",  "Think ahead and outplay the competition."],
  ["🏅", "Skill Games",     "Sharpen your abilities with skill-focused play."],
  ["⚡", "Quick Play",      "Short sessions designed for on-the-go gaming."],
];

const bonuses = [
  ["🎁", "Welcome Rewards",       "May include introductory benefits for new users depending on current availability and platform terms."],
  ["📅", "Daily Rewards",         "Promotional offers that may be available for regular engagement, subject to platform conditions."],
  ["🎉", "Seasonal Promotions",   "Event-based offers that may appear during special periods — check in-app for current details."],
  ["🏆", "Event Bonuses",         "Depending on availability, special events may carry additional in-app promotional offers."],
];

const perfPoints = [
  ["⚡", "Fast Response",       "Input actions register immediately so gameplay stays fluid from start to finish."],
  ["🎯", "Smooth Controls",     "Touch targets are well-sized and responsive, reducing accidental misses."],
  ["📶", "Stable Navigation",   "Moving between sections and categories loads predictably without unexpected refreshes."],
  ["✨", "Better Interaction",  "Animations and transitions are purposeful — informative rather than distracting."],
];

const compatItems = [
  ["🤖", "Android",         "Primary supported platform. Check the official app for minimum version requirements."],
  ["🔄", "Updated OS",      "Keep your Android OS updated for the best compatibility and security."],
  ["💾", "Storage",         "Ensure enough free space for the app and any updates before installing."],
  ["📡", "Internet",        "A stable Wi-Fi or mobile data connection is recommended during gameplay."],
];

const securityCards = [
  ["🔑", "Keep Passwords Private",   "Never share your account credentials, OTPs, or PINs with anyone."],
  ["✅", "Trusted Sources Only",     "Download the APK exclusively from the official Goplay channel or this guide."],
  ["🔄", "Update Regularly",         "Install app updates promptly to benefit from the latest security fixes."],
  ["🛡️", "Protect Your Info",        "Review app permissions and only grant access your device actually needs."],
  ["🚫", "Avoid Suspicious Links",   "Never tap links from unknown senders claiming to offer Goplay access."],
];

const responsibleItems = [
  "Manage your screen time — set a daily limit and take regular breaks.",
  "Keep your account credentials private and log out on shared devices.",
  "Download only from trusted, verified sources to protect your device.",
  "Use the app for entertainment — never feel pressured to play excessively.",
  "If you feel gaming is affecting daily life, take a break and seek support.",
];

const faqPreview = [
  ["Is Goplay free to download?",     "The app is available to download — check the official Goplay channel for current terms and availability."],
  ["Is it available on Android?",     "Yes. Goplay is designed primarily for Android devices. Check the download guide for system requirements."],
  ["How do I install the APK?",       "Follow the six-step guide on the download page: download from a trusted source, enable Unknown Sources in Settings, then tap Install."],
  ["Is Goplay safe to use?",          "Download only from official or verified sources, keep your credentials private, and review app permissions during installation."],
];

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <main id="main-content">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className={styles.hero} aria-label="Hero">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>GOPLAY MOBILE GAMING PLATFORM</p>
              <h1>Play Smarter.<br /><span>Play Goplay.</span></h1>
              <p className={styles.heroText}>
                Goplay is a mobile gaming platform built for Android — smooth gameplay,
                fast loading, and a user-friendly interface across multiple gaming
                categories.
              </p>
              <div className={styles.heroBadges} aria-label="Platform highlights">
                {["⚡ Fast Loading", "🪶 Lightweight", "📱 Mobile-First", "🎮 Multi-Category"].map(b => (
                  <span key={b} className={styles.heroBadge}>{b}</span>
                ))}
              </div>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="/app-download-guide">
                  Download Guide <b>→</b>
                </a>
                <a className={styles.playLink} href="#features">
                  Explore features <span>▶</span>
                </a>
              </div>
              <p className={styles.disclaimer}>
                For entertainment purposes only · Play responsibly
              </p>
            </div>

            {/* Phone mockup */}
            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.orbit} />
              <div className={styles.phone}>
                <div className={styles.phoneTop}><span>9:41</span><span>●●●</span></div>
                <p className={styles.live}>● GOPLAY</p>
                <h2>Game <em>Hub</em></h2>
                <p className={styles.timer}>5 categories available</p>
                <div className={styles.score}>
                  <div><b>Casual</b><small>Most played</small></div>
                  <strong>▶</strong>
                  <div><b>Card</b><small>Strategy</small></div>
                </div>
                <div className={styles.teamCard}>
                  <span>QUICK PLAY</span>
                  <b>Skill Games</b>
                  <small>Tap to start</small>
                  <i>Ready</i>
                </div>
                <button type="button">EXPLORE GAMES</button>
              </div>
              <div className={styles.floatingCard}>
                <span>PLAYERS</span>
                <b>5M+</b>
                <small>Active users</small>
              </div>
              <div className={styles.ball}>🎮</div>
            </div>
          </div>
        </section>

        {/* ── TRUST METRICS ────────────────────────────────────────── */}
        <section className={styles.trust} aria-label="Why choose Goplay">
          <div className={styles.container}>
            <SectionHeader title="Why Users Choose Goplay" />
            <div className={styles.metricGrid} role="list">
              {trustMetrics.map(([icon, label, sub]) => (
                <article className={styles.metric} key={label} role="listitem">
                  <span aria-hidden="true">{icon}</span>
                  <b>{label}</b>
                  <small>{sub}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT IS GOPLAY ───────────────────────────────────────── */}
        <section className={styles.how} id="about" aria-label="About Goplay">
          <div className={styles.container}>
            <SectionHeader
              label="ABOUT THE PLATFORM"
              title="What is Goplay?"
              subtitle="A mobile gaming platform designed for entertainment and interactive gameplay on Android devices."
            />
            <div className={styles.twoCol}>
              <div>
                <p className={styles.contentSection} style={{ padding: 0, marginBottom: 16 }}>
                  Goplay provides users with access to different gaming categories
                  through a simple and fast interface. The platform is designed around
                  mobile-first principles — every interaction is optimised for touch,
                  and the app stays lightweight so it runs well across a wide range of
                  Android devices.
                </p>
                <p style={{ color: "var(--body)", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  Users prefer Goplay because it combines smooth performance with an
                  interface that doesn&apos;t require a learning curve. Whether you have
                  five minutes or an hour, the platform is ready to deliver a comfortable
                  gaming experience.
                </p>
                <Link className={styles.primaryButton} href="/app-download-guide">
                  Get the App <b>→</b>
                </Link>
              </div>
              <div className={styles.bonusGrid} style={{ gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  ["🎮", "Smooth gameplay"],
                  ["⚡", "Fast loading speed"],
                  ["👆", "User-friendly controls"],
                  ["📱", "Mobile compatibility"],
                ].map(([icon, label]) => (
                  <div key={label} className={styles.compatCard} style={{ padding: "20px 16px" }}>
                    <span aria-hidden="true">{icon}</span>
                    <h3 style={{ fontSize: 14 }}>{label}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section className={styles.features} id="features" aria-label="Platform features">
          <div className={styles.container}>
            <SectionHeader
              label="PLATFORM FEATURES"
              title="Everything You Need in One App"
              subtitle="Goplay is built around the things that matter most in a mobile gaming experience."
              light
            />
            <div className={styles.featureGrid} role="list">
              {features.map(([icon, title, body]) => (
                <article className={styles.feature} key={title} role="listitem">
                  <span aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── GAME CATEGORIES ──────────────────────────────────────── */}
        <section className={styles.gameCats} id="categories" aria-label="Game categories">
          <div className={styles.container}>
            <SectionHeader
              label="GAME CATEGORIES"
              title="Multiple Categories, One Platform"
              subtitle="From casual play to skill-based challenges — find a category that suits your style."
            />
            <div className={styles.catGrid} role="list">
              {categories.map(([icon, title, desc]) => (
                <article className={styles.catCard} key={title} role="listitem">
                  <span aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── BONUSES ──────────────────────────────────────────────── */}
        <section className={styles.bonuses} aria-label="Promotional offers">
          <div className={styles.container}>
            <SectionHeader
              label="PROMOTIONS"
              title="Rewards & Promotional Offers"
              subtitle="Goplay may include various promotional offers depending on availability and current platform terms."
            />
            <div className={styles.bonusGrid} role="list">
              {bonuses.map(([icon, title, body]) => (
                <article className={styles.bonusCard} key={title} role="listitem">
                  <span aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <div className={styles.bonusNote}>
              <strong>Please note:</strong> All promotional offers described above are
              illustrative. Actual availability, terms, and conditions depend on the
              current platform policies. Always review in-app details before
              participating.
            </div>
          </div>
        </section>

        {/* ── PERFORMANCE ──────────────────────────────────────────── */}
        <section className={styles.performance} aria-label="Performance highlights">
          <div className={styles.container}>
            <SectionHeader
              label="PERFORMANCE"
              title="Built to Perform on Any Android Device"
              subtitle="Goplay is optimised to deliver a consistent experience regardless of device age or specs."
            />
            <div className={styles.perfGrid} role="list">
              {perfPoints.map(([icon, title, body]) => (
                <article className={styles.perfCard} key={title} role="listitem">
                  <div className={styles.perfIcon} aria-hidden="true">{icon}</div>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── APP INTERFACE ─────────────────────────────────────────── */}
        <section className={styles.how} aria-label="App interface overview">
          <div className={styles.container}>
            <SectionHeader
              label="APP INTERFACE"
              title="A Clean, Navigable Dashboard"
              subtitle="Every section of the Goplay app is accessible from the main dashboard."
            />
            <div className={styles.appInterfaceGrid} role="list">
              {[
                ["🏠", "Home Dashboard"],
                ["🎮", "Game Categories"],
                ["👤", "Profile"],
                ["🔔", "Notifications"],
                ["💬", "Support"],
              ].map(([icon, label]) => (
                <article className={styles.appInterfaceCard} key={label} role="listitem">
                  <span aria-hidden="true">{icon}</span>
                  <h3>{label}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPATIBILITY ────────────────────────────────────────── */}
        <section className={styles.compat} aria-label="Device compatibility">
          <div className={styles.container}>
            <SectionHeader
              label="COMPATIBILITY"
              title="What You Need to Run Goplay"
              subtitle="Goplay is designed primarily for Android. Check these requirements before downloading."
            />
            <div className={styles.compatGrid} role="list">
              {compatItems.map(([icon, title, body]) => (
                <article className={styles.compatCard} key={title} role="listitem">
                  <span aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECURITY ─────────────────────────────────────────────── */}
        <section className={styles.security} aria-label="Security guidance">
          <div className={styles.container}>
            <SectionHeader
              label="SECURITY"
              title="Stay Safe While You Play"
              subtitle="Follow these best practices to protect your account and device."
              light
            />
            <div className={styles.securityGrid} role="list">
              {securityCards.map(([icon, title, body]) => (
                <article className={styles.securityCard} key={title} role="listitem">
                  <span aria-hidden="true">{icon}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── RESPONSIBLE USAGE ────────────────────────────────────── */}
        <section className={styles.responsible} aria-label="Responsible usage">
          <div className={styles.container}>
            <SectionHeader
              label="RESPONSIBLE USAGE"
              title="Play Responsibly"
              subtitle="Goplay is designed for entertainment. Use it in a way that works for your lifestyle."
            />
            <div className={styles.responsibleBox} role="region" aria-label="Responsible usage tips">
              <div className={styles.responsibleIcon} aria-hidden="true">⚠️</div>
              <div>
                <h2>Keep Gaming in Balance</h2>
                <ul className={styles.responsibleList}>
                  {responsibleItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ PREVIEW ──────────────────────────────────────────── */}
        <section className={styles.faqPreview} aria-label="Frequently asked questions preview">
          <div className={styles.container}>
            <SectionHeader
              label="FAQ"
              title="Common Questions"
              subtitle="Quick answers to what people ask most about Goplay."
            />
            <div className={styles.faqWrap}>
              {faqPreview.map(([q, a]) => (
                <details className={styles.faqItem} key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link className={styles.primaryButton} href="/faq">
                View All FAQs <b>→</b>
              </Link>
            </div>
          </div>
        </section>

        {/* ── DOWNLOAD CTA ─────────────────────────────────────────── */}
        <section className={styles.appCta} id="download" aria-label="Download call to action">
          <div className={styles.container}>
            <div>
              <p className={styles.eyebrow}>GET STARTED TODAY</p>
              <h2>Ready to explore<br />Goplay?</h2>
              <p>
                Follow our step-by-step Android download guide — trusted source,
                safe installation, and you&apos;re in.
              </p>
              <Link className={styles.primaryButton} href="/app-download-guide">
                Download Guide <b>→</b>
              </Link>
            </div>
            <div className={styles.ctaStat} aria-label="5 million plus active players">
              <b>5M+</b>
              <span>active players<br />on the platform</span>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────────── */}
        <section className={styles.finalCta} aria-label="Final call to action">
          <div className={styles.container}>
            <div className={styles.finalCtaInner}>
              <p className={styles.eyebrow}>GOPLAY11GAME.NET</p>
              <h2>Your Complete Goplay Resource</h2>
              <p>
                Goplay offers a smooth interface, fast performance, easy navigation,
                and multiple gaming categories — all in one lightweight Android app.
                This site provides everything you need to get started safely.
              </p>
              <ul className={styles.finalCtaList} aria-label="Resources available on this site">
                {["Download Guide", "Installation Steps", "Features", "Troubleshooting", "Updates", "Security Guidance"].map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.finalCtaActions}>
                <Link className={styles.primaryButton} href="/app-download-guide">
                  Download Guide <b>→</b>
                </Link>
                <Link className={styles.secondaryButton} href="/faq">
                  Read the FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
