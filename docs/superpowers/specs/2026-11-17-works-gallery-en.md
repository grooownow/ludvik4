# Works gallery on ludvik4.dev

Status: built 2026-11-17 on `feat/en-works-gallery`. Extends
`2026-11-11-works-gallery-design.md` (the RU `/cases` gallery) to
ludvik4.dev.

## Decisions (user, 2026-11-17)

- ludvik4.dev gets the same works section as ludvik4.ru — look, content,
  sizes and logic — **without FortNoise**: smallFriendFiles, Gridfin,
  Secret Santa, qa-pilot, in the RU order.
- **Languages:** English `/work` (English screens and texts) and Russian
  `/ru/work` (the RU texts and screens). Spanish `/es/work` keeps the old
  text cards for now.
- **URLs stay `/work` and `/work/<slug>`** (already indexed); slugs
  `gridfin` and `secret-santa` gain case pages.
- **Home:** the work grid shows four works (Secret Santa added); with an even
  count it is the equal 2×2 grid, as on the RU home.
- The real-account smallFriendFiles screens (Document, Pack, Profile) could
  not be taken from the live app (no sign-in), so they come from a **local
  pawfile stack** with the project's dev seed user, its demo data translated
  to English for the capture only (English PDFs and summaries, owner "Laura
  Becker"), language cookie `pf_locale=en`. The share link and the account
  e-mail are blurred, as on RU. The local seed was restored afterwards.

## How it is built

- One layout, three storefronts: `case-pages.tsx` takes a `CaseSite`
  (`case-sites.ts`): `ruCaseSite` (/cases), `enCaseSite` (/work),
  `devRuCaseSite` (/ru/work) — texts, links, gallery/arrow labels, header.
- English screens live in `public/cases/<slug>/en/`, same sizes and crops as
  RU (desktop 2400 / thumbs 1200 or 760; phones 1170 or 780 / thumbs 600 or
  360; Secret Santa phone thumbs top-cropped at 864; square 760 thumbs for
  short desktops). `src/features/site/case-screens-en.ts` is generated from
  the files by `pnpm tsx scripts/gen-case-screens-en.ts`.
- Sources: `.pen` screens were copied, translated with the apps' own
  `messages/en.json` strings, exported (2x desktop / 3x phone) and the copies
  deleted. The same export-only fixes as RU: no pricing (Secret Santa promo
  cut before the pricing block, "Features" in the nav, "Free for
  participants."), "recipient" wording, admin with the cabinet menu, phone
  tab bars pinned under the content (min 932 high). The SFF passport owner
  name is replaced by "Laura Becker". Live captures (Playwright, cookie
  banners dismissed): `smallfriendfiles.fyi/en` (1440@2x, 390@3x),
  `ludvik4.dev/gridfin/en` (FAQ column and footer hidden), `ludvik4.dev/qa-pilot`.
- `/ru/work` shows the English Gridfin and qa-pilot screens (their .dev
  landings are English) and links to the .dev landings, never to ludvik4.ru.
- `isTranslatedPath` lists only `/work/smallfriendfiles` and
  `/work/qa-pilot`: the language redirect and the switch must not send a
  Spanish reader to a missing `/es/work/gridfin`. The sitemap lists the four
  EN case pages; Spanish copies only for the two translated ones.

## Open

- Spanish `/es/work` gallery (Spanish screens) — later.
- The smallFriendFiles English landing hero shows a Russian app screenshot
  ("Медкарта Космос") — a fix for the smallFriendFiles site, not this one.
