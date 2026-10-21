"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import {
  FRAGMENT_SHADER,
  VERTEX_SHADER,
  dropRadius,
  shouldEnableDrop,
} from "./cursor-drop-shader";

type Props = {
  /** The intro <img>; its current frame is the texture the drop refracts. */
  imageRef: RefObject<HTMLImageElement | null>;
  /** The element whose pointer movement the drop follows. */
  stageRef: RefObject<HTMLElement | null>;
  tint: [number, number, number];
  /** Bumped by the parent when the artwork changes, to re-upload the texture. */
  imageKey: string;
};

// Where the drop rests when the cursor is outside the stage (0..1, top-left).
const IDLE = { x: 0.7, y: 0.42 };

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

function createProgram(gl: WebGLRenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/**
 * A liquid-glass drop that follows the cursor over the intro artwork.
 * Renders nothing until it knows the device can show it (see
 * `shouldEnableDrop`), so the server HTML and every fallback is the plain
 * <img>.
 */
export function CursorDrop({ imageRef, stageRef, tint, imageKey }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  const tintRef = useRef(tint);
  tintRef.current = tint;
  const textureDirty = useRef(true);

  useEffect(() => {
    const finePointer = matches("(hover: hover) and (pointer: fine)");
    const reducedMotion = matches("(prefers-reduced-motion: reduce)");
    // Probe WebGL only when the rest already allows the drop: phones never
    // pay for a throwaway context.
    let webgl = false;
    if (finePointer && !reducedMotion) {
      try {
        webgl = Boolean(document.createElement("canvas").getContext("webgl"));
      } catch {
        webgl = false;
      }
    }
    setEnabled(shouldEnableDrop({ finePointer, reducedMotion, webgl }));
  }, []);

  useEffect(() => {
    textureDirty.current = true;
  }, [imageKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!enabled || !canvas || !stage) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true });
    const program = gl && createProgram(gl);
    if (!gl || !program) {
      setEnabled(false);
      return;
    }

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uResolution = u("u_resolution");
    const uTexSize = u("u_texSize");
    const uCenter = u("u_center");
    const uTime = u("u_time");
    const uRadius = u("u_radius");
    const uTint = u("u_tint");

    let dpr = 1;
    let width = 0;
    let height = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = stage.clientWidth;
      height = stage.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    // Positions in CSS px, top-left origin.
    const current = { x: width * IDLE.x, y: height * IDLE.y };
    let target = { ...current };
    let hovering = false;

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      target = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    intersection.observe(stage);

    let frame = 0;
    const start = performance.now();
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const image = imageRef.current;
      if (!visible || document.hidden || !image?.complete) return;
      if (!image.naturalWidth) return;

      if (textureDirty.current) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image,
        );
        gl.uniform2f(uTexSize, image.naturalWidth, image.naturalHeight);
        textureDirty.current = false;
      }

      const goal = hovering
        ? target
        : { x: width * IDLE.x, y: height * IDLE.y };
      current.x += (goal.x - current.x) * 0.12;
      current.y += (goal.y - current.y) * 0.12;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uCenter, current.x * dpr, (height - current.y) * dpr);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uRadius, dropRadius(width) * dpr);
      gl.uniform3f(uTint, ...tintRef.current);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [enabled, imageRef, stageRef]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="cursor-drop"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
