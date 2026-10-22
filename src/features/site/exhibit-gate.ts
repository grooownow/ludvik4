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
export const RENDER_SCALE = 0.7;
export const MAX_RENDER_WIDTH = 1600;

/** Drawing-buffer size for a stage of `cssW` × `cssH` CSS pixels. */
export function renderSize(
  cssW: number,
  cssH: number,
  dpr: number,
): { width: number; height: number } {
  let scale = Math.min(dpr || 1, 2) * RENDER_SCALE;
  if (cssW * scale > MAX_RENDER_WIDTH) scale = MAX_RENDER_WIDTH / cssW;
  return { width: Math.round(cssW * scale), height: Math.round(cssH * scale) };
}
