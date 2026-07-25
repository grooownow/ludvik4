/**
 * Build-level redirects, per market. Kept out of next.config.ts so both
 * markets' rule sets can be asserted in one unit test (src/lib/redirects.test.ts)
 * — the e2e suite boots exactly one market at a time and can never cover both.
 *
 * Static export (`STATIC_EXPORT=true`, the RU build) has no redirect support,
 * so next.config.ts only wires this into the Node build.
 */

/**
 * The RU market's own domain (ТЗ 2). RU is served from separate, RU-reachable
 * infrastructure; the two markets share nothing but this repo.
 */
export const RU_SITE_URL = "https://ludvik4.ru";

export type Market = "ru" | "en";

type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export function buildRedirects(market: Market): Redirect[] {
  return [
    // Until ТЗ 1 the international landing lived at /en; the EN market now
    // owns the domain root. External links still point at the old URL (the
    // qa-pilot README "Made by" link), so it answers with a permanent
    // redirect instead of a 404.
    { source: "/en", destination: "/", permanent: true },
    { source: "/en/:path*", destination: "/", permanent: true },

    // The Russian blog moved to the RU domain with every slug unchanged, so
    // accumulated search signals and external links (vc.ru) survive the split.
    // EN only: on the RU build these paths ARE the blog, and redirecting them
    // would send the RU site to itself.
    ...(market === "en"
      ? [
          {
            source: "/blog",
            destination: `${RU_SITE_URL}/blog`,
            permanent: true,
          },
          {
            source: "/blog/:path*",
            destination: `${RU_SITE_URL}/blog/:path*`,
            permanent: true,
          },
        ]
      : []),
  ];
}
