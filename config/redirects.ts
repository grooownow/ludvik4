/**
 * Build-level redirects, per market. Kept out of next.config.ts so both
 * markets' rule sets can be asserted in one unit test (src/lib/redirects.test.ts)
 * — the e2e suite boots exactly one market at a time and can never cover both.
 *
 * Static export (`STATIC_EXPORT=true`, the RU build) has no redirect support,
 * so next.config.ts only wires this into the Node build.
 */

export type Market = "ru" | "en";

type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export function buildRedirects(_market: Market): Redirect[] {
  return [
    // Until ТЗ 1 the international landing lived at /en; the EN market now
    // owns the domain root. External links still point at the old URL (the
    // qa-pilot README "Made by" link), so it answers with a permanent
    // redirect instead of a 404.
    { source: "/en", destination: "/", permanent: true },
    { source: "/en/:path*", destination: "/", permanent: true },
  ];
}
