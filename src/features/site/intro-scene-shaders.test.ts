import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INTRO_SCENE, stepSpring } from "./intro-scene-config";
import { dropRadius, shouldRunLiveIntro } from "./intro-scene-shaders";
import { introSources, parseIntroVariant } from "./intro-variants";

const publicFile = (url: string) =>
  existsSync(new URL(`../../../public${url}`, import.meta.url));

const srcsetUrls = (srcset: string) =>
  srcset.split(", ").map((entry) => entry.split(" ")[0]!);

describe("shouldRunLiveIntro", () => {
  const ok = {
    finePointer: true,
    reducedMotion: false,
    wideLandscape: true,
    webgl: true,
  };

  it("runs only with a mouse, motion allowed, a wide landscape screen and WebGL", () => {
    expect(shouldRunLiveIntro(ok)).toBe(true);
    expect(shouldRunLiveIntro({ ...ok, finePointer: false })).toBe(false);
    expect(shouldRunLiveIntro({ ...ok, reducedMotion: true })).toBe(false);
    expect(shouldRunLiveIntro({ ...ok, wideLandscape: false })).toBe(false);
    expect(shouldRunLiveIntro({ ...ok, webgl: false })).toBe(false);
  });
});

describe("dropRadius", () => {
  it("scales with the stage and stays within 70..140 px", () => {
    expect(dropRadius(1000)).toBe(90);
    expect(dropRadius(300)).toBe(70);
    expect(dropRadius(4000)).toBe(140);
  });
});

describe("drop spring", () => {
  const rest = { x: 0, y: 0, vx: 0, vy: 0 };
  const target = { x: 100, y: 0 };

  it("trails the cursor instead of snapping to it", () => {
    const afterOneFrame = stepSpring(rest, target, 1 / 60);
    expect(afterOneFrame.x).toBeGreaterThan(0);
    expect(afterOneFrame.x).toBeLessThan(2);

    let s = rest;
    for (let i = 0; i < 9; i++) s = stepSpring(s, target, 1 / 60);
    // 150 ms after the cursor moved, the drop is still well short of it.
    expect(s.x).toBeLessThan(25);
  });

  it("settles on the cursor and survives a long frame", () => {
    let s = rest;
    for (let i = 0; i < 300; i++) s = stepSpring(s, target, 1 / 60);
    expect(s.x).toBeCloseTo(100, 0);

    const jank = stepSpring(rest, target, 2);
    expect(Number.isFinite(jank.x)).toBe(true);
    expect(Math.abs(jank.x)).toBeLessThan(200);
  });
});

describe("intro variants", () => {
  it("accepts only the two known variants", () => {
    expect(parseIntroVariant("candy")).toBe("candy");
    expect(parseIntroVariant("fuchsia")).toBe("fuchsia");
    expect(parseIntroVariant("neon")).toBeNull();
    expect(parseIntroVariant(null)).toBeNull();
  });

  it("points every artwork source at a file that exists in public/", () => {
    for (const variant of ["candy", "fuchsia"] as const) {
      const src = introSources(variant);
      const urls = [
        src.fallback,
        ...srcsetUrls(src.tallAvif),
        ...srcsetUrls(src.tallWebp),
        ...srcsetUrls(src.desktopAvif),
        ...srcsetUrls(src.desktopWebp),
        INTRO_SCENE[variant].wordmark,
      ];
      for (const url of urls) expect(publicFile(url), url).toBe(true);
    }
  });
});
