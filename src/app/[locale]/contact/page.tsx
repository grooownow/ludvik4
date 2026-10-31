import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLocaleBundle,
  LocaleContact,
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
    "/contact",
    getLocaleBundle(locale).ui.meta.contact,
  );
}

export default async function LocaleContactPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const locale = parseLocaleParam((await params).locale);
  if (!locale) notFound();
  return <LocaleContact locale={locale} />;
}
