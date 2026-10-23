import { type RefObject, useEffect, useRef, useState } from "react";
import {
  isSoftwareRenderer,
  NARROW_MEDIA,
  renderSize,
  shouldRunLiveStage,
  stageFraming,
} from "./exhibit-gate";
import {
  createFrameMonitor,
  FULL_TIER,
  qualityOverride,
  STILL_TIER,
  TIERS,
} from "./exhibit-quality";
import {
  createMascotState,
  type MascotInput,
  PHONE_SPRING,
  stepMascot,
  tapKick,
} from "./exhibit-physics";
import {
  EXHIBIT_FRAGMENT,
  EXHIBIT_VERTEX,
  MASCOT_COLOR,
  STAGE_CAMERA,
} from "./exhibit-shader";

type Props = {
  /** The stage section: sized against, observed for visibility. */
  stageRef: RefObject<HTMLElement | null>;
  /** Reports when the canvas is painting, so the still can step aside. */
  onLiveChange: (live: boolean) => void;
};

// Pointer → mascot. A short press is a push away from the tapped side;
// horizontal drag spins the mascot about its axis, vertical drag tilts it
// toward (down) or away from (up) the viewer while held. A horizontal swipe
// on a Magic Mouse or trackpad arrives as a wheel event and spins it too; the
// device sends its own momentum, so the free spin is stopped meanwhile.
// A finger only hits: on release, as hard as the press was long (tapKick);
// one that travels is scrolling the page.
const TAP_SLOP = 4;
const TOUCH_SLOP = 12;
const SPIN_PER_PX = 0.01;
const TILT_PER_PX = 0.004;
const MAX_HOLD_TILT = 0.45;
const PUSH = { side: 2.6, wobble: 2.2 };

