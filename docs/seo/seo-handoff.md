# SEO Handoff — Ludvik4 International

- Project: `https://ludvik4.dev`
- Market: English, Europe-based, worldwide delivery
- Updated: 2026-08-17
- Current stage: publishing and monitoring the first three market-localized technical articles
- Next stage: weekly Google Search Console indexing and query monitoring

## Current technical article wave

Five paired RU/EN technical articles are in the content source. Three are now
published in both markets:

- `agents-md-vs-claude-md-vs-cursor-rules` — 2026-08-13
- `spec-driven-development-vs-vibe-coding` — 2026-08-15
- `github-spec-kit-vs-application-skeleton` — 2026-08-17

The remaining pairs dated 2026-08-19 and 2026-08-21 stay as drafts and are
excluded from routes and discovery surfaces. The Russian blog now has at most
one article per calendar date; a regression test protects the chronology and
the three-pair bilingual publication state.

General AI-assisted development belongs in the Ludvik4 blog. Commercial
worksheets stay in `/guides`, while only Gridfin-specific product operation and
internals belong on the Gridfin product surface.

## Search performance snapshot

Google Search Console was checked on 2026-08-17 for the seven-day period
2026-08-09 through 2026-08-15. These figures are Google Search impressions,
not total site page views.

- `sc-domain:ludvik4.ru`: 88 impressions, 0 clicks, 0% CTR, average position
  13.8. Daily impressions were 0, 16, 22, 15, 18, 10, and 7. The leading
  pages were `/blog/github-spec-kit/` (36), `/blog/cursor-rules/` (34),
  `/blog/avtomatizatsiya-obrabotki-zayavok/` (12), and
  `/blog/spec-driven-development/` (9).
- `https://ludvik4.dev/`: 3 impressions, 0 clicks, 0% CTR, average position
  6.3. One impression arrived on each of August 13–15. All visibility remained
  on legacy URLs: `/blog/agents-ready-project` (2) and
  `/blog/cursor-rules` (1).

PostHog was not authenticated in the available browser session, so total page
views and non-search traffic could not be measured in this run.

## Gridfin contextual links added

The published RU articles for GitHub Spec Kit, spec-driven development, and
Cursor Rules connect their exact engineering topic to both Gridfin market
pages. Each article uses the RU landing as the primary product example and the
EN landing as the explicitly labelled international version. A focused content
test requires both URLs in all three articles; it was observed failing before
the links were added and passing afterwards.

The earlier GSC signal needs careful interpretation: the international
property's historical 120 impressions and one click belonged almost entirely
to legacy `/blog/*` URLs. ADR 0006 does not restore those Russian routes. It
adds an EN-native Ludvik4 blog with separate content loading, canonical URLs,
sitemap, RSS and `llms.txt`.

The optional domain-level Search Console property is still unverified. Current
DNS nameservers are at Porkbun; domain-property verification requires adding
Google's TXT record there. The existing URL-prefix property is sufficient for
the current HTTPS host and continues to collect its data.

## Gridfin RU central entity corrected

The committed RU static bundle uses `Application Skeleton` consistently across
title, H1, hero copy, Open Graph, Twitter metadata and SoftwareApplication
JSON-LD. A repository test rejects `starter`/`стартер` in the RU title and H1
while leaving the international Gridfin positioning unchanged.

Local publication checks passed: Ludvik4 lint, all 362 tests and the production
`pnpm build:ru-static` export. The exported `out/gridfin/index.html` contains
the approved RU title, H1 and schema category.

## Gridfin EN live in production

The Gridfin EN landing and two supporting pages are live at `/gridfin/en`,
`/gridfin/en/docs/application-skeleton` and
`/gridfin/en/guides/why-ai-needs-engineering-rules`. Commit `6390e58` is on
`main`; main CI `31515277373` passed every job.

Repo-side verification completed on 2026-08-11:

- EN pages use slashless self-canonicals and contain no Russia-specific copy
  or Yandex endpoint.
- `/gridfin/en/terms` is a separate international agreement under Spanish law
  and links to the existing `.dev` Vercel/Resend privacy notice.
- Root sitemap and `llms.txt` expose all three URLs; the product sitemap
  contains exactly three EN `<loc>` entries.
