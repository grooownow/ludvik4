import { type RefObject, useEffect, useRef, useState } from "react";
import {
  COMPOSITE_SHADER,
  FINAL_SHADER,
  MAX_RENDER_WIDTH,
  VERTEX_SHADER,
  dropRadius,
  shouldRunLiveIntro,
} from "./intro-scene-shaders";
import {
  DESIGN_SIZE,
  INTRO_SCENE,
  SILK_PIXEL_UNIFORMS,
  type SpringState,
  stepSpring,
} from "./intro-scene-config";
import { SILK_SOURCE, SMOOSH_SOURCE } from "./intro-shaders";
import { DROP_TINT, type IntroVariant } from "./intro-variants";
import {
  type PenUniform,
  type UniformValue,
  parsePenUniforms,
  resolveUniforms,
  withPrecision,
} from "./pen-shader";

type Props = {
  stageRef: RefObject<HTMLElement | null>;
  /** Container of the HTML copy; its text is redrawn into the scene. */
  copyRef: RefObject<HTMLElement | null>;
  variant: IntroVariant;
  /** Reports when the canvas is painting (so the HTML copy can step aside). */
  onLiveChange: (live: boolean) => void;
};

// Where the drop rests when the cursor is outside the stage (0..1, top-left).
const IDLE = { x: 0.7, y: 0.42 };

function matches(query: string): boolean {
  return typeof window.matchMedia === "function"
    ? window.matchMedia(query).matches
    : false;
}

type Program = {
  program: WebGLProgram;
  uniforms: PenUniform[];
  location: (name: string) => WebGLUniformLocation | null;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function link(gl: WebGLRenderingContext, fragment: string): Program | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, withPrecision(fragment));
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "a_position");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  const cache = new Map<string, WebGLUniformLocation | null>();
  return {
    program,
    uniforms: parsePenUniforms(fragment),
    location: (name) => {
      if (!cache.has(name))
        cache.set(name, gl.getUniformLocation(program, name));
      return cache.get(name) ?? null;
    },
  };
}

function setUniform(
  gl: WebGLRenderingContext,
  p: Program,
  name: string,
  value: UniformValue,
  type = "float",
) {
  const loc = p.location(name);
  if (!loc) return;
  if (typeof value === "number") {
    if (type === "int" || type === "bool") gl.uniform1i(loc, Math.round(value));
    else gl.uniform1f(loc, value);
    return;
  }
  const v = new Float32Array(value);
  if (v.length === 2) gl.uniform2fv(loc, v);
  else if (v.length === 3) gl.uniform3fv(loc, v);
  else if (v.length === 4) gl.uniform4fv(loc, v);
}

function createTexture(gl: WebGLRenderingContext) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return texture;
}

type Target = { texture: WebGLTexture | null; fbo: WebGLFramebuffer | null };

function createTarget(gl: WebGLRenderingContext, w: number, h: number): Target {
  const texture = createTexture(gl);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    w,
    h,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { texture, fbo };
}

/**
 * Redraws the HTML copy (tagline, services line) into a 2D canvas at the same
 * place and in the same font, so the drop can refract it like the art.
 */
function drawCopy(
  ctx: CanvasRenderingContext2D,
  stage: HTMLElement,
  copy: HTMLElement,
  scale: number,
) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  const origin = stage.getBoundingClientRect();
  const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? "";
    const parent = node.parentElement;
    if (!text.trim() || !parent) continue;
    const style = getComputedStyle(parent);
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    const size = parseFloat(style.fontSize) * scale;
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;
    const spacing = parseFloat(style.letterSpacing);
    if ("letterSpacing" in ctx) {
      ctx.letterSpacing = `${Number.isNaN(spacing) ? 0 : spacing * scale}px`;
    }
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.9;
    ctx.textBaseline = "middle";
    ctx.fillText(
      style.textTransform === "uppercase" ? text.toUpperCase() : text,
      (rect.left - origin.left) * scale,
      (rect.top + rect.height / 2 - origin.top) * scale,
    );
  }
  ctx.globalAlpha = 1;
}

