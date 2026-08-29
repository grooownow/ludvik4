# Spec: cookie consent and session replay — ludvik4.dev

## Problem

`docs/specs/analytics-events.md` shipped the event layer but had to record a
gap in its own Out-of-scope section: **session replay is off**, because it needs
browser storage and browser storage needs consent. Replay is the strongest tool
for the question the whole slice exists to answer — why does a visit end without
an enquiry — and the cookieless posture also inflates unique-visitor counts and
makes retention untrustworthy, because the server hash salt rotates daily.

Nothing on the site currently asks for consent, and nothing offers a way to
withdraw it. Both are needed before a single cookie is set.

## Scope

`ludvik4.dev` (`SITE_MARKET=en`) only, like every other analytics surface. The
RU storefront never initializes PostHog and therefore never shows a banner.

Touches: `src/lib/analytics.ts`, `src/components/analytics-provider.tsx`, two
new client components under `src/components/`, `src/features/site/site-chrome.tsx`
(footer control), `src/features/site/privacy-page.tsx`, and the legal source
`docs/legal/privacy-notice-en.md`. No routes, no tables, no new env var.

## Consent model: an upgrade, not a gate

Read from the shipped bundle of `posthog-js@1.398.2` (`dist/module.js`), where
`consent` is `-1` pending, `0` denied, `1` granted:

```js
isRejected(){ return 0===consent || (-1===consent && opt_out_capturing_by_default) }
Ci(){ return cookieless_mode==="always" || (cookieless_mode==="on_reject" && consent.isRejected()) }
```

