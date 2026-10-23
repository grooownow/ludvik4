import { describe, expect, it } from "vitest";
import {
  createFrameMonitor,
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
  it("go from full to a lighter shader, each cheaper than the last", () => {
    expect(TIERS[0]).toEqual({ scale: 0.85, lite: false, minDensity: 1 });
    for (let i = 1; i < TIERS.length; i++) {
      expect(TIERS[i]!.scale).toBeLessThan(TIERS[i - 1]!.scale);
    }
    expect(TIERS.at(-1)!.lite).toBe(true);
    expect(STILL_TIER).toBe(TIERS.length);
  });
});

describe("createFrameMonitor", () => {
  it("keeps the tier on a fast machine", () => {
    const monitor = createFrameMonitor(0);
    expect(feed(monitor, 16.7, 300)).toEqual([]);
  });

  it("steps down one tier at a time on a slow machine, down to the still", () => {
    const monitor = createFrameMonitor(0);
    expect(feed(monitor, 40, 300)).toEqual([1, 2, 3]);
  });

  it("ignores the warm-up frames", () => {
    const monitor = createFrameMonitor(0);
    expect(feed(monitor, 80, 19)).toEqual([]);
  });

  it("ignores gaps from hidden tabs and scrolled-away pauses", () => {
    const monitor = createFrameMonitor(0);
    feed(monitor, 16.7, 30);
    expect(feed(monitor, 2000, 5)).toEqual([]);
    expect(feed(monitor, 16.7, 100)).toEqual([]);
  });

  it("stops measuring once a tier holds", () => {
    const monitor = createFrameMonitor(0);
    feed(monitor, 16.7, 100);
    // A later stutter (a heavy page elsewhere) does not demote a machine
    // that already proved itself.
    expect(feed(monitor, 60, 200)).toEqual([]);
  });
});

describe("qualityOverride", () => {
  it("reads ?quality= for testing any tier on any machine", () => {
    expect(qualityOverride("?quality=full")).toBe(0);
    expect(qualityOverride("?quality=medium")).toBe(1);
    expect(qualityOverride("?quality=lite")).toBe(2);
    expect(qualityOverride("?quality=still")).toBe(STILL_TIER);
    expect(qualityOverride("?utm_source=x")).toBeNull();
    expect(qualityOverride("?quality=nonsense")).toBeNull();
  });
});
