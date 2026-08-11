import { describe, expect, it } from "vitest";
import {
  getInternationalGuide,
  getInternationalService,
  internationalGuides,
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

  it("defines one practical decision guide for each service cluster", () => {
    expect(internationalGuides.map((guide) => guide.slug)).toEqual([
      "website-project-brief",
      "automation-priority-scorecard",
      "mvp-scope-one-user-journey",
    ]);
    expect(
      internationalGuides.map((guide) => guide.relatedService.href),
    ).toEqual([
      "/services/websites",
      "/services/workflow-automation",
      "/services/mvp-development",
    ]);
    expect(getInternationalGuide("website-project-brief")?.h1).toContain(
      "website project brief",
    );
    expect(JSON.stringify(internationalGuides)).not.toMatch(
      /\.ru\b|russia|russian|ruble|moscow/i,
    );
  });
});
