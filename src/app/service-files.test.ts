import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function readPublicFile(filePath: string): string {
  return readFileSync(path.join(process.cwd(), "public", filePath), "utf8");
}

describe("static SEO service files", () => {
  it("publishes humans.txt with source identity and discovery links", () => {
    const body = readPublicFile("humans.txt");

    expect(body).toContain("Owner: Ludvik4");
    expect(body).toContain("Site: https://ludvik4.ru/");
    expect(body).toContain("Sitemap: https://ludvik4.ru/sitemap.xml");
    expect(body).toContain("LLM overview: https://ludvik4.ru/llms.txt");
    expect(body).not.toContain("<html");
  });

  it("publishes security.txt at the root and the well-known canonical path", () => {
    const root = readPublicFile("security.txt");
    const wellKnown = readPublicFile(".well-known/security.txt");

    expect(root).toBe(wellKnown);
    expect(root).toContain("Contact: https://t.me/ludvik4work");
    expect(root).toContain(
      "Canonical: https://ludvik4.ru/.well-known/security.txt",
    );
    expect(root).not.toContain("<html");
  });

  it("publishes explicit ads inventory declarations instead of HTML fallbacks", () => {
    expect(readPublicFile("ads.txt")).toContain(
      "does not sell authorized digital advertising inventory",
    );
    expect(readPublicFile("app-ads.txt")).toContain(
      "does not operate an app with authorized digital advertising inventory",
    );
  });
});
