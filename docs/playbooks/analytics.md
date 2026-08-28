---
title: Analytics with PostHog
status: lite
owner: user's agent
---

# Analytics

Turn on the analytics slot that already ships in this codebase, name events
one way, track six starter events, review them weekly. Analytics here
answers one question: is anyone getting value, and where do they drop off?

## Prerequisites

- A free PostHog account (posthog.com) — the project API key is all this
  playbook needs to start.
- PRD exists — the starter events below need your domain slice name and
  "aha moment" definition from it.

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

Custom events are `posthog.capture(name, properties)` calls. Keep the same
guard the provider uses (no key → no-op) so the app never depends on
analytics being on. Wiring a capture helper plus the events below is a
normal `/feature` change.

## Event naming: `area.object_action`

`area` = the slice (`auth`, `billing`, `landing`, your domain slice);
`object_action` = what happened, past tense: `auth.user_signed_up`,
`billing.paywall_viewed`. Lowercase, dots and underscores only. Never
rename a shipped event — old data won't follow; add the new name and
retire the old one.

## The 6 starter events

`<area>` below is the domain slice named in your PRD.

| Event                        | What counts                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `auth.user_signed_up`        | First successful account creation — the created user, not the form view.                                        |
| `<area>.activation_reached`  | The user first experiences the core value (the PRD's "aha" moment). Once per user.                              |
| `<area>.core_action_done`    | Each repeat of the main value action — the heartbeat of usage.                                                  |
| `billing.paywall_viewed`     | A signed-in user sees the price/upgrade screen — buying intent, distinct from the public landing price section. |
| `billing.purchase_completed` | Payment confirmed. Fire from the verified Stripe webhook, not the redirect (`docs/playbooks/billing.md`).       |
| `<area>.churn_signal`        | Your early warning — subscription cancelled, or N days without a core action. Pick one definition and keep it.  |

Client-side events go through the capture helper; server-side ones
(purchase) are sent from the webhook handler via PostHog's server API.

## Weekly review ritual — 3 questions

Same day every week, 15 minutes, in PostHog:

1. **Are people arriving?** `auth.user_signed_up` this week vs. last.
2. **Are they getting value?** The signup → activation → repeat-core-action
   funnel — where is the steepest drop?
3. **Is anyone paying or leaving?** `billing.purchase_completed` count and
   `<area>.churn_signal` — and talk to one churned or stuck user this week.

Write one sentence of conclusion per question. If a decision follows
(change price, fix onboarding), record it per `docs/rules/docs.md`.

## Done when

- Events are visible in PostHog's activity view while clicking through the
  golden path locally: sign up → activate → core action → paywall → test
  purchase.
