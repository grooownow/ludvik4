import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getMarketContent } from "./content";
import { internationalPricingCatalog } from "./international-pricing";
import { PricingPageView } from "./pricing-page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => "/uslugi",
}));

const content = getMarketContent("ru");
const tabs = () => screen.getByRole("navigation", { name: "Услуги" });

describe("PricingPageView", () => {
  it("shows no VAT totals on RU", () => {
    const { container } = render(<PricingPageView content={content} />);
    expect(container.textContent).not.toMatch(/VAT|НДС/);
  });

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

describe("PricingPageView with the international catalog", () => {
  const en = getMarketContent("en");

  it("renders English copy, euro prices and order links", () => {
    const { container } = render(
      <PricingPageView
        content={en}
        catalog={internationalPricingCatalog}
        activeId="landing-pages"
        baseUrl="https://ludvik4.dev"
      />,
    );
    // The language switch names Russian in Russian; the page copy does not.
    container.querySelector("[data-language-switch]")?.remove();
    const text = container.textContent;
    expect(text).not.toMatch(/[А-Яа-яЁё]|₽/);
    expect(text).toContain("€500");
    expect(text).toContain("€242 incl. VAT");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Landing pages — packages and prices.",
    );
    const order = screen.getAllByRole("link", { name: "Get started" });
    expect(order[1]).toHaveAttribute(
      "href",
      "/contact?service=landing-pages&package=plus",
    );
  });

  it("publishes numeric EUR offers on slashless URLs", () => {
    const { container } = render(
      <PricingPageView
        content={en}
        catalog={internationalPricingCatalog}
        activeId="web-animation"
        baseUrl="https://ludvik4.dev"
      />,
    );
    const ld = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!
        .textContent!,
    );
    const offers = ld["@graph"][0].offers;
    expect(offers.map((o: { price: string }) => o.price)).toEqual([
      "150",
      "300",
      "700",
    ]);
    expect(offers[0].priceCurrency).toBe("EUR");
    expect(ld["@graph"][0].url).toBe(
      "https://ludvik4.dev/services/web-animation",
    );
  });
});
