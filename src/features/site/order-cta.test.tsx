import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { OrderProvider } from "@/features/order";
import { ContactOrderCard, OrderCta } from "./order-cta";

vi.mock("@/features/order/smart-captcha", () => ({
  createCaptcha: vi.fn(async () => ({ token: async () => "t" })),
}));

const config = {
  endpoint: "https://functions.example/order",
  captchaSiteKey: "site",
  telegramUrl: "https://t.me/ludvik4work",
  email: "ludvik4go@yandex.com",
};

beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.open = true;
  };
});

describe("OrderCta", () => {
  it("is the old link to /contact while the form is not configured", () => {
    render(
      <OrderProvider>
        <OrderCta placement="closing">Обсудить проект</OrderCta>
      </OrderProvider>,
    );
    expect(
      screen.getByRole("link", { name: "Обсудить проект" }),
    ).toHaveAttribute("href", "/contact");
  });

  it("opens the order dialog when the form is configured", async () => {
    const user = userEvent.setup();
    render(
      <OrderProvider config={config}>
        <OrderCta placement="closing">Обсудить проект</OrderCta>
      </OrderProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Обсудить проект" }));
    expect(document.querySelector("dialog")?.open).toBe(true);
    expect(
      screen.getByRole("heading", { name: "Обсудить проект" }),
    ).toBeInTheDocument();
  });
});

describe("ContactOrderCard", () => {
  it("shows the form on /contact only when configured", () => {
    const { unmount } = render(
      <OrderProvider>
        <ContactOrderCard />
      </OrderProvider>,
    );
    expect(screen.queryByLabelText("Как с вами связаться")).toBeNull();
    unmount();
    render(
      <OrderProvider config={config}>
        <ContactOrderCard />
      </OrderProvider>,
    );
    expect(screen.getByLabelText("Как с вами связаться")).toBeInTheDocument();
  });
});
