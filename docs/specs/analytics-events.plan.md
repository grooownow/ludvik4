# Plan: analytics-events

Touch-point map for `docs/specs/analytics-events.md`. A map, not a document.

## No schema change, no new env var

No table, no migration, no factory. `NEXT_PUBLIC_POSTHOG_KEY` and `SITE_MARKET`
both already exist and are already documented in `.env.example`. One new
dependency: `@vercel/analytics`.

## `src/lib/` — pure logic

`src/lib/analytics.ts` (extend; stays React-free and node-testable)

- `shouldLoadPostHog(market, key)` — unchanged.
- `shouldLoadVercelAnalytics(market)` — new, mirrors it: `market === "en"`.
  This is what the RU acceptance criterion is proven against.
- `ANALYTICS_EVENTS` — the event-name catalog as a frozen constant, so the
  test asserts the catalog rather than chasing string literals.
- `track(event, props)` — guard → dynamic `import("posthog-js")` → `capture`.
  The single choke point. Preserves the load-bearing contract: no key means no
  chunk requested and no network call.
- `scrollMilestone(scrollTop, viewportHeight, documentHeight)` — returns the
  milestone crossed or `null`; returns `null` when there is no scrollable
  distance (the short-page edge case).
- `createEngagedTimer(thresholdMs)` — accumulates visible time only, fires
  once. Pure, driven by injected timestamps so the test uses fake timers rather
  than real waits (`docs/rules/testing.md`, anti-flaky).

`src/lib/analytics.test.ts` (extend) — unit coverage for all of the above.

## `src/components/` — init and global listeners

`src/components/analytics-provider.tsx`

- Add `defaults: "2025-05-24"` to `posthog.init` so `capture_pageview` resolves
  to `history_change`. **Correct the stale comment** that claims client-side
  route changes are captured out of the box — it is the reason the bug went
  unnoticed.
- Mount the page-scoped listeners: scroll milestones and the engaged timer,
  both reset on `usePathname()` change so nothing accumulates across routes.
- Mount the delegated outbound-link listener. It skips `t.me` hosts, which
  already emit `contact.telegram_clicked`; double-counting one click as two
  events would quietly corrupt the exit numbers.

`src/components/telegram-link.tsx` — drop the inline `import("posthog-js")` and
call `track()`. Event name and properties unchanged.

`src/components/telegram-link.test.tsx` (extend) — assert the name and
properties survive the move.

## `src/app/` — the Vercel layer

`src/app/layout.tsx` — render `<Analytics />` from `@vercel/analytics/next`
behind `shouldLoadVercelAnalytics(MARKET)`. `MARKET` is already imported here.
The route stays thin; no other change.

## `src/features/` — named call sites

`src/features/site/site-chrome.tsx` — `cta.clicked` on the desktop nav CTA
(`placement: "nav"`) and the mobile-menu CTA (`placement: "nav_mobile"`).

`src/features/site/home-en.tsx` — `cta.clicked` on the hero CTA
(`placement: "hero"`), and `faq.item_opened` on the accordion. **Note:** the EN
FAQ is inline here over `internationalFaq`; `src/features/faq/` is the RU slice
(hardcoded Russian copy) and is not touched.

`src/features/site/international-pages.tsx` — `cta.clicked` on the service-page
CTA (`placement: "service"`).

`src/features/lead/lead-form.tsx` — `lead.form_started` on first focus,
`lead.form_submitted` / `lead.form_failed` off the `useActionState` result,
`lead.form_abandoned` on unmount after a start that never succeeded. The
component already unmounts its form on success (`state.ok` swaps in the success
`<output>`), so abandonment must be tracked by an explicit "was it submitted"
ref, not by unmount alone.

Colocated `*.test.tsx` for each call site, per `docs/rules/architecture.md`
(tests live next to the file they cover).

## Import direction

Everything new flows `features` → `lib` and `components` → `lib`, which the
`boundaries/dependencies` rule permits. No feature imports another feature. No
new cross-slice public API.

## Order of work

1. `@vercel/analytics` + `<Analytics />` + `shouldLoadVercelAnalytics`
2. The `capture_pageview` fix and the corrected comment
3. `track()` + catalog, `telegram-link.tsx` moved onto it
4. `cta.clicked` call sites
5. Lead-form events
6. Scroll milestones, engaged timer, outbound listener, `faq.item_opened`

Each is a green commit.

## Open decisions

None. Three forks were settled during planning rather than left implicit:

- **Vercel gating** — a pure `shouldLoadVercelAnalytics` rather than an inline
  `MARKET === "en"` in the layout, so the RU acceptance criterion has something
  to test.
- **Outbound vs Telegram double-count** — the delegated listener skips `t.me`.
- **Abandonment vs success** — tracked by an explicit ref, because the form
  unmounts on success too.

The spec's claim that an RU static-bundle regression test exists was wrong —
`scripts/build-ru-static.ts` has no test harness. The spec is corrected and the
gate is proven as a pure function instead.

NO UNRESOLVED DECISIONS
