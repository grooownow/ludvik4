import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STAGE_ART, STAGE_SOURCES } from "./exhibit-art";

const publicFile = (url: string) =>
  existsSync(new URL(`../../../public${url}`, import.meta.url));

describe("STAGE_SOURCES", () => {
  it("points at stills that exist in public/", () => {
    const urls = [
      ...STAGE_SOURCES.tall.split(", "),
      ...STAGE_SOURCES.desktop.split(", "),
    ].map((entry) => entry.split(" ")[0]!);
    for (const url of [...urls, STAGE_SOURCES.fallback]) {
      expect(publicFile(url), url).toBe(true);
    }
  });
});

describe("STAGE_ART", () => {
  // object-cover must scale the still by the same side the shader sizes the
  // mascot by: wide enough that landscape screens scale by height, tall
  // enough that phones scale by width.
  it("is wider than any common landscape screen", () => {
    const { width, height } = STAGE_ART.desktop;
    expect(width / height).toBeGreaterThanOrEqual(3);
  });

  it("is taller than any common phone", () => {
    const { width, height } = STAGE_ART.tall;
    expect(height / width).toBeGreaterThanOrEqual(2.3);
  });
});
