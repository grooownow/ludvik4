import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CaseStudyPageView,
  DEV_CASE_SLUGS,
  devRuCaseSite,
  getCaseGallery,
  getLocaleBundle,
  InternationalWorkView,
  localePageMetadata,
  parseLocaleParam,
} from "@/features/site";
import { type Locale, prefixedLocales } from "@/lib/i18n";
import { env } from "@/lib/env";

type Params = { locale: string; slug: string };
type DevSlug = (typeof DEV_CASE_SLUGS)[number];

// Russian shows every ludvik4.dev work as a screen gallery; Spanish keeps the
// text case studies of its own work list for now.
function slugsOf(locale: Locale): readonly string[] {
  return locale === "ru"
    ? DEV_CASE_SLUGS
    : getLocaleBundle(locale).caseStudies.map((item) => item.slug);
}

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return prefixedLocales().flatMap((locale) =>
    slugsOf(locale).map((slug) => ({ locale, slug })),
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
  const { caseStudies, ui } = getLocaleBundle(locale);
  if (locale === "ru") {
    const g = getCaseGallery(devRuCaseSite, slug);
    if (!g) return {};
    const titles = ui.meta.caseStudy(g.title);
    return localePageMetadata(locale, `/work/${slug}`, {
      title: titles.title,
      ogTitle: titles.ogTitle,
      description: g.line,
    });
  }
  const item = caseStudies.find((work) => work.slug === slug);
  if (!item) return {};
  const titles = ui.meta.caseStudy(item.title);
  return localePageMetadata(locale, `/work/${slug}`, {
    title: titles.title,
    ogTitle: titles.ogTitle,
    description: item.description,
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
  if (locale === "ru") {
    if (!getCaseGallery(devRuCaseSite, slug)) notFound();
    return (
      <CaseStudyPageView
        site={devRuCaseSite}
        slug={slug as DevSlug}
        baseUrl={env.NEXT_PUBLIC_APP_URL}
      />
    );
  }
  const item = getLocaleBundle(locale).caseStudies.find(
    (work) => work.slug === slug,
  );
  if (!item) notFound();
  return (
    <InternationalWorkView
      item={item}
      baseUrl={env.NEXT_PUBLIC_APP_URL}
      locale={locale}
    />
  );
}
