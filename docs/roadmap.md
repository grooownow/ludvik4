# Roadmap

Now / Next / Later — the working map for Ludvik4. Keep it short: one line per
item, link out to a doc (`docs/site-v0.md`, `docs/site-v0-setup.md`) instead of
writing detail here.

## Now

SEO/GEO rollout — code shipped, first two articles LIVE (2026-07-16:
`/blog/agents-ready-project`, `/blog/spec-driven-development`). Remaining
moves, guided by `docs/playbooks/seo-geo.md`:

- **[DONE 2026-07-16] Search consoles** — GSC + Yandex.Webmaster verified for
  `https://ludvik4.dev` (HTML tag / meta tag), `GOOGLE_SITE_VERIFICATION` +
  `YANDEX_VERIFICATION` wired in Vercel (Production + Preview), redeployed,
  `sitemap.xml` submitted in both. GSC indexing requested for both live
  articles.
- **[DONE 2026-07-16] Apex vs www canonical** — `ludvik4.dev` is now the
  primary domain in Vercel; `www.ludvik4.dev` 308-redirects to it.
- **Off-site distribution** — plan: `docs/playbooks/distribution.md` (agent
  drafts per-platform adaptations → coworker publishes). Status (2026-07-19):
  vc.ru article 1 LIVE (2 comments, 2 likes); Habr article 1 on moderation;
  Telegram deferred (no audience — using X for quick announces instead);
  Reddit ruled out for RU content. GitHub `github.com/grooownow` owns the
  repo. **[COWORKER]** publish adaptations per the matrix; **[AGENT]** draft
  Habr/vc.ru/Дзен/X adaptations for each published article.
- **[AGENT, on go-ahead]** first public repo on `github.com/grooownow`: an
  AGENTS.md-template matching article 1 (needs explicit go-ahead — new
  public content).
- **[AGENT, on go-ahead] Per-article OG covers** — generate share images
  from article titles; agreed to do before distributing to Telegram/Habr.
- **Semantic core + content plan** (2026-07-19) — DONE: 44-query scored core
  (`docs/seo-core.md`), priority recalibrated by winnability, and
  `docs/content-plan.md` (topic clusters: pillar + supporting, cross-linked,
  publishing queue in waves). Method: `docs/specs/seo-core-research.md`; audit
  that triggered this: `tmp-review/seo-audit.md`. **Wave 1 (2/3 done
  2026-07-19):** `/blog/github-spec-kit` (SDD), `/blog/agents-md-primer`
  (AGENTS.md). **Next:** cursor rules (last Wave 1), then per-platform
  adaptations for the coworker (`distribution.md`). Deferred: commercial-intent
  pull for `/uslugi/...` service pages (Layer 2, C8–C10 not yet pulled).

## Next

Scoped and agreed, not yet started:

- **Email delivery (Resend)** — wire `RESEND_API_KEY` / `LEAD_EMAIL_*` after
  verifying `ludvik4.dev` in Resend, as a second lead channel beside Telegram
  (see `docs/site-v0-setup.md`).
- **Per-service landing pages** (`/uslugi/...`) — phase 2 of the SEO spec,
  one page per query cluster, after the first articles index.

## Later

Ideas worth keeping, not yet scoped:

- **Portfolio / cases** section (incl. FortNoise) — the deferred V1 cut.
- **Turnstile captcha** on the lead form (`TURNSTILE_*` already supported).
- Short courses (AI & dev topics for beginners).
- English version of the site.
- Lead moderation dashboard (would introduce DB + auth — big lift).

## Shipped

Most recent first:

- **First two articles published** (2026-07-16) — AI-agents readiness +
  spec-driven development, rewritten to `docs/rules/content.md` standards
  (primary sources: agents.md, AWS Kiro, GitHub Spec Kit). Blog footer
  layout fix rode along.
- **SEO/GEO foundation** — FAQ section (+FAQPage schema), MDX blog with RSS
  and sitemap, llms.txt, Organization/WebSite JSON-LD graph, search-console
  verification slots, `docs/playbooks/seo-geo.md`.
  Spec: `docs/specs/seo-geo-strategy.md`.
- **Landing MVP** — one-page Ludvik4 brand site: hero + illustration, services
  catalogue, work formats, how-it-works, pricing, about, contact form → Telegram.
  Rose brand from `design.pen`, SEO (OG/JSON-LD/sitemap), deployed to Vercel on
  `ludvik4.dev`. Source of truth: `docs/site-v0.md`.
- **Onboarding** — `/liftoff` Step 0 (environment verified).
