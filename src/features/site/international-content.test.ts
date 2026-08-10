import { describe, expect, it } from "vitest";
import {
  getInternationalService,
  internationalServicePages,
  internationalWork,
} from "./international-content";

describe("international commercial content", () => {
  it("defines three distinct English service intents", () => {
    expect(internationalServicePages.map((page) => page.slug)).toEqual([
      "websites",
      "workflow-automation",
      "mvp-development",
    ]);
    expect(new Set(internationalServicePages.map((page) => page.h1)).size).toBe(
      3,
    );
    expect(getInternationalService("mvp-development")?.h1).toContain("MVP");
  });

  it("uses only globally suitable proof on the English site", () => {
    expect(internationalWork.map((item) => item.slug)).toEqual(["qa-pilot"]);
    expect(JSON.stringify(internationalWork)).not.toMatch(
      /\.ru\b|russia|russian|kaliningrad|fortnoise/i,
    );
  });
});
