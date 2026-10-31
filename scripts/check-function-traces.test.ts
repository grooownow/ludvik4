import { describe, expect, it } from "vitest";

import { hasWholeProjectTraceWarning } from "./build";
import {
  findTraceViolations,
  policy,
  type FunctionTrace,
} from "./check-function-traces";

const MB = 1024 * 1024;

function fn(route: string, files: Array<[string, number]>): FunctionTrace {
  return { route, files: files.map(([path, size]) => ({ path, size })) };
}

describe("findTraceViolations", () => {
  it("passes a lean function that ships only allowed project files", () => {
    const lean = fn("app/blog/[slug]/page", [
      [".next/server/chunks/a.js", 2 * MB],
      ["node_modules/next/dist/server/next.js", 4 * MB],
      ["src/content/blog/cursor-rules.mdx", 20_000],
      ["src/content/blog/en/cursor-rules-best-practices.mdx", 20_000],
      ["public/hero-product-illustration.png", 2 * MB],
    ]);
    expect(findTraceViolations([lean])).toEqual([]);
  });

  // The 2026-10-31 incident: a dynamic fs path traced the whole repo.
  it("flags project files outside the allowlist", () => {
    const leaky = fn("app/blog/page", [
      ["docs/roadmap.md", 1000],
      ["design.pen", 1000],
      ["src/content/blog/cursor-rules/card.png", 1000],
      ["public/gridfin/en/index.html", 1000],
    ]);
    const violations = findTraceViolations([leaky]);
    expect(violations).toHaveLength(4);
    expect(violations[0]).toContain(
      "app/blog/page: ships project file docs/roadmap.md",
    );
  });

  it("flags sharp and @img in any node_modules layout", () => {
    const withSharp = fn("app/page", [
      ["node_modules/.pnpm/sharp@0.35.5/node_modules/sharp/lib/index.js", 10],
      [
        "node_modules/.pnpm/@img+sharp-libvips-linux-x64@1.2.0/node_modules/@img/sharp-libvips-linux-x64/lib/x.so",
        10,
      ],
      ["node_modules/@img/sharp-darwin-arm64/index.cjs", 10],
    ]);
    const violations = findTraceViolations([withSharp]);
    expect(violations).toHaveLength(3);
    expect(violations.every((v) => v.includes("sharp/@img"))).toBe(true);
  });

  it("does not mistake unrelated packages for sharp", () => {
    const fine = fn("app/page", [
      [
        "node_modules/.pnpm/next@16.4.2/node_modules/next/dist/sharp-free.js",
        10,
      ],
    ]);
    expect(findTraceViolations([fine])).toEqual([]);
  });

  it("enforces the default size budget", () => {
    const heavy = fn("app/blog/page", [["node_modules/next/big.js", 16 * MB]]);
    expect(findTraceViolations([heavy])).toEqual([
      "app/blog/page: 16.0 MB exceeds budget of 15 MB",
    ]);
  });

  it("applies per-route budget overrides (PGlite routes)", () => {
    const signin = fn("app/signin/page", [
      ["node_modules/@electric-sql/pglite/x.wasm", 30 * MB],
    ]);
    expect(findTraceViolations([signin])).toEqual([]);
    expect(policy.routeBudgetBytes["app/signin/page"]).toBe(35 * MB);
  });
});

describe("hasWholeProjectTraceWarning", () => {
  it("matches the warning Next prints for dynamic fs access", () => {
    // Verbatim from the ludvik4 Vercel build log, 2026-10-31.
    const log =
      "Warning: Dynamic filesystem access causes tracing of the whole project\n" +
      "Static analysis determined that this filesystem access causes the whole project to be traced";
    expect(hasWholeProjectTraceWarning(log)).toBe(true);
  });

  it("ignores a clean build log", () => {
    expect(
      hasWholeProjectTraceWarning("✓ Compiled successfully\nRoute (app)"),
    ).toBe(false);
  });
});
