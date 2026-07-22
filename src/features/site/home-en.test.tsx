import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { HomeEn } from "./home-en";

const content = getMarketContent("en");

describe("HomeEn", () => {
  it("renders the English hero and services", () => {
    render(<HomeEn content={content} baseUrl="https://ludvik4.dev" />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Digital products — from idea to launch/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Focused MVP or compact SaaS" }),
    ).toBeInTheDocument();
  });

  it("keeps the lead form with English copy and a privacy notice", () => {
    render(<HomeEn content={content} baseUrl="https://ludvik4.dev" />);

    expect(
      screen.getByRole("button", { name: "Send request" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Your task/i)).toBeInTheDocument();
    // Release-blocker placeholder sits next to the form.
    expect(
      screen.getByText(/privacy notice is in preparation/i),
    ).toBeInTheDocument();
  });
});
