import { STAGE_CAMERA } from "./exhibit-shader";

// Pre-rendered stills of the exhibit stage (scripts/render-stage-still.ts),
// in two layers: the stage with the mascot's floor shadow but no mascot (bg),
// and the mascot alone on transparency. Stacked they are the first paint
// everywhere; where the live scene does not run, the mascot layer rocks with
// CSS on its own.
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

/** Portrait screens get the tall stills. */
export const TALL_MEDIA = "(orientation: portrait)";

function layer(name: "bg" | "mascot") {
  const dir = `/stage/stage-${name}`;
  return {
    tall: `${dir}-tall-780.webp 780w, ${dir}-tall-1560.webp 1560w`,
    desktop: `${dir}-wide-2880.webp 2880w, ${dir}-wide-5760.webp 5760w`,
    fallback: `${dir}-wide-2880.webp`,
  } as const;
}

export const STAGE_SOURCES = { bg: layer("bg"), mascot: layer("mascot") };

/** Rendered widths: the wide still is height-driven, the tall one width-driven. */
export const STAGE_SIZES = {
  desktop: `${Math.ceil((STAGE_ART.desktop.width / STAGE_ART.desktop.height) * 100)}vh`,
  tall: "100vw",
} as const;

/**
 * Where the rocking still turns the mascot: its belly centre (world (0,1,0),
 * the roly-poly's rolling sphere) projected with the shader's camera, plus
 * how far that centre rolls per radian of tilt (one body radius). All in
 * units of the stage's shorter side, from the stage centre, y up.
 */
export const MASCOT_PIVOT = (() => {
  const { yaw, pitch } = STAGE_CAMERA;
  const target = [0, 1.55, 0];
  const ro = [
    target[0]! + 10 * Math.sin(yaw) * Math.cos(pitch),
    target[1]! + 10 * Math.sin(pitch),
    target[2]! + 10 * Math.cos(yaw) * Math.cos(pitch),
  ];
  const sub = (a: number[], b: number[]) => a.map((v, i) => v - b[i]!);
  const dot = (a: number[], b: number[]) =>
    a.reduce((s, v, i) => s + v * b[i]!, 0);
  const norm = (a: number[]) => a.map((v) => v / Math.hypot(...a));
  const fwd = norm(sub(target, ro));
  const right = norm([-fwd[2]!, 0, fwd[0]!]);
  const up = [
    right[1]! * fwd[2]! - right[2]! * fwd[1]!,
    right[2]! * fwd[0]! - right[0]! * fwd[2]!,
    right[0]! * fwd[1]! - right[1]! * fwd[0]!,
  ];
  const v = sub([0, 1, 0], ro);
  const z = dot(v, fwd);
  return {
    x: (dot(v, right) * 1.75) / z,
    y: (dot(v, up) * 1.75) / z,
    roll: 1.75 / z,
  };
})();
