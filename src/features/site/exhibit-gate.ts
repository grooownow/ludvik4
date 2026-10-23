// When the live exhibit stage may run, and at what resolution. Same gate as
// the old intro (ADR 0012): the raymarched scene is real GPU work per frame,
// so phones, touch, reduced motion and CPU-emulated WebGL get the still.

export function shouldRunLiveStage(env: {
  finePointer: boolean;
  reducedMotion: boolean;
  wideLandscape: boolean;
  webgl: boolean;
  /** WebGL emulated on the CPU (no GPU): the shader would freeze the page. */
  softwareRenderer: boolean;
}): boolean {
  return (
    env.finePointer &&
    !env.reducedMotion &&
    env.wideLandscape &&
    env.webgl &&
    !env.softwareRenderer
  );
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
