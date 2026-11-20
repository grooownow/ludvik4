import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InternationalAboutView } from "./international-pages";

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
