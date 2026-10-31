import type { Locale } from "@/lib/i18n";
import { esUi } from "./locales/es/ui";
import { ruUi } from "./locales/ru/ui";
import { enUi, type UiCopy } from "./ui-copy";

const UI: Record<Locale, UiCopy> = { en: enUi, es: esUi, ru: ruUi };

/** Interface copy of a ludvik4.dev language. */
export function uiFor(locale: Locale): UiCopy {
  return UI[locale];
}
