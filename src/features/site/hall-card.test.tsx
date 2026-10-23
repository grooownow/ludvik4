import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const search = vi.hoisted(() => ({ value: "" }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search.value),
}));
import { drawDelay, HallCard, HallsStage, hallsMode } from "./hall-card";

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
  search.value = "";
});

describe("hallsMode", () => {
  it("shows the spotlight only for ?halls=spot, the dark hall otherwise", () => {
    expect(hallsMode("?halls=spot")).toBe("spot");
    expect(hallsMode("")).toBe("dark");
    expect(hallsMode("?halls=neon")).toBe("dark");
  });
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

describe("HallsStage", () => {
  it("is the dark hall by default", () => {
    const { container } = render(<HallsStage>x</HallsStage>);
    expect(container.querySelector("#collection")).toHaveAttribute(
      "data-halls",
      "dark",
    );
  });

  it("switches to the spotlight for ?halls=spot", () => {
    search.value = "halls=spot";
    const { container } = render(<HallsStage>x</HallsStage>);
    expect(container.querySelector("#collection")).toHaveAttribute(
      "data-halls",
      "spot",
    );
  });
});
