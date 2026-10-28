# SEO handoff — Ludvik4 International

- Property: `https://ludvik4.dev/`
- Monitoring run: 2026-10-26 09:06 Europe/Madrid
- Requested comparison window: latest complete seven days versus the preceding seven days
- Console status: blocked by an unauthenticated Playwright browser session for the third consecutive run
- Last verified GSC performance window: 2026-09-26–2026-10-02

## Verdict

Production remains indexable and the root sitemap grew from 24 to 26 URLs with
the new `/contact` and `/qa-pilot` pages. All service files and all eight
canonical P1 preflights pass. Four genuinely obsolete `/blog/*` URLs still
return `404`; current English articles remain separate from that legacy group.

The immersive-home release introduced one material SEO regression: the home
page no longer links directly to any of the three commercial service pages.
Their crawl depth from `/` is now 3 instead of 1. This does not block indexing,
because the pages remain in the sitemap and reachable through the guides
network, but it weakens discovery priority and internal authority for the pages
that are supposed to convert commercial intent.

Google performance and index state remain unverified for a third run. The
available Playwright browser was redirected to Google sign-in. Public `site:`
and exact-title checks again returned no results, but these checks are only a
supporting signal and are not used as a substitute for GSC.

## Search performance

### Current run

Clicks, impressions, CTR, average position, new or rising queries and landing-
page changes are **unverified for 2026-10-26**. Current manual-action, security,
sitemap-processing, Pages and URL Inspection evidence is also unavailable. No
previous value is relabelled as current.

### Last verified baseline

Week 2026-09-26–2026-10-02 versus the preceding week:

| Metric           | 2026-09-26–2026-10-02 | Previous week |
| ---------------- | --------------------: | ------------: |
| Clicks           |                     1 |             0 |
| Impressions      |                    35 |             5 |
| CTR              |                  2.9% |            0% |
| Average position |                  16.3 |  not retained |

The live English content drove that verified recovery: the spec-first article
earned the click and 15 page-level impressions, while the Cursor-rules article
earned 10. Homepage, `/guides`, `/services/websites`, and
`/services/mvp-development` appeared once each. Commercial P1 pages therefore
had four page-level impressions and no clicks. Page-row totals are directional
because GSC can suppress low-volume rows.

## Indexing and sitemaps

### Current production evidence

| Signal                         | Current public/technical result | Last verified GSC result |
| ------------------------------ | ------------------------------: | -----------------------: |
| Root sitemap URLs              |                              26 |                       21 |
| Gridfin submitted sitemap URLs |                      unverified |                        8 |
| All processed indexed          |                      unverified |                       23 |
| All processed excluded         |                      unverified |                        7 |
| Submitted indexed              |                      unverified |                       19 |
| Submitted excluded             |                      unverified |                        5 |

The two URLs added since the previous run are:

- `/contact`
- `/qa-pilot`

Both return `200`, are self-canonical, permit indexing and appear in the root
sitemap. `/contact` has normal internal navigation. `/qa-pilot` has inbound
links from `/` and `/work/qa-pilot`, but the standalone presentation itself has
no outbound link back into the Ludvik4 site; this is a low-priority retrieval
gap rather than an indexability blocker.

The last verified page-indexing aggregate was dated 2026-09-21. It predates the
root sitemap's growth from 19 to 26 URLs. Last verified exclusion reasons were
five discovered/not-indexed URLs, one redirect, and one 404. Current
submitted/detected counts and exclusion reasons are unverified.

### Canonical P1 set

The prompt's short aliases `/services/automations` and `/services/mvp` are not
canonical routes. Their monitored targets are `/services/workflow-automation`
and `/services/mvp-development`.

| URL                                     | Production preflight | Crawl depth from `/` | Last verified Google state |
| --------------------------------------- | -------------------- | -------------------: | -------------------------- |
| `/`                                     | pass                 |                    0 | indexed                    |
| `/services/websites`                    | pass                 |                    3 | indexed                    |
| `/services/workflow-automation`         | pass                 |                    3 | unknown to Google          |
| `/services/mvp-development`             | pass                 |                    3 | indexed                    |
| `/guides`                               | pass                 |                    1 | indexed                    |
| `/guides/website-project-brief`         | pass                 |                    2 | indexed                    |
| `/guides/automation-priority-scorecard` | pass                 |                    2 | indexed                    |
| `/guides/mvp-scope-one-user-journey`    | pass                 |                    2 | indexed                    |

