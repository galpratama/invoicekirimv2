# AGENTS.md

InvoiceKirim — invoice/tagihan SaaS for Indonesian freelancers & UKM. Next.js 15 App Router, React 19, Tailwind v4, TypeScript, Supabase (auth + Postgres), Midtrans (payments).

## Commands

```bash
npm run dev      # dev server, http://localhost:3000
npm run build    # production build (SSR — NOT static export)
npm run start    # serve production build
npm run lint     # next lint
npx tsc --noEmit # isolated type check (no test suite exists)
```

No tests. Type errors surface via `npm run build` or `tsc --noEmit`.

`scripts/test-supabase.mjs` checks Supabase connectivity but is **not** in package.json and needs env loaded: `node --env-file=.env.local scripts/test-supabase.mjs`. Note `scripts/` is gitignored.

## CLAUDE.md is partly stale

`CLAUDE.md`'s **design-system section is still accurate** (Tailwind v4 `@theme` in `app/globals.css`, Fraunces/DM Sans, warm-gray + saddle-brown palette, no purple/blue, serif `<h2>` with `<em>` accent words). But its **architecture section is outdated**: the site is no longer "a single static route / static HTML." There is now auth middleware, server actions, dynamic routes, and API routes — it is a server-rendered app. Trust this file over CLAUDE.md for architecture.

## Architecture

- `app/page.tsx` — marketing landing, server component, reads auth to toggle logged-in CTAs. Sections in `components/` now take props (e.g. `isLoggedIn`); they are no longer pure/propless.
- `app/login`, `app/auth/callback/route.ts` — Supabase auth (PKCE code exchange → `/dashboard`).
- `app/dashboard/**` — gated app. Invoice CRUD via server actions in `actions.ts` files (`"use server"`).
- `app/invoice/[id]/page.tsx` — public invoice view (printable, A4 print CSS).
- `app/upgrade` — Pro upgrade; `UpgradeClient.tsx` loads Midtrans Snap and calls the payment API.
- `app/api/payment/create-transaction` — creates Midtrans Snap tx + inserts `payments` row.
- `app/api/payment/webhook` — Midtrans notification handler; verifies sha512 signature, marks payment paid, upserts `subscriptions` to Pro for 30 days.
- `lib/subscription.ts` — plan logic. Free = 5 invoices/month (`FREE_INVOICE_LIMIT`). `lib/invoice.ts` — `INV-001` numbering.

Inferred Postgres tables (Supabase): `invoices`, `subscriptions`, `payments`. Supabase MCP is configured in `.mcp.json`; use it / the `supabase` skill for schema work.

## Supabase client — pick the right factory

Four factories with different purposes; using the wrong one breaks auth or RLS:

- `utils/supabase/client.ts` → `createClient()` — browser/client components only.
- `utils/supabase/server.ts` → `createClient(cookieStore)` — server components, route handlers, server actions. **Non-standard: you must pass `await cookies()` as an argument** (it does not call `cookies()` internally).
- `utils/supabase/admin.ts` → `createAdminClient()` — service-role key, **bypasses RLS**. Server-only, privileged paths (e.g. payment webhook) only.
- `utils/supabase/middleware.ts` → helper that exists but is **unused**; root `middleware.ts` has its own inline implementation. Don't assume the helper is wired in.

## Env vars (`.env.local`, gitignored)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — **code uses this, not** `NEXT_PUBLIC_SUPABASE_ANON_KEY` (an `ANON_KEY` also sits in `.env.local` but is unreferenced — don't switch to it).
- `SUPABASE_SERVICE_ROLE_KEY` — admin client; never expose client-side.
- `MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION` (the latter is set but currently unused).

## Quirks

- **Midtrans is hardcoded to sandbox**: `isProduction: false` in `create-transaction/route.ts` and the sandbox `snap.js` URL in `UpgradeClient.tsx`. `MIDTRANS_IS_PRODUCTION` is not consumed — going live requires code changes, not just env.
- `midtrans-client` is imported via CommonJS `require()` with an eslint-disable; keep that pattern (no ESM types).
- Auth middleware (`middleware.ts`) only matches `/dashboard/:path*` and `/login`. Add new gated routes to the `matcher`.
- Path alias `@/*` → repo root.
- `lib/invoice.ts` has an unresolved TODO about invoice-number ordering (gap/duplicate tradeoff) — confirm intent before changing numbering.
