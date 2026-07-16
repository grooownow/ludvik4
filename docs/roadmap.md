# Roadmap

Now / Next / Later — the working map for Ludvik4. Keep it short: one line per
item, link out to a doc (`docs/site-v0.md`, `docs/site-v0-setup.md`) instead of
writing detail here.

## Now

SEO/GEO rollout — code shipped, first two articles LIVE (2026-07-16:
`/blog/agents-ready-project`, `/blog/spec-driven-development`). Remaining
moves, guided by `docs/playbooks/seo-geo.md`:

- **[USER] Search consoles** — register Google Search Console +
  Yandex.Webmaster, hand tokens to the agent (it wires
  `GOOGLE_SITE_VERIFICATION`/`YANDEX_VERIFICATION` in Vercel + redeploy),
  then submit `sitemap.xml` in both.
- **[USER] Apex vs www canonical** — make `ludvik4.dev` (apex) the primary
  domain in Vercel so `www` 308-redirects to it.
- **[USER] Off-site start** — Telegram brand channel, Habr account + first
  adapted article, GitHub org with an AGENTS.md-template repo.
- **[AGENT, on go-ahead] Per-article OG covers** — generate share images
  from article titles; agreed to do before distributing to Telegram/Habr.

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
