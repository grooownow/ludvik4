import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { drawDelay, HallCard, HallsStage } from "./hall-card";

const HALL = {
  index: "Hall 04",
  name: "Automations",
  line: "the boring parts, handled",
  exhibit: "gears" as const,
};

/** A controllable IntersectionObserver: `enter()` reports the card in view. */
function stubObserver() {
  let callback: IntersectionObserverCallback = () => {};
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
  return {
    enter: () =>
      callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
  };
}

const mount = (index = 0, lang: "en" | "ru" = "en") =>
  render(
    <ul>
      <HallCard hall={HALL} index={index} lang={lang} />
    </ul>,
  ).container.querySelector("li")!;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("drawDelay", () => {
  it("staggers the cards of a row left to right", () => {
    expect([0, 1, 2, 3].map(drawDelay)).toEqual([0, 220, 440, 0]);
  });
});

describe("HallCard", () => {
  it("draws its plan only once it scrolls into view, after its column's beat", () => {
    vi.useFakeTimers();
    const io = stubObserver();
    const card = mount(1);
    expect(card).toHaveAttribute("data-drawn", "false");
    act(() => io.enter());
    act(() => vi.advanceTimersByTime(219));
    expect(card).toHaveAttribute("data-drawn", "false");
    act(() => vi.advanceTimersByTime(1));
    expect(card).toHaveAttribute("data-drawn", "true");
  });

  it("shows the finished plan where there is no IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    expect(mount()).toHaveAttribute("data-drawn", "true");
  });

  it("keeps the plan decorative and its notes in the page's language", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const card = mount(0, "ru");
    const plan = card.querySelector('svg[data-plan="gears"]')!;
    expect(plan.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(plan).toHaveTextContent("бот");
  });
});

function motion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduce") && reduced,
    })),
  );
}

describe("HallsStage spotlight", () => {
  const mountStage = () => {
    // run animation frames at once, so the light lands where it eases to
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    const stage = render(<HallsStage>x</HallsStage>).container.querySelector(
      "#collection",
    ) as HTMLElement;
    stage.getBoundingClientRect = () =>
      ({ left: 100, top: 50, width: 1000, height: 800 }) as DOMRect;
    return stage;
  };

  it("eases the light after a mouse", () => {
    motion(false);
    const stage = mountStage();
    fireEvent.pointerMove(stage, {
      pointerType: "mouse",
      clientX: 400,
      clientY: 350,
    });
    expect(stage.style.getPropertyValue("--spot-x")).toBe("300px");
    expect(stage.style.getPropertyValue("--spot-y")).toBe("300px");
  });

  it("leaves the light at rest for touch", () => {
    motion(false);
    const stage = mountStage();
    fireEvent.pointerMove(stage, {
      pointerType: "touch",
      clientX: 400,
      clientY: 350,
    });
    expect(stage.style.getPropertyValue("--spot-x")).toBe("");
  });

  it("leaves the light at rest for reduced motion", () => {
    motion(true);
    const stage = mountStage();
    fireEvent.pointerMove(stage, {
      pointerType: "mouse",
      clientX: 400,
      clientY: 350,
    });
    expect(stage.style.getPropertyValue("--spot-x")).toBe("");
  });
});
