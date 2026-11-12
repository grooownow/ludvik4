# SEO handoff — Ludvik4 International

## Local social-preview update — 2026-11-12

Prepared, not deployed: `/es` now points Open Graph and Twitter to the approved
1200 × 630 Spanish campaign artwork at
`/social/ludvik4-facebook-es-v1.png`. The owner approved commit, push and
publication on 2026-11-12; deployment is in progress. The local production build returns the expected absolute HTTPS
image URL inside `<head>` for `facebookexternalhit`; the image endpoint returns
200 and a valid 1200 × 630 PNG. Other pages do not receive this campaign image.
See ADR 0015 and the roadmap for validation and release status. After deployment,
inspect `https://ludvik4.dev/es` in the Facebook Sharing Debugger and refresh its
cache before posting the link. This does not change indexing or the sitemap.

## Last production monitoring run

- Property: `https://ludvik4.dev/`
- Monitoring run: 2026-11-09 22:29 Europe/Madrid
- Requested comparison window: latest complete seven days versus the preceding seven days
- Console status: blocked for the fifth consecutive run
- Last verified GSC performance window: 2026-09-26–2026-10-02

## Verdict

No new production-side SEO regression was found since 2026-11-06. The root
sitemap remains at 54 URLs: 35 English/root URLs and 19 Spanish URLs. Service
files pass, and all eight monitored P1 URLs return `200`, permit indexing, are
self-canonical and remain in the sitemap. Four genuinely obsolete `/blog/*`
URLs still return `404`; current English, Spanish and commercial pages remain
separate from that legacy group.

Google Search Console is still unavailable. The Playwright browser opens
Google sign-in. Orca now reports Accessibility and Screen Recording as granted,
but browser control still returns `permission_denied` and exposes no Chrome
window, so the Computer Use helper or Orca needs a restart before the existing
Chrome session can be used. Public `site:` and exact-title checks returned no
results and are treated only as a supporting signal.

## Search performance

Clicks, impressions, CTR, average position, new or rising queries and landing-
page changes are **unverified for 2026-11-09**. Current manual-action, security,
sitemap-processing, Pages and URL Inspection evidence is also unavailable. No
previous values are presented as current.

Last verified week, 2026-09-26–2026-10-02 versus the preceding week:

| Metric           | Verified week | Previous week |
| ---------------- | ------------: | ------------: |
| Clicks           |             1 |             0 |
| Impressions      |            35 |             5 |
| CTR              |          2.9% |            0% |
| Average position |          16.3 |  not retained |

The verified click and most impressions came from current English editorial
content. Commercial P1 pages had four visible page-level impressions and no
clicks. Page-row totals are directional because GSC can suppress low-volume
rows.

## Indexing and sitemaps

| Signal                         | Current public/technical result | Last verified GSC result |
| ------------------------------ | ------------------------------: | -----------------------: |
| Root sitemap URLs              |                              54 |                       21 |
| English/root sitemap URLs      |                              35 |               unverified |
| Spanish sitemap URLs           |                              19 |               unverified |
| Russian `/ru` sitemap URLs     |                               0 |               unverified |
| Gridfin submitted sitemap URLs |                      unverified |                        8 |
| All processed indexed          |                      unverified |                       23 |
| All processed excluded         |                      unverified |                        7 |
| Submitted indexed              |                      unverified |                       19 |
| Submitted excluded             |                      unverified |                        5 |

The last verified GSC Pages report was dated 2026-09-21 and predates the
sitemap's growth from 19 to 54 URLs. Its last known exclusion breakdown was
five discovered/not-indexed URLs, one redirect and one 404. Current submitted
and detected sitemap counts, indexed/excluded totals and reasons are unverified.

The Spanish surface remains technically ready: its URLs are indexable,
self-canonical and in the sitemap, with reciprocal `en`, `es` and `x-default`
hreflang on sampled pairs. `/ru` remains intentionally `noindex, follow` and
outside the sitemap.

## Canonical monitored P1 set

The prompt's aliases `/services/automations` and `/services/mvp` map to
`/services/workflow-automation` and `/services/mvp-development`.

| URL                                     | Preflight | Crawl depth | Last verified Google state |
| --------------------------------------- | --------- | ----------: | -------------------------- |
| `/`                                     | pass      |           0 | indexed                    |
| `/services/websites`                    | pass      |           2 | indexed                    |
| `/services/workflow-automation`         | pass      |           2 | unknown to Google          |
| `/services/mvp-development`             | pass      |           2 | indexed                    |
| `/guides`                               | pass      |           1 | indexed                    |
| `/guides/website-project-brief`         | pass      |           2 | indexed                    |
| `/guides/automation-priority-scorecard` | pass      |           2 | indexed                    |
| `/guides/mvp-scope-one-user-journey`    | pass      |           2 | indexed                    |

The last verified GSC ratio remains **7/8 indexed**; the current ratio is
unverified. The newer package pages are the primary conversion layer and remain
linked directly from the home at depth 1.

## Legacy 404 separation

The following obsolete URLs still return `404`:

- `/blog/agents-md-primer`
- `/blog/agents-ready-project`
- `/blog/spec-driven-development`
- `/blog/cursor-rules`

`/blog/spec-driven-development-vs-vibe-coding` returns `200` and is current
English content. Current articles, package pages, Spanish pages and commercial
pages must not be grouped with the legacy slugs.

## Technical checks

- `robots.txt`: `200`, no global block, one sitemap declaration.
- `sitemap.xml`: `200`, parseable, 54 URLs.
- `llms.txt`, `humans.txt`, `security.txt`, `ads.txt`, and `app-ads.txt`: valid
  non-HTML responses.
- All eight monitored P1 pages: `200`, indexable, self-canonical and in sitemap.
- Root sitemap count and the legacy/live URL split are unchanged since
  2026-11-06.
- Public exact-title checks for commercial pages, Spanish pages, qa-pilot and
  smallFriendFiles returned no result. This is not evidence of deindexing.
- No new safe repository-side defect was found. No code was changed, committed
  or pushed.

## Blockers

1. Playwright is not authenticated to the Google account with the
   `https://ludvik4.dev/` property, so five consecutive runs lack current GSC
   performance and index-state evidence.
2. Orca's permissions screen reports Accessibility and Screen Recording as
   granted, but Computer Use still returns `permission_denied`; restart Orca
   and its Computer Use helper before retrying Chrome.
3. `/services/workflow-automation` was unknown to Google in the last fresh URL
   Inspection despite passing every technical preflight.
4. The last GSC aggregate predates all 19 indexable Spanish URLs and the new EN
   commercial/legal surface.

## Actions

### P0

1. Restart Orca and the Orca Computer Use helper, then retry the existing
   Chrome session. Alternatively, sign in to Google in Playwright or provide
   GSC exports for Performance, Pages and Sitemaps.
2. Submit or resubmit the 54-URL root sitemap after access is restored and
   capture submitted/detected counts plus the processing date.

### P1

1. Reinspect all eight monitored P1 URLs, especially
   `/services/workflow-automation`.
2. Capture current all/submitted indexed and excluded totals plus every
   exclusion reason.
3. Inspect discovery for the 19 Spanish URLs and the new EN package/legal pages.
4. Compare query and landing-page performance separately for legacy 404s,
   current EN content, EN commercial pages and Spanish pages.

### P2

1. Expand the commercial P1 inventory to include `/services` and the five
   package pages while retaining the older service-detail URLs as supporting
   pages.
2. Continue weekly comparisons once authenticated console access is stable.
