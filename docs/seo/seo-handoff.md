# SEO Handoff

- EN project: `https://ludvik4.dev`
- RU project: `https://ludvik4.ru`
- Mode: full autopilot audits and implementation
- Current stage: production rollout complete; indexing and visibility monitoring
- Updated: 2026-08-10

## EN outcome

The EN storefront is a separate source for a Europe-based founder-led web
product studio selling custom websites, workflow automation, and MVP/web app
development. It is not a translation of the RU site. Eight indexable English
pages form the commercial and evidence network.

Completed:

- live pre-change indexing, service-file, semantic, search, and Lighthouse
  audit;
- product canon, market strategy, topical/search strategy, and LLM prompt
  matrix under `docs/marketing/en/`;
- Home, three service pages, Work, qa-pilot case, About, and Privacy;
- RU-only Gridfin assets isolated from the EN build;
- EN `/blog*` and `/gridfin*` return 404;
- market-scoped service files and EN analytics aligned with the privacy notice;
- lint, unit/component/integration tests, E2E tests, EN production build, and RU
  static export;
- the approved `#ff4fb6` brand colour is invariant across both markets; an
  earlier attempt to darken it for contrast was reverted.
- main-CI `31420244529`, Vercel production, and RU deployment `31420244090`
  passed. Live DOM checks confirmed `#ff4fb6` on both domains, six visible EN
  FAQ chevrons, and seven visible RU FAQ chevrons.

## RU completed state

- Production SEO/SRO audit and semantic-network implementation are recorded in
  `docs/seo/ludvik4-seo-audit-2026-08-10.md`.
- CI run `31413439859` and RU deployment `31413439943` passed for the first
  implementation; comparison content CI `31415976618` and RU deployment
  `31415976167` also passed.
- Live service-file and indexing preflights passed. The RU sitemap contains 28
  URLs after three comparison/decision articles were added.
- Google recrawl was requested for the priority commercial URLs and two new
  articles. The remaining new article hit the daily request quota.

## Evidence boundary

- qa-pilot is the only globally safe public case used on EN.
- Gridfin and FortNoise remain RU-market evidence.
- No pricing, client outcomes, team size, or unsupported credentials were
  invented for EN.

## Blockers and next actions

1. Submit `https://ludvik4.dev/sitemap.xml` and request indexing for Home plus
   the three EN service pages in Google Search Console.
2. Run the EN LLM visibility matrix after recrawl and record citation gaps.
3. Improve EN LCP if the production median remains above 2.5 seconds without
   changing the approved visual identity.
4. Request Google indexing for
   `https://ludvik4.ru/blog/no-code-avtomatizatsiya-ili-custom-workflow/` after
   the daily quota resets.
5. Log in to Yandex Webmaster and request the RU sitemap/article recrawl.
