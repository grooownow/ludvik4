"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ANALYTICS_EVENTS,
  createEngagedTimer,
  createScrollTracker,
  shouldLoadPostHog,
  track,
} from "@/lib/analytics";

// Read `NEXT_PUBLIC_POSTHOG_KEY` directly via `process.env` (inlined by
// Next.js/webpack at build time) instead of importing `src/lib/env.ts`.
// `env.ts` validates the FULL server schema (AUTH_SECRET, DATABASE_URL,
// SENTRY_DSN, ...) — importing that module from a client component would
// ship its zod schema (and every server env key name) into the browser
// bundle for the sake of one public key. Raw `process.env.NEXT_PUBLIC_*`
// access is the standard Next.js client-side pattern for exactly this
// reason, and it's the only thing Next.js statically inlines for
// client code in the first place.
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const SITE_MARKET = process.env.SITE_MARKET;

/** A visitor who stayed this long, with the tab actually in front of them. */
const ENGAGED_THRESHOLD_MS = 30_000;

/** How often engagement is re-checked when nothing else is happening. */
const ENGAGED_POLL_MS = 1_000;

/**
 * PostHog analytics slot — OFF by default.
 *
 * With no `NEXT_PUBLIC_POSTHOG_KEY` set, this renders `children` only:
 * no `posthog-js` import ever executes, so no PostHog code runs and no
 * network calls are made. Buyers turn it on by setting the env var.
 *
 * The `posthog-js` import is dynamic (inside `useEffect`, behind the key
 * check) rather than a static top-level import specifically so bundlers
 * split it into its own async chunk that is only *requested* when a key
 * is present — a static import would still ship the library in the
 * initial bundle regardless of the runtime `if` guard. Verified in
 * task-8-report.md by inspecting `.next` build output with and without
 * the key set.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldLoadPostHog(SITE_MARKET, POSTHOG_KEY)) {
      return;
    }

    let cancelled = false;

    import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) {
        return;
      }

      posthog.init(POSTHOG_KEY!, {
        api_host: "https://eu.i.posthog.com",
        cookieless_mode: "always",
        person_profiles: "never",

        // `defaults` is what switches `capture_pageview` from the legacy
        // `true` (initial document load only) to `"history_change"`. Without
        // it, every `<Link>` navigation — which is all internal navigation in
        // an App Router site — goes uncaptured, and `$pageleave` goes with it,
        // taking dwell time and scroll depth along. Read from the shipped
        // bundle at posthog-js@1.398.2:
        //   capture_pageview: !t || "2025-05-24" > t || "history_change"
        //   capture_pageleave: "if_capture_pageview"
        defaults: "2025-05-24",
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Per-page engagement. Keyed on the pathname so scroll depth and dwell time
  // are measured per page and never accumulate across a client-side navigation.
  useEffect(() => {
    if (!shouldLoadPostHog(SITE_MARKET, POSTHOG_KEY)) {
      return;
    }

    const scroll = createScrollTracker();
    const engaged = createEngagedTimer(ENGAGED_THRESHOLD_MS);

    // The poll only runs while it can still learn something: it stops once the
    // threshold is reported, and while the tab is hidden — where the timer
    // accumulates nothing anyway, so ticking would be pure waste. A tab left
    // in a background window overnight costs nothing.
    let poll: ReturnType<typeof setInterval> | undefined;
    let engagedReported = false;

    const stopPolling = () => {
      clearInterval(poll);
      poll = undefined;
    };

    const reportEngaged = () => {
      if (engaged.hasEngaged(Date.now())) {
        engagedReported = true;
        track(ANALYTICS_EVENTS.pageEngaged, { path: pathname });
        stopPolling();
      }
    };

    const startPolling = () => {
      if (!engagedReported && poll === undefined) {
        poll = setInterval(reportEngaged, ENGAGED_POLL_MS);
      }
    };

    const reportScroll = () => {
      const crossed = scroll.crossed(
        window.scrollY,
        window.innerHeight,
        document.documentElement.scrollHeight,
      );

      for (const depth of crossed) {
        track(ANALYTICS_EVENTS.scrollDepth, { path: pathname, depth });
      }
    };

    const onVisibilityChange = () => {
      const now = Date.now();
      if (document.visibilityState === "visible") {
        engaged.resume(now);
        startPolling();
      } else {
        engaged.pause(now);
        stopPolling();
      }
    };

    if (document.visibilityState === "visible") {
      engaged.resume(Date.now());
      startPolling();
    }

    // A page can be entered already scrolled — an in-page anchor, or a browser
    // restoring a position — so the first measurement cannot wait for a scroll.
    reportScroll();

    window.addEventListener("scroll", reportScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopPolling();
      window.removeEventListener("scroll", reportScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname]);

  // Outbound clicks, by delegation — one listener instead of props threaded
  // through every external link in the tree.
  useEffect(() => {
    if (!shouldLoadPostHog(SITE_MARKET, POSTHOG_KEY)) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      // `document.baseURI` rather than `window.location`, which is a lint
      // error in this repo (see eslint.config.mjs — full page loads).
      let destination: URL;
      let current: URL;
      try {
        current = new URL(document.baseURI);
        destination = new URL(anchor.href, document.baseURI);
      } catch {
        return;
      }

      if (destination.host === current.host) {
        return;
      }

      // Telegram already reports itself as `contact.telegram_clicked`.
      // Counting one click as two events would quietly inflate exits.
      if (destination.host === "t.me") {
        return;
      }

      track(ANALYTICS_EVENTS.outboundClicked, { host: destination.host });
    };

    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return <>{children}</>;
}
