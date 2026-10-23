import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MASCOT_PIVOT, STAGE_ART, STAGE_SOURCES } from "./exhibit-art";

const publicFile = (url: string) =>
  existsSync(new URL(`../../../public${url}`, import.meta.url));

describe("STAGE_SOURCES", () => {
  it("points at bg and mascot layers that exist in public/", () => {
    for (const layer of [STAGE_SOURCES.bg, STAGE_SOURCES.mascot]) {
      const urls = [
        ...layer.tall.split(", "),
        ...layer.desktop.split(", "),
      ].map((entry) => entry.split(" ")[0]!);
      for (const url of [...urls, layer.fallback]) {
        expect(publicFile(url), url).toBe(true);
      }
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

describe("MASCOT_PIVOT", () => {
  // The rocking still turns the mascot about its belly centre, projected with
  // the shader's camera, in units of the stage's shorter side.
  it("sits just below the middle of the stage, slightly off centre", () => {
    expect(Math.abs(MASCOT_PIVOT.x)).toBeLessThan(0.03);
    expect(MASCOT_PIVOT.y).toBeLessThan(0);
    expect(MASCOT_PIVOT.y).toBeGreaterThan(-0.15);
  });

  it("rolls about one body radius per radian", () => {
    expect(MASCOT_PIVOT.roll).toBeGreaterThan(0.15);
    expect(MASCOT_PIVOT.roll).toBeLessThan(0.25);
  });
});
