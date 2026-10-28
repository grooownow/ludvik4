import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getMarketContent } from "./content";
import { PricingPageView } from "./pricing-page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/uslugi",
}));

const content = getMarketContent("ru");
const tabs = () => screen.getByRole("navigation", { name: "Услуги" });

describe("PricingPageView", () => {
  it("gives every tab its own page link", () => {
    render(<PricingPageView content={content} />);
    for (const [name, href] of [
      ["Лендинги", "/uslugi/lendingi"],
      ["Сайты", "/uslugi/razrabotka-sajtov"],
      ["Веб-приложения", "/uslugi/veb-prilozheniya"],
      ["Анимации", "/uslugi/animatsiya-dlya-sajta"],
      ["Автоматизации", "/uslugi/avtomatizatsii"],
    ] as const) {
      expect(within(tabs()).getByRole("link", { name })).toHaveAttribute(
        "href",
        href,
      );
    }
  });

  it("opens the first tab on the hub", () => {
    render(<PricingPageView content={content} />);
    expect(
      within(tabs()).getByRole("link", { name: "Лендинги" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("heading", { level: 1, name: /Что мы делаем/ }),
    ).toBeInTheDocument();
  });

  it("shows only the chosen service on its own page, named in the title", () => {
    render(
      <PricingPageView
        content={content}
        activeId="avtomatizatsii"
        baseUrl="https://ludvik4.ru"
      />,
    );
    expect(
      within(tabs()).getByRole("link", { name: "Автоматизации" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(tabs()).getByRole("link", { name: "Лендинги" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByRole("heading", { level: 1, name: /Автоматизации/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2, name: "Лендинги" }),
    ).toBeNull();
  });

  it("describes the service and its packages for search engines", () => {
    const { container } = render(
      <PricingPageView
        content={content}
        activeId="saity"
        baseUrl="https://ludvik4.ru"
      />,
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const data = JSON.parse(script!.textContent!);
    const service = data["@graph"][0];
    expect(service["@type"]).toBe("Service");
    expect(service.url).toBe("https://ludvik4.ru/uslugi/razrabotka-sajtov/");
    expect(service.offers).toHaveLength(3);
  });
});
