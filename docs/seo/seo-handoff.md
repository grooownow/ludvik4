# SEO handoff — Ludvik4 International

## Weekly search monitor — 2026-11-16

### Verdict

Google visibility improved week over week, but traffic did not: the rolling
seven-day comparison shows 58 impressions versus 46 (+26.1%), 0 clicks in
both periods, 0% CTR, and average position improving from 7.8 to 6.8. The
index report moved in the opposite direction since the 2026-11-12 checkpoint:
50 indexed / 31 excluded versus 56 / 25. This is primarily a selection issue,
not a crawlability failure: all eight monitored canonical P1 URLs pass the
public technical preflight, while GSC currently excludes the automation page
and all three guide details.

GSC was read through the authenticated `https://ludvik4.dev/` URL-prefix
property on 2026-11-16. Performance data was updated about three hours before
the check; the Page indexing report was last updated 2026-11-13.

### Week-over-week search performance

| Metric           | Latest 7 days | Previous 7 days |          Change |
| ---------------- | ------------: | --------------: | --------------: |
| Clicks           |             0 |               0 |               0 |
| Impressions      |            58 |              46 |    +12 (+26.1%) |
| CTR              |            0% |              0% |            0 pp |
| Average position |           6.8 |             7.8 | improved by 1.0 |

New or growing queries were `gridfin` (4 vs 1 impressions), `qa pilot` (2 vs
1), `ludvik ai` (1 vs 0), and `ludvik 14` (1 vs 0). The only declining query
shown was `custom web app development quote` (0 vs 4). The largest landing-
page gain was `/` (35 vs 21). Other gains were
`/blog/spec-first-spec-anchored-spec-as-source` (5 vs 4), `/gridfin/es` (3 vs
0), `/gridfin/en` (3 vs 1), `/guides` (2 vs 1), `/work/qa-pilot` (2 vs 1),
`/about` (2 vs 1), `/blog/ai-website-diy-or-developer` (2 vs 1), `/contact`
(1 vs 0), and `/services/website-packages` (1 vs 0). No monitored service
detail generated a click. Google generative-AI impressions fell from 7 to 2;
the two current impressions went to the AI website article and `/gridfin/es`.

### Sitemaps and index inventory

- Both submitted sitemaps remain successful. `/sitemap.xml` reports 54
  detected URLs (last processed 2026-11-12); `/gridfin/sitemap.xml` reports 8
  (last processed 2026-11-11). The sum is not a unique-URL count because the
  sitemaps overlap.
- The submitted-URL view contains 59 unique known URLs: 50 indexed and 9
  excluded. The 9 are 8 crawled/not indexed and 1 discovered/not indexed.
- The all-known-URL view contains 81 URLs: 50 indexed and 31 excluded. Reasons:
  16 excluded by `noindex`, 3 true 404s, 1 redirect, 10 crawled/not indexed,
  and 1 discovered/not indexed.
- Since the 2026-11-12 checkpoint, indexed fell 56 -> 50 and excluded rose
  25 -> 31. Crawled/not indexed rose 2 -> 10; discovered/not indexed fell
  3 -> 1. The total inventory stayed 81, so this is reclassification rather
  than sitemap growth.

### P1 URL status

| Canonical URL                           | GSC state                                   | Public preflight |
| --------------------------------------- | ------------------------------------------- | ---------------- |
| `/`                                     | Indexed; last crawl 2026-11-13              | Pass             |
| `/services/websites`                    | Indexed; last crawl 2026-11-03              | Pass             |
| `/services/workflow-automation`         | Discovered, not indexed; no crawl           | Pass             |
| `/services/mvp-development`             | Indexed; last crawl 2026-11-04              | Pass             |
| `/guides`                               | Indexed; last crawl 2026-10-15              | Pass             |
| `/guides/mvp-scope-one-user-journey`    | Crawled, not indexed; last crawl 2026-08-13 | Pass             |
| `/guides/website-project-brief`         | Crawled, not indexed; last crawl 2026-08-12 | Pass             |
| `/guides/automation-priority-scorecard` | Crawled, not indexed; last crawl 2026-08-12 | Pass             |

The shorthand paths `/services/automations` and `/services/mvp` return 404 and
are not the canonical P1 routes. Repository links and sitemap entries use the
canonical routes above. Add redirects only if external backlinks or historical
campaign links to those shorthand paths are confirmed.

### Exclusions and technical diagnosis

The three GSC 404 examples are legacy blog URLs only:
`/blog/cursor-rules`, `/blog/spec-driven-development`, and
`/blog/agents-ready-project`. `/blog/agents-md-primer` also returns 404 but is
currently classified as crawled/not indexed. Current commercial pages are not
mixed into the 404 bucket. The live
`/blog/spec-driven-development-vs-vibe-coding` article still returns 200.

The production service-file audit passes: robots allows crawling, the root
sitemap parses with 54 URLs, and `llms.txt`, `humans.txt`, `security.txt`,
`ads.txt`, and `app-ads.txt` return 200. Every monitored P1 URL returns 200,
has `index, follow`, a self-canonical, an internal link path, and a sitemap
entry. The sitemap gives static pages `changefreq`/priority but no truthful
`lastmod`; blog posts alone carry publication dates. This is not a proven
indexing blocker, but when the four excluded P1 pages receive a substantive
content/internal-link update, add a source-backed `lastModified` value instead
of emitting today's date on every build.

Public `site:` and exact-title checks returned no result for the tested home,
automation, guides hub, and guide-detail titles. This is only a supporting
signal; the GSC states above are authoritative.

### Actions

- **P0:** Inspect/request indexing for `/services/workflow-automation` and the
  three guide details after confirming the live HTML; no sitemap resubmission
  is needed.
