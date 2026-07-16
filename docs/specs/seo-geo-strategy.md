# Spec: SEO + GEO (AI-chat) optimization — foundation slice

Strategy approved in chat 2026-07-16. Audience: Russian-speaking, worldwide.
Primary keyword focus (user's pick): the **AI-development niche** — preparing
projects for AI agents, spec-driven development, AI tools, AI-powered
automation. Broad commercial queries («разработка сайтов») stay on the page
but are not the content bet: a new domain cannot win them; the niche it can.

## Problem

ludvik4.dev is a one-page site with a single sitemap URL. It can rank for
the brand query and nothing else, and AI chats (ChatGPT, Gemini, Perplexity)
have almost nothing to cite: no deep content, no llms.txt, no FAQ, no
external mentions. The site is also not registered in Google Search Console
or Yandex.Webmaster, so indexing is invisible and unmanaged. Canonical
points to the apex (`ludvik4.dev`) while production serves on `www` — a
split-signal issue already on the roadmap.

## Scope (this slice — what the agent implements now)

1. **Technical foundation**
   - Search-engine verification slots: env-driven meta tags for Google
     Search Console and Yandex.Webmaster (`layout.tsx` `verification`
     field). The user registers both properties; the agent wires tokens.
   - JSON-LD expansion (`src/app/page.tsx`): add `Organization` and
     `WebSite` nodes alongside `ProfessionalService`; add `knowsAbout`
     (AI agents, spec-driven development, automation), `slogan`, `logo`.
   - `llms.txt` route — markdown summary for LLM crawlers: who Ludvik4 is,
     services, price anchors, links. Served at `/llms.txt`.
   - Keep robots permissive for AI crawlers (GPTBot, ClaudeBot,
     PerplexityBot, Google-Extended) — no blocking rules.
   - Apex-vs-www: user flips the primary domain in Vercel (instruction
     provided); no code change needed (canonical already targets apex).

2. **FAQ section on the landing page**
   - 6–8 questions matching real queries (cost of an MVP, what "preparing
     a project for AI agents" means, what spec-driven development is,
     timelines, process, tech stack ownership).
   - Rendered as an accessible accordion in the existing design tokens,
     placed between pricing and "who is behind this".
   - `FAQPage` JSON-LD emitted from the same data structure (single source
     of truth — the FAQ array).

3. **Blog (`/blog`)**
   - MDX-based, SSG, no DB. `src/content/blog/*.mdx` + list page
     `/blog` + article page `/blog/[slug]`.
   - Per-article `Metadata` (title, description, OG) + `Article` JSON-LD +
     entry in `sitemap.ts` (generated from the content dir).
   - RSS feed at `/blog/rss.xml`.
   - Landing header/footer link to the blog.
   - Design: existing tokens (rose brand, Geist), light theme, same layout
     grid as the landing.

4. **First two articles (agent drafts, user reviews before publish)**
   1. "Как подготовить проект к работе с AI-агентами: AGENTS.md, правила,
      спеки" — the niche's target query, near-zero RU competition.
   2. "Spec-driven development: разработка через спеки на практике".
   - Articles are in Russian (site language). Drafts ship as
     `draft: true` frontmatter — excluded from build/sitemap/RSS until the
     user approves each one.

5. **Playbook for off-site + user actions** (`docs/playbooks/seo-geo.md`)
   - Step-by-step: GSC + Yandex.Webmaster registration, Vercel apex
     switch, Habr/vc.ru brand account + article adaptation rules
     (canonical back to the site), GitHub org + first public repo idea
     (AGENTS.md template), Telegram brand channel, RU studio directories
     list, weekly review additions (GSC/Webmaster reports into the
     existing analytics ritual).

## UX flow

- Landing gains one section (FAQ, accordion — collapsed by default) and a
  "Блог" link in the header/footer.
- `/blog`: list of article cards (title, description, date) — empty state
  impossible (ships with articles; drafts hidden).
- `/blog/[slug]`: article page — typographic content column, back-link to
  the list, CTA block to the contact form at the end.
- Unknown slug → existing `not-found.tsx`.

## Data model

None — no DB. Content is MDX files in the repo; FAQ is a typed array in the
page/feature code.

## Edge cases

- Draft articles (`draft: true`) must not appear in list, sitemap, RSS, or
  be statically generated.
- Missing/malformed frontmatter fails the build (zod-validated at build
  time) rather than silently rendering a broken card.
- Verification env vars unset → no meta tags emitted (slot pattern, same
  as PostHog/Sentry).
- FAQ JSON-LD must stay in sync with visible FAQ — generated from one array.

## Test scenarios

- FAQ renders all questions; accordion expands/collapses (component test).
- FAQ JSON-LD script contains every question in the array (unit).
- Blog list excludes drafts; includes published (unit on the content
  loader).
- Frontmatter validation rejects a fixture with a missing field (unit).
- `/blog/[slug]` renders an article's title + body (component/integration).
- Sitemap includes `/` , `/blog`, and published article URLs only (unit).
- RSS route returns valid XML with published articles (integration).
- llms.txt route returns 200 with expected brand content (integration).
- e2e smoke: landing → FAQ visible; blog link navigates to list → article.

## Out-of-scope (deferred)

- Per-service landing pages (`/uslugi/...`) — phase 2, after first
  articles index.
- English version of the site.
- Actual registration of external accounts (Habr, GitHub org, directories)
  — user actions, guided by the playbook.
- Portfolio/cases section (separate roadmap item).
- Paid promotion of any kind.

## Status

`approved` — design agreed in chat 2026-07-16.
