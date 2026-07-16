# Plan: seo-geo-strategy

Map of touch-points for `docs/specs/seo-geo-strategy.md`. Short — a map, not
a document.

## New feature slice

- `src/features/blog/` — the blog engine:
  - `index.ts` — public API (`getPublishedArticles`, `getArticleBySlug`,
    `articleFrontmatterSchema`, types).
  - `articles.ts` — fs loader over `src/content/blog/*.mdx`: parse
    frontmatter, zod-validate (build fails on malformed), filter
    `draft: true` out of the published list.
  - `articles.test.ts` — loader unit tests (drafts excluded, malformed
    frontmatter rejected) against fixture files.
- `src/features/faq/` — FAQ single source of truth:
  - `index.ts` — re-exports.
  - `faq-data.ts` — typed array of {question, answer} (6–8 items).
  - `faq-section.tsx` — accordion section (Radix Accordion primitive via a
    new `src/components/ui/accordion.tsx`), emits `FAQPage` JSON-LD from
    the same array.
  - `faq-section.test.tsx` — renders all questions; JSON-LD contains each.

## Content

- `src/content/blog/agents-ready-project.mdx` — draft article 1 (Russian,
  `draft: true`).
- `src/content/blog/spec-driven-development.mdx` — draft article 2
  (Russian, `draft: true`).

## Routes (`src/app/`)

- `src/app/blog/page.tsx` — article list (published only) + metadata.
- `src/app/blog/[slug]/page.tsx` — article page: MDX render, `Article`
  JSON-LD, per-article `generateMetadata`, `generateStaticParams`
  (published only; unknown slug → `notFound()`).
- `src/app/blog/rss.xml/route.ts` — RSS 2.0 XML from published articles
  (XML-escaped).
- `src/app/llms.txt/route.ts` — markdown brand summary for LLM crawlers.
- `src/app/sitemap.ts` — add `/blog` + published article URLs.
- `src/app/page.tsx` — insert `<FaqSection>` between pricing and "who is
  behind this"; expand JSON-LD to `@graph` (`Organization`, `WebSite`,
  `ProfessionalService` with `knowsAbout`/`slogan`); add "Блог" link to
  header + footer.
- `src/app/layout.tsx` — `verification` metadata field (Google + Yandex),
  env-driven slots.

## Env vars (three-part rule in docs/rules/security.md)

- `GOOGLE_SITE_VERIFICATION` (optional) — GSC meta-tag token.
- `YANDEX_VERIFICATION` (optional) — Yandex.Webmaster meta-tag token.
  Both server-side only (metadata is rendered server-side), registered in
  `src/lib/env.ts` + `.env.example`; unset → no meta tag emitted.

## Dependencies

- MDX rendering in RSC: `next-mdx-remote-client` (or `next-mdx-remote`
  /rsc) + `gray-matter` for frontmatter. Exact package verified against
  current docs (docs/rules/sources.md) before install in Step 3.
- Accordion: `radix-ui` is already a dependency — add shadcn-style
  `accordion.tsx` to `components/ui`.

## Docs

- `docs/playbooks/seo-geo.md` — user-facing playbook: GSC + Yandex
  registration, Vercel apex switch, Habr/vc.ru, GitHub org, Telegram
  channel, directories, weekly review additions.
- `docs/decisions/` — ADR-lite for the MDX library pick (Step 7).

## No schema changes, no middleware changes, no auth surface

Static content only; the lead form is untouched.

## Test placement (per docs/rules/testing.md decision table)

- Unit: article loader (drafts, validation), sitemap entries, RSS/llms
  content generation helpers.
- Component: FAQ section render + JSON-LD sync.
- Integration (route): rss.xml and llms.txt handlers return 200 + expected
  body.
- e2e smoke: landing shows FAQ; header blog link → list → article page.

## Open decisions

(all settled: file layout fixed by spec; FAQ placement fixed by spec; MDX
library choice is an implementation pick recorded as an ADR, not a
behavioral fork)

NO UNRESOLVED DECISIONS
