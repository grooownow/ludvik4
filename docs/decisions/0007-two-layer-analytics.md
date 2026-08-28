# ADR 0007: two analytics layers, Vercel for traffic and PostHog for behaviour

## Context

The international storefront needed to answer two questions: which calls to
action visitors actually press, and how long they stay before leaving and why.

Neither was answerable. `557a2db` had just moved PostHog to the EN build in
cookieless mode, but nothing was instrumented on top of it, and the natural
first instinct — "add Vercel Analytics, it's already the host" — collides with
a hard constraint: the Vercel team `krobox-6504s-projects` is on **Hobby**, and
[Hobby has no custom events at all](https://vercel.com/docs/analytics/limits-and-pricing).
`track()` calls would compile, run, and produce nothing in the dashboard.

A second constraint pushed the other way. PostHog's cookieless server hash mode
strips the IP address before enrichment runs, so **GeoIP does not populate** —
an international storefront would have no idea which countries its visitors
come from.

## Options considered

1. **Upgrade to Vercel Pro ($20/month, +$10 for Web Analytics Plus)** — one
   vendor, one dashboard, cookieless by default, and the privacy notice barely
   moves. But custom events carry only 2 properties (8 with the add-on), there
   is no session replay and no exit-path analysis, every event consumes billed
   quota, and the behavioural picture would have to be reassembled by hand from
   custom events. A recurring bill for a strictly smaller feature set.
2. **Vercel Web Analytics on the free Hobby allowance, PostHog for events** —
   Vercel contributes pageviews, referrers, device and the geolocation PostHog
   cannot see, for free within 50k events/month. PostHog contributes autocapture,
   funnels, scroll depth and dwell time on its free tier. Two dashboards, and
   PostHog needs the privacy notice to name it as a processor.
3. **Vercel only, stay on Hobby** — cheapest and honest, but answers only the
   first question. Any button-click code would be dead code by construction.

## Decision

Option 2. Vercel Web Analytics ships on the EN build as the free traffic
baseline and the sole source of geolocation; PostHog carries every named
behavioural event. No Vercel custom events are written, and the Hobby plan is
not worked around.

## Consequences

**Easier.** The behavioural questions are answerable at zero recurring cost.
Geolocation and event depth are each sourced where they are actually good.
Because `track()` is a single choke point in `src/lib/analytics.ts` behind a
market-and-key guard, turning the whole layer off is one env var.

**Harder.** Two dashboards, and no single query joins them. The cookieless
posture that makes this defensible without a consent banner also costs real
capability: **session replay is off** — the strongest tool for "why did they
leave" — the daily-rotating hash salt inflates unique-visitor counts over any
window longer than a day, and retention and cohort analysis are not
trustworthy. Buying those back means a consent banner, which is a product
decision, not a technical one.

**Foreclosed for now.** Vercel custom events. If the team ever moves to Pro for
another reason, revisit whether the conversion funnel belongs there instead —
but do not migrate event names: renaming a shipped event orphans its history
(`docs/playbooks/analytics.md`).

Full reasoning, event catalog and accepted limitations:
`docs/specs/analytics-events.md`.

## Status

`accepted`
