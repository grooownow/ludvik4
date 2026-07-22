# Plan: dual-market sites (ТЗ 1)

Source brief: `docs/agent-briefs/01-rebuild-market-sites.ru.md`. Strategy:
`docs/business-strategy.md`. This is an **update, not a redesign** — the current
visual design at https://ludvik4.dev is the binding reference.

## Goal

One codebase → two independent market builds selected by a single server env var
`SITE_MARKET=ru|en`. Root `/` serves the selected market; the other locale's
route is not published; no visible RU/EN switcher, no hreflang linking the two.

## Owner decisions (locked)

- **Positioning:** founder-led studio. RU = «студия цифровых продуктов»; EN =
  «founder-led product studio» (first person «I…»). The old «команда
  разработчиков, дизайнеров, ML-инженер» claim is removed everywhere (copy,
  JSON-LD, llms.txt, keywords).
- **Services 4 → 3** on both markets: (1) Сайт/лендинг · (2) Автоматизация
  бизнес-процессов · (3) Небольшое веб-приложение / SaaS. (Titles refined
  2026-07-22 for plain-language clarity — dropped «один …» / the «MVP» jargon;
  EN mirrored: "Business workflow automation" / "Web app or compact SaaS".)
- **RU pricing:** owner supplies the amounts (option «new amounts»). Until
  received, the RU pricing block is left untouched. EN gets no pricing block.
- **EN form:** kept; a privacy-notice link slot sits by the form but there is no
  approved privacy notice → **release blocker** (no invented legal text).

## Architecture

- `SITE_MARKET` added to `src/lib/env.ts` (`z.enum(["ru","en"]).default("ru")`),
  `.env.example`, and `src/lib/env.test.ts`.
- New slice `src/features/site/`:
  - `content.ts` — typed `MarketContent`; pure `getMarketContent(market)`; two
    content objects (RU richer, EN shorter). Also builds per-market metadata +
    JSON-LD from the same content.
  - shared presentational sections (header, hero, services, how-it-works,
    pricing, about, contact, footer, eyebrow, section) — market-agnostic.
  - `home-ru.tsx` / `home-en.tsx` — thin compositions (section order per brief).
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

**Release blockers.** (1) EN privacy notice — form ships with a placeholder,
must be replaced before EN production. (2) Not a blocker but pending: RU pricing
amounts (placeholders + `TODO` in `content.ts`; FAQ pricing answer pairs with it).

**Verification.** Gates all green — vitest 317, tsc, oxlint/eslint/prettier, e2e
26; both `SITE_MARKET` production builds succeed. RU build verified (server-
reference-manifest + grep) to contain **no** lead action / Telegram delivery.
UI: both markets at 1440×900 / 768×1024 / 390×844 — no horizontal scroll, console
clean, design preserved.

## Status

- [x] Slice 1 · [x] Slice 2 (RU pricing amounts pending) · [x] Slice 3 ·
      [x] Slice 4 · [x] Slice 5
- Reviewed (3 parallel adversarial lenses); 1 Major (RU build carried EN lead
  action) + minors — all fixed and re-verified.

NO UNRESOLVED DECISIONS (except RU pricing amounts, awaited from owner)
