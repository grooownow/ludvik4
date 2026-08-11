import { env } from "@/lib/env";
import { getMarketContent, type Market } from "./content";
import { buildSiteMetadata } from "./seo";

// Public API of the site (marketing home) slice. `app/` reads only from here.

export { MarketHome } from "./market-home";
export { PrivacyPage } from "./privacy-page";
export { SiteHeader } from "./site-chrome";
export { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
export { getMarketContent, type Market, type MarketContent } from "./content";
export {
  caseStudies,
  getCaseStudy,
  getServicePage,
  servicePages,
  type CaseStudy,
  type ServicePage,
} from "./commercial-content";
export {
  CasesIndexView,
  CasesPreview,
  CaseStudyPageView,
  ServicePageView,
} from "./commercial-pages";
export {
  getInternationalGuide,
  getInternationalService,
  getInternationalWork,
  internationalFaq,
  internationalGuides,
  internationalServicePages,
  internationalWork,
  type InternationalGuide,
  type InternationalServicePage,
  type InternationalWorkItem,
} from "./international-content";
export {
  InternationalAboutView,
  InternationalGuideIndexView,
  InternationalGuideView,
  InternationalServiceView,
  InternationalWorkIndexView,
  InternationalWorkView,
} from "./international-pages";
export { buildHumansTxt, buildSecurityTxt } from "./service-files";
export {
  buildSiteMetadata,
  buildHomeJsonLd,
  buildSitemap,
  buildRobots,
  canonicalPath,
  publicUrl,
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
    ...(env.SITE_MARKET === "ru" && {
      google: "G5O_0s3CKx2RtlIVLJdoOUr-4UbeLCaWJj66HcQmrlQ",
      yandex: "c5013f9ae7a28ef4",
      other: {
        "zen-verification":
          "e6h1u9CR24KoSJLaDqT7Nvm2K1DMC6PEIbplq2l5MUmKTIc3v1vpdCyJbf2oHRU",
      },
    }),
    ...(env.GOOGLE_SITE_VERIFICATION && {
      google: env.GOOGLE_SITE_VERIFICATION,
    }),
    ...(env.YANDEX_VERIFICATION && { yandex: env.YANDEX_VERIFICATION }),
  },
});
