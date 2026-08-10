import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CasesIndexView, ServicePageView } from "./commercial-pages";
import { getServicePage } from "./commercial-content";

describe("CasesIndexView", () => {
  it("lists every case study, Gridfin included", () => {
    render(<CasesIndexView baseUrl="https://ludvik4.ru" />);

    for (const [name, href] of [
      [/FortNoise/, "/cases/fortnoise"],
      [/Gridfin/, "/cases/gridfin"],
      [/qa-pilot/, "/cases/qa-pilot"],
    ] as const) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    }
  });

  it("does NOT show the «Все кейсы» link — that belongs to the homepage only", () => {
    render(<CasesIndexView baseUrl="https://ludvik4.ru" />);

    expect(
      screen.queryByRole("link", { name: /Все кейсы/ }),
    ).not.toBeInTheDocument();
  });

  it("publishes collection structured data for the cases hub", () => {
    const { container } = render(
      <CasesIndexView baseUrl="https://ludvik4.ru" />,
    );

    expect(container.textContent).toContain("Кейсы Ludvik4");
    expect(container.innerHTML).toContain('"@type":"CollectionPage"');
    expect(container.innerHTML).toContain('"@type":"ItemList"');
  });
});

describe("ServicePageView", () => {
  it("adds retrieval-friendly proof blocks and related links for landing pages", () => {
    const service = getServicePage("razrabotka-lendinga");
    expect(service).toBeDefined();

    const { container } = render(
      <ServicePageView service={service!} baseUrl="https://ludvik4.ru" />,
    );

    expect(
      screen.getByRole("heading", { name: "Как фиксируется результат" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Связанные материалы" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Сколько стоит лендинг/ }),
    ).toHaveAttribute("href", "/blog/stoimost-lendinga-2026");
    expect(container.innerHTML).toContain('"@type":"Service"');
  });
});
