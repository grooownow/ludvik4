import { describe, expect, it } from "vitest";
import { isTranslatedPath, splitLocale } from "@/lib/i18n";
import { getLocaleBundle } from "./locale-content";
import { parseEuro } from "./vat";

const en = getLocaleBundle("en");
const translated = [getLocaleBundle("es"), getLocaleBundle("ru")];

/** Every string field named like a link, anywhere in `value`. */
function hrefs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => hrefs(v, out));
  else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if (/href$/i.test(key) && typeof entry === "string") out.push(entry);
      else hrefs(entry, out);
    }
  }
  return out;
}

/** All the visible strings of a bundle's data (not its components). */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if (/href$|^(image|website|slug|id|exhibit)$/i.test(key)) continue;
      strings(entry, out);
    }
  }
  return out;
}

describe.each(translated)("$locale bundle", (bundle) => {
  const { locale } = bundle;

  it("keeps the English slugs, images and live links", () => {
    expect(bundle.servicePages.map((p) => p.slug)).toEqual(
      en.servicePages.map((p) => p.slug),
    );
    // Gridfin has its own landing per language (/gridfin/es); the rest of a
    // live link is the same everywhere.
    const live = (b: typeof en) =>
      b.work.map(({ slug, image, website }) => ({
        slug,
        image,
        website: website.replace(/\/gridfin\/[a-z-]+$/, "/gridfin"),
      }));
    expect(live(bundle)).toEqual(live(en));
    expect(bundle.pricingServices.map((s) => s.slug)).toEqual(
      en.pricingServices.map((s) => s.slug),
    );
  });

  it("sells every package at the English price", () => {
    const amounts = (b: typeof en) =>
      b.pricingServices.flatMap((s) =>
        s.packages.map((p) => [
          parseEuro(p.price),
          p.oldPrice ? parseEuro(p.oldPrice) : undefined,
        ]),
      );
    expect(amounts(bundle)).toEqual(amounts(en));
    for (const service of bundle.pricingServices) {
      for (const pack of service.packages) {
        expect(parseEuro(pack.price), pack.price).toBeDefined();
      }
    }
  });

  it("links within its own language, or to English-only pages", () => {
    const links = [
      ...hrefs(bundle.content),
      ...hrefs(bundle.servicePages),
      ...hrefs(bundle.work),
      ...hrefs(bundle.pricingServices),
    ].filter((href) => href.startsWith("/"));
    expect(links.length).toBeGreaterThan(10);
    for (const href of links) {
      const { locale: linkLocale, path } = splitLocale(href);
      if (linkLocale === "en") {
        expect(isTranslatedPath(path), `${href} must be localized`).toBe(false);
      } else {
        expect(linkLocale, href).toBe(locale);
      }
    }
  });

  it("is actually translated", () => {
    expect(bundle.content.title).not.toBe(en.content.title);
    expect(bundle.ui).not.toBe(en.ui);
    expect(bundle.ui.about.title).not.toBe(en.ui.about.title);
    expect(bundle.pricingCatalog.copy.lead).not.toBe(
      en.pricingCatalog.copy.lead,
    );
    expect(bundle.servicePages[0]!.h1).not.toBe(en.servicePages[0]!.h1);
    expect(bundle.work[0]!.lead).not.toBe(en.work[0]!.lead);
    expect(bundle.content.lang).toBe(locale);
    expect(bundle.content.locale).toBe(locale);
  });

  it("orders packages from /contact in its own language", () => {
    const pack = bundle.pricingServices[0]!.packages[1]!;
    expect(
      bundle.pricingCatalog.orderHref?.(bundle.pricingServices[0]!, pack),
    ).toBe(`/${locale}/contact?service=landing-pages&package=plus`);
    expect(bundle.orderPrefills["landing-pages/plus"]).toContain(pack.price);
  });

  it("never mentions the blocked messenger", () => {
    const text = [
      ...strings(bundle.content),
      ...strings(bundle.ui),
      ...strings(bundle.pricingServices),
      ...strings(bundle.pricingCatalog.copy),
    ].join("\n");
    expect(text).not.toMatch(/\bMAX\b|\bМАКС\b/);
  });
});

describe("the Russian locale of ludvik4.dev", () => {
  it("carries nothing Russia-specific: it sells the EU offer in Russian", () => {
    const ru = getLocaleBundle("ru");
    const text = [
      ...strings(ru.content),
      ...strings(ru.ui),
      ...strings(ru.servicePages),
      ...strings(ru.work),
      ...strings(ru.pricingServices),
      ...strings(ru.pricingCatalog.copy),
      ...Object.values(ru.orderPrefills),
    ].join("\n");
    expect(text).not.toMatch(
      /152-ФЗ|Роскомнадзор|РКН|₽|руб\.|рубл|1С|Битрикс|Bitrix|\bVK\b|ВКонтакте|Авито|Яндекс|Yandex|самозанят|НПД/i,
    );
  });

  it("writes euro amounts the Russian way", () => {
    const ru = getLocaleBundle("ru");
    expect(ru.pricingServices[2]!.packages[0]!.price).toBe("от 1 500 €");
  });
});

describe("the Spanish locale", () => {
  it("writes euro amounts the Spanish way and adds IVA", () => {
    const es = getLocaleBundle("es");
    const plus = es.pricingServices[0]!.packages[1]!;
    expect(plus.price).toBe("350 €");
    expect(es.pricingCatalog.vat?.cardTotal?.(plus.price)).toBe(
      "423,50 € IVA incl.",
    );
  });
});
