import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  InternationalAboutView,
  InternationalWorkIndexView,
} from "./international-pages";

describe("InternationalWorkIndexView", () => {
  it("links Gridfin directly from Work and opens the landing in a new tab", () => {
    render(<InternationalWorkIndexView />);

    expect(
      screen.getByRole("link", { name: /smallFriendFiles/i }),
    ).toHaveAttribute("href", "/work/smallfriendfiles");

    expect(
      screen.getByRole("heading", { level: 3, name: "Gridfin" }),
    ).toBeInTheDocument();

    const landingLink = screen.getByRole("link", {
      name: /Gridfin.*opens in a new tab/,
    });
    expect(landingLink).toHaveAttribute("href", "/gridfin/en");
    expect(landingLink).toHaveAttribute("target", "_blank");
    expect(landingLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("InternationalAboutView", () => {
  it("links to the articles, the blog's entry point on the site", () => {
    render(<InternationalAboutView />);
    expect(
      screen.getByRole("heading", { name: "Articles" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read the articles →" }),
    ).toHaveAttribute("href", "/blog");
  });
});
