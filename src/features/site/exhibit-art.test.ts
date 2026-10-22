import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { STAGE_SOURCES } from "./exhibit-art";

const publicFile = (url: string) =>
  existsSync(new URL(`../../../public${url}`, import.meta.url));

describe("STAGE_SOURCES", () => {
  it("points at stills that exist in public/", () => {
    const urls = [
      ...STAGE_SOURCES.tall.split(", "),
      ...STAGE_SOURCES.desktop.split(", "),
    ].map((entry) => entry.split(" ")[0]!);
    for (const url of [...urls, STAGE_SOURCES.fallback]) {
      expect(publicFile(url), url).toBe(true);
    }
  });
});
