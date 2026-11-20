# Works gallery on ludvik4.dev — Spanish

Status: built 2026-11-20 on `feat/es-works-gallery`. Extends
`2026-11-17-works-gallery-en.md` (the `/work` gallery in English and
Russian) to Spanish.

## Decisions (user, 2026-11-20)

- `/es/work` and `/es/work/<slug>` get the same gallery as `/work` — layout,
  sizes and logic — for the same four works in the same order:
  smallFriendFiles, Gridfin, Secret Santa, qa-pilot. No FortNoise.
- **Screenshots in Spanish, at the English sizes**: every Spanish screen has
  the width, crop and thumbnail rule of its English counterpart (tall
  multi-section previews, the gallery opens a page whole), so the pages look
  exactly like the English ones.
- **qa-pilot** has only an English landing: Spanish shows its English screens
  with Spanish captions (as `/ru/work` does) and the link says
  "(en inglés)".
- **Home `/es`**: four works (Secret Santa added) in the even 2×2 grid, with
  Spanish cover screenshots.
- Gridfin and Secret Santa gain Spanish case pages, so every `/work/<slug>`
  is now a translated path (language switch, sitemap, hreflang).

## How it is built

- `esCaseSite` (`case-sites.ts`): prefix `/es`, `esCaseUi`, Spanish texts
  (`esTexts`, translated from the English ones), screens from
  `case-screens-es.ts`. `[locale]/work` and `[locale]/work/[slug]` render
  the gallery for both Spanish and Russian; the old Spanish text cards
  (`InternationalWorkIndexView`, `InternationalWorkView`) are gone.
- `scripts/gen-case-screens.ts <en|es>` writes `case-screens-<locale>.ts`
  from the files (it replaced `gen-case-screens-en.ts` and now also carries
  Gridfin's `openWhole`). Spanish qa-pilot points at
  `public/cases/qa-pilot/en/`.
- Screens in `public/cases/<slug>/es/`:
  - **Secret Santa**: a scratch copy of `secret-santa.pen`, texts replaced
    with Spanish (the app's own `messages/es.json` vocabulary: «ficha»,
    «destinatario», «sorteo»; app header «Amigo Invisible», promo logo
    «Secret Santa»), the same export-only fixes as EN (promo cut after
    "How it works", "Funciones" in the nav, "Gratis para los participantes",
    no Madrid, admin with the cabinet menu, phone screens trimmed to their tab
    bar with a 932 minimum). Exported 3x phone / 2x desktop, resized to the EN
    widths (1170 / 2400; thumbs 360 top-cropped at 864, 760 full, 760 square).
    The wall's foreign post is in English (the Spanish reader translates it).
  - **Gridfin**: live `ludvik4.dev/gridfin/es` at 1440@2x (desktop) and
    390@2x (mobile), FAQ column and footer hidden — the EN pipeline,
    re-checked by re-capturing EN and matching the published files.
  - **smallFriendFiles**: landing from live `smallfriendfiles.fyi/es`; Home,
    Passport and Vaccinations from a scratch copy of `pawfile/design.pen`
    translated with `messages/es.json`; Document, Pack and Profile from the
    local pawfile stack with Spanish demo data and `pf_locale=es` (share link
    and account e-mail blurred, seed restored afterwards).
- Home covers `public/cases/<slug>-es.webp` (1200×675): the top of the
  Spanish desktop page, as the English covers.
- A test pins the Spanish cases to the English shape: same screens, kinds,
  strip, cover, point references and image widths.

## Open

- The qa-pilot landing has no Spanish version.
