# ADR 0002: Blog MDX rendering via next-mdx-remote-client

## Context

The SEO/GEO slice (`docs/specs/seo-geo-strategy.md`) adds a blog whose
articles live as `src/content/blog/*.mdx` files with frontmatter, rendered
statically by the App Router. The spec fixes the file layout; a rendering
library still had to be chosen.

## Options considered

1. **`@next/mdx` (route-file MDX)** — articles become
   `app/blog/<slug>/page.mdx` route files. Zero-runtime and official, but
   content moves into `app/`, frontmatter needs extra remark plugins, and
   the list/RSS/sitemap would need a separate hand-maintained registry that
   can silently drift from the actual files.
2. **`next-mdx-remote` (hashicorp)** — the classic content-dir approach,
   but its RSC support predates the maintained fork and the package is in
   maintenance mode.
3. **`next-mdx-remote-client`** — maintained successor built for RSC
   (`next-mdx-remote-client/rsc` `MDXRemote`), verified against its current
   docs this session (Context7 `/ipikuka/next-mdx-remote-client`). Pairs
   with `gray-matter` so one fs loader feeds the list page, article pages,
   RSS, sitemap and llms.txt from the same source of truth.

## Decision

Use `next-mdx-remote-client/rsc` + `gray-matter` over a single fs loader in
`src/features/blog/articles.ts` (zod-validated frontmatter, `draft` gating).

## Consequences

- One loader is the single source of truth — list, article pages, RSS,
  sitemap and llms.txt can never disagree about what is published.
- Content stays in `src/content/blog/` — adding an article is one file, no
  registry edit; malformed frontmatter fails the build via the zod schema.
- MDX is compiled at build time per article page; `dynamicParams = false`
  keeps the fs loader out of runtime serverless paths.
- Imports/exports inside article MDX are not enabled (plain content only);
  enabling them later is a library option, not a migration.

## Status

`accepted`
