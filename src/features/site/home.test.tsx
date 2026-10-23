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

  it("sets every section heading on one line", () => {
    renderHome("en");
    for (const name of [
      "If it lives in a browser, I can build it.",
      "Three steps, no fog.",
      "Work you can inspect.",
      "One person, end to end.",
    ]) {
      expect(heading(name).querySelector("br")).toBeNull();
    }
  });

  it("shows six halls that do not open; the last one has a contact button", () => {
    const { container } = renderHome("en");
    const collection = container.querySelector("#collection") as HTMLElement;
    for (const name of [
      "Websites",
      "Landing pages",
      "Web apps",
      "Automations",
      "Widgets & tools",
      "Something else?",
    ]) {
      expect(within(collection).getByText(name)).toBeInTheDocument();
    }
    // only the last hall has a way out: the contact button
    const links = within(collection).getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent("Tell me the idea");
    expect(links[0]).toHaveAttribute("href", "/contact");
    expect(links[0]!.closest("li")).toHaveTextContent("Something else?");
  });

  it("keeps the English section titles at full size", () => {
    const { container } = renderHome("en");
    for (const id of ["collection", "how-it-works", "work"]) {
      expect(container.querySelector(`#${id} h2`)).toHaveClass("sm:text-6xl");
    }
  });

  it("draws every hall as a decorative plan with notes in the page's language", () => {
    const { container } = renderHome("en");
    const collection = container.querySelector("#collection") as HTMLElement;
    const plans = collection.querySelectorAll("svg[data-plan]");
    expect(plans).toHaveLength(6);
    for (const svg of plans) {
      expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
    }
    expect(
      collection.querySelector('[data-plan="question"]'),
    ).toHaveTextContent("your idea");
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

  it("opens the live work only from the arrow, in a new window", () => {
    const { container } = renderHome("en");
    const work = container.querySelector("#work") as HTMLElement;
    const live = within(work).getByRole("link", {
      name: "Open smallFriendFiles (opens in a new window)",
    });
    expect(live).toHaveAttribute("href", "https://smallfriendfiles.fyi/en");
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noopener noreferrer");
    expect(live.querySelector("svg[data-arrow]")).not.toBeNull();
    // The arrow is its own small target, not the whole preview.
    expect(live.querySelector("img")).toBeNull();
  });

  it("opens the work's own page from the preview and from its name", () => {
    const { container } = renderHome("en");
    const work = container.querySelector("#work") as HTMLElement;
    const preview = within(work).getByRole("link", {
      name: "smallFriendFiles: about the project",
    });
    expect(preview).toHaveAttribute("href", "/work/smallfriendfiles");
    expect(preview).not.toHaveAttribute("target");
    expect(preview.querySelector("img")).not.toBeNull();
    // the arrow is not nested inside the preview link
    expect(preview.querySelector("svg[data-arrow]")).toBeNull();
    expect(
      within(work).getByRole("link", { name: "smallFriendFiles" }),
    ).toHaveAttribute("href", "/work/smallfriendfiles");
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
  it("sets the longer Russian section titles a step smaller on desktop, on one line", () => {
    const { container } = renderHome("ru");
    for (const id of ["collection", "how-it-works", "work"]) {
      const title = container.querySelector(`#${id} h2`);
      expect(title).toHaveClass("lg:whitespace-nowrap", "xl:text-[3.375rem]");
      expect(title).not.toHaveClass("sm:text-6xl");
    }
  });

  it("shows four exhibits in an even grid, numbered around the mascot's Nº 04", () => {
    const { container } = renderHome("ru");
    const work = container.querySelector("#work") as HTMLElement;
    for (const n of ["01", "02", "03", "05"]) {
      expect(within(work).getByText(`Экспонат № ${n}`)).toBeInTheDocument();
    }
    expect(work.querySelectorAll("[data-exhibit]")[0]).not.toHaveClass(
      "sm:row-span-2",
    );
    expect(screen.getByTestId("exhibit-label")).toHaveTextContent(
      "Экспонат № 04",
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
    expect(exhibits.map((e) => e.site)).toEqual([
      "https://smallfriendfiles.fyi/en",
      "https://ludvik4.dev/gridfin/en",
      "https://ludvik4.dev/qa-pilot",
    ]);
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
