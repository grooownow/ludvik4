import { describe, expect, it } from "vitest";
import {
  createFrameMonitor,
  FULL_TIER,
  qualityOverride,
  STILL_TIER,
  TIERS,
} from "./exhibit-quality";

const feed = (
  monitor: ReturnType<typeof createFrameMonitor>,
  ms: number,
  n: number,
) => {
  const changes: number[] = [];
  for (let i = 0; i < n; i++) {
    const tier = monitor.sample(ms);
    if (tier !== null) changes.push(tier);
  }
  return changes;
};

describe("quality tiers", () => {
  it("go from supersampled through full to a lighter shader, each cheaper than the last", () => {
    expect(TIERS[0]).toEqual({ scale: 1, lite: false, minDensity: 2 });
    expect(TIERS[FULL_TIER]).toEqual({
      scale: 0.85,
      lite: false,
      minDensity: 1,
    });
    for (let i = 1; i < TIERS.length; i++) {
      expect(TIERS[i]!.scale).toBeLessThan(TIERS[i - 1]!.scale);
    }
    expect(TIERS.at(-1)!.lite).toBe(true);
    expect(STILL_TIER).toBe(TIERS.length);
  });
});

describe("createFrameMonitor", () => {
  it("keeps the tier on a fast machine", () => {
    const monitor = createFrameMonitor(FULL_TIER);
    expect(feed(monitor, 16.7, 300)).toEqual([]);
  });

  it("steps down one tier at a time on a slow machine, down to the still", () => {
    const monitor = createFrameMonitor(FULL_TIER);
    expect(feed(monitor, 40, 300)).toEqual([2, 3, 4]);
  });

  it("ignores the warm-up frames", () => {
    const monitor = createFrameMonitor(FULL_TIER);
    expect(feed(monitor, 80, 19)).toEqual([]);
  });

  it("ignores gaps from hidden tabs and scrolled-away pauses", () => {
    const monitor = createFrameMonitor(FULL_TIER);
    feed(monitor, 16.7, 30);
    expect(feed(monitor, 2000, 5)).toEqual([]);
    expect(feed(monitor, 16.7, 100)).toEqual([]);
  });

  it("on a 1x screen with headroom, tries supersampling and keeps it", () => {
    const monitor = createFrameMonitor(FULL_TIER, { supersample: true });
    expect(feed(monitor, 16.7, 300)).toEqual([0]);
  });

  it("drops supersampling the moment it costs frames, and never retries", () => {
    const monitor = createFrameMonitor(FULL_TIER, { supersample: true });
    expect(feed(monitor, 16.7, 60)).toEqual([0]);
    expect(feed(monitor, 33.4, 300)).toEqual([FULL_TIER]);
    expect(feed(monitor, 16.7, 300)).toEqual([]);
  });

  it("judges the loss against the screen's own rate (120 Hz)", () => {
    const monitor = createFrameMonitor(FULL_TIER, { supersample: true });
    expect(feed(monitor, 8.3, 60)).toEqual([0]);
    // Still far under the slow threshold, but a drop from 120 to ~80 fps.
    expect(feed(monitor, 12.5, 300)).toEqual([FULL_TIER]);
  });

  it("does not supersample a slow machine", () => {
    const monitor = createFrameMonitor(FULL_TIER, { supersample: true });
    expect(feed(monitor, 40, 300)).toEqual([2, 3, 4]);
  });

  it("stops measuring once a tier holds", () => {
    const monitor = createFrameMonitor(FULL_TIER);
    feed(monitor, 16.7, 100);
    // A later stutter (a heavy page elsewhere) does not demote a machine
    // that already proved itself.
    expect(feed(monitor, 60, 200)).toEqual([]);
  });
});

describe("qualityOverride", () => {
  it("reads ?quality= for testing any tier on any machine", () => {
    expect(qualityOverride("?quality=super")).toBe(0);
    expect(qualityOverride("?quality=full")).toBe(FULL_TIER);
    expect(qualityOverride("?quality=medium")).toBe(2);
    expect(qualityOverride("?quality=lite")).toBe(3);
    expect(qualityOverride("?quality=still")).toBe(STILL_TIER);
    expect(qualityOverride("?utm_source=x")).toBeNull();
    expect(qualityOverride("?quality=nonsense")).toBeNull();
  });
});
