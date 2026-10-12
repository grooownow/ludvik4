# smallFriendFiles portfolio case

Status: published on both production domains on 2026-10-12.

## Request and scope

The user explicitly requested adding their web application to both live
Ludvik4 portfolios, with standing authorization to publish autonomously.
Add localized cards, detailed case pages, homepage visibility and discovery
feeds through the existing market-specific content models.

- RU: `/cases/smallfriendfiles/`, the cases index and selected homepage work.
- EN: `/work/smallfriendfiles`, the work index and homepage work.
- Link directly to the matching `/ru` and `/en` application landing pages.
- Describe the user problem, implemented workflow and public beta result.
- Keep existing projects visible. No new routes, dependencies or backend work.

## Public evidence and editorial decisions

Source inspected in a real browser on 2026-10-12:
<https://smallfriendfiles.fyi/ru> and <https://smallfriendfiles.fyi/en>.
The public pages document separate pet medical files, original storage,
extraction with owner review/correction, summaries, search and filters,
selected document packs, expiring/revocable links, QR codes, PDF/archive
exports and four interface languages. The product is in open beta.

Use the neutral label “Web application” instead of inferring client versus
independent-product status. Do not invent business metrics, testimonials,
clinical results, hosting providers, databases or AI model names. Next.js is
observable in the public page's application assets. Document processing is
an organisational aid; the case describes no diagnosis or treatment advice.

Two real, unaltered landing screenshots were captured with analytics
rejected and no account access. Each is cropped to 16:9 and compressed to
WebP. The English landing's existing product preview contains Russian demo
UI; preserve the authentic source rather than fabricate an English product
screen. The surrounding English case and landing text are localized.

## Acceptance and verification

Both cases must appear on homepages and indexes, resolve with localized
metadata, link to the live application, render their cover, and enter the
appropriate sitemap and llms.txt. Check at mobile, tablet and desktop sizes.
Existing catalog, homepage, hub and sitemap assertions were extended before
implementation. Observed red proof: `5 failed` files / `6 failed` tests because
the new case and its links were missing. After implementation the focused
suite reported `7 passed` files / `27 passed` tests.

Local logs and screenshots remain in ignored `tmp-review/`.

## Responsive correction discovered during smoke

At 375px the existing English footer produced a 530px document width on the
homepage, work index and new case. Its seven links were in a non-wrapping flex
row. Enable flex wrapping in the shared footer; preserve all links and tokens.
The initial browser measurements above are the observed failing reproduction.
A live Vercel production check is required because local Next production has
no `/_vercel/insights/script.js` endpoint; its local 404 is infrastructure-only.

## Final local checks

| Check                      | Result | Evidence                                                                                                                                            |
| -------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint                       | PASS   | `All matched files use Prettier code style!`; exit 0                                                                                                |
| Unit/component/integration | PASS   | `Test Files  60 passed (60)`; `Tests  489 passed (489)`                                                                                             |
| E2E                        | PASS   | `38 passed (15.1s)`                                                                                                                                 |
| RU static export           | PASS   | `Compiled successfully in 2.5s`; pages `45/45`                                                                                                      |
| EN production build        | PASS   | `Compiled successfully in 4.2s`; pages `37/37`                                                                                                      |
| Browser layout             | PASS   | Home, index and case at 375/768/1280px; no horizontal overflow after footer correction                                                              |
| Case navigation            | PASS   | RU homepage card opens new case through Next Link; both localized project destinations verified                                                     |
| Review                     | PASS   | Market isolation, truthful copy, static params, metadata, sitemap and llms.txt use the existing content models; no new network/auth/data boundaries |
| Harness                    | N.A.   | No skill, rule or final entry-map changes                                                                                                           |

The existing unused ESLint disable warning in `opengraph-image.tsx` is
unchanged. The screenshots are 1200×675 WebP, 56,218 bytes (RU) and 54,506
bytes (EN). Public-data browser checks required no login or new records.

## Production publication

PR #12: <https://github.com/grooownow/ludvik4/pull/12>. All five CI jobs passed
before merge; merge commit `738a7bd34a255568a17ccedead72d9c78ce3f097`.

- EN Vercel deployment `dpl_51hr1Prc2Mh6g3DneVVB7wAbtLK2` is Ready and
  aliased to ludvik4.dev.
- RU Timeweb workflow `38296183401` completed successfully for the same merge.
- Both live cases, homepage/index links, languages, canonical URLs, sitemap,
  llms.txt and byte-identical cover images were verified.
- Live homepage-to-case clicks and layouts passed at 375/768/1280px in both
  markets. Both detailed cases have no console errors on direct navigation.
- The pre-existing EN Work hub triggers a Gridfin static-landing RSC prefetch 404. Its normal landing destination works; it does not affect the new case.

Machine-readable publication checks:
`docs/seo/smallfriendfiles-publication-2026-10-12.json`.
