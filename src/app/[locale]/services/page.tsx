import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLocaleBundle,
  LocalePricing,
  localePageMetadata,
  parseLocaleParam,
} from "@/features/site";

type Params = { locale: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const locale = parseLocaleParam((await params).locale);
  if (!locale) return {};
  return localePageMetadata(
    locale,
    "/services",
    getLocaleBundle(locale).ui.meta.services,
  );
}

export default async function LocaleServicesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const locale = parseLocaleParam((await params).locale);
  if (!locale) notFound();
  return <LocalePricing locale={locale} />;
}
