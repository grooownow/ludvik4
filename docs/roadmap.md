# Roadmap

Now / Next / Later — the working map for Ludvik4. Keep it short: one line per
item, link out to a doc (`docs/site-v0.md`, `docs/site-v0-setup.md`) instead of
writing detail here.

## Now

**[PENDING USER] Two open actions from the analytics work.** Neither blocks
anything, both are one-off:

1. Revoke the old Sentry personal token (`sntryu_…`) at
   sentry.io → Personal Tokens. It is superseded by an internal-integration
   token and is no longer referenced anywhere.
2. Open one session replay in PostHog and confirm with your own eyes that the
   contact form's **Your task** textarea is masked. Inputs are masked in both
   the client config and the PostHog project default, but `<textarea>` is
   handled separately by rrweb and this is the one privacy-notice promise never
   verified against a live recording.

**[SHIPPED 2026-08-29] The RU storefront is provably free of foreign
analytics, and any device can now mute itself.** Two changes, from the same
question.

Sentry was never on `ludvik4.ru` — no DSN and no `sentry.io` string in any
chunk of the live site, and a static export has no server runtime to hold the
Node SDK either; a browser check of `/` and `/blog/cursor-rules/` records zero
third-party requests. PostHog _was_, until the `market === "en"` gate shipped
on 2026-08-28 (`6a61fbd`): 191 events over 65 sessions between 28 Jul and
28 Aug are still in PostHog EU. **Deleting them is a pending user decision** —
the owner chose to keep them for now.

What did need fixing was that the guarantee lived in an `if`. Timeweb's deploy
settings still carry `NEXT_PUBLIC_POSTHOG_KEY`, and Next.js inlines every
`NEXT_PUBLIC_*` it can see, so the key literal shipped inside JavaScript served
from ludvik4.ru as dead data. `config/ru-static-env.ts` now blanks it (and
`NEXT_PUBLIC_SENTRY_DSN`) for the RU build; `parseEnv` reads a blank as unset
rather than as an invalid URL. Verified by building with sentinel values and
grepping `out/`. Still worth doing when convenient: remove the variable from
the Timeweb dashboard too.

Second, `?ludvik4_internal=1` on any page mutes that browser — PostHog through
`analyticsEnabled()`, Vercel Web Analytics through `beforeSend`, `=0` to undo.
A visible bar confirms which happened, because the device this exists for is
usually a phone with no console. **The setting is per browser and per device**,
so it has to be opened once on the laptop and once on each phone browser.
Sentry is deliberately not muted. Operations: `docs/playbooks/analytics.md`
→ "Muting your own devices".

**[FINDING 2026-08-29] First traffic audit — 14 real visitors in 30 days, none
on the EN storefront.** PostHog recorded 73 sessions between 30 Jul and 29 Aug.
Classified by device fingerprint (`$timezone` + OS + screen vs. viewport, since
cookieless mode leaves no person to group by): **36 are the owner's own**
(`Europe/Madrid` + macOS + screens `1728x1117`/`1920x1080`), **23 are
automated** (800x600 screens with 1920x1080 viewports, 2000x2000 Facebook
crawlers, viewport equal to screen, `Etc/Unknown`/UTC clocks), leaving
**14 genuine visits — all of them on `ludvik4.ru`**.

Three things follow, in order of weight:

1. **`ludvik4.dev` has had no identifiable real visitor in a month** — and the
   lead form ships only in the EN build. The only working contact channel for
   real traffic is the Telegram link, which produced the month's only two
   conversions (Kaliningrad 05-08, Lisbon 08-08, the latter a 21-minute return
   visit that clicked it three times). No lead form submission all month: the
   single `lead.form_submitted` is the owner's own test on 28-08.
2. **Excluding yourself needs a code switch, not a dashboard filter.** PostHog's
   internal-user filtering keys on person properties, and cookieless mode
   creates no persons; the timezone heuristic used for this audit would also
   swallow a genuine visitor from Spain. Proposed: a `?ludvik4_internal=1` visit
   that stores a flag in `localStorage`, after which the provider either stops
   capturing or stamps `internal: true` for a global filter. **Shipped the same
   day** — see the entry above.
