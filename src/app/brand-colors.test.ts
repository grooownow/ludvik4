import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Ludvik4 brand colours", () => {
  it("keeps the approved rose palette and module-label colour", () => {
    const globals = readFileSync(
      new URL("./globals.css", import.meta.url),
      "utf8",
    );
    const chrome = readFileSync(
      new URL("../features/site/site-chrome.tsx", import.meta.url),
      "utf8",
    );

    expect(globals).toContain("--primary: #ff4fb6;");
    expect(globals).toContain("--ring: #ff4fb6;");
    expect(chrome).toContain("text-[#9ca3af]");
  });
});
