import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TelegramLink } from "./telegram-link";

vi.mock("next/navigation", () => ({
  usePathname: () => "/uslugi/razrabotka-lendinga",
}));

const track = vi.hoisted(() => vi.fn());

vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  track,
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

  // This event already ships in production. The name and property shape are
  // pinned here because renaming a live event orphans its history.
  it("reports the click under its shipped event name", async () => {
    render(
      <TelegramLink href="https://t.me/ludvik4work" placement="service_contact">
        Написать
      </TelegramLink>,
    );

    await userEvent.click(screen.getByRole("link", { name: "Написать" }));

    expect(track).toHaveBeenCalledWith("contact.telegram_clicked", {
      path: "/uslugi/razrabotka-lendinga",
      placement: "service_contact",
    });
  });

  it("stays silent when a caller cancels the click", async () => {
    render(
      <TelegramLink
        href="https://t.me/ludvik4work"
        placement="footer"
        onClick={(event) => event.preventDefault()}
      >
        Написать
      </TelegramLink>,
    );

    track.mockClear();
    await userEvent.click(screen.getByRole("link", { name: "Написать" }));

    expect(track).not.toHaveBeenCalled();
  });
});
