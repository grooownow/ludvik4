import { describe, expect, it } from "vitest";
import {
  languageAlternates,
  localeLayoutMetadata,
  localePageMetadata,
  parseLocaleParam,
} from "./locale-seo";

const meta = { title: "T", description: "D" };

describe("locale SEO", () => {
  it("links English and Spanish with hreflang, x-default to English", () => {
    expect(languageAlternates("/services")).toEqual({
      languages: {
        en: "/services",
        es: "/es/services",
        "x-default": "/services",
      },
    });
  });

  it("indexes Spanish pages, canonical to themselves", () => {
    const page = localePageMetadata("es", "/about", meta);
    expect(page.alternates?.canonical).toBe("/es/about");
    expect(page.alternates?.languages).toMatchObject({ es: "/es/about" });
    expect(page.robots).toBeUndefined();
  });

  it("keeps Russian pages out of search and out of hreflang", () => {
    const page = localePageMetadata("ru", "/about", meta);
    expect(page.alternates?.canonical).toBe("/ru/about");
    expect(page.alternates?.languages).toBeUndefined();
    expect(page.robots).toMatchObject({ index: false, follow: true });
    expect(localeLayoutMetadata("ru").robots).toMatchObject({ index: false });
    expect(localeLayoutMetadata("es").robots).toMatchObject({ index: true });
  });

  it("does not let the root template repeat the brand in the home title", () => {
    expect(localeLayoutMetadata("es").title).toMatchObject({
      absolute: expect.stringMatching(/Ludvik4$/),
      template: "%s · Ludvik4",
    });
  });

  it("accepts only the enabled language prefixes", () => {
    expect(parseLocaleParam("es")).toBe("es");
    expect(parseLocaleParam("ru")).toBe("ru");
    expect(parseLocaleParam("en")).toBeNull();
    expect(parseLocaleParam("fr")).toBeNull();
    expect(parseLocaleParam(undefined)).toBeNull();
  });
});
