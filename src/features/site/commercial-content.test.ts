import { describe, expect, it } from "vitest";
import {
  caseStudies,
  getCaseStudy,
  getServicePage,
  servicePages,
} from "./commercial-content";

describe("commercial content", () => {
  it("defines three distinct service landing pages", () => {
    expect(servicePages.map((page) => page.slug)).toEqual([
      "razrabotka-lendinga",
      "avtomatizatsiya-biznes-processov",
      "razrabotka-mvp",
    ]);
    expect(new Set(servicePages.map((page) => page.title)).size).toBe(3);
    expect(getServicePage("razrabotka-mvp")?.price).toContain("110 000");
  });

  it("keeps client work and own products clearly labelled", () => {
    expect(caseStudies.map((item) => item.slug)).toEqual([
      "fortnoise",
      "qa-pilot",
    ]);
    expect(getCaseStudy("fortnoise")?.kind).toBe("Клиентский проект");
    expect(getCaseStudy("qa-pilot")?.kind).toBe("Собственный продукт");
  });
});
