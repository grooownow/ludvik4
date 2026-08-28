# Analytics event layer — ludvik4.dev

Status: design approved 2026-08-28; not yet implemented.

## Goal

Answer two questions about the international storefront with data instead of
guesswork:

1. Which calls to action do visitors actually press?
2. How long do they stay, and at what point — and for what visible reason — do
   they leave?

Scope is `ludvik4.dev` (`SITE_MARKET=en`) only. The RU storefront on Timeweb
never initializes PostHog (`shouldLoadPostHog` returns `true` for `en` only) and
cannot host Vercel's script; the Gridfin landing under `/gridfin/*` is a static
bundle owned by `grooownow/gridfin` and is out of scope here.

## Starting point

Commit `557a2db` moved PostHog to the international build in cookieless mode
(`cookieless_mode: "always"`, `person_profiles: "never"`) and rewrote both
`docs/legal/privacy-notice-en.md` and `/privacy` to cover it. The legal
groundwork for this plan is therefore already shipped; this plan only adds
measurement on top of it.

`posthog-js` enables autocapture by default, so every click on every button and
link is already recorded as `$autocapture` once the key is present.

## Two layers, different jobs

|               | Vercel Web Analytics                                          | PostHog                                    |
| ------------- | ------------------------------------------------------------- | ------------------------------------------ |
| Role          | traffic baseline                                              | behaviour and named events                 |
| Plan          | Hobby, free, 50k events/month                                 | free tier                                  |
| Provides      | pageviews, referrers, **geolocation**, device, 1-month window | events, funnels, paths, scroll, dwell time |
| Custom events | none — Hobby has no custom events                             | yes                                        |

The geolocation column is not duplicated work. PostHog's cookieless server hash
mode strips the IP address before enrichment runs, so GeoIP does not populate.
Vercel closes exactly that gap, at no cost, on the plan the project already has.

Sources:

- Web Analytics plan limits (Hobby shows `-` for Custom Events):
  https://vercel.com/docs/analytics/limits-and-pricing
- App Router integration (`@vercel/analytics/next`, mounted in the root layout,
  requires enabling Analytics in the project dashboard first):
  https://vercel.com/docs/analytics/quickstart
- Cookieless mode strips IP before GeoIP and bot detection:
  https://vercel.com/docs/analytics/privacy-policy and
  https://posthog.com/tutorials/cookieless-tracking

## Prerequisite fix: client-side pageviews are not being captured

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

This is fixed first. Nothing else in this plan measures anything real until it
is: dwell time, scroll depth, bounce rate and exit paths are all derived from
the `$pageview`/`$pageleave` pair.

## Free once the fix lands

No custom code produces these; they are properties of `$pageview`/`$pageleave`,
confirmed against `PageViewEventProperties` in the installed package's type
definitions:

- `$prev_pageview_duration` — time on the previous page
- `$prev_pageview_max_scroll_percentage` — how far down the visitor got
- `$prev_pageview_max_content_percentage` — the same against content height

