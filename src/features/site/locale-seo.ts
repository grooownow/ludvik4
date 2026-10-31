import type { Metadata } from "next";
import { z } from "zod";
import {
  type Locale,
  localizeHref,
  prefixedLocales,
  RU_LOCALE_ENABLED,
} from "@/lib/i18n";
import { getLocaleBundle } from "./locale-content";
import type { PageMeta } from "./ui-copy";

// Search surfaces of ludvik4.dev's languages
// (docs/superpowers/specs/2026-10-31-multilingual-dev-design.md → Search):
// - EN and ES pages link each other with hreflang (x-default → EN);
// - RU pages are noindex and stay out of hreflang and the sitemap, so they
//   never compete with ludvik4.ru.

/** The `[locale]` route segment, validated: only the enabled prefixes. */
export function parseLocaleParam(value: unknown): Exclude<Locale, "en"> | null {
  const parsed = z
    .enum(
      prefixedLocales() as [Exclude<Locale, "en">, ...Exclude<Locale, "en">[]],
    )
    .safeParse(value);
  return parsed.success ? parsed.data : null;
}

/** Languages that appear in hreflang: English and Spanish. */
const INDEXED: Locale[] = ["en", "es"];

/** hreflang alternates for an English path that has translations. */
export function languageAlternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(
        INDEXED.map((locale) => [locale, localizeHref(locale, path)]),
      ),
      "x-default": path,
    },
  };
}

/** Whether a locale's pages may be indexed. */
export function isIndexedLocale(locale: Locale): boolean {
  return INDEXED.includes(locale);
}

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  ru: "ru_RU",
};

/**
 * Metadata of a translated page: canonical to itself, hreflang for indexed
 * languages, noindex for Russian.
 */
export function localePageMetadata(
  locale: Locale,
  path: string,
  meta: PageMeta & { ogTitle?: string; ogDescription?: string },
): Metadata {
  const url = localizeHref(locale, path);
  const indexed = isIndexedLocale(locale);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      ...(indexed ? languageAlternates(path) : {}),
    },
    openGraph: {
      title: meta.ogTitle ?? meta.title,
      description: meta.ogDescription ?? meta.description,
      url,
      locale: OG_LOCALE[locale],
    },
    ...(indexed ? {} : { robots: { index: false, follow: true } }),
  };
}

/** Site-wide metadata of a language's pages (the `[locale]` layout). */
export function localeLayoutMetadata(locale: Locale): Metadata {
  const { content } = getLocaleBundle(locale);
  const indexed = isIndexedLocale(locale);
  return {
    title: { default: content.title, template: "%s · Ludvik4" },
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: localizeHref(locale, "/"),
      ...(indexed ? languageAlternates("/") : {}),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localizeHref(locale, "/"),
      siteName: "Ludvik4",
      title: content.shareTitle,
      description: content.description,
    },
    twitter: {
      card: "summary_large_image",
      title: content.shareTitle,
      description: content.description,
    },
    robots: indexed
      ? { index: true, follow: true }
      : {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        },
  };
}

/** Locales listed in the sitemap besides English. */
export function sitemapLocales(): Locale[] {
  return prefixedLocales(RU_LOCALE_ENABLED).filter(isIndexedLocale);
}
