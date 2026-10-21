import { describe, expect, it } from "vitest";
import { dropRadius, shouldEnableDrop } from "./cursor-drop-shader";
import { introSources, parseIntroVariant } from "./intro-variants";

describe("shouldEnableDrop", () => {
  const ok = { finePointer: true, reducedMotion: false, webgl: true };

  it("runs only with a mouse, motion allowed and WebGL available", () => {
    expect(shouldEnableDrop(ok)).toBe(true);
    expect(shouldEnableDrop({ ...ok, finePointer: false })).toBe(false);
    expect(shouldEnableDrop({ ...ok, reducedMotion: true })).toBe(false);
    expect(shouldEnableDrop({ ...ok, webgl: false })).toBe(false);
  });
});

describe("dropRadius", () => {
  it("scales with the stage and stays within 70..140 px", () => {
    expect(dropRadius(1000)).toBe(90);
    expect(dropRadius(300)).toBe(70);
    expect(dropRadius(4000)).toBe(140);
  });
});

describe("intro variants", () => {
  it("accepts only the two known variants", () => {
    expect(parseIntroVariant("candy")).toBe("candy");
    expect(parseIntroVariant("fuchsia")).toBe("fuchsia");
    expect(parseIntroVariant("neon")).toBeNull();
    expect(parseIntroVariant(null)).toBeNull();
  });

  it("points every source at a file that exists in public/", async () => {
    const { existsSync } = await import("node:fs");
    const publicDir = new URL("../../../public", import.meta.url);
    for (const variant of ["candy", "fuchsia"] as const) {
      const src = introSources(variant);
      const urls = [src.mobileAvif, src.mobileWebp, src.fallback]
        .concat(src.desktopAvif.split(", ").map((s) => s.split(" ")[0]!))
        .concat(src.desktopWebp.split(", ").map((s) => s.split(" ")[0]!));
      for (const url of urls) {
        expect(
          existsSync(new URL(`${publicDir.pathname}${url}`, "file:")),
          url,
        ).toBe(true);
      }
    }
  });
});
