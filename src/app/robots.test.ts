import { describe, expect, it } from "vitest";
import { buildRobots } from "@/features/site";

const base = "https://ludvik4.dev";

function disallowOf(market: "ru" | "en"): string[] {
  const robots = buildRobots(market, base);
  const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
  return (rules[0]?.disallow as string[]) ?? [];
}

describe("buildRobots", () => {
  it("RU: disallows /dashboard and /signin, keeps /blog crawlable", () => {
    const disallow = disallowOf("ru");
    expect(disallow).toContain("/dashboard");
    expect(disallow).toContain("/signin");
    expect(disallow).not.toContain("/blog");
    expect(buildRobots("ru", base).sitemap).toBe(`${base}/sitemap.xml`);
  });

  it("EN: additionally disallows the RU-only /blog", () => {
    expect(disallowOf("en")).toContain("/blog");
  });
});
