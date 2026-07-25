import { spawn } from "node:child_process";
import { mkdir, rename, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const stashRoot = join(root, `.static-export-${process.pid}`);
const serverOnlyPaths = [
  "src/app/api/auth",
  "src/app/dashboard",
  "src/app/signin",
  "src/middleware.ts",
];

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
  let moved: Array<{ source: string; stash: string }> = [];

  try {
    moved = await Promise.all(
      serverOnlyPaths.map(async (relativePath) => {
        const source = join(root, relativePath);
        const stash = join(stashRoot, relativePath);
        await mkdir(dirname(stash), { recursive: true });
        await rename(source, stash);
        return { source, stash };
      }),
    );

    process.exitCode = await runBuild();
  } finally {
    await Promise.all(
      moved.map(async ({ source, stash }) => {
        await mkdir(dirname(source), { recursive: true });
        await rename(stash, source);
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
