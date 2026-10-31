import { describe, expect, it } from "vitest";
import {
  detectLocaleRedirect,
  enabledLocales,
  isTranslatedPath,
  localeFromAcceptLanguage,
  localizeHref,
  splitLocale,
  switchHref,
} from "./i18n";

describe("localizeHref", () => {
  it("prefixes internal paths, keeps English and external links as they are", () => {
    expect(localizeHref("es", "/services")).toBe("/es/services");
    expect(localizeHref("ru", "/")).toBe("/ru");
    expect(localizeHref("es", "/#services")).toBe("/es#services");
    expect(localizeHref("es", "/contact?service=x")).toBe(
      "/es/contact?service=x",
    );
    expect(localizeHref("en", "/services")).toBe("/services");
    expect(localizeHref("es", "https://t.me/ludvik4work")).toBe(
      "https://t.me/ludvik4work",
    );
    expect(localizeHref("es", "/es/services")).toBe("/es/services");
    // English-only pages keep their English URL.
    expect(localizeHref("es", "/guides")).toBe("/guides");
    expect(localizeHref("ru", "/blog/some-post")).toBe("/blog/some-post");
  });
});

describe("splitLocale", () => {
  it("separates the prefix from the English path", () => {
    expect(splitLocale("/es/services/landing")).toEqual({
      locale: "es",
      path: "/services/landing",
    });
    expect(splitLocale("/ru")).toEqual({ locale: "ru", path: "/" });
    expect(splitLocale("/services")).toEqual({
      locale: "en",
      path: "/services",
    });
    // A word that merely starts with "es" is not a prefix.
    expect(splitLocale("/estimate")).toEqual({
      locale: "en",
      path: "/estimate",
    });
  });
});

describe("isTranslatedPath", () => {
  it("covers the storefront and leaves blog, guides and Gridfin out", () => {
    for (const path of [
      "/",
      "/services",
      "/services/landing-pages",
      "/about",
      "/contact",
      "/work",
      "/work/qa-pilot",
      "/privacy",
      "/cookies",
      "/legal-notice",
      "/terms-of-service",
    ]) {
      expect(isTranslatedPath(path), path).toBe(true);
    }
    for (const path of ["/blog", "/blog/x", "/guides", "/gridfin", "/terms"]) {
      expect(isTranslatedPath(path), path).toBe(false);
    }
  });
});

describe("switchHref", () => {
  it("keeps the page when it is translated", () => {
    expect(switchHref("/services/sites", "es")).toBe("/es/services/sites");
    expect(switchHref("/es/services/sites", "en")).toBe("/services/sites");
    expect(switchHref("/es/about", "ru")).toBe("/ru/about");
    expect(switchHref("/ru", "en")).toBe("/");
    expect(switchHref("/es/contact?service=web-apps&package=plus", "en")).toBe(
      "/contact?service=web-apps&package=plus",
    );
    expect(switchHref("/?a=1", "ru")).toBe("/ru?a=1");
  });

  it("falls back to the target home on an English-only page", () => {
    expect(switchHref("/blog/some-article", "es")).toBe("/es");
    expect(switchHref("/guides", "en")).toBe("/");
  });
});

describe("localeFromAcceptLanguage", () => {
  it("reads the primary subtag by quality", () => {
    expect(localeFromAcceptLanguage("es-MX,es;q=0.9,en;q=0.8")).toBe("es");
    expect(localeFromAcceptLanguage("en-US,en;q=0.9,es;q=0.8")).toBe("en");
    expect(localeFromAcceptLanguage("de-DE,ru;q=0.7")).toBe("ru");
    expect(localeFromAcceptLanguage("fr;q=0.5,es;q=0.9")).toBe("es");
    expect(localeFromAcceptLanguage("de,fr")).toBe("en");
    expect(localeFromAcceptLanguage(null)).toBe("en");
  });

  it("ignores Russian while the RU locale is off", () => {
    expect(localeFromAcceptLanguage("ru-RU,ru;q=0.9", false)).toBe("en");
    expect(enabledLocales(false)).toEqual(["en", "es"]);
  });
});

describe("detectLocaleRedirect", () => {
  const base = {
    pathname: "/services",
    savedLocale: undefined,
    acceptLanguage: "es-ES,es;q=0.9",
    userAgent: "Mozilla/5.0",
  };

  it("sends a Spanish browser to the Spanish page", () => {
    expect(detectLocaleRedirect(base)).toBe("/es/services");
    expect(
      detectLocaleRedirect({ ...base, pathname: "/", search: "?a=1" }),
    ).toBe("/es?a=1");
  });

  it("follows the saved choice over the browser language", () => {
    expect(detectLocaleRedirect({ ...base, savedLocale: "en" })).toBeNull();
    expect(
      detectLocaleRedirect({
        ...base,
        acceptLanguage: "en-US",
        savedLocale: "ru",
      }),
    ).toBe("/ru/services");
  });

  it("ignores a garbage cookie", () => {
    expect(detectLocaleRedirect({ ...base, savedLocale: "xx" })).toBe(
      "/es/services",
    );
  });

  it("never redirects bots, prefixed URLs or untranslated pages", () => {
    expect(
      detectLocaleRedirect({ ...base, userAgent: "Googlebot/2.1" }),
    ).toBeNull();
    expect(detectLocaleRedirect({ ...base, pathname: "/ru/about" })).toBeNull();
    expect(detectLocaleRedirect({ ...base, pathname: "/blog" })).toBeNull();
  });

  it("keeps Russian visitors on English while the RU locale is off", () => {
    expect(
      detectLocaleRedirect({
        ...base,
        acceptLanguage: "ru",
        ruEnabled: false,
      }),
    ).toBeNull();
    expect(
      detectLocaleRedirect({ ...base, savedLocale: "ru", ruEnabled: false }),
    ).toBeNull();
  });
});
