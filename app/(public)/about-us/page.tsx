// app/about-us/page.tsx (corrected)
import type { Metadata } from "next";
import Link from "next/link";
import styles from "../../page.module.css";
import { Breadcrumbs, JsonLd, SectionHeader, breadcrumbSchema } from "../../ui";

export const metadata: Metadata = {
    title: "About Goplay – Who We Are",
    description: "Learn about Goplay — a mobile gaming platform designed for entertainment and interactive gameplay on Android. Our mission, values, and approach to responsible usage.",
    alternates: { canonical: "https://goplay11game.net/about-us" },
};

const values = [
    { icon: "🎮", title: "Entertainment First", body: "Goplay is built for enjoyment. Every feature, category, and interface decision is made with the player's experience in mind." },
    { icon: "📱", title: "Mobile-First Design", body: "The platform is designed from the ground up for Android — touch controls, lightweight performance, and fast navigation are built in, not bolted on." },
    { icon: "🛡️", title: "Safe & Trusted", body: "We guide users to download only from trusted sources, protect their credentials, and keep their devices secure throughout their experience." },
    { icon: "🧭", title: "Clear Information", body: "This site exists to explain the platform clearly — download steps, features, FAQs, and troubleshooting — so users can make informed decisions." },
    { icon: "⚡", title: "Performance Focus", body: "Smooth gameplay and fast loading are not optional features. They are the baseline Goplay is measured against with every update." },
    { icon: "♿", title: "Accessible Experience", body: "Navigation, content hierarchy, and interface elements are designed to work for all users regardless of device age or ability." },
];

const platformFeatures = [
    ["Casual Games", "Easy-to-learn titles suitable for all skill levels and quick sessions."],
    ["Card Games", "Classic and modern card-based games with strategic depth."],
    ["Strategy Games", "Category requiring forward thinking and tactical decision-making."],
    ["Skill Games", "Titles that reward practice and improve with repeated play."],
    ["Quick Play", "Short-format games designed for on-the-go entertainment."],
];

const stats = [
    { value: "5M+", label: "Active Players" },
    { value: "5", label: "Gaming Categories" },
    { value: "⚡", label: "Lightning Fast" },
    { value: "📱", label: "Android Optimized" },
];

const teamValues = [
    { number: "01", title: "Player-Centric Design", description: "Every pixel, every interaction, and every feature is crafted with the player's journey in mind — from first tap to daily engagement." },
    { number: "02", title: "Transparency First", description: "We believe in clear communication. No hidden terms, no confusing jargon — just straightforward information about how the platform works." },
    { number: "03", title: "Continuous Improvement", description: "The platform evolves with player feedback. Regular updates ensure Goplay stays responsive, relevant, and reliable." },
];

