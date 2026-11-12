# Works section: screen gallery — design + plan

Status: built and published 2026-11-12 (`/cases`, `/cases/<slug>`). RU market only (`/cases`, home
`CasesPreview`); EN/ES `/work` untouched for now.

## Why

Portfolio visitors do not read case texts and will not sign up to try an app
(smallFriendFiles needs an account and documents). They want to see the
screens. So the section leads with real screens from the projects' `.pen`
mockups, opens any screen fullscreen, and keeps a link to the live product for
those who want to click through.

## Decisions (user, 2026-11-11)

- **Preview = variant B "Лента экранов"**: one row per project — text column
  (kind, title, one line, "Подробнее о проекте", N screens) + a swipeable strip
  of ~7 screens that open the fullscreen gallery directly. Mobile: full-bleed
  strip with 24px start inset, phone screens first, next screen peeks in.
- **Case page = variant 3 "История в экранах"**, changed: text always **left**,
  screen **right** (no zig-zag — "глазам надо постоянно перескакивать").
  Mobile: each point is one compact paragraph (`01 **Title:** description`),
  text above its screen, tight spacing; mobile shows the phone version of the
  screen. Then a strip of all screens, then task / result / stack.
- Phone frames: small corner radius, like a real phone (not a pill).
- **Every horizontal image strip on the site has clickable ← → arrows**
  (preview strip, "все экраны" wall, any future gallery): smooth scroll on
  pointer devices — not everyone has a trackpad; no arrows on touch / ≤800px;
  the arrow at an end is hidden. One shared component.
- **Image quality:** export `.pen` screens at 2x (desktop) / 3x (mobile), live
  pages at DPR 2–3; thumbs ≥2x their displayed size; never upscale a 1x
  export. Real 1x screenshots get a 2x lanczos upscale + light sharpen at
  most — re-capture on a Retina screen when possible. Cookie/consent banners
  are dismissed before capture.
- **Very tall pages (over 3× their width) open in the gallery at width**,
  not fitted (a fitted 15 000px page is an unreadable sliver).
- **Text column is one width on every row:** the screens column is a fixed
  584px (380 + 24 + 180), phone-only rows align to its right edge.
- **Fullscreen gallery opens a page whole** (fit to the screen height); a
  click zooms to width with a visible scrollbar, another click goes back. On
  phones it opens at width. A page shown only by its top looks cut off — the
  user read the old width-first view as a cropped screenshot.
- **Previews show the whole page, scaled down** — in the point compositions,
  the hero, the "Все экраны" strip and the home strip; never a top crop. Only
  very tall pages are cut at the bottom (desktop at 1.7× width, phone 3.2×).
  **Footers are cut off** every screen (desktop and mobile; mobile ends at
  its bottom tab bar). Case page: text column ~340px, the screens get the
  rest (all projects).
- **Point pair sizing (case page, supersedes "never a top crop" for these
  previews):** every desktop preview in "Экраны и функции" is one size
  (380×380) and every phone one size (180 wide, same height); both show the
  top of the page, the fullscreen gallery opens it whole. Hero pair fills its
  column: phone 210 wide, desktop takes the rest at the same height. Mobile:
  desktop 62% square + phone 30%. No browser chrome, rounded corners, 24px
  gap; the text column takes the freed width (min 340px, max ~520px).
- **No FAQ, claim forms ("Вашей площадки нет в списке", "Это ваше место?")
  or footers on any screen.** A mobile page whose tab bar is pinned at the
  viewport height in the `.pen` gets it moved to the bottom for the export
  only (then restored).
- Point texts describe **what was built for the client** (features, how
  they work), not marketing for the site's visitors.
- **Every modal / popup / gallery closes on a click outside its content.**
  In the gallery: arrows page, a click on the picture zooms, any other click
  (backdrop, header, ✕) closes. No caption line and no thumbnail strip under
  the picture — the space goes to the picture.
- Screens go in **logical pairs** (desktop + mobile of the same screen) in the
  product's natural order, on every breakpoint (no reordering on mobile).
- **Home page:** the works section moves up to right after services
  (services → works → how we work), and gets an "Открыть все работы" button
  to `/cases`.
- Screenshots of real data must be checked for personal data before
  publishing (owner name, address, phone, e-mail on documents) and blurred.

