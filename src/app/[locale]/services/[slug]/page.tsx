import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLocaleBundle,
  localePageMetadata,
  LocaleServiceSlug,
  parseLocaleParam,
} from "@/features/site";
import { prefixedLocales } from "@/lib/i18n";
import { env } from "@/lib/env";

// Detailed service pages and pricing tabs share /services/<slug>, as in EN.

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return prefixedLocales().flatMap((locale) => {
    const { servicePages, pricingServices } = getLocaleBundle(locale);
    return [...servicePages, ...pricingServices].map((page) => ({
      locale,
      slug: page.slug,
    }));
  });
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = parseLocaleParam(raw);
  if (!locale) return {};
  const { servicePages, pricingServices } = getLocaleBundle(locale);
  const service = servicePages.find((page) => page.slug === slug);
  const tab = pricingServices.find((s) => s.slug === slug);
  const meta = service
    ? { title: service.title, description: service.description }
    : tab && { title: tab.seoTitle, description: tab.lead };
  if (!meta) return {};
  return localePageMetadata(locale, `/services/${slug}`, meta);
}

export default async function LocaleServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: raw, slug } = await params;
  const locale = parseLocaleParam(raw);
  if (!locale) notFound();
  const page = LocaleServiceSlug({ locale, slug });
  if (!page) notFound();
  return page;
}