3. **`/blog/cursor-rules/` is the only page with repeat search traffic** — 3 of
   the 5 search visits, all from Yandex.

**[SHIPPED 2026-08-29] Sentry disclosed, and the analytics stack documented.**
Sentry had been live in production for weeks (`SENTRY_DSN` /
`NEXT_PUBLIC_SENTRY_DSN` in Vercel) while `/privacy` named only Vercel, Resend
and PostHog, and the legal source still said "no Sentry … keep disabled". It is
now disclosed as a processor with its own legal basis; `sendDefaultPii` stays
off and the notice records that as a precondition.

Working coordinates, so a later session does not rediscover them:

| What                | Where                                                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Behaviour dashboard | `https://eu.posthog.com/project/225446/dashboard/922602` — "Ludvik4 — behaviour", 9 tiles, pinned                                                                     |
| Dashboard source    | `scripts/build-posthog-dashboard.ts` — rebuild, do not click                                                                                                          |
| Errors              | Sentry org `ludvik4`, project `ludvik4-site`                                                                                                                          |
| Access              | `SENTRY_AUTH_TOKEN` in `.env.local` — internal integration, Issue & Event + Alerts read/write. Run with `SENTRY_FORCE_ENV_TOKEN=1`, or the CLI prefers a stored login |
| Geography           | Vercel Analytics only — cookieless mode strips the IP before PostHog enriches it                                                                                      |

**Sentry triage 2026-08-29: `ludvik4-site` has zero unresolved issues.** Two
groups have ever existed, and neither needs code:

- `LUDVIK4-SITE-1` ("NetworkError: A network error occurred.", browser SDK, `/`)
  — **resolved**. One event on 2026-07-19, 0 users, never repeated in six weeks;
  its only event has since aged out of retention, so there is nothing left to
  diagnose. Left resolved rather than filtered client-side: a real "the contact
  form could not reach the server" failure is exactly what should be visible, so
  Sentry's regression detection reopens it if it ever recurs.
- `LUDVIK4-SITE-2` ("Failed to find Server Action") — **archived until one real
  user is affected** (`ignoreUserCount: 1`), not forever. The one retained event
  is provably a scanner, not a visitor: a `POST /` `multipart/form-data` whose
  boundary (`e190968d47656`) is no browser's format, `Accept: */*`,
  `Accept-Encoding: gzip` alone, `Connection: close`, a Chrome/131 UA long out of
  date, from AS42708 (hosting, not consumer) — a replay of the EN contact form
  with a stale action id.