`Ci()` is the cookieless decision. This matters because PostHog's own
[cookieless tutorial](https://posthog.com/tutorials/cookieless-tracking) says a
pending visitor is not captured at all — true only under the default
`opt_out_capturing_by_default: false`. With it set to `true`, a pending visitor
counts as "defaulted to opt-out", `isRejected()` is true, and `Ci()` therefore
puts them in **cookieless mode** — exactly the behaviour shipped today.

So the configuration is `cookieless_mode: "on_reject"` plus
`opt_out_capturing_by_default: true`, and consent becomes additive:

| Visitor state        | What runs                                                                           |
| -------------------- | ----------------------------------------------------------------------------------- |
| Pending (ignored it) | Cookieless analytics, exactly as today. No storage, no profile.                     |
| Denied               | The same. The choice is remembered; the banner does not return.                     |
| Granted              | Cookies, a persistent id — real unique visitors and retention — and session replay. |

Ignoring the banner therefore costs no data, which is the point: most visitors
ignore banners, and a gate would have thrown away the baseline the previous
slice just built. The legal basis for the pending/denied path is the one the
privacy notice already asserts — legitimate interest under Article 6(1)(f) for
analytics that stores nothing in the browser.

## UX flow

1. An EN visitor arrives. Analytics starts cookieless. `posthog.init` resolves,
   `get_explicit_consent_status()` returns `pending`, and the banner mounts.
2. The banner is a bottom bar: one sentence of explanation, a link to
   `/privacy`, and two buttons — **Accept** (default variant) and **Decline**
   (outline variant), equally prominent, no dark pattern.
3. **Accept** → `opt_in_capturing()` → session replay starts → banner unmounts.
   **Decline** → `opt_out_capturing()` → banner unmounts, nothing else changes.
4. The choice persists. On a later visit the status is `granted` or `denied` and
   the banner never mounts.
5. **Withdrawal** — a "Cookie settings" control in the footer and on `/privacy`
   calls `clear_opt_in_out_capturing()`, which returns the status to `pending`
   and brings the banner back. GDPR requires withdrawal to be as easy as
   consent; a control on every page is what that means here.

**Loading state:** the banner never renders until the status is actually known,
so it cannot flash on a visitor who already decided. **Error state:** if the
posthog-js import fails, no banner renders and the site is unaffected.

## Session replay safety

Replay is initialized disabled (`disable_session_recording: true`) and started
explicitly via `startSessionRecording()` only once consent is granted — the
grant is the trigger, never the mere presence of a key.

The lead form carries a client's business problem, their name and their contact
address. Recording configuration masks input content while keeping the
interaction visible, so a replay shows _that_ someone struggled with the form,
never _what_ they typed:

- `maskAllInputs: true`
- `maskInputOptions: { text: true, textarea: true, email: true, password: true }`

`blockClass` keeps its `ph-no-capture` default, available if a future element
must be blocked outright rather than masked.

## Data model

No schema change. Consent lives where PostHog already keeps it — its own
persistence — rather than in a second store this codebase would have to keep in
sync. `src/lib/analytics.ts` gains only a `ConsentStatus` type and thin
`readConsent` / `setConsent` / `clearConsent` wrappers around the SDK, each
carrying the same market-and-key guard as `track()`.

## Edge cases

- **No PostHog key / RU build** — no banner, no consent control, nothing to
  withdraw. The footer control renders nothing rather than a dead button.
- **posthog-js fails to load** — no banner; the site is fully functional.
- **Status resolves as `granted` on a return visit** — replay starts on load,
  with no banner and no second prompt.
- **Withdrawal after granting** — replay must stop, not merely be forgotten.
- **Effect ordering** — the banner is rendered by `AnalyticsProvider` itself
  rather than mounted as a child elsewhere: React runs child effects before
  parent effects, so a separately-mounted banner would race `posthog.init` and
  read a status that does not exist yet.
- **Keyboard and screen readers** — the banner is a labelled region that takes
  focus on mount and is dismissible from the keyboard; it must not trap focus
  away from the page content behind it.
- **Reduced motion** — the entrance animation is skipped under
  `prefers-reduced-motion`.

## Test scenarios

Per `docs/rules/testing.md`; every test observed failing before it passes.

**Unit** (`src/lib/analytics.test.ts`): `readConsent`/`setConsent`/`clearConsent`
are no-ops without a key and on the RU market; each maps to the right SDK call.

**Component** (`src/components/analytics-provider.test.tsx`):

- `posthog.init` receives `cookieless_mode: "on_reject"`,
  `opt_out_capturing_by_default: true`, `disable_session_recording: true`, and
  the masking options
- the banner mounts only when the status is `pending`; not for `granted`, not
  for `denied`, not without a key, not on the RU market
- Accept calls `opt_in_capturing` and starts session recording; Decline calls
  `opt_out_capturing` and does not
- a `granted` status on load starts recording with no banner
- withdrawal calls `clear_opt_in_out_capturing`, stops recording, and brings the
  banner back

**Component** (`src/components/consent-banner.test.tsx`): both buttons are
reachable by role and equally available; the banner is a labelled region; it
renders the link to `/privacy`.

**E2e:** the RU build shows no banner and sets no cookie — the existing
`tests/e2e/analytics.spec.ts` already asserts the absent-analytics half and
gains the cookie assertion.

## Out-of-scope

- Granular per-purpose toggles. One decision covers all non-essential analytics;
  there is no advertising or third-party marketing to separate out.
- A consent banner on the RU storefront — it runs no analytics at all.
- Heatmaps and surveys. Both become possible after consent; neither is wired.
- Server-side consent enforcement. Nothing personal reaches the server from
  analytics; the lead form has its own legal basis.

## Acceptance criteria

- [ ] A first-time EN visitor is captured cookielessly **before** touching the
      banner, and no cookie or localStorage entry is written until Accept
- [ ] Accept sets consent, starts session replay, and dismisses the banner
- [ ] Decline dismisses the banner and leaves cookieless analytics running
- [ ] The choice survives a reload; the banner does not reappear
- [ ] Withdrawal returns the banner and stops session replay
- [ ] A replay never contains lead-form input content
- [ ] The RU build renders no banner and no consent control
- [ ] Banner and controls use only existing `components/ui` primitives and
      design tokens — no new primitive installed, no raw colour

## Status

`in progress` — approved 2026-08-29.
