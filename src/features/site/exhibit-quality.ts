// Quality ladder for the live exhibit stage. The scene starts at full
// quality and measures its own frames: a machine that cannot keep up steps
// down — lower resolution, then a lighter shader, then the still image that
// rocks with CSS. Measuring beats guessing from the user agent, which says
// nothing about the GPU.

export type QualityTier = { scale: number; lite: boolean };

export const TIERS: readonly QualityTier[] = [
  { scale: 0.85, lite: false },
  { scale: 0.6, lite: false },
  { scale: 0.45, lite: true },
];

/** Past the last live tier: the CSS-rocking still. */
export const STILL_TIER = TIERS.length;

const WARM_UP = 20; // frames skipped after (re)starting: shader compile, first paints
const WINDOW = 40; // frames measured per tier
const SLOW_MS = 22; // median frame time above this (< ~45 fps) steps down
const GAP_MS = 250; // longer gaps are pauses (hidden tab, scrolled away), not slowness

/** Feed frame times; returns the new tier when the scene must step down. */
export function createFrameMonitor(start: number) {
  let tier = start;
  let skipped = 0;
  let samples: number[] = [];
  let settled = start >= STILL_TIER;

  return {
    sample(frameMs: number): number | null {
      if (settled || frameMs > GAP_MS) return null;
      if (skipped < WARM_UP) {
        skipped++;
        return null;
      }
      samples.push(frameMs);
      if (samples.length < WINDOW) return null;

      const sorted = [...samples].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)]!;
      samples = [];
      if (median <= SLOW_MS) {
        settled = true;
        return null;
      }
      tier++;
      skipped = 0;
      if (tier >= STILL_TIER) settled = true;
      return tier;
    },
  };
}

const OVERRIDES: Record<string, number> = {
  full: 0,
  medium: 1,
  lite: 2,
  still: STILL_TIER,
};

/** `?quality=full|medium|lite|still` pins a tier, for testing on any machine. */
export function qualityOverride(search: string): number | null {
  const value = new URLSearchParams(search).get("quality");
  return value !== null && value in OVERRIDES ? OVERRIDES[value]! : null;
}
