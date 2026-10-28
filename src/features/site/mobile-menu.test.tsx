import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MobileMenu } from "./mobile-menu";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

function renderMenu() {
  render(
    <div>
      <p>outside</p>
      <MobileMenu
        links={[{ href: "/#work", label: "Работы" }]}
        cta={{ href: "/contact", label: "Контакты" }}
        navigationLabel="Основная навигация"
        openLabel="Открыть меню"
        closeLabel="Закрыть меню"
      />
    </div>,
  );
  return screen.getByRole("button", { name: "Открыть меню" });
}

const panel = () =>
  screen.getByRole("navigation", { hidden: true }).parentElement!;

describe("MobileMenu", () => {
  it("opens on the toggle and turns it into a close button", async () => {
    const toggle = renderMenu();
    expect(panel()).toHaveAttribute("inert");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Закрыть меню");
    expect(panel()).not.toHaveAttribute("inert");
  });

  it("closes on a press outside, but not on a press inside", async () => {
    const toggle = renderMenu();
    await userEvent.click(toggle);
    fireEvent.pointerDown(screen.getByRole("navigation"));
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.pointerDown(screen.getByText("outside"));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and gives focus back to the toggle", async () => {
    const toggle = renderMenu();
    await userEvent.click(toggle);
    await userEvent.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes when a link inside is chosen", async () => {
    const toggle = renderMenu();
    await userEvent.click(toggle);
    fireEvent.click(screen.getByRole("link", { name: "Работы" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