No code filter for the server-action error, deliberately. Next.js attributes it
to deployment skew _and_ to "traffic generated by automated security scanning"
([failed-to-find-server-action](https://nextjs.org/docs/messages/failed-to-find-server-action)),
and its canonical fix — Vercel Skew Protection — is Pro/Enterprise only while
this team is on **Hobby**. Bots affect 0 users and real skew victims affect ≥1,
so the existing archive condition already separates noise from signal exactly;
suppressing the error in `onRequestError` would throw that distinction away.
Operations: `docs/playbooks/analytics.md`.

**[SHIPPED 2026-08-29] Cookie consent and session replay on ludvik4.dev.** The
EN site now asks for cookies with a banner built from the project's own
primitives, and consent is an upgrade rather than a gate: a visitor who
declines or ignores it keeps exactly the cookieless analytics shipped the day
before, while allowing cookies adds a stable visitor id (so uniques and
retention stop being inflated by the daily salt rotation) and **session replay**
— the tool ADR 0007 named as missing for "why did they leave". Replay masks all
inputs, so it never records what anyone typed into the contact form. Withdrawal
sits in the footer of every page and in §9 of `/privacy`; it stops the recorder
before clearing the choice. `/privacy` and `docs/legal/privacy-notice-en.md` now
separate the two legal bases: legitimate interest for the cookieless path,
consent for cookies and replay. Spec `docs/specs/analytics-consent.md`, decision
`docs/decisions/0008-consent-as-an-upgrade.md`. Verified in a browser: no cookie
before the choice, one after Allow, none again after withdrawing.

**[SHIPPED 2026-08-28] Analytics event layer on ludvik4.dev.** Two layers:
Vercel Web Analytics on the EN build for pageviews, referrers and the
geolocation PostHog cannot see (cookieless mode strips the IP), and PostHog for
wave-1 named events — `cta.clicked`, the four `lead.form_*` events,
`page.engaged`, `content.scroll_depth`, `nav.outbound_clicked`,
`faq.item_opened`. Fixed a silent bug found on the way: posthog-js@1.398.2
resolved `capture_pageview` to the legacy `true` without a `defaults` option,
so no `<Link>` navigation was ever captured and `$pageleave` — dwell time and
scroll depth with it — never fired. Spec `docs/specs/analytics-events.md`,
decision `docs/decisions/0007-two-layer-analytics.md`, operations
`docs/playbooks/analytics.md`. **Both user actions are now closed** (verified
2026-08-29): Vercel Web Analytics reports `enabledAt` + `hasData: true` on
project `ludvik4`, and stored events carry `$cookieless_mode: True`, which only
happens once cookieless server hash mode is on. Deferred to wave 2:
`page.exit_intent`, `blog.article_read`, `error.page_viewed`.

**[MONITOR 2026-08-28] RU + EN search and audience baseline.** DEV GSC reached
134 impressions / 3 clicks this week versus 43 / 3, but all current clicks and
almost all impressions belong to legacy `/blog/*` 404s; the canonical P1 set
remains 7/8 indexed, with workflow automation still uncrawled. RU reached 83
impressions / 1 click versus 92 / 0 and improved average position from 15.5 to
13.5; three new agent/AI articles started receiving impressions. Historical
PostHog data is RU-only: 48 visitors, 68 sessions and 80 views in 30 days. The
working tree now enables PostHog only on DEV in always-cookieless mode and
updates the EN privacy notice; deploy and cross-market verification remain.
Details: `docs/seo/seo-handoff.md`.

**[DONE 2026-08-17] RU blog publication chronology and scheduled wave.** All 21 Russian articles
now have unique calendar dates. The commercial batch is distributed across
2026-07-27–2026-08-10. The paired articles dated 2026-08-15 and 2026-08-17 are
now published in RU and EN; the 2026-08-19/21 pairs remain drafts. A regression
test enforces at most one RU article per date, including drafts, and verifies
the same three-pair publication wave in both markets.

**[DONE 2026-08-13] Market-localized Ludvik4 engineering blog (ADR 0006).**
Author decision: general AI-assisted development belongs to the Ludvik4 brand;
only Gridfin-specific product operation and internals belong in its guides.
Five substantial topics now exist as paired RU/EN MDX files. Three are live in
both builds: AGENTS.md vs CLAUDE.md vs Cursor Rules, SDD vs vibe coding, and
GitHub Spec Kit vs Application Skeleton. The 2026-08-19/21 pairs remain drafts
and absent from routes, sitemaps, RSS, and `llms.txt`. The EN header/footer
expose `/blog`, while commercial planning worksheets remain in `/guides`.

**[DONE 2026-08-13] Gridfin contextual-link reinforcement.** The published
GitHub Spec Kit, spec-driven development, and Cursor Rules articles now connect
their engineering topic to the RU Gridfin landing and its explicitly labelled
international version. A focused regression test was observed failing first
and now requires both targets in all three articles. EN follow-up content now
follows ADR 0006. Historical legacy `.dev/blog/*` impressions still point to
removed slugs; they do not become redirects or translations automatically just
because a new market-localized blog exists.

**[DONE 2026-08-11] International Work preview isolation.** The Gridfin card
now uses a dedicated English landing capture (`public/cases/gridfin-en.webp`),
and qa-pilot is described as an AI plugin rather than a Codex plugin. The
visible language dropdown on `/gridfin/en` no longer exposes the separate RU
market (the machine-readable RU hreflang remains in `<head>`); the beta promise
is locked to exactly two lines. Content and static-bundle regression tests,
lint, 363 unit/component/integration tests, and 32/32 e2e tests are green.

**[DONE 2026-08-11, round 2] Gridfin landing multilingual — all five
translated locales live.** Same-day follow-up to the EN launch below: the
MT locales (de/es/fr/ja/pt-br), already refreshed from the final EN source
by the launch round (i18n:check 7 locales × 169 keys, 0 issues), are
published under /gridfin/<locale>; /gridfin/sitemap.xml advertises all six
locale roots; the page-level x-default lost its stray trailing slash (the
generator fix is `37c6554` in grooownow/gridfin). `src/app/sitemap.test.ts`
now enforces advertised ⇔ deployed for every sitemap `<loc>` and every
hreflang alternate — proven able to fail by hiding a locale's index.html.
The RU bundle was rebuilt from the same generator so ludvik4.ru/gridfin/
carries slashless dev alternates. Smoke list:
`docs/playbooks/production-en-vercel.md` § /gridfin.

**[DONE 2026-08-11] Gridfin EN landing on
ludvik4.dev/gridfin (ADR 0005).** The reviewed EN bundle, same-origin lead
route, three sitemap entries and llms.txt passages are integrated. Gridfin
canonicals/hreflang use the `.dev` app's slashless URL style; the product
sitemap advertises only the three reviewed EN pages. The RU static export
was rebuilt and contains no EN bundle. Local verification: lint, 358 unit/
component/integration tests, EN production build, 32/32 e2e tests, RU export
and HTTP runtime checks are green. Commit `6390e58` is on `main`; main CI
`31515277373` passed every job. The landing, terms, both supporting pages,
root/product sitemaps and `llms.txt` return `200` in production. All three
indexing preflights and the service-files audit pass with no issues; invalid
lead input returns `400`. The international `/work` page now lists Gridfin as
a developer product and opens its landing in a new tab. Next: submit the
refreshed root sitemap and request indexing for the landing in the existing
Search Console property.

**[PLANNED] Studio site ludvik4.dev in all landing locales
(de/es/fr/ja/pt-br).** Author decision 2026-08-11: beyond /gridfin, the
studio site itself gets localized. Big project — needs its own spec first
(i18n routing for the Next app, ~8 pages × 5 locales of copy, per-market
strategy, hreflang/sitemap model). Not started; next step is a spec/design
session, not code.

**[DONE 2026-08-11] EN semantic content wave 2.** The first supporting content
network is live without changing the approved design system:
`/guides` plus a website-project brief, an automation-priority scorecard, and
an MVP one-user-journey scope worksheet. Each guide links to exactly one
commercial service; the service pages link back; header, footer, sitemap, and
`llms.txt` expose the hub. All twelve production URLs pass indexability
preflight; service files, unit/component/integration tests, EN and RU builds,
the standard e2e suite, and local EN runtime checks are green. Main CI
`31485032481` and RU deploy `31485032490` passed. Public
search checks still return no reliable result for `site:ludvik4.dev` or the
exact EN titles. A live console check corrected the earlier ownership
diagnosis: `krobox@gmail.com` already has access to the URL-prefix property
`https://ludvik4.dev/`. The 12-URL sitemap was resubmitted on 2026-08-11 and
`/guides` was added to Google's priority crawl queue. GSC currently reports 6
indexed pages, `/privacy` as discovered-not-indexed, and 120 historical
impressions / 1 click dominated by legacy `/blog/*` URLs that now return 404.
A weekly Monday 09:00 Codex monitor is active for indexing and query deltas.
Current evidence and next action: `docs/seo/seo-handoff.md`.

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

**[DONE 2026-08-13] CI audit recovery for unfixable `extract-zip` advisory.**
GHSA-jmr9-qjv8-65gv affects every published `extract-zip` version; upstream has
no patched npm release. The package is present only in the dev-only Lighthouse
dependency chain, and the configured Lighthouse job neither accepts untrusted
archives nor downloads a browser through that package. A targeted
`auditConfig.ignoreGhsas` entry suppresses only this GHSA while every other
high/critical advisory still fails CI. Remove it when Lighthouse adopts
`@puppeteer/browsers` 3.x (which no longer depends on `extract-zip`) or upstream
publishes a fixed release.

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
