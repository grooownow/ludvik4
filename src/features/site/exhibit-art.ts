// Pre-rendered stills of the exhibit stage (scripts/render-stage-still.ts).
// They are the first paint everywhere and the whole picture wherever the live
// scene does not run.
//
// The shader sizes the mascot by the shorter side of the stage, so the stills
// must be scaled by that same side or the crossfade to the live scene shows
// two mascots. object-cover scales by whichever side overflows less: a 3.2:1
// still is therefore scaled by the height on every landscape screen, and a
// 1:2.4 still by the width on every phone.

/** Width/height of the wide (landscape) and tall (portrait) stills, CSS px at 1x. */
export const STAGE_ART = {
  desktop: { width: 2880, height: 900 },
  tall: { width: 780, height: 1872 },
} as const;

/** Portrait screens get the tall still. */
export const TALL_MEDIA = "(orientation: portrait)";

const DIR = "/stage/stage";

export const STAGE_SOURCES = {
  tall: `${DIR}-tall-780.webp 780w, ${DIR}-tall-1560.webp 1560w`,
  desktop: `${DIR}-wide-2880.webp 2880w, ${DIR}-wide-5760.webp 5760w`,
  fallback: `${DIR}-wide-2880.webp`,
} as const;

/** Rendered widths: the wide still is height-driven, the tall one width-driven. */
export const STAGE_SIZES = {
  desktop: `${Math.ceil((STAGE_ART.desktop.width / STAGE_ART.desktop.height) * 100)}vh`,
  tall: "100vw",
} as const;