/**
 * The live intro: design.pen's silk and smoosh shaders running for real, the
 * wordmark art and the copy composited in, and a heavy glass drop that trails
 * the cursor. Renders nothing unless `shouldRunLiveIntro` allows it, so the
 * server HTML and every fallback is the static artwork plus HTML copy.
 */
export function IntroScene({
  stageRef,
  copyRef,
  variant,
  onLiveChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const variantRef = useRef(variant);
  variantRef.current = variant;
  const onLiveRef = useRef(onLiveChange);
  onLiveRef.current = onLiveChange;

  useEffect(() => {
    const finePointer = matches("(hover: hover) and (pointer: fine)");
    const reducedMotion = matches("(prefers-reduced-motion: reduce)");
    const wideLandscape = matches(
      "(min-width: 768px) and (orientation: landscape)",
    );
    let webgl = false;
    if (finePointer && !reducedMotion && wideLandscape) {
      try {
        webgl = Boolean(document.createElement("canvas").getContext("webgl"));
      } catch {
        webgl = false;
      }
    }
    setEnabled(
      shouldRunLiveIntro({ finePointer, reducedMotion, wideLandscape, webgl }),
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const copy = copyRef.current;
    if (!enabled || !canvas || !stage || !copy) return;

    const gl = canvas.getContext("webgl", { antialias: false });
    const silk = gl && link(gl, SILK_SOURCE);
    const smoosh = gl && link(gl, SMOOSH_SOURCE);
    const composite = gl && link(gl, COMPOSITE_SHADER);
    const final = gl && link(gl, FINAL_SHADER);
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    if (!gl || !silk || !smoosh || !composite || !final || !textCtx) {
      setEnabled(false);
      return;
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const wordmarkTexture = createTexture(gl);
    const textTexture = createTexture(gl);
    let wordmarkSize = { w: DESIGN_SIZE.width * 2, h: DESIGN_SIZE.height * 2 };
    let wordmarkReady = false;
    let loadedVariant: IntroVariant | null = null;
    const loadWordmark = (v: IntroVariant) => {
      loadedVariant = v;
      wordmarkReady = false;
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (loadedVariant !== v) return;
        gl.bindTexture(gl.TEXTURE_2D, wordmarkTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image,
        );
        wordmarkSize = { w: image.naturalWidth, h: image.naturalHeight };
        wordmarkReady = true;
      };
      image.src = INTRO_SCENE[v].wordmark;
    };

    let width = 0;
    let height = 0;
    let scale = 1;
    let a: Target | null = null;
    let b: Target | null = null;
    let textDirty = true;
    const resize = () => {
      const cssW = stage.clientWidth;
      const cssH = stage.clientHeight;
      if (!cssW || !cssH) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.min(Math.round(cssW * dpr), MAX_RENDER_WIDTH);
      scale = width / cssW;
      height = Math.round(cssH * scale);
      canvas.width = width;
      canvas.height = height;
      textCanvas.width = width;
      textCanvas.height = height;
      for (const t of [a, b]) {
        if (t) {
          gl.deleteTexture(t.texture);
          gl.deleteFramebuffer(t.fbo);
        }
      }
      a = createTarget(gl, width, height);
      b = createTarget(gl, width, height);
      textDirty = true;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    void document.fonts?.ready.then(() => {
      textDirty = true;
    });

    const pointer = { x: 0, y: 0, inside: false };
    let drop: SpringState = {
      x: stage.clientWidth * IDLE.x,
      y: stage.clientHeight * IDLE.y,
      vx: 0,
      vy: 0,
    };
    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    intersection.observe(stage);

    const draw = (p: Program, target: Target | null, bind: () => void) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(p.program);
      bind();
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const bindTexture = (
      p: Program,
      name: string,
      unit: number,
      tex: WebGLTexture | null,
    ) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      const loc = p.location(name);
      if (loc) gl.uniform1i(loc, unit);
    };
    const applyPen = (
      p: Program,
      overrides: Record<string, number | string>,
      time: number,
      pixelScale: number,
    ) => {
      const values = resolveUniforms(p.uniforms, overrides);
      for (const u of p.uniforms) {
        if (u.role === "resolution") setUniform(gl, p, u.name, [width, height]);
        else if (u.role === "time") setUniform(gl, p, u.name, time);
        else if (u.role !== "backdrop" && values[u.name] !== undefined) {
          let value = values[u.name]!;
          if (
            typeof value === "number" &&
            (SILK_PIXEL_UNIFORMS as readonly string[]).includes(u.name)
          ) {
            value *= pixelScale;
          }
          setUniform(gl, p, u.name, value, u.type);
        }
      }
    };

    let frame = 0;
    let last = performance.now();
    let announced = false;
    const start = last;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = (now - last) / 1000;
      last = now;
      if (!visible || document.hidden || !a || !b) return;

      const v = variantRef.current;
      if (loadedVariant !== v) loadWordmark(v);
      if (!wordmarkReady) return;
      if (textDirty) {
        drawCopy(textCtx, stage, copy, scale);
        gl.bindTexture(gl.TEXTURE_2D, textTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          textCanvas,
        );
        textDirty = false;
      }

      const t = (now - start) / 1000;
      const scene = INTRO_SCENE[v];
      const pixelScale = Math.max(
        width / DESIGN_SIZE.width,
        height / DESIGN_SIZE.height,
      );
      const sA = a;
      const sB = b;
      draw(silk, sA, () => applyPen(silk, scene.silk, t, pixelScale));
      draw(composite, sB, () => {
        setUniform(gl, composite, "u_resolution", [width, height]);
        setUniform(gl, composite, "u_texSize", [
          wordmarkSize.w,
          wordmarkSize.h,
        ]);
        bindTexture(composite, "u_silk", 0, sA.texture);
        bindTexture(composite, "u_wordmark", 1, wordmarkTexture);
      });
      draw(smoosh, sA, () => {
        applyPen(smoosh, scene.smoosh, t, pixelScale);
        const backdrop = smoosh.uniforms.find((u) => u.role === "backdrop");
        if (backdrop) bindTexture(smoosh, backdrop.name, 0, sB.texture);
      });

      const cssW = stage.clientWidth;
      const cssH = stage.clientHeight;
      const goal = pointer.inside
        ? pointer
        : { x: cssW * IDLE.x, y: cssH * IDLE.y };
      drop = stepSpring(drop, goal, dt);
      const speed = Math.hypot(drop.vx, drop.vy);
      draw(final, null, () => {
        setUniform(gl, final, "u_resolution", [width, height]);
        setUniform(gl, final, "u_center", [
          drop.x * scale,
          (cssH - drop.y) * scale,
        ]);
        setUniform(gl, final, "u_time", t);
        setUniform(gl, final, "u_radius", dropRadius(cssW) * scale);
        setUniform(gl, final, "u_wobble", 0.5 + Math.min(speed / 900, 1) * 0.7);
        setUniform(gl, final, "u_tint", DROP_TINT[v]);
        bindTexture(final, "u_scene", 0, sA.texture);
        bindTexture(final, "u_text", 1, textTexture);
      });

      if (!announced) {
        announced = true;
        onLiveRef.current(true);
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      onLiveRef.current(false);
      resizeObserver.disconnect();
      intersection.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      for (const t of [a, b]) {
        if (t) {
          gl.deleteTexture(t.texture);
          gl.deleteFramebuffer(t.fbo);
        }
      }
      gl.deleteTexture(wordmarkTexture);
      gl.deleteTexture(textTexture);
      gl.deleteBuffer(quad);
      for (const p of [silk, smoosh, composite, final])
        gl.deleteProgram(p.program);
    };
  }, [enabled, stageRef, copyRef]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="intro-scene"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
