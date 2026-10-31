import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMarketContent,
  internationalPricingCatalog,
  PricingPageView,
} from "@/features/site";
import { env } from "@/lib/env";

// Services and prices (EN only): the hub, first tab open. Each tab also has
// its own page, /services/<slug>.
const description =
  "Landing pages, websites, web apps, animations and automations: what each package includes, timelines and prices in euros.";

export const metadata: Metadata = {
  title: "Services and Prices",
  description,
  alternates: { canonical: "/services" },
  openGraph: { url: "/services", title: "Services and Prices", description },
};

export default function InternationalPricingRoute() {
  if (env.SITE_MARKET !== "en") notFound();
  return (
    <PricingPageView
      content={getMarketContent("en")}
      catalog={internationalPricingCatalog}
    />
  );
}
