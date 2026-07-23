import { env } from "@/lib/env";
import { getMarketContent, type Market } from "./content";
import { buildSiteMetadata } from "./seo";

// Public API of the site (marketing home) slice. `app/` reads only from here.

export { MarketHome } from "./market-home";
export { PrivacyPage } from "./privacy-page";
export { getMarketContent, type Market, type MarketContent } from "./content";
export {
  buildSiteMetadata,
  buildHomeJsonLd,
  buildSitemap,
  buildRobots,
  type ArticleRef,
} from "./seo";

/** The market this build serves. */
export const MARKET: Market = env.SITE_MARKET;

/** The blog (+ RSS + articles) exists only in the Russian market. */
export const BLOG_ENABLED = env.SITE_MARKET === "ru";

/** Resolved content for this build's market. */
export const siteContent = getMarketContent(env.SITE_MARKET);

/** Root metadata for this build's market — consumed by `app/layout.tsx`. */
export const siteMetadata = buildSiteMetadata(siteContent, {
  baseUrl: env.NEXT_PUBLIC_APP_URL,
  hasBlog: BLOG_ENABLED,
  verification: {
    ...(env.GOOGLE_SITE_VERIFICATION && {
      google: env.GOOGLE_SITE_VERIFICATION,
    }),
    ...(env.YANDEX_VERIFICATION && { yandex: env.YANDEX_VERIFICATION }),
  },
});
