import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import {
  LocaleHome,
  localeHomeMetadata,
  parseLocaleParam,
} from "@/features/site";

export const viewport: Viewport = { themeColor: "#ffe0fa" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = parseLocaleParam((await params).locale);
  return locale ? localeHomeMetadata(locale) : {};
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = parseLocaleParam((await params).locale);
  if (!locale) notFound();
  return <LocaleHome locale={locale} />;
}
