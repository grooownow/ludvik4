import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { faqItems } from "./faq-data";
import { FaqSection } from "./faq-section";

describe("FaqSection", () => {
  it("renders every question from faq-data as an accordion trigger", () => {
    render(<FaqSection />);

    for (const item of faqItems) {
      expect(
        screen.getByRole("button", { name: item.question }),
      ).toBeInTheDocument();
    }
  });

  it("expands an item on click and shows its answer", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    const first = faqItems[0]!;
    expect(screen.queryByText(first.answer)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: first.question }));

    expect(screen.getByText(first.answer)).toBeVisible();
  });

  it("emits FAQPage JSON-LD containing every question and answer (stays in sync with the visible FAQ)", () => {
    const { container } = render(<FaqSection />);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).not.toBeNull();

    const jsonLd = JSON.parse(script!.textContent ?? "") as {
      "@type": string;
      mainEntity: Array<{
        name: string;
        acceptedAnswer: { text: string };
      }>;
    };

    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity).toHaveLength(faqItems.length);
    for (const item of faqItems) {
      const entity = jsonLd.mainEntity.find((e) => e.name === item.question);
      expect(entity?.acceptedAnswer.text).toBe(item.answer);
    }
  });
});
