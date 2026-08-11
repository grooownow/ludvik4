import { describe, expect, it } from "vitest";
import { buildRewrites } from "../../config/rewrites";

describe("gridfin bundle serving (EN)", () => {
  it("EN maps the bare /gridfin root to the bundle's redirect page", () => {
    expect(buildRewrites("en")).toContainEqual({
      source: "/gridfin",
      destination: "/gridfin/index.html",
    });
  });

  it("EN resolves extensionless bundle paths to their directory index", () => {
    expect(buildRewrites("en")).toContainEqual({
      source: "/gridfin/:path*",
      destination: "/gridfin/:path*/index.html",
    });
  });

  it("EN rewrites stay inside /gridfin — the studio app is not touched", () => {
    for (const rule of buildRewrites("en")) {
      expect(rule.source).toMatch(/^\/gridfin(\/|$)/);
      expect(rule.destination).toMatch(/^\/gridfin\//);
    }
  });

  it("slashless style: no rule emits or expects a trailing-slash URL", () => {
    // Next's default trailingSlash=false 308s /gridfin/en/ before rewrites
    // run; a trailing-slash source here would be dead code masking that.
    for (const rule of buildRewrites("en")) {
      expect(rule.source.endsWith("/")).toBe(false);
    }
  });
});

describe("market isolation", () => {
  it("RU build gets no gridfin rewrites — its bundle ships via the static export", () => {
    expect(buildRewrites("ru")).toEqual([]);
  });
});
