import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INTRO_SCENE, stepSpring } from "./intro-scene-config";
import {
  dropRadius,
  isSoftwareRenderer,
  shouldRunLiveIntro,
} from "./intro-scene-shaders";
import { INTRO_SOURCES } from "./intro-art";

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
    softwareRenderer: false,
  };

  it("runs only with a mouse, motion allowed, a wide landscape screen and WebGL", () => {
    expect(shouldRunLiveIntro(ok)).toBe(true);
    expect(shouldRunLiveIntro({ ...ok, finePointer: false })).toBe(false);
    expect(shouldRunLiveIntro({ ...ok, reducedMotion: true })).toBe(false);
    expect(shouldRunLiveIntro({ ...ok, wideLandscape: false })).toBe(false);
    expect(shouldRunLiveIntro({ ...ok, webgl: false })).toBe(false);
    expect(shouldRunLiveIntro({ ...ok, softwareRenderer: true })).toBe(false);
  });
});

describe("isSoftwareRenderer", () => {
  it("spots CPU-emulated WebGL and passes real GPUs", () => {
    expect(
      isSoftwareRenderer(
        "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)",
      ),
    ).toBe(true);
    expect(isSoftwareRenderer("llvmpipe (LLVM 15.0.7, 256 bits)")).toBe(true);
    expect(
      isSoftwareRenderer(
        "ANGLE (Apple, ANGLE Metal Renderer: Apple M2, Unspecified Version)",
      ),
    ).toBe(false);
    expect(isSoftwareRenderer("")).toBe(false);
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

describe("intro artwork", () => {
  it("points every artwork source at a file that exists in public/", () => {
    const urls = [
      INTRO_SOURCES.fallback,
      ...srcsetUrls(INTRO_SOURCES.tallAvif),
      ...srcsetUrls(INTRO_SOURCES.tallWebp),
      ...srcsetUrls(INTRO_SOURCES.desktopAvif),
      ...srcsetUrls(INTRO_SOURCES.desktopWebp),
      INTRO_SCENE.wordmark,
    ];
    for (const url of urls) expect(publicFile(url), url).toBe(true);
  });
});
