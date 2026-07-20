import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import EnHomePage, { metadata } from "./page";

describe("/en landing", () => {
  it("renders the English hero and services", () => {
    render(<EnHomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Digital products — from idea to launch/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Web apps & SaaS" }),
    ).toBeInTheDocument();
  });

  it("uses English form copy, not the Russian default", () => {
    render(<EnHomePage />);

    expect(
      screen.getByRole("button", { name: "Send request" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Your task/i)).toBeInTheDocument();
  });

  it("declares the /en canonical and reciprocal hreflang alternates", () => {
    expect(metadata.alternates?.canonical).toBe("/en");
    expect(metadata.alternates?.languages).toMatchObject({
      en: "/en",
      ru: "/",
      "x-default": "/",
    });
  });
});
