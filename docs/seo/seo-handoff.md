# SEO Handoff — Ludvik4 International

- Project: `https://ludvik4.dev`
- Market: English, Europe-based, worldwide delivery
- Updated: 2026-08-11
- Current stage: index monitoring after live content wave 2
- Next stage: Google Search Console ownership + indexing baseline

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
- This means the pages are technically indexable but not yet demonstrably
  indexed or discoverable. No ranking claim is made.
- Google Search Console was opened in the authenticated account
  `krobox@gmail.com`. That account has no access to the existing
  `sc-domain:ludvik4.dev` property; Google offers ownership verification.
- URL-prefix property creation in the current Search Console UI did not
  complete, so sitemap submission and URL Inspection were not performed.

## External blocker

Grant `krobox@gmail.com` owner access to the existing domain property, or
verify ownership through DNS. Repository work cannot safely manufacture DNS
control.

## Next actions

1. After Search Console ownership is restored, submit `sitemap.xml` and inspect
   Home, all three service pages, and the three guide pages.
2. Record the distinction between submitted, discovered, crawled, indexed, and
   ranking states; do not treat console acceptance as indexing.
3. Re-run exact-title and `site:` checks weekly until discovery begins.
4. After 3–4 weeks of impressions, choose only one next guide from observed
   demand: landing vs multi-page, human approval in automation, or MVP vs
   prototype/internal tool.
