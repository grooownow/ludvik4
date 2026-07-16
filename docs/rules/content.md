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
8. **Keywords with intent.** Every article targets one query cluster from
   the niche (AI-агенты, AGENTS.md, spec-driven development, автоматизация,
   MVP) — naturally, in headings and the opening paragraph.

## Language & positioning

- Articles are Russian (the site's language) — the one exception to the
  repo-is-English rule, alongside `docs/site-v0.md`. Tech terms and product
  names stay in their original form; linking English-language primary
  sources is fine and expected.
- Team voice («мы»), no personal names, no location disclosure
  (`docs/site-v0.md` → Позиционирование). Every article ends with a CTA
  linking `/#contact`.

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
- [ ] CTA to `/#contact` present; no names/location leaked
