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
      "smallfriendfiles",
      "fortnoise",
      "gridfin",
      "qa-pilot",
    ]);
    expect(getCaseStudy("fortnoise")?.kind).toBe("Клиентский проект");
    expect(getCaseStudy("gridfin")?.kind).toBe("Скелет приложения");
    expect(getCaseStudy("qa-pilot")?.kind).toBe("AI-плагин");
  });

  it("links the gridfin case to the live landing", () => {
    expect(getCaseStudy("gridfin")?.website).toBe(
      "https://ludvik4.ru/gridfin/",
    );
    expect(getCaseStudy("gridfin")?.image).toBe("/cases/gridfin.webp");
  });

  it("links the qa-pilot case to its landing on ludvik4.ru", () => {
    expect(getCaseStudy("qa-pilot")?.website).toBe(
      "https://ludvik4.ru/qa-pilot/",
    );
    expect(getCaseStudy("qa-pilot")?.image).toBe("/cases/qa-pilot-ru.webp");
  });
});
