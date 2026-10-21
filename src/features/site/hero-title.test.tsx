import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { HeroTitle } from "./hero-title";

describe("HeroTitle", () => {
  for (const market of ["ru", "en"] as const) {
    const { hero } = getMarketContent(market);

    it(`${market}: the desktop lines spell exactly the title`, () => {
      expect(hero.titleLines?.join(" ")).toBe(hero.title);
    });

    it(`${market}: the heading reads as the plain title`, () => {
      render(<HeroTitle title={hero.title} lines={hero.titleLines} />);
      expect(
        screen.getByRole("heading", { level: 1, name: hero.title }),
      ).toHaveTextContent(hero.title);
    });
  }
});
