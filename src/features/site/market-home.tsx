import { env } from "@/lib/env";
import { getMarketContent } from "./content";

// Root `/` for whichever market this build serves. One build = one market.
//
// The branch keys off `process.env.SITE_MARKET`, which next.config.ts inlines as
// a build-time constant — so webpack dead-code-eliminates the unused branch,
// INCLUDING its dynamic import(). The EN home pulls in the lead form and its
// "use server" action; keeping that import inside the eliminated branch is what
// guarantees the RU build never bundles (or registers) the lead backend
// (brief §Контакты). Runtime SEO gating elsewhere reads the validated
// `env.SITE_MARKET`; here we need the inlinable raw access.
export async function MarketHome() {
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  if (process.env.SITE_MARKET === "en") {
    const { HomeEn } = await import("./home-en");
    return (
      <HomeEn
        content={getMarketContent("en")}
        baseUrl={baseUrl}
        turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      />
    );
  }

  const { HomeRu } = await import("./home-ru");
  return <HomeRu content={getMarketContent("ru")} baseUrl={baseUrl} />;
}
