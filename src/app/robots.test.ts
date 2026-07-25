import { describe, expect, it } from "vitest";
import { buildRobots } from "@/features/site";

const base = "https://ludvik4.dev";

function disallowOf(): string[] {
  const robots = buildRobots(base);
  const rules = Array.isArray(robots.rules) ? robots.rules : [robots.rules];
  return (rules[0]?.disallow as string[]) ?? [];
}

describe("buildRobots", () => {
  it("disallows /dashboard and /signin", () => {
    const disallow = disallowOf();
    expect(disallow).toContain("/dashboard");
    expect(disallow).toContain("/signin");
    expect(buildRobots(base).sitemap).toBe(`${base}/sitemap.xml`);
  });

  it("leaves /blog crawlable so the EN build's 301 can be followed", () => {
    // The EN build redirects /blog and /blog/<slug> to the RU domain
    // (config/redirects.ts). A crawler that may not fetch those URLs never
    // sees the redirect, so the five live articles would stay in the index as
    // "blocked by robots.txt" and pass no link equity to their new home.
    expect(disallowOf()).not.toContain("/blog");
  });
});
