import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitch } from "./language-switch";

const pathname = vi.hoisted(() => ({ value: "/services/web-apps" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

afterEach(() => {
  document.cookie = "ludvik4_lang=; Path=/; Max-Age=0";
  window.localStorage.clear();
});

function open(current: "en" | "es" | "ru" = "en") {
  render(
    <LanguageSwitch
      current={current}
      locales={["en", "es", "ru"]}
      label="Language"
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: /Language/ }));
}

describe("LanguageSwitch", () => {
  it("offers the same page in every language, by its own name", () => {
    pathname.value = "/services/web-apps";
    open();
    expect(screen.getByRole("link", { name: /Español/ })).toHaveAttribute(
      "href",
      "/es/services/web-apps",
    );
    expect(screen.getByRole("link", { name: /Русский/ })).toHaveAttribute(
      "href",
      "/ru/services/web-apps",
    );
    expect(screen.getByRole("link", { name: /English/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("leads to the language's home from an English-only page", () => {
    pathname.value = "/blog/some-article";
    open();
    expect(screen.getByRole("link", { name: /Español/ })).toHaveAttribute(
      "href",
      "/es",
    );
  });

  it("remembers the choice in a cookie and in localStorage", () => {
    pathname.value = "/es/about";
    open("es");
    fireEvent.click(screen.getByRole("link", { name: /English/ }));
    expect(document.cookie).toContain("ludvik4_lang=en");
    expect(window.localStorage.getItem("ludvik4_lang")).toBe("en");
  });

  it("names the current language for screen readers", () => {
    pathname.value = "/ru";
    render(
      <LanguageSwitch current="ru" locales={["en", "es", "ru"]} label="Язык" />,
    );
    expect(
      screen.getByRole("button", { name: "Язык: Русский" }),
    ).toBeInTheDocument();
  });
});
