# Roadmap

Now / Next / Later — the working map for Ludvik4. Keep it short: one line per
item, link out to a doc (`docs/site-v0.md`, `docs/site-v0-setup.md`) instead of
writing detail here.

## Now

**Dual-market rebuild (ТЗ 1) — DONE 2026-07-22, merged to `main`; EN half is
LIVE since 2026-07-25.** Two market storefronts from one codebase via
`SITE_MARKET=ru|en`; positioning → founder-led studio, 4→3 services, RU form
removed, SEO split by market. Plan + deliverables: `docs/specs/dual-market-sites.plan.md`.
Blocking follow-ups before it ships:

- **[DONE 2026-07-23] RU pricing amounts** — set to сайт/лендинг от 40 000 ₽,
  автоматизация от 40 000 ₽, веб-приложение/компактный SaaS от 110 000 ₽
  (`content.ts` + FAQ pricing answer aligned).
- **[DONE 2026-07-23] EN privacy notice.** `/privacy`, footer/form links,
  controller identity, and layered notice are implemented. The form now uses
  Resend email only; Telegram remains a separate direct-contact link. Production
  still needs the Resend variables listed in `docs/legal/privacy-notice-en.md`.
- **[DONE 2026-07-25] ТЗ 2 — EN half.** `ludvik4.dev` now serves the EN market
  (`SITE_MARKET=en` in the Vercel production env); `/en` 308-redirects to the
  root; `/blog*` 404s; sitemap/robots/canonical are EN-only. Lead form verified
  end-to-end against live Resend. Runbook (deploy, rollback, env, diagnostics):
  `docs/playbooks/production-en-vercel.md`.
- **ТЗ 2 — RU half in progress** (`docs/agent-briefs/02-deploy-two-market-sites.ru.md`):
  RU domain `ludvik4.ru` bought, RU-reachable hosting (Timeweb, static build via
  `pnpm build:ru-static`), DNS, availability checks, monitoring.
- **[BLOCKED on RU going live] `/blog/*` → RU domain 301.** Owner's decision:
  redirect the 5 RU articles from `ludvik4.dev/blog/<slug>` to the RU domain
  once it actually answers — they 404 in the meantime. Add beside the `/en`
  rule in `next.config.ts`.

SEO/GEO rollout — **5 articles LIVE** with per-article covers. Remaining moves,
guided by `docs/playbooks/seo-geo.md`:

- **[USER] GSC indexing (3 newer URLs).** Request indexing in Google Search
  Console for `/blog/github-spec-kit`, `/blog/agents-md-primer`,
  `/blog/cursor-rules` (both first articles already requested).
- **[USER, optional] vc.ru brand bio** — pick one of the 3 options offered in
  chat; the chosen one becomes the canonical brand bio.
- **Off-site distribution (ongoing)** — plan + status matrix:
  `docs/playbooks/distribution.md`. Adaptations for all 5 articles live beside
  each article (`src/content/blog/<slug>/`); **[COWORKER]** publishes per the
  matrix. Live so far: vc.ru article 1. Habr dropped; GEO now runs through the
  public `grooownow/qa-pilot` repo (attribution shipped v0.2.4).
- **Content — Wave 2 next** (`docs/content-plan.md`): build the pillar
  «AI-агенты для разработки» + Claude Code long-tail (настройка / vs Cursor /
  аналоги). Deferred: commercial-intent pull for `/uslugi/...` (Layer 2).

## Next

Scoped and agreed, not yet started:

- **[DONE 2026-07-25] Resend production secrets** — set in the Vercel
  production env and proven by a live test enquiry through the EN form
  (delivery accepted by Resend).
- **Per-service landing pages** (`/uslugi/...`) — phase 2 of the SEO spec,
  one page per query cluster, after the first articles index.

## Later

Ideas worth keeping, not yet scoped:

- **Portfolio / cases** section (incl. FortNoise) — the deferred V1 cut.
- **Turnstile captcha** on the lead form (`TURNSTILE_*` already supported).
- Short courses (AI & dev topics for beginners).
- **Full bilingual site (RU / EN)** — a lightweight EN landing `/en` shipped
  2026-07-20 (entry point for the GitHub/qa-pilot audience). Full bilingual
  (every page + all articles, i18n routing) is still deferred. Follow-up:
  point the qa-pilot README "Made by" link to `ludvik4.dev/en` (next qa-pilot
  release, to avoid update-noise churn).
- Lead moderation dashboard (would introduce DB + auth — big lift).

## Shipped

Most recent first:

- **Per-article covers** (2026-07-21) — one brand card per article → hero +
  `/blog` thumbnail + OG/Twitter + Article JSON-LD image; optional
  `cover`/`coverAlt` frontmatter (zod-refined), rule in `docs/rules/content.md`.
  Blog layout widened to match the home (`max-w-5xl`, horizontal list cards),
  publish dates spread 2026-06-11…07-20.
- **Semantic core + content plan + Wave 1** (2026-07-19) — 44-query scored core
  (`docs/seo-core.md`) → clustered `docs/content-plan.md` (method:
  `docs/specs/seo-core-research.md`; audit: `docs/archive/seo-audit.md`). Wave 1
  shipped 3/3: github-spec-kit, agents-md-primer, cursor-rules (5 articles LIVE).
- **Search consoles + canonical** (2026-07-16) — GSC + Yandex.Webmaster verified
  for `https://ludvik4.dev`, `sitemap.xml` submitted in both; `ludvik4.dev` set
  as the primary Vercel domain, `www` 308-redirects to it.
- **First two articles published** (2026-07-16) — AI-agents readiness +
  spec-driven development, rewritten to `docs/rules/content.md` standards
  (primary sources: agents.md, AWS Kiro, GitHub Spec Kit). Blog footer
  layout fix rode along.
- **SEO/GEO foundation** — FAQ section (+FAQPage schema), MDX blog with RSS
  and sitemap, llms.txt, Organization/WebSite JSON-LD graph, search-console
  verification slots, `docs/playbooks/seo-geo.md`.
  Spec: `docs/specs/seo-geo-strategy.md`.
- **Landing MVP** — one-page Ludvik4 brand site: hero + illustration, services
  catalogue, work formats, how-it-works, pricing, about, contact form → email.
  Rose brand from `design.pen`, SEO (OG/JSON-LD/sitemap), deployed to Vercel on
  `ludvik4.dev`. Source of truth: `docs/site-v0.md`.
- **Onboarding** — `/liftoff` Step 0 (environment verified).
