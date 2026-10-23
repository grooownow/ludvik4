import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { HomeEn } from "./home-en";
import { internationalFaq } from "./international-content";

const content = getMarketContent("en");

describe("HomeEn", () => {
  it("renders the English hero and services", () => {
    render(<HomeEn content={content} baseUrl="https://ludvik4.dev" />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Websites, workflow automation, and web apps/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { name: "Web app or compact SaaS" }),
    ).toHaveLength(2);
    expect(screen.getByText("How it works")).toBeInTheDocument();
    // Both markets show the same hero illustration; only its alt text is
    // localized. It used to be RU-only ("text hero" in the ТЗ 1 brief).
    expect(
      screen.getByRole("img", { name: content.hero.illustrationAlt }),
    ).toHaveAttribute("src", expect.stringContaining("hero-robot.webp"));
    // The brand intro sits above the hero, with the wordmark art's alt.
    expect(screen.getByRole("img", { name: "Ludvik4" })).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === "P" && el.textContent === content.intro.services,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "What's included" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Website, automation, and web app development",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Explore website development/ }),
    ).toHaveAttribute("href", "/services/websites");
    // The footer keeps only what the header menu lacks.
    expect(screen.getAllByRole("link", { name: "Privacy" })[0]).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("keeps the lead form with English copy and a linked privacy notice", () => {
    render(<HomeEn content={content} baseUrl="https://ludvik4.dev" />);

    expect(
      screen.getByRole("button", { name: "Send request" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Your task/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read the Privacy Notice." }),
    ).toHaveAttribute("href", "/privacy");
  });

  it("features Gridfin on the home page and opens its landing in a new tab", () => {
    const { container } = render(
      <HomeEn content={content} baseUrl="https://ludvik4.dev" />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Gridfin" }),
    ).toBeInTheDocument();

    const landingLink = screen.getByRole("link", {
      name: /Gridfin.*opens in a new tab/,
    });
    expect(landingLink).toHaveAttribute("href", "/gridfin/en");
    expect(landingLink).toHaveAttribute("target", "_blank");
    expect(landingLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("img", {
        name: "Gridfin product landing with a Claude Code terminal preview",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "qa-pilot landing: a QA plugin for Claude Code",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /smallFriendFiles/i }),
    ).toHaveAttribute("href", "/work/smallfriendfiles");
    expect(container.querySelector("#work .grid")).toHaveClass(
      "sm:grid-cols-2",
    );
  });

  it("renders every FAQ item as an accordion button with a chevron", () => {
    const { container } = render(
      <HomeEn content={content} baseUrl="https://ludvik4.dev" />,
    );

    for (const item of internationalFaq) {
      expect(
        screen.getByRole("button", { name: item.question }),
      ).toBeInTheDocument();
    }
    expect(
      container.querySelectorAll('#faq [data-slot="accordion-trigger"] svg'),
    ).toHaveLength(internationalFaq.length);
  });
});
