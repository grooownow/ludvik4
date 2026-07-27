# Rule: Content (blog articles)

**Applies to:** any blog article (`src/content/blog/*.mdx`) — writing,
editing, reviewing, or publishing one.

Articles are the SEO/GEO engine (see `docs/specs/seo-geo-strategy.md`):
credibility and depth matter more than cadence. These standards came from
the user's review of the first two articles — they are the bar, not
suggestions.

## Editorial standards

1. **Definition first, stated positively.** Open with what the thing IS —
   what kind of approach/tool, created for what purpose. Never define
   through negation («не ТЗ и не тикет» is banned phrasing).
2. **Primary sources, verified.** Where a term or approach was first coined
   or fixed gets a link to the original article/announcement (vendor blog,
   standard's site, canonical repo). Verify names and dates by search in
   the current session — never from model memory (`docs/rules/sources.md`
   applies to prose too).
3. **No invented specifics.** Sizes, durations, counts vary by context —
   state the invariant (composition, structure), not a made-up number
   («документ на полэкрана» is the canonical counter-example).
4. **Audience: IT people.** No dumbing down, no marketing fluff. Flowing
   explanation: what it is → examples → how it works in real life → what
   makes it special → how it differs from alternatives.
5. **Name the alternatives.** A comparison section names the concrete
   neighbouring approaches (ТЗ/waterfall, user stories, TDD/BDD, vibe
   coding, …) — «отличается от других» without naming them is filler.
6. **State relations explicitly.** Don't imply context (e.g. relevance to
   LLMs/agents) — say it in the definition.
7. **Nothing is «once and done».** Setup/process claims reflect reality:
   frameworks get established «за раз», then grow with the project.
8. **Keywords with intent.** Every article binds to a **specific target
   query from the semantic core** (`docs/seo-core.md`) via `docs/content-plan.md`
   — not a topic in general. Target that query naturally in the H1 and opening
   paragraph, and add the internal links its content-plan row specifies
   (supporting → pillar, pillar ↔ pillar). No article ships without a core
   query behind it.

## Language & positioning

- Articles are Russian (the site's language) — the one exception to the
  repo-is-English rule, alongside `docs/site-v0.md`. Tech terms and product
  names stay in their original form; linking English-language primary
  sources is fine and expected.
- Neutral voice by default, consistent with the RU storefront: describe the
  work and result without inventing a permanent team. First person singular is
  allowed where authorship matters; avoid team voice («мы»). No personal names
  or location disclosure (`docs/site-v0.md` → Позиционирование). Every article
  ends with a CTA linking `/#contact`.

## Cover image

Every article gets one on-brand cover card. The goal is a picture on every
article; it stays technically optional (no `cover` → article renders without a
hero, default OG).

- **Where:** the web-optimised copy at `public/blog/<slug>/card.jpg` (the site
  serves it). The full-resolution source lives beside the article in
  `src/content/blog/<slug>/card.png` (the coworker attaches that to social
  posts). See `src/content/blog/README.md` for the per-article layout.
- **Format:** 16:9 (~1600×900), JPEG/WebP up to ~250 KB for the web copy.
  Optimise from the source, e.g. `sips -Z 1600 -s format jpeg -s formatOptions
80 <src>.png --out public/blog/<slug>/card.jpg`.
- **Source:** generated or free-licensed; brand style (rose palette); no
  copyright, watermarks or third-party logos; on-topic.
- **Frontmatter:** `cover: /blog/<slug>/card.jpg` **plus** `coverAlt` (a
  meaningful description — a11y + SEO). `cover` without `coverAlt` fails the
  build (zod refine).

When set, the cover is wired automatically: article hero, `/blog` list
thumbnail, OG/Twitter share image, and the Article JSON-LD `image`.

## Publishing flow

1. Draft ships with `draft: true` — invisible in list/sitemap/RSS/llms.txt.
2. Review copies for the user: `.md` copies in `<repo>/tmp-review/`
   (git-ignored) — give full paths, never auto-open files.
3. User approves → flip `draft: false`, run gates, push. The article enters
   list, sitemap, RSS and llms.txt automatically.
4. After deploy: request indexing in Search Console (see
   `docs/playbooks/seo-geo.md` §3).

## Gates (self-check before done)

- [ ] Opening paragraph defines the subject positively, with its purpose
- [ ] Every historical/factual claim has a verified primary-source link
- [ ] Comparison section names concrete alternatives
- [ ] Frontmatter valid (`title`, `description`, `date`, `draft`) — the
      build fails on malformed frontmatter, don't rely on that as review
- [ ] Cover: `cover` + `coverAlt` set (or intentionally none) — on-brand 16:9,
      optimised to `public/blog/<slug>/card.jpg`
- [ ] CTA to `/#contact` present; no names/location leaked
