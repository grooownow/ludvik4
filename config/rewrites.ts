/**
 * Build-level rewrites, per market — the serving layer for the Gridfin
 * landing bundle on the EN domain. Kept out of next.config.ts for the same
 * reason as config/redirects.ts: both markets' rule sets get asserted in one
 * unit test (src/lib/rewrites.test.ts), which the one-market-at-a-time e2e
 * suite can never do.
 *
 * The bundle is plain static HTML committed under public/gridfin/ (built in
 * grooownow/gridfin from marketing/landing — ludvik4 holds output only,
 * never the source; see ADR 0005). Next serves public/ files at exact paths
 * with no directory-index resolution, so /gridfin/en has nothing to match
 * until a rewrite appends /index.html.
 *
 * URL style is deliberately slashless (/gridfin/en, not /gridfin/en/): the
 * EN app runs with Next's default trailingSlash=false, which 308-redirects
 * any trailing-slash URL before middleware or rewrites can see it. Overriding
 * that globally (trailingSlash or skipTrailingSlashRedirect) would change
 * routing for every studio page on a site that is already indexed — all risk
 * stays confined to /gridfin instead. The generator emits slashless
 * canonicals/hreflang for these locales to match (RU keeps directory-index
 * URLs on its own static host).
 *
 * These are afterFiles rewrites: real files (/gridfin/assets/*.png,
 * /gridfin/sitemap.xml) match the filesystem first and are never rewritten.
 * With no bundle committed the destinations resolve to nothing and /gridfin*
 * stays 404 — the rules are dormant, not a promise.
 *
 * Static export (`STATIC_EXPORT=true`, the RU build) supports no rewrites;
 * next.config.ts wires this into the Node build only.
 */

import type { Market } from "./redirects";

type Rewrite = {
  source: string;
  destination: string;
};

export function buildRewrites(market: Market): Rewrite[] {
  // RU serves its own bundle from out/gridfin on the static host; the Node
  // build only ever runs for RU in tests/e2e, where /gridfin must behave
  // like production RU (absent) rather than sprout dev-only routes.
  if (market !== "en") return [];

  return [
    { source: "/gridfin", destination: "/gridfin/index.html" },
    { source: "/gridfin/:path*", destination: "/gridfin/:path*/index.html" },
  ];
}
