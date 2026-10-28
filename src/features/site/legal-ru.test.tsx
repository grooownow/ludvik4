import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { ConsentRuView, OPERATOR, PrivacyPolicyRuView } from "./legal-ru";

const content = getMarketContent("ru");

describe("RU legal pages", () => {
  it("the policy names the operator, the contact and links the consent", () => {
    render(<PrivacyPolicyRuView content={content} />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Политика обработки персональных данных",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(OPERATOR)).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "ludvik4go@yandex.com" })[0],
    ).toHaveAttribute("href", "mailto:ludvik4go@yandex.com");
    expect(
      screen.getByRole("link", {
        name: "согласия на обработку персональных данных",
      }),
    ).toHaveAttribute("href", "/soglasie");
  });

  it("the consent is its own document and links the policy", () => {
    render(<ConsentRuView content={content} />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Согласие на обработку персональных данных",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/отозвать/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "политике обработки персональных данных",
      }),
    ).toHaveAttribute("href", "/politika-konfidentsialnosti");
  });

  it("names every processor with its address in both documents", () => {
    for (const View of [PrivacyPolicyRuView, ConsentRuView]) {
      const { container, unmount } = render(<View content={content} />);
      for (const name of [
        "ООО «Яндекс.Облако»",
        "ООО «Яндекс»",
        "АО «ТаймВэб»",
      ]) {
        expect(container.textContent).toContain(name);
      }
      expect(container.textContent).toContain("ул. Льва Толстого, д. 16");
      expect(container.textContent).toContain("ул. Заставская, д. 22");
      unmount();
    }
  });

  it("opens the other legal document in a new tab", () => {
    render(<PrivacyPolicyRuView content={content} />);
    expect(
      screen.getByRole("link", {
        name: "согласия на обработку персональных данных",
      }),
    ).toHaveAttribute("target", "_blank");
    expect(
      screen.getByRole("link", { name: "Политика конфиденциальности" }),
    ).toHaveAttribute("target", "_blank");
  });
});
