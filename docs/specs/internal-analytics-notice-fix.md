# Compact internal analytics notice

## Problem and status

The user's mobile screenshot showed the internal-device confirmation occupying
a large part of the article. Its long explanatory text pushed the bottom
"Got it" control beyond the visible area. The user could not dismiss it.

Status: LIVE on ludvik4.dev — verified 2026-10-12.

## Fix

Keep the existing off/on confirmation and storage behaviour. Replace the long
paragraph and vertically stacked action with a single status sentence and a
44px close control in the same row. Give it an explicit accessible name,
preserve token colours and account for the device's bottom safe area. Bound
the notice to half the dynamic viewport with overflow scrolling as a fallback
for unusually large text or very short screens.

Closing the notice must preserve the internal-device flag. A visit without the
query parameter must continue to show no confirmation. This is a responsive
bug fix to the existing notice, not a new analytics or consent flow.

## Checks

- Existing provider tests cover both messages, ordinary-visitor absence,
  dismiss behaviour and preservation of the analytics exclusion.
- The updated dismissal assertion was exercised against the previous component
  and failed for the missing accessible close control, then passed after the
  fix was restored.
- Browser checks: 375px and 320px widths, a short viewport and enlarged text;
  verify the close target is fully visible and clicking it removes the notice
  without un-muting the browser.
- Repository gates and EN build before publication; live EN smoke after deploy.

## Verification evidence

| Gate                       | Result | Evidence                                                                     |
| -------------------------- | ------ | ---------------------------------------------------------------------------- |
| Lint                       | PASS   | `All matched files use Prettier code style!`; exit 0                         |
| Unit/component/integration | PASS   | `Test Files  60 passed (60)`; `Tests  489 passed (489)`                      |
| E2E                        | PASS   | `38 passed (19.2s)`                                                          |
| RU build                   | PASS   | `Compiled successfully in 589ms`; static pages `51/51`                       |
| EN build                   | PASS   | Production build exited 0; static pages `36/36`                              |
| Skill harness              | N.A.   | No rule, skill or final entry-map changes                                    |
| Browser smoke              | PASS   | Close control in viewport in all four cases; dismissal preserves stored flag |

Measured notice heights: 61px at 375×844 and 320×480 with normal text, 180px
(capped) at 320×360 with 200% text, and 158px at 375×667 with 200% text. The
close target stayed entirely visible and was successfully clicked in every
case. An ordinary reload without the parameter showed no notice while the
stored exclusion remained `1`. Console checks returned zero errors.

Screenshots: `tmp-review/compact-analytics-<width>x<height>-<font>.png`.
The measurement awaited the actual entry animation rather than using a fixed
sleep. The updated dismissal test failed against the previous component and
passed with the fix restored (`tmp-review/compact-analytics-red-proof.log` and
`compact-analytics-green-proof.log`).

## Production

PR [#11](https://github.com/grooownow/ludvik4/pull/11) passed all five checks and
merged as `86f2b6526ad95dbab1063667db27d5bd994fbd1a`. Vercel production deployment
`dpl_5HPUekm8BPWD1f9ss4oXbrT5r31H` reached Ready and is aliased to ludvik4.dev.

Live checks at 375×844 with normal text and 320×360 with 200% text confirmed
that the close target is fully visible and clickable. Dismissal removes the
notice while retaining the stored exclusion; ordinary reloads do not show it.
There were no page or console errors. The default-size notice measured 61px.

Screenshots: `tmp-review/compact-analytics-live-375-100.png`,
`tmp-review/compact-analytics-live-320-200.png` and the cropped detail
`tmp-review/compact-analytics-live-detail.png`. Original unrelated SEO working
changes were preserved outside the fix's commits.
