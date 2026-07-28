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
  `src/content/blog/<slug>/` (beside the article — see
  `src/content/blog/README.md`) — one file per platform, each ending with a link
  back to the original.
- **Coworker** publishes: pastes each adaptation into the platform, handles
  accounts/moderation, and logs status + early metrics in the tracking table
  below.
- **User** approves the original article (as today). Adaptations don't need a
  separate approval gate unless the user asks — they follow the approved
  original.

Brand rules on **vc.ru / Дзен**: name **Ludvik4**, neutral voice by default;
first-person singular is allowed where authorial experience matters. Do not
invent a team voice or use personal location details. **X is the exception**
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
  replacement for Habr**: a genuinely useful public repo with a README linking
  the site. GitHub is heavily in LLM training data; no promo-rejection problem.
  Flagship = **`grooownow/qa-pilot`** (public plugin, aligned with our
  AI-dev niche). Shipped 2026-07-20: README "Made by Ludvik4" + `plugin.json`
  `author.url` → ludvik4.dev + `claude-code`/`ai-agents` keywords (v0.2.4).
  **[USER, GitHub UI]** repo About → Website `https://ludvik4.dev` + Topics
  (`claude-code`, `playwright`, `qa`, `ai-agents`); and link ludvik4.dev in the
  `grooownow` profile bio. A from-scratch `ai-ready-project-starter` repo is
  deferred (not now). `liftkit` stays private — never publish.

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

Status: ✅ done · 📝 draft ready (`src/content/blog/<slug>/`) · ⏳ waiting for
platform quota · ▫️ todo · — n/a · ✕ dropped

| article (slug)                          | vc.ru                         | Дзен | X (личный) | Habr (снят) |
| --------------------------------------- | ----------------------------- | ---- | ---------- | ----------- |
| agents-ready-project                    | ✅ live (2 коммента, 2 лайка) | 📝   | 📝         | ✕ отклонён  |
| spec-driven-development                 | 📝                            | 📝   | 📝         | ✕           |
| github-spec-kit                         | 📝                            | 📝   | 📝         | ✕           |
| agents-md-primer                        | — (техн.)                     | 📝   | 📝         | ✕           |
| cursor-rules                            | — (техн.)                     | 📝   | 📝         | ✕           |
| stoimost-lendinga-2026                  | ⏳ vc.ru draft 3050076        | 📝   | —          | ✕           |
| chto-podgotovit-pered-zakazom-lendinga  | 📝                            | 📝   | —          | ✕           |
| avtomatizatsiya-obrabotki-zayavok       | 📝                            | 📝   | —          | ✕           |
| ai-avtomatizatsiya-malogo-biznesa       | 📝                            | 📝   | —          | ✕           |
| mvp-etapy-sroki-pervyy-reliz            | 📝                            | 📝   | —          | ✕           |
| stoimost-razrabotki-mvp                 | 📝                            | 📝   | —          | ✕           |
| lending-ili-mnogostranichnyy-sayt       | 📝                            | 📝   | —          | ✕           |
| vnutrennee-veb-prilozhenie-dlya-biznesa | 📝                            | 📝   | —          | ✕           |

Drafts live beside the article in `src/content/blog/<slug>/` (`vc.md`,
`dzen.md`, `x.md` — see `src/content/blog/README.md`) — **committed to the
repo**, not the git-ignored `tmp-review/`, so they persist and version (they're
durable deliverables for the coworker, not throwaway review copies). **Habr
dropped**: no `habr.md` files (removed). vc/Дзен are
brand-neutral or first-person singular; X is first-person (personal
`@groownow`). Coworker: publish per the matrix, flip cells to ✅ with the posted
URL.

The Ludvik4 Дзен channel was created on 2026-07-28. Domain verification uses
the static HTML file documented in the RU production setup; publication itself
remains owner-assisted because the editor is unavailable to browser automation.

The next vc.ru publication is already assembled in draft `3050076` with the
Ludvik4 cover. Publish it after the free monthly publication quota resets; a
paid Pro subscription is not part of the current rollout.

(Agent keeps this matrix current as adaptations are drafted; coworker flips a
cell to ✅ with the published URL when posted.)

## Coworker checklist (per article)

1. Adaptations are in `src/content/blog/<slug>/` (`vc.md`, `dzen.md`, `x.md`).
   The article's **cover card** (full-res PNG, `card.png`) sits in the same
   folder — attach it to every post (the web-optimised copy is at
   `public/blog/<slug>/card.jpg`; for social, upload the full-res PNG).
2. Publish **vc.ru** + **Дзен** (Tier 1) — paste text, **attach the card**,
   confirm the link back to the original is intact.
3. Post an **X** thread only where an `x.md` draft exists; commercial articles
   intentionally skip the personal account.
4. In the matrix above, flip the cell to ✅ and paste the published URL.
5. After ~3–7 days, note early metrics (views / comments / likes) — feeds the
   weekly review in `analytics.md`.

## Priority order to clear the backlog

1. Finish article 1: add Дзен + X (vc.ru already live).
2. Articles 2–3 (spec-driven, github-spec-kit) → vc.ru + Дзен + X.
3. Articles 4–5 (agents-md-primer, cursor-rules) → Дзен + X (vc.ru n/a).
4. Test one experiment platform (VK community or Spark.ru) with the strongest
   article; if it lands, add it to the rotation.
5. Publish the eight commercial adaptations in service pairs: landing pages,
   automation, MVP, then site/internal-app choice.

Cross-posting cadence trails article publishing by a few days — publish on the
site first (canonical), then distribute.

## Profile assets

Social-profile images live in `docs/brand/`:

- `x-avatar.png` (1254×1254), `x-cover.png` (2172×724, 3:1) — the **personal**
  X account (`@groownow`, «Kate»).

Brand accounts (vc.ru, etc.) use the Ludvik4 logo/brand from `design.pen`, not
the personal avatar.
