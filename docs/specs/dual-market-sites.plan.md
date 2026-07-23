# Plan: dual-market sites (ТЗ 1)

Source brief: `docs/agent-briefs/01-rebuild-market-sites.ru.md`. Strategy:
`docs/business-strategy.md`. This is an **update, not a redesign** — the current
visual design at https://ludvik4.dev is the binding reference.

## Goal

One codebase → two independent market builds selected by a single server env var
`SITE_MARKET=ru|en`. Root `/` serves the selected market; the other locale's
route is not published; no visible RU/EN switcher, no hreflang linking the two.

## Owner decisions (locked)

- **Positioning:** RU = бренд независимого продуктового разработчика. Services,
  process, pricing, FAQ, and contact use neutral result-oriented language; first
  person is reserved for the personal-accountability block. EN remains
  «founder-led product studio» (first person «I…»). Claims about a permanent
  team are removed everywhere (copy, JSON-LD, llms.txt, keywords).
- **Services 4 → 3** on both markets: (1) Сайт/лендинг · (2) Автоматизация
  бизнес-процессов · (3) Веб-приложение / компактный SaaS. (Titles refined
  2026-07-22..23 for clarity — dropped «один …» / the «MVP» jargon; format chips
  removed; EN mirrored: "Business workflow automation" / "Web app or compact SaaS".)
- **RU pricing:** amounts set by owner 2026-07-23 — сайт/лендинг от 40 000 ₽,
  автоматизация от 40 000 ₽, веб-приложение/компактный SaaS от 110 000 ₽ (FAQ
  pricing answer aligned). EN gets no pricing block.
- **EN form:** kept; a privacy-notice link slot sits by the form but there is no
  approved privacy notice → **release blocker** (no invented legal text).
- **EN scope update (2026-07-23):** EN now includes the shared three-step
  process and a localized `What's included` accordion. It still has no public
  pricing, FAQ, blog, or separate about section.

## Architecture

- `SITE_MARKET` added to `src/lib/env.ts` (`z.enum(["ru","en"]).default("ru")`),
  `.env.example`, and `src/lib/env.test.ts`.
- New slice `src/features/site/`:
  - `content.ts` — typed `MarketContent`; pure `getMarketContent(market)`; two
    content objects (RU richer, EN shorter). Also builds per-market metadata +
    JSON-LD from the same content.
  - shared presentational sections (header, hero, services, how-it-works,
    pricing, about, contact, footer, eyebrow, section) — market-agnostic.
  - `home-ru.tsx` / `home-en.tsx` — thin compositions (section order per brief);
    both use the shared process and service-scope content, while pricing remains
    RU-only.
  - `index.ts` — public API: `MarketHome`, `siteMetadata`, `siteContent`,
    `MARKET`, plus `buildSitemap(market)` / `buildLlmsTxt(market)` helpers.
- `src/app/page.tsx` → thin `<MarketHome/>`. `src/app/layout.tsx` → `lang` +
  `metadata` from the slice, per market; RSS alternate only for RU.
- **Remove** `src/app/en/` route. RU/EN switcher + ru↔en hreflang removed.
- Blog + RSS + articles: RU market only. EN build 404s `/blog*`, and sitemap /
  robots / llms.txt exclude blog + articles.
- `/signin`, `/dashboard`: starter code kept (no risky deletion) but kept out of
  nav + sitemap + indexing (robots disallows both).
- Each market its own `NEXT_PUBLIC_APP_URL`; metadata never references the other
  market's domain. JSON-LD de-teamed; Spain is legal-info only, never marketing.

## Slice order

1. Market config + shared render spine (env, slice scaffold, page/layout, remove /en).
2. RU content + positioning + 3 services + remove form + pricing (pending amounts).
3. EN content + positioning + 3 services + form + privacy slot.
4. SEO surfaces split by market (sitemap/robots/llms/json-ld, blog gating).
5. Tests, gates, both production builds, UI screenshots ×3 sizes ×2 markets,
   old-URL→redirect list for ТЗ 2, release-blockers, docs actualization.

## Required tests (brief §Тесты)

