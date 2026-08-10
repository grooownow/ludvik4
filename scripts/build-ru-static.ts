import { spawn } from "node:child_process";
import { cp, mkdir, rename, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const stashRoot = join(root, `.static-export-${process.pid}`);
const ruOnlyPublicRoot = join(root, "resources/ru-public");
const serverOnlyPaths = [
  "src/app/api/auth",
  "src/app/dashboard",
  "src/app/signin",
  "src/app/opengraph-image.tsx",
  "src/app/about",
  "src/app/services",
  "src/app/work",
  "src/middleware.ts",
];

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
