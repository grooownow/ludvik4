# SEO and analytics handoff — Ludvik4 RU + International

- Properties: `https://ludvik4.dev/` and `sc-domain:ludvik4.ru`
- PostHog project: EU Cloud `225446`
- Updated: 2026-08-28 18:05 Europe/Madrid
- GSC performance freshness: data through 2026-08-26
- GSC indexing freshness: report updated 2026-08-21
- PostHog period: last 30 days through 2026-08-28 (UTC)

## Verdict

Both sites are visible in Google, but they are at different stages.

- **DEV:** impressions accelerated from 43 to 134 week over week, but the
  current 3 clicks and 130 of 134 impressions belong to legacy `/blog/*` URLs.
  Those old URLs correctly return `404`; they are not evidence of performance
  from the new international commercial site. The new network has only four
  visible impressions this week and no clicks. Indexing is healthy at 24
  indexed / 6 excluded; the one unresolved P1 page remains
  `/services/workflow-automation` (discovered, never crawled).
- **RU:** impressions softened from 92 to 83, while average position improved
  from 15.5 to 13.5 and the site earned its first weekly click. The click went
  to the live spec-driven-vs-vibe-coding article. Three new agent/AI articles
  started receiving impressions. Indexing is 30 indexed / 10 excluded; nine
  exclusions are expected canonical/redirect variants and one live article is
  crawled but not indexed.
- **PostHog:** the historical project contains RU traffic only. In the last 30
  days it recorded 48 unique visitors, 68 sessions and 80 page views. The code
  previously enabled PostHog on RU and disabled it on DEV. On 2026-08-28 this
  was reversed in the working tree; the PostHog project was also configured for
  cookieless server hashing and `https://ludvik4.dev` was authorized. A deploy
  is still required before the production traffic source changes.

## Google Search Console — DEV

### Search performance

Week comparison: 2026-08-20–26 versus 2026-08-13–19.

| Metric           | Current | Previous |          Change |
| ---------------- | ------: | -------: | --------------: |
| Clicks           |       3 |        3 |               0 |
| Impressions      |     134 |       43 |     +91 (+212%) |
| CTR              |    2.2% |     7.0% |         -4.8 pp |
| Average position |    42.8 |     31.9 | -10.9 positions |

Rolling 28 days: **6 clicks, 220 impressions, 2.7% CTR, average position
38.3**.

Growing visible queries:

| Query                                    | Current impressions | Previous | Change |
| ---------------------------------------- | ------------------: | -------: | -----: |
| `spec driven development vs vibe coding` |                  52 |       11 |    +41 |
| `vibe coding vs spec coding`             |                  36 |        7 |    +29 |
| `spec coding vs vibe coding`             |                  27 |        8 |    +19 |
| `vibe coding vs spec driven development` |                   2 |        0 |     +2 |
| `spec kit vs`                            |                   1 |        0 |     +1 |

Landing pages, separated by lifecycle:

| Group / page                                          | Clicks current / previous | Impressions current / previous | Assessment                          |
| ----------------------------------------------------- | ------------------------: | -----------------------------: | ----------------------------------- |
| Legacy `/blog/agents-md-primer`                       |                     3 / 0 |                          6 / 3 | 404; all current DEV clicks         |
| Legacy `/blog/spec-driven-development-vs-vibe-coding` |                     0 / 0 |                       120 / 26 | 404; dominant impression growth     |
| Other legacy `/blog/*` rows                           |                     0 / 2 |                         7 / 10 | 404; index cleanup still incomplete |
| `/gridfin/en/docs/application-skeleton`               |                     0 / 0 |                          1 / 0 | live, first new impression          |
| `/guides`                                             |                     0 / 1 |                          0 / 3 | live, no impressions this week      |
| `/services/mvp-development`                           |                     0 / 0 |                          0 / 1 | live, no impressions this week      |

Visible table totals can differ from headline totals because GSC suppresses
low-volume query rows.

### Indexing and sitemaps

| Signal                        | Current | Previous check (2026-08-24) |
| ----------------------------- | ------: | --------------------------: |
| Submitted sitemaps            |       2 |                           2 |
| Root sitemap detected URLs    |      19 |                          19 |
| Gridfin sitemap detected URLs |       8 |                           8 |
| All processed indexed         |      24 |                          24 |
| All processed excluded        |       6 |                           6 |
| Submitted indexed             |      24 |                          19 |
| Submitted excluded            |       6 |                           5 |

Both sitemaps are successful. Latest processing: root 2026-08-25, Gridfin
2026-08-27. Exclusions are unchanged in substance:

- 5 discovered/not indexed: `/services/workflow-automation`, plus Gridfin
  locales `/gridfin/es`, `/gridfin/fr`, `/gridfin/ja`, `/gridfin/pt-br`;
- 1 redirect: `/gridfin/en/` to canonical `/gridfin/en`;
- 0 crawled/not indexed.

Canonical P1 set: **7/8 indexed (87.5%)**. All canonical P1 URLs are live,
self-canonical and present in the sitemap. Only
`/services/workflow-automation` is excluded. The monitor's old aliases
`/services/automations` and `/services/mvp` are intentionally not canonical
routes; use `/services/workflow-automation` and `/services/mvp-development`.

## Google Search Console — RU

### Search performance

