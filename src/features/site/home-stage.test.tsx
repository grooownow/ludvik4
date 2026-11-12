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

  it("shows the mascot's label without a museum number", () => {
    render(<HomeStage content={getMarketContent("en")} />);
    const label = screen.getByTestId("exhibit-label");
    expect(label).not.toHaveTextContent(/Exhibit|Nº/);
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

  it("says what the RU mascot is in plain words, without a museum number", () => {
    render(<HomeStage content={getMarketContent("ru")} />);
    const label = screen.getByTestId("exhibit-label");
    expect(label).not.toHaveTextContent(/Экспонат|№/);
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

  // The bubble over the mascot is gone (owner, 2026-11-12); its "an
  // animation like this" order button now ends the label.
  it("ends the RU label with the animation order button, no bubble", () => {
    render(<HomeStage content={getMarketContent("ru")} />);
    const label = screen.getByTestId("exhibit-label");
    const cta = within(label).getByRole("link", {
      name: /Хочу такую анимацию/,
    });
    expect(cta).toHaveAttribute("href", "/contact");
    expect(cta).toHaveClass("pointer-events-auto");
    // A pink text link, as in the old bubble — not a filled button.
    expect(cta).toHaveClass("text-primary", "font-medium");
    expect(cta.className.split(" ")).not.toContain("bg-foreground");
    expect(label.lastElementChild).toBe(cta);
    expect(screen.queryByTestId("mascot-reply")).toBeNull();
    expect(screen.queryByText(/Понравилось/)).toBeNull();
  });

  it("EN label's button leads to the animation enquiry", () => {
    render(<HomeStage content={getMarketContent("en")} />);
    const label = screen.getByTestId("exhibit-label");
    expect(
      within(label).getByRole("link", { name: /I want this animation/ }),
    ).toHaveAttribute("href", "/contact?service=web-animation");
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
