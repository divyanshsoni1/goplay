---
inclusion: fileMatch
fileMatchPattern: ['**/*.ts', '**/*.tsx', '**/*.css', '**/*.mjs']
---

# Technical Reference

## Stack Versions

| Package | Version |
|---|---|
| Next.js | 16.2.12 (App Router) |
| React | 19.2.4 |
| TypeScript | ^5 (strict mode) |
| Tailwind CSS | ^4 (via `@tailwindcss/postcss`) |
| ESLint | ^9 (`eslint-config-next` core-web-vitals + typescript) |

## TypeScript

- `strict: true` is set in `tsconfig.json` — all code must pass strict checks.
- Target is `ES2017`; module resolution is `bundler`.
- Path alias `@/*` maps to the workspace root (e.g., `@/app/components`).
- Always type component props explicitly. Prefer inline type literals for simple props; use a named `type` or `interface` only when the shape is reused.
- Use `type` imports (`import type { Metadata } from "next"`) for types that are only needed at compile time.
- Async page/layout params are typed as `Promise<{ slug: string }>` and must be awaited — this is the Next.js 16 App Router convention.

## React & Component Patterns

- All components are **React Server Components by default**. Add `"use client"` only when the component needs browser APIs, event handlers, or React state/effects.
- Current `"use client"` components: `FaqAccordion` (uses `useState`), `ContactForm` (uses form state). Follow this as the baseline for deciding when to opt in.
- Co-locate small page-specific subcomponents inside the route's `page.tsx`. Extract to `app/components.tsx` only when the component is used in two or more routes.
- Data arrays used for rendering (e.g., `metrics`, `features`, `steps` on the home page) are declared as `const` outside the component body to avoid re-creation on each render.

## File & Import Conventions

- Import CSS Modules as `import styles from "../page.module.css"` — path depth varies by route, but always points to the single shared module.
- Import shared components from `"../components"` (or `"../../components"` for nested routes). Never import from absolute paths when a relative path works.
- Use Next.js `<Link>` for all internal navigation. Use `<a>` only for in-page anchors (`href="#section-id"`) or genuine external links.
- Import `notFound` from `"next/navigation"` to handle missing dynamic route segments.

## CSS & Styling

- Tailwind CSS 4 is loaded globally via `@import "tailwindcss"` in `app/globals.css`. Use Tailwind utility classes on the `<html>` and `<body>` elements (see `layout.tsx`) and for base resets only.
- **All component-level styles live in `app/page.module.css`** as CSS Modules. Do not create additional module files.
- Write CSS rules in compact single-line format to match the existing file style:
  ```css
  .myClass { display: flex; align-items: center; gap: 8px; }
  ```
- Use CSS custom properties for brand colours — never hard-code hex values:
  - `--navy: #000666` · `--orange: #ff5b16` · `--ink: #191c1d` · `--body: #454652` · `--muted: #767683`
- Responsive breakpoints: `@media(max-width:800px)` (tablet), `@media(max-width:460px)` (mobile). Append new responsive rules inside the existing media query blocks at the bottom of the file.

## SEO & Structured Data

- Every route file exports a `Metadata` object. Async routes use `generateMetadata`.
- `metadataBase` is set **once** in `app/layout.tsx`. Do not repeat it in page-level metadata.
- The `JsonLd` component renders a `<script type="application/ld+json">` tag. It accepts a single object or an array of objects. Always place it as the first child of the page fragment.
- Use `breadcrumbSchema(name, path)` to produce `BreadcrumbList` JSON-LD for every inner page. Additional schema types (e.g., `FAQPage`) are composed alongside it in an array.
- **Keep `sitemap.ts` and `robots.ts` in sync** when routes are added or removed. Home page `priority` is `1`; all other pages default to `0.7` and `changeFrequency: "monthly"`.

## Blog Content

- Post metadata (slug, title, date, excerpt) is maintained in `app/blog/posts.ts` as a typed array of objects.
- Post body copy is stored in `app/blog/[slug]/page.tsx` as a `Record<string, string[]>` — one string per paragraph.
- A new blog post requires changes to **three** files: `posts.ts`, `[slug]/page.tsx`, and `sitemap.ts`. All three slugs must be identical.

## Build & Lint

```bash
npm run build   # next build — runs type-check and produces production output
npm run lint    # eslint — must pass before treating code as complete
```

- Never introduce new `eslint-disable` comments without a concrete reason.
- Do not run `npm run dev` or `npm run start` as automated commands; instruct the user to run them manually in a terminal.

## Dependencies

- No external UI component libraries (no shadcn, MUI, Radix, etc.).
- No animation libraries (no Framer Motion, GSAP, etc.).
- Before adding any new `npm` package, confirm the need is not already covered by Next.js built-ins, Tailwind utilities, or native browser APIs.
- Pin new dependencies to an exact version or a tight range to match the project's existing discipline.
