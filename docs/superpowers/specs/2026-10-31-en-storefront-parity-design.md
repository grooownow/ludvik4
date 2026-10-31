# EN storefront parity with the October RU update — design

Status: awaiting owner approval. Date: 2026-10-31.

## Intent

The RU storefront gained service pages with fixed packages and prices, an
animation service, a gallery of live effects, and a clearer studio voice
(2026-10-28, `docs/specs/ru-clarity-and-pricing-handoff.md`). ludvik4.dev has
none of it. Bring the same offer to ludvik4.dev in natural English, adapted to
a studio legally based in Spain and selling worldwide, in euros.

The owner works as an autónoma in Spain, pays tax there, and works worldwide.

## Goals

1. Everything sold on ludvik4.ru is sold on ludvik4.dev: same five services,
   same three packages each, same scope and terms.
2. The studio location is open on EN: Spain.
3. All EN prices in EUR, per the formula below.
4. No Russian law, Russian infrastructure or Russia-only products in EN copy.
5. EN legal surface fits Spain and the EU.
6. The English reads as written by a native copywriter, not translated.

## Non-goals

- ludvik4.ru stays unchanged: not a text, not a price. Its 152-ФЗ wording stays.
- Blog articles: neither translated nor edited in this project.
- Contract drafts (`docs/legal/contracts-ru/`): untouched; EN contracts later.
- `/gridfin`, `/qa-pilot`, EN guides, EN cases: no content changes, except any
  claim that contradicts this design (e.g. "Europe-based" may become Spain).
- Other languages; new payment flows; an EN copy of the RU order form backend.

## Anti-goals

- A shared-code refactor that shifts the RU build's HTML or text.
- Word-for-word calques ("under the key", "halls" where it confuses).
- A legal promise the studio cannot keep ("fully GDPR compliant guaranteed").

## Constraints

- Hard invariants in `CLAUDE.md`: `<Link>` for internal links, zod on inputs,
  Conventional Commits, tests proven able to fail.
- RU-only code stays out of the EN bundle and vice versa, as today; the lead
  backend stays EN-only and the Yandex order backend stays RU-only.
- Project tokens and components only (`docs/rules/frontend.md`). Reuse the RU
  pricing layout; no new visual patterns.
- `docs/rules/content.md` bans location disclosure: limit that ban to the RU
  market. Update `docs/manifest.md` (it says EN has no service prices by
  implication), `docs/marketing/en/` canon and the tests that assert "no
  prices on EN"/"Europe-based", as those assertions are now wrong by design.
- Work on a feature branch from `main`; leave the untracked `.glsl`, `images/`,
  `experiments/` and `.superpowers/` files alone.

## What the owner decided

- Location on EN: Spain, open.
- Scope: the site's main content only. No articles.
- Russian law removed from EN only; ludvik4.ru is not touched.
- Packages and terms stay; prices in EUR.
- Price formula: RUB → EUR at the current rate, × 1.5, then + 30% for taxes.
- Cards show the price only; VAT is handled in the written agreement.
- `/terms` conditions as listed under Legal surface.
- Tax ID taken from the owner's own filings.
- Worldwide work stays.
- Contracts deferred.

## Pricing

Set by the owner on 2026-10-31 after a review of Spanish studio prices
(`tmp-review/spain-pricing-2026-10-31.md`), replacing the first RUB-based formula.
All prices exclude VAT; the owner pays income tax from them.

| Service | Basic | Plus | Premium |
| --- | --- | --- | --- |
| Landing pages | €200 | €350 (was €400) | €500 |
| Websites | €500 | €850 (was €950) | €1,300 |
| Web apps | from €1,500 | €3,000 (was €3,400) | from €6,000 |
| Animations | €150 | €300 | from €700 |
| Automations | €500 | €900 (was €1,000) | €2,000 |

Web app Basic is the simplest version: 3–4 weeks and 1 month of support; complex
search, file uploads, AI or integrations are quoted on top.

Package cards show the price only (owner): no VAT wording, no totals. The 30% is
a margin for the owner's income tax, not VAT. VAT, where it applies, is stated
in the written agreement; `/terms` says so.

"From" prices equal Basic. Running costs "from 1,000 ₽/month" become "usually
from €20 a month". EN Extended uses the RU current (discounted) price.

Builder's call in the code: EN prices live as plain strings in EN content, not
computed from RU at runtime. The rate does not float.

## Structure of the EN site

New pages, mirroring RU:

| RU | EN | Note |
| --- | --- | --- |
| `/uslugi` | `/services` | Hub, first tab open. New route |
| `/uslugi/lendingi` | `/services/landing-pages` | Packages page |
| `/uslugi/razrabotka-sajtov` | `/services/website-packages` | Packages page |
| `/uslugi/veb-prilozheniya` | `/services/web-apps` | Packages page |
| `/uslugi/animatsiya-dlya-sajta` | `/services/web-animation` | Packages + live gallery |
| `/uslugi/avtomatizatsii` | `/services/automation-packages` | Packages page |

Existing `/services/websites`, `/services/workflow-automation`,
`/services/mvp-development` keep their URLs (Google knows them) and act as the
"Learn more" detail pages, exactly as the older detail pages do on RU. The two
kinds share `/services/[slug]`, as on RU. `seoTitle`s target pricing intent
("Landing page cost: packages and prices") so they do not compete with detail
pages.

Also changed on EN:

