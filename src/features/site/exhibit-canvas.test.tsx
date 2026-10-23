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
    getUniformLocation: (_: unknown, name: string) => ({ name }),
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
    uniform1f: ReturnType<typeof vi.fn>;
    uniform2f: ReturnType<typeof vi.fn>;
  };
}

/** Last value the scene sent to a uniform, by its shader name. */
function lastUniform(spy: ReturnType<typeof vi.fn>, name: string) {
  const calls = spy.mock.calls.filter(
    ([loc]) => (loc as { name: string }).name === name,
  );
  return calls.at(-1)!.slice(1) as number[];
}

/** A pointer gesture on the canvas: press, move by (dx, dy) in steps, hold. */
/** A finger on the canvas: a pointer event of type touch. */
function touch(canvas: HTMLCanvasElement, type: string, x: number, y: number) {
  const event = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true });
  Object.defineProperty(event, "pointerType", { value: "touch" });
  canvas.dispatchEvent(event);
}

function pointer(
  canvas: HTMLCanvasElement,
  type: string,
  x: number,
  y: number,
) {
  canvas.dispatchEvent(
    new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }),
  );
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

/**
 * A GPU device. Every media query matches except reduced motion and those
 * named in `unless` (e.g. "max-width" for a wide screen, "coarse" for a mouse).
 */
