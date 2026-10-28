"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  DESIGN_SIZE,
  INTRO_SCENE,
  SILK_PIXEL_UNIFORMS,
} from "./intro-scene-config";
import { SILK_SOURCE } from "./intro-shaders";
import {
  JELLY_SHADER,
  LENS_SHADER,
  LIQUID_SHADER,
} from "./motion-gallery-shaders";
import { parsePenUniforms, resolveUniforms, withPrecision } from "./pen-shader";

// The effects gallery on /uslugi/animatsiya-dlya-sajta (owner, 2026-10-27): live samples
// of what the animation packages deliver, to touch rather than read about.
// Every tile pauses off screen and on hidden tabs; with "reduce motion" it
// draws one still frame. Where WebGL is missing a tile keeps its soft
// gradient background.

type Pointer = {
  /** Eased pointer, 0..1, y up. */
  x: number;
  y: number;
  /** Eased 0..1: how much the pointer is over the tile. */
  active: number;
  /** Like `active`, but builds up slowly (≈1.5 s) and lets go fast. */
  hold: number;
  /** Seconds since the tile was last poked (entered or pressed), and where. */
  poke: number;
  pokeAt: { x: number; y: number };
  target: { x: number; y: number; active: number };
};

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Time of the still frame shown before the first hover. */
const REST_TIME = 2;

/**
 * Plays `frame` on animation frames only while the tile is `active` (hovered,
 * or touched a moment ago), then lets the motion settle and stops. At rest the
 * tile shows one still frame; with "reduce motion" it never plays. Time only
 * runs while playing, so each hover picks up where the last one stopped.
 */
function useLoop(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
  frame: (time: number, pointer: Pointer) => void,
) {
  const frameRef = useRef(frame);
  frameRef.current = frame;
  const loop = useRef<{
    pointer: Pointer;
    time: number;
    raf: number;
    last: number;
    stopAt: number;
    pokeClock: () => number;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const state = {
      pointer: {
        x: 0.5,
        y: 0.5,
        active: 0,
        hold: 0,
        poke: 99,
        pokeAt: { x: 0.5, y: 0.5 },
        target: { x: 0.5, y: 0.5, active: 0 },
      },
      time: REST_TIME,
      raf: 0,
      last: 0,
      stopAt: 0,
      pokeClock: () => 99,
    };
    loop.current = state;
    const onMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect();
      state.pointer.target.x = (event.clientX - r.left) / r.width;
      state.pointer.target.y = 1 - (event.clientY - r.top) / r.height;
    };
    let pokedAt = -99;
    const onPoke = (event: PointerEvent) => {
      onMove(event);
      pokedAt = state.time;
      state.pointer.pokeAt = { ...state.pointer.target };
    };
    state.pokeClock = () => state.time - pokedAt;
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onPoke);
    el.addEventListener("pointerenter", onPoke);
    frameRef.current(state.time, state.pointer);
    // Redraw the still frame when the size changes, e.g. when a hidden tab
    // with the gallery is opened.
    const resize =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(() => {
            if (!state.last) frameRef.current(state.time, state.pointer);
          })
        : null;
    resize?.observe(el);
    return () => {
      resize?.disconnect();
      cancelAnimationFrame(state.raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onPoke);
      el.removeEventListener("pointerenter", onPoke);
      loop.current = null;
    };
  }, [ref]);

  useEffect(() => {
    const state = loop.current;
    if (!state || prefersReducedMotion()) return;
    state.pointer.target.active = active ? 1 : 0;
    // After the pointer leaves, keep drawing a moment so the motion settles.
    state.stopAt = active ? Infinity : performance.now() + 900;
    const tick = (now: number) => {
      const dt = state.last ? Math.min(now - state.last, 50) / 1000 : 0;
      state.last = now;
      state.time += dt;
      const p = state.pointer;
      p.x += (p.target.x - p.x) * 0.12;
      p.y += (p.target.y - p.y) * 0.12;
      p.active += (p.target.active - p.active) * 0.1;
      p.hold += (p.target.active - p.hold) * (p.target.active ? 0.03 : 0.1);
      p.poke = state.pokeClock();
      frameRef.current(state.time, p);
      if (now < state.stopAt) state.raf = requestAnimationFrame(tick);
      else state.last = 0;
    };
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(tick);
  }, [active]);
}

