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

  it("numbers the RU mascot № 04 too, with a one-line description", () => {
    render(<HomeStage content={getMarketContent("ru")} />);
    const label = screen.getByTestId("exhibit-label");
    expect(label).toHaveTextContent("Экспонат № 04");
    expect(label).toHaveTextContent("Чистый код, WebGL, ноль полигонов.");
    // Dropped by the owner, RU only (2026-10-23); EN keeps its second line.
    expect(label).not.toHaveTextContent("Обращаться с любопытством");
  });

  it("shows the bottom strip and a scroll cue to the collection", () => {
    render(<HomeStage content={getMarketContent("en")} />);
    // Desktop: founding year and reach left, availability right; no quarter.
    expect(screen.getByText("Est. 2024 · Worldwide")).toHaveClass(
      "max-sm:hidden",
    );
    expect(screen.getByText("Taking projects")).toHaveClass("max-sm:hidden");
    // Phones: one line, availability and reach.
    expect(screen.getByText("Taking projects · Worldwide")).toHaveClass(
      "sm:hidden",
    );
    expect(screen.queryByText(/Q4/)).toBeNull();
    expect(
      screen.getByRole("link", { name: /scroll to the collection/i }),
    ).toHaveAttribute("href", "#collection");
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
