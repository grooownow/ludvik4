import { describe, expect, it } from "vitest";
import { buildRedirects, RU_SITE_URL } from "../../config/redirects";

const find = (market: "ru" | "en", source: string) =>
  buildRedirects(market).find((r) => r.source === source);

describe("retired /en landing", () => {
  it.each(["ru", "en"] as const)(
    "%s build permanently redirects /en to the root",
    (market) => {
      expect(find(market, "/en")).toEqual({
        source: "/en",
        destination: "/",
        permanent: true,
      });
      expect(find(market, "/en/:path*")?.destination).toBe("/");
    },
  );
});

describe("Russian blog moved to the RU domain", () => {
  it("EN build redirects the blog list to the RU domain", () => {
    expect(find("en", "/blog")).toEqual({
      source: "/blog",
      destination: `${RU_SITE_URL}/blog`,
      permanent: true,
    });
  });

  it("EN build carries every article slug across unchanged", () => {
    // Slug preservation is the whole point: the 5 live articles keep their
    // accumulated search signals and external links (vc.ru) only if
    // /blog/<slug> lands on /blog/<slug>.
    expect(find("en", "/blog/:path*")).toEqual({
      source: "/blog/:path*",
      destination: `${RU_SITE_URL}/blog/:path*`,
      permanent: true,
    });
  });

  it("RU build does NOT redirect its own blog", () => {
    // On the RU build these paths are the blog itself — a redirect here would
    // point the RU site at itself and take all 5 articles offline.
    expect(find("ru", "/blog")).toBeUndefined();
    expect(find("ru", "/blog/:path*")).toBeUndefined();
  });
});

describe("redirect targets", () => {
  it("every cross-domain destination is an absolute https URL", () => {
    for (const rule of buildRedirects("en")) {
      if (rule.destination.startsWith("/")) continue;
      expect(rule.destination.startsWith("https://")).toBe(true);
    }
  });

  it("no rule redirects a market to its own path (a redirect loop)", () => {
    for (const market of ["ru", "en"] as const) {
      for (const rule of buildRedirects(market)) {
        expect(rule.destination).not.toBe(rule.source);
      }
    }
  });
});
