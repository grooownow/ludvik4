# Roadmap

Now / Next / Later — the working map for Ludvik4. Keep it short: one line per
item, link out to a doc (`docs/site-v0.md`, `docs/site-v0-setup.md`) instead of
writing detail here.

## Now

**[IN PROGRESS 2026-08-11] EN semantic content wave 2.** The first supporting
content network is implemented without changing the approved design system:
`/guides` plus a website-project brief, an automation-priority scorecard, and
an MVP one-user-journey scope worksheet. Each guide links to exactly one
commercial service; the service pages link back; header, footer, sitemap, and
`llms.txt` expose the hub. Unit/component/integration tests, the EN production
build, the standard RU e2e suite, and local EN runtime checks are green. Public
search checks still return no reliable result for `site:ludvik4.dev` or the
exact EN titles. `krobox@gmail.com` is authenticated in Google Search Console
but does not own the existing domain property, so sitemap submission and URL
inspection wait on ownership verification. Current evidence and next action:
`docs/seo/seo-handoff.md`.

**[DONE 2026-08-10] EN international commercial SEO/SRO rebuild.**
`ludvik4.dev` is now designed as an independent
English source for a Europe-based founder-led web product studio, not a
translation of the RU storefront. It has three commercial service pages
(websites, workflow automation, MVP/web apps), Work + the globally publishable
qa-pilot case, About, an eight-URL initial sitemap, expanded `llms.txt`, market-scoped
`humans.txt`/`security.txt`, and supported schema/internal links. RU-only
Gridfin files are physically excluded from the EN build; `/blog*` no longer
redirects EN visitors to a Russian-language domain. Production main-CI
`31420244529`, Vercel, and RU deploy `31420244090` passed. The approved
`#ff4fb6` palette is live on both markets; regression tests now lock the brand
tokens. EN FAQ uses the shared accordion with six visible chevrons. Live DOM
checks confirmed the final colour and icons on both domains.
Strategy: `docs/marketing/en/`; audit:
`docs/seo/en-audit-2026-08-10.md`; plan:
`docs/specs/en-commercial-seo.plan.md`; handoff: `docs/seo/seo-handoff.md`.
Next explicit action: submit the expanded sitemap/priority URLs in Google
Search Console, then run the LLM visibility baseline and monitor LCP/indexing.

**[DONE 2026-08-10] CI unblocked and dependency updates automated.** `main` had
been red since 2026-08-04 — every push and every nightly — on the `Audit
(high/critical)` step: seven high advisories, all on transitive deps (`undici`,
`fast-uri`, `ip-address`, `brace-expansion`, `js-yaml` in both live majors,
`nanoid` via `postcss`). None of them needed an override. Every parent already
declared a caret range the patch satisfied; the lockfile had simply not been
re-resolved since the patches shipped, so `pnpm update` inside the existing
ranges cleared all seven (23 findings → 10, 0 high) with `pnpm-workspace.yaml`
untouched. **That order is now the rule** — refresh the lockfile first, reach
for an override only when no reachable version fixes it (`docs/rules/security.md`).

Renovate (Mend GitHub App, "Renovate Only" + "Scan and Alert") now does that
refresh on a schedule, so the nightly audit stops being a detector with no
fixer behind it. Config: `.github/renovate.json5`; dashboard: issue #3. Three
settings there are load-bearing and should not be casually changed:

- `lockFileMaintenance`, Mondays before 06:00 `Europe/Madrid` — the whole point.
- `minimumReleaseAge: "3 days"`, measured rather than guessed: pnpm 11 applies
  an undocumented resolve-time quarantine (a 22.7h-old publish is refused, a
  37.6h-old one accepted). A lower floor makes Renovate produce lockfiles pnpm
  answers by auto-appending `minimumReleaseAgeExclude` entries on its own.
- `pnpm-workspace.yaml` is disabled for the bot. Left enabled it reads the
  `overrides:` block as dependencies and proposes major bumps of the security
  pins — including `brace-expansion@1 ^1.1.16 → ^5.0.0`, which the file's own
  `auditConfig` comment explains is unsafe. Those entries are debt to delete
  when upstream moves, never upgrade targets.

The sibling template `grooownow/gridfin-template` had the identical failure and
got the identical treatment.

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
- **[SUPERSEDED 2026-08-10] `/blog/*` → RU domain 301.** `ludvik4.ru` went live, so
  the blog list, all 5 articles and the RSS feed now 308 from `ludvik4.dev` to
  the same slug on the RU domain (verified end-to-end: 308 → 200). Rules live
  in `config/redirects.ts`, market-scoped so the RU build never redirects its
  own blog. `Disallow: /blog` was dropped from robots at the same time — a
  crawler forbidden to fetch a URL never follows its redirect.
  The international source audit later removed these redirects: routing an
  English buyer to a Russian-language domain contradicted market isolation and
  created an avoidable country association. `/blog*` now returns 404 on EN.

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
  Дзен drafts beside them. vc.ru draft `3050076` is assembled with its cover
  and waits for the free monthly publication quota to reset. The Ludvik4 Дзен
  channel is created and awaiting domain verification plus its first
  owner-assisted post. Live so far: vc.ru article 1. Habr dropped; GEO also
  runs through the public
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
