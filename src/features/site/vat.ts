import type { Locale } from "@/lib/i18n";

// Euro prices of the ludvik4.dev storefront, written the way each language
// writes money: "€1,500" (EN), "1500 €" (ES; Spanish groups from five
// digits), "1 500 €" (RU). Prices are whole euros set by the owner; Spanish
// and Russian prices are derived from the English ones, never typed twice.

const NUMBER_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  es: "es-ES",
  ru: "ru-RU",
};

/** The "from" word of a price range, per language. */
export const FROM_WORD: Record<Locale, string> = {
  en: "from",
  es: "desde",
  ru: "от",
};

function formatAmount(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace(/[  ]/g, " ");
}

/** "€350" → "€350" | "350 €"; with `from`: "from €1,500" | "desde 1500 €". */
export function formatEuro(locale: Locale, amount: number, from = false) {
  const number = formatAmount(locale, amount);
  const value = locale === "en" ? `€${number}` : `${number} €`;
  return from ? `${FROM_WORD[locale]} ${value}` : value;
}

/** Reads a price written by formatEuro (any locale). */
export function parseEuro(
  price: string,
): { amount: number; from: boolean } | undefined {
  const m = /^(?:(from|desde|от)\s+)?(?:€([\d,]+)|([\d.\s  ]+?)\s*€)$/.exec(
    price.trim(),
  );
  if (!m) return undefined;
  const digits = (m[2] ?? m[3] ?? "").replace(/[^\d]/g, "");
  if (!digits) return undefined;
  return { amount: Number(digits), from: Boolean(m[1]) };
}

/** An English price in another language: "from €1,500" → "от 1 500 €". */
export function localizePrice(locale: Locale, enPrice: string): string {
  const parsed = parseEuro(enPrice);
  if (!parsed) return enPrice;
  return formatEuro(locale, parsed.amount, parsed.from);
}

/** "€350" → "€423.50 incl. VAT"; "from €1,500" → "from €1,815 incl. VAT". */
export function withVat(
  price: string,
  rate = 0.21,
  label = "incl. VAT",
  locale: Locale = "en",
): string | undefined {
  const parsed = parseEuro(price);
  if (!parsed) return undefined;
  const cents = Math.round(parsed.amount * (100 + rate * 100));
  return `${formatEuro(locale, cents / 100, parsed.from)} ${label}`;
}
