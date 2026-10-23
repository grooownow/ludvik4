import { act, render } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ExhibitCanvas } from "./exhibit-canvas";
import { renderSize } from "./exhibit-gate";

// jsdom has no WebGL. A Proxy stands in for the context: every method is a
// spy, `getProgramParameter` decides whether linking "worked", and the debug
// renderer reports a real GPU so the gate opens.
function fakeGl({ linkOk = true } = {}) {
  const fns = new Map<PropertyKey, ReturnType<typeof vi.fn>>();
  const overrides: Record<PropertyKey, unknown> = {
    getShaderParameter: () => true,
    getProgramParameter: () => linkOk,
    getExtension: () => ({ UNMASKED_RENDERER_WEBGL: 1 }),
    getParameter: () => "ANGLE (Apple, ANGLE Metal Renderer: Apple M2)",
    getUniformLocation: () => ({}),
    getAttribLocation: () => 0,
  };
  return new Proxy(
    {},
    {
      get(_, prop) {
        if (prop in overrides) return overrides[prop];
        if (!fns.has(prop))
          fns.set(
            prop,
            vi.fn(() => ({})),
          );
        return fns.get(prop);
      },
    },
  ) as unknown as WebGLRenderingContext & {
    drawArrays: ReturnType<typeof vi.fn>;
  };
}

let frames: FrameRequestCallback[] = [];
let clock = 0;
/** Runs `n` animation frames, each `frameMs` after the previous one. */
const tick = (n = 1, frameMs = 16) =>
  act(() => {
    for (let i = 0; i < n; i++) {
      clock += frameMs;
      const queued = frames;
      frames = [];
      for (const cb of queued) cb(clock);
    }
  });

let observed: (entries: { isIntersecting: boolean }[]) => void = () => {};

function capableDevice(gl: ReturnType<typeof fakeGl> | null) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: !query.includes("reduce"),
      media: query,
    })),
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    gl as unknown as RenderingContext,
  );
}

beforeEach(() => {
  frames = [];
  clock = performance.now();
  window.history.replaceState(null, "", "/");
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    frames.push(cb);
    return frames.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: typeof observed) {
        observed = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function mount() {
  const stage = document.createElement("div");
  Object.defineProperty(stage, "clientWidth", { value: 1000 });
  Object.defineProperty(stage, "clientHeight", { value: 800 });
  document.body.append(stage);
  const stageRef = createRef<HTMLElement>() as { current: HTMLElement };
  stageRef.current = stage;
  const onLiveChange = vi.fn();
  const view = render(
    <ExhibitCanvas stageRef={stageRef} onLiveChange={onLiveChange} />,
    { container: stage },
  );
  return { onLiveChange, view, canvas: stage.querySelector("canvas")! };
}

describe("ExhibitCanvas", () => {
  it("stays static without WebGL", () => {
    const { onLiveChange, canvas } = mount();
    tick(3);
    expect(onLiveChange).not.toHaveBeenCalledWith(true);
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  it("goes live and draws frames on a capable device", () => {
    const gl = fakeGl();
    capableDevice(gl);
    const { onLiveChange } = mount();
    tick(3);
    expect(onLiveChange).toHaveBeenCalledWith(true);
    expect(gl.drawArrays).toHaveBeenCalled();
  });

  it("falls back when the program fails to link", () => {
    capableDevice(fakeGl({ linkOk: false }));
    const { onLiveChange } = mount();
    expect(() => tick(3)).not.toThrow();
    expect(onLiveChange).not.toHaveBeenCalledWith(true);
    expect(onLiveChange).toHaveBeenCalledWith(false);
  });

  it("pauses while hidden or off-screen", () => {
    const gl = fakeGl();
    capableDevice(gl);
    mount();
    tick(2);
    act(() => observed([{ isIntersecting: false }]));
    const before = gl.drawArrays.mock.calls.length;
    tick(5);
    expect(gl.drawArrays.mock.calls.length).toBe(before);

    act(() => observed([{ isIntersecting: true }]));
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    tick(5);
    expect(gl.drawArrays.mock.calls.length).toBe(before);
  });

  it("takes a horizontal swipe (Magic Mouse, trackpad) and leaves vertical scroll to the page", () => {
    capableDevice(fakeGl());
    const { canvas } = mount();
    tick(3);
    const swipe = (deltaX: number, deltaY: number) => {
      const event = new WheelEvent("wheel", {
        deltaX,
        deltaY,
        cancelable: true,
      });
      canvas.dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect(swipe(40, 4)).toBe(true);
    expect(swipe(2, 40)).toBe(false);
  });

  it("resizes the drawing buffer on resize", () => {
    capableDevice(fakeGl());
    const { canvas } = mount();
    vi.stubGlobal("devicePixelRatio", 2);
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    expect(canvas.width).toBe(renderSize(1000, 800, 2).width);
    expect(canvas.height).toBe(renderSize(1000, 800, 2).height);
  });

  it("steps down to the still on a machine that cannot keep up", () => {
    const gl = fakeGl();
    capableDevice(gl);
    const { onLiveChange } = mount();
    tick(2);
    expect(onLiveChange).toHaveBeenLastCalledWith(true);
    // Three slow windows (warm-up + measured frames each) exhaust the tiers.
    tick(400, 45);
    expect(onLiveChange).toHaveBeenLastCalledWith(false);
    const drawn = gl.drawArrays.mock.calls.length;
    tick(20, 16);
    expect(gl.drawArrays.mock.calls.length).toBe(drawn);
  });

  it("stays at full quality on a fast machine", () => {
    const gl = fakeGl();
    capableDevice(gl);
    const { onLiveChange } = mount();
    tick(400, 16);
    expect(onLiveChange).not.toHaveBeenCalledWith(false);
  });

  it("?quality=still never starts the live scene", () => {
    window.history.replaceState(null, "", "/?quality=still");
    capableDevice(fakeGl());
    const { onLiveChange } = mount();
    tick(5);
    expect(onLiveChange).not.toHaveBeenCalledWith(true);
  });

  it("?quality=lite starts in the lite shader at the lowest scale", () => {
    window.history.replaceState(null, "", "/?quality=lite");
    const gl = fakeGl();
    capableDevice(gl);
    const { canvas } = mount();
    tick(3);
    expect(canvas.width).toBe(
      renderSize(1000, 800, window.devicePixelRatio, 0.45, 0).width,
    );
  });
});
