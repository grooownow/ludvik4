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
    // RU positioning: the studio speaks as "мы", never as a lone "я".
    expect(main.textContent).not.toMatch(
      /(^|[\s.,—])Я\s|одного человека|Один исполнитель|у меня/,
    );
    expect(main.textContent).toContain("Ludvik4 — студия веб-разработки");
  });

  it("links to the blog, its one entry point on the site", () => {
    render(<AboutRuView />);
    expect(screen.getByRole("heading", { name: "Блог" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Читать блог →" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("ends with the way to /contact (the order form when configured)", () => {
    render(<AboutRuView />);
    expect(
      screen.getByRole("link", { name: "Обсудить проект" }),
    ).toHaveAttribute("href", "/contact");
  });
});
