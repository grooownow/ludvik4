---
title: SEO + GEO (AI-chat visibility) — setup and off-site
status: lite
owner: user's agent
---

# SEO + GEO playbook

Companion to `docs/specs/seo-geo-strategy.md`. On-site foundation (FAQ,
blog, llms.txt, JSON-LD, verification slots) ships with that spec — this
playbook covers the console setup, distribution and recurring rituals.
Focus: Russian-speaking audience worldwide; content bet on the
AI-development niche.

## 1. Search-engine registration (one-time, ~15 min)

### Google Search Console

1. **User does:** open search.google.com/search-console → Add property →
   type **URL prefix** → `https://ludvik4.ru` (use the final canonical
   host). Pick the **HTML tag** verification method and copy the `content`
   value of the offered meta tag.
2. **Agent does:** add the public verification token to the RU build → deploy
   through the SourceCraft/Timeweb pipeline → click Verify.
3. **Agent does:** Search Console → Sitemaps → submit `sitemap.xml`.

### Yandex.Webmaster

1. **User does:** webmaster.yandex.ru → Добавить сайт →
   `https://ludvik4.ru` → способ подтверждения «Мета-тег», copy the token.
2. **Agent does:** add the public token to the RU build → deploy → confirm.
3. **Agent does:** Индексирование → Файлы Sitemap → add
   `https://ludvik4.ru/sitemap.xml`.

Why Yandex too: RU-based users are roughly half Yandex; the diaspora is
mostly Google. Both are free.

## 2. Canonical domain: apex, not www (one-time, ~5 min)

Canonical/OG point to `https://ludvik4.ru` (apex). Timeweb App Platform serves
both apex and `www` with a canonical to apex. A strict redirect is deliberately
deferred in `docs/decisions/0003-defer-ru-www-redirect.md`.

## 3. Publishing an article (recurring)

1. Agent picks the next item from `docs/content-plan.md` (bound to a core
   query in `docs/seo-core.md`) and drafts `src/content/blog/<slug>.mdx` with
   `draft: true`.
2. User reviews the text (in the PR or rendered locally via `pnpm dev`).
3. Agent flips `draft: false`, merges, deploys. The article enters the
   list, sitemap, RSS and llms.txt automatically.
4. After deploy: Search Console → URL inspection → request indexing (speeds
   up first index of a new URL).

Cadence that compounds: 1–2 articles/week for the first 2 months, then
steady 2–4/month. Every article targets ONE query cluster from the niche
(AI-агенты в разработке, AGENTS.md, spec-driven development, автоматизация
с AI, стоимость MVP…).

## 4. Off-site — where LLMs and links actually come from

Concrete, briefable version (per-platform adaptations by the agent, publishing
by a coworker, tracking matrix): **`docs/playbooks/distribution.md`**. The list
below is the rationale/order behind it.

Current order:

1. **vc.ru** — business-focused adaptations with one canonical link.
2. **Яндекс Дзен** — shorter plain-language adaptations and Yandex discovery.
3. **GitHub** — public, genuinely useful projects with Ludvik4 attribution;
   `grooownow/qa-pilot` is the current flagship.
4. **Directories** — Workspace and Рейтинг Рунета first; Clutch later when
   client reviews exist. Keep the brand name, canonical domain and contact
   details consistent.
5. **VK/Spark.ru** — test only with the strongest business-focused article.

Habr and a dedicated Telegram content channel are paused after the distribution
experiments documented in `docs/playbooks/distribution.md`.

## 5. Measure (weekly, folds into the analytics ritual)

Add to the 15-minute weekly review from `docs/playbooks/analytics.md`:

- Search Console: impressions/clicks, which queries surfaced (Performance).
- Yandex.Webmaster: same in Поисковые запросы.
- PostHog: traffic sources plus `contact.telegram_clicked` by path and
  placement — which page and off-site source produced contact intent?
- Once a month: ask ChatGPT/Gemini/Perplexity (in Russian) «кто настраивает
  проекты под AI-агентов» / «кому заказать MVP» — note whether Ludvik4
  appears. This is the GEO scoreboard; expect movement in months, not days.

## Done when

- Both consoles verified, sitemap submitted in each.
- Apex is canonical; the accepted `www` exception is recorded in ADR 0003.
- Published articles are present in the sitemap, RSS and `llms.txt`.
- Each approved article has the intended off-site adaptations and an indexing
  request after deployment.

## RU rollout status

- **2026-07-27:** `ludvik4.ru` verified in Google Search Console and Yandex
  Webmaster.
- `sitemap.xml` submitted to both. Google processed it successfully and found
  13 URLs; Yandex placed it in the processing queue.
- The seven original public URLs were submitted for indexing in both consoles.
  Submission does not guarantee when a search engine will index or rank them.
- **2026-07-28:** all eight commercial articles are live. The final sitemap has
  21 canonical URLs, all returning 200 without an intermediate redirect, and
  was resubmitted to both consoles.
- Yandex accepted all eight new article URLs for priority recrawl. Google
  accepted five manual requests before the daily quota; the remaining three
  remain available through the sitemap and can be requested after quota reset.
