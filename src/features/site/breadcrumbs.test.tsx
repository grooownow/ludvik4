import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Breadcrumbs } from "./breadcrumbs";
import {
  CaseStudyPageView,
  CasesIndexView,
  ServicePageView,
} from "./commercial-pages";
import { getCaseStudy, getServicePage } from "./commercial-content";

describe("Breadcrumbs", () => {
  it("renders linked ancestors and marks the current page", () => {
    render(
      <Breadcrumbs
        items={[{ label: "Кейсы", href: "/cases" }, { label: "qa-pilot" }]}
      />,
    );

    const breadcrumbs = screen.getByRole("navigation", {
      name: "Хлебные крошки",
    });
    expect(
      within(breadcrumbs).getByRole("link", { name: "Главная" }),
    ).toHaveAttribute("href", "/");
    expect(
      within(breadcrumbs).getByRole("link", { name: "Кейсы" }),
    ).toHaveAttribute("href", "/cases");
    expect(within(breadcrumbs).getByText("qa-pilot")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("uses the full hierarchy on case, service, and index pages", () => {
    const study = getCaseStudy("qa-pilot");
    const service = getServicePage("razrabotka-lendinga");
    expect(study).toBeDefined();
    expect(service).toBeDefined();

    const { rerender } = render(
      <CaseStudyPageView study={study!} baseUrl="https://ludvik4.ru" />,
    );
    let breadcrumbs = screen.getByRole("navigation", {
      name: "Хлебные крошки",
    });
    expect(
      within(breadcrumbs).getByRole("link", { name: "Кейсы" }),
    ).toHaveAttribute("href", "/cases");
    expect(within(breadcrumbs).getByText("qa-pilot")).toHaveAttribute(
      "aria-current",
      "page",
    );

    rerender(
      <ServicePageView service={service!} baseUrl="https://ludvik4.ru" />,
    );
    breadcrumbs = screen.getByRole("navigation", {
      name: "Хлебные крошки",
    });
    expect(
      within(breadcrumbs).getByRole("link", { name: "Услуги" }),
    ).toHaveAttribute("href", "/#services");
    expect(
      within(breadcrumbs).getByText("Разработка лендинга под ключ"),
    ).toHaveAttribute("aria-current", "page");

    rerender(<CasesIndexView />);
    breadcrumbs = screen.getByRole("navigation", {
      name: "Хлебные крошки",
    });
    expect(
      within(breadcrumbs).queryByRole("link", { name: "Кейсы" }),
    ).not.toBeInTheDocument();
    expect(within(breadcrumbs).getByText("Кейсы")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
