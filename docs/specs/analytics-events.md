# Spec: analytics event layer — ludvik4.dev

## Problem

The international storefront cannot answer two questions its owner needs
answered. Which calls to action do visitors actually press? And how long do they
stay, at what point do they leave, and for what visible reason?

Commit `557a2db` moved PostHog to the EN build in cookieless mode
(`cookieless_mode: "always"`, `person_profiles: "never"`) and rewrote both
`docs/legal/privacy-notice-en.md` and `/privacy` to cover it, so the legal
groundwork exists. What does not exist is any measurement built on top of it —
and, as recorded below, the pageview capture that everything else derives from
is silently broken for client-side navigation.

## Scope

`ludvik4.dev` (`SITE_MARKET=en`) only.

Out of reach by construction: the RU storefront never initializes PostHog
(`shouldLoadPostHog` returns `true` for `en` only) and cannot host Vercel's
script from Timeweb; the Gridfin landing under `/gridfin/*` is a static bundle
owned by `grooownow/gridfin`.

Touches: `src/lib/analytics.ts`, `src/components/analytics-provider.tsx`,
`src/components/telegram-link.tsx`, `src/app/layout.tsx`,
`src/features/site/site-chrome.tsx`, `src/features/site/home-en.tsx`,
`src/features/site/international-pages.tsx`, `src/features/lead/lead-form.tsx`.
No routes, no tables.

### Two layers, different jobs

|               | Vercel Web Analytics                                          | PostHog                                    |
| ------------- | ------------------------------------------------------------- | ------------------------------------------ |
| Role          | traffic baseline                                              | behaviour and named events                 |
| Plan          | Hobby, free, 50k events/month                                 | free tier                                  |
| Provides      | pageviews, referrers, **geolocation**, device, 1-month window | events, funnels, paths, scroll, dwell time |
| Custom events | none — Hobby has no custom events                             | yes                                        |

The geolocation column is not duplicated work. PostHog's cookieless server hash
mode strips the IP address before enrichment runs, so GeoIP does not populate.
Vercel closes exactly that gap, at no cost, on the plan the project already has.

Sources (per `docs/rules/sources.md` — verified this session, not remembered):

- Web Analytics plan limits, Hobby shows `-` for Custom Events:
  https://vercel.com/docs/analytics/limits-and-pricing
- App Router integration (`@vercel/analytics/next` in the root layout; Analytics
  must be enabled in the project dashboard first):
  https://vercel.com/docs/analytics/quickstart
- Cookieless mode strips IP before GeoIP and bot detection:
  https://vercel.com/docs/analytics/privacy-policy and
  https://posthog.com/tutorials/cookieless-tracking
- Bounce definition (one pageview, no autocaptures, under ten seconds):
  https://posthog.com/docs/web-analytics/dashboard

### Prerequisite fix: client-side pageviews are not captured

`src/components/analytics-provider.tsx` claims in a comment that posthog-js
captures pageviews "incl. client-side route changes ... out of the box". That is
not true for the installed version. Read from the shipped bundle,
`node_modules/posthog-js/dist/module.js` at `posthog-js@1.398.2`:

```
capture_pageview: !t || "2025-05-24" > t || "history_change"
capture_pageleave: "if_capture_pageview"
```

With no `defaults` option passed, `capture_pageview` resolves to `true`, which
captures the initial document load only. Every subsequent `<Link>` navigation —
which is all internal navigation in an App Router site — goes unrecorded, and
`$pageleave` disappears with it, taking dwell time and scroll depth along.

This is fixed first. Nothing else here measures anything real until it is:
dwell time, scroll depth, bounce rate and exit paths all derive from the
`$pageview`/`$pageleave` pair. The stale comment is corrected in the same edit.

## UX flow

There is no user-facing surface. The visitor's path is unchanged; every state
below is invisible to them, and that is an acceptance criterion in itself — no
layout shift, no blocking script, no interaction delay.

The measured path through the EN storefront:

1. Visitor lands → `$pageview` fires. Vercel's script records the same visit
   with geolocation.
2. They scroll → `content.scroll_depth` at each of 25/50/75/100%, once each.
3. They stay with the tab visible for 30 cumulative seconds → `page.engaged`,
   once. Backgrounding the tab pauses the accumulator.
4. They press a call to action → `cta.clicked`, or `contact.telegram_clicked`
   for the three Telegram links.
5. They focus the lead form → `lead.form_started`. Submitting gives
   `lead.form_submitted`, a rejected submit gives `lead.form_failed`, leaving
   without submitting gives `lead.form_abandoned`.
