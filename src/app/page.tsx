import type { Metadata, Viewport } from "next";
import { languageAlternates, MARKET, MarketHome } from "@/features/site";

// Browser chrome that tints itself from the page (Safari, mobile Chrome)
// matches the top of the exhibit stage, sampled from its still.
export const viewport: Viewport = { themeColor: "#ffe0fa" };

// ludvik4.dev's home links its Spanish version (hreflang); the RSS alternate
// is repeated because a page's `alternates` replaces the layout's.
export const metadata: Metadata =
  MARKET === "en"
    ? {
        alternates: {
          canonical: "/",
          ...languageAlternates("/"),
          types: { "application/rss+xml": "/blog/rss.xml" },
        },
      }
    : {};

// Root `/` renders the market this build serves (SITE_MARKET). The market's
// language, copy, metadata and JSON-LD all come from the site slice.
export default function HomePage() {
  return <MarketHome />;
}
