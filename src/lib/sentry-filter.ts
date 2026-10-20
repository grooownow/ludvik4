/**
 * Sentry `beforeSend` filters for the browser SDK (src/instrumentation-client.ts).
 * Returning null from `beforeSend` drops the event (@sentry/core 10.x,
 * `Options.beforeSend` in types/options.d.ts).
 *
 * Turnstile's site key only allows the production host, so on per-deployment
 * `*.vercel.app` URLs (visited by headless checks after every deploy) the
 * widget throws `TurnstileError` 110200 "unknown domain". That is expected
 * there and says nothing about real visitors, so it is dropped; the same error
 * on the production host still reaches Sentry. The page URL comes from the
 * event itself (`event.request.url`, set by the browser SDK).
 */

type ExceptionEvent = {
  exception?: { values?: Array<{ type?: string }> };
  request?: { url?: string };
};

export function dropOffDomainTurnstile<E extends ExceptionEvent>(
  event: E,
  appUrl: string | undefined,
): E | null {
  const isTurnstile = event.exception?.values?.some(
    (value) => value.type === "TurnstileError",
  );
  const pageUrl = event.request?.url;
  if (!isTurnstile || !appUrl || !pageUrl) return event;
  return new URL(pageUrl).hostname === new URL(appUrl).hostname ? event : null;
}
