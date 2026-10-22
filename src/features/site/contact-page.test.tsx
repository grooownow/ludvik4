import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadForm } from "@/features/lead";
import { getMarketContent, TELEGRAM_URL } from "./content";
import { ContactPageView } from "./contact-page";

describe("ContactPageView", () => {
  it("EN: lead form, privacy notice and Telegram", () => {
    const content = getMarketContent("en");
    render(
      <ContactPageView
        content={content}
        form={<LeadForm labels={content.contact.form?.labels} />}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: content.contact.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send request" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read the Privacy Notice." }),
    ).toHaveAttribute("href", "/privacy");
    expect(
      screen.getAllByRole("link", { name: /Telegram/ })[0],
    ).toHaveAttribute("href", TELEGRAM_URL);
  });

  it("RU: Telegram and no form at all", () => {
    const content = getMarketContent("ru");
    const { container } = render(<ContactPageView content={content} />);
    expect(
      screen.getByRole("heading", { level: 1, name: content.contact.title }),
    ).toBeInTheDocument();
    expect(container.querySelector("form")).toBeNull();
    expect(
      screen.getAllByRole("link", { name: /Telegram/ })[0],
    ).toHaveAttribute("href", TELEGRAM_URL);
  });
});
