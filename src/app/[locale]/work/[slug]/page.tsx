import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CaseStudyPageView,
  DEV_CASE_SLUGS,
  devRuCaseSite,
  esCaseSite,
  getCaseGallery,
  getLocaleBundle,
  localePageMetadata,
  parseLocaleParam,
} from "@/features/site";
import { type Locale, prefixedLocales } from "@/lib/i18n";
import { env } from "@/lib/env";

type Params = { locale: string; slug: string };
type DevSlug = (typeof DEV_CASE_SLUGS)[number];

// Spanish and Russian show every ludvik4.dev work as a screen gallery.
const siteOf = (locale: Locale) =>
  locale === "ru" ? devRuCaseSite : esCaseSite;

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return prefixedLocales().flatMap((locale) =>
    DEV_CASE_SLUGS.map((slug) => ({ locale, slug })),
  );
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
  const site = siteOf(locale);
  const g = getCaseGallery(site, slug);
  if (!g) return {};
  const titles = getLocaleBundle(locale).ui.meta.caseStudy(g.title);
  return localePageMetadata(locale, `/work/${slug}`, {
    title: titles.title,
    ogTitle: titles.ogTitle,
    description: g.line,
  });
}

export default async function LocaleWorkItemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale: raw, slug } = await params;
  const locale = parseLocaleParam(raw);
  if (!locale) notFound();
  const site = siteOf(locale);
  if (!getCaseGallery(site, slug)) notFound();
  return (
    <CaseStudyPageView
      site={site}
      slug={slug as DevSlug}
      baseUrl={env.NEXT_PUBLIC_APP_URL}
    />
  );
}
