import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutRuView } from "./about-ru";

describe("AboutRuView", () => {
  it("is the Russian About page with a Russian H1 and no English copy", () => {
    const { container } = render(<AboutRuView />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /[А-Яа-я]/,
    );
    const main = container.querySelector("main")!;
    expect(main.textContent).not.toMatch(
      /founder-led|Direct communication|Engineering evidence/i,
    );
    // RU positioning: an independent developer, not a permanent team.
    expect(main.textContent).not.toMatch(/команда разработчиков|ML-инженер/);
  });

  it("ends with the way to /contact", () => {
    render(<AboutRuView />);
    expect(
      screen.getByRole("link", { name: "Обсудить проект" }),
    ).toHaveAttribute("href", "/contact");
  });
});
