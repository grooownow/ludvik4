import { type Locale, localizeHref } from "@/lib/i18n";

// Translations are written with the English paths ("/services/web-apps"); the
// locale prefix is added here, in one place, so a translator can never send a
// Spanish reader to an English page by forgetting "/es".

const HREF_KEYS = new Set(["href", "contactHref", "detailHref"]);

/** A deep copy of `value` with every href-like field moved into `locale`. */
export function localizeHrefs<T>(locale: Locale, value: T): T {
  if (locale === "en") return value;
  return walk(locale, value) as T;
}

function walk(locale: Locale, value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => walk(locale, item));
  if (value && typeof value === "object" && !isSpecial(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        HREF_KEYS.has(key) && typeof entry === "string"
          ? localizeHref(locale, entry)
          : walk(locale, entry),
      ]),
    );
  }
  return value;
}

// Functions, React elements and class instances are passed through as is.
function isSpecial(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return (proto !== Object.prototype && proto !== null) || "$$typeof" in value;
}
