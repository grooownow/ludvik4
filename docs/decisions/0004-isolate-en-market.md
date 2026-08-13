# ADR 0004: Isolate the international market source

- Date: 2026-08-10
- Status: accepted

## Context

The English host published Russian Gridfin pages from shared static assets,
served Russian-oriented `humans.txt` and security canonicals, and redirected
English `/blog/*` requests to `ludvik4.ru`. These signals contradicted the
international positioning and made the `.dev` source ambiguous to buyers,
crawlers, and answer engines.

## Decision

- Keep RU-only static assets under `resources/ru-public/` and copy them only
  after a successful RU static export.
- Generate `humans.txt` and both security-file paths from the active market.
- Do not redirect `.dev/blog*` to the Russian-language domain.
- Publish only evidence that can stand independently for a global audience.
  The qa-pilot case is included; Gridfin and FortNoise are omitted from the EN
  evidence layer until there is a market-safe reason and source context.
- Treat the EN storefront as its own source, not as a translated RU page set.

ADR 0006 later added an EN-native `/blog` while preserving this isolation: it
loads English content from its own directory and never redirects to or renders
the RU article set.

## Consequences

The international host has consistent language, geography, evidence, and
service-file signals. The RU build retains Gridfin and its own service files.
Any historical equity in the `.dev/blog*` redirects is deliberately forgone in
exchange for a coherent international entity and buyer journey.
