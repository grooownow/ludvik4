import type { Viewport } from "next";
import { MarketHome } from "@/features/site";

// Browser chrome that tints itself from the page (Safari, mobile Chrome)
// matches the top of the exhibit stage, sampled from its still.
export const viewport: Viewport = { themeColor: "#ffe0fa" };

// Root `/` renders the market this build serves (SITE_MARKET). The market's
// language, copy, metadata and JSON-LD all come from the site slice.
export default function HomePage() {
  return <MarketHome />;
}
