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
    "/privacy",
    getLocaleBundle(locale).ui.meta.privacy,
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const locale = parseLocaleParam((await params).locale);
  if (!locale) notFound();
  const { Privacy } = getLocaleBundle(locale).legal;
  return <Privacy />;
}
