# Ludvik4 — content plan

Derived from the scored semantic core (`docs/seo-core.md`, 2026-07-19).
Method: `docs/specs/seo-core-research.md`. Editorial bar: `docs/rules/content.md`.
Publishing flow & cadence: `docs/playbooks/seo-geo.md`.

**Model — topic clusters.** Each cluster has one **pillar** (broad, definitive,
targets the head query) plus **supporting** articles (narrow long-tail), all
**cross-linked**: supporting → pillar, pillar → supporting, and pillar ↔ pillar
where topics touch. This is the internal-linking structure the SEO audit found
missing.

**Bet.** Informational long-tail on our specialty (AI-dev), where RU
competition is near-zero, plus GEO. Navigational brand terms (Claude Code,
Cursor, Codex) are **hubs**, not ranking targets — we win the long-tail around
them. Commercial service pages (Layer 2) are a separate later pull.

Every article binds to a **specific target query from the core**, targets it in
the H1 + opening paragraph, and ends with the `/#contact` CTA.

---

## Clusters

### Cluster 1 — AI-агенты для разработки (hub: Claude Code / Cursor / Codex)

Hub note: bare `claude code` (WS 77k) / `cursor ai` (WS 14k) are navigational —
we don't rank for the brand; the hub page links the long-tail below.

| target query                                        | freq (WS)   | type       | title (working)                                    | priority | links                          |
| --------------------------------------------------- | ----------- | ---------- | -------------------------------------------------- | -------- | ------------------------------ |
| разработка ai агентов / агент для программирования  | 322 / 547   | **pillar** | AI-агенты для разработки: что это и как применять  | high     | ↔ SDD pillar, AGENTS.md pillar |
| claude code настройка                               | 252         | supporting | Как настроить Claude Code под проект               | high     | → pillar, → AGENTS.md пример   |
| как работать с claude code (+ работа с, + обучение) | 218/237/219 | supporting | Как работать с Claude Code: рабочий процесс        | high     | → pillar                       |
| claude code vs cursor (+ или cursor)                | 196/154     | supporting | Claude Code vs Cursor: что выбрать                 | high     | → pillar, → аналоги            |
| аналоги claude code (+ бесплатный аналог)           | 584/113     | supporting | Аналоги Claude Code: чем заменить                  | high     | → pillar, → vs Cursor          |
| claude code агенты                                  | 432         | supporting | Субагенты в Claude Code                            | med      | → pillar                       |
| бесплатные/лучший агент для программирования        | 109/57      | supporting | Лучшие (и бесплатные) AI-агенты для кода: подборка | med      | → pillar                       |
| cursor ai настройка / cursor rules                  | 55/228      | supporting | Настройка Cursor и cursor rules                    | med      | → AGENTS.md cluster            |

### Cluster 2 — AGENTS.md и конфигурация AI-ассистентов

| target query                        | freq (WS) | type              | title (working)                                                                           | priority | links                            |
| ----------------------------------- | --------- | ----------------- | ----------------------------------------------------------------------------------------- | -------- | -------------------------------- |
| agents md                           | 1 173     | **pillar — LIVE** | `/blog/agents-ready-project` (подготовка проекта к AI-агентам: AGENTS.md, правила, спеки) | high     | ↔ SDD pillar, → AI-агенты pillar |
| agents md пример (+ файл agents md) | 57/84     | supporting        | AGENTS.md: пример и шаблон                                                                | high     | → pillar                         |
| как писать agents md                | 13        | supporting        | Как написать AGENTS.md: пошагово                                                          | med      | → pillar, → пример               |
| cursor rules                        | 228       | supporting        | cursor rules: как настроить правила                                                       | high     | → pillar                         |
| claude agents md                    | 49        | supporting        | AGENTS.md для Claude Code: нюансы                                                         | med      | → pillar                         |

### Cluster 3 — Spec-driven development

| target query                 | freq (WS) | type              | title (working)                        | priority | links                                  |
| ---------------------------- | --------- | ----------------- | -------------------------------------- | -------- | -------------------------------------- |
| spec driven development      | 687       | **pillar — LIVE** | `/blog/spec-driven-development`        | high     | ↔ AGENTS.md pillar, → AI-агенты pillar |
| spec kit (+ github spec kit) | 425/146   | supporting        | GitHub Spec Kit: обзор и как применять | high     | → pillar                               |

### Cluster 4 — Вайб-кодинг (traffic driver)

