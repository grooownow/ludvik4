import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  typedRoutes: !isStaticExport,
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),

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

        // Until ТЗ 1 the international landing lived at `/en`; the EN market
        // now owns the domain root, so that route is gone. External links
        // still point at it (the qa-pilot README "Made by" link), so keep
        // them alive instead of serving a 404. Static export has no redirect
        // support — the RU static build never published `/en` anyway.
        async redirects() {
          return [
            { source: "/en", destination: "/", permanent: true },
            { source: "/en/:path*", destination: "/", permanent: true },
          ];
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
