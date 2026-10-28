import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { HomeStage } from "./home-stage";

describe("HomeStage", () => {
  it("carries the page H1 for search and screen readers", () => {
    const content = getMarketContent("en");
    render(<HomeStage content={content} />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(content.h1);
    expect(h1).toHaveClass("sr-only");
  });

  it("shows the exhibit label as Nº 04", () => {
    render(<HomeStage content={getMarketContent("en")} />);
    const label = screen.getByTestId("exhibit-label");
    expect(label).toHaveTextContent("Exhibit Nº 04");
    expect(label).toHaveTextContent("Ludvik");
    expect(label).toHaveTextContent("Pure code, WebGL, zero polygons.");
    expect(label).toHaveTextContent("Handle with curiosity.");
    // Phones keep only the first line: the label there is small and dense.
    expect(screen.getByText("Handle with curiosity.")).toHaveClass(
      "max-sm:hidden",
    );
    expect(
      screen.getByText("Pure code, WebGL, zero polygons."),
    ).not.toHaveClass("max-sm:hidden");
  });

  it("numbers the RU mascot № 04 too and says what it is in plain words", () => {
    render(<HomeStage content={getMarketContent("ru")} />);
    const label = screen.getByTestId("exhibit-label");
    expect(label).toHaveTextContent("Экспонат № 04");
    // Phones show the first line only: what it is; desktop adds how.
    expect(screen.getByText("Анимированный маскот студии.")).not.toHaveClass(
      "max-sm:hidden",
    );
    expect(
      screen.getByText(
        "Откликается на клик, перетаскивание и свайп по тачпаду.",
      ),
    ).toHaveClass("max-sm:hidden");
    // "Zero polygons" meant nothing to clients (owner, 2026-10-26).
    expect(label).not.toHaveTextContent("полигон");
  });

  it("keeps only the scroll cue under the stage, no strip text", () => {
    render(<HomeStage content={getMarketContent("ru")} />);
    const cue = screen.getByRole("link", { name: /прокрутить к коллекции/i });
    expect(cue).toHaveAttribute("href", "#collection");
    expect(cue.parentElement!.children).toHaveLength(1);
    expect(screen.queryByText(/Беру проекты/)).toBeNull();
    expect(screen.queryByText(/По всему миру/)).toBeNull();
  });

  it("has a text-only menu with Contact linking to /contact", () => {
    render(<HomeStage content={getMarketContent("en")} />);
    const nav = screen.getAllByRole("navigation", {
      name: "Main navigation",
    })[0]!;
    expect(within(nav).queryByRole("button")).toBeNull();
    expect(within(nav).getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("menu links stay clickable over the stage", () => {
    const { container } = render(
      <HomeStage content={getMarketContent("en")} />,
    );
    const canvas = container.querySelector("canvas")!;
    const header = container.querySelector("header")!;
    // The overlay comes after the canvas in DOM order and re-enables
    // pointer events only on its interactive parts.
    expect(
      canvas.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(header.closest(".pointer-events-none")).not.toBeNull();
    expect(header).toHaveClass("pointer-events-auto");
  });
});
