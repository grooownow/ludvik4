import { describe, expect, it } from "vitest";
import {
  isSoftwareRenderer,
  renderSize,
  shouldRunLiveStage,
} from "./exhibit-gate";

describe("shouldRunLiveStage", () => {
  const ok = {
    finePointer: true,
    reducedMotion: false,
    wideLandscape: true,
    webgl: true,
    softwareRenderer: false,
  };

  it("runs only with a mouse, motion allowed, a wide landscape screen and GPU WebGL", () => {
    expect(shouldRunLiveStage(ok)).toBe(true);
    expect(shouldRunLiveStage({ ...ok, finePointer: false })).toBe(false);
    expect(shouldRunLiveStage({ ...ok, reducedMotion: true })).toBe(false);
    expect(shouldRunLiveStage({ ...ok, wideLandscape: false })).toBe(false);
    expect(shouldRunLiveStage({ ...ok, webgl: false })).toBe(false);
    expect(shouldRunLiveStage({ ...ok, softwareRenderer: true })).toBe(false);
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
    expect(renderSize(1000, 800, 1)).toEqual({ width: 850, height: 680 });
  });

  it("treats device pixel ratios above 2 as 2", () => {
    expect(renderSize(1000, 800, 3)).toEqual({ width: 1700, height: 1360 });
  });
});
