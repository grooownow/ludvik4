import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Function-size gate. Runs after `next build` (see scripts/build.ts) and fails
 * the build when a server function ships files it should not.
 *
 * Why it exists (2026-10-31): `getAllArticles(dir)` read the blog through a
 * path the bundler could not resolve statically, so Turbopack traced the
 * WHOLE repository — docs/, public/, design files, article images — into
 * every blog function. Each deployment carried ~70 MB per blog function,
 * Vercel kept 63 of them, and the Hobby 10 GB Functions Storage limit was
 * blown. `next build` stayed green the whole time. A second leak in the same
 * file — `path.join(CONTENT_DIR, "en")` traced as "any path ending in en"
 * (design.pen, docs/marketing/en/*) — produced NO warning at all. Only a
 * check on what is actually traced catches both, so this is that check.
 *
 * Reads `.next/server/**\/*.nft.json` (Next's per-route trace manifests —
 * the file list Vercel packages into each function).
 */

const MB = 1024 * 1024;

export type TracedFile = { path: string; size: number };
export type FunctionTrace = { route: string; files: TracedFile[] };

export type TracePolicy = {
  /** Project files (outside node_modules and .next) a function may ship. */
  allowedProjectFiles: RegExp[];
  /** Files no function may ship, wherever they live. */
  forbiddenFiles: { pattern: RegExp; reason: string }[];
  defaultBudgetBytes: number;
  /** Per-route budget overrides, keyed by route (e.g. "app/signin/page"). */
  routeBudgetBytes: Record<string, number>;
};

export const policy: TracePolicy = {
  allowedProjectFiles: [
    // Blog articles, read at build time by src/features/blog/articles.ts and
    // pulled in explicitly via outputFileTracingIncludes in next.config.ts.
    /^src\/content\/blog\/(?:en\/)?[^/]+\.mdx$/,
    // Read by src/app/opengraph-image.tsx through a literal path.
    /^public\/hero-product-illustration\.png$/,
  ],
  forbiddenFiles: [
    {
      // Excluded in next.config.ts (outputFileTracingExcludes): Vercel
      // optimizes images on its own side, nothing in src imports sharp.
      // If a Next upgrade silently stops honouring that exclude, this fails.
      pattern: /node_modules\/(?:.*\/)?(?:sharp[@/]|@img[+/])/,
      reason: "sharp/@img must stay excluded (next.config.ts)",
    },
  ],
  defaultBudgetBytes: 15 * MB,
  routeBudgetBytes: {
    // src/db/client.ts imports PGlite (~21 MB WASM + data) statically, so
    // every route that touches the db carries it.
    "app/signin/page": 35 * MB,
    "app/dashboard/page": 35 * MB,
    "app/api/auth/[...nextauth]/route": 35 * MB,
  },
};

function isProjectFile(file: string): boolean {
  return (
    !file.split("/").includes("node_modules") && !file.startsWith(".next/")
  );
}

export function findTraceViolations(
  functions: FunctionTrace[],
  rules: TracePolicy = policy,
): string[] {
  const violations: string[] = [];

  for (const fn of functions) {
    for (const file of fn.files) {
      const forbidden = rules.forbiddenFiles.find(({ pattern }) =>
        pattern.test(file.path),
      );
      if (forbidden) {
        violations.push(
          `${fn.route}: ships ${file.path} — ${forbidden.reason}`,
        );
      } else if (
        isProjectFile(file.path) &&
        !rules.allowedProjectFiles.some((pattern) => pattern.test(file.path))
      ) {
        violations.push(
          `${fn.route}: ships project file ${file.path} — not in the allowlist ` +
            `(dynamic fs path? see docs/rules/architecture.md)`,
        );
      }
    }

    const total = fn.files.reduce((sum, file) => sum + file.size, 0);
    const budget = rules.routeBudgetBytes[fn.route] ?? rules.defaultBudgetBytes;
    if (total > budget) {
      violations.push(
        `${fn.route}: ${(total / MB).toFixed(1)} MB exceeds budget of ` +
          `${(budget / MB).toFixed(0)} MB`,
      );
    }
  }

  return violations;
}

/** Reads every `.nft.json` under `<root>/.next/server`, paths relative to root. */
export function readFunctionTraces(root: string): FunctionTrace[] {
  const serverDir = path.join(root, ".next", "server");
  const manifests = readdirSync(serverDir, {
    recursive: true,
    encoding: "utf8",
  })
    .filter((file) => file.endsWith(".nft.json"))
    .sort();

  return manifests.map((manifest) => {
    const manifestDir = path.dirname(path.join(serverDir, manifest));
    const { files } = JSON.parse(
      readFileSync(path.join(serverDir, manifest), "utf8"),
    ) as { files: string[] };

    const traced: TracedFile[] = [];
    for (const entry of files) {
      const absolute = path.resolve(manifestDir, entry);
      const stats = statSync(absolute, { throwIfNoEntry: false });
      if (!stats?.isFile()) continue;
      traced.push({
        path: path.relative(root, absolute).split(path.sep).join("/"),
        size: stats.size,
      });
    }

    return {
      route: manifest
        .replace(/\.js\.nft\.json$/, "")
        .split(path.sep)
        .join("/"),
      files: traced,
    };
  });
}

function main() {
  const functions = readFunctionTraces(process.cwd());
  if (functions.length === 0) {
    console.error(
      "check-function-traces: no .nft.json found — run next build first",
    );
    process.exit(1);
  }

  const violations = findTraceViolations(functions);
  if (violations.length > 0) {
    // A whole-project leak yields thousands of lines; show a few per route.
    const byRoute = new Map<string, string[]>();
    for (const line of violations) {
      const route = line.slice(0, line.indexOf(": "));
      byRoute.set(route, [...(byRoute.get(route) ?? []), line]);
    }
    const report = [...byRoute.values()].flatMap((lines) => [
      ...lines.slice(0, 3).map((line) => `  - ${line}`),
      ...(lines.length > 3 ? [`    …and ${lines.length - 3} more`] : []),
    ]);
    console.error(
      `\n✗ Function trace check failed: ${violations.length} violations in ` +
        `${byRoute.size} functions\n${report.join("\n")}`,
    );
    process.exit(1);
  }

  const largest = Math.max(
    ...functions.map((fn) => fn.files.reduce((sum, f) => sum + f.size, 0)),
  );
  console.log(
    `✓ Function traces OK: ${functions.length} functions, largest ${(largest / MB).toFixed(1)} MB`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  main();
}
