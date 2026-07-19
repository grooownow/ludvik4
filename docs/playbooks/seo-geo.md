---
title: SEO + GEO (AI-chat visibility) — setup and off-site
status: lite
owner: user's agent
---

# SEO + GEO playbook

Companion to `docs/specs/seo-geo-strategy.md`. On-site foundation (FAQ,
blog, llms.txt, JSON-LD, verification slots) ships with that spec — this
playbook is the part only the user can do, plus the recurring rituals.
Focus: Russian-speaking audience worldwide; content bet on the
AI-development niche.

## 1. Search-engine registration (one-time, ~15 min)

### Google Search Console

1. **User does:** open search.google.com/search-console → Add property →
   type **URL prefix** → `https://ludvik4.dev` (use the final canonical
   host). Pick the **HTML tag** verification method and copy the `content`
   value of the offered meta tag.
2. **Agent does:** set `GOOGLE_SITE_VERIFICATION=<token>` in Vercel env
   (Production + Preview) → redeploy → user clicks Verify.
3. **User does:** Search Console → Sitemaps → submit `sitemap.xml`.

### Yandex.Webmaster

1. **User does:** webmaster.yandex.ru → Добавить сайт →
   `https://ludvik4.dev` → способ подтверждения «Мета-тег», copy the token.
2. **Agent does:** set `YANDEX_VERIFICATION=<token>` in Vercel → redeploy →
   user confirms.
3. **User does:** Индексирование → Файлы Sitemap → add
   `https://ludvik4.dev/sitemap.xml`.

Why Yandex too: RU-based users are roughly half Yandex; the diaspora is
mostly Google. Both are free.

## 2. Canonical domain: apex, not www (one-time, ~5 min)

Canonical/OG already point to `https://ludvik4.dev` (apex). Make serving
match: **User does:** Vercel → Project → Settings → Domains → set
`ludvik4.dev` as primary; `www.ludvik4.dev` becomes a 308 redirect to it.
Check: `curl -I https://www.ludvik4.dev` → `308` + `location: https://ludvik4.dev/`.

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

Order matters; do the top ones first.

1. **Telegram channel** (brand, no personal identity) — announce each
   article; the site already links t.me/ludvik4.
2. **Habr** — create a brand account; adapt (not copy-paste) each suitable
   article; end with one link to the original on ludvik4.dev. Habr is
   heavily represented in RU LLM training data — this is the single
   strongest GEO lever available.
3. **vc.ru** — same adaptation approach, more business-flavored rewrite
   (запуск MVP, автоматизация для бизнеса).
4. **GitHub** — org `ludvik4`; first public repo: an AGENTS.md template /
   checklist matching article 1. README links the site. LLMs index GitHub
   deeply; a useful template earns stars → citations.
5. **Directories** (free tiers, brand profile, no personal names):
   Workspace/рейтинги студий — ratingruneta.ru, workspace.ru; international
   — Clutch (later, needs reviews). Consistent NAP: Ludvik4 + ludvik4.dev +
   Telegram.
6. **Дзен/VK** — optional re-posts once the above is routine.

## 5. Measure (weekly, folds into the analytics ritual)

Add to the 15-minute weekly review from `docs/playbooks/analytics.md`:

- Search Console: impressions/clicks, which queries surfaced (Performance).
- Yandex.Webmaster: same in Поисковые запросы.
- PostHog: traffic sources (utm/referrer) — did Habr/TG posts convert to
  visits and form submits?
- Once a month: ask ChatGPT/Gemini/Perplexity (in Russian) «кто настраивает
  проекты под AI-агентов» / «кому заказать MVP» — note whether Ludvik4
  appears. This is the GEO scoreboard; expect movement in months, not days.

## Done when

- Both consoles verified, sitemap submitted in each.
- Apex is primary (www → 308).
- First two articles reviewed, `draft: false`, live and indexed.
- Habr account exists with ≥1 adapted article; TG channel announced ≥1 post.
