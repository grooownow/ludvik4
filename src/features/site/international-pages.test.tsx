import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InternationalWorkIndexView } from "./international-pages";

describe("InternationalWorkIndexView", () => {
  it("links Gridfin directly from Work and opens the landing in a new tab", () => {
    render(<InternationalWorkIndexView />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Gridfin" }),
    ).toBeInTheDocument();

    const landingLink = screen.getByRole("link", {
      name: /View Gridfin landing/,
    });
    expect(landingLink).toHaveAttribute("href", "/gridfin/en");
    expect(landingLink).toHaveAttribute("target", "_blank");
    expect(landingLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
