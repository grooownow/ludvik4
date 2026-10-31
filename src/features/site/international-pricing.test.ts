import { describe, expect, it } from "vitest";
import {
  getInternationalPricingService,
  internationalOrderPrefills,
  internationalPricingCatalog,
  internationalPricingServices,
} from "./international-pricing";

const prices = (slug: string) =>
  getInternationalPricingService(slug)!.packages.map((p) => p.price);

describe("international pricing", () => {
  it("carries the agreed prices", () => {
    expect(prices("landing-pages")).toEqual(["€450", "€850", "€1,950"]);
    expect(prices("website-packages")).toEqual(["€750", "€1,200", "€2,800"]);
    expect(prices("web-apps")).toEqual(["€3,200", "€5,800", "€11,800"]);
    expect(prices("web-animation")).toEqual(["€200", "€450", "from €1,050"]);
    expect(prices("automation-packages")).toEqual(["€750", "€1,300", "€3,000"]);
  });

  it("derives each 'from' price from the first package", () => {
    expect(getInternationalPricingService("web-apps")!.from).toBe(
      "from €3,200",
    );
  });

  it("has no Russian residue and no Russia-only products", () => {
    const text =
      JSON.stringify(internationalPricingCatalog.copy) +
      JSON.stringify(internationalPricingCatalog.galleryCaptions) +
      JSON.stringify(internationalPricingServices);
    expect(text).not.toMatch(/[А-Яа-яЁё]|₽|152-|\bРФ\b/);
    expect(text).not.toMatch(
      /Yandex|GigaChat|Avito|Wildberries|Ozon|Bitrix|amoCRM|MoySklad|VKontakte|Tilda|\b1C\b/i,
    );
  });

  it("shows no VAT wording on cards", () => {
    for (const s of internationalPricingServices) {
      for (const p of s.packages) {
        expect(JSON.stringify(p)).not.toMatch(/VAT|IVA|tax/i);
      }
    }
  });

  it("runs the RU launch offers on the same packages, in euros", () => {
    const plus = (slug: string) =>
      getInternationalPricingService(slug)!.packages[1]!;
    expect(plus("landing-pages").oldPrice).toBe("€950");
    expect(plus("website-packages").oldPrice).toBe("€1,400");
    expect(plus("web-apps").oldPrice).toBe("€6,450");
    expect(plus("automation-packages").oldPrice).toBe("€1,500");
    expect(plus("web-animation").oldPrice).toBeUndefined();
    expect(plus("landing-pages").promo).toBe("Price until 31 December");
  });

  it("offers legal templates in every package of sites and apps", () => {
    for (const slug of ["landing-pages", "website-packages", "web-apps"]) {
      expect(
        getInternationalPricingService(slug)!.everywhere.join(" "),
      ).toMatch(/legal pages/);
    }
  });

  it("links related pages and order buttons to real services", () => {
    const hrefs = internationalPricingServices.map((s) =>
      internationalPricingCatalog.href(s.id),
    );
    for (const s of internationalPricingServices) {
      for (const r of s.related ?? []) expect(hrefs).toContain(r.href);
    }
    const s = internationalPricingServices[0]!;
    expect(internationalPricingCatalog.orderHref!(s, s.packages[1]!)).toBe(
      "/contact?service=landing-pages&package=plus",
    );
    expect(internationalOrderPrefills["landing-pages/plus"]).toBe(
      "I'd like the Plus package: Landing pages (€850).",
    );
  });
});
