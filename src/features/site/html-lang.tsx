"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Keeps `<html lang>` right inside a language's pages. The shared root layout
 * renders `lang="en"` on ludvik4.dev; the locale layout also writes the value
 * with an inline script before first paint, and this restores English when a
 * client navigation leaves the Spanish or Russian pages.
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [locale]);
  return null;
}
