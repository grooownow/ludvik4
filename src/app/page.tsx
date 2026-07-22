import { MarketHome } from "@/features/site";

// Root `/` renders the market this build serves (SITE_MARKET). The market's
// language, copy, metadata and JSON-LD all come from the site slice.
export default function HomePage() {
  return <MarketHome />;
}
