# ludvik4.dev in English, Spanish and Russian — design

Status: approved in chat by the owner (2026-10-31), who asked the agent to
drive it end-to-end. Date: 2026-10-31.

## Intent

ludvik4.dev sells to clients in Spain and the EU, and to Russian speakers
living abroad. Today it speaks only English. Give the storefront a Spanish and
a Russian version that read as if written in those languages by a copywriter
who knows the studio, with a language switch in the header, and open each
visitor in their language the first time they arrive.

## Goals

1. Three locales on ludvik4.dev: English (default), Spanish, Russian.
2. Every storefront text is translated (list below). Translation is marketing
   copy written for the reader, not a calque of the English.
3. A language switch in the header (desktop and mobile menu) that keeps the
   visitor on the same page in the other language.
4. First visit without a saved choice: open the language of the browser
   (`Accept-Language`): Spanish → ES, Russian → RU (when enabled), anything
   else → EN. Owner decision: browser language, not IP country.
5. The visitor's explicit choice is remembered on the device and wins over
   the browser language from then on.
6. A code constant `RU_LOCALE_ENABLED` turns the Russian locale on or off.
   Off: no `/ru` pages (404), no RU in the switch, Russian browsers get EN.
   Ships **on**.

## Non-goals

- ludvik4.ru is not touched: not a byte of its rendered text or markup. Its
  build must stay as it is (the RU-build comparison gate stays).
- Blog articles, the blog index, guides, `/gridfin`, `/qa-pilot`: stay in
  English. The switch on those pages leads to the home of the other language.
- No new prices, packages or legal facts. Content = the current EN site.
- No translation service, no i18n library (the copy already lives in typed
  modules; we extend them).

## Anti-goals

- Machine-sounding Spanish or Russian. Calques of English idioms.
- Anything Russia-specific in the RU locale: 152-ФЗ, roubles, Russian hosting,
  1С/Bitrix/VK/Avito, Russian tax status. RU locale = the EN offer (EUR, Spain,
  21% IVA) in Russian.
- Two Russian sites competing in search: `/ru` on .dev is `noindex`.
- A redirect that hides the English site from Google: bots are never
  redirected, and an explicit `/es/...` or `/ru/...` URL is never redirected.
- The MAX messenger anywhere in the copy (owner blocklist).

## What is translated (owner decision)

Home; `/services` and the five package pages; the three detailed service
pages; About; Contact with the lead form (labels, placeholders, success and
error messages, server validation messages); `/work` and every case page;
Privacy notice; Cookie policy; Legal notice; Terms of service; the cookie
banner and cookie settings button; header, mobile menu, footer, breadcrumbs,
mascot bubble, 404 for the locale routes; page titles, descriptions and
Open Graph text.

## URLs

- EN stays at the root, unchanged: `/`, `/services`, `/services/<slug>`,
  `/about`, `/contact`, `/work`, `/work/<slug>`, `/privacy`, `/cookies`,
  `/legal-notice`, `/terms-of-service`.
- ES and RU mirror them under a prefix with the same slugs: `/es/services`,
  `/ru/work/<slug>`, … Slugs stay English (agent's call: one slug table, no
  redirect matrix, links stay predictable; the page content is what ranks).

## Remembering and detecting the language

- The switch writes the choice to a first-party cookie (`ludvik4_lang`, one
  year, `SameSite=Lax`) **and** to localStorage. The owner asked for
  localStorage; the cookie is added because only a cookie reaches the server
  before the page renders, which is what avoids a flash of the wrong
  language. Agent's call. It is a strictly necessary preference set on the
  visitor's own request, so it does not wait for analytics consent; the
  cookie policy lists it in every language.
- Detection runs in `src/middleware.ts`, locally (no network, no database —
  hard invariant #2): only on GET requests to an EN storefront path that has
  a translation, only when there is no `ludvik4_lang` cookie, never for bots
  (user-agent check). It reads `Accept-Language` (quality-ordered), and if the
  best supported match is `es` or `ru` it answers `307` to the prefixed URL.
  A Spanish browser that saved "English" stays on English.
- Visiting a prefixed URL does not change the saved choice; only the switch
  does.

## Search

- ES pages: indexable, in the sitemap, with `hreflang` alternates
  `en` / `es` / `x-default` (→ EN) on every translated page.
- RU pages: `noindex, follow`, not in the sitemap, no `hreflang` entry
  (ludvik4.ru is the Russian site in search).
- Canonical of each localized page is itself.

## `<html lang>`

The root layout serves both markets and must not change for the RU build.
The EN build gets a tiny client component that sets `document.documentElement
.lang` from the path (`/es` → `es`, `/ru` → `ru`, else `en`), with an inline
script for the first paint and an effect for client navigations. Agent's
call: the "proper" Next pattern (a `[lang]` root layout) would mean moving the
whole app under new root layouts, which risks the RU export and the 404 page
for a gain Google does not use (it ignores the `lang` attribute; `hreflang`
and content carry the language). Screen readers get the right value.

## Legal pages in Spanish and Russian

Same facts as the English pages (NIF, Spain, IVA, LSSI-CE, RGPD, consumer
rights). Spanish uses the native terms: «Aviso legal», «Política de
privacidad», «Política de cookies», «Condiciones del servicio». No
language-precedence clause is added (agent's call: no legal promise the lawyer
has not seen); lawyer review stays an open item in the roadmap.

## Constraints

- Hard invariants: `<Link>` for internal links, nothing remote in middleware,
  zod on every input (the lead action validates the locale it receives),
  tests proven able to fail, Conventional Commits.
- RU-only code stays out of the EN bundle and EN-only code out of the RU
  export, as today. The new `src/app/[locale]` tree is stashed by
  `scripts/build-ru-static.ts` like the other EN-only routes.
- Project tokens and components only; the switch reuses existing header
  styles.
- Untracked `.glsl`, `images/`, `experiments/`, `.superpowers/` stay untouched.

## Left to the builder

- How the copy modules are split per locale, as long as every locale is
  typed against the English shape so a missing string fails `tsc`.
- Exact wording of every translation, within `docs/rules/content.md`.
- Test layout, as long as: the switch, detection rules, the RU flag, noindex
  on RU, hreflang on ES, and "no Russia-specific words in the RU locale" each
  have a test that can fail.