function matches(query: string): boolean {
  return typeof window.matchMedia === "function"
    ? window.matchMedia(query).matches
    : false;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function buildProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertex = compile(gl, gl.VERTEX_SHADER, EXHIBIT_VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, EXHIBIT_FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

export function ExhibitCanvas({ stageRef, onLiveChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const onLiveRef = useRef(onLiveChange);
  onLiveRef.current = onLiveChange;

  useEffect(() => {
    const reducedMotion = matches("(prefers-reduced-motion: reduce)");
    let webgl = false;
    let softwareRenderer = false;
    if (!reducedMotion) {
      try {
        const probe = document.createElement("canvas").getContext("webgl");
        webgl = Boolean(probe);
        const info = probe?.getExtension("WEBGL_debug_renderer_info");
        const renderer = info
          ? String(probe?.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? "")
          : "";
        softwareRenderer = isSoftwareRenderer(renderer);
      } catch {
        webgl = false;
      }
    }
    // `?quality=still` pins the fallback, for checking it on any machine.
    if (qualityOverride(new URL(document.URL).search) === STILL_TIER) return;
    setEnabled(shouldRunLiveStage({ reducedMotion, webgl, softwareRenderer }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!enabled || !canvas || !stage) return;

    const gl = canvas.getContext("webgl", { antialias: false });
    const program = gl ? buildProgram(gl) : null;
    if (!gl || !program) {
      onLiveRef.current(false);
      setEnabled(false);
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const uniforms = {
      lite: u("uLite"),
      hide: u("uHide"),
      res: u("uRes"),
      color: u("uColor"),
      tilt: u("uTilt"),
      lag: u("uLag"),
      cam: u("uCam"),
      spin: u("uSpin"),
      zoom: u("uZoom"),
      center: u("uCenter"),
    };

    // Quality ladder: start at the pinned tier or full, then let the frame
    // monitor step down on a machine that cannot keep up (exhibit-quality.ts).
    const pinned = qualityOverride(new URL(document.URL).search);
    // Below Retina density, a machine with headroom may also step up to
    // supersampling.
    let tier = pinned ?? FULL_TIER;
    const monitor =
      pinned === null
        ? createFrameMonitor(tier, {
            supersample: window.devicePixelRatio < 1.5,
          })
        : null;

    // Phone framing on a narrow stage (exhibit-gate.ts), re-read on resize.
    let framing = stageFraming(matches(NARROW_MEDIA));
    const resize = () => {
      framing = stageFraming(matches(NARROW_MEDIA));
      const size = renderSize(
        stage.clientWidth,
        stage.clientHeight,
        window.devicePixelRatio,
        TIERS[tier]!.scale,
        TIERS[tier]!.minDensity,
      );
      canvas.width = size.width;
      canvas.height = size.height;
    };
    resize();
    window.addEventListener("resize", resize);
    // Moving the window to a screen with another pixel ratio fires no resize;
    // a query for the current ratio flips when it changes. Re-armed each time.
    let ratioQuery: MediaQueryList | null = null;
    const onRatio = () => {
      resize();
      watchRatio();
    };
    const watchRatio = () => {
      ratioQuery?.removeEventListener?.("change", onRatio);
      ratioQuery =
        typeof window.matchMedia === "function"
          ? window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
          : null;
      ratioQuery?.addEventListener?.("change", onRatio);
    };
    watchRatio();

    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    intersection.observe(stage);

    // Pointer input accumulated between frames, consumed by the next one.
    const input: MascotInput = {
      dragging: false,
      holdTilt: 0,
      spinDelta: 0,
      spinVelocity: null,
      push: null,
    };
    const drag = { x: 0, y: 0, moved: 0, t: 0, velocity: 0 };
    // A push away from the side at `clientX`, `strength` of the full one.
    const pushFrom = (clientX: number, strength: number) => {
      const rect = canvas.getBoundingClientRect();
      const side = -Math.sign(clientX - rect.left - rect.width / 2 || 1);
      const s = side * PUSH.side * strength;
      const f = (Math.random() - 0.5) * PUSH.wobble * strength;
      const { yaw } = STAGE_CAMERA;
      input.push = {
        a: -(s * Math.cos(yaw) + f * Math.sin(yaw)),
        b: -s * Math.sin(yaw) + f * Math.cos(yaw),
      };
    };
    let press: { x: number; y: number; t: number } | null = null;
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        press = { x: event.clientX, y: event.clientY, t: performance.now() };
        return;
      }
      input.dragging = true;
      input.holdTilt = 0;
      input.spinVelocity = 0;
      Object.assign(drag, {
        x: event.clientX,
        y: event.clientY,
        moved: 0,
        t: performance.now(),
        velocity: 0,
      });
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic or already-released pointers cannot be captured.
      }
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        if (
          press &&
          Math.hypot(event.clientX - press.x, event.clientY - press.y) >
            TOUCH_SLOP
        )
          press = null;
        return;
      }
      if (!input.dragging) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      const now = performance.now();
      drag.moved += Math.abs(dx) + Math.abs(dy);
      input.spinDelta += dx * SPIN_PER_PX;
      input.holdTilt = Math.max(
        -MAX_HOLD_TILT,
        Math.min(MAX_HOLD_TILT, input.holdTilt + dy * TILT_PER_PX),
      );
      drag.velocity =
        (dx * SPIN_PER_PX) / Math.max(1 / 120, (now - drag.t) / 1000);
      Object.assign(drag, { x: event.clientX, y: event.clientY, t: now });
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        if (press) pushFrom(press.x, tapKick(performance.now() - press.t));
        press = null;
        return;
      }
      if (!input.dragging) return;
      if (drag.moved < TAP_SLOP) {
        pushFrom(event.clientX, 1);
      } else {
        input.spinVelocity = drag.velocity;
      }
      input.dragging = false;
      input.holdTilt = 0;
    };
    const onWheel = (event: WheelEvent) => {
      // Mostly vertical: page scroll, not ours.
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      // Also keeps the browser's swipe-to-go-back from firing.
      event.preventDefault();
      input.spinDelta += event.deltaX * SPIN_PER_PX;
      input.spinVelocity = 0;
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    // The browser took the finger for a scroll: no hit.
    const onCancel = (event: PointerEvent) => {
      if (event.pointerType === "touch") press = null;
      else onUp(event);
    };
    canvas.addEventListener("pointercancel", onCancel);

    // Touch devices rock calmer after a hit; the desktop keeps its spring.
    const state = createMascotState(
      matches("(pointer: coarse)") ? { free: PHONE_SPRING } : {},
    );
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let live = false;
    let gaveUp = false;
    const frame = (now: number) => {
      if (gaveUp) return;
      raf = requestAnimationFrame(frame);
      const dt = (now - last) / 1000;
      last = now;
      if (!visible || document.hidden) return;
      const next = monitor?.sample(dt * 1000) ?? null;
      if (next !== null) {
        if (next >= STILL_TIER) {
          // Too slow even for the lite shader: hand over to the rocking still.
          gaveUp = true;
          cancelAnimationFrame(raf);
          onLiveRef.current(false);
          return;
        }
        tier = next;
        resize();
      }
      time += Math.min(Math.max(dt, 0), 1 / 30);
      const pose = stepMascot(state, input, dt, time, STAGE_CAMERA.yaw);
      input.spinDelta = 0;
      input.spinVelocity = null;
      input.push = null;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniforms.lite, TIERS[tier]!.lite ? 1 : 0);
      gl.uniform1f(uniforms.hide, 0);
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform3fv(uniforms.color, MASCOT_COLOR);
      gl.uniform2f(uniforms.tilt, pose.tiltA, pose.tiltB);
      gl.uniform2f(uniforms.lag, pose.lagX, pose.lagZ);
      gl.uniform2f(uniforms.cam, STAGE_CAMERA.yaw, STAGE_CAMERA.pitch);
      gl.uniform1f(uniforms.spin, pose.spin);
      gl.uniform1f(uniforms.zoom, framing.zoom);
      // The shader counts from the bottom-left; the framing from the top.
      gl.uniform2f(uniforms.center, framing.x, 1 - framing.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!live) {
        live = true;
        onLiveRef.current(true);
      }
    };
    raf = requestAnimationFrame(frame);

    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      onLiveRef.current(false);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ratioQuery?.removeEventListener?.("change", onRatio);
      intersection.disconnect();
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (!gaveUp) onLiveRef.current(false);
    };
  }, [enabled, stageRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full cursor-grab touch-manipulation active:cursor-grabbing"
    />
  );
}
