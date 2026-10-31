import type { Viewport } from "next";
import { notFound } from "next/navigation";
import { LocaleHome, parseLocaleParam } from "@/features/site";

export const viewport: Viewport = { themeColor: "#ffe0fa" };

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = parseLocaleParam((await params).locale);
  if (!locale) notFound();
  return <LocaleHome locale={locale} />;
}
