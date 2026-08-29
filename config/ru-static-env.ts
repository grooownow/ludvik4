/**
 * The environment `next build` runs under for the RU static export.
 *
 * Kept out of `scripts/build-ru-static.ts` so it can be asserted in a unit test
 * (`src/lib/ru-static-env.test.ts`) — same split, and for the same reason, as
 * `config/redirects.ts`: the script itself spawns a real build on import, so
 * nothing inside it is testable without running one.
 *
 * ## Why the public analytics vars are blanked
 *
 * `ludvik4.ru` serves the Russian market, where shipping a foreign analytics
 * or error-reporting service is a legal problem rather than a taste one. The
 * runtime already refuses to start either — `shouldLoadPostHog` (src/lib/analytics.ts)
 * requires `market === "en"`, and `src/instrumentation-client.ts` requires a DSN
 * — and a browser check of the live site confirms the RU storefront makes no
 * third-party request at all.
 *
 * But that guarantee lives in an `if`. Next.js inlines every `NEXT_PUBLIC_*`
 * value it can see at build time, so while Timeweb's deploy settings still
 * carry `NEXT_PUBLIC_POSTHOG_KEY` (see `docs/playbooks/production-ru-timeweb.md`),
 * the key literal is compiled into JavaScript served from ludvik4.ru — dead
 * data nothing calls, and still a foreign service's identifier sitting in a
 * Russian-market artifact for anyone who greps the bundle. Blanking the vars
 * here moves the guarantee from "no code path reaches it" to "it was never in
 * the build", which survives someone later removing the runtime gate.
 *
 * ## Why empty strings rather than deleting the keys
 *
 * Deleting them would let Next.js repopulate the values from `.env` /
 * `.env.production`, which it loads itself. An empty string wins instead. Read
 * from the installed `@next/env@16.2.11` (`dist/index.js`) rather than from
 * memory: `processEnv()` copies the initial environment into `l` and applies a
 * parsed `.env` entry only `if (typeof l[t] === "undefined")`. An empty string
 * is a string, so the file value is skipped and the blank survives to the
 * inliner.
 */

/**
 * Public build-time vars that must not reach the RU artifact. `NEXT_PUBLIC_*`
 * only — a server-side var (`SENTRY_DSN`) is never inlined into a client bundle,
 * and the static export has no server runtime to read one anyway.
 */
export const RU_BLANKED_PUBLIC_ENV = [
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_SENTRY_DSN",
] as const;

export const RU_APP_URL = "https://ludvik4.ru";

/**
 * Builds the child environment for the RU `next build`, given the environment
 * the script itself was started with (Timeweb's, or a developer's shell).
 */
export function ruStaticEnv(base: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...base,
    STATIC_EXPORT: "true",
    SITE_MARKET: "ru",
    NEXT_PUBLIC_APP_URL: base.NEXT_PUBLIC_APP_URL ?? RU_APP_URL,
  };

  for (const key of RU_BLANKED_PUBLIC_ENV) {
    env[key] = "";
  }

  return env;
}
