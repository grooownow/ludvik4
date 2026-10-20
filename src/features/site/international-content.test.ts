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
    expect(internationalWork.map((item) => item.slug)).toEqual([
      "smallfriendfiles",
      "gridfin",
      "qa-pilot",
    ]);
    const gridfin = internationalWork.find((item) => item.slug === "gridfin");
    const qaPilot = internationalWork.find((item) => item.slug === "qa-pilot");
    expect(gridfin?.kind).toBe("Application skeleton");
    expect(qaPilot?.kind).toBe("AI plugin");
    expect(gridfin?.cardLink).toEqual({
      href: "/gridfin/en",
      label: "View Gridfin landing",
      newTab: true,
    });
    expect(qaPilot?.description).toContain("An AI plugin");
    expect(qaPilot?.description).not.toContain("Codex plugin");
    expect(gridfin?.image).toBe("/cases/gridfin-en.webp");
    expect(gridfin?.image).not.toBe("/cases/gridfin.webp");
    // qa-pilot keeps its /work case page; the page links to the EN landing.
    expect(qaPilot?.cardLink).toBeUndefined();
    expect(qaPilot?.website).toBe("https://ludvik4.dev/qa-pilot");
    expect(qaPilot?.websiteLabel).toBe("View qa-pilot landing");
    expect(qaPilot?.image).toBe("/cases/qa-pilot-en.webp");
    // Supported interface languages are product capabilities, not market proof.
    expect(
      JSON.stringify(internationalWork).replace(
        "English, Spanish, Ukrainian and Russian",
        "supported interface languages",
      ),
    ).not.toMatch(/\.ru\b|russia|russian|kaliningrad|fortnoise/i);
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
