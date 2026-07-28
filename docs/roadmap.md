# Roadmap

Now / Next / Later — the working map for Ludvik4. Keep it short: one line per
item, link out to a doc (`docs/site-v0.md`, `docs/site-v0-setup.md`) instead of
writing detail here.

## Now

**[DONE 2026-07-27] RU commercial SEO pass.** The home now names the three
services in the H1 and has a valid H1→H2→H3 hierarchy, neutral RU voice, two
public evidence cases, and lighter desktop-only hero delivery. Three
intent-specific service pages plus `/cases` and two case pages are included in
the sitemap and `llms.txt`. Verification tokens for `ludvik4.ru` are present;
Google Search Console and Yandex Webmaster are verified, the sitemap is
submitted to both, and seven original public URLs were queued for indexing.
Google processed the sitemap successfully and found 13 URLs; Yandex accepted
it into its processing queue. Plan: `docs/specs/ru-commercial-seo.plan.md`.

**Dual-market rebuild and deployment (ТЗ 1 + ТЗ 2) — DONE; EN has been live
since 2026-07-25 and RU since 2026-07-27.** Two market storefronts from one codebase via
`SITE_MARKET=ru|en`; positioning → founder-led studio, 4→3 services, RU form
removed, SEO split by market. Plan + deliverables: `docs/specs/dual-market-sites.plan.md`.
Completed follow-ups:

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
- **[DONE 2026-07-27] ТЗ 2 — RU half.** `ludvik4.ru`, DNS, the Timeweb static
  build, and GitHub `main` → SourceCraft `deploy` → Timeweb API autodeploy are
  live on replacement app `228103`. Timeweb fixed the orphaned Caddy vhost in
  ticket `12354415`; apex content and assets were verified byte-for-byte
  against the technical domain before the ticket was closed. `www` serves the
  same build with an apex canonical; a strict `www` → apex redirect is
  intentionally deferred because App Platform cannot configure it and a
  dedicated backend costs 510 RUB/month. Decision:
  `docs/decisions/0003-defer-ru-www-redirect.md`. Runbook:
  `docs/playbooks/production-ru-timeweb.md`.
- **[DONE 2026-07-25] `/blog/*` → RU domain 301.** `ludvik4.ru` went live, so
  the blog list, all 5 articles and the RSS feed now 308 from `ludvik4.dev` to
  the same slug on the RU domain (verified end-to-end: 308 → 200). Rules live
  in `config/redirects.ts`, market-scoped so the RU build never redirects its
  own blog. `Disallow: /blog` was dropped from robots at the same time — a
  crawler forbidden to fetch a URL never follows its redirect.

**[DONE 2026-07-26] CI is green again** (red since 2026-07-23 on a single step,
`pnpm audit --audit-level high` in the `quality` job). Fixed by upgrading only —
the planned `ignoreGhsas` allowlist proved unnecessary:

- `next` 16.2.10 → 16.2.11, `next-auth` beta.31 → **beta.32**, `@auth/core`
  0.41.2 → 0.41.3, `postcss` 8.5.16 → 8.5.23. Transitive copies no parent has
  re-released (`sharp`, `postcss`, `fast-uri`, `brace-expansion`, and the
  `@auth/core` pinned by `@auth/drizzle-adapter`) are pulled up by overrides in
  `pnpm-workspace.yaml`, each annotated with its GHSA.
- The next-auth advisories read as unfixable ("patched in >=5.0.0", which does
  not exist) but their **vulnerable** ranges stop at `<=5.0.0-beta.31`, so
  beta.32 clears all three. Correcting an earlier note in this file that said
  no upgrade could.
- **Do not take `next` 16.2.12** (or any hours-old release): it trips the repo's
  `minimumReleaseAge` policy, and installing it makes pnpm write a
  `minimumReleaseAgeExclude` block into `pnpm-workspace.yaml` — a hole in a
  supply-chain guard. 16.2.11 already carries every fix. If that block ever
  reappears in a diff, treat it as a red flag, not noise.
- Still worth doing separately: drop the unused Liftkit auth stack. `/signin`
  (200) and `/dashboard` (307) are published on a brochure site and are the only
  reason the auth advisories apply at all.

SEO/GEO rollout — **13 articles LIVE** with per-article covers. Remaining moves,
guided by `docs/playbooks/seo-geo.md`:

- **[DONE 2026-07-28] New-URL indexing.** The final 21-URL sitemap was
  resubmitted to Google and Yandex. Yandex queued all eight commercial
  articles; Google queued five before its daily manual-request limit, while
  all eight remain discoverable in the sitemap. Console acceptance is not a
  ranking guarantee.
- **[USER, optional] vc.ru brand bio** — pick one of the 3 options offered in
  chat; the chosen one becomes the canonical brand bio.
- **Off-site distribution (ongoing)** — plan + status matrix:
  `docs/playbooks/distribution.md`. The original five articles retain their
  existing adaptations; all eight commercial articles now have fresh vc.ru and
  Дзен drafts beside them. **[COWORKER]** publishes per the matrix. Live so far:
  vc.ru article 1. Habr dropped; GEO also runs through the public
  `grooownow/qa-pilot` repo (attribution shipped v0.2.4).
- **Content — after the first indexing check** (`docs/content-plan.md`): build the pillar
  «AI-агенты для разработки» + Claude Code long-tail (настройка / vs Cursor /
  аналоги). First inspect real queries for the commercial batch after 3–4
  weeks.

## Next

Scoped and agreed, not yet started:

- **[DONE 2026-07-25] Resend production secrets** — set in the Vercel
  production env and proven by a live test enquiry through the EN form
  (delivery accepted by Resend).
- **[DONE 2026-07-28] Commercial bridge articles** — all eight priorities from
  `docs/specs/ru-commercial-seo.plan.md` are published; each service has at
  least two supporting search entries.

## Later

Ideas worth keeping, not yet scoped:

- Add the next case only when a public result and approved screenshot exist.
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
