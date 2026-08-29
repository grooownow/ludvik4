/**
 * Analytics core — pure, React-free, node-testable.
 *
 * Two providers with different jobs (see `docs/specs/analytics-events.md`):
 * Vercel Web Analytics carries the traffic baseline and the geolocation
 * PostHog cannot see (cookieless server hash mode strips the IP before
 * enrichment runs), and PostHog carries the named behavioural events.
 * Both are international-market only.
 */

/** Keep optional analytics aligned with the per-market privacy contract. */
export function shouldLoadPostHog(
  market: string | undefined,
  publicKey: string | undefined,
): boolean {
  return market === "en" && Boolean(publicKey);
}

/**
 * The RU storefront is a static export served from Timeweb, where the
 * `/_vercel/insights/*` routes do not exist — shipping the script there would
 * only produce 404s. Mirrors `shouldLoadPostHog`'s market gate; no key to
 * check, because Vercel injects the script path at build time.
 */
export function shouldLoadVercelAnalytics(market: string | undefined): boolean {
  return market === "en";
}

/**
 * The event catalog. Named events exist only where a click carries business
 * meaning; posthog-js autocapture already records the long tail.
 *
 * Naming follows `docs/playbooks/analytics.md`: `area.object_action`. A shipped
 * name is never renamed — old data does not follow it — which is why this is a
 * frozen constant a test can assert against rather than string literals spread
 * across call sites.
 */