function capableDevice(
  gl: ReturnType<typeof fakeGl> | null,
  unless: string[] = [],
) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches:
        !query.includes("reduce") && !unless.some((q) => query.includes(q)),
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

  // Every gesture the spec lists, end to end from the pointer to the shader
  // (the physics alone is covered in exhibit-physics.test.ts).
  it("tilts the mascot toward the viewer while dragged down and held", () => {
    const gl = fakeGl();
    capableDevice(gl);
    const { canvas } = mount();
    tick(3);
    pointer(canvas, "pointerdown", 500, 400);
    for (let i = 1; i <= 15; i++)
      pointer(canvas, "pointermove", 500, 400 + i * 10);
    tick(90);
    const [, held] = lastUniform(gl.uniform2f, "uTilt");
    expect(held).toBeGreaterThan(0.3);
    pointer(canvas, "pointerup", 500, 550);
  });

  it("tilts it away while dragged up", () => {
    const gl = fakeGl();
    capableDevice(gl);
    const { canvas } = mount();
    tick(3);
    pointer(canvas, "pointerdown", 500, 400);
    for (let i = 1; i <= 15; i++)
      pointer(canvas, "pointermove", 500, 400 - i * 10);
    tick(90);
    const [, held] = lastUniform(gl.uniform2f, "uTilt");
    expect(held).toBeLessThan(-0.3);
  });

  it("spins it about its axis while dragged sideways", () => {
    const gl = fakeGl();
    capableDevice(gl);
    const { canvas } = mount();
    tick(3);
    const [before] = lastUniform(gl.uniform1f, "uSpin");
    pointer(canvas, "pointerdown", 500, 400);
    for (let i = 1; i <= 10; i++)
      pointer(canvas, "pointermove", 500 + i * 10, 400);
    tick(2);
    const [after] = lastUniform(gl.uniform1f, "uSpin");
    expect(after! - before!).toBeCloseTo(1, 1);
  });

  it("pushes it on a click, harder than its idle rocking", () => {
    const gl = fakeGl();
    capableDevice(gl);
    const { canvas } = mount();
    tick(3);
    pointer(canvas, "pointerdown", 100, 400);
    pointer(canvas, "pointerup", 100, 400);
    let peak = 0;
    for (let i = 0; i < 60; i++) {
      tick(1);
      const [a, b] = lastUniform(gl.uniform2f, "uTilt");
      peak = Math.max(peak, Math.hypot(a!, b!));
    }
    // Idle rocking stays under ~0.2 rad.
    expect(peak).toBeGreaterThan(0.25);
  });

  // Phones (mobile first screen in the spec): a tap is the only gesture.
  describe("on a touch screen", () => {
    let now = 0;
    beforeEach(() => {
      now = 0;
      vi.spyOn(performance, "now").mockImplementation(() => now);
    });

    /** A finger rests `heldMs` on the left of the mascot, then lifts. */
    function tap(canvas: HTMLCanvasElement, heldMs: number, moveBy = 0) {
      touch(canvas, "pointerdown", 300, 400);
      now += heldMs;
      if (moveBy) touch(canvas, "pointermove", 300, 400 + moveBy);
      touch(canvas, "pointerup", 300, 400 + moveBy);
    }

    function mountTouch() {
      const gl = fakeGl();
      capableDevice(gl);
      const { canvas, view } = mount();
      tick(3);
      return { gl, canvas, view };
    }

    it("hits softer on a flick than on a short press", () => {
      // Idle rocking is identical frame by frame across runs, so subtracting
      // a run without a tap leaves the hit alone.
      const tilts = (heldMs: number | null) => {
        const run = mountTouch();
        if (heldMs !== null) tap(run.canvas, heldMs);
        const series: number[] = [];
        for (let i = 0; i < 120; i++) {
          tick(1);
          series.push(lastUniform(run.gl.uniform2f, "uTilt")[0]!);
        }
        run.view.unmount();
        return series;
      };
      const idle = tilts(null);
      const hit = (series: number[]) =>
        Math.max(...series.map((v, i) => Math.abs(v - idle[i]!)));
      const soft = hit(tilts(40));
      const hard = hit(tilts(400));
      expect(soft).toBeGreaterThan(0.15);
      // The full hit runs into the 0.5 rad tilt cap, so not quite 2.5×.
      expect(hard).toBeGreaterThan(soft + 0.1);
    });

    it("does not hit when the finger travels (a scroll) or is cancelled", () => {
      const tilts = (gesture: (canvas: HTMLCanvasElement) => void) => {
        const run = mountTouch();
        gesture(run.canvas);
        const series: number[] = [];
        for (let i = 0; i < 120; i++) {
          tick(1);
          series.push(lastUniform(run.gl.uniform2f, "uTilt")[0]!);
        }
        run.view.unmount();
        return series;
      };
      const idle = tilts(() => {});
      const scrolled = tilts((canvas) => tap(canvas, 200, 40));
      const cancelled = tilts((canvas) => {
        touch(canvas, "pointerdown", 300, 400);
        touch(canvas, "pointercancel", 300, 400);
        touch(canvas, "pointerup", 300, 400);
      });
      const drift = (series: number[]) =>
        Math.max(...series.map((v, i) => Math.abs(v - idle[i]!)));
      expect(drift(scrolled)).toBeLessThan(1e-6);
      expect(drift(cancelled)).toBeLessThan(1e-6);
    });

    it("never tilts or spins on a drag", () => {
      const { gl, canvas } = mountTouch();
      const [spin] = lastUniform(gl.uniform1f, "uSpin");
      touch(canvas, "pointerdown", 500, 400);
      for (let i = 1; i <= 15; i++)
        touch(canvas, "pointermove", 500 + i * 10, 400 + i * 10);
      tick(60);
      expect(lastUniform(gl.uniform1f, "uSpin")[0]).toBe(spin);
      touch(canvas, "pointercancel", 650, 550);
    });

    it("lets the page scroll under the finger", () => {
      const { canvas } = mountTouch();
      expect(canvas).toHaveClass("touch-manipulation");
      expect(canvas).not.toHaveClass("touch-none");
    });
  });

  it("frames the mascot for a phone on a narrow stage", () => {
    const gl = fakeGl();
    capableDevice(gl);
    mount();
    tick(2);
    expect(lastUniform(gl.uniform1f, "uZoom")).toEqual([1.38]);
    const [x, y] = lastUniform(gl.uniform2f, "uCenter");
    expect(x).toBeCloseTo(0.53, 5);
    // The shader counts from the bottom; the framing from the top.
    expect(y).toBeCloseTo(0.57, 5);
  });

  it("keeps the default framing on a wide stage", () => {
    const gl = fakeGl();
    capableDevice(gl, ["max-width"]);
    mount();
    tick(2);
    expect(lastUniform(gl.uniform1f, "uZoom")).toEqual([1]);
    expect(lastUniform(gl.uniform2f, "uCenter")).toEqual([0.5, 0.5]);
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

  it("re-sizes when the window moves to a screen with another pixel ratio", () => {
    // Dragging a window from a Retina laptop to a 1x monitor changes the
    // pixel ratio without a resize event; only a resolution query notices.
    const changes: (() => void)[] = [];
    capableDevice(fakeGl());
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: !query.includes("reduce"),
        media: query,
        addEventListener: (_: string, cb: () => void) => {
          if (query.includes("resolution")) changes.push(cb);
        },
        removeEventListener: () => {},
      })),
    );
    vi.stubGlobal("devicePixelRatio", 2);
    const { canvas } = mount();
    expect(canvas.width).toBe(renderSize(1000, 800, 2).width);
    vi.stubGlobal("devicePixelRatio", 1);
    act(() => changes.at(-1)?.());
    expect(canvas.width).toBe(renderSize(1000, 800, 1).width);
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

  it("stays at full quality on a fast machine with a Retina screen", () => {
    const gl = fakeGl();
    capableDevice(gl);
    vi.stubGlobal("devicePixelRatio", 2);
    const { onLiveChange, canvas } = mount();
    tick(400, 16);
    expect(onLiveChange).not.toHaveBeenCalledWith(false);
    expect(canvas.width).toBe(renderSize(1000, 800, 2).width);
  });

  it("supersamples on a fast machine with a 1x screen", () => {
    capableDevice(fakeGl());
    vi.stubGlobal("devicePixelRatio", 1);
    const { canvas } = mount();
    expect(canvas.width).toBe(renderSize(1000, 800, 1).width);
    tick(400, 16);
    expect(canvas.width).toBe(renderSize(1000, 800, 1, 1, 2).width);
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
