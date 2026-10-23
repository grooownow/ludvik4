import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExhibitStage } from "./exhibit-stage";

function motion(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduce") ? reduced : false,
      media: query,
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const mount = () => {
  const view = render(
    <ExhibitStage label="Ludvik" pushLabel="Push the roly-poly">
      <p>copy</p>
    </ExhibitStage>,
  );
  const [bg, mascot] = view.container.querySelectorAll("img");
  return { ...view, bg: bg!, mascot: mascot! };
};

describe("ExhibitStage still", () => {
  it("stacks the stage and the mascot as separate layers", () => {
    motion(false);
    const { bg, mascot } = mount();
    expect(bg.getAttribute("src")).toContain("stage-bg-");
    expect(mascot.getAttribute("src")).toContain("stage-mascot-");
  });

  it("rocks the mascot with CSS while the live scene is not running", () => {
    motion(false);
    const { mascot } = mount();
    expect(mascot).toHaveAttribute("data-rocking", "true");
  });

  it("keeps the mascot still for reduced motion", () => {
    motion(true);
    const { mascot, queryByRole } = mount();
    expect(mascot).toHaveAttribute("data-rocking", "false");
    expect(queryByRole("button")).toBeNull();
  });

  it("pushes the rocking mascot on a tap", () => {
    motion(false);
    const animate = vi.fn();
    HTMLElement.prototype.animate =
      animate as unknown as HTMLElement["animate"];
    const { getByRole } = mount();
    act(() => {
      fireEvent.click(getByRole("button", { name: "Push the roly-poly" }), {
        clientX: 10,
      });
    });
    expect(animate).toHaveBeenCalledTimes(1);
  });
});