const VERTEX = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

type Extra = Record<string, number | readonly number[]>;

/** One full-tile fragment shader. `extra` sets the shader's own uniforms. */
function ShaderCanvas({
  source,
  extra,
  active,
}: {
  source: string;
  extra?: (width: number) => Extra;
  active: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
  } | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false }) ?? null;
    if (!canvas || !gl) return;
    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(
      program,
      compile(gl.FRAGMENT_SHADER, withPrecision(source)),
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    glRef.current = { gl, program };
    return () => {
      // Free the program, not the context: React may mount again (strict
      // mode) and get the same context back.
      glRef.current = null;
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [source]);

  useLoop(ref, active, (time, pointer) => {
    const ctx = glRef.current;
    const canvas = ref.current;
    if (!ctx || !canvas || ctx.gl.isContextLost()) return;
    const { gl, program } = ctx;
    // Small tiles: 1× is crisp enough and keeps the GPU cost low.
    const dpr = 1;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    const set = (name: string, value: number | readonly number[]) => {
      const loc = gl.getUniformLocation(program, name);
      if (!loc) return;
      if (typeof value === "number") gl.uniform1f(loc, value);
      else if (value.length === 2) gl.uniform2fv(loc, value as number[]);
      else if (value.length === 3) gl.uniform3fv(loc, value as number[]);
      else gl.uniform4fv(loc, value as number[]);
    };
    set("u_resolution", [w, h]);
    set("u_time", time);
    set("u_mouse", [pointer.x, pointer.y]);
    set("u_active", pointer.active);
    set("u_hold", pointer.hold);
    set("u_poke", pointer.poke);
    set("u_poke_at", [pointer.pokeAt.x, pointer.pokeAt.y]);
    for (const [name, value] of Object.entries(extra?.(w) ?? {})) {
      set(name, value);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

const SILK_UNIFORMS = parsePenUniforms(SILK_SOURCE);
const SILK_VALUES = resolveUniforms(SILK_UNIFORMS, INTRO_SCENE.silk);

/** The intro's silk, its pixel-sized uniforms scaled to the tile. */
function silkExtra(width: number): Extra {
  const scale = width / DESIGN_SIZE.width;
  const values: Extra = { ...SILK_VALUES };
  for (const name of SILK_PIXEL_UNIFORMS) {
    const base = values[name];
    if (typeof base === "number") values[name] = base * scale * 1.6;
  }
  return values;
}

/** Dots that form a word and scatter from the pointer. */
function ParticlesCanvas({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<{
    w: number;
    h: number;
    dots: {
      hx: number;
      hy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }[];
  } | null>(null);

  useLoop(ref, active, (_time, pointer) => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    // A hidden tab has no size yet; the resize observer redraws once shown.
    if (!w || !h) return;
    if (!state.current || state.current.w !== w || state.current.h !== h) {
      canvas.width = w;
      canvas.height = h;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d");
      if (!o) return;
      o.fillStyle = "#000";
      o.font = `800 ${Math.round(h * 0.3)}px system-ui, sans-serif`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillText("L4", w / 2, h / 2);
      const data = o.getImageData(0, 0, w, h).data;
      const step = Math.max(3, Math.round(3 * dpr));
      const dots = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3]! > 128) {
            dots.push({
              hx: x,
              hy: y,
              x,
              y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
      state.current = { w, h, dots };
    }
    const { dots } = state.current;
    const mx = pointer.x * w;
    const my = (1 - pointer.y) * h;
    const radius = 40 * dpr;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#e0157a";
    for (const d of dots) {
      const dx = d.x - mx;
      const dy = d.y - my;
      const dist = Math.hypot(dx, dy);
      if (dist < radius && pointer.active > 0.05) {
        const push = ((radius - dist) / radius) * 3 * pointer.active;
        d.vx += (dx / (dist || 1)) * push;
        d.vy += (dy / (dist || 1)) * push;
      }
      d.vx += (d.hx - d.x) * 0.04;
      d.vy += (d.hy - d.y) * 0.04;
      d.vx *= 0.82;
      d.vy *= 0.82;
      d.x += d.vx;
      d.y += d.vy;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1.2 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

/** The basic package: blocks rise in turn and a number counts up, looped. */
function LightBlocks() {
  return (
    <div className="gallery-light absolute inset-0 grid grid-cols-3 content-center gap-1.5 p-3">
      {["01", "02", "03"].map((n, i) => (
        <div
          key={n}
          className="gallery-rise rounded-md bg-white/90 p-1.5 shadow-sm"
          style={{ animationDelay: `${i * 0.35}s` }}
        >
          <span className="text-primary block font-mono text-[8px]">{n}</span>
          <span className="mt-1 block h-1 w-3/4 rounded-full bg-[#ffd0e6]" />
          <span className="mt-1 block h-1 w-1/2 rounded-full bg-[#ffe4f0]" />
        </div>
      ))}
      <p className="gallery-count text-primary col-span-3 text-center text-xl font-semibold tracking-tight tabular-nums" />
    </div>
  );
}

type Tile = {
  title: string;
  text: string;
  render: (active: boolean) => ReactNode;
};

const TILES: Tile[] = [
  {
    title: "Лёгкая анимация блоков",
    text: "Блоки появляются по очереди, а цифра набегает до 100%.",
    render: () => <LightBlocks />,
  },
  {
    title: "Шёлковый градиент",
    text: "Цвета медленно переливаются, как шёлковая ткань.",
    render: (active) => (
      <ShaderCanvas source={SILK_SOURCE} extra={silkExtra} active={active} />
    ),
  },
  {
    title: "«Жидкий» фон",
    text: "Поверхность течёт, а от курсора расходятся волны.",
    render: (active) => <ShaderCanvas source={LIQUID_SHADER} active={active} />,
  },
  {
    title: "Стеклянная линза",
    text: "Линза плывёт за курсором и преломляет узор под собой.",
    render: (active) => <ShaderCanvas source={LENS_SHADER} active={active} />,
  },
  {
    title: "Желе",
    text: "Ткните мармеладного мишку — он задрожит, а потом успокоится.",
    render: (active) => <ShaderCanvas source={JELLY_SHADER} active={active} />,
  },
  {
    title: "Частицы",
    text: "Точки складываются в слово и разлетаются от курсора.",
    render: (active) => <ParticlesCanvas active={active} />,
  },
];

/**
 * A tile that plays while hovered — or for a few seconds after a tap on touch
 * screens — and rests on a still frame otherwise. `data-active` drives the
 * CSS-only light-blocks tile.
 */
function TileFrame({ children }: { children: (active: boolean) => ReactNode }) {
  const [active, setActive] = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => () => clearTimeout(touchTimer.current), []);
  return (
    <div
      aria-hidden="true"
      data-testid="effect-tile"
      data-active={active}
      onPointerEnter={(e) => e.pointerType !== "touch" && setActive(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setActive(false)}
      onPointerDown={(e) => {
        if (e.pointerType !== "touch") return;
        setActive(true);
        clearTimeout(touchTimer.current);
        touchTimer.current = setTimeout(() => setActive(false), 3500);
      }}
      className="relative aspect-square cursor-pointer touch-pan-y overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffe4f0] to-[#ffc2de]"
    >
      {children(active)}
    </div>
  );
}

export function MotionGallery() {
  // Canvases mount after hydration: the static HTML keeps the captions.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
      {TILES.map((tile) => (
        <li key={tile.title}>
          <TileFrame>
            {(active) => (mounted ? tile.render(active) : null)}
          </TileFrame>
          <p className="mt-2.5 text-sm leading-tight font-semibold tracking-tight">
            {tile.title}
          </p>
          <p className="text-muted-foreground mt-1 text-xs leading-snug">
            {tile.text}
          </p>
        </li>
      ))}
    </ul>
  );
}
