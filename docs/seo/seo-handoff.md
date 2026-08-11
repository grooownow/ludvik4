# SEO Handoff — Ludvik4 International

- Project: `https://ludvik4.dev`
- Market: English, Europe-based, worldwide delivery
- Updated: 2026-08-11
- Current stage: index monitoring after live content wave 2
- Next stage: weekly Google Search Console indexing and query monitoring

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
- Bidirectional service ↔ guide links, plus header/footer discovery.
- Twelve-URL EN sitemap and expanded `llms.txt`, verified on production.
- `Article` + `BreadcrumbList` schema and self-canonical metadata per guide.

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
- GitHub Actions: main CI `31485032481` passed every job; RU deploy
  `31485032490` validated the isolated RU export and reached active in Timeweb.

## Search and console baseline

- Public web search on 2026-08-11 returned no reliable Ludvik4 result for
  `site:ludvik4.dev`, the exact homepage title, or exact commercial H1s.
- Google Search Console was opened in the authenticated account
  `krobox@gmail.com`. The account already has access to the URL-prefix property
  `https://ludvik4.dev/`; a separate `sc-domain:ludvik4.dev` property is not
  required for the current HTTPS host. The earlier ownership-blocker diagnosis
  was incorrect and is superseded by this live console check.
- On 2026-08-11, GSC reported 6 indexed pages and 1 discovered-but-not-indexed
  page (`/privacy`), with its indexing report last updated on 2026-08-07.
- The sitemap was successfully resubmitted on 2026-08-11. Its displayed
  discovery count remains the stale pre-processing value of 2 until Google
  processes the new 12-URL version.
- `/guides` was present in the sitemap but reported as discovered and not yet
  crawled. A priority indexing request was submitted successfully on
  2026-08-11. Do not repeat the request while it is queued.
- The three-month performance view showed 120 impressions, 1 click, 0.8% CTR,
  and average position 23.1. Almost all visibility belongs to legacy `/blog/*`
  URLs; the only click was to `/blog/spec-driven-development`. Those legacy EN
  URLs now correctly return `404`, so this is residual historical visibility,
  not evidence for the new commercial information architecture.
- A weekly Codex heartbeat named `Ludvik4 weekly search monitoring` is active
  for Mondays at 09:00 local time. It compares sitemap processing, indexing,
  P1 URL states, clicks, impressions, CTR, position, queries, and landing pages,
  while separating legacy blog 404s from the new commercial URLs.

## Next actions

1. On the next weekly run, confirm that Google has reprocessed the 12-URL
   sitemap and check `/guides` after its priority crawl request.
2. Inspect Home, all three service pages, the guide hub, and all three guide
   pages; record submitted, discovered, crawled, indexed, and ranking states
   separately.
3. Track new commercial queries/pages separately from residual `/blog/*` data;
   use exact-title and `site:` checks only as supporting evidence.
4. After 3–4 weeks of commercial impressions, choose only one next guide from observed
   demand: landing vs multi-page, human approval in automation, or MVP vs
   prototype/internal tool.
