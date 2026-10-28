import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OrderProvider } from "@/features/order";
import { MascotReply } from "./mascot-reply";

// The bubble listens on the stage, so it renders inside one with a canvas,
// as on the home page.
function renderOnStage() {
  render(
    <section data-stage>
      <canvas data-testid="canvas" />
      <button type="button" data-exhibit-push>
        push
      </button>
      <a href="#elsewhere">elsewhere</a>
      <MascotReply />
    </section>,
  );
  return screen.getByTestId("mascot-reply");
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("MascotReply", () => {
  it("stays hidden until the mascot is touched, then offers the animation", () => {
    const bubble = renderOnStage();
    expect(bubble).toHaveAttribute("inert");
    // A press elsewhere on the stage is not a touch of the mascot.
    fireEvent.pointerUp(screen.getByText("elsewhere"));
    expect(bubble).toHaveAttribute("inert");

    fireEvent.pointerUp(screen.getByTestId("canvas"));
    expect(bubble).not.toHaveAttribute("inert");
    expect(bubble).toHaveTextContent(/^×?Понравилось\?/);
    expect(
      screen.getByRole("link", { name: "Хочу такую анимацию →" }),
    ).toHaveAttribute("href", "/contact");
  });

  it("counts a trackpad swipe over the mascot as a touch", () => {
    const bubble = renderOnStage();
    fireEvent.wheel(screen.getByTestId("canvas"));
    expect(bubble).not.toHaveAttribute("inert");
  });

  it("comes on its own after a quiet while, inviting a touch", () => {
    const bubble = renderOnStage();
    act(() => vi.advanceTimersByTime(8000));
    expect(bubble).not.toHaveAttribute("inert");
    expect(bubble).toHaveTextContent("Меня можно потрогать!");
  });

  it("counts a push of the still, and closes for good on its ×", () => {
    const bubble = renderOnStage();
    fireEvent.pointerUp(screen.getByText("push"));
    expect(bubble).not.toHaveAttribute("inert");
    fireEvent.click(screen.getByRole("button", { name: "Скрыть подсказку" }));
    expect(bubble).toHaveAttribute("inert");
    fireEvent.pointerUp(screen.getByTestId("canvas"));
    expect(bubble).toHaveAttribute("inert");
  });

  it("hides once its button opens the order dialog", () => {
    HTMLDialogElement.prototype.showModal ??= function (
      this: HTMLDialogElement,
    ) {
      this.open = true;
    };
    render(
      <OrderProvider
        config={{
          endpoint: "https://functions.example/order",
          captchaSiteKey: "site",
          telegramUrl: "https://t.me/x",
          email: "a@b.ru",
        }}
      >
        <section data-stage>
          <canvas data-testid="canvas" />
          <MascotReply />
        </section>
      </OrderProvider>,
    );
    fireEvent.pointerUp(screen.getByTestId("canvas"));
    const bubble = screen.getByTestId("mascot-reply");
    expect(bubble).not.toHaveAttribute("inert");
    fireEvent.click(
      screen.getByRole("button", { name: "Хочу такую анимацию →" }),
    );
    expect(bubble).toHaveAttribute("inert");
  });
});
