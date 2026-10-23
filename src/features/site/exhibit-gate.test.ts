import { describe, expect, it } from "vitest";
import {
  isSoftwareRenderer,
  renderSize,
  shouldRunLiveStage,
  stageFraming,
} from "./exhibit-gate";

describe("shouldRunLiveStage", () => {
  const ok = { reducedMotion: false, webgl: true, softwareRenderer: false };

  it("runs wherever a GPU renders WebGL and motion is allowed — phones too", () => {
    expect(shouldRunLiveStage(ok)).toBe(true);
    expect(shouldRunLiveStage({ ...ok, reducedMotion: true })).toBe(false);
    expect(shouldRunLiveStage({ ...ok, webgl: false })).toBe(false);
    expect(shouldRunLiveStage({ ...ok, softwareRenderer: true })).toBe(false);
  });
});

describe("stageFraming", () => {
  it("frames the mascot larger and off-centre on a narrow screen", () => {
    expect(stageFraming(true)).toEqual({ zoom: 1.38, x: 0.53, y: 0.43 });
    expect(stageFraming(false)).toEqual({ zoom: 1, x: 0.5, y: 0.5 });
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

describe("renderSize", () => {
  it("renders at 0.85x the device pixels, capped at 2048 px wide", () => {
    expect(renderSize(1440, 900, 2)).toEqual({ width: 2048, height: 1280 });
    expect(renderSize(1000, 800, 1.5)).toEqual({ width: 1275, height: 1020 });
  });

  it("never renders the full tier below one pixel per CSS pixel", () => {
    // 0.85x on a 1x monitor is upscaled by the browser and the silhouette
    // turns into a staircase.
    expect(renderSize(1000, 800, 1)).toEqual({ width: 1000, height: 800 });
    expect(renderSize(2560, 1200, 1)).toEqual({ width: 2560, height: 1200 });
  });

  it("supersamples at 2x on a 1x screen, up to 4096 px wide", () => {
    expect(renderSize(1000, 800, 1, 1, 2)).toEqual({
      width: 2000,
      height: 1600,
    });
    expect(renderSize(2560, 1440, 1, 1, 2)).toEqual({
      width: 4096,
      height: 2304,
    });
  });

  it("renders lower tiers at their own scale", () => {
    expect(renderSize(1000, 800, 1, 0.45, 0)).toEqual({
      width: 450,
      height: 360,
    });
  });

  it("treats device pixel ratios above 2 as 2", () => {
    expect(renderSize(1000, 800, 3)).toEqual({ width: 1700, height: 1360 });
  });
});
