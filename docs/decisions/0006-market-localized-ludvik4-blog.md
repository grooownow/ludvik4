# ADR 0006: Market-localized Ludvik4 technical blog

## Context

The RU storefront already publishes general articles about AI-assisted
development. The international storefront uses `/guides` for commercial
planning worksheets, while Gridfin has its own product documentation and
guides. New technical topics apply to Ludvik4's delivery practice across
products; publishing them inside Gridfin would incorrectly make one product the
source entity for the studio's general expertise. Keeping the international
storefront without a blog would also prevent the same original article from
serving its English audience on the Ludvik4 domain.

## Options considered

1. **Put every English technical article in `/gridfin/en/guides`** — reuses an
   existing route but conflates studio-wide engineering practice with one
   product and gives unrelated articles a Gridfin product context.
2. **Put general technical articles in `/guides`** — keeps one international
   content index but mixes decision worksheets for prospective clients with a
   different informational and developer intent.
3. **Restore `/blog` as a market-localized Ludvik4 surface** — requires
   localized loading and routes, but preserves clear source ownership and lets
   each build expose only its own language.

## Decision

Both storefronts have a market-localized `/blog`. General engineering articles
belong to Ludvik4 Blog; commercial planning worksheets remain in `/guides`;
Gridfin-specific implementation and product-operation material remains in
`/gridfin/<locale>/guides` or docs.

RU MDX remains at `src/content/blog/*.mdx`; its English counterpart lives at
`src/content/blog/en/*.mdx`. Each market has an independent canonical, sitemap,
RSS feed, and `llms.txt` list. The storefronts remain separate market sources,
so no cross-domain hreflang is introduced.

## Consequences

The international site gains an Articles navigation item and a localized blog
route. Draft state stays independent per language file, although paired
articles should normally be published together. The content loader, sitemap,
RSS, and article UI must always select the current build market; loading the RU
directory in an EN build is a cross-market defect.

The distinction must be maintained during planning: a general comparison such
as instruction-file formats belongs to the blog, while a guide explaining a
Gridfin skill, module, or internal workflow belongs to the product surface.

## Status

`accepted`