PostHog's web analytics dashboard derives sessions, session duration, bounce
rate and entry/exit paths from these plus `$autocapture`. Its bounce definition
is one pageview, no autocaptures, under ten seconds
(https://posthog.com/docs/web-analytics/dashboard).

## Named events — wave 1

Naming follows `docs/playbooks/analytics.md`: `area.object_action`, lowercase,
past tense.

Autocapture keeps the long tail of "what do people click at all". Named events
exist only where a click carries business meaning and has to stay readable in a
funnel. The EN storefront has eight such controls, split across two event names:

- `cta.clicked` covers five — the nav CTA on desktop, the nav CTA in the mobile
  menu, the hero CTA, the service-page CTA, and the lead-form submit button.
  `placement` is one of `nav`, `nav_mobile`, `hero`, `service`, `form_submit`;
  `target` is `contact` for the four anchor CTAs and `lead_form` for the submit.
- `contact.telegram_clicked` covers the remaining three — the Telegram links in
  the header, the home contact block, and the footer. It already ships in
  production and keeps its existing `placement` values.

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

`contact.telegram_clicked` already ships in production and keeps its exact name.
The playbook forbids renaming a live event — old data does not follow. It is
folded into the new `track()` helper without changing its name or properties.

`content.scroll_depth` deliberately duplicates information PostHog already
attaches to `$pageleave`. Mobile Safari drops `beforeunload` often enough that
milestone events are the durable record; the `$pageleave` property is the
convenient one.

### Wave 2 — deferred, not dropped

- `page.exit_intent` — desktop pointer to the top edge, once per page
- `blog.article_read` — scroll ≥75% and ≥60s on `/blog/[slug]`, the metric the
  SEO strategy actually lives on
- `error.page_viewed` — `{path, referrer}` on 404 and the error boundary. The
  roadmap tracks live legacy `.dev/blog/*` 404s that this would quantify

## Accepted limitations of cookieless mode

These are consequences of the privacy posture already shipped in `557a2db`,
recorded here so nobody rediscovers them as bugs:

- **Session replay is off.** It is the strongest tool for "why did they leave",
  and it needs browser storage, which needs a consent banner. Not in scope.
- The daily-rotating hash salt means unique-visitor counts over any window
  longer than a day are inflated, and retention and cohort analysis are not
  trustworthy. Sessions within a single day are fine.
- No geolocation in PostHog — covered by Vercel Web Analytics instead.

## Architecture

- `src/lib/analytics.ts` — pure, React-free, unit-testable: the existing
  `shouldLoadPostHog` guard, the event-name catalog as constants, the scroll
  milestone calculation, and the active-time accumulator. The catalog being a
  value rather than scattered string literals is what lets a test assert it.
- `src/lib/analytics.ts` also gains `track(event, props)`: guard → dynamic
  `import("posthog-js")` → `capture`. One choke point. The ad-hoc inline import
  in `src/components/telegram-link.tsx` moves onto it.
- `src/components/analytics-provider.tsx` — `posthog.init` (plus the
  `capture_pageview` fix) and the page-scoped listeners for scroll milestones
  and engaged time.
- `src/app/layout.tsx` — `<Analytics />` from `@vercel/analytics/next`, rendered
  only when `SITE_MARKET === "en"`.
- Call sites: `src/features/site/site-chrome.tsx`,
  `src/features/site/home-en.tsx`, `src/features/site/international-pages.tsx`,
  `src/features/lead/lead-form.tsx`.

The dynamic-import guard is load-bearing and must survive: with no
`NEXT_PUBLIC_POSTHOG_KEY`, no posthog-js chunk is requested and no network call
is made. Every new `track()` call inherits that contract.

## Acceptance criteria

- [ ] A `<Link>` navigation on the EN build produces a second `$pageview`, and
      the following `$pageleave` carries a non-zero `$prev_pageview_duration`
- [ ] Every one of the eight EN call-to-action controls emits `cta.clicked`
      with a distinct `placement`
- [ ] A visitor who focuses the lead form and then navigates away without
      submitting produces `lead.form_started` and `lead.form_abandoned`, and no
      `lead.form_submitted`
- [ ] `page.engaged` fires once, and only after 30s with the tab visible;
      backgrounding the tab does not accumulate time
- [ ] `content.scroll_depth` fires at most once per milestone per pageview
- [ ] `contact.telegram_clicked` keeps its production name and properties
- [ ] No event property carries user-entered text. `fields_touched` is a count;
      the lead form's name, email and message values never leave the browser
      through analytics
- [ ] With `NEXT_PUBLIC_POSTHOG_KEY` unset, no posthog-js chunk is requested and
      no analytics network call is made
- [ ] The RU static export contains no Vercel Analytics script and no PostHog
      initialization
- [ ] Vercel's dashboard shows pageviews for `ludvik4.dev` after deploy

## Testing

Per invariant 3 and `docs/rules/testing.md`, every test is observed failing
before it passes.

- Unit (`src/lib/analytics.test.ts`): the guard, the event-name catalog, scroll
  milestone boundaries including the "once per milestone" property, and the
  active-time accumulator across visibility changes
- Component: `cta.clicked` wiring per call site; the lead-form
  started/submitted/failed/abandoned sequence; `telegram-link.test.tsx` extended
  for the move onto `track()`
- Build assertion: the existing RU static-bundle regression test gains a check
  that the export contains no Vercel or PostHog script
- Gates: `pnpm lint && pnpm test && pnpm test:e2e && pnpm build` via the
  `verify` skill

## Pending user actions

1. Enable Web Analytics in the Vercel dashboard for project `ludvik4` — the
   `/_vercel/insights/*` routes do not exist until this is switched on.
2. Confirm **Cookieless server hash mode** is enabled in PostHog Project
   Settings → Web analytics. PostHog discards cookieless events when it is off,
   so without it this whole plan collects nothing.
