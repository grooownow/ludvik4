import { build } from "esbuild";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

// Bundles the Telegram relay (cloud/telegram-relay/) into a ready-to-deploy
// Vercel project: cloud/telegram-relay/dist/api/telegram.js. Deploy from that
// folder with `vercel deploy --prod`.

const dist = "cloud/telegram-relay/dist";
rmSync(dist, { recursive: true, force: true });
mkdirSync(`${dist}/api`, { recursive: true });

async function main() {
  await build({
    entryPoints: ["cloud/telegram-relay/api/telegram.ts"],
    bundle: true,
    platform: "node",
    target: "node22",
    format: "esm",
    outfile: `${dist}/api/telegram.js`,
    logLevel: "info",
  });
  writeFileSync(
    `${dist}/package.json`,
    `${JSON.stringify({ name: "ludvik4-telegram-relay", private: true, type: "module" }, null, 2)}\n`,
  );
}

void main();
