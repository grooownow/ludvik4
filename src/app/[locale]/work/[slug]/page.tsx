import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLocaleBundle,
  InternationalWorkView,
  localePageMetadata,
  parseLocaleParam,
} from "@/features/site";
import { prefixedLocales } from "@/lib/i18n";
import { env } from "@/lib/env";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return prefixedLocales().flatMap((locale) =>
    getLocaleBundle(locale).caseStudies.map((item) => ({
      locale,
      slug: item.slug,
    })),
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
