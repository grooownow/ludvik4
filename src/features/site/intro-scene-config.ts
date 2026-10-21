import type { IntroVariant } from "./intro-variants";
import type { PenOverrides } from "./pen-shader";

// Uniform values copied from design.pen (frames k6P8zl / HGwzH). Anything not
// listed falls back to the shader's own @default, exactly as Pen does.

/** The artboard the shaders were tuned on; pixel-unit uniforms scale from it. */
export const DESIGN_SIZE = { width: 1304, height: 680 } as const;

/** Silk uniforms measured in design pixels (scaled with the render size). */
export const SILK_PIXEL_UNIFORMS = ["u_stripeWidth", "u_bend"] as const;

export const INTRO_SCENE: Record<
  IntroVariant,
  { silk: PenOverrides; smoosh: PenOverrides; wordmark: string }
> = {
  candy: {
    wordmark: "/intro/wordmark-candy.webp",
    silk: {
      u_color1: "#0c0208",
      u_color2: "#3a0820",
      u_color3: "#d80e66",
      u_color4: "#ff9cc8",
    },
    smoosh: {
      u_swing: 0.8,
      u_deep: "#2a0618",
      u_line: 0.555,
      u_drag: 0.9,
      u_spread: 0.8,
      u_blur: 0.15,
      u_center: 0.5,
      u_angle: 0,
      u_grain: 0,
      u_flow: 0.27,
      u_turns: 1.6,
      u_heat: 0.75,
      u_cold: 0.45,
      u_glow: "#ff9cc8",
      u_ribbon: "#9e0848",
      u_ice: "#ffd6e8",
      u_chill: "#5a0a35",
    },
  },
  fuchsia: {
    wordmark: "/intro/wordmark-fuchsia.webp",
    silk: {
      u_color1: "#050106",
      u_color2: "#140410",
      u_color3: "#3a0a2c",
      u_color4: "#7a1452",
    },
    smoosh: {
      u_swing: 0.7,
      u_deep: "#050106",
      u_line: 0.555,
      u_drag: 0.77,
      u_spread: 0.72,
      u_blur: 0.5,
      u_center: 0.5,
      u_angle: 0,
      u_grain: 0,
      u_flow: 0.27,
      u_turns: 1.1,
      u_heat: 0.6,
      u_cold: 0.3,
      u_glow: "#5e0d3a",
      u_ribbon: "#8f0f52",
      u_ice: "#2e0a22",
      u_chill: "#22061a",
    },
  },
};

/**
 * Spring that drags the drop toward the cursor. Low stiffness and slightly
 * under-critical damping make it trail the mouse and settle with a soft
 * overshoot — heavy, not twitchy.
 */
export const DROP_SPRING = { stiffness: 14, damping: 6.2 } as const;

export type SpringState = { x: number; y: number; vx: number; vy: number };

export function stepSpring(
  s: SpringState,
  target: { x: number; y: number },
  dtSeconds: number,
  spring: { stiffness: number; damping: number } = DROP_SPRING,
): SpringState {
  // Sub-step so a long frame (tab switch, jank) cannot make it explode.
  const steps = Math.max(1, Math.ceil(dtSeconds / (1 / 120)));
  const h = Math.min(dtSeconds, 0.1) / steps;
  let { x, y, vx, vy } = s;
  for (let i = 0; i < steps; i++) {
    vx += (spring.stiffness * (target.x - x) - spring.damping * vx) * h;
    vy += (spring.stiffness * (target.y - y) - spring.damping * vy) * h;
    x += vx * h;
    y += vy * h;
  }
  return { x, y, vx, vy };
}
