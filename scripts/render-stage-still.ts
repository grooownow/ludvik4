// Renders the exhibit stage at rest into public/stage/*.webp — the first paint
// and the fallback wherever the live scene does not run (phones, touch,
// reduced motion, no GPU). Re-run after changing exhibit-shader.ts:
//   pnpm tsx scripts/render-stage-still.ts
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import {
  EXHIBIT_FRAGMENT,
  EXHIBIT_VERTEX,
  MASCOT_COLOR,
  STAGE_CAMERA,
} from "../src/features/site/exhibit-shader";

const OUT = path.resolve(__dirname, "../public/stage");
// Extreme aspects on purpose: object-cover then scales the wide stills by the
// screen height on every landscape screen and the tall ones by the width on
// every phone — the same side the shader sizes the mascot by (exhibit-art.ts).
const TARGETS = [
  { name: "wide-2880", width: 2880, height: 900 },
  { name: "wide-5760", width: 5760, height: 1800 },
  { name: "tall-780", width: 780, height: 1872 },
  { name: "tall-1560", width: 1560, height: 3744 },
];

// Runs inside the page. Kept as source text: tsx (esbuild) would otherwise
// wrap its inner functions in a `__name` helper the browser does not have.
//
// Two layers per size, so the fallback can rock the mascot alone:
//  - bg: the stage with the mascot hidden but its floor shadow kept (uHide);
//  - mascot: the mascot on transparency. Its alpha comes from how much the
//    full render differs from bg, and its colour is solved so that
//    mascot-over-bg reproduces the full render exactly at rest.
const DRAW_IN_PAGE = `({ target, vertex, fragment, color, camera }) => {
  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;
  const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(program, n);
  const flat = document.createElement("canvas");
  flat.width = target.width;
  flat.height = target.height;
  const ctx = flat.getContext("2d");
  const draw = (hide) => {
    gl.viewport(0, 0, target.width, target.height);
    gl.uniform2f(u("uRes"), target.width, target.height);
    gl.uniform3fv(u("uColor"), color);
    gl.uniform2f(u("uTilt"), 0, 0);
    gl.uniform2f(u("uLag"), 0, 0);
    gl.uniform2f(u("uCam"), camera.yaw, camera.pitch);
    gl.uniform1f(u("uSpin"), 0);
    gl.uniform1f(u("uLite"), 0);
    gl.uniform1f(u("uHide"), hide);
    // Default framing: the phone framing is applied to the stills in CSS.
    gl.uniform1f(u("uZoom"), 1);
    gl.uniform2f(u("uCenter"), 0.5, 0.5);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    ctx.clearRect(0, 0, target.width, target.height);
    ctx.drawImage(canvas, 0, 0);
    return ctx.getImageData(0, 0, target.width, target.height);
  };
  const full = draw(0);
  const bg = draw(1);
  ctx.putImageData(bg, 0, 0);
  const bgUrl = flat.toDataURL("image/webp", 0.9);
  const out = ctx.createImageData(target.width, target.height);
  const a = full.data, b = bg.data, o = out.data;
  for (let i = 0; i < a.length; i += 4) {
    const diff = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
    const alpha = Math.min(1, diff / 48);
    if (alpha <= 0) continue;
    for (let c = 0; c < 3; c++) {
      o[i + c] = Math.max(0, Math.min(255, (a[i + c] - (1 - alpha) * b[i + c]) / alpha));
    }
    o[i + 3] = Math.round(alpha * 255);
  }
  ctx.clearRect(0, 0, target.width, target.height);
  ctx.putImageData(out, 0, 0);
  return { bg: bgUrl, mascot: flat.toDataURL("image/webp", 0.9) };
}`;

async function main() {
  mkdirSync(OUT, { recursive: true });
  // SwiftShader: no GPU needed, and the still is rendered once, not per frame.
  const browser = await chromium.launch({
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage();
  await page.setContent("<body></body>");
  for (const target of TARGETS) {
    const args = {
      target,
      vertex: EXHIBIT_VERTEX,
      fragment: EXHIBIT_FRAGMENT,
      color: MASCOT_COLOR,
      camera: STAGE_CAMERA,
    };
    // One shared canvas: the renders must run one after another.
    // oxlint-disable-next-line no-await-in-loop
    const urls: { bg: string; mascot: string } = await page.evaluate(
      `(${DRAW_IN_PAGE})(${JSON.stringify(args)})`,
    );
    for (const layer of ["bg", "mascot"] as const) {
      const file = path.join(OUT, `stage-${layer}-${target.name}.webp`);
      writeFileSync(file, Buffer.from(urls[layer].split(",")[1]!, "base64"));
      console.log("wrote", path.relative(process.cwd(), file));
    }
  }
  await browser.close();
}

void main();