- Case page (mockup `.design/works/case-4.html?v=f`, "Лонгрид"): hero (pink
  gradient, the only coloured band) → "Все экраны" strip with arrows → points
  one under another (text left, desktop + overlapping phone right, ~30px
  between shots, no dividers, timeline, numerals or panels) → task / result /
  stack as three text columns under a hairline → one-line CTA. One rhythm:
  40px between blocks (28px mobile). Rejected: zig-zag, separated sections
  with big gaps, full-bleed accent stripe, giant numerals, tinted panel behind
  screens, 3×2 grid, list + sticky screen. Colours approved as is: white page,
  pink only in the hero gradient and primary buttons.
- Point texts are written like product documentation, not marketing: the
  title is the page name ("Главная", "Ветпаспорт", "Документы", …), the
  description says factually what the page does.

## smallFriendFiles (content draft v2, awaiting approval)

Screen pairs in order: landing (live site, RU) → Главная → Ветпаспорт →
Документ (real screenshots) → Прививки → Подборка (real screenshots) →
Профиль (real screenshots). Strip = first four pairs. Real screenshots were
redacted: owner name/address/NIE/phone on PDFs, share-link token, account
e-mail, browser URL bar. Mockup fixes in `pawfile/design.pen`: microchip card
no longer overlaps the pet card (passport mobile), pet switcher says Барни on
mobile home and vaccinations.
- **Home preview: 4 works** — smallFriendFiles, FortNoise, Gridfin, Secret
  Santa. **`/cases` (the separate works page): all 5** — the same four plus
  qa-pilot (last; it is more technical). Santa is described generically
  (neighbours, a team, friends) — no residential-complex specifics.
- **Secret Santa has no "Открыть проект" link**: a live game is running on it
  and outside visitors would interfere. Screens only; `website` becomes
  optional in `CaseStudy`.
- Mockups: `.design/works/` (gitignored), served locally; taste recorded in
  `docs/design-taste.json`.

## FortNoise (content draft v2, awaiting approval)

Launch: fn39.ru live early July 2026 (prod stack 2026-07-04, SEO/GEO work
from 2026-07-16). Result line carries the user's October numbers (≈3000
Google impressions, ≈200 clicks, ≈250 impressions in Google's generative AI).
Afisha and Map desktop screens are live captures (1120 @2x, cookie closed);
mobile Map is a live capture (390 @3x) — no mockup has one. Anonymous
submissions only (no Telegram login).
Framing (user): an events listing for the independent media FORT NOISE about
Kaliningrad's underground / rock / independent scene; events are shown in
time (list by date) and in space (city map). Screens come from
`fortnoise/fortnoise-design.pen` as full-page images, not live captures:
Афиша `y1i0Zn` + `XDNWn`, Карта `W1uNt` (no mobile map mockup), Событие
`j747dc` + `YgmkI`, Площадки `aZte2` + `s3DT20`, Площадка `LCtoj` + `Dp3PK`,
О проекте `UqjR8` + `U8eOs`, Добавить событие `kO6t0` + `ukbJH`. Mockup fixes:
every chosen desktop screen uses the `Site Header Desktop v2` component
(guest menu Афиша / Карта / Площадки / О проекте + «Добавить», active item
underlined; moderator items «Мои заявки», «Модерация» and the avatar exist in
the component, off by default); mobile screens use `Mobile Tab Bar v2`;
mobile header wordmark is «FORT NOISE» with the real emblem; the map hero
said «САНКТ-ПЕТЕРБУРГ» — now «КАЛИНИНГРАД / КАРТА ШУМА».

## Gridfin (content draft, 2026-11-11)

Layout "landing" (user): a link and a description, few screens. Hero as on
other cases; no "Все экраны" strip; one row "Что внутри" — five text points
on the left (sticky), on the right the **whole desktop landing at full
length** (380 wide, ~2260 tall) + the phone with the **whole mobile
landing** (user, 2026-11-12): the phone is as tall as the desktop preview
and shows the mobile landing from the top down to that height (full-length
thumb `f`). A sticky phone with in-step scrolling was tried and rejected —
from outside it still read as a short phone. Home strip: landing desktop, phone top, plus a large
first screen ("Первый экран", hero crop up to the green band); the "Все N
экранов" tile is shown only when the strip doesn't already hold every screen. Screens are live captures of
`ludvik4.ru/gridfin/` at 2x with the FAQ column and the footer removed.
The template itself is given on request (early access) — the note under the
button says so; the button opens the landing.