6. They navigate internally → `$pageleave` closes the previous page with its
   duration and max scroll; a fresh `$pageview` opens the next.
7. They leave to an external host → `nav.outbound_clicked`.

**Failure state:** with no `NEXT_PUBLIC_POSTHOG_KEY`, none of it runs — no
posthog-js chunk is requested, no network call is made, and every `track()` call
is a no-op. The site must be fully functional in that state; analytics is never
a dependency.

## Data model

No schema change. No table, no migration, no new env var — the two that matter
(`NEXT_PUBLIC_POSTHOG_KEY`, `SITE_MARKET`) already exist and are already
documented.

The "data model" that does change is the event catalog, which lives as
constants in `src/lib/analytics.ts` so a test can assert it rather than chasing
string literals across call sites.

### Named events — wave 1

Naming follows `docs/playbooks/analytics.md`: `area.object_action`, lowercase,
past tense.

Autocapture (on by default in posthog-js) keeps the long tail of "what do people
click at all". Named events exist only where a click carries business meaning
and has to stay readable in a funnel. The EN storefront has eight such controls,
split across two event names:

- `cta.clicked` covers five — the nav CTA on desktop, the nav CTA in the mobile
  menu, the hero CTA, the service-page CTA, and the lead-form submit button.
  `placement` is one of `nav`, `nav_mobile`, `hero`, `service`, `form_submit`;
  `target` is `contact` for the four anchor CTAs and `lead_form` for the submit.
- `contact.telegram_clicked` covers the remaining three — the Telegram links in
  the header, the home contact block, and the footer. It already ships in
  production and keeps its existing name and `placement` values. The playbook
  forbids renaming a live event: old data does not follow.

| Event                  | Properties                                  | What it answers                                                                             |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `cta.clicked`          | `placement`, `target`                       | Which call to action gets pressed, and where on the page                                    |
| `lead.form_started`    | `path`                                      | Separates "saw the form" from "tried to fill it"                                            |
| `lead.form_submitted`  | `path`                                      | Completed enquiries                                                                         |
| `lead.form_failed`     | `reason` (`validation`\|`server`)           | Whether the form itself is losing people                                                    |
| `lead.form_abandoned`  | `path`, `fields_touched` (count, not names) | Started, then left without submitting — the direct answer to "why do they leave"            |
| `page.engaged`         | `path`                                      | Fires once at 30s of _active_ time (tab visible). Separates "opened and closed" from "read" |
| `content.scroll_depth` | `path`, `depth` (25\|50\|75\|100)           | Where attention stops on a page                                                             |
| `nav.outbound_clicked` | `host`                                      | Exits to Gridfin/GitHub — a departure that is not a bounce                                  |
| `faq.item_opened`      | `question`                                  | Which questions are unclear, and therefore why visitors do not convert                      |

`content.scroll_depth` deliberately duplicates information PostHog already
attaches to `$pageleave`. Mobile Safari drops `beforeunload` often enough that
milestone events are the durable record; the `$pageleave` property is the
convenient one.

### Free once the prerequisite fix lands

No custom code produces these; they are properties of `$pageview`/`$pageleave`,
confirmed against `PageViewEventProperties` in the installed package's type
definitions:

- `$prev_pageview_duration` — time on the previous page
- `$prev_pageview_max_scroll_percentage` — how far down the visitor got
- `$prev_pageview_max_content_percentage` — the same against content height

## Edge cases

- **No PostHog key** — every `track()` is a no-op, no chunk requested. This is
  the default state of the repo and of every preview deploy without the var.
- **RU build** — `shouldLoadPostHog` is false; additionally `<Analytics />` must
  not render, because the static export on Timeweb would ship a script that
  404s.
- **Tab backgrounded** — the engaged-time accumulator pauses on
  `visibilitychange` and resumes on return. A visitor with the tab open in
  another window for an hour is not "engaged".
- **Short page** — a page whose content fits the viewport has 100% scroll depth
  at load. Milestones must not all fire immediately on such a page; treat "no
  scrollable distance" as no milestone rather than as instant completion.
- **Rapid client-side navigation** — scroll milestones and engaged time are
  per-pageview and reset on route change, never accumulating across pages.
- **`beforeunload` dropped by the browser** — expected on mobile Safari; the
  milestone events already emitted survive, which is the reason they exist.
- **Lead form submitted twice** — `lead.form_submitted` fires per successful
  submit, and `lead.form_abandoned` must not also fire for a form that was
  submitted.
- **Outbound link that is also internal** — links to `ludvik4.ru` and to
  `/gridfin/*` are same-brand but different destinations; only a differing host
  counts as outbound.
