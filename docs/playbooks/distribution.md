---
title: Off-site distribution — where each article goes and who does what
status: lite
owner: user's agent + coworker
---

# Distribution playbook (off-site)

Expands `seo-geo.md` §4 into a concrete, briefable plan. Goal: turn each
published `ludvik4.dev/blog/*` article into off-site reach + GEO signal
(presence in the data LLMs train on), pointing authority back to the original.

**Division of labour (agreed 2026-07-19):**

- **Agent** writes the per-platform _adaptations_ (not copy-paste) as drafts in
  `tmp-review/dist/<slug>/` — one file per platform, each ending with a link
  back to the original.
- **Coworker** publishes: pastes each adaptation into the platform, handles
  accounts/moderation, and logs status + early metrics in the tracking table
  below.
- **User** approves the original article (as today). Adaptations don't need a
  separate approval gate unless the user asks — they follow the approved
  original.

Brand rules on every platform: name **Ludvik4**, team voice («мы»), no personal
names / no location (`site-v0.md` positioning). Always end with one link to the
original on `ludvik4.dev` — that keeps the site the canonical source.

## Platforms — tiered

### Tier 1 — every article (highest leverage)

- **Habr** — full technical adaptation, real hubs/tags, link back. Habr is the
  single strongest GEO lever: heavily represented in RU LLM training data.
  Audience: 15–40M/mo, core developers.
- **vc.ru** — business-flavoured adaptation (запуск MVP, автоматизация,
  стоимость/сроки, личный опыт), discussion hook at the end, link back.
  Working already: article 1 live with early comments/likes.

### Tier 2 — secondary, low effort

- **Яндекс Дзен** — simplified, broad-audience version (short, plain framing).
  Payoff: 30M+ visits/day + fast Yandex indexation (an SEO bonus, not just
  reach). Link back.
- **X (Twitter)** — a 3–5 post thread: the article's key takeaways + link.
  Low effort, and X posts feed Grok → GEO. This is our "quick announce"
  channel _instead of_ a Telegram channel for now.

### Tier 3 — opportunistic

- **Tproger / Proglib** — targeted RU dev media, small traffic; pitch or
  republish only the strongest evergreen articles.
- **VK** (group/articles) — only if a social presence is built later.

### Not now (with reason)

- **Telegram channel** — deferred: zero audience, high upkeep, low early ROI.
  Revisit once there's inbound worth announcing to a captive audience.
- **Reddit** — not a fit for RU content: RU dev/AI communities are thin and
  poorly indexed. English AI subs (`r/ClaudeAI`, `r/AI_Agents`, `r/cursor`,
  `r/ChatGPTCoding`) are strong but English — a separate play for a future
  EN version of the site, not this RU content.
- **DTF** — audience is gamers/pop-culture; wrong fit for B2B dev services.

## Adaptation rules per platform

Same core idea, re-framed per audience — never the same text twice (platforms
demote duplicates, and a distinct framing earns the canonical-back link):

| platform | length     | framing                                                    | ending                          |
| -------- | ---------- | ---------------------------------------------------------- | ------------------------------- |
| Habr     | full depth | technical, hardcore, code/examples                         | «оригинал на ludvik4.dev» + CTA |
| vc.ru    | medium     | business value, personal experience, a discussion question | link back + CTA                 |
| Дзен     | short      | plain, broad audience, no jargon                           | link back                       |
| X        | thread     | 3–5 posts, one idea each, hook first                       | link in last post               |

## Per-article distribution matrix

Status: ✅ done · ⏳ pending/moderation · ▫️ todo · — n/a

| article (slug)          | Habr            | vc.ru                         | Дзен | X   |
| ----------------------- | --------------- | ----------------------------- | ---- | --- |
| agents-ready-project    | ⏳ на модерации | ✅ live (2 коммента, 2 лайка) | ▫️   | ▫️  |
| spec-driven-development | ▫️              | ▫️                            | ▫️   | ▫️  |
| github-spec-kit         | ▫️              | ▫️                            | ▫️   | ▫️  |

(Agent keeps this matrix current as adaptations are drafted; coworker flips a
cell to ✅ with the published URL when posted.)

## Coworker checklist (per article)

1. Agent drops adaptations in `tmp-review/dist/<slug>/` (habr.md, vc.md,
   dzen.md, x.md).
2. Publish **Habr** + **vc.ru** (Tier 1) — paste, set tags/hubs, confirm the
   link back to the original is intact.
3. Repost the **Дзен** version; post the **X** thread.
4. In the matrix above, flip the cell to ✅ and paste the published URL.
5. After ~3–7 days, note early metrics (views / comments / likes) — feeds the
   weekly review in `analytics.md`.

## Priority order to clear the backlog

1. Finish article 1 everywhere (Habr is on moderation; add Дзен + X).
2. Article 2 (spec-driven-development) → Habr + vc.ru.
3. Article 3 (github-spec-kit) → Habr + vc.ru.
4. Backfill Дзен + X for articles 2–3.

Cross-posting cadence trails article publishing by a few days — publish on the
site first (canonical), then distribute.
