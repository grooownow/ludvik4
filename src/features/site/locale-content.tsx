import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n";
import { enContent, type MarketContent } from "./content";
import {
  type InternationalServicePage,
  type InternationalWorkItem,
  internationalServicePages,
  internationalWork,
} from "./international-content";
import {
  buildInternationalCatalog,
  buildOrderPrefills,
  enPricingLocaleCopy,
  internationalPricingServices,
  localizePricingServices,
} from "./international-pricing";
import { CookiePolicyView, LegalNoticeView, TermsView } from "./legal-en";
import { localizeHrefs } from "./localize";
import { esContent } from "./locales/es/content";
import { esServicePages, esWork } from "./locales/es/international-content";
import {
  EsCookiePolicy,
  EsLegalNotice,
  EsPrivacy,
  EsTerms,
} from "./locales/es/legal";
import { esPricingCopy, esPricingTexts } from "./locales/es/pricing";
import { esUi } from "./locales/es/ui";
import { ruContent } from "./locales/ru/content";
import { ruServicePages, ruWork } from "./locales/ru/international-content";
import {
  RuCookiePolicy,
  RuLegalNotice,
  RuPrivacy,
  RuTerms,
} from "./locales/ru/legal";
import { ruPricingCopy, ruPricingTexts } from "./locales/ru/pricing";
import { ruUi } from "./locales/ru/ui";
import type { PricingCatalog } from "./pricing-catalog";
import type { PricingService } from "./pricing-draft";
import { PrivacyPage } from "./privacy-page";
import { enUi, type UiCopy } from "./ui-copy";

// Everything one ludvik4.dev language renders, in one object. Translations
// are written with English paths; links get the locale prefix here.

export type LocaleBundle = {
  locale: Locale;
  content: MarketContent;
  ui: UiCopy;
  servicePages: InternationalServicePage[];
  work: InternationalWorkItem[];
  /** Work with its own case page (not the ones whose card leaves the site). */
  caseStudies: InternationalWorkItem[];
  pricingServices: PricingService[];
  pricingCatalog: PricingCatalog;
  orderPrefills: Record<string, string>;
  legal: {
    LegalNotice: ComponentType;
    CookiePolicy: ComponentType;
    Terms: ComponentType;
    Privacy: ComponentType;
  };
};

function EnPrivacy() {
  return <PrivacyPage content={enContent} />;
}

function bundle(
  locale: Locale,
  parts: Omit<
    LocaleBundle,
    | "locale"
    | "caseStudies"
    | "pricingServices"
    | "pricingCatalog"
    | "orderPrefills"
  > & {
    pricingServices: PricingService[];
    pricingCopy: typeof enPricingLocaleCopy;
  },
): LocaleBundle {
  const { pricingServices, pricingCopy, ...rest } = parts;
  const work = localizeHrefs(locale, rest.work);
  return {
    ...rest,
    locale,
    content: localizeHrefs(locale, rest.content),
    servicePages: localizeHrefs(locale, rest.servicePages),
    work,
    caseStudies: work.filter((item) => !item.cardLink),
    pricingServices,
    pricingCatalog: buildInternationalCatalog(
      locale,
      pricingServices,
      pricingCopy,
    ),
    orderPrefills: buildOrderPrefills(pricingServices, pricingCopy.prefill),
  };
}

const BUNDLES: Record<Locale, LocaleBundle> = {
  en: bundle("en", {
    content: enContent,
    ui: enUi,
    servicePages: internationalServicePages,
    work: internationalWork,
    pricingServices: internationalPricingServices,
    pricingCopy: enPricingLocaleCopy,
    legal: {
      LegalNotice: LegalNoticeView,
      CookiePolicy: CookiePolicyView,
      Terms: TermsView,
      Privacy: EnPrivacy,
    },
  }),
  es: bundle("es", {
    content: esContent,
    ui: esUi,
    servicePages: esServicePages,
    work: esWork,
    pricingServices: localizePricingServices("es", esPricingTexts),
    pricingCopy: esPricingCopy,
    legal: {
      LegalNotice: EsLegalNotice,
      CookiePolicy: EsCookiePolicy,
      Terms: EsTerms,
      Privacy: EsPrivacy,
    },
  }),
  ru: bundle("ru", {
    content: ruContent,
    ui: ruUi,
    servicePages: ruServicePages,
    work: ruWork,
    pricingServices: localizePricingServices("ru", ruPricingTexts),
    pricingCopy: ruPricingCopy,
    legal: {
      LegalNotice: RuLegalNotice,
      CookiePolicy: RuCookiePolicy,
      Terms: RuTerms,
      Privacy: RuPrivacy,
    },
  }),
};

/** All copy of one ludvik4.dev language. */
export function getLocaleBundle(locale: Locale): LocaleBundle {
  return BUNDLES[locale];
}
