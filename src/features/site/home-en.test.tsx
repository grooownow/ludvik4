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
      screen.getByRole("img", { name: /How a digital product is built/i }),
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
    expect(screen.getAllByRole("link", { name: "Work" })[0]).toHaveAttribute(
      "href",
      "/work",
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
