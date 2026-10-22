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
const TARGETS = [
  { name: "stage-1440", width: 1440, height: 900 },
  { name: "stage-2880", width: 2880, height: 1800 },
  { name: "stage-tall-780", width: 780, height: 1560 },
  { name: "stage-tall-1560", width: 1560, height: 3120 },
];

// Runs inside the page. Kept as source text: tsx (esbuild) would otherwise
// wrap its inner functions in a `__name` helper the browser does not have.
const DRAW_IN_PAGE = `({ target, vertex, fragment, color, camera }) => {
  const canvas = document.querySelector("canvas");
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
  gl.viewport(0, 0, target.width, target.height);
  gl.uniform2f(u("uRes"), target.width, target.height);
  gl.uniform3fv(u("uColor"), color);
  gl.uniform2f(u("uTilt"), 0, 0);
  gl.uniform2f(u("uLag"), 0, 0);
  gl.uniform2f(u("uCam"), camera.yaw, camera.pitch);
  gl.uniform1f(u("uSpin"), 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  return canvas.toDataURL("image/webp", 0.9);
}`;

async function main() {
  mkdirSync(OUT, { recursive: true });
  // SwiftShader: no GPU needed, and the still is rendered once, not per frame.
  const browser = await chromium.launch({
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage();
  await page.setContent("<canvas></canvas>");
  for (const target of TARGETS) {
    const args = {
      target,
      vertex: EXHIBIT_VERTEX,
      fragment: EXHIBIT_FRAGMENT,
      color: MASCOT_COLOR,
      camera: STAGE_CAMERA,
    };
    const dataUrl: string = await page.evaluate(
      `(${DRAW_IN_PAGE})(${JSON.stringify(args)})`,
    );
    const file = path.join(OUT, `${target.name}.webp`);
    writeFileSync(file, Buffer.from(dataUrl.split(",")[1]!, "base64"));
    console.log("wrote", path.relative(process.cwd(), file));
  }
  await browser.close();
}

void main();
