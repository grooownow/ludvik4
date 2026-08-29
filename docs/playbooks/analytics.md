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

## Consent, and what each state can tell you

The EN site asks for cookies with a banner, and consent is an upgrade rather
than a gate (`docs/decisions/0008-consent-as-an-upgrade.md`):

| Visitor state      | What you get                                                                       |
| ------------------ | ---------------------------------------------------------------------------------- |
| Ignored the banner | Cookieless analytics. No storage, no profile. This is most of your traffic.        |
| Declined           | The same, and the banner does not come back.                                       |
| Allowed cookies    | A stable visitor id — so uniques and retention are real — plus **session replay**. |

For the cookieless majority, know what the numbers cannot say:

- Unique-visitor counts over more than a day are inflated (the hash salt rotates
  daily), and retention and cohort analysis are not trustworthy. Consenting
  visitors are exempt.
- No geolocation in PostHog — read it in Vercel instead. This does not change
  with consent; the IP is stripped before enrichment either way.
- Session replay exists only for consenting visitors, and never records what
  anyone typed into the contact form — inputs are masked.

Visitors can withdraw at any time from the footer control on any page, which
clears the choice, stops replay and brings the banner back.

## The dashboard

One pinned dashboard answers most of it, so the weekly review is a read rather
than a query-building exercise:

**https://eu.posthog.com/project/225446/dashboard/922602** — "Ludvik4 — behaviour"

Nine tiles, top to bottom as one visit: arrivals, the enquiry funnel, engaged
versus bounced, where scrolling stops, why the form rejects people, started-but-
never-sent, which FAQ entries get opened, where visitors leave to, and which
contact control gets pressed.

It is built by `scripts/build-posthog-dashboard.ts` rather than by hand, so it
can be changed in review and rebuilt. Re-running reuses the dashboard of the
same name instead of creating a second one. The script needs a PostHog personal
API key (Insight:Write, Dashboard:Write, Query:Read) in `.env.local`:

```bash
set -a; . ./.env.local; set +a
pnpm tsx scripts/build-posthog-dashboard.ts
```

Query shapes in the script were read back from the project's own existing
insights, not copied from documentation — the API reference for insight queries
is truncated, and the schema is version-specific.

Geography is the one thing the dashboard cannot show: cookieless server hash
mode strips the IP before enrichment, so countries live in Vercel Analytics.

## Muting your own devices

You are the heaviest visitor of your own site — the first traffic audit found
36 of 73 sessions were yours — and cookieless mode leaves nothing to filter
them out by afterwards: PostHog's own internal-user filtering keys on person
properties, and this project creates no persons. So the browser has to say so
itself.

Open any page with the parameter, once per browser:

```
https://ludvik4.dev/?ludvik4_internal=1   # stop counting this browser
https://ludvik4.dev/?ludvik4_internal=0   # start counting it again
```

A bar confirms in words which of the two just happened — deliberately visible
rather than a console line, because the device this exists for is usually a
phone, where there is no console to read.

Three things follow from where the answer is stored (`localStorage`, key
`ludvik4:internal`):

- **Per browser and per device.** The laptop and the phone are two separate
  decisions, and so are Safari and Chrome on the same phone. Do it once in
  each browser you actually browse the live site from.
- **Per origin.** Muting `ludvik4.dev` says nothing about `ludvik4.ru` — which
  costs nothing, since the RU storefront runs no analytics at all.
- **Lost when site data is cleared**, or in a private window. Re-open the link
  if you have wiped storage.

It silences both layers: PostHog (through `analyticsEnabled()`, so events,
consent and replay all stop together) and Vercel Web Analytics (through
`beforeSend` returning `null` in `src/components/vercel-analytics.tsx`). A
muted browser is also never asked for cookie consent, since there is nothing
left to consent to.

**Sentry is deliberately not muted.** An error you hit yourself is still a real
error, and it carries no visitor identity to skew.

When you are testing analytics changes from your own machine and want your
events to show up, turn it off for that session with `?ludvik4_internal=0` and
back on when you are done.

## Error monitoring

Sentry (org `ludvik4`, project `ludvik4-site`) carries errors, not behaviour.
The `sentry` CLI reads it:

```bash
set -a; . ./.env.local; set +a
export SENTRY_FORCE_ENV_TOKEN=1
sentry issue list ludvik4/ludvik4-site --query "is:unresolved"
sentry issue view LUDVIK4-SITE-1
```

`SENTRY_AUTH_TOKEN` is an internal-integration token scoped to the org, with
Issue & Event and Alerts read+write. Sentry has no project-level token — org is
the narrowest scope it offers — so the token also covers the other project in
that org. It is disclosed as a processor in `/privacy` section 4.

**An empty `issue list` does not mean zero live issues.** The list is an event
search: a group whose events have aged out of retention has no `lastSeen`, so it
matches no time window and silently drops out — while its status stays
`unresolved`. `LUDVIK4-SITE-1` sat that way for weeks. Count live issues against
the status instead, which has no period filter:

```bash
sentry api "/api/0/projects/ludvik4/ludvik4-site/issues/?query=is:unresolved&limit=100"
```

The org-wide view (`/api/0/organizations/ludvik4/issues/?statsPeriod=90d`) also
returns `pawfile-web`, the other project the org token reaches — read the
`project.slug` before acting on anything there.

Before blaming a server error on a real visitor, read the request headers on the
event. A hand-rolled `multipart/form-data` boundary, `Accept: */*`, a lone
`Accept-Encoding: gzip`, `Connection: close`, a stale browser UA, or a hosting-AS
`X-Vercel-Ip-*` block all say scanner. Archive those **until a user is
affected** rather than filtering them in code: the affected-user count is what
separates a bot from a genuine regression, and a code filter erases it.

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
