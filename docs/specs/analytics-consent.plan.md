# Plan: analytics-consent

Touch-point map for `docs/specs/analytics-consent.md`.

## No schema change, no new env var, no new dependency

Consent lives in PostHog's own persistence. Nothing installed: the banner is
built from `Button` and the existing tokens.

## `src/lib/` — pure logic and SDK wrappers

`src/lib/analytics.ts` (extend)

- `ConsentStatus = "granted" | "denied" | "pending"`.
- `readConsent()`, `setConsent(granted)`, `clearConsent()` — each behind the
  same market-and-key guard as `track()`, each resolving through the one lazy
  `import("posthog-js")`. They return/act only when analytics is on, so every
  caller inherits the "no key, no analytics, no banner" contract.

`src/lib/analytics.test.ts` (extend) — the guard on all three.

## `src/components/` — provider, banner, withdrawal

`src/components/analytics-provider.tsx`

- `posthog.init` gains `cookieless_mode: "on_reject"`,
  `opt_out_capturing_by_default: true`, `disable_session_recording: true`, and
  the `session_recording` masking block. The pairing of the first two is the
  load-bearing decision — see the spec's consent model.
- Owns `consent` state, reads it right after `init` resolves, starts session
  recording when it is already `granted`.
- Publishes `{ status, accept, decline, reopen }` on a context so the footer
  control can reach it from anywhere under the provider.
- **Renders the banner itself**, rather than exporting it for someone to mount:
  React runs child effects before parent effects, so a banner mounted as a child
  elsewhere would read the consent status before `posthog.init` had run.

`src/components/consent-banner.tsx` (new, client) — presentation only. Takes
`onAccept`/`onDecline` and renders nothing on its own initiative, so it is
testable without PostHog. Bottom bar, `Button` primitives, tokens only, labelled
region, focus on mount, Escape declines, animation behind
`motion-safe:`.

`src/components/consent-settings-button.tsx` (new, client) — reads the context;
renders nothing when analytics is off, so the RU build and any keyless build get
no dead control. Calls `reopen()`.

Colocated tests for the provider (extend) and both new components.

## `src/features/` — where the withdrawal control appears

`src/features/site/site-chrome.tsx` — the footer gains
`<ConsentSettingsButton />`. The footer is shared with RU, which is why the
button must self-suppress rather than be conditionally rendered by the caller.

`src/features/site/privacy-page.tsx` — section 9 rewritten for consent-based
cookies, session replay and withdrawal, with the same control inline.

## Legal source

`docs/legal/privacy-notice-en.md` — cookies now used after consent; session
replay named as a processing activity with its masking; withdrawal documented.
The consequence list that currently says "keep PostHog in cookieless mode unless
a consent flow is deliberately implemented" is exactly what this slice changes.

## Import direction

`components → lib` and `features → components`, both allowed. The context is
exported from `components/analytics-provider.tsx`; no feature owns it, because
two different features consume it.

## Order of work

1. `analytics.ts` wrappers + init config change
2. Provider: consent state, context, replay start/stop
3. `ConsentBanner` presentation + its test
4. `ConsentSettingsButton`, footer and `/privacy` wiring
5. Legal notice and `/privacy` copy

## Open decisions

None. The three forks were settled before implementation:

- **Reject semantics** — cookieless continues; confirmed with the user, and it
  is the position the privacy notice already asserts.
- **Who renders the banner** — the provider, because of React's child-before-parent
  effect ordering.
- **Masking over blocking** — inputs are masked rather than the form blocked, so
  a replay still shows that someone struggled with the form without showing what
  they typed.

NO UNRESOLVED DECISIONS
