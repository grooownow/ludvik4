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

Brand rules on **Habr / vc.ru / Дзен**: name **Ludvik4**, team voice («мы»), no
personal names / no location (`site-v0.md` positioning). **X is the exception**
— a personal founder account (`@groownow`, «Kate»), **first-person** voice; it
links to `ludvik4.dev` as the author sharing her own work. Every platform ends
with a link back to the original — the site stays the canonical source.

## Platforms — tiered

Revised 2026-07-20 after Habr rejected article 1 (see "Dropped" below).

### Tier 1 — every article

- **vc.ru** — business-flavoured adaptation (запуск MVP, автоматизация,
  стоимость/сроки, личный опыт), discussion hook, link back. Best fit for us:
  the audience is founders/business (actual buyers, unlike Habr's developers),
  it tolerates self-links, and it already works — article 1 live with early
  comments/likes.
- **Яндекс Дзен** — simplified, broad-audience version (short, plain). 30M+
  visits/day + fast Yandex indexation (an SEO bonus, not just reach). Link back.

### Tier 2 — announce / compounding, low effort

- **X (Twitter)** — a 3–5 post thread: key takeaways + link. Feeds Grok → GEO.
  The "quick announce" channel _instead of_ a Telegram channel. **Personal
  founder account (`@groownow`, «Kate»), first-person — not a brand channel.**
- **GitHub (public repo)** — not a repost channel, but the main **GEO
  replacement for Habr**: a genuinely useful public repo (e.g. an
  AGENTS.md-template matching article 1) with a README linking the site.
  GitHub is heavily in LLM training data; a useful, starred repo earns
  citations. One-time build, compounds over time.

### Tier 3 — experiments to test

- **VK** — post into relevant dev/startup communities (not just an own page);
  large RU reach, rules vary per community.
- **Spark.ru** — startup/business community, vc.ru-like; try the business-angle
  articles.
- **Tproger / Proglib** — RU dev media, pitch-only, small traffic; strongest
  evergreen pieces only.

### Dropped / on hold (with reason)

- **Habr** — article 1 **rejected without explanation (2026-07-20)**. Habr
  punishes anything that reads as content-marketing: self-links + CTAs +
  likely AI-gen detection = exactly our format. Its audience is developers
  (not buyers of dev services), and the bar wants genuinely authorial,
  link-free pieces. Dropping it costs us Habr's GEO weight (it was the
  strongest LLM-training-data lever) — compensate with **GitHub + vc/Дзен**.
  Revisit only with an original, no-link, personal-account piece — more effort
  than it's worth now.
- **Telegram channel** — deferred: zero audience, high upkeep.
- **Reddit** — no viable Russian-speaking dev segment (confirmed 2026-07-20):
  dedicated RU programming subs are effectively absent; RU devs sit on
  vc/Дзен/Telegram, not Reddit. English AI subs (`r/ClaudeAI`, `r/AI_Agents`,
  `r/cursor`) are strong but English — a play for a future EN site only.
- **DTF** — gamers/pop-culture; wrong fit.

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

Status: ✅ done · 📝 draft ready (`tmp-review/dist/<slug>/`) · ▫️ todo · — n/a · ✕ dropped

| article (slug)          | vc.ru                         | Дзен | X (личный) | Habr (снят) |
| ----------------------- | ----------------------------- | ---- | ---------- | ----------- |
| agents-ready-project    | ✅ live (2 коммента, 2 лайка) | 📝   | 📝         | ✕ отклонён  |
| spec-driven-development | 📝                            | 📝   | 📝         | ✕           |
| github-spec-kit         | 📝                            | 📝   | 📝         | ✕           |
| agents-md-primer        | — (техн.)                     | 📝   | 📝         | ✕           |
| cursor-rules            | — (техн.)                     | 📝   | 📝         | ✕           |

Drafts in `tmp-review/dist/<slug>/` (vc.md, dzen.md, x.md). **Habr dropped** —
the `habr.md` drafts are now unused (keep as raw material for a future GitHub
README or an original Habr piece; otherwise deletable). vc/Дзен are brand
(«мы»); X is first-person (personal `@groownow`). Coworker: publish per the
matrix, flip cells to ✅ with the posted URL.

(Agent keeps this matrix current as adaptations are drafted; coworker flips a
cell to ✅ with the published URL when posted.)

## Coworker checklist (per article)

1. Agent drops adaptations in `tmp-review/dist/<slug>/` (vc.md, dzen.md, x.md).
2. Publish **vc.ru** + **Дзен** (Tier 1) — paste, confirm the link back to the
   original is intact.
3. Post the **X** thread (personal `@groownow`, first-person).
4. In the matrix above, flip the cell to ✅ and paste the published URL.
5. After ~3–7 days, note early metrics (views / comments / likes) — feeds the
   weekly review in `analytics.md`.

## Priority order to clear the backlog

1. Finish article 1: add Дзен + X (vc.ru already live).
2. Articles 2–3 (spec-driven, github-spec-kit) → vc.ru + Дзен + X.
3. Articles 4–5 (agents-md-primer, cursor-rules) → Дзен + X (vc.ru n/a).
4. Test one experiment platform (VK community or Spark.ru) with the strongest
   article; if it lands, add it to the rotation.

Cross-posting cadence trails article publishing by a few days — publish on the
site first (canonical), then distribute.
