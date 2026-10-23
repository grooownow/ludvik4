// Quality ladder for the live exhibit stage. The scene starts at full
// quality and measures its own frames: a machine that cannot keep up steps
// down — lower resolution, then a lighter shader, then the still image that
// rocks with CSS. On a 1x screen a machine with headroom is offered one step
// up instead: supersampling, kept only if it costs no frames at all.
// Measuring beats guessing from the user agent, which says nothing about the
// GPU.

// `minDensity`: the fewest render pixels per CSS pixel. Supersampling renders
// 2x on a 1x screen and lets the browser average it down (smooth edges, as on
// Retina); the full tier guarantees a crisp silhouette; the lower ones trade
// it for frame rate.
export type QualityTier = { scale: number; lite: boolean; minDensity: number };

export const TIERS: readonly QualityTier[] = [
  { scale: 1, lite: false, minDensity: 2 },
  { scale: 0.85, lite: false, minDensity: 1 },
  { scale: 0.6, lite: false, minDensity: 0 },
  { scale: 0.45, lite: true, minDensity: 0 },
];

/** Where every machine starts; above it only a proven supersample. */
export const FULL_TIER = 1;

/** Past the last live tier: the CSS-rocking still. */
export const STILL_TIER = TIERS.length;

const WARM_UP = 20; // frames skipped after (re)starting: shader compile, first paints
const WINDOW = 40; // frames measured per tier
const SLOW_MS = 22; // median frame time above this (< ~45 fps) steps down
const GAP_MS = 250; // longer gaps are pauses (hidden tab, scrolled away), not slowness
// Supersampling must keep the frame rate the screen had at full: the median
// may not grow past this share of the baseline (plus timer jitter). A missed
// vsync doubles the frame time, far beyond it.
const NO_LOSS = 1.1;
const JITTER_MS = 1;

const median = (samples: number[]) =>
  [...samples].sort((a, b) => a - b)[Math.floor(samples.length / 2)]!;

/**
 * Feed frame times; returns the new tier when the scene must change it.
 * `supersample`: the screen is 1x, so a step up to supersampling is worth
 * trying once the start tier proves fast.
 */
export function createFrameMonitor(
  start: number,
  { supersample = false }: { supersample?: boolean } = {},
) {
  let tier = start;
  let skipped = 0;
  let samples: number[] = [];
  let settled = start >= STILL_TIER;
  let baseline: number | null = null; // full-tier median while probing up

  const restart = (next: number) => {
    tier = next;
    skipped = 0;
    return next;
  };

  return {
    sample(frameMs: number): number | null {
      if (settled || frameMs > GAP_MS) return null;
      if (skipped < WARM_UP) {
        skipped++;
        return null;
      }
      samples.push(frameMs);
      if (samples.length < WINDOW) return null;

      const m = median(samples);
      samples = [];
      if (baseline !== null) {
        // Probing supersampling: keep it only at no cost.
        settled = true;
        return m <= baseline * NO_LOSS + JITTER_MS ? null : restart(FULL_TIER);
      }
      if (m <= SLOW_MS) {
        if (supersample && tier === FULL_TIER) {
          baseline = m;
          return restart(0);
        }
        settled = true;
        return null;
      }
      if (tier + 1 >= STILL_TIER) settled = true;
      return restart(tier + 1);
    },
  };
}

const OVERRIDES: Record<string, number> = {
  super: 0,
  full: FULL_TIER,
  medium: 2,
  lite: 3,
  still: STILL_TIER,
};

/** `?quality=super|full|medium|lite|still` pins a tier, for testing on any machine. */
export function qualityOverride(search: string): number | null {
  const value = new URLSearchParams(search).get("quality");
  return value !== null && value in OVERRIDES ? OVERRIDES[value]! : null;
}