## Secret Santa (content draft, 2026-11-11)

Logic from `secret-santa/docs/superpowers/specs/2026-10-31-secret-santa-design.md`,
described generically (no residential-complex specifics). Screens from
`secret-santa/secret-santa.pen`, exported 2x desktop / 3x mobile: promo page
cut before the pricing block (pricing, "Откуда взялось" with the Spanish
complex, FAQ and footer removed), mobile screens trimmed to their tab bar,
admin without the signature footer. Seven points in game order: promo,
anketa, cabinet, gift hand-over (two phones), guess (the desktop reveal
screen is dropped: placeholder photo, gendered copy), wall, admin + draw.
Export-only text fixes (the `.pen` is restored after export): no pricing
(«Цены» nav → «Возможности», «Участие бесплатное.», no tariff step),
«подопечный» → «получатель», admin «Жители»/«жителей» → «Участники», no
«Мадрид», admin gets the cabinet menu at the bottom. Phone-only rows show one or two standard-size phones. Short desktop
screens get a white square thumb so the 380×380 preview never crops sides.
No "Открыть проект" link.

## Publish decisions (user, 2026-11-12)

- All five drafts approved ("всё отлично, можешь публиковать").
- **The home page stays as it is** (the exhibit tiles, four works incl.
  qa-pilot). The strip layout (mockup `preview-b.html?all`) is the
  **`/cases` page** — all five works, qa-pilot last. This supersedes the
  "home preview = variant B" and "works section moves up" decisions above.
- The RU header item «Работы» leads to `/cases` (was `/#work`).
- Every case page `/cases/<slug>` gets the case-4 layout.
- Links to live projects open in a new tab; breadcrumbs are links
  (Главная / Работы / project).

## Plan

1. **Agree the content per project, one project at a time, with the user**
   before building its page: what we tell about the product, which features we
   describe and how (the 3 "what we did" points, their wording), and which
   screens illustrate each point and fill the strip. Order: smallFriendFiles →
   FortNoise → Gridfin → Secret Santa.
2. Fix mockup defects found on the way in the source `.pen` files (done:
   smallFriendFiles "Требует внимания" items now wrap to two lines).
3. Export the agreed screens at 2x from the `.pen` files to
   `public/cases/<slug>/` as WebP (thumb + full; long pages full height).
   Gridfin has no mobile mockup — mobile comes from the live page.
4. Data: extend `CaseStudy` in `src/features/site/commercial-content.ts` with
   `screens` (src, kind desktop/mobile, caption, size), `strip`, and per-point
   screen refs; add the `secret-santa` slug; `HOME_CASE_SLUGS` = the four;
   qa-pilot stays on `/cases` and `/cases/qa-pilot` (needs its own screens —
   from the live `/qa-pilot/` landing, no `.pen` found).
5. Components (FSD slice in `src/features/site`): screen strip, fullscreen
   gallery (keyboard, swipe, focus trap, scroll for tall pages, thumbnails),
   case page layout. `next/image`, tokens only, `<Link>` for internal nav.
6. Tests: unit for data integrity (every ref resolves), component tests for
   the gallery (open/close/keys/focus return), e2e at 375/768/1280; update
   sitemap/llms/JSON-LD tests for the slug change.
7. `/verify`, design review at three breakpoints, roadmap Now update.

## Open questions

None at the moment — content per project is agreed in plan step 1.

## qa-pilot (content draft, 2026-11-12)

User: added as the fifth (last) project on the works page; few screens, the
description matters. Layout "brief": the hero holds the only screens — the
first screen of `ludvik4.ru/qa-pilot/` (desktop 1440×900 @2x, mobile
390×844 @3x), shown uncropped (hero pair sized by `matchPairs`); no "Все
экраны" strip; "Что внутри" is a two-column text grid of six points
(profile, QA per task, audits, a test must be able to fail, risk priority,
rule base + scripts) taken from the live landing. Home strip: the two hero
screens, no "Все N экранов" tile.
