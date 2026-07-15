# Roadmap

Now / Next / Later — the working map for Ludvik4. Keep it short: one line per
item, link out to a doc (`docs/site-v0.md`, `docs/site-v0-setup.md`) instead of
writing detail here.

## Now

MVP shipped and live. Nothing actively in build — polish/ideas phase.

## Next

Scoped and agreed, not yet started:

- **Apex vs www canonical** — make `ludvik4.dev` (apex) the primary domain in
  Vercel so `www` redirects to it, matching the canonical/og:url. Small SEO tidy.
- **Email delivery (Resend)** — wire `RESEND_API_KEY` / `LEAD_EMAIL_*` after
  verifying `ludvik4.dev` in Resend, as a second lead channel beside Telegram
  (see `docs/site-v0-setup.md`).

## Later

Ideas worth keeping, not yet scoped:

- **Portfolio / cases** section (incl. FortNoise) — the deferred V1 cut.
- **Turnstile captcha** on the lead form (`TURNSTILE_*` already supported).
- Blog / short courses (AI & dev topics for beginners).
- English version of the site.
- Lead moderation dashboard (would introduce DB + auth — big lift).

## Shipped

Most recent first:

- **Landing MVP** — one-page Ludvik4 brand site: hero + illustration, services
  catalogue, work formats, how-it-works, pricing, about, contact form → Telegram.
  Rose brand from `design.pen`, SEO (OG/JSON-LD/sitemap), deployed to Vercel on
  `ludvik4.dev`. Source of truth: `docs/site-v0.md`.
- **Onboarding** — `/liftoff` Step 0 (environment verified).