Every canonical P1 URL returns `200`, permits indexing, is self-canonical, and
appears in the sitemap. The last verified ratio remains **7/8 indexed**; the
current Google ratio is unverified. The technical regression is internal-link
depth, not crawl blocking or canonical configuration.

## Legacy 404 separation

These genuinely obsolete URLs still return `404` and must remain isolated from
current-site KPIs:

- `/blog/agents-md-primer`
- `/blog/agents-ready-project`
- `/blog/spec-driven-development`
- `/blog/cursor-rules`

`/blog/spec-driven-development-vs-vibe-coding` returns `200` and is current
English content. `/blog/cursor-rules-best-practices`, the two client-facing
articles and all commercial pages are also current and must not be grouped with
the legacy slugs.

## Technical checks

- `robots.txt`: `200`, no global block, one sitemap declaration.
- `sitemap.xml`: `200`, parseable, 26 URLs.
- `llms.txt`, `humans.txt`, `security.txt`, `ads.txt`, and `app-ads.txt`: valid
  non-HTML responses.
- All eight canonical P1 pages: `200`, indexable, self-canonical and present in
  the sitemap.
- Homepage crawl graph: guides depth 1, guide details depth 2, commercial
  services depth 3.
- `/qa-pilot`: indexable and linked inbound, but no outbound internal links in
  its static HTML.
- Public exact-title checks for commercial pages, guides, qa-pilot, contact,
  smallFriendFiles and the new articles returned no result. This is not proof of
  deindexing.
- No code was changed, committed or pushed in this monitoring run.

## Concrete repository fix

Restore direct home-to-service links without changing the visual composition:

1. Add an optional service `href` to the relevant EN collection-hall records in
   `src/features/site/content.ts`:
   - Websites and Landing pages → `/services/websites`
   - Web apps and Widgets & tools → `/services/mvp-development`
   - Automations → `/services/workflow-automation`
2. Render linked hall names with Next.js `Link` in
   `src/features/site/hall-card.tsx`; keep the existing card drawing and contact
   CTA intact.
3. Add a failing-first assertion to `src/features/site/home.test.tsx` that each
   canonical service URL is linked from the English home.

This would restore commercial pages to crawl depth 1 and comply with the
project invariant that internal navigation uses `Link`. The change should be
implemented as a reviewed feature, not silently during monitoring.

## Blockers

1. The Playwright session is not authenticated to the Google account with the
   `https://ludvik4.dev/` property. Three consecutive runs therefore lack
   current performance, sitemap, Pages, manual-actions, security and URL
   Inspection evidence.
2. `/services/workflow-automation` was unknown to Google in the last fresh URL
   Inspection despite passing every technical preflight.
3. The last available aggregate index report is too old to cover seven URLs
   added to the root sitemap since it was refreshed.
4. The new home places all three commercial P1 service pages at crawl depth 3.

## Actions

### P0

1. Sign in to Google in the Playwright browser opened by the monitor, or provide
   GSC exports for Performance, Pages and Sitemaps. Re-run all three missed
   comparisons; do not infer current metrics from public search results.

### P1

1. Restore direct internal links from the English home collection to the three
   canonical commercial service pages using the repository fix above.
2. Reinspect all eight canonical P1 URLs after GSC access is restored,
   especially `/services/workflow-automation`.
3. Capture current submitted/detected sitemap counts, all/submitted indexed and
   excluded totals, every exclusion reason and each report date.
4. Check discovery and query/page performance for `/contact`, `/qa-pilot`, the
   two client-facing articles and `/work/smallfriendfiles`.

### P2

1. Consider a small, design-compatible link from the qa-pilot presentation back
   to `/work/qa-pilot`; because the artifact is static HTML, preserve the
   project's internal-navigation invariant when choosing the implementation.
2. Keep genuine legacy 404 rows separate from live English articles, cases and
   commercial pages.
3. Continue weekly comparisons once the automation has a stable authenticated
   console session.
