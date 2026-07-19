# Spec: Keyword research → semantic core → content plan

Strategy approved in chat 2026-07-18. Follows the `seo-geo-strategy.md`
foundation (shipped): technical SEO is in place; this closes the gap flagged
in the SEO audit — the query strategy was intuition-based, with no
data-backed semantic core. This spec is the method for building that core and
turning it into a content plan.

## Goal

A data-backed semantic core of **30–50 selected queries**, clustered by
intent, from which a `docs/content-plan.md` is derived (topic-cluster model:
pillar + supporting articles, internally linked).

## Audience & geo (drives the tooling)

- **Russian-speaking worldwide — diaspora over RF.** The audience mostly
  searches on **Google**, not Yandex. Therefore:
  - **Primary frequency source: Google Keyword Planner** — Language =
    Russian, Location = worldwide (or a diaspora basket: RU, KZ, BY, DE, IL,
    US, plus EU). Data comes in ranges without active campaigns; direction is
    enough for prioritisation.
  - **Secondary: Yandex Wordstat** — best for _expansion_ (left/right columns
    surface long-tail we'd never guess) and RF-specific demand structure.
    Weak as a worldwide-diaspora volume proxy (it measures RU/Yandex).
  - **Autocomplete** (Google primary, Yandex secondary) — cheap long-tail.

## Priority: informational first (the bet)

A new domain in a narrow AI niche realistically wins **long-tail
informational** queries and **GEO** (AI-chat citations), not broad commercial
head terms. So the core weights:

1. **Layer 1 — informational / niche** (priority): AI agents in dev,
   AGENTS.md, spec-driven development, AI automation, vibe coding.
2. **Layer 1.5 — bridge**: "MVP cost & timelines" — informational phrasing,
   high commercial intent. The money-adjacent content bet.
3. **Layer 2 — commercial services**: заказать лендинг / веб-приложение /
   SaaS / автоматизацию / AI-инструмент. Included, not led with.

## Method — C→A hybrid (intent-seeded, funnel-structured)

Roles: **agent generates & processes; user pulls the numbers** (chosen in
chat — reliable, no captcha).

- **Phase 0 — Seeds (agent).** Seed queries grouped by cluster, from the real
  service catalogue (`manifest.md`, `llms.txt`) + the niche. → `docs/seo-core.md`.
- **Phase 1 — Expand (user pulls).** Per seed: Wordstat left + right columns,
  Google/Yandex autocomplete. User pastes raw output back; agent de-dupes and
  cleans.
- **Phase 2 — Frequency (user pulls).** Final list through **Google Keyword
  Planner** (Russian, worldwide/basket) = primary; Wordstat ("query" for
  exact) = cross-check. CSV export from KP is ideal — paste it, agent parses.
- **Phase 3 — Intent & competition (agent + spot-checks).** Tag each query:
  intent (informational / commercial / navigational), and achievability from a
  manual top-10 SERP glance on the doubtful ones.
- **Phase 4 — Cluster (agent).** Group by intent-meaning; one cluster = one
  future pillar page + supporting articles.
- **Phase 5 — Core (agent).** `docs/seo-core.md` final table:
  `query | freq (KP / WS) | intent | cluster | priority | maps to`.

Priority score (qualitative, not a formula to over-fit):
`intent-fit × frequency × achievability × business-relevance`.

## Output 1 — semantic core (`docs/seo-core.md`)

Living doc. Starts as seed hypotheses + pull instructions + an empty
frequency table the user fills during Wordstat/KP sessions; ends as the
scored, clustered core.

## Output 2 — content plan (`docs/content-plan.md`)

Derived from the core once scored:

- **Topic-cluster model**: each cluster → 1 pillar article + 3–5 supporting,
  all cross-linked (closes the "no internal linking" audit finding).
- Table: `cluster | target query | freq | intent | title | type
(pillar/supporting) | priority | internal links | status`.
- Queue ordered under the existing cadence (1–2/week for the first 2 months,
  then 2–4/month — `seo-geo.md`). The two live articles slot into existing
  clusters.
- Ritual update: `seo-geo.md` §3 and `content.md` rule 8 — every article
  binds to a **specific query from the core**, not a topic in general.

## Out of scope

- Paid SEO tools / competitor keyword scraping (no access — manual SERP only).
- Per-service landing pages (`/uslugi/...`) — separate roadmap item; this
  core informs them later.
- Actual article writing — that's the `feature`/content flow, plan-driven.
- English-language core — RU only for now (English site is deferred).

## Done when

- `docs/seo-core.md` holds 30–50 queries with KP/WS frequency, intent tags,
  and cluster assignment.
- `docs/content-plan.md` exists: clusters → pillar+supporting queue, prioritised.
- `seo-geo.md` / `content.md` updated so future articles bind to core queries.
