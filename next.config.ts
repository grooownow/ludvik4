import type { NextConfig } from "next";
import { buildRedirects, type Market } from "./config/redirects";
import { buildRewrites } from "./config/rewrites";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const market: Market = process.env.SITE_MARKET === "en" ? "en" : "ru";

const nextConfig: NextConfig = {
  typedRoutes: !isStaticExport,
  ...(isStaticExport
    ? {
        output: "export",
        // Timeweb serves clean URLs as directories. Exporting
        // `/cases/index.html` instead of `/cases.html` keeps every nested page
        // reachable without provider-specific rewrite rules.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        // Next 16 only serves the quality levels listed here (default: [75]),
        // and silently falls back to 75 for anything else. The hero
        // illustration is a large flat-colour vector export where 75 shows
        // visible banding on the thin pink lines, so it asks for 95.
        images: { qualities: [75, 95] },
      }),

  // Inline SITE_MARKET as a build-time constant so the market dispatcher
  // (src/features/site/market-home.tsx) can dead-code-eliminate the other
  // market's home — and, critically, keep the EN lead form + its "use server"
  // action out of the RU build entirely (brief §Контакты: RU has no lead
  // backend). Runtime code still reads the validated value via src/lib/env.ts.
  env: { SITE_MARKET: process.env.SITE_MARKET ?? "ru" },

  // PGlite ships a WASM binary and resolves its own assets through Node's
  // fs/URL APIs. Bundled into a server chunk it ends up with a second `URL`
  // realm, so Node rejects its own path argument at request time:
  // `ERR_INVALID_ARG_TYPE: ... must be ... an instance of URL. Received an
  // instance of URL`. Loading it via native `require` keeps one realm.
  // Reproduced by tests/e2e/auth.spec.ts: without this, a real credentials
  // sign-in (a Server Action) crashes in the production build.
  serverExternalPackages: ["@electric-sql/pglite"],

  // Security headers baseline. A full Content-Security-Policy is
  // deliberately deferred: a naive CSP breaks agent-added inline scripts
  // in this skeleton. See docs/rules/security.md for the CSP
  // rollout plan.
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                { key: "X-Frame-Options", value: "DENY" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ];
        },

        // Retired URLs, per market — config/redirects.ts documents what each
        // rule preserves and why. Static export has no redirect support, so
        // this stays on the Node build's side of the branch.
        async redirects() {
          return buildRedirects(market);
        },
        // Serving layer for the static Gridfin bundle under public/gridfin/
        // (EN only, dormant until the bundle is committed) — the rationale
        // and the slashless URL decision live in config/rewrites.ts and
        // ADR 0005. afterFiles: real bundle files always win over rewrites.
        async rewrites() {
          return { afterFiles: buildRewrites(market) };
        },
      }),
};

// Sentry (@sentry/nextjs): deliberately NOT wrapped in `withSentryConfig`.
// That wrapper's job is (a) uploading source maps at build time and
// (b) auto-instrumenting API routes/middleware via a webpack/turbopack
// plugin — neither is wired up in this slot (no `SENTRY_AUTH_TOKEN`, no CI
// upload step; see .env.example). Request-error capture already works via
// the native `onRequestError` hook in src/instrumentation.ts, and client
// capture via src/instrumentation-client.ts, without any build-time
// transform. Skipping the wrapper means: no Sentry tunnel route, no extra
// build step, no dependency on `@sentry/cli` at build time — fewer moving
// parts for a starter kit. A buyer who wants source maps / auto-instrumented
// routes later can add the wrapper + run the full Sentry wizard.
export default nextConfig;
