// Pre-rendered stills of the exhibit stage (scripts/render-stage-still.ts).
// They are the first paint everywhere and the whole picture wherever the live
// scene does not run.

/** Width/height of the desktop and tall (portrait) stills, in CSS px at 1x. */
export const STAGE_ART = {
  desktop: { width: 1440, height: 900 },
  tall: { width: 780, height: 1560 },
} as const;

/** Portrait screens get the tall still so the mascot is not cropped. */
export const TALL_MEDIA = "(orientation: portrait)";

const DIR = "/stage/stage";

export const STAGE_SOURCES = {
  tall: `${DIR}-tall-780.webp 780w, ${DIR}-tall-1560.webp 1560w`,
  desktop: `${DIR}-1440.webp 1440w, ${DIR}-2880.webp 2880w`,
  fallback: `${DIR}-1440.webp`,
} as const;