export const ANALYTICS_EVENTS = {
  ctaClicked: "cta.clicked",
  telegramClicked: "contact.telegram_clicked",
  leadFormStarted: "lead.form_started",
  leadFormSubmitted: "lead.form_submitted",
  leadFormFailed: "lead.form_failed",
  leadFormAbandoned: "lead.form_abandoned",
  pageEngaged: "page.engaged",
  scrollDepth: "content.scroll_depth",
  outboundClicked: "nav.outbound_clicked",
  faqItemOpened: "faq.item_opened",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** Allowed property values. Never user-entered text — see the spec's edge cases. */
export type AnalyticsProperties = Record<string, string | number | boolean>;

/**
 * Muting the people who build the site.
 *
 * The owner is by far the heaviest visitor of their own site — the first
 * traffic audit found 36 of 73 sessions were theirs — and cookieless mode
 * leaves nothing to exclude them by after the fact: PostHog's own
 * internal-user filtering keys on person properties, and this project creates
 * no persons. Guessing from device fingerprints works only until a real
 * visitor shares a timezone with the owner.
 *
 * So the device says so itself. Opening any page with `?ludvik4_internal=1`
 * remembers the answer and every analytics path goes quiet; `=0` undoes it.
 *
 * Two consequences worth knowing before wondering why events still arrive:
 * the answer lives in `localStorage`, so it is **per browser and per device**
 * (the phone and the laptop are two separate decisions, and so are Safari and
 * Chrome on the same phone), and `localStorage` is per origin, so muting
 * ludvik4.dev says nothing about ludvik4.ru.
 */
export const INTERNAL_PARAM = "ludvik4_internal";

/** Namespaced, because localStorage is one flat map shared with everything. */
export const INTERNAL_STORAGE_KEY = "ludvik4:internal";

/** The slice of `Storage` this needs — injected so the tests need no jsdom. */
export type InternalStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/**
 * What `?ludvik4_internal=…` asked for, or `null` when it was not asked.
 *
 * Anything but an explicit off is an on: a bare `?ludvik4_internal` typed from
 * a phone should mute rather than silently do nothing.
 */
export function readInternalParam(search: string): boolean | null {
  const raw = new URLSearchParams(search).get(INTERNAL_PARAM);
  if (raw === null) {
    return null;
  }

  return !["0", "false", "off", "no"].includes(raw.trim().toLowerCase());
}

/** Whether this browser has been muted. */
export function isInternalDevice(store: InternalStore | null): boolean {
  try {
    return store?.getItem(INTERNAL_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Remember the answer. Un-muting removes the key rather than storing a "0". */
export function rememberInternalDevice(
  store: InternalStore | null,
  internal: boolean,
): void {
  try {
    if (internal) {
      store?.setItem(INTERNAL_STORAGE_KEY, "1");
    } else {
      store?.removeItem(INTERNAL_STORAGE_KEY);
    }
  } catch {
    // Private windows, blocked site data and storage quotas all throw here.
    // Failing to remember is not worth breaking a page render over — the
    // visitor stays counted, which is the same as before this existed.
  }
}

/**
 * `localStorage`, or `null` where there is none.
 *
 * The property access itself throws in browsers configured to block site data,
 * which is why this is a function with a `try` rather than a module constant.
 */
export function internalStore(): InternalStore | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * The single capture choke point.
 *
 * `process.env` is read here rather than at module scope so the values stay
 * directly inlinable by Next.js (it substitutes the literal
 * `process.env.NEXT_PUBLIC_*` text wherever it appears) while remaining
 * stubbable in tests.
 *
 * The `posthog-js` import stays *inside* the guard on purpose: that is what
 * keeps it in its own async chunk, only requested when a key is present. A
 * top-level import would ship the library in the initial bundle regardless of
 * the runtime check. Every new call site inherits that contract through this
 * function — do not reintroduce inline imports at call sites.
 */
export function analyticsEnabled(): boolean {
  return (
    shouldLoadPostHog(
      process.env.SITE_MARKET,
      process.env.NEXT_PUBLIC_POSTHOG_KEY,
    ) && !isInternalDevice(internalStore())
  );
}

export function track(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties,
): void {
  if (!analyticsEnabled()) {
    return;
  }

  void import("posthog-js").then(({ default: posthog }) => {
    posthog.capture(event, properties);
  });
}

/**
 * Whether the visitor has made an explicit choice about cookies.
 *
 * `pending` is not a third kind of refusal: with `cookieless_mode: "on_reject"`
 * and `opt_out_capturing_by_default: true`, a pending visitor is captured
 * cookielessly exactly like a denying one. Consent adds cookies, a persistent
 * id and session replay — it does not switch analytics on.
 */
export type ConsentStatus = "granted" | "denied" | "pending";

/** The explicit choice, or `null` when analytics is off entirely. */
export async function readConsent(): Promise<ConsentStatus | null> {
  if (!analyticsEnabled()) {
    return null;
  }

  const { default: posthog } = await import("posthog-js");
  return posthog.get_explicit_consent_status();
}

/** Record the visitor's choice. Granting is what starts cookie-based capture. */
export async function setConsent(granted: boolean): Promise<void> {
  if (!analyticsEnabled()) {
    return;
  }

  const { default: posthog } = await import("posthog-js");
  if (granted) {
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
  }
}

/**
 * Forget the choice, returning the visitor to `pending`.
 *
 * This is the withdrawal path: GDPR wants withdrawing consent to be as easy as
 * giving it, so the banner comes back and the visitor can decide again.
 */
export async function clearConsent(): Promise<void> {
  if (!analyticsEnabled()) {
    return;
  }

  const { default: posthog } = await import("posthog-js");
  posthog.clear_opt_in_out_capturing();
}

/**
 * Session replay, started only by an explicit grant and stopped the moment one
 * is withdrawn.
 *
 * These live here rather than being called on the SDK directly so they inherit
 * the same guard as everything else in this module: with no key, no posthog-js
 * chunk is ever requested.
 */
export async function startReplay(): Promise<void> {
  if (!analyticsEnabled()) {
    return;
  }

  const { default: posthog } = await import("posthog-js");
  posthog.startSessionRecording();
}

export async function stopReplay(): Promise<void> {
  if (!analyticsEnabled()) {
    return;
  }

  const { default: posthog } = await import("posthog-js");
  posthog.stopSessionRecording();
}

export const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

export type ScrollMilestone = (typeof SCROLL_MILESTONES)[number];

/**
 * The deepest milestone reached, as a share of the document the visitor has
 * seen — `null` below the first milestone, and `null` when the page does not
 * scroll at all.
 *
 * The short-page case is the one worth stating: a page whose content fits the
 * viewport is 100% "seen" the instant it paints, and reporting that as a
 * completed scroll would make every such page look perfectly read.
 */
export function scrollMilestone(
  scrollTop: number,
  viewportHeight: number,
  documentHeight: number,
): ScrollMilestone | null {
  if (documentHeight - viewportHeight <= 0) {
    return null;
  }

  const seenPercentage = ((scrollTop + viewportHeight) / documentHeight) * 100;

  let reached: ScrollMilestone | null = null;
  for (const milestone of SCROLL_MILESTONES) {
    if (seenPercentage >= milestone) {
      reached = milestone;
    }
  }

  return reached;
}

/**
 * Emits each milestone at most once per page.
 *
 * A visitor who jumps straight to the footer crosses every milestone at once,
 * and all of them are returned rather than only the deepest: a funnel built on
 * 25 → 50 → 75 → 100 would otherwise show an arrival at 100 with no steps
 * leading to it.
 */
export function createScrollTracker() {
  let deepestReported = 0;

  return {
    crossed(
      scrollTop: number,
      viewportHeight: number,
      documentHeight: number,
    ): ScrollMilestone[] {
      const reached = scrollMilestone(
        scrollTop,
        viewportHeight,
        documentHeight,
      );
      if (reached === null || reached <= deepestReported) {
        return [];
      }

      const newly = SCROLL_MILESTONES.filter(
        (milestone) => milestone > deepestReported && milestone <= reached,
      );
      deepestReported = reached;
      return newly;
    },
  };
}

/**
 * Accumulates only the time the tab was actually visible, and reports crossing
 * the threshold exactly once.
 *
 * Timestamps are injected rather than read from a clock so this stays pure and
 * its test needs neither sleeps nor fake timers (`docs/rules/testing.md`).
 * A tab left open in a background window for an hour is not engagement.
 */
export function createEngagedTimer(thresholdMs: number) {
  let accumulatedMs = 0;
  let visibleSince: number | null = null;
  let reported = false;

  return {
    resume(now: number): void {
      if (visibleSince === null) {
        visibleSince = now;
      }
    },

    pause(now: number): void {
      if (visibleSince !== null) {
        accumulatedMs += now - visibleSince;
        visibleSince = null;
      }
    },

    /** True the first time the threshold is met, false every other time. */
    hasEngaged(now: number): boolean {
      if (reported) {
        return false;
      }

      const total =
        accumulatedMs + (visibleSince === null ? 0 : now - visibleSince);
      if (total < thresholdMs) {
        return false;
      }

      reported = true;
      return true;
    },
  };
}
