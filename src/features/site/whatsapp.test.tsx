import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMarketContent } from "./content";
import { getLocaleBundle } from "./locale-content";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { enUi } from "./ui-copy";
import {
  WHATSAPP_FLOAT_HIDDEN_KEY,
  WhatsAppFloat,
  whatsappHref,
} from "./whatsapp";

const track = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/analytics")>()),
  track,
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/services",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

const EN_CHAT =
  "https://wa.me/34665575316?text=Hi!%20I'm%20writing%20from%20ludvik4.dev.";

beforeEach(() => {
  localStorage.clear();
  track.mockClear();
});
afterEach(() => localStorage.clear());

describe("whatsappHref", () => {
  it("opens the owner's chat with the greeting URL-encoded", () => {
    expect(whatsappHref(enUi.whatsapp.greeting)).toBe(EN_CHAT);
    expect(whatsappHref("¡Hola & adiós?")).toBe(
      "https://wa.me/34665575316?text=%C2%A1Hola%20%26%20adi%C3%B3s%3F",
    );
  });
});

describe("WhatsApp in the ludvik4.dev chrome", () => {
  it("EN footer links the chat and mounts the floating button", async () => {
    const { container } = render(
      <SiteFooter content={getMarketContent("en")} />,
    );
    const footer = container.querySelector("footer")!;
    const link = within(footer).getByRole("link", { name: "WhatsApp" });
    expect(link).toHaveAttribute("href", EN_CHAT);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(await screen.findByTestId("whatsapp-float")).toHaveTextContent(
      "Question or proposal? Message us on WhatsApp",
    );
  });

  it("ES footer greets in Spanish", () => {
    render(<SiteFooter content={getLocaleBundle("es").content} />);
    expect(
      screen.getAllByRole("link", { name: /WhatsApp/ })[0],
    ).toHaveAttribute(
      "href",
      whatsappHref("¡Hola! Te escribo desde ludvik4.dev."),
    );
  });

  it("EN header has the WhatsApp icon link and reports its placement", async () => {
    render(<SiteHeader content={getMarketContent("en")} />);
    const link = screen.getByRole("link", { name: "Message us on WhatsApp" });
    expect(link).toHaveAttribute("href", EN_CHAT);
    await userEvent.click(link);
    expect(track).toHaveBeenCalledWith("contact.whatsapp_clicked", {
      path: "/services",
      placement: "header",
    });
  });

  it("ludvik4.ru has no WhatsApp anywhere", async () => {
    const ru = getMarketContent("ru");
    const { container } = render(
      <>
        <SiteHeader content={ru} />
        <SiteFooter content={ru} />
      </>,
    );
    await act(async () => {});
    expect(container.querySelector('a[href*="wa.me"]')).toBeNull();
    expect(screen.queryByTestId("whatsapp-float")).toBeNull();
  });
});

describe("WhatsAppFloat", () => {
  it("phone × hides it and remembers the choice", async () => {
    render(<WhatsAppFloat copy={enUi.whatsapp} />);
    const float = await screen.findByTestId("whatsapp-float");
    expect(float).not.toHaveClass("max-sm:hidden");
    expect(
      within(float).getByRole("link", { name: "Message us on WhatsApp" }),
    ).toHaveAttribute("href", EN_CHAT);

    await userEvent.click(
      screen.getByRole("button", { name: "Hide the WhatsApp button" }),
    );

    // Hidden below sm only: a desktop window keeps the pill.
    expect(float).toHaveClass("max-sm:hidden");
    expect(float).not.toHaveClass("hidden");
    expect(localStorage.getItem(WHATSAPP_FLOAT_HIDDEN_KEY)).toBe("1");
  });

  it("stays hidden on phones on a later page once hidden", async () => {
    localStorage.setItem(WHATSAPP_FLOAT_HIDDEN_KEY, "1");
    render(<WhatsAppFloat copy={enUi.whatsapp} />);
    expect(await screen.findByTestId("whatsapp-float")).toHaveClass(
      "max-sm:hidden",
    );
  });

  it("the × is a phone-only control", async () => {
    render(<WhatsAppFloat copy={enUi.whatsapp} />);
    expect(
      await screen.findByRole("button", { name: "Hide the WhatsApp button" }),
    ).toHaveClass("sm:hidden");
  });
});
