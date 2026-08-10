import { describe, expect, it } from "vitest";
import { buildRedirects } from "../../config/redirects";

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

describe("market isolation", () => {
  it.each(["ru", "en"] as const)(
    "%s build has no cross-market blog redirect",
    (market) => {
      expect(find(market, "/blog")).toBeUndefined();
      expect(find(market, "/blog/:path*")).toBeUndefined();
    },
  );

  it("EN redirect targets contain no RU-market host", () => {
    expect(JSON.stringify(buildRedirects("en"))).not.toContain("ludvik4.ru");
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
