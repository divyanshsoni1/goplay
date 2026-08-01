---
inclusion: always
---

# GoPlay11 – Product & Codebase Steering

## Project Overview

GoPlay11 is a **Next.js 16 / React 19 / TypeScript** marketing and information site for an India-based, skill-based fantasy sports platform. The production domain is `https://goplay11game.net`. The site is purely informational — it does not contain authentication, user accounts, or payment processing logic.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 + CSS Modules (`page.module.css`) |
| Runtime | React 19 |
| Linting | ESLint 9 with `eslint-config-next` |

## Architecture Patterns

- **App Router only.** All routes live under `app/`. No `pages/` directory exists or should be created.
- **Single shared CSS module.** All styles live in `app/page.module.css`. Do not create per-page CSS modules; add new class names to this file instead.
- **Shared components in `app/components.tsx`.** `Header`, `Footer`, `Breadcrumbs`, `breadcrumbSchema`, and `JsonLd` all live here. Add new truly-shared UI pieces to this file; keep page-specific logic in the route file itself.
- **Blog content is data-driven.** Post metadata lives in `app/blog/posts.ts`; post body copy lives inline as arrays of strings inside `app/blog/[slug]/page.tsx`. Add new posts by extending both files.
- **No external UI libraries.** Do not introduce component libraries (e.g., shadcn, MUI, Radix). Use plain HTML elements styled via `page.module.css`.
- **No client components unless necessary.** Pages and components default to React Server Components. Only add `"use client"` when interactivity genuinely requires it (e.g., the FAQ accordion, contact form).

## SEO & Metadata Conventions

- Every route exports a `Metadata` object (`export const metadata: Metadata = { title, description }`).
- `metadataBase` is set once in `app/layout.tsx` — do not repeat it in page-level metadata.
- Every inner page renders `<JsonLd>` with at least a `BreadcrumbList` schema produced by the shared `breadcrumbSchema(name, path)` helper.
- The `robots.ts` and `sitemap.ts` files must be kept in sync when routes are added or removed. Sitemap `priority` for the home page is `1`; all others default to `0.7`.

## Page Structure

Inner pages (non-home) follow this consistent structure:

```tsx
<>
  <JsonLd data={...} />
  <Header />
  <main className={styles.innerPage}>
    <div className={styles.container}><Breadcrumbs current="Page Name" /></div>
    <section className={styles.pageHero}>...</section>
    <section className={styles.contentSection}>...</section>
  </main>
  <Footer />
</>
```

Always use the `styles.container` wrapper to constrain content width (max 1200 px, responsive padding).

## CSS / Styling Conventions

- CSS custom properties for the brand palette are declared on `.page`:
  - `--navy: #000666` (primary brand colour)
  - `--orange: #ff5b16` (CTA / accent colour)
  - `--ink: #191c1d` (heading text)
  - `--body: #454652` (body text)
  - `--muted: #767683` (secondary/meta text)
- Use these variables via `var(--navy)` etc.; do not hard-code hex values.
- Responsive breakpoints: `@media(max-width:800px)` (tablet) and `@media(max-width:460px)` (mobile). Add new responsive rules at the bottom of the existing media query blocks.
- All CSS is kept minified/compact in the existing style (single-line rules per selector). Match that style when adding new rules.

## Responsible Gaming & Legal Requirements

- The **18+ notice** ("18+ only · Play responsibly") must remain visible on the home page hero and wherever contests are mentioned.
- The footer fine-print ("This game may be habit-forming or financially risky. Play responsibly.") must not be removed.
- Any page discussing contests, withdrawals, or winnings must include a reminder to review official platform terms.
- Pages that require verified company/legal information but have not yet been filled in contain a `<div className={styles.notice}>` placeholder marked `[INSERT REAL COMPANY INFO]`. Do not remove these placeholders; prompt the user to supply the real information instead.

## Content Tone

- Informational and neutral — the site explains how the platform works, it does not make financial promises.
- Do not claim specific win rates, guaranteed payouts, or specific contest sizes unless the product owner provides verified figures.
- Keep CTAs action-oriented but responsible: "Download the App", "How it works", not "Win big guaranteed".

## File & Naming Conventions

- Route folders use **kebab-case** (e.g., `app-download-guide`, `about-us`).
- Component files use **camelCase** (e.g., `faq-accordion.tsx`, `contact-form.tsx`).
- All TypeScript source files use `.tsx` for files that return JSX, `.ts` for pure logic/data files.
- Blog slugs in `posts.ts` must exactly match the keys in the `content` record in `app/blog/[slug]/page.tsx` and the paths registered in `app/sitemap.ts`.

## Commands

```bash
npm run dev      # development server (run manually in terminal)
npm run build    # production build
npm run start    # production server (run manually in terminal)
npm run lint     # ESLint
```

Do not run `dev` or `start` as automated background commands — direct the user to run them manually.
