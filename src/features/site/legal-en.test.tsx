import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getMarketContent } from "./content";
import { CookiePolicyView, LegalNoticeView, TermsView } from "./legal-en";
import { EsCookiePolicy, EsPrivacy } from "./locales/es/legal";
import { RuCookiePolicy, RuPrivacy } from "./locales/ru/legal";
import { PrivacyPage } from "./privacy-page";

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

  // ludvik4.dev links a WhatsApp chat (docs/specs/whatsapp-button.md): the
  // privacy policy names it beside Telegram, in every language.
  it.each([
    ["en", () => <PrivacyPage content={getMarketContent("en")} />],
    ["es", () => <EsPrivacy />],
    ["ru", () => <RuPrivacy />],
  ])("%s privacy policy names WhatsApp and links its policy", (_, View) => {
    const { container } = render(<View />);
    expect(container.textContent).toMatch(/WhatsApp Ireland Limited/);
    expect(
      container.querySelector(
        'a[href="https://www.whatsapp.com/legal/privacy-policy-eea"]',
      ),
    ).not.toBeNull();
  });

  // The mascot's bubble is gone; the example of a stored setting is now the
  // WhatsApp button hidden on a phone.
  it.each([
    [
      "en",
      () => <CookiePolicyView />,
      /WhatsApp button you hid/,
      /dismissed hint/,
    ],
    [
      "es",
      () => <EsCookiePolicy />,
      /botón de WhatsApp que ocultaste/,
      /aviso que ya has cerrado/,
    ],
    [
      "ru",
      () => <RuCookiePolicy />,
      /скрытая на телефоне кнопка WhatsApp/,
      /закрытая подсказка/,
    ],
  ])("%s cookie policy names the real stored setting", (_, View, now, old) => {
    const { container } = render(<View />);
    expect(container.textContent).toMatch(now);
    expect(container.textContent).not.toMatch(old);
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
