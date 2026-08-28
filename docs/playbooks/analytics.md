---
title: Analytics — Vercel for traffic, PostHog for behaviour
status: lite
owner: user's agent
---

# Analytics

Two layers on the international storefront: Vercel Web Analytics for traffic
and geolocation, PostHog for named behavioural events. Name events one way,
review them weekly. Analytics here answers two questions: which calls to action
people actually press, and how long they stay before leaving and why.

## Prerequisites

- A free PostHog account (posthog.com) — the project API key is all this
  playbook needs to start.
- The event catalog and its rationale live in `docs/specs/analytics-events.md`;
  the two-vendor split is `docs/decisions/0007-two-layer-analytics.md`.

## Enable the existing slot

`src/components/analytics-provider.tsx` enables PostHog only for the EN build
and only when a key is set. The RU build never initializes PostHog, even if an
old key remains in its deployment environment. With no key set, no
`posthog-js` code loads and no network calls are made.

1. **User does:** create a free PostHog project (posthog.com) and copy the
   project API key.
2. **Agent does:** set `NEXT_PUBLIC_POSTHOG_KEY` —
   - Local: in `.env.local` (the var is documented in `.env.example`).
   - Production: same var in Vercel (`docs/playbooks/deploy.md` step 4),
     then redeploy — `NEXT_PUBLIC_` vars are inlined at build time.
3. Pageviews (including client-side route changes) are captured
   automatically by the provider's init. The `api_host` is PostHog EU cloud
   (`https://eu.i.posthog.com`, where this project lives) — change it in
   the provider if your PostHog project is US-hosted.
4. In PostHog Project Settings → Web analytics, enable **Cookieless server hash
   mode**. The client uses `cookieless_mode: "always"` and
   `person_profiles: "never"`: no analytics cookies/local storage and no
   persistent person profiles. Do not change these settings without reviewing
   the privacy notice and consent requirements.

Custom events never call `posthog.capture` directly. They go through
`track()` in `src/lib/analytics.ts` — one choke point that owns the market/key
guard and keeps `posthog-js` in its own lazily requested chunk. Adding a call
site means adding a name to `ANALYTICS_EVENTS` and calling `track()`; a test
asserts the catalog verbatim, so a rename has to be deliberate.

## The Vercel layer

`src/app/layout.tsx` also renders `<Analytics />` from `@vercel/analytics/next`
on the EN build. It is not a duplicate of PostHog:

- It carries pageviews, referrers, device — and **geolocation**, which PostHog
  cannot see, because cookieless server hash mode strips the IP before
  enrichment runs.
- It sends **no custom events**. The Vercel team is on Hobby, which has none
  ([pricing](https://vercel.com/docs/analytics/limits-and-pricing)). Do not add
  `track()` calls from `@vercel/analytics` — they would be dead code.
- Off Vercel it logs two console errors per page load (`/_vercel/insights/*`
  exists only on a Vercel deployment). Expected; see the comment in
  `layout.tsx` for why it is not gated on `process.env.VERCEL`.

Reasoning behind the split: `docs/decisions/0007-two-layer-analytics.md`.

## Event naming: `area.object_action`

`area` = the slice (`cta`, `lead`, `content`, `nav`, `faq`, `page`);
`object_action` = what happened, past tense: `lead.form_submitted`,
`faq.item_opened`. Lowercase, dots and underscores only. Never rename a shipped
event — old data won't follow; add the new name and retire the old one.

## The shipped events

Wave 1, live on the EN storefront. Full rationale and the deferred wave 2:
`docs/specs/analytics-events.md`.

| Event                      | What counts                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `cta.clicked`              | A contact CTA is pressed. `placement`: nav, nav_mobile, hero, service, form_submit. |
| `contact.telegram_clicked` | A Telegram link is pressed. Shipped before wave 1 — the name is frozen.             |
| `lead.form_started`        | First focus in any form field. Separates "saw the form" from "tried".               |
| `lead.form_submitted`      | A real enquiry landed. Not emitted when the honeypot caught the submission.         |
| `lead.form_failed`         | A rejected attempt, with `reason`: rate_limit, validation, captcha, delivery.       |
| `lead.form_abandoned`      | Started, then left without success. `fields_touched` is a count, never values.      |
| `page.engaged`             | 30s of tab-visible time on one page, once. A background tab accumulates nothing.    |
| `content.scroll_depth`     | 25/50/75/100% seen, once each. Nothing at all on a page that does not scroll.       |
| `nav.outbound_clicked`     | A click to another host. Telegram is excluded — it reports itself.                  |
| `faq.item_opened`          | An FAQ question is opened. A close is not a second open.                            |

Beyond these, posthog-js **autocapture** records every click on every button and
link, and `$pageview`/`$pageleave` carry `$prev_pageview_duration` and
`$prev_pageview_max_scroll_percentage` for free — no code needed.

## What this cannot tell you

Consequences of cookieless mode, so they are not rediscovered as bugs:

- **No session replay.** It needs browser storage, which needs a consent
  banner. The strongest "why did they leave" tool is deliberately not available.
- Unique-visitor counts over more than a day are inflated (the hash salt rotates
  daily), and retention and cohort analysis are not trustworthy.
- No geolocation in PostHog — read it in Vercel instead.

## Weekly review ritual — 3 questions

Same day every week, 15 minutes:

1. **Are people arriving, and from where?** Vercel: pageviews, referrers and
   countries this week vs. last.
2. **Do they engage or bounce?** PostHog: `page.engaged` and
   `content.scroll_depth` against pageviews, plus the web-analytics bounce rate
   and exit paths. Where does attention stop?
3. **Do they ask, and if not, why not?** The funnel `cta.clicked` →
   `lead.form_started` → `lead.form_submitted`, with `lead.form_abandoned` and
   `lead.form_failed`'s `reason` explaining the drop. `faq.item_opened` says
   what was still unclear.

Write one sentence of conclusion per question. If a decision follows (rewrite a
CTA, fix a form gate, answer an FAQ better), record it per `docs/rules/docs.md`.

## Done when

- Clicking through the EN storefront locally with a key set shows the events in
  PostHog's activity view: a CTA press, a scroll to 25%, an FAQ open, a form
  start, and an abandonment on leaving the page.
- Vercel's dashboard shows pageviews for `ludvik4.dev` after a deploy.
