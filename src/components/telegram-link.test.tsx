import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TelegramLink } from "./telegram-link";

vi.mock("next/navigation", () => ({
  usePathname: () => "/uslugi/razrabotka-lendinga",
}));

describe("TelegramLink", () => {
  it("opens Telegram safely without requiring analytics", () => {
    render(
      <TelegramLink href="https://t.me/ludvik4work" placement="service_contact">
        Написать
      </TelegramLink>,
    );

    const link = screen.getByRole("link", { name: "Написать" });
    expect(link).toHaveAttribute("href", "https://t.me/ludvik4work");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