- **P1:** Strengthen the four excluded pages as a connected commercial cluster:
  add contextual links from the home/services/guides hub and relevant indexed
  articles, sharpen unique evidence/examples, then publish truthful `lastmod`
  values and recheck after 7–14 days.
- **P2:** Investigate why the legacy aliases were used in monitoring and add
  permanent redirects only if real external demand exists. Keep watching the
  rising brand/product queries; CTR remains the acquisition bottleneck.

No site code, console setting, indexing request, commit, or push was changed
in this run.

## Spain audit and plan — 2026-11-12

Owner requested research and a plan for search and recommendation discovery in
Spain. The work is complete as an audit/plan; implementation is not started.

Plan: [Spain search growth](spain-search-growth-plan-2026-11-12.md).
Evidence: [GSC transcription](evidence-2026-11-12/search-console.json),
[54-URL raw HTML crawl](evidence-2026-11-12/crawl.json).
Russian owner review copy: `tmp-review/seo-plan-spain-2026-11-12.ru.md`
(ignored; repo artifacts remain English).

### Current verified state

- GSC access restored through connected Chrome/CUA. Playwright MCP's actual
  call failed because its browser profile was already in use. Do not repeat
  the old Orca/restart blocker when Chrome is available.
- Google Web, 2026-10-14–2026-11-10: 177 impressions, 0 clicks, CTR 0%, average
  position 7.9. Country Spain: 5 impressions, 0 clicks, average position 16.4.
- Three months, 2026-08-11–2026-11-10: 568 impressions, 9 clicks, CTR 1.6%,
  average position 24.4. Do not compare unequal periods as a growth delta.
- GSC Pages updated 2026-11-09: 56 indexed, 25 excluded across all known URLs.
  All 19 current ES sitemap URLs appear in the indexed examples (all 56 rows
  inspected). This is not a 56/54 indexing ratio; inventories differ.
- Current root sitemap: 54 URLs (35 EN/root, 19 ES), all 200/indexable/self-
  canonical in the raw crawl. All ES pairs have reciprocal EN/ES/x-default
  alternates. `/ru` stays intentionally noindex and outside the sitemap.
- GSC root sitemap: Success, 54 discovered, last read 2026-11-12. Gridfin
  sitemap: Success, 8 discovered, last read 2026-11-11. No resubmission needed
  for the unchanged root sitemap.
- Google generative AI beta report: 13 impressions for the 28-day window,
  16 over three months. No independent ChatGPT/Perplexity/Gemini answers were
  tested. Impressions do not establish a contractor recommendation/citation.
- Fresh URL Inspection: EN `/services/workflow-automation` is discovered/not
  indexed, with no crawl recorded; ES `/es/services/automation-packages` is
  indexed, HTTPS, one valid breadcrumb item.

### Diagnosis and next slice

Discovery is working; Spain-specific commercial relevance and the buyer path
need development. `/es/guides` and `/es/blog` do not exist; Spanish navigation
and service worksheets lead to English content. Existing developer articles
have search exposure but do not by themselves establish Spanish buyer demand.

Working audience assumption: Spanish-speaking small businesses/autonomos
first; EN Spain secondary. The owner was asked for a preference in this chat;
if unanswered, this remains an explicit assumption.

First implementation slice: reconcile outdated strategy documents, improve
three ES commercial package pages, add `/es/guides` with reviewed Spanish
versions of the website brief and automation scorecard. Then follow the eight-
guide sequence and acceptance criteria in the plan. Preserve current URLs and
separate package-page and process-page intents. Do not translate the entire
technical blog or create thin city pages.

### Exclusions and remaining gaps

Aggregate exclusion reasons: 16 noindex, 3 404, 1 redirect, 3 discovered/not
indexed, 2 crawled/not indexed. Discovered examples: `/gridfin/pt-br`,
`/qa-pilot`, `/services/workflow-automation`. Crawled examples:
`/gridfin/en/terms`, legacy `/blog/agents-md-primer`. The noindex/404 lists
were not expanded. Do not force every excluded URL into the index.

Keep the four genuinely obsolete blog URLs separate from current content:
`/blog/agents-md-primer`, `/blog/agents-ready-project`,
`/blog/spec-driven-development`, `/blog/cursor-rules`. Prior monitoring found
404 responses; historical impression rows do not imply current 200 responses.

Bing index state, analytics enquiry counts, manual-action/security detail
reports and assistant answer citations remain unverified. GSC overview has no
CWV field data; no numerical lab score was measured. No site code, production
content, console settings, indexing requests, commit or push changed here.

## Published social-preview update — 2026-11-12

Owner-approved release `4b16c3f` is live on ludvik4.dev. `/es` points Open Graph
and Twitter to the approved 1200 × 630 Spanish campaign artwork at
`/social/ludvik4-facebook-es-v1.png`. Vercel deployment
`dpl_EfDChHmNSRq4HurSxvRShXEy4GMt` is Ready. Production requests using
`facebookexternalhit` verify the absolute HTTPS image URL inside `<head>`,
self-canonical `/es`, Spanish OG locale and a 200 PNG matching the approved
1200 × 630 file byte for byte. `/`, `/ru` and `/es/about` do not receive this
campaign image. All 851 tests, lint, the EN production build/function-trace
gate and the RU browser suite (67 passed, 11 skipped) pass on Node 24.

The Sharing Debugger opens but requires Facebook login, so Facebook's own
cached card was not verified or refreshed. If a post shows a stale preview,
the owner can inspect `https://ludvik4.dev/es` in
https://developers.facebook.com/tools/debug/ and use Scrape Again. This does
not change indexing or the sitemap. See ADR 0015 and the roadmap for details.
