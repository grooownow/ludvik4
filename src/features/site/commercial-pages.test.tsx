import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CasesIndexView } from "./commercial-pages";

describe("CasesIndexView", () => {
  it("lists every case study, Gridfin included", () => {
    render(<CasesIndexView />);

    for (const [name, href] of [
      [/FortNoise/, "/cases/fortnoise"],
      [/Gridfin/, "/cases/gridfin"],
      [/qa-pilot/, "/cases/qa-pilot"],
    ] as const) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("does NOT show the «Все кейсы» link — that belongs to the homepage only", () => {
    render(<CasesIndexView />);

    expect(
      screen.queryByRole("link", { name: /Все кейсы/ }),
    ).not.toBeInTheDocument();
  });
});
