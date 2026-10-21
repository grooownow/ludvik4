// The pre-rendered intro artwork (exported from design.pen frame k6P8zl and
// its tall portrait version). It is the first paint and the fallback; on
// desktop the live scene (intro-scene) paints over it.

/** Width/height of the desktop and tall (portrait) art, in CSS px at 1x. */
export const INTRO_ART = {
  desktop: { width: 1304, height: 680 },
  tall: { width: 390, height: 844 },
} as const;

/** Portrait screens and phones get the tall art so the wordmark never crops. */
export const TALL_ART_MEDIA = "(max-width: 767px), (orientation: portrait)";

const DIR = "/intro/intro-candy";

export const INTRO_SOURCES = {
  tallAvif: `${DIR}-tall-780.avif 780w, ${DIR}-tall-1560.avif 1560w`,
  tallWebp: `${DIR}-tall-780.webp 780w, ${DIR}-tall-1560.webp 1560w`,
  desktopAvif: `${DIR}-desktop-1304.avif 1304w, ${DIR}-desktop-2608.avif 2608w`,
  desktopWebp: `${DIR}-desktop-1304.webp 1304w, ${DIR}-desktop-2608.webp 2608w`,
  fallback: `${DIR}-desktop-1304.webp`,
} as const;

/** Glass-drop tint, as linear 0..1 RGB for the shader. */
export const DROP_TINT: [number, number, number] = [1, 0.82, 0.9];
