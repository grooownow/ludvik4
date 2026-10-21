import { describe, expect, it } from "vitest";
import { easeInOutCubic, handoffTarget } from "./intro-scroll-handoff";

describe("handoffTarget", () => {
  const introBottom = 800;

  it("glides down to the content from anywhere inside the intro", () => {
    expect(handoffTarget(0, introBottom, "down")).toBe(800);
    expect(handoffTarget(500, introBottom, "down")).toBe(800);
  });

  it("glides back to the intro only from the top of the content", () => {
    expect(handoffTarget(800, introBottom, "up")).toBe(0);
    expect(handoffTarget(300, introBottom, "up")).toBe(0);
  });

  it("leaves ordinary scrolling alone everywhere else", () => {
    expect(handoffTarget(800, introBottom, "down")).toBeNull();
    expect(handoffTarget(2400, introBottom, "down")).toBeNull();
    expect(handoffTarget(2400, introBottom, "up")).toBeNull();
    expect(handoffTarget(0, introBottom, "up")).toBeNull();
  });
});

describe("easeInOutCubic", () => {
  it("starts and ends gently and is symmetric", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 10);
    expect(easeInOutCubic(0.1)).toBeLessThan(0.1);
    expect(easeInOutCubic(0.9)).toBeGreaterThan(0.9);
  });
});
