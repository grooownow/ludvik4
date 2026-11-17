import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CasesIndexView,
  devRuCaseSite,
  getLocaleBundle,
  InternationalWorkIndexView,
  localePageMetadata,
  parseLocaleParam,
} from "@/features/site";
import { env } from "@/lib/env";

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
    "/work",
    getLocaleBundle(locale).ui.meta.work,
  );
}

export default async function LocaleWorkPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const locale = parseLocaleParam((await params).locale);
  if (!locale) notFound();
  // Russian has the screen gallery; Spanish keeps the text cards for now.
  if (locale === "ru") {
    return (
      <CasesIndexView site={devRuCaseSite} baseUrl={env.NEXT_PUBLIC_APP_URL} />
    );
  }
  return <InternationalWorkIndexView locale={locale} />;
}
