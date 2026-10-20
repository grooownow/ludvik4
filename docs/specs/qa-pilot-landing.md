# qa-pilot landing on both production domains

Status: implemented on branch `feat/qa-pilot-landing` (2026-10-20).

## Request and scope

The user asked to publish the qa-pilot landing (built in a separate session
as a claude.ai artifact) as a page of their own sites, the way Gridfin is
embedded, and to make the portfolio's "open project" link lead to it:

- RU: `https://ludvik4.ru/qa-pilot/` — RU deck with the RU/EN switch kept.
- EN: `https://ludvik4.dev/qa-pilot` — English only, switch removed.
- Replace the GitHub-repository screenshot on both case cards with a
  screenshot of the landing's cover, per market language.
- RU `/cases/qa-pilot/` → "Открыть проект ↗" and EN `/work/qa-pilot` →
  "View qa-pilot landing →" open the landing.

EN deliberately does not use Gridfin's `cardLink` (card opens the landing
directly): `cardLink` removes the item from `internationalCaseStudies`, which
would 404 the already-indexed `/work/qa-pilot`. The card keeps opening the
case page; the case page links to the landing.

## Source and regeneration

Source of truth: the artifact `https://claude.ai/artifact/7V7H1WRBkW7DvJBmrX9LRV`
(one HTML file, two `<main class="deck">` blocks, `data-lang="ru"` and `"en"`).
ludvik4 holds output only. Transformations applied when copying:

1. Replace the artifact host wrapper with a real `<head>`: `lang`, title,
   description, canonical, RU/EN hreflang (x-default → EN), Open Graph and
   Twitter tags, `SoftwareApplication` JSON-LD; drop the `claude:` meta.
2. RU: keep both decks; the default language is `ru` unless the visitor has
   chosen otherwise (localStorage). The artifact's `navigator.language`
   detection was removed so crawlers always render the canonical RU deck.
3. EN: delete the RU deck, the switch markup, the RU nav labels and the
   language plumbing in the script; no Cyrillic remains.
4. Screenshots: cover slide at 1920×1080 with the floating slide nav hidden →
   `public/cases/qa-pilot-{ru,en}.webp` (1200×675, cwebp q82); 1920×1008 →
   `assets/og-{ru,en}.png` (1200×630).

`src/app/sitemap.test.ts` (`public qa-pilot landing`) pins canonical, switch
presence/absence, RU default and the OG files, so a careless re-copy fails
`pnpm test`.

## Wiring

- `config/rewrites.ts`: EN `/qa-pilot → /qa-pilot/index.html`.
- `scripts/build-ru-static.ts`: stash `public/qa-pilot`; copy
  `resources/ru-public/qa-pilot` into `out/qa-pilot`.
- Sitemaps (`buildSitemap`): RU `/qa-pilot/`, EN `/qa-pilot`; EN `llms.txt`
  gains a qa-pilot section.
- Case content: new images/alt text and landing URLs; the RU solution line
  now says three commands (matching the landing) instead of six.

## Verification

Red proof before wiring: `Test Files  5 failed (5)`, `Tests  7 failed | 21 passed (28)`.
After: `Test Files  61 passed (61)`, `Tests  498 passed (498)`; e2e `38 passed`;
RU static export `45/45`, EN build `37/37`. Local smoke: EN `/qa-pilot`,
`/qa-pilot/assets/og-en.png`, `/work/qa-pilot`, `/work` → 200; RU static
`/qa-pilot/`, `/qa-pilot/assets/og-ru.png`, `/cases/qa-pilot/` → 200. Language
switch RU→EN→RU works; no horizontal overflow at 375px (both languages) and
1280px; no console errors on the landing pages. Production check pending deploy.
