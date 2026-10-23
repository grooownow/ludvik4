import { env } from "@/lib/env";
import { getMarketContent } from "./content";
import { Home } from "./home";
import { homeExhibits } from "./home-exhibits";

// Root `/` for whichever market this build serves. One build = one market.
// Both markets render the exhibition home (docs/specs/immersive-home.md). It
// imports no lead form: the form lives on /contact, where the EN-only dynamic
// import keeps the lead backend out of the RU build. The old homes
// (home-en.tsx, home-ru.tsx) stay in the repo, unrendered, by owner decision.
export function MarketHome() {
  const market = env.SITE_MARKET;
  return (
    <Home
      content={getMarketContent(market)}
      exhibits={homeExhibits(market)}
      baseUrl={env.NEXT_PUBLIC_APP_URL}
    />
  );
}
