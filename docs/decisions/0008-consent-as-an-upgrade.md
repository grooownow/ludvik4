# ADR 0008: consent is an upgrade, not a gate

## Context

`docs/decisions/0007-two-layer-analytics.md` closed by naming what the
cookieless posture cost: no session replay, inflated unique-visitor counts, no
trustworthy retention — and said buying those back "means a consent banner,
which is a product decision, not a technical one." That decision has now been
taken: the site asks for cookies.

The question this record answers is what happens to the visitor who does **not**
answer. Most people ignore consent banners, so the default path is not an edge
case — it is the majority of traffic, and it is exactly the traffic the previous
slice built its baseline on.

PostHog's own [cookieless tutorial](https://posthog.com/tutorials/cookieless-tracking)
documents the canonical pattern and states plainly that with
`cookieless_mode: "on_reject"` a pending visitor is not captured at all. Taken
at face value, adopting a banner would have silently discarded most of the
analytics shipped days earlier.

Reading the shipped bundle showed the doc describes only the default pairing.
From `node_modules/posthog-js/dist/module.js` at `posthog-js@1.398.2`, where
`consent` is `-1` pending, `0` denied, `1` granted:

```js
isRejected(){ return 0===consent || (-1===consent && opt_out_capturing_by_default) }
Ci(){ return cookieless_mode==="always" || (cookieless_mode==="on_reject" && consent.isRejected()) }
```

`Ci()` is the cookieless decision. Setting `opt_out_capturing_by_default: true`
makes a pending visitor "defaulted to opt-out", which makes `isRejected()` true,
which routes them into cookieless mode rather than into silence.

## Options considered

1. **Gate: the canonical pattern, `on_reject` with library defaults.** Strictest
   reading of consent — nothing at all is processed until a choice is made. It
   also throws away most of the baseline, because most visitors never choose,
   and it makes the numbers depend on banner-interaction rate rather than on
   traffic.
2. **Upgrade: `on_reject` paired with `opt_out_capturing_by_default: true`.**
   Pending and declining visitors continue on the cookieless path — no storage,
   no profile — under the legitimate-interest basis the privacy notice already
   asserts. Granting adds cookies, a stable identifier and session replay under
   consent. Nothing is lost; capability is only added.
3. **Decline means total shutdown, ignoring means cookieless.** Respects an
   explicit "no" most strongly, but needs bespoke logic layered over the SDK's
   own consent handling, and the difference matters only for a visitor who
   deliberately declined a banner that was never blocking them.

## Decision

Option 2, confirmed with the site owner. Declining or ignoring the banner leaves
exactly the cookieless analytics that shipped in
`docs/specs/analytics-events.md`. Granting adds a browser-stored analytics
identifier and session replay.

## Consequences

**Easier.** The banner cannot damage the measurement it sits on top of, so
adding it carried no data risk. Two legal bases stay cleanly separated:
legitimate interest (Art. 6(1)(f)) for the cookieless path, consent
(Art. 6(1)(a)) for cookies and replay. Session replay — the tool ADR 0007 said
was missing for "why did they leave" — is now reachable.

**Harder.** The two init options are a pair, and a future reader who deletes
`opt_out_capturing_by_default: true` as redundant would silently stop capturing
most visitors. The pairing is commented at the call site and asserted by a test
in `src/components/analytics-provider.test.tsx` for that reason.

Replay quality is deliberately reduced: all inputs are masked, so a replay shows
that a visitor struggled with the contact form but never what they typed. That
is the right trade for a form carrying a client's business problem.

**Foreclosed.** A stricter "no processing before consent" posture. Moving to it
later means re-deciding this ADR, not tweaking a flag — and it would make
traffic figures discontinuous across the change.

Supersedes the "session replay is off" consequence in ADR 0007.

## Status

`accepted`
