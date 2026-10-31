import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getLocaleBundle,
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
    "/terms-of-service",
    getLocaleBundle(locale).ui.meta.terms,
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const locale = parseLocaleParam((await params).locale);
  if (!locale) notFound();
  const { Terms } = getLocaleBundle(locale).legal;
  return <Terms />;
}
