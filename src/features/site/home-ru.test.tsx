import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { HomeRu } from "./home-ru";

const content = getMarketContent("ru");

describe("HomeRu", () => {
  it("renders the Russian hero and services", () => {
    render(<HomeRu content={content} baseUrl="https://ludvik4.dev" />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Цифровые продукты/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Автоматизация бизнес-процессов" }),
    ).toBeInTheDocument();
  });

  it("does NOT render a lead form — Telegram is the only contact action", () => {
    render(<HomeRu content={content} baseUrl="https://ludvik4.dev" />);

    // No form fields at all on the RU page (brief §Контакты, scenario 1 & 5).
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
    expect(
      screen.queryByRole("button", { name: /Отправить/ }),
    ).not.toBeInTheDocument();

    // The primary contact CTA opens Telegram.
    const telegram = screen.getByText(/Напишите в Telegram/);
    expect(telegram.closest("a")).toHaveAttribute(
      "href",
      "https://t.me/ludvik4work",
    );
  });

  it("does not import the lead feature at all (source-level guard)", () => {
    // Scenario 5, literally: the RU home must not import LeadForm or the lead
    // action. (market-home.tsx additionally keeps the EN home behind a
    // build-eliminated dynamic import so the RU build never bundles it.)
    const src = readFileSync("src/features/site/home-ru.tsx", "utf8");
    expect(src).not.toMatch(/@\/features\/lead/);
    expect(src).not.toMatch(/LeadForm|submitLeadAction/);
  });
});
