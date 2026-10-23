// When the live exhibit stage may run, and at what resolution. Any device
// whose GPU renders WebGL gets the live scene — phones included (owner,
// 2026-10-23); reduced motion and CPU-emulated WebGL get the still, and the
// quality ladder (exhibit-quality.ts) steps a slow device down to it.

export function shouldRunLiveStage(env: {
  reducedMotion: boolean;
  webgl: boolean;
  /** WebGL emulated on the CPU (no GPU): the shader would freeze the page. */
  softwareRenderer: boolean;
}): boolean {
  return !env.reducedMotion && env.webgl && !env.softwareRenderer;
}

/** Screens narrower than this get the phone framing (Tailwind's `sm`). */
export const NARROW_MEDIA = "(max-width: 639px)";

/**
 * How the stage frames the mascot: `zoom` over its default size (set by the
 * shorter side) and where its centre sits, as fractions of the stage from the
 * left and the top. On a phone it is larger and a touch right of centre, so
 * both arms stay in frame (docs/specs/immersive-home.md, mobile first screen).
 * The still layers apply the same framing in CSS (exhibit-stage.tsx).
 */
export function stageFraming(narrow: boolean): {
  zoom: number;
  x: number;
  y: number;
} {
  return narrow
    ? { zoom: 1.38, x: 0.53, y: 0.43 }
    : { zoom: 1, x: 0.5, y: 0.5 };
}

export function isSoftwareRenderer(renderer: string): boolean {
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

/** The scene renders below device resolution; raymarching cost grows with pixels. */
export const RENDER_SCALE = 0.85;
export const MAX_RENDER_WIDTH = 2048;
/** Hard limit for supersampling, which the width cap does not trim. */
export const MAX_SUPERSAMPLE_WIDTH = 4096;

/**
 * Drawing-buffer size for a stage of `cssW` × `cssH` CSS pixels. `minDensity`
 * floors render pixels per CSS pixel: below 1 the browser upscales the canvas
 * and the silhouette turns into a staircase, so the full tier never goes
 * there — the width cap only trims oversampling on high-DPR screens. A
 * floor above 1 is supersampling, limited by MAX_SUPERSAMPLE_WIDTH instead.
 */
export function renderSize(
  cssW: number,
  cssH: number,
  dpr: number,
  renderScale: number = RENDER_SCALE,
  minDensity: number = 1,
): { width: number; height: number } {
  let scale = Math.min(dpr || 1, 2) * renderScale;
  if (cssW * scale > MAX_RENDER_WIDTH) scale = MAX_RENDER_WIDTH / cssW;
  scale = Math.max(scale, Math.min(minDensity, MAX_SUPERSAMPLE_WIDTH / cssW));
  return { width: Math.round(cssW * scale), height: Math.round(cssH * scale) };
}
