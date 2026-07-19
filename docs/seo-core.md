# Ludvik4 — semantic core (working doc)

Method & rationale: `docs/specs/seo-core-research.md`. This file is the living
core: it starts as **seed hypotheses** you pull frequencies against, and ends
as the scored, clustered core. Queries are Russian (site language); audience
is Russian-speaking worldwide (Google-first).

Status: **Phase 5 complete — 44 queries scored, clustered, priority
recalibrated by winnability (2026-07-19).** Content plan derived:
`docs/content-plan.md`.

---

## How to pull (per seed)

**Primary — Google Keyword Planner** (main frequency source for a worldwide
Russian-speaking audience):

1. ads.google.com → Tools → **Keyword Planner** → _Discover new keywords_.
2. Paste a cluster's seed terms. Set **Language = Russian**,
   **Location = All locations** (or a basket: Russia, Kazakhstan, Belarus,
   Germany, Israel, United States).
3. Note **Avg. monthly searches** (a range without campaigns is fine).
   **Export CSV** and paste it back to me — I parse it.

**Secondary — Yandex Wordstat** (expansion + RF structure):

1. wordstat.yandex.ru → type each seed.
2. Copy the **left column** (co-queries — the long-tail goldmine) and the
   **right column** (similar queries). Grab anything on-topic.
3. For exact frequency use quotes: `"запрос"`.

**Autocomplete** (cheap long-tail): type each seed in Google (and Yandex),
note the dropdown suggestions.

Paste raw output per cluster (CSV or plain list) — don't hand-clean, I de-dupe
and score. Start with **Layer 1** clusters (they're the priority).

---

## Layer 1 — informational / niche (priority: long-tail + GEO)

### C1 · AI-агенты в разработке / подготовка проекта под AI-агентов

Seeds: `ai агент разработка`, `агенты для программирования`, `claude code`,
`cursor ai`, `codex ai`, `ai в разработке`, `ai coding agent`
Long-tail hypotheses to hunt: `как настроить проект под ai агента`,
`как работать с claude code`, `claude code настройка`, `cursor правила`

### C2 · AGENTS.md / конфигурация AI-ассистентов

Seeds: `agents.md`, `claude.md`, `cursor rules`, `правила для ai ассистента`,
`хуки claude code`
Long-tail: `как написать agents.md`, `agents.md пример`, `agents.md шаблон`

### C3 · Spec-driven development

Seeds: `spec driven development`, `разработка через спецификации`,
`спеки в разработке`, `spec kit`, `kiro aws`
Long-tail: `что такое spec driven development`, `разработка через спеки`,
`spec driven development это`, `чем спека отличается от тз`

### C4 · Автоматизация с AI

Seeds: `автоматизация с ai`, `автоматизация с chatgpt`,
`ai автоматизация бизнеса`, `нейросети для автоматизации`
Long-tail: `как автоматизировать бизнес процессы с ai`,
`автоматизация рутины нейросетью`, `ai агент для автоматизации`

### C5 · Vibe coding / AI-кодинг (traffic driver, adjacent)

Seeds: `vibe coding`, `вайб кодинг`, `программирование с ai`,
`написать код с помощью ai`, `ai для написания кода`
Long-tail: `что такое vibe coding`, `vibe coding это`, `вайб кодинг это`

## Layer 1.5 — bridge (informational phrasing, commercial intent)

### C6 · MVP: стоимость и сроки

Seeds: `mvp`, `разработка mvp`, `стоимость mvp`, `сделать mvp`, `mvp стартапа`
Long-tail: `сколько стоит сделать mvp`, `за сколько можно сделать mvp`,
`как сделать mvp`, `разработка mvp под ключ`, `mvp за неделю`

## Layer 2 — commercial services (included, not led with)

### C7 · Разработка сайтов / лендингов

Seeds: `заказать лендинг`, `разработка сайта под ключ`, `заказать сайт`,
`стоимость лендинга`, `разработка лендинга`

### C8 · Веб-приложения / SaaS

Seeds: `разработка веб приложения`, `заказать saas`, `разработка saas`,
`веб приложение под ключ`, `разработка веб сервиса`

### C9 · AI-инструменты / плагины на заказ

Seeds: `разработка ai инструмента`, `заказать ai чат бота`,
`разработка плагина для chatgpt`, `интеграция ai в приложение`,
`разработка ai сервиса`

### C10 · Автоматизация на заказ

Seeds: `заказать автоматизацию бизнеса`, `автоматизация бизнес процессов`,
`услуги автоматизации`, `автоматизация под ключ`

---

## Scored core (fill during Phases 2–5)

<!-- Agent fills this from your pulled data. Columns:
     query — the search phrase
     KP    — Google Keyword Planner avg monthly searches (Russian, worldwide)
     WS    — Wordstat frequency (RF) for cross-check
     intent — informational | commercial | navigational
     cluster — C1..C10
     priority — high | med | low
     maps to — pillar / supporting article, or service page -->

Pulled via Yandex Wordstat (region: all, 16.06.2026–15.07.2026) and Google Ads
Keyword Planner (location basket: Belarus, Germany, Israel, Spain,
Kazakhstan, USA, Latvia, Estonia, Lithuania, Cyprus; language: Russian;
Russia excluded — Google Ads blocks Russia-geo targeting, confirmed during
this pull). KP is shown as Google's avg-monthly-search range (new account,
no live campaign, so exact numbers aren't available — ranges are the best
Google will give). 44 queries selected below.

