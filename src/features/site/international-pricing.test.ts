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
  it("carries the owner's prices", () => {
    expect(prices("landing-pages")).toEqual(["€200", "€350", "€500"]);
    expect(prices("website-packages")).toEqual(["€500", "€850", "€1,300"]);
    expect(prices("web-apps")).toEqual([
      "from €1,500",
      "from €3,000",
      "from €6,000",
    ]);
    expect(prices("web-animation")).toEqual(["€150", "€300", "from €700"]);
    expect(prices("automation-packages")).toEqual(["€500", "€900", "€2,000"]);
  });

  it("derives each 'from' price from the first package, without doubling", () => {
    expect(getInternationalPricingService("web-apps")!.from).toBe(
      "from €1,500",
    );
    expect(getInternationalPricingService("landing-pages")!.from).toBe(
      "from €200",
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
    expect(plus("landing-pages").oldPrice).toBe("€400");
    expect(plus("website-packages").oldPrice).toBe("€950");
    expect(plus("web-apps").oldPrice).toBeUndefined();
    expect(plus("web-apps").promo).toBeUndefined();
    expect(plus("automation-packages").oldPrice).toBe("€1,000");
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
      "I'd like the Plus package: Landing pages (€350).",
    );
  });
});