export default function Page() {
    const jsonLd = [
        breadcrumbSchema("About Us", "/about-us"),
        {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About Goplay",
            url: "https://goplay11game.net/about-us",
            description: "Goplay is a mobile gaming platform designed for entertainment and interactive gameplay on Android.",
        },
    ];

    return (
        <>
            <JsonLd data={jsonLd} />
            <main id="main-content" className={styles.innerPage}>

                {/* Breadcrumb */}
                <div className={styles.container}>
                    <Breadcrumbs current="About Us" />
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
                                About Goplay
                            </span>
                            <h1 style={{
                                fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                                fontWeight: 700,
                                lineHeight: 1.1,
                                marginBottom: 16,
                                letterSpacing: "-0.02em",
                            }}>
                                Built for <span style={{ color: "var(--primary, #2563eb)" }}>Play</span>,<br />
                                Driven by <span style={{ color: "var(--primary, #2563eb)" }}>Purpose</span>
                            </h1>
                            <p style={{
                                fontSize: "1.15rem",
                                lineHeight: 1.7,
                                color: "var(--body, #4b5563)",
                                maxWidth: 580,
                                margin: "0 auto",
                            }}>
                                Goplay is a mobile gaming platform designed for entertainment and interactive
                                gameplay — fast, lightweight, and built for Android.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission + Stats */}
                <section className={styles.contentSection} aria-label="Platform mission" style={{ paddingTop: 0 }}>
                    <div className={styles.container}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: 40,
                            background: "var(--surface, #ffffff)",
                            borderRadius: 24,
                            padding: "40px 32px",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                            border: "1px solid var(--border-light, #f0f0f0)",
                        }}>
                            <div>
                                <h2 style={{
                                    fontSize: "1.6rem",
                                    fontWeight: 600,
                                    marginBottom: 16,
                                    letterSpacing: "-0.01em",
                                }}>
                                    What is Goplay?
                                </h2>
                                <p style={{ color: "var(--body, #4b5563)", lineHeight: 1.8, marginBottom: 12 }}>
                                    Goplay is a mobile gaming platform designed for entertainment and
                                    interactive gameplay. The app is mainly used on Android devices and
                                    provides users with access to different gaming categories through a
                                    simple and fast interface.
                                </p>
                                <p style={{ color: "var(--body, #4b5563)", lineHeight: 1.8, marginBottom: 12 }}>
                                    Users prefer Goplay because it combines smooth performance with an
                                    interface that doesn&apos;t require a learning curve. Whether you
                                    have five minutes or an hour, the platform is ready to deliver a
                                    comfortable gaming experience.
                                </p>
                                <p style={{ color: "var(--body, #4b5563)", lineHeight: 1.8 }}>
                                    This website — Goplay11Game.net — is the resource hub for the
                                    platform. It provides a download guide, installation instructions,
                                    feature information, troubleshooting, security guidance, and answers
                                    to common questions.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                                gap: 16,
                                borderTop: "1px solid var(--border-light, #f0f0f0)",
                                paddingTop: 32,
                            }}>
                                {stats.map(({ value, label }) => (
                                    <div key={label} style={{
                                        textAlign: "center",
                                        padding: "16px 8px",
                                        background: "var(--surface-alt, #f8fafc)",
                                        borderRadius: 16,
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    }}>
                                        <div style={{
                                            fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                                            fontWeight: 700,
                                            color: "var(--primary, #2563eb)",
                                            lineHeight: 1.2,
                                        }}>
                                            {value}
                                        </div>
                                        <small style={{
                                            fontSize: "0.8rem",
                                            color: "var(--muted, #6b7280)",
                                            fontWeight: 500,
                                            display: "block",
                                            marginTop: 4,
                                        }}>
                                            {label}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section
                    className={styles.contentSection}
                    style={{ background: "var(--surface-alt, #f8fafc)", paddingTop: 56, paddingBottom: 56 }}
                    aria-label="Our values"
                >
                    <div className={styles.container}>
                        <SectionHeader
                            label="OUR VALUES"
                            title="What Drives the Goplay Experience"
                            subtitle="Six principles that shape how the platform is built, maintained, and documented."
                        />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 24,
                            marginTop: 32,
                        }} role="list">
                            {values.map(({ icon, title, body }) => (
                                <article
                                    key={title}
                                    className="valueCard"   // <-- added class for CSS hover
                                    style={{
                                        background: "#ffffff",
                                        borderRadius: 20,
                                        padding: "28px 24px",
                                        border: "1px solid var(--border-light, #f0f0f0)",
                                        transition: "transform 0.2s ease, box-shadow 0.3s ease",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                                    }}
                                    role="listitem"
                                >
                                    <span style={{
                                        fontSize: "2rem",
                                        display: "block",
                                        marginBottom: 12,
                                    }} aria-hidden="true">
                                        {icon}
                                    </span>
                                    <h3 style={{
                                        fontSize: "1.05rem",
                                        fontWeight: 600,
                                        marginBottom: 8,
                                        letterSpacing: "-0.01em",
                                    }}>
                                        {title}
                                    </h3>
                                    <p style={{
                                        fontSize: "0.92rem",
                                        lineHeight: 1.7,
                                        color: "var(--body, #4b5563)",
                                        margin: 0,
                                    }}>
                                        {body}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Values / Philosophy */}
                <section className={styles.contentSection} aria-label="Our philosophy" style={{ paddingTop: 56, paddingBottom: 56 }}>
                    <div className={styles.container}>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: 24,
                        }}>
                            {teamValues.map(({ number, title, description }) => (
                                <div key={title} style={{
                                    padding: "24px 20px",
                                    borderLeft: "3px solid var(--primary, #2563eb)",
                                    background: "var(--surface, #ffffff)",
                                    borderRadius: "0 16px 16px 0",
                                    boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                                }}>
                                    <span style={{
                                        fontSize: "0.7rem",
                                        fontWeight: 600,
                                        color: "var(--primary, #2563eb)",
                                        letterSpacing: "0.06em",
                                        display: "block",
                                        marginBottom: 6,
                                    }}>
                                        {number}
                                    </span>
                                    <h3 style={{
                                        fontSize: "1.05rem",
                                        fontWeight: 600,
                                        marginBottom: 6,
                                        letterSpacing: "-0.01em",
                                    }}>
                                        {title}
                                    </h3>
                                    <p style={{
                                        fontSize: "0.9rem",
                                        lineHeight: 1.7,
                                        color: "var(--body, #4b5563)",
                                        margin: 0,
                                    }}>
                                        {description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Game Categories */}
                <section
                    className={styles.contentSection}
                    style={{ background: "var(--surface-alt, #f8fafc)", paddingTop: 56, paddingBottom: 56 }}
                    aria-label="Gaming categories"
                >
                    <div className={styles.container}>
                        <div style={{
                            background: "#ffffff",
                            borderRadius: 24,
                            padding: "40px 32px",
                            boxShadow: "0 2px 16px rgba(0,0,0,0.02)",
                            border: "1px solid var(--border-light, #f0f0f0)",
                        }}>
                            <h2 style={{
                                fontSize: "1.5rem",
                                fontWeight: 600,
                                marginBottom: 8,
                                letterSpacing: "-0.01em",
                            }}>
                                Gaming Categories
                            </h2>
                            <p style={{
                                color: "var(--body, #4b5563)",
                                lineHeight: 1.7,
                                marginBottom: 28,
                                maxWidth: 560,
                            }}>
                                Goplay currently provides access to five gaming categories. Availability
                                may vary — check the in-app dashboard for the latest selection.
                            </p>

                            <div style={{ overflowX: "auto" }}>
                                <table className={styles.table} aria-label="Gaming categories table" style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    fontSize: "0.92rem",
                                }}>
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid var(--border, #e5e7eb)" }}>
                                            <th scope="col" style={{
                                                textAlign: "left",
                                                padding: "12px 16px",
                                                fontWeight: 600,
                                                color: "var(--heading, #111827)",
                                            }}>
                                                Category
                                            </th>
                                            <th scope="col" style={{
                                                textAlign: "left",
                                                padding: "12px 16px",
                                                fontWeight: 600,
                                                color: "var(--heading, #111827)",
                                            }}>
                                                Description
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {platformFeatures.map(([cat, desc]) => (
                                            <tr key={cat} style={{ borderBottom: "1px solid var(--border-light, #f3f4f6)" }}>
                                                <th scope="row" style={{
                                                    textAlign: "left",
                                                    padding: "12px 16px",
                                                    fontWeight: 500,
                                                    color: "var(--heading, #111827)",
                                                }}>
                                                    {cat}
                                                </th>
                                                <td style={{
                                                    padding: "12px 16px",
                                                    color: "var(--body, #4b5563)",
                                                }}>
                                                    {desc}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Responsible Usage */}
                <section className={styles.contentSection} aria-label="Responsible usage" style={{ paddingTop: 56, paddingBottom: 56 }}>
                    <div className={styles.container}>
                        <div style={{
                            display: "flex",
                            gap: 24,
                            flexWrap: "wrap",
                            background: "var(--surface, #ffffff)",
                            borderRadius: 24,
                            padding: "36px 32px",
                            border: "1px solid var(--border-light, #f0f0f0)",
                            alignItems: "flex-start",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                        }} role="note">
                            <div style={{
                                fontSize: "2.4rem",
                                flexShrink: 0,
                                paddingTop: 2,
                            }} aria-hidden="true">
                                ⚠️
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{
                                    fontSize: "1.3rem",
                                    fontWeight: 600,
                                    marginBottom: 8,
                                    letterSpacing: "-0.01em",
                                }}>
                                    Responsible Usage
                                </h2>
                                <p style={{
                                    color: "var(--body, #4b5563)",
                                    lineHeight: 1.7,
                                    marginBottom: 16,
                                }}>
                                    Goplay is designed for entertainment purposes only. We encourage
                                    all users to:
                                </p>
                                <ul style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: "8px 24px",
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                }}>
                                    {[
                                        "Manage screen time and take regular breaks",
                                        "Keep account credentials private and secure",
                                        "Download only from official, trusted sources",
                                        "Use the app in a way that complements daily life",
                                        "Reach out for support if gaming feels compulsive",
                                    ].map((item) => (
                                        <li key={item} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            fontSize: "0.9rem",
                                            color: "var(--body, #4b5563)",
                                            lineHeight: 1.5,
                                        }}>
                                            <span style={{
                                                color: "var(--primary, #2563eb)",
                                                fontWeight: 700,
                                                fontSize: "1.1rem",
                                            }}>•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company Info */}
                <section
                    className={styles.contentSection}
                    style={{ background: "var(--surface-alt, #f8fafc)", paddingTop: 56, paddingBottom: 56 }}
                    id="company"
                    aria-label="Company information"
                >
                    <div className={styles.container}>
                        <div style={{
                            background: "#ffffff",
                            borderRadius: 24,
                            padding: "36px 32px",
                            border: "1px solid var(--border-light, #f0f0f0)",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                            textAlign: "center",
                        }} role="note">
                            <span style={{
                                fontSize: "2rem",
                                display: "block",
                                marginBottom: 12,
                            }} aria-hidden="true">
                                🏢
                            </span>
                            <h2 style={{
                                fontSize: "1.3rem",
                                fontWeight: 600,
                                marginBottom: 8,
                                letterSpacing: "-0.01em",
                            }}>
                                Company Information
                            </h2>
                            <p style={{
                                color: "var(--body, #4b5563)",
                                lineHeight: 1.7,
                                maxWidth: 560,
                                margin: "0 auto",
                                fontSize: "0.95rem",
                            }}>
                                <strong>[INSERT REAL COMPANY INFO]</strong> — Add the operator&apos;s
                                verified legal entity name, registration details, registered address,
                                and contact information here before publishing to production.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className={styles.contentSection} aria-label="Get started" style={{ paddingTop: 56, paddingBottom: 56 }}>
                    <div className={styles.container}>
                        <div style={{
                            textAlign: "center",
                            maxWidth: 640,
                            margin: "0 auto",
                            background: "var(--surface, #ffffff)",
                            borderRadius: 24,
                            padding: "48px 32px",
                            border: "1px solid var(--border-light, #f0f0f0)",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
                        }}>
                            <span style={{
                                fontSize: "2.8rem",
                                display: "block",
                                marginBottom: 12,
                            }} aria-hidden="true">
                                🚀
                            </span>
                            <h2 style={{
                                fontSize: "1.6rem",
                                fontWeight: 600,
                                marginBottom: 8,
                                letterSpacing: "-0.01em",
                            }}>
                                Ready to Start Playing?
                            </h2>
                            <p style={{
                                color: "var(--body, #4b5563)",
                                lineHeight: 1.7,
                                marginBottom: 28,
                                fontSize: "1rem",
                            }}>
                                Follow our step-by-step download guide to get Goplay running on your
                                Android device safely and quickly.
                            </p>
                            <div style={{
                                display: "flex",
                                gap: 16,
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}>
                                <Link
                                    className={styles.secondaryButton}
                                    href="/faq"
                                    style={{
                                        background: "transparent",
                                        border: "2px solid var(--navy, #1e293b)",
                                        color: "var(--navy, #1e293b)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    Read the FAQ
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Style block for value card hover */}
            <style>{`
                .valueCard:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.06);
                }
            `}</style>
        </>
    );
}