import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollRevealHeader, revealOpacity } from "./scroll-reveal-header";

describe("revealOpacity", () => {
  it("is hidden at the top and fully in after 30% of the viewport", () => {
    expect(revealOpacity(0, 1000)).toBe(0);
    expect(revealOpacity(300, 1000)).toBe(1);
    expect(revealOpacity(5000, 1000)).toBe(1);
    expect(revealOpacity(-50, 1000)).toBe(0);
  });

  it("eases in rather than growing linearly", () => {
    expect(revealOpacity(150, 1000)).toBeCloseTo(0.5, 5);
    // smoothstep: a quarter of the way in shows less than a quarter.
    expect(revealOpacity(75, 1000)).toBeLessThan(0.25);
    expect(revealOpacity(75, 1000)).toBeGreaterThan(0);
  });
});

describe("ScrollRevealHeader", () => {
  it("keeps the header out of sight and out of reach at the top of the page", () => {
    render(
      <ScrollRevealHeader>
        <button type="button">Discuss a project</button>
      </ScrollRevealHeader>,
    );
    const wrapper = screen.getByTestId("scroll-reveal-header");
    expect(wrapper).toHaveStyle({ opacity: "0", visibility: "hidden" });
  });
});
