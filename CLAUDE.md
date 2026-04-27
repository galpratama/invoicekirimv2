# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (static export — 1 SSG route)
npm run start    # Serve the production build
npm run lint     # next lint (no custom rules configured yet)
```

There are no tests yet. Type-checking is handled by Next's build; for an isolated check run `npx tsc --noEmit`.

## Architecture

Marketing landing page for **InvoiceKirim** — a tagihan/invoice tool aimed at Indonesian freelancers and UKM. Stack: **Next.js 15 App Router + React 19 + Tailwind CSS v4 + TypeScript**.

The whole site is currently a single static route (`/`) composed from section components. Page assembly lives in `app/page.tsx`, which imports each section in render order:

```
Navbar → Hero → Features → SocialProof → Pricing → CTA → Footer
```

Each section is a self-contained file in `components/` with no shared client state, no data fetching, and no client components — everything renders as a Server Component during build, so the route ships as static HTML.

### Design system (read before styling)

Tailwind v4 uses **CSS-first configuration**. The single source of truth for colors, fonts, and radii is the `@theme` block at the top of `app/globals.css`. Tokens defined there automatically become Tailwind utilities:

- Colors: `bg-bg`, `text-ink`, `text-ink-soft`, `text-muted`, `text-faint`, `bg-brand`, `bg-brand-soft`, `border-line`, `border-line-strong`, etc. The palette is warm gray + saddle brown — **do not introduce purple/blue accents**.
- Fonts: `font-display` (Fraunces serif, used for all headlines + accent words via `<em>`) and `font-sans` (DM Sans, body default). **Avoid Inter, Roboto, and Arial** — fonts are loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables on `<html>`.

Headlines pattern: serif `<h2>` with one or two key words wrapped in `<em className="font-light italic">` for visual emphasis. This is the project's signature — preserve it when adding new sections.

### Hydration note

`<body>` in `app/layout.tsx` carries `suppressHydrationWarning` to absorb attributes injected by browser extensions (Grammarly, dark-reader). Keep it. Do not add `suppressHydrationWarning` deeper in the tree without a documented reason — it can mask real SSR/CSR mismatches.

### Path alias

`@/*` maps to the repo root (see `tsconfig.json`). Imports use `@/components/...`.

## Conventions

- Section components are pure presentational, no props, no state. If a section needs interactivity, extract the interactive piece into its own `"use client"` component to keep the parent on the server.
- Indonesian copywriting throughout (`lang="id"`). New copy should match the existing tone: casual, direct, second-person, sentence-case.
- Generous vertical rhythm: sections use `py-24 md:py-32`. Container is `mx-auto max-w-6xl px-6`. Mobile-first — default styles target mobile, `md:` adds desktop.
