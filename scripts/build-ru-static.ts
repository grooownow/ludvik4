import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, rename, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const stashRoot = join(root, `.static-export-${process.pid}`);
const ruOnlyPublicRoot = join(root, "resources/ru-public");
const serverOnlyPaths = [
  "src/app/api/auth",
  "src/app/api/gridfin-lead",
  "src/app/dashboard",
  "src/app/signin",
  "src/app/opengraph-image.tsx",
  "src/app/about",
  "src/app/guides",
  "src/app/services",
  "src/app/work",
  "src/middleware.ts",
  // The international Gridfin bundle (EN first; reviewed locales may follow), served by
  // the EN Vercel app. Left in place, `next export` would copy it into out/
  // and the RU-bundle cp below would merge over it. Stash it like the
  // server-only routes so only the RU bundle is copied to ludvik4.ru.
  "public/gridfin",
];

// Paths that may legitimately be absent. Both gridfin surfaces land only
// with the EN publication round (ADR 0005): the bundle and its same-origin
// lead route are being built in a parallel working tree, so main can hold
// the stash entries before the paths exist. A missing CORE server-only
// route, by contrast, means the tree is broken and MUST fail loudly, so
// the skip is not blanket.
const optionalPaths = new Set(["public/gridfin", "src/app/api/gridfin-lead"]);

async function move(source: string, destination: string) {
  try {
    await rename(source, destination);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !("code" in error) ||
      error.code !== "EXDEV"
    ) {
      throw error;
    }

    await cp(source, destination, { recursive: true });
    await rm(source, { recursive: true, force: true });
  }
}

async function runBuild(): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn("next", ["build"], {
      stdio: "inherit",
      shell: false,
      env: {
        ...process.env,
        STATIC_EXPORT: "true",
        SITE_MARKET: "ru",
        NEXT_PUBLIC_APP_URL:
          process.env.NEXT_PUBLIC_APP_URL ?? "https://ludvik4.ru",
      },
    });
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
}

async function main() {
  const moved: Array<{ source: string; stash: string }> = [];

  try {
    for (const relativePath of serverOnlyPaths) {
      const source = join(root, relativePath);
      if (optionalPaths.has(relativePath) && !existsSync(source)) {
        continue;
      }
      const stash = join(stashRoot, relativePath);
      await mkdir(dirname(stash), { recursive: true });
      await move(source, stash);
      moved.push({ source, stash });
    }

    process.exitCode = await runBuild();
    if (process.exitCode === 0) {
      await cp(join(ruOnlyPublicRoot, "gridfin"), join(root, "out/gridfin"), {
        recursive: true,
      });
    }
  } finally {
    await Promise.all(
      moved.map(async ({ source, stash }) => {
        await mkdir(dirname(source), { recursive: true });
        await move(stash, source);
      }),
    );
    await rm(stashRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(
    `RU static build failed: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
