import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { ServicesIndexView } from "./services-index";

describe("ServicesIndexView", () => {
  it("EN lists the three service pages", () => {
    render(<ServicesIndexView content={getMarketContent("en")} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Services" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Explore website development/ }),
    ).toHaveAttribute("href", "/services/websites");
    expect(
      screen.getByRole("link", { name: /Explore workflow automation/ }),
    ).toHaveAttribute("href", "/services/workflow-automation");
    expect(
      screen.getByRole("link", { name: /Explore MVP development/ }),
    ).toHaveAttribute("href", "/services/mvp-development");
  });

  it("RU lists the three service pages", () => {
    render(<ServicesIndexView content={getMarketContent("ru")} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Услуги" }),
    ).toBeInTheDocument();
    const hrefs = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((h) => h?.startsWith("/uslugi/"));
    expect(hrefs).toEqual([
      "/uslugi/razrabotka-lendinga",
      "/uslugi/avtomatizatsiya-biznes-processov",
      "/uslugi/razrabotka-mvp",
    ]);
  });
});
