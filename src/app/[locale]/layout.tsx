import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  HtmlLang,
  localeLayoutMetadata,
  parseLocaleParam,
} from "@/features/site";
import { prefixedLocales } from "@/lib/i18n";
import { env } from "@/lib/env";

// ludvik4.dev in Spanish and Russian: /es/..., /ru/... (EN lives at the
// root). The RU static build stashes this whole tree (scripts/build-ru-static.ts).
// Design: docs/superpowers/specs/2026-10-31-multilingual-dev-design.md.

type Params = { locale: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return prefixedLocales().map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const locale = parseLocaleParam((await params).locale);
  return locale ? localeLayoutMetadata(locale) : {};
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const locale = parseLocaleParam((await params).locale);
  if (!locale || env.SITE_MARKET !== "en") notFound();
  return (
    <>
      {/* The shared root layout says lang="en"; correct it before paint.
          `locale` is one of the validated prefixes, never user text. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
        }}
      />
      <HtmlLang locale={locale} />
      {children}
    </>
  );
}
