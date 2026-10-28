import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

// Bundles the order function (cloud/order-function/) into one file with its
// dependencies (zod, nodemailer) and zips it for Yandex Cloud Functions.
// Output: cloud/order-function/dist/order-function.zip.

const dist = "cloud/order-function/dist";
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

async function main() {
  await build({
    entryPoints: ["cloud/order-function/index.ts"],
    bundle: true,
    platform: "node",
    target: "node22",
    format: "cjs",
    outfile: `${dist}/index.js`,
    logLevel: "info",
  });

  execFileSync("zip", ["-j", "order-function.zip", "index.js"], {
    cwd: dist,
    stdio: "inherit",
  });
}

void main();
