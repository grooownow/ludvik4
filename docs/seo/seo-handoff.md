# SEO handoff — Ludvik4 International

- Property: `https://ludvik4.dev/`
- Monitoring run: 2026-10-19 19:22 Europe/Madrid
- Requested comparison window: latest complete seven days versus the preceding seven days
- Console status: blocked by an unauthenticated Playwright browser session for the second consecutive run
- Last verified GSC performance window: 2026-09-26–2026-10-02

## Verdict

Production remains technically indexable and the discovery surface has grown.
The root sitemap increased from 21 to 24 URLs after publication of two English
articles and the smallFriendFiles case. The service-file audit and all eight
canonical P1 preflights pass. Four genuinely obsolete `/blog/*` URLs still
return `404`; the English `/blog/spec-driven-development-vs-vibe-coding` page
returns `200` and remains current content.

Google week-over-week performance and index state are unverified again. The
available Playwright browser was redirected to Google sign-in and did not
inherit an authenticated session. Public `site:` and exact-title checks returned
no results for the commercial pages or the newly published content, but this is
only a supporting signal and cannot replace GSC. No current clicks,
impressions, queries or index totals are inferred from it.

## Search performance

### Current run

Clicks, impressions, CTR, average position, query changes and landing-page
changes are **unverified for 2026-10-19**. The missing console access also blocks
manual-action and security-issue confirmation. No prior values are relabelled as
current.

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
| Root sitemap URLs              |                              24 |                       21 |
| Gridfin submitted sitemap URLs |                      unverified |                        8 |
| All processed indexed          |                      unverified |                       23 |
| All processed excluded         |                      unverified |                        7 |
| Submitted indexed              |                      unverified |                       19 |
| Submitted excluded             |                      unverified |                        5 |

The three new root-sitemap URLs are:

- `/work/smallfriendfiles`
- `/blog/ai-website-diy-or-developer`
- `/blog/what-development-quote-pays-for`

The last verified page-indexing aggregate was dated 2026-09-21, so it predated
both the earlier growth to 21 URLs and the current growth to 24. Last verified
exclusion reasons were five discovered/not-indexed URLs, one redirect, and one 404. Submitted/detected counts and a fresh exclusion breakdown remain blocked
with the rest of the console data.

### Canonical P1 set

The automation prompt's short aliases `/services/automations` and
`/services/mvp` are not canonical routes. Their monitored canonical targets are
`/services/workflow-automation` and `/services/mvp-development`.

| URL                                     | Production preflight | Last verified Google state |
| --------------------------------------- | -------------------- | -------------------------- |
| `/`                                     | pass                 | indexed                    |
| `/services/websites`                    | pass                 | indexed                    |
| `/services/workflow-automation`         | pass                 | unknown to Google          |
| `/services/mvp-development`             | pass                 | indexed                    |
| `/guides`                               | pass                 | indexed                    |
| `/guides/website-project-brief`         | pass                 | indexed                    |
| `/guides/automation-priority-scorecard` | pass                 | indexed                    |
| `/guides/mvp-scope-one-user-journey`    | pass                 | indexed                    |

Every canonical P1 URL returns `200`, permits indexing, is self-canonical, and
appears in the root sitemap. The last verified ratio remains **7/8 indexed**;
the current Google ratio is unverified. `/services/workflow-automation` still
has no repository-side defect that explains its previous discovery problem.

## Legacy 404 separation

These genuinely obsolete URLs still return `404` and must remain isolated from
current-site KPIs:

- `/blog/agents-md-primer`
- `/blog/agents-ready-project`
- `/blog/spec-driven-development`
- `/blog/cursor-rules`

`/blog/spec-driven-development-vs-vibe-coding` returns `200` and is a current
English article. `/blog/cursor-rules-best-practices` and the two new client-
facing articles are also current content. Similar old slugs must not cause live
pages to be grouped as legacy traffic.

## Technical checks

- `robots.txt`: `200`, no global block, one sitemap declaration.
- `sitemap.xml`: `200`, parseable, 24 URLs.
- `llms.txt`, `humans.txt`, `security.txt`, `ads.txt`, and `app-ads.txt`: valid
  non-HTML responses.
- All eight canonical P1 pages: `200`, indexable, self-canonical and present in
  the sitemap.
- Public exact-title checks for three services, guides, the new articles,
  smallFriendFiles, and the spec-first article returned no result. This is not
  proof of deindexing.
- No safe repository-side fix is indicated. This run updates documentation only
  and does not commit or push.

## Blockers

1. The Playwright session is not authenticated to the Google account with the
   `https://ludvik4.dev/` property. Two consecutive runs therefore lack current
   performance, sitemap, Pages, manual-actions, security and URL Inspection
   evidence.
2. `/services/workflow-automation` was unknown to Google in the last fresh URL
   Inspection despite a clean technical preflight.
3. The last available aggregate index report is too old to cover six URLs added
   to the root sitemap since it was refreshed.

## Actions

### P0

1. Sign in to Google in the Playwright browser opened by the monitor, or provide
   GSC exports for Performance, Pages and Sitemaps. Re-run the missed comparison
   immediately; do not infer current metrics from public search results.

### P1

1. Reinspect all eight canonical P1 URLs after console access is restored,
   especially `/services/workflow-automation`.
2. Capture current submitted/detected sitemap counts, all/submitted indexed and
   excluded totals, every exclusion reason and each report date.
3. Check whether the three URLs added this week have been discovered and whether
   either new article has begun earning queries or impressions.
4. Keep genuine legacy 404 rows separate from live English articles, cases and
   commercial pages.

### P2

1. Continue weekly comparisons once the automation has a stable authenticated
   console session.
2. Treat empty public exact-title checks as an alerting hint only, never as an
   index-state verdict.
