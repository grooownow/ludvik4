import { describe, expect, it } from "vitest";
import { buildRobots } from "@/features/site";

const base = "https://ludvik4.dev";

function disallowOf(): string[] {
  const robots = buildRobots(base);
  const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
  return (rules[0]?.disallow as string[]) ?? [];
}

describe("buildRobots", () => {
  it("allows crawlers to see page-level noindex directives", () => {
    expect(disallowOf()).toEqual([]);
    expect(buildRobots(base).sitemap).toBe(`${base}/sitemap.xml`);
  });

  it("leaves /blog crawlable so the EN build's 301 can be followed", () => {
    // EN returns its normal market-gated 404 for /blog; RU serves the blog.
    // Neither needs a crawl block.
    expect(disallowOf()).not.toContain("/blog");
  });
});
