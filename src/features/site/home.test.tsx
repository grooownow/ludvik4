import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { Home } from "./home";
import { homeExhibits } from "./home-exhibits";

const renderHome = (market: "ru" | "en") =>
  render(
    <Home
      content={getMarketContent(market)}
      exhibits={homeExhibits(market)}
      baseUrl={market === "en" ? "https://ludvik4.dev" : "https://ludvik4.ru"}
    />,
  );

const heading = (name: string) =>
  screen.getByRole("heading", { level: 2, name });

describe("Home (EN)", () => {
  it("tells the exhibition story in five sections", () => {
    renderHome("en");
    heading("If it lives in a browser, I can build it.");
    heading("Three steps, no fog.");
    heading("Work you can inspect.");
    heading("One person, end to end.");
    heading("Have something in mind?");
  });

  it("shows six halls as plain cards, not links", () => {
    const { container } = renderHome("en");
    const collection = container.querySelector("#collection")!;
    for (const name of [
      "Websites",
      "Landing pages",
      "Web apps & SaaS",
      "Automations",
      "Widgets & tools",
      "Something else?",
    ]) {
      const hall = within(collection as HTMLElement).getByText(name);
      expect(hall.closest("a")).toBeNull();
    }
  });

  it("frames three numbered work exhibits, the first one large", () => {
    const { container } = renderHome("en");
    const work = container.querySelector("#work") as HTMLElement;
    for (const n of ["01", "02", "03"]) {
      expect(within(work).getByText(`Exhibit Nº ${n}`)).toBeInTheDocument();
    }
    expect(work.querySelectorAll("[data-exhibit]")[0]).toHaveClass(
      "sm:row-span-2",
    );
    expect(screen.getByTestId("exhibit-label")).toHaveTextContent(
      "Exhibit Nº 04",
    );
  });

  it("sends the closing call to action to /contact", () => {
    renderHome("en");
    expect(
      screen.getByRole("link", { name: "Discuss a project" }),
    ).toHaveAttribute("href", "/contact");
  });

  it("drops the old home's form, FAQ, scope and FAQ structured data", () => {
    const { container } = renderHome("en");
    expect(screen.queryByRole("button", { name: "Send request" })).toBeNull();
    expect(screen.queryByText("What's included")).toBeNull();
    expect(container.querySelector("#faq")).toBeNull();
    const jsonLd = container.querySelector(
      'script[type="application/ld+json"]',
    )!.textContent!;
    expect(jsonLd).not.toContain("FAQPage");
    expect(jsonLd).toContain("ProfessionalService");
  });
});

describe("Home (RU)", () => {
  it("shows four exhibits in an even grid and numbers the mascot fifth", () => {
    const { container } = renderHome("ru");
    const work = container.querySelector("#work") as HTMLElement;
    for (const n of ["01", "02", "03", "04"]) {
      expect(within(work).getByText(`Экспонат № ${n}`)).toBeInTheDocument();
    }
    expect(work.querySelectorAll("[data-exhibit]")[0]).not.toHaveClass(
      "sm:row-span-2",
    );
    expect(screen.getByTestId("exhibit-label")).toHaveTextContent(
      "Экспонат № 05",
    );
  });

  it("shows no prices and no lead form", () => {
    const { container } = renderHome("ru");
    expect(container.textContent).not.toMatch(/₽/);
    expect(container.querySelector("form")).toBeNull();
  });
});

describe("homeExhibits", () => {
  it("EN: smallFriendFiles, Gridfin, qa-pilot with their existing links", () => {
    const exhibits = homeExhibits("en");
    expect(exhibits.map((e) => e.slug)).toEqual([
      "smallfriendfiles",
      "gridfin",
      "qa-pilot",
    ]);
    expect(exhibits[0]!.href).toBe("/work/smallfriendfiles");
    expect(exhibits[1]).toMatchObject({ href: "/gridfin/en", newTab: true });
  });

  it("RU: four case studies linking to /cases", () => {
    const exhibits = homeExhibits("ru");
    expect(exhibits.map((e) => e.slug)).toEqual([
      "smallfriendfiles",
      "fortnoise",
      "gridfin",
      "qa-pilot",
    ]);
    for (const e of exhibits) expect(e.href).toBe(`/cases/${e.slug}`);
  });
});