| target query                                        | freq (WS)   | type       | title (working)                        | priority | links                            |
| --------------------------------------------------- | ----------- | ---------- | -------------------------------------- | -------- | -------------------------------- |
| вайб кодинг                                         | 12 692      | **pillar** | Вайб-кодинг: что это и как начать      | high     | → AI-агенты pillar, → SDD pillar |
| что такое вайб кодинг простыми словами              | 241         | supporting | Что такое вайб-кодинг простыми словами | high     | → pillar                         |
| вайб кодинг обучение (+ с нуля)                     | 208/46      | supporting | Вайб-кодинг с нуля: с чего начать      | high     | → pillar                         |
| вайб кодинг cursor / клод / на claude code / агенты | 58/51/43/84 | supporting | Вайб-кодинг в Cursor и Claude Code     | med      | → pillar, → Cluster 1            |

Note: вайб-кодинг is high-volume but adjacent to the brand promise — use it as
a top-of-funnel traffic driver that links _down_ into the AGENTS.md / SDD
clusters (where the actual service intent lives), not as an end in itself.

### Cluster 5 — MVP: стоимость, сроки, этапы (bridge → commercial)

| target query                              | freq (WS)   | type       | title (working)                              | priority | links              |
| ----------------------------------------- | ----------- | ---------- | -------------------------------------------- | -------- | ------------------ |
| mvp в разработке (+ этапы разработки mvp) | 343/141     | **pillar** | MVP: что это, этапы и сроки разработки       | high     | → SDD pillar       |
| сколько стоит / за сколько сделать mvp    | (long-tail) | supporting | Сколько стоит и за сколько можно сделать MVP | high     | → pillar, → услуги |
| разработка mvp продукта                   | 262         | commercial | (→ service page `/uslugi/mvp`, Layer 2)      | high     | → pillar           |

### Cluster 6 — Автоматизация с AI (thin — expand after own pull)

| target query             | freq (WS) | type   | title (working)                                              | priority | links              |
| ------------------------ | --------- | ------ | ------------------------------------------------------------ | -------- | ------------------ |
| ai автоматизация бизнеса | 228       | bridge | AI-автоматизация бизнеса: что реально можно автоматизировать | med      | → AI-агенты pillar |

Only one query survived the pull — do a dedicated automation-cluster pull
before committing more than this single bridge article.

### Layer 2 — commercial service pages (deferred)

`заказать лендинг` (WS 232) and the unpulled C8/C9/C10 clusters
(веб-приложения/SaaS, AI-инструменты на заказ, автоматизация на заказ) feed
`/uslugi/...` pages, not the blog. Needs its own commercial-intent pull first
(`seo-core-research.md` → out of scope for this slice).

---

## Publishing queue

Ordered by: finish clusters that already have a live pillar first (fastest path
to topical authority), then high-priority winnable pillars, then depth.
Cadence: 1–2/week for the first ~2 months (`seo-geo.md`).

**Wave 1 — deepen the two live pillars (fastest cluster wins):**

1. GitHub Spec Kit: обзор (C3 supporting) — top specialty, pillar already live
2. AGENTS.md: пример и шаблон (C2 supporting)
3. cursor rules: как настроить правила (C2 supporting)

**Wave 2 — build the AI-агенты pillar + its strongest long-tail:** 4. AI-агенты для разработки: что это и как применять (C1 **pillar**) 5. Как настроить Claude Code под проект (C1) 6. Claude Code vs Cursor (C1) 7. Аналоги Claude Code (C1)

**Wave 3 — traffic driver + money bridge:** 8. Вайб-кодинг: что это и как начать (C4 **pillar** — high volume) 9. Что такое вайб-кодинг простыми словами (C4) 10. MVP: что это, этапы и сроки (C5 **pillar — bridge**) 11. Сколько стоит и за сколько сделать MVP (C5 — commercial intent)

**Wave 4 — depth & remaining supporting:** how-to/обучение articles,
subagents, AGENTS.md how-to, вайб-кодинг tooling, automation bridge — fill as
cadence allows; each binds to its core query.

---

## Maintenance

- After ~3–4 weeks live: pull real queries from GSC/Вебмастер, fold surfaced
  queries back into `seo-core.md`, re-prioritise this queue.
- New article → bind to a core query (add/confirm the row in `seo-core.md`);
  never write "about a topic in general" (`content.md` rule 8).
- Do the deferred commercial-intent pull before building `/uslugi/...` pages.