- The early-access form uses a strict zod boundary, honeypot, per-IP rate limit
  and the existing Resend delivery path.
- Local EN production runtime returned `200` for the landing, terms, both
  supporting pages, Gridfin sitemap, root sitemap and `llms.txt`; invalid form
  input returned `400`.
- `pnpm lint`, 358 tests, EN build, RU static export and 32/32 e2e passed. The
  RU export contains no EN Gridfin bundle and restores the EN source after the
  build.

Production retest completed on 2026-08-11: the landing, terms, supporting
pages, product sitemap, root sitemap and `llms.txt` returned `200`; invalid
form input returned `400`. The service-file audit and indexability preflight
passed without issues.

## Production state confirmed before wave 2

- Commit `e46fcb8` is on `main` and the existing international rebuild is live.
- All eight public URLs return `200`, are self-canonical and indexable, and
  appear in the production sitemap.
- `robots.txt`, `sitemap.xml`, `llms.txt`, `humans.txt`, `security.txt`,
  `ads.txt`, and `app-ads.txt` return the expected parseable content.
- The approved `#ff4fb6` primary palette and FAQ chevrons remain protected by
  regression tests; wave 2 changes no colour token or shared chrome class.

## Wave 2 live in production

- `/guides`
- `/guides/website-project-brief`
- `/guides/automation-priority-scorecard`
- `/guides/mvp-scope-one-user-journey`
- Bidirectional service ↔ guide links, plus header/footer discovery
- Twelve-URL EN sitemap and expanded `llms.txt`
- `Article` + `BreadcrumbList` schema and self-canonical metadata per guide

Verification completed:

- New tests were observed failing before implementation, then passing.
- `pnpm lint`: pass, pre-existing warnings only.
- `pnpm test`: 49 files and 347 tests passed.
- EN production build: pass; all four guide routes statically generated.
- `pnpm test:e2e`: 32/32 passed in the repository's standard RU gate.
- Local EN production runtime and live Vercel: all four guide routes, sitemap,
  and `llms.txt` returned `200`; exact titles, H1s, canonicals, and Article
  schema checked.
- Production indexability preflight: 12/12 URLs passed with 200, index/follow,
  self-canonical metadata, and sitemap membership.
- GitHub Actions main CI `31485032481` passed every job; RU deploy
  `31485032490` reached active in Timeweb.

## Search and console baseline

- Public web search on 2026-08-11 returned no reliable Ludvik4 result for
  `site:ludvik4.dev`, the exact homepage title, or exact commercial H1s.
- Google Search Console is authenticated as `krobox@gmail.com`. The account
  has access to the URL-prefix property `https://ludvik4.dev/`; a separate
  `sc-domain:ludvik4.dev` property is not required for the current host. The
  earlier ownership-blocker diagnosis was incorrect and is superseded by the
  live console check.
- On 2026-08-11, GSC reported 6 indexed pages and 1 discovered-but-not-indexed
  page (`/privacy`), with its report last updated on 2026-08-07.
- The sitemap was resubmitted on 2026-08-11. Its displayed discovery count
  remained the stale pre-processing value of 2 until Google processed the new
  12-URL version.
- `/guides` was discovered but not yet crawled, and a priority indexing request
  was submitted. Do not repeat it while it is queued.
- The three-month view then showed 120 impressions, 1 click, 0.8% CTR, and
  average position 23.1. Almost all visibility belonged to legacy `/blog/*`
  URLs, which now correctly return `404`.
- A weekly Codex heartbeat named `Ludvik4 weekly search monitoring` is active
  for Mondays at 09:00 local time. It compares sitemap processing, indexing,
  P1 URL states, clicks, impressions, CTR, position, queries, and landing pages,
  while separating legacy blog 404s from the new commercial URLs.

## Next actions

1. Confirm the newly published article pairs are present in production
   sitemaps, RSS and `llms.txt`, then monitor their discovery and indexing.
2. Track new RU and EN queries/pages separately from residual legacy URL data.
3. Keep the 2026-08-19 and 2026-08-21 article pairs in draft until their
   scheduled publication decisions.
4. Use PostHog after authentication to separate total page views from search
   impressions.
