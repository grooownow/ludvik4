// Languages of the ludvik4.dev storefront (EN build only; ludvik4.ru is a
// separate, Russian-only build and never reads this module's routing).
//
// Pure and dependency-free on purpose: `src/middleware.ts` imports it, and the
// middleware must stay local (no content modules, no network, no database).
// Design: docs/superpowers/specs/2026-10-31-multilingual-dev-design.md.

/** Every storefront language. English is the default and lives at the root. */
export const LOCALES = ["en", "es", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/**
 * Feature flag for the Russian locale on ludvik4.dev. Off: no `/ru` pages
 * (404), no Russian in the language switch, and Russian browsers get English.
 */
export const RU_LOCALE_ENABLED: boolean = true;

/** Locales served by this build, in switch order. */
export function enabledLocales(ruEnabled = RU_LOCALE_ENABLED): Locale[] {
  return LOCALES.filter((locale) => locale !== "ru" || ruEnabled);
}

/** Locales that live under a URL prefix (`/es`, `/ru`). */
export function prefixedLocales(ruEnabled = RU_LOCALE_ENABLED): Locale[] {
  return enabledLocales(ruEnabled).filter((l) => l !== DEFAULT_LOCALE);
}

export function isLocale(value: unknown): value is Locale {
  return (LOCALES as readonly unknown[]).includes(value);
}

/** The cookie (and localStorage key) holding the visitor's own choice. */
export const LOCALE_COOKIE = "ludvik4_lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Native names, as the switch shows them. */
export const LOCALE_LABELS: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  es: { short: "ES", name: "Español" },
  ru: { short: "RU", name: "Русский" },
};

/** `""` for English, `"/es"` / `"/ru"` otherwise. */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * The URL of an English path in `locale`. External links, anchors and
 * already-prefixed paths pass through untouched.
 */
export function localizeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (locale === DEFAULT_LOCALE) return href;
  if (splitLocale(href).locale !== DEFAULT_LOCALE) return href;
  // Blog, guides, Gridfin and qa-pilot exist in English only.
  if (!isTranslatedPath(href)) return href;
  const prefix = localePrefix(locale);
  if (href === "/") return prefix;
  if (href.startsWith("/#") || href.startsWith("/?")) {
    return `${prefix}${href.slice(1)}`;
  }
  return `${prefix}${href}`;
}

/** Split a pathname into its locale and the English path behind it. */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const match = /^\/(es|ru)(?=\/|$|\?|#)(.*)$/.exec(pathname);
  if (!match) return { locale: DEFAULT_LOCALE, path: pathname || "/" };
  const rest = match[2] ?? "";
  return {
    locale: match[1] as Locale,
    path:
      rest === "" || rest.startsWith("?") || rest.startsWith("#")
        ? `/${rest}`
        : rest,
  };
}

// The English storefront paths that exist in every language. Slugs are the
// same in every locale, so a pattern is enough and the middleware needs no
// content module.
const TRANSLATED = [
  /^\/$/,
  /^\/services(\/[a-z0-9-]+)?$/,
  /^\/work(\/[a-z0-9-]+)?$/,
  /^\/(about|contact|privacy|cookies|legal-notice|terms-of-service)$/,
];

/** Whether an English path has Spanish and Russian versions. */
export function isTranslatedPath(path: string): boolean {
  const clean = path.split(/[?#]/)[0]!.replace(/(.)\/$/, "$1");
  return TRANSLATED.some((pattern) => pattern.test(clean));
}

/**
 * Where the language switch leads from `pathname`: the same page in `target`
 * when it is translated, else the target's home (blog, guides, Gridfin…).
 */
export function switchHref(pathname: string, target: Locale): string {
  const { path } = splitLocale(pathname);
  const clean = path.split(/[?#]/)[0]!;
  const destination = isTranslatedPath(clean) ? clean : "/";
  return localizeHref(target, destination) || "/";
}

/**
 * The best enabled locale for an `Accept-Language` header, by q-value and
 * then order. Only the primary subtag counts (`es-MX` → `es`). English when
 * nothing matches.
 */
export function localeFromAcceptLanguage(
  header: string | null | undefined,
  ruEnabled = RU_LOCALE_ENABLED,
): Locale {
  if (!header) return DEFAULT_LOCALE;
  const enabled = enabledLocales(ruEnabled);
  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      const quality = q ? Number(q.slice(2)) : 1;
      return {
        primary: tag.trim().toLowerCase().split("-")[0] ?? "",
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      };
    })
    .filter((entry) => entry.primary && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { primary } of ranked) {
    if (primary === "*") return DEFAULT_LOCALE;
    if (isLocale(primary) && enabled.includes(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}

const BOT =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|lighthouse|headless/i;

/**
 * Where a visitor landing on an English page should go, or `null` to stay.
 * A saved choice wins (the switch saved it on this device); without one the
 * browser language decides. Bots, prefixed URLs and untranslated paths are
 * never redirected.
 */
export function detectLocaleRedirect({
  pathname,
  search = "",
  savedLocale,
  acceptLanguage,
  userAgent,
  ruEnabled = RU_LOCALE_ENABLED,
}: {
  pathname: string;
  search?: string;
  savedLocale: string | undefined;
  acceptLanguage: string | null;
  userAgent: string | null;
  ruEnabled?: boolean;
}): string | null {
  if (userAgent && BOT.test(userAgent)) return null;
  if (splitLocale(pathname).locale !== DEFAULT_LOCALE) return null;
  if (!isTranslatedPath(pathname)) return null;
  const locale = isLocale(savedLocale)
    ? enabledLocales(ruEnabled).includes(savedLocale)
      ? savedLocale
      : DEFAULT_LOCALE
    : localeFromAcceptLanguage(acceptLanguage, ruEnabled);
  if (locale === DEFAULT_LOCALE) return null;
  return `${localizeHref(locale, pathname)}${search}`;
}
