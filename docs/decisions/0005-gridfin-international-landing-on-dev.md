# ADR 0005: Serve the international Gridfin landing on ludvik4.dev

- Date: 2026-08-11
- Status: accepted (EN live 2026-08-11; all five translated locales live later the same day)
- Amends: ADR 0004 (the Gridfin carve-out only; every other 0004 rule stands)

## Context

The Gridfin landing is built in `grooownow/gridfin` (`marketing/landing/`)
for seven locales. Only `ru` is published (`ludvik4.ru/gridfin/`), yet its
hreflang block has advertised `ludvik4.dev/gridfin/<locale>` alternates since
launch — six URLs that answer 404. ADR 0004 removed RU-oriented Gridfin
content from the EN host but left no home for the international locales; the
author has now decided they belong on `ludvik4.dev/gridfin`.

## Decision

- The first international bundle (EN only, root redirect, EN sitemap and
  shared assets) is committed under `public/gridfin/` and served natively
  by the EN Vercel app. ludvik4 keeps holding built output only — the source
  of truth stays in `grooownow/gridfin`.
- Directory URLs resolve via `afterFiles` rewrites (`config/rewrites.ts`),
  EN market only. URL style is slashless (`/gridfin/en`):
  the EN app keeps Next's default `trailingSlash=false`, and overriding it
  globally would change routing for every already-indexed studio page. RU
  keeps directory-index URLs on its own static host.
- Additional translated locales stay unpublished until their copy receives
  a market-quality review; the EN sitemap must not advertise them early.
  (Resolved 2026-08-11: the MT locales were refreshed from the final EN
  source, i18n:check green, and published together with the full sitemap —
  advertised ⇔ deployed is now enforced by `src/app/sitemap.test.ts`.)
- The RU static export stashes `public/gridfin` for the duration of the
  build (`scripts/build-ru-static.ts`), so the international bundle can
  never leak onto `ludvik4.ru`, whose `/gridfin/` remains the RU bundle from
  `resources/ru-public/`.
- Publication is gated on the author's reworked EN texts: until a bundle is
  committed the rewrites resolve to nothing and `/gridfin*` on `.dev` stays 404. Publishing = rebuild in `grooownow/gridfin` → copy the root redirect,
  `dist/en/`, shared assets and the EN-only sitemap into `public/gridfin/` →
  commit. The generator must emit slashless canonicals/hreflang for the EN
  locale before the first publication.

## Consequences

- The EN↔RU hreflang contract becomes honest once the bundle lands, and
  `ludvik4.ru/gridfin/`'s own hreflang
  gets regenerated (slashless dev URLs) on its next rebuild.
- ADR 0004's "Gridfin omitted from the EN evidence layer" softens for this
  surface only: the landing is the product's own page in the visitor's
  language, not RU content leaking through shared assets.
- Two publish flows now exist deliberately: RU via `resources/ru-public/` +
  static export, international via `public/` + Vercel. The asymmetry mirrors
  the two hosting models and is documented in both repos' runbooks.
