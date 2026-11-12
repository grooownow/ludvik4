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
    heading("If it lives in a browser, we can build it.");
    heading("Three steps, no fog.");
    heading("Work you can inspect.");
    heading("One person, end to end.");
    heading("Have something in mind?");
  });

  it("sets every section heading on one line", () => {
    renderHome("en");
    for (const name of [
      "If it lives in a browser, we can build it.",
      "Three steps, no fog.",
      "Work you can inspect.",
      "One person, end to end.",
    ]) {
      expect(heading(name).querySelector("br")).toBeNull();
    }
  });

  it("links each service hall to its page; the last one is a contact button", () => {
    const { container } = renderHome("en");
    const collection = container.querySelector("#collection") as HTMLElement;
    const links = within(collection).getAllByRole("link");
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/services/landing-pages",
      "/services/website-packages",
      "/services/web-apps",
      "/services/web-animation",
      "/services/automation-packages",
      "/contact",
    ]);
    expect(links[5]).toHaveTextContent("Tell us the idea");
    expect(links[5]!.closest("li")).toHaveTextContent("Something else?");
  });

  it("sets the EN collection title in two lines on phones, accent whole", () => {
    const { container } = renderHome("en");
    const title = container.querySelector("#collection h2")!;
    expect(title).toHaveClass("max-sm:text-[min(2.25rem,8.4vw)]");
    expect(title.querySelector(".text-primary")).toHaveClass("max-sm:block");
    // other titles keep their phone layout
    expect(container.querySelector("#work h2")).not.toHaveClass(
      "max-sm:text-[min(2.25rem,8.4vw)]",
    );
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

  it("frames three unnumbered work exhibits, the first one large", () => {
    const { container } = renderHome("en");
    const work = container.querySelector("#work") as HTMLElement;
    expect(work.querySelectorAll("[data-exhibit]")).toHaveLength(3);
    expect(work).not.toHaveTextContent(/Exhibit|Nº/);
    expect(work.querySelectorAll("[data-exhibit]")[0]).toHaveClass(
      "sm:row-span-2",
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

  it("shows the founder's portrait in About, with no label on it", () => {
    const { container } = renderHome("en");
    const about = container.querySelector("#about") as HTMLElement;
    const photo = within(about).getByRole("img", {
      name: /Portrait of the Ludvik4 founder/,
    });
    expect(photo.getAttribute("src")).toContain("curator-portrait.webp");
    expect(within(about).queryByText("Curator")).toBeNull();
    // the founder intro and the studio paragraph, each its own paragraph
    expect(within(about).getByText(/I'm Kate Pustovaya/).tagName).toBe("P");
    expect(within(about).getByText(/based in Spain/).tagName).toBe("P");
  });

  it("sends the closing call to action to /contact", () => {
    renderHome("en");
    expect(
      screen.getByRole("link", { name: "Discuss a project" }),
    ).toHaveAttribute("href", "/contact");
  });

  it("drops the old home's form, FAQ, scope and FAQ structured data", () => {
    const { container } = renderHome("en");
    expect(screen.queryByRole("button", { name: "Send enquiry" })).toBeNull();
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
  it("opens each service hall on its own tab of the services page", () => {
    const { container } = renderHome("ru");
    const collection = container.querySelector("#collection") as HTMLElement;
    for (const [name, href] of [
      ["Лендинги", "/uslugi/lendingi"],
      ["Сайты", "/uslugi/razrabotka-sajtov"],
      ["Веб-приложения", "/uslugi/veb-prilozheniya"],
      ["Анимации", "/uslugi/animatsiya-dlya-sajta"],
      ["Автоматизации", "/uslugi/avtomatizatsii"],
    ] as const) {
      expect(within(collection).getByRole("link", { name })).toHaveAttribute(
        "href",
        href,
      );
    }
    // "Что-то ещё?" keeps its contact button instead
    expect(
      within(collection).getByRole("link", { name: /Расскажите идею/ }),
    ).toHaveAttribute("href", "/contact");
  });

  it("sets the longer Russian section titles a step smaller on desktop, on one line", () => {
    const { container } = renderHome("ru");
    for (const id of ["collection", "how-it-works", "work"]) {
      const title = container.querySelector(`#${id} h2`);
      expect(title).toHaveClass("lg:whitespace-nowrap", "xl:text-[3.125rem]");
      expect(title).not.toHaveClass("sm:text-6xl");
    }
  });

  it("shows four exhibits in an even grid, unnumbered", () => {
    const { container } = renderHome("ru");
    const work = container.querySelector("#work") as HTMLElement;
    expect(work.querySelectorAll("[data-exhibit]")).toHaveLength(4);
    expect(work.querySelectorAll("[data-exhibit]")[0]).not.toHaveClass(
      "sm:row-span-2",
    );
  });

  // Museum captions read as an untraceable story (owner, 2026-11-12).
  it("has no museum captions — no exhibit, hall or collection labels", () => {
    const { container } = renderHome("ru");
    expect(container.textContent).not.toMatch(
      /Экспонат|экспонат|Зал \d|Коллекция/,
    );
    const collection = container.querySelector("#collection")!;
    expect(collection).toHaveTextContent("Что мы делаем");
    expect(container).toHaveTextContent("Сделаем то, что нужно вам");
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
      "secret-santa",
    ]);
    for (const e of exhibits) expect(e.href).toBe(`/cases/${e.slug}`);
  });
});

describe("Home section order", () => {
  const order = (container: HTMLElement) =>
    ["collection", "how-it-works", "work"].sort((a, b) =>
      container
        .querySelector(`#${a}`)!
        .compareDocumentPosition(container.querySelector(`#${b}`)!) &
      Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1,
    );

  it("RU: services, then the work, then the three steps", () => {
    const { container } = renderHome("ru");
    expect(order(container)).toEqual(["collection", "work", "how-it-works"]);
  });

  it("EN keeps the three steps before the work", () => {
    const { container } = renderHome("en");
    expect(order(container)).toEqual(["collection", "how-it-works", "work"]);
  });
});