- **User-entered text** — never becomes an event property. `fields_touched` is
  a count. The lead form's name, email and message values never reach analytics.

## Test scenarios

Per `docs/rules/testing.md`'s decision table, and invariant 3: every test is
observed failing for the right reason before it passes.

**Unit** (`src/lib/analytics.test.ts` — pure logic, node):

- `shouldLoadPostHog` — existing cases retained
- The event-name catalog matches the spec table exactly (guards against a
  silent rename of a shipped event)
- Scroll milestone calculation: boundaries at 25/50/75/100, each fires at most
  once, and a page with no scrollable distance fires none
- Engaged-time accumulator: reaches the 30s threshold only from visible time,
  pauses across a `visibilitychange`, and fires once
- `track()` is a no-op with no key, and does not import posthog-js

**Component** (jsdom + Testing Library):

- `cta.clicked` fires with the correct `placement`/`target` from each of the
  five call sites
- Lead form: `lead.form_started` on first focus; `lead.form_submitted` on
  success; `lead.form_failed` with `reason` on rejection; `lead.form_abandoned`
  on unmount after start, and **not** after a successful submit
- `telegram-link.test.tsx` extended for the move onto `track()`, asserting the
  event name and properties are unchanged
- `faq.item_opened` fires on accordion open, not on close

**Market gating (unit):** `shouldLoadVercelAnalytics(market)` is true for `en`
and false for `ru`, mirroring `shouldLoadPostHog`. There is no RU
static-export regression test in this repo to extend — `scripts/build-ru-static.ts`
has no test harness — so the gate is proven at the level where the decision is
actually made, as a pure function, rather than by asserting over build output.

**E2e:** a `<Link>` navigation produces a second `$pageview` — this is the one
scenario only a real browser with real routing can prove, and it is the
prerequisite fix's only honest verification.

## Out-of-scope

Deferred deliberately, so a later session does not assume this spec covers it:

- **Wave 2 events:** `page.exit_intent` (desktop pointer to the top edge);
  `blog.article_read` (scroll ≥75% and ≥60s on `/blog/[slug]`, the metric the
  SEO strategy actually lives on); `error.page_viewed` (`{path, referrer}` on
  404 and the error boundary — the roadmap tracks live legacy `.dev/blog/*`
  404s this would quantify).
- **Session replay.** It is the strongest tool for "why did they leave", and it
  needs browser storage, which needs a consent banner. Not in scope, and the
  decision not to build a consent flow was taken explicitly.
- **Vercel custom events.** Hobby has none; this is not worked around.
- **Speed Insights.** Related but a separate concern.
- **The RU storefront and `/gridfin/*`.**

### Accepted limitations of cookieless mode

Consequences of the privacy posture shipped in `557a2db`, recorded so nobody
rediscovers them as bugs:

- The daily-rotating hash salt means unique-visitor counts over any window
  longer than a day are inflated, and retention and cohort analysis are not
  trustworthy. Sessions within a single day are fine.
- No geolocation in PostHog — covered by Vercel Web Analytics instead.

## Acceptance criteria

- [ ] A `<Link>` navigation on the EN build produces a second `$pageview`, and
      the following `$pageleave` carries a non-zero `$prev_pageview_duration`
- [ ] Every one of the eight EN call-to-action controls emits its event with a
      distinct `placement`
- [ ] A visitor who focuses the lead form and then leaves without submitting
      produces `lead.form_started` and `lead.form_abandoned`, and no
      `lead.form_submitted`
- [ ] `page.engaged` fires once, and only after 30s with the tab visible
- [ ] `content.scroll_depth` fires at most once per milestone per pageview, and
      not at all on a page with no scrollable distance
- [ ] `contact.telegram_clicked` keeps its production name and properties
- [ ] No event property carries user-entered text
- [ ] With `NEXT_PUBLIC_POSTHOG_KEY` unset, no posthog-js chunk is requested and
      no analytics network call is made
- [ ] The RU build renders no Vercel Analytics script and initializes no
      PostHog, gated by a unit-tested pure function
- [ ] Vercel's dashboard shows pageviews for `ludvik4.dev` after deploy

## Pending user actions

1. Enable Web Analytics in the Vercel dashboard for project `ludvik4` — the
   `/_vercel/insights/*` routes do not exist until this is switched on.
2. Confirm **Cookieless server hash mode** is enabled in PostHog Project
   Settings → Web analytics. PostHog discards cookieless events when it is off,
   so without it this collects nothing.

## Status

`in progress` — design approved 2026-08-28.
