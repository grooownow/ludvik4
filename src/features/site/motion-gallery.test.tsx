import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotionGallery } from "./motion-gallery";

// jsdom has no WebGL: the tiles keep their gradient and only the hover state
// and captions are under test here; the effects themselves are checked in
// the browser.

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("requestAnimationFrame", () => 0);
  vi.stubGlobal("cancelAnimationFrame", () => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function tiles() {
  return screen.getAllByTestId("effect-tile");
}

describe("MotionGallery", () => {
  it("shows the six effects", () => {
    render(<MotionGallery />);
    expect(tiles()).toHaveLength(6);
    for (const title of [
      "Лёгкая анимация блоков",
      "Шёлковый градиент",
      "«Жидкий» фон",
      "Стеклянная линза",
      "Желе",
      "Частицы",
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
    // Package labels live in the price cards, not under the tiles.
    expect(screen.queryByText(/Базовый|Расширенный/)).toBeNull();
  });

  it("rests until hovered and stops when the pointer leaves", () => {
    render(<MotionGallery />);
    const tile = tiles()[0]!;
    expect(tile).toHaveAttribute("data-active", "false");
    fireEvent.pointerEnter(tile, { pointerType: "mouse" });
    expect(tile).toHaveAttribute("data-active", "true");
    expect(tiles()[1]).toHaveAttribute("data-active", "false");
    fireEvent.pointerLeave(tile, { pointerType: "mouse" });
    expect(tile).toHaveAttribute("data-active", "false");
  });

  it("plays for a few seconds after a tap on a touch screen", () => {
    render(<MotionGallery />);
    const tile = tiles()[2]!;
    fireEvent.pointerDown(tile, { pointerType: "touch" });
    expect(tile).toHaveAttribute("data-active", "true");
    act(() => vi.advanceTimersByTime(3600));
    expect(tile).toHaveAttribute("data-active", "false");
  });

  it("renders inside a hidden tab, where the canvases have no size yet", () => {
    // A 2D context that throws like the browser's on a zero-size read.
    const ctx = new Proxy(
      {
        getImageData(_x: number, _y: number, w: number, h: number) {
          if (!w || !h) throw new DOMException("The source width is 0.");
          return { data: new Uint8ClampedArray(w * h * 4) };
        },
      } as Record<string, unknown>,
      {
        get: (target, key) =>
          key in target ? target[key as string] : () => {},
      },
    );
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(((
      type: string,
    ) => (type === "2d" ? ctx : null)) as never);
    expect(() => render(<MotionGallery />)).not.toThrow();
    expect(tiles()).toHaveLength(6);
  });
});