1. `SITE_MARKET=ru` → ru metadata, `lang=ru`, ru CTA, **no form rendered**.
2. `SITE_MARKET=en` → en metadata, `lang=en`, en content.
3. Sitemap per build contains only its allowed URLs.
4. EN lead form still passes existing unit tests.
5. RU page does not import / call the lead action.
6. No indexable second-locale route in production.

## Deliverables (brief §Результат)

- File-change map · local + prod-build commands for RU and EN · before/after
  screenshots (desktop+mobile) + 1440×900 / 768×1024 / 390×844 · old-URL →
  redirect recommendations for ТЗ 2 · release-blockers (privacy notice) · docs
  actualized (manifest, site-v0, roadmap).

## Deliverables (produced)

**Run commands.** Local RU: `pnpm dev` (SITE_MARKET defaults to ru). Local EN:
`SITE_MARKET=en pnpm dev`. Prod build RU: `SITE_MARKET=ru pnpm build && pnpm start`.
Prod build EN: `SITE_MARKET=en NEXT_PUBLIC_APP_URL=https://<en-domain> pnpm build`.

**Old URL → redirect (for ТЗ 2).** The only removed public route is the old
second-locale `/en`.

| Old URL                    | Recommended action in ТЗ 2                                                          |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `https://ludvik4.dev/en`   | 301 → EN domain root `/` (already noted in ТЗ 2 brief)                              |
| RU articles `/blog/<slug>` | unchanged slugs; only the base URL swaps via `NEXT_PUBLIC_APP_URL` on the RU domain |

No hreflang linked the two markets, so there is no cross-domain alternate to
migrate. External note: `docs/roadmap.md` / qa-pilot README still point a "Made
by" link at `ludvik4.dev/en` — ТЗ 2's redirect covers it.

**Release blockers.** The EN `/privacy` page and layered form notice were
implemented on 2026-07-23; the autónomo's legal identity and contact address are
confirmed. Before EN production, replace or legally validate Telegram Bot API
delivery (details: `docs/legal/privacy-notice-en.md`). RU copy/pricing/voice
updates through 2026-07-23 are implemented (see RU refinements below); the only
remaining RU copy item is the fuller FAQ neutral-voice pass.

**Verification.** Gates all green — vitest 317, tsc, oxlint/eslint/prettier, e2e
26; both `SITE_MARKET` production builds succeed. RU build verified (server-
reference-manifest + grep) to contain **no** lead action / Telegram delivery.
UI: both markets at 1440×900 / 768×1024 / 390×844 — no horizontal scroll, console
clean, design preserved.

## RU refinements (2026-07-23)

Post-ТЗ1 RU copy/UX updates (owner review):

- Voice → independent developer: neutral result-oriented copy everywhere; first
  person only in «Кто стоит за Ludvik4». Positioning phrase «студия цифровых
  продуктов» → «разработка цифровых продуктов» (title/description/keywords/OG/llms).
- Services: plain-language titles, format chips removed, 3-equal-card grid
  (3 cols wide · 2 + full-width 3rd on tablet · 1 on phone).
- New RU section **«Что входит в работу»** (`service-scopes.tsx`): open accordion
  of per-service scope (result · stages · boundaries · priced-separately), no
  hours — see `docs/service-scopes-ru.md`.
- RU block order: services → how-it-works → what's-included → pricing → FAQ →
  about → contact.
- Accordion (shared, FAQ + scopes): `cursor: pointer` + hover (pink text + pink
  bottom border).
- RU pricing amounts set 2026-07-23 (40 000 / 40 000 / 110 000 ₽); pricing block
  and FAQ pricing answer are live (no more placeholder).
- Still pending: fuller FAQ copy pass to the neutral voice (2 remaining «MVP»
  mentions), EN privacy notice (blocker).

## Status

- [x] Slice 1 · [x] Slice 2 · [x] Slice 3 · [x] Slice 4 · [x] Slice 5
- Reviewed (3 parallel adversarial lenses); 1 Major (RU build carried EN lead
  action) + minors — all fixed and re-verified.

NO UNRESOLVED DECISIONS. Remaining before RU/EN launch: fuller FAQ neutral-voice
pass (RU), EN privacy notice (blocker), ТЗ 2 (domains + deploy).
