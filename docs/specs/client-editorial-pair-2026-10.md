# Client-facing editorial pair — 2026-10-12

## Brief and status

**Status: four complete drafts; publication pending editorial approval.**

The user requested two additional topics in Russian and English for prospective
website and small-web-app clients, explicitly delegating topic and style
selection. They asked for business explanations of price, delivery value,
systematic engineering and design, and the comparison with a quick AI-built
result. This request supersedes the legacy IT-audience default for these two
articles. It does not request an external publication or social distribution.

## Audience questions and selection

Relevant buyer questions include what a quote buys, why similar-looking products
have different prices, whether DIY AI work is sufficient, who can maintain the
result, and what happens after launch. No audience interviews or search-volume
measurement were conducted; these priorities come from the user's brief,
existing content gaps and a qualitative search-result review.

1. **Quote composition:** connects discovery, coherent design, complete behaviour,
   verification and handover to the estimate. Existing RU landing/MVP price
   articles already cover format-specific rates and stages; this article
   instead compares commitments, responsibilities and running costs. No new
   public rate, percentage allocation or invented delivery metric is introduced.
2. **DIY AI versus professional help:** explains when a simple self-managed page
   or fictional-data experiment can be sufficient, and how to evaluate readiness
   for real use. Quality is expressed through observable behaviour, design
   consistency, data/access checks, changeability and handover. Human-written
   code and a higher price are never treated as automatic evidence of quality.

Both articles use hypothetical appointment/order examples, clearly identified
as examples rather than client cases. The English versions use first-person
singular only for Ludvik4's delivery; they contain no RU price anchors, Russian
commercial links or cross-domain market associations.

## Placement and release boundaries

These are prose essays in the existing market-localized `/blog`; `/guides`
retains its worksheet role. No route, component, loader, schema or interface
behaviour is changed. The established MDX mapping preserves internal Link
navigation. The shared image for each pair has localized alt text.

All four MDX files are drafts. Their provisional slots are 12 and 13 October;
replace them with actual dates at publication. This meets the existing
one-Russian-article-per-calendar-date contract without backdating publication.
No merge, production push, console indexing or social posting is performed
in this writing session.

## Source verification — this session

Search-result review informed topic selection only; competing articles were not
used as sources for copy or market-price claims. Primary sources linked in both
language versions:

- [W3C WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/): contrast,
  keyboard use, field labels and error identification. Neither article claims
  certification or complete conformance.
- [Claude Code overview](https://code.claude.com/docs/en/overview): coding-agent
  work with project files and commands. No version-specific tutorial is included.
- [OWASP ASVS](https://owasp.org/projects/asvs): application-security verification
  requirements. No assurance or guarantee is inferred from naming the standard.
- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide):
  technical search foundations and the absence of an indexing guarantee.

Local service composition was checked against `src/features/site/content.ts`,
`src/features/site/international-content.ts` and
`docs/marketing/en/product-canon.md`.

## Artifacts

- RU/EN MDX: `src/content/blog/[en/]what-development-quote-pays-for.mdx` and
  `src/content/blog/[en/]ai-website-diy-or-developer.mdx`.
- Cover sources: `src/content/blog/<slug>/card.png`; served versions:
  `public/blog/<slug>/card.jpg`, 1600 × 900, under 250 KB each.
- Review copies: `tmp-review/what-development-quote-pays-for.ru.md`, `.en.md`,
  `tmp-review/ai-website-diy-or-developer.ru.md`, `.en.md` (git-ignored).

## Validation

| Gate          | Command / scope                     | Result | Evidence                                                        |
| ------------- | ----------------------------------- | ------ | --------------------------------------------------------------- |
| Lint          | `pnpm lint`                         | PASS   | `All matched files use Prettier code style!`; exit 0            |
| Unit/int      | `pnpm test`                         | PASS   | `Test Files  60 passed (60)`; `Tests  490 passed (490)`         |
| E2E           | `pnpm test:e2e`                     | PASS   | `38 passed (13.1s)`                                             |
| RU build      | `pnpm build`                        | PASS   | `Compiled successfully in 587ms`; static pages `49/49`; exit 0  |
| EN build      | `SITE_MARKET=en pnpm build`         | PASS   | `Compiled successfully in 1695ms`; static pages `34/34`; exit 0 |
| Skill harness | No skill, rule or entry-map changes | N.A.   | The final diff does not touch the harness-triggering paths      |
| Browser smoke | Both articles × RU/EN × 1280/375px  | PASS   | `status: 200`, `overflow: false`, covers and CTA present        |

The first E2E attempt stopped during type checking because a temporary
validation script under `tmp-review/` was included by the repository's
TypeScript glob. The script was removed after use; type checking and the full
E2E suite then passed. No application fix was necessary.

Both market previews retained client-side navigation between the articles
(`spa: true`) and had no page errors. Console checks after navigation returned
zero error messages. A development HMR connection failed during the deliberate
server restart between markets; it was absent from the subsequent page checks.
Screenshots are in `tmp-review/<slug>.<ru|en>.<1280|375>.png`.

The brief preview used temporary `draft: false` flags locally, then restored all
four to `draft: true` before the EN build and commit. Published-content loading
was checked to exclude both slugs in each market. All internal links resolve to
the appropriate local articles, service pages or guides; covers are 122,663 and
142,037 bytes. No new behaviour or permanent tests were added for this content
change. Existing article validation and draft-isolation tests are exercised by
the suite.

Gates are green. Editorial review and publication remain separate from this
verification; the public sites have not been changed by this session.
