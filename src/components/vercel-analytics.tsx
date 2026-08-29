"use client";

import { Analytics } from "@vercel/analytics/next";
import { internalStore, isInternalDevice } from "@/lib/analytics";

/**
 * Vercel Web Analytics, muted on the owner's own devices.
 *
 * PostHog is silenced further up, inside `analyticsEnabled()` — but Vercel's
 * script is mounted from the root layout and knows nothing about that, so
 * without this wrapper the owner would keep inflating the one number the
 * traffic baseline is for. `beforeSend` returning `null` cancels the event;
 * read from the installed `@vercel/analytics@2.0.1` types: "A middleware
 * function to modify events before they are sent. Should return the event
 * object or `null` to cancel the event."
 *
 * This is a client component only because `beforeSend` is a function, and the
 * root layout that renders `<Analytics>` is a server one.
 *
 * The check is per event rather than hoisted into a `useState`: a visitor can
 * mute themselves mid-session by opening `?ludvik4_internal=1`, and the next
 * pageview should already be gone.
 */
export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => (isInternalDevice(internalStore()) ? null : event)}
    />
  );
}
