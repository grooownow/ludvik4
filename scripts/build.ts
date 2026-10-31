import { spawn } from "node:child_process";
import path from "node:path";

/**
 * `pnpm build`: `next build`, then the function-size gate. Vercel, CI and the
 * e2e webServer all go through here.
 *
 * Next only WARNS when a dynamic fs path makes it trace the whole project —
 * the exit code stays 0. This wrapper turns that warning into a failure. It
 * is a second line of defence: the wording can change between Next versions,
 * and some leaks produce no warning at all, so the authoritative check is
 * scripts/check-function-traces.ts on the actual trace manifests.
 */

const WHOLE_PROJECT_TRACE_WARNING = /causes tracing of the whole project/i;

export function hasWholeProjectTraceWarning(log: string): boolean {
  return WHOLE_PROJECT_TRACE_WARNING.test(log);
}

function run(command: string, args: string[], capture: boolean) {
  return new Promise<{ code: number; output: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: capture ? ["inherit", "pipe", "pipe"] : "inherit",
      shell: false,
    });
    let output = "";
    child.stdout?.on("data", (chunk: Buffer) => {
      output += chunk.toString();
      process.stdout.write(chunk);
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      output += chunk.toString();
      process.stderr.write(chunk);
    });
    child.once("error", reject);
    child.once("exit", (code) => resolve({ code: code ?? 1, output }));
  });
}

async function main() {
  const build = await run("next", ["build"], true);
  if (build.code !== 0) process.exit(build.code);

  if (hasWholeProjectTraceWarning(build.output)) {
    console.error(
      "\n✗ next build warned that a dynamic filesystem path traces the whole " +
        "project into server functions. Scope the path or mark it " +
        "/*turbopackIgnore: true*/ — see docs/rules/architecture.md.",
    );
    process.exit(1);
  }

  const check = await run(
    "tsx",
    [path.join("scripts", "check-function-traces.ts")],
    false,
  );
  process.exit(check.code);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  void main();
}
