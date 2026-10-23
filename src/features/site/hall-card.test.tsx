import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { entryDirection, HallCard } from "./hall-card";

const HALL = {
  index: "Hall 04",
  name: "Automations",
  line: "the boring parts, handled",
  exhibit: "gears" as const,
  more: ["Bots", "Integrations", "CRMs"],
};

function motion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduce") ? reduced : false,
      media: query,
    })),
  );
}

function mount() {
  const animate = vi.fn();
  // jsdom has no Web Animations API; every element shares this stub.
  Element.prototype.animate = animate as unknown as Element["animate"];
  const view = render(
    <ul>
      <HallCard hall={HALL} soft={false} />
    </ul>,
  );
  return { ...view, animate, card: view.container.querySelector("li")! };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("entryDirection", () => {
  it("tips the exhibit away from the side the cursor came in", () => {
    expect(entryDirection(10, 0, 300)).toBe(1);
    expect(entryDirection(290, 0, 300)).toBe(-1);
  });
});

describe("HallCard hover", () => {
  it("squashes the card, rocks the exhibit and turns the gears for a mouse", () => {
    motion(false);
    const { animate, card } = mount();
    card.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 300, height: 225 }) as DOMRect;
    fireEvent.pointerEnter(card, { pointerType: "mouse", clientX: 5 });
    // card + exhibit + two gears
    expect(animate).toHaveBeenCalledTimes(4);
    const wobble = animate.mock.calls[1]![0] as { transform: string }[];
    expect(wobble[1]!.transform).toBe("rotate(12deg)");
  });

  it("stays still for reduced motion", () => {
    motion(true);
    const { animate, card } = mount();
    fireEvent.pointerEnter(card, { pointerType: "mouse", clientX: 5 });
    expect(animate).not.toHaveBeenCalled();
  });

  it("does not animate on touch, where the exhibits rock on their own", () => {
    motion(false);
    const { animate, card } = mount();
    fireEvent.pointerEnter(card, { pointerType: "touch", clientX: 5 });
    expect(animate).not.toHaveBeenCalled();
  });

  it("has no link unless it is the contact hall", () => {
    motion(false);
    const { container } = mount();
    expect(container.querySelector("a")).toBeNull();
  });
});
