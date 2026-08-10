# SEO Handoff

- Project root: `/private/var/folders/mj/rrr6qpzx0mq6r9cqwr61sx340000gn/T/tmp.kY5289Up9L/ludvik4`
- Project URL: `https://ludvik4.ru/`
- Mode: `autopilot`
- Current stage: `implementation`
- Next stage: `publish-live-retest`
- Freshness: `fresh`
- Latest relevant file: `src/content/blog/no-code-avtomatizatsiya-ili-custom-workflow.mdx`
- Updated at: `2026-08-10T17:48:50+00:00`

## Completed Stages

- inventory: 25 indexable URLs from `https://ludvik4.ru/sitemap.xml`.
- service-files-audit: pass, no issues.
- indexing-preflight: pass for `/`, `/blog/`, `/cases/gridfin/`, and priority Gridfin pages.
- semantic-audit: safe code-side gaps implemented.
- implementation: service-page SCN blocks, blog/cases JSON-LD, article source blocks, contextual related links.
- retest: targeted tests, typecheck/lint, RU static build, local HTML checks.
- publish: pushed to `main` and deployed to production; CI `31413439859` and Deploy RU `31413439943` passed.
- live-retest: production service-files audit passed; live indexing preflight passed for `/`, `/blog/`, `/cases/`, all `/uslugi/*`, and two edited article pages.
- google-recrawl: requested indexing in Google Search Console for `/`, `/blog/`, `/cases/`, `/uslugi/razrabotka-lendinga/`, `/uslugi/avtomatizatsiya-biznes-processov/`, and `/uslugi/razrabotka-mvp/`.
- content-expansion: added three comparison/decision articles: `lending-vs-tilda`, `mvp-ili-vnutrenniy-instrument`, and `no-code-avtomatizatsiya-ili-custom-workflow`.

## Artifacts

- docs/seo/ludvik4-seo-audit-2026-08-10.md
- docs/seo/seo-handoff.md
- docs/seo/seo-state.json

## Blockers

- No indexing blockers detected.
- Google index state at recrawl time: `/` and `/blog/` and `/uslugi/razrabotka-lendinga/` were already indexed; `/cases/` and `/uslugi/avtomatizatsiya-biznes-processov/` were discovered but not indexed; `/uslugi/razrabotka-mvp/` was unknown to Google.

## Next Actions

- Publish the three new comparison articles and rerun live indexing preflight after deploy.
- After deploy, submit/refresh sitemap and request recrawl for the three new article URLs in Google Search Console and Yandex Webmaster.
- Content decisions still open: deeper case outcomes and a standalone About page if wanted.