- Header "Services" → `/services`. Hall cards link to their pages, reordered to
  match RU (Landing pages, Websites, Web apps, Animations, Automations,
  Something else?). "Widgets & tools" gives way to Animations, as on RU. This
  also fixes the open SEO finding that the home has no links to service pages.
- Mascot bubble on the EN home.
- Home copy, About, Contact: align meaning with RU. Prices stay off the home,
  as on RU.
- FAQ (design's call): no new FAQ section. Neither home shows one today, and
  the RU `faq-data.ts` is not rendered. Update only the existing
  `internationalFaq` data: Spain, packages and EUR pricing.
- JSON-LD offers in EUR, sitemap, `llms.txt` (the prices and Spain), service
  files, `security.txt` unchanged.

"Order" buttons on EN: no dialog. They go to `/contact` with service, package
and price passed in the URL and prefilled into the "Your task" field through
the existing lead form. URL values are validated with zod against known
services, never trusted as free text. Mailbox and Resend stay as they are.

## Voice

Studio "we" across EN service, home and About copy, mirroring RU, with first
person kept only where the founder speaks personally (About block on the home).
`docs/manifest.md` updated. Builder keeps "one accountable lead, you talk to the
founder directly": the honest core of both markets.

## Adaptation rules

Replace with what a European client would recognise; never transliterate.

| RU | EN |
| --- | --- |
| По законам РФ / 152-ФЗ | "GDPR-ready": privacy notice, consent, cookie banner and legal notice templates, reviewed by the client |
| Данные в России, YandexGPT, GigaChat | "EU data options": EU hosting where the task allows, AI providers under a data processing agreement. No "only in the EU" absolutes |
| Хостинг в России | Hosting help, any provider, EU by default |
| Яндекс, Google | Google, Bing |
| 1С, МойСклад | Holded, Xero, QuickBooks, Odoo |
| amoCRM, Битрикс24 | HubSpot, Pipedrive |
| ВКонтакте, Telegram | WhatsApp, Telegram |
| Авито, Wildberries, Ozon | Amazon, eBay, Etsy, Zalando (per example) |
| Площадки закупок | Public tender portals |
| Tilda | Webflow, WordPress |
| Договор | Kept: "Written agreement" |

The list of named products stays open-ended ("for example", "and others"), as on
RU. Only name tools the studio would really take on.

Legal templates (design's call): the RU service scopes already include templates
of all the legal texts a site needs, but its package lists show only part of
them, by tier. On EN the templates (privacy notice, consent, cookie notice,
legal notice) go into the "in every package" line for landing pages, websites
and web apps, and leave the per-tier lists. Reason: an EU client's Basic site
needs them too, and the price table does not change. Client reviews them.

Launch offers follow RU: Plus shows a struck-out price and "Price until 31
December" (old prices in the table). Animations have none. Remove after 31 December.

## Legal surface (Spain / EU)

Texts are drafted from primary sources (BOE consolidated LSSI and TRLGDCU,
current AEPD cookie guide) and verified at writing time, not from memory. All
are flagged for a lawyer's review, as with RU.

- `/legal-notice`: provider identification per LSSI art. 10: Ekaterina
  Pustovaia, trading as Ludvik4; the Valencia address already on `/privacy`
  (confirmed by the Modelo 036 of 2025-01-31); email; tax ID from the owner's
  Modelo 303 filings; activity: software development (IAE 2763, programmers and
  analysts). Linked from the footer on every page. The tax ID appears only on
  this published page, not in docs.
- `/cookies`: cookie policy per LSSI art. 22.2 and the AEPD guide. The current
  banner, withdrawal flow and `/privacy` §9 remain; banner links to it.
- `/terms-of-service` (`/terms` is taken by the Gridfin file; conditions approved by the owner): payment 50/50, web apps by
  stage; code rights pass on full payment; no silent acceptance; the final
  price is fixed in a written agreement once scope is agreed; private clients
  get the 14-day withdrawal right (TRLGDCU), and work starts earlier only at
  their express request. Plus liability and governing law.
- `/privacy`: stays GDPR-based, reviewed against the facts (Resend, Sentry,
  PostHog, Vercel, Telegram) and completed if anything is missing.

## Translation method

1. Glossary and tone guide first: `docs/marketing/en/` plus this document.
2. Write EN copy as adaptation, service by service.
3. Separate fresh editor agent per service, with no sight of the Russian, reads
   as a European founder and flags anything unnatural; then one against the RU
   for meaning and missed scope.
4. `rank-in-ai-seo` only for service page titles, descriptions, internal links
   and checks. It does not write copy.

## Verification

- RU unchanged: build RU before and after; `out/` text and HTML diff is empty,
  apart from build hashes. This is a gate.
- EN: `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build`, `/verify`.
- A test fails the EN build's content if any Cyrillic, `₽`, `152-ФЗ`, `РФ`, or
  the listed Russia-only product names appear in EN service data.
- Browser check of every new page at 375, 768, 1280, prefill from an Order
  button, a real form submission only with the owner's OK.
- Publication: merge to `main` triggers both deploys; RU redeploys identical
  content. After deploy: sitemap resubmission is the owner's or a monitor's.

## Left to the builder

File layout (likely `international-pricing.ts` beside `pricing-draft.ts`),
how `PricingPageView` takes copy and services without changing RU output, exact
wording within the rules above, small calls that do not change scope.

## Open after release

- Lawyer: whether prices shown to private clients need a VAT-inclusive total.
- Lawyer review of `/legal-notice`, `/cookies`, `/terms`, `/privacy`.
- Gestor: VIES/ROI registration for EU business clients.
- EN contract templates (deferred by the owner).