Priority recalibrated 2026-07-19: `priority = intent-fit × achievability ×
relevance`, not raw volume. `achiev` = how winnable for a new RU-language
domain (official sites own navigational brand terms → low). Navigational
bare-brand terms are marked `hub`: we do NOT rank for the brand itself; a hub
page collects the winnable long-tail around it + carries internal links.

| query                                                | KP                 | WS     | intent        | cluster | achiev | priority | maps to                                                         |
| ---------------------------------------------------- | ------------------ | ------ | ------------- | ------- | ------ | -------- | --------------------------------------------------------------- |
| claude code                                          | 100 тыс. – 1 млн   | 77 356 | navigational  | C1      | low    | hub      | hub Claude Code (перелинковка; ранжируемся хвостом, не брендом) |
| cursor ai                                            | 100 тыс. – 1 млн   | 14 470 | navigational  | C1      | low    | hub      | hub Cursor (перелинковка)                                       |
| codex ai                                             | 1 тыс. – 10 тыс.   | 7 201  | navigational  | C1      | low    | hub      | раздел в обзоре агентов                                         |
| open ai codex                                        | 1 тыс. – 10 тыс.   | 775    | navigational  | C1      | low    | low      | supporting (внутри обзора)                                      |
| разработка ai агентов                                | 10 – 100           | 322    | informational | C1      | med    | high     | pillar-candidate: AI-агенты для разработки                      |
| агент для программирования                           | 0 – 10             | 547    | informational | C1      | med    | high     | supporting (→ pillar AI-агенты)                                 |
| ии агенты для программирования                       | 10 – 100           | 305    | informational | C1      | med    | med      | supporting                                                      |
| бесплатные агенты для программирования               | 0 – 10             | 109    | comm.-info    | C1      | med    | med      | подборка: бесплатные ai-агенты                                  |
| лучший агент для программирования                    | 0 – 10             | 57     | comm.-info    | C1      | med    | med      | сравнительная/подборка                                          |
| claude code настройка                                | 10 – 100           | 252    | informational | C1      | high   | high     | supporting: гайд по настройке                                   |
| как работать с claude code                           | 10 – 100           | 218    | informational | C1      | high   | high     | supporting: how-to                                              |
| claude code агенты                                   | 10 – 100           | 432    | informational | C1      | high   | high     | supporting                                                      |
| claude code cli                                      | 10 тыс. – 100 тыс. | 1 242  | informational | C1      | high   | med      | supporting (KP завышен EN-трафиком)                             |
| claude code для разработки                           | 0 – 10             | 102    | informational | C1      | med    | low      | supporting                                                      |
| claude code vs cursor                                | 1 тыс. – 10 тыс.   | 196    | comm.-info    | C1      | high   | high     | сравнительная (сильная)                                         |
| claude code или cursor                               | 10 – 100           | 154    | comm.-info    | C1      | high   | med      | → объединить с «vs cursor»                                      |
| аналоги claude code                                  | 10 – 100           | 584    | comm.-info    | C1      | high   | high     | подборка/сравнительная                                          |
| бесплатный аналог claude code                        | 10 – 100           | 113    | comm.-info    | C1      | high   | med      | → раздел в подборке аналогов                                    |
| работа с claude code                                 | 10 – 100           | 237    | informational | C1      | med    | low      | → дубль «как работать», объединить                              |
| claude code обучение                                 | 10 – 100           | 219    | informational | C1      | med    | med      | supporting: tutorial                                            |
| cursor ai настройка                                  | 10 – 100           | 55     | informational | C1      | high   | med      | supporting                                                      |
| agents md                                            | 1 тыс. – 10 тыс.   | 1 173  | informational | C2      | med    | high     | pillar: AGENTS.md — гайд (проверить интент в топ-10)            |
| agents md пример                                     | 0 – 10             | 57     | informational | C2      | high   | high     | supporting: пример/шаблон                                       |
| файл agents md                                       | 10 – 100           | 84     | informational | C2      | high   | med      | supporting                                                      |
| как писать agents md                                 | 0 – 10             | 13     | informational | C2      | high   | med      | supporting: how-to                                              |
| claude agents md                                     | 100 – 1 тыс.       | 49     | informational | C2      | high   | med      | supporting                                                      |
| cursor rules                                         | 1 тыс. – 10 тыс.   | 228    | informational | C2      | high   | high     | supporting                                                      |
| spec driven development                              | 10 тыс. – 100 тыс. | 687    | informational | C3      | high   | high     | pillar: SDD — гайд                                              |
| spec kit                                             | 10 тыс. – 100 тыс. | 425    | informational | C3      | high   | high     | supporting                                                      |
| github spec kit                                      | 1 тыс. – 10 тыс.   | 146    | informational | C3      | high   | med      | supporting                                                      |
| ai автоматизация бизнеса                             | 10 – 100           | 228    | comm.-info    | C4      | med    | med      | bridge-статья                                                   |
| вайб кодинг                                          | 1 тыс. – 10 тыс.   | 12 692 | informational | C5      | med    | high     | pillar: вайб-кодинг — введение                                  |
| что такое вайб кодинг простыми словами               | 10 – 100           | 241    | informational | C5      | high   | high     | supporting: объяснение термина                                  |
| вайб кодинг обучение                                 | 10 – 100           | 208    | informational | C5      | high   | high     | supporting: tutorial                                            |
| вайб кодинг с нуля                                   | 10 – 100           | 46     | informational | C5      | high   | med      | supporting                                                      |
| вайб кодинг агенты                                   | 0 – 10             | 84     | informational | C5      | high   | med      | supporting                                                      |
| вайб кодинг cursor                                   | 10 – 100           | 58     | informational | C5      | high   | med      | supporting                                                      |
| вайб кодинг клод                                     | 10 – 100           | 51     | informational | C5      | high   | med      | supporting                                                      |
| вайб кодинг на claude code                           | 0 – 10             | 43     | informational | C5      | high   | low      | supporting                                                      |
| mvp в разработке                                     | 10 – 100           | 343    | informational | C6      | med    | high     | bridge-pillar: MVP — гайд                                       |
| разработка mvp продукта                              | 10 – 100           | 262    | commercial    | C6      | med    | high     | service page + bridge                                           |
| этапы разработки mvp                                 | 10 – 100           | 141    | informational | C6      | high   | med      | supporting                                                      |
| разработка минимального жизнеспособного продукта mvp | 0 – 10             | 136    | informational | C6      | high   | low      | supporting                                                      |
| заказать лендинг                                     | 100 – 1 тыс.       | 232    | commercial    | C7      | low    | med      | service page (Layer 2 — отдельный пул позже)                    |

### Notes on the KP pull

- Google Ads' voluntary 2022 policy blocks ad-account activity when Russia is
  set as a targeting location — every request errored out account-wide until
  Russia was dropped from the location basket and replaced with the
  Belarus/Baltics/Spain/Cyprus/Kazakhstan/Germany/Israel/USA basket above
  (chosen for Russian-speaking diaspora reach). This is a platform policy, not
  a sanctions restriction — Russia itself isn't on the OFAC embargoed list.
- KP ranges are coarse (new Ads account, no ad spend) rather than exact
  numbers — use them as order-of-magnitude cross-checks against the Wordstat
  RF column, not as precise volumes.
- `claude code` / `cursor ai` land in the same "100 тыс. – 1 млн" bucket in
  KP despite a 5x gap in Wordstat RF — expected, since KP's range buckets are
  wide at the top end and blend in worldwide English-language search volume
  for the brand terms themselves (not just Russian-language intent).
