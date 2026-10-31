import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getInternationalPricingService,
  getInternationalService,
  getMarketContent,
  internationalPricingCatalog,
  internationalPricingServices,
  InternationalServiceView,
  internationalServicePages,
  PricingPageView,
  languageAlternates,
} from "@/features/site";
import { env } from "@/lib/env";

// Two kinds of pages share /services/<slug> (EN only), as on RU's /uslugi: the
// detailed service pages and each pricing tab's own page. Slugs never overlap.

type Params = { slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return [...internationalServicePages, ...internationalPricingServices].map(
    (page) => ({ slug: page.slug }),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (env.SITE_MARKET !== "en") return {};
  const service = getInternationalService(slug);
  const tab = getInternationalPricingService(slug);
  const page =
    service ?? (tab && { title: tab.seoTitle, description: tab.lead });
  if (!page) return {};
  const path = `/services/${slug}`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path, ...languageAlternates(path) },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
    },
  };
}

export default async function InternationalServiceRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (env.SITE_MARKET !== "en") notFound();

  const service = getInternationalService(slug);
  if (service) {
    return (
      <InternationalServiceView
        service={service}
        baseUrl={env.NEXT_PUBLIC_APP_URL}
      />
    );
  }
  const tab = getInternationalPricingService(slug);
  if (!tab) notFound();
  return (
    <PricingPageView
      content={getMarketContent("en")}
      activeId={tab.id}
      baseUrl={env.NEXT_PUBLIC_APP_URL}
      catalog={internationalPricingCatalog}
    />
  );
}
