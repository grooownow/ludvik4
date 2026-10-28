import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  canonicalPath,
  getMarketContent,
  getPricingServiceBySlug,
  getServicePage,
  PricingPageView,
  pricingServices,
  ServicePageView,
  servicePages,
} from "@/features/site";
import { env } from "@/lib/env";

// Two kinds of pages share /uslugi/<slug> (RU only): the older detailed
// service pages and each pricing tab's own page. Their slugs never overlap.

type Params = { slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "ru") return [];
  return [
    ...servicePages.map((page) => ({ slug: page.slug })),
    ...pricingServices.map((service) => ({ slug: service.slug })),
  ];
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (env.SITE_MARKET !== "ru") return {};
  const path = canonicalPath("ru", `/uslugi/${slug}`);
  const page =
    getServicePage(slug) ??
    (() => {
      const tab = getPricingServiceBySlug(slug);
      return tab && { title: tab.seoTitle, description: tab.lead };
    })();
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      images: ["/og-image-ru.png"],
    },
  };
}

export default async function ServiceRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (env.SITE_MARKET !== "ru") notFound();

  const service = getServicePage(slug);
  if (service) {
    return (
      <ServicePageView service={service} baseUrl={env.NEXT_PUBLIC_APP_URL} />
    );
  }
  const tab = getPricingServiceBySlug(slug);
  if (!tab) notFound();
  return (
    <PricingPageView
      content={getMarketContent("ru")}
      activeId={tab.id}
      baseUrl={env.NEXT_PUBLIC_APP_URL}
    />
  );
}