Week comparison: 2026-08-20–26 versus 2026-08-13–19.

| Metric           | Current | Previous |         Change |
| ---------------- | ------: | -------: | -------------: |
| Clicks           |       1 |        0 |             +1 |
| Impressions      |      83 |       92 |     -9 (-9.8%) |
| CTR              |    1.2% |       0% |        +1.2 pp |
| Average position |    13.5 |     15.5 | +2.0 positions |

Rolling 28 days (the property only has data from 2026-08-09): **1 click, 228
impressions, 0.4% CTR, average position 13.8**.

Visible query changes:

| Query                                                | Current impressions | Previous | Change |
| ---------------------------------------------------- | ------------------: | -------: | -----: |
| `spec kit`                                           |                   6 |        6 |      0 |
| `github spec kit`                                    |                   3 |        2 |     +1 |
| `spec-kit`                                           |                   3 |        0 |     +3 |
| `application skeleton`                               |                   1 |        0 |     +1 |
| `spec github`                                        |                   1 |        0 |     +1 |
| `автоматизация механизма обработки шаблонных заявок` |                   0 |        3 |     -3 |

Leading and emerging landing pages:

| Page                                            | Clicks current / previous | Impressions current / previous |
| ----------------------------------------------- | ------------------------: | -----------------------------: |
| `/blog/spec-driven-development-vs-vibe-coding/` |                     1 / 0 |                          6 / 5 |
| `/blog/github-spec-kit/`                        |                     0 / 0 |                        25 / 38 |
| `/blog/cursor-rules/`                           |                     0 / 0 |                        25 / 35 |
| `/blog/agents-md-primer/`                       |                     0 / 0 |                         12 / 0 |
| `/blog/agents-ready-project/`                   |                     0 / 0 |                          7 / 0 |
| `/blog/agents-md-vs-claude-md-vs-cursor-rules/` |                     0 / 0 |                          4 / 0 |

The new agent/AI cluster generated **23 new visible impressions** this week.

### Indexing and sitemap

| Signal                 | Current |
| ---------------------- | ------: |
| Successful sitemaps    |       1 |
| Detected sitemap URLs  |      31 |
| All processed indexed  |      30 |
| All processed excluded |      10 |
| Submitted indexed      |      30 |
| Submitted excluded     |      10 |

Exclusions:

- 5 alternate pages with a canonical tag — expected;
- 4 redirecting pages — expected;
- 1 crawled/not indexed:
  `/blog/ai-avtomatizatsiya-malogo-biznesa/`, last crawled 2026-08-18;
- 0 discovered/not indexed.

## PostHog — historical RU audience

The domain selector contains only `https://ludvik4.ru`, so these figures must
not be attributed to DEV.

Last 30 days versus the preceding 30 days:

| Metric                   | Current | Previous | Change |
| ------------------------ | ------: | -------: | -----: |
| Unique visitors          |      48 |       75 |   -36% |
| Sessions                 |      68 |       94 |   -28% |
| Page views               |      80 |      109 |   -27% |
| Average session duration |  1m 53s |   1m 45s |    +7% |
| Bounce rate              |     53% |      73% | -20 pp |

Top paths:

| Path                                            | Visitors | Views | Bounce rate |
| ----------------------------------------------- | -------: | ----: | ----------: |
| `/`                                             |       38 |    62 |       53.7% |
| `/blog/cursor-rules/`                           |        7 |     7 |       71.4% |
| `/blog/spec-driven-development-vs-vibe-coding/` |        2 |     2 |          0% |
| `/cases/gridfin/`                               |        2 |     2 |       33.3% |
| `/gridfin`                                      |        1 |     2 |          0% |

Acquisition: direct 37 visitors / 61 views; referral 8 / 14; organic search
4 / 4; organic social 1 / 1. Devices: desktop 34 visitors / 63 views; mobile
14 / 17. Seven-day snapshot: 7 visitors, 7 sessions, 7 views, 41.7s average
session duration and 57% bounce rate.

After the next production deploy, PostHog will collect DEV only in always-
cookieless mode, with person profiles disabled. Historical DEV users cannot be
reconstructed retroactively, and future RU users will no longer be collected.

## Actions

### P0

1. Deploy the analytics market switch and updated EN privacy notice. Until
   deployment, production still records RU and does not record DEV.

### P1

1. Request indexing for `/services/workflow-automation` once. It has remained
   discovered and uncrawled for more than one weekly cycle; do not resubmit
   repeatedly.
2. Keep legacy DEV 404 traffic isolated from current-site KPIs. Do not redirect
   Russian-origin article slugs into unrelated English pages.
3. Monitor `/blog/ai-avtomatizatsiya-malogo-biznesa/` for one more RU cycle;
   inspect content/internal links only if it remains crawled-not-indexed.
4. Verify after deploy that DEV emits `$pageview` and
   `contact.telegram_clicked`, while RU emits no PostHog network requests.

### P2

1. Build PostHog goals for successful enquiry submission and Telegram click;
   page views alone do not measure qualified demand.
2. Track whether the DEV spec-vs-vibe queries improve from positions around 40
   and begin producing clicks to a live English URL.
3. Track the RU agent/AI cluster: it has early impressions but no clicks yet.
4. Continue weekly GSC comparison with a rolling 28-day audience snapshot.
