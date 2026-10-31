import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getMarketContent } from "./content";
import { CookiePolicyView, LegalNoticeView, TermsView } from "./legal-en";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

vi.stubGlobal(
  "IntersectionObserver",
  class {
    observe() {}
    disconnect() {}
  },
);

describe("EN legal pages", () => {
  it("identifies the provider as LSSI art. 10 requires", () => {
    const { container } = render(<LegalNoticeView />);
    const text = container.textContent;
    expect(text).toContain("Ekaterina Pustovaia");
    expect(text).toContain("Avenida de Francia 79, 46024 Valencia, Spain");
    expect(text).toMatch(/Tax ID \(NIF\): Z2391039X/);
    expect(text).toContain("ludvik4good.me@gmail.com");
    // Art. 10.1.f: say whether prices include taxes.
    expect(text).toMatch(/do not include VAT/);
  });

  it("gives private clients the withdrawal terms", () => {
    const { container } = render(<TermsView />);
    expect(container.textContent).toMatch(/14 calendar days/);
    expect(container.textContent).toMatch(/proportional amount/);
    expect(container.textContent).toMatch(/does not count as acceptance/);
  });

  it("names the third party, its purpose and duration, and offers the choice", () => {
    const { container } = render(<CookiePolicyView />);
    expect(container.textContent).toMatch(/PostHog/);
    expect(container.textContent).toMatch(/up to 12 months/);
  });

  it("every EN footer lists all legal pages, RU none of them", () => {
    const hrefs = (m: "en" | "ru") =>
      getMarketContent(m).footer.links.map((l) => l.href);
    expect(hrefs("en")).toEqual(
      expect.arrayContaining([
        "/privacy",
        "/cookies",
        "/terms-of-service",
        "/legal-notice",
      ]),
    );
    expect(hrefs("ru")).not.toContain("/legal-notice");
  });
});
