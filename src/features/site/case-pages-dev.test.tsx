import { existsSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseStudyPageView, CasesIndexView } from "./case-pages";
import {
  DEV_CASE_SLUGS,
  devRuCaseSite,
  enCaseSite,
  getCaseGallery,
} from "./case-sites";

// ludvik4.dev's works gallery: the RU layout with English texts and screens
// on /work, Russian on /ru/work, FortNoise on neither.
const BASE = "https://ludvik4.dev";
const CYRILLIC = /[А-Яа-яЁё]/;

describe("ludvik4.dev case data", () => {
  it("shows the four RU works without FortNoise, in the RU order", () => {
    expect(DEV_CASE_SLUGS).toEqual([
      "smallfriendfiles",
      "gridfin",
      "secret-santa",
      "qa-pilot",
    ]);
    expect(getCaseGallery(enCaseSite, "fortnoise")).toBeUndefined();
    expect(getCaseGallery(devRuCaseSite, "fortnoise")).toBeUndefined();
  });

  it.each([
    ["en", enCaseSite],
    ["ru", devRuCaseSite],
  ])("%s: every reference resolves and every file ships", (_, site) => {
    for (const slug of site.slugs) {
      const g = site.galleries[slug]!;
      const n = g.screens.length;
      for (const i of [
        ...g.strip,
        g.cover.desktop,
        ...(g.cover.mobile != null ? [g.cover.mobile] : []),
        ...g.points.flatMap((p) => p.screens),
      ]) {
        expect(i, `${slug}: screen ${i}`).toBeLessThan(n);
      }
      for (const s of g.screens) {
        for (const img of [
          s.full,
          s.thumb,
          s.stripThumb,
          s.squareThumb,
          s.longThumb,
        ]) {
          if (!img) continue;
          expect(
            existsSync(join(process.cwd(), "public", img.src)),
            img.src,
          ).toBe(true);
        }
      }
    }
  });

  it("writes the English texts and screens in English", () => {
    for (const slug of DEV_CASE_SLUGS) {
      const g = enCaseSite.galleries[slug]!;
      const texts = [
        g.title,
        g.kind,
        g.line,
        g.lead,
        g.task,
        g.result,
        g.note ?? "",
        g.websiteLabel ?? "",
        ...g.stack,
        ...g.points.flatMap((p) => [p.title, p.text]),
        ...g.screens.map((s) => s.caption),
      ];
      for (const t of texts) expect(t, `${slug}: ${t}`).not.toMatch(CYRILLIC);
      for (const s of g.screens) {
        expect(s.full.src, slug).toMatch(new RegExp(`^/cases/${slug}/en/`));
      }
    }
  });

  it("links the .dev Russian pages to the .dev landings, never to ludvik4.ru", () => {
    for (const slug of DEV_CASE_SLUGS) {
      const site = devRuCaseSite.galleries[slug]!.website;
      if (site) expect(site, slug).not.toContain("ludvik4.ru");
    }
    expect(devRuCaseSite.galleries.gridfin!.website).toBe(
      "https://ludvik4.dev/gridfin/en",
    );
  });
});

describe("/work (English)", () => {
  it("lists the four works with English chrome and /work links", () => {
    render(<CasesIndexView site={enCaseSite} baseUrl={BASE} />);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["smallFriendFiles", "Gridfin", "Secret Santa", "qa-pilot"]);
    expect(
      screen
        .getAllByRole("link", { name: "About the project →" })
        .map((a) => a.getAttribute("href")),
    ).toEqual([
      "/work/smallfriendfiles",
      "/work/gridfin",
      "/work/secret-santa",
      "/work/qa-pilot",
    ]);
    expect(
      screen.getByRole("link", { name: /All 14 screens/ }),
    ).toHaveAttribute("href", "/work/smallfriendfiles");
    // The header's language switch names "Русский" by design.
    expect(screen.getByRole("main").textContent).not.toMatch(CYRILLIC);
  });

  it("tells a case in English and opens the gallery with English labels", () => {
    render(
      <CaseStudyPageView
        site={enCaseSite}
        slug="secret-santa"
        baseUrl={BASE}
      />,
    );
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    expect(within(crumbs).getByRole("link", { name: "Work" })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(
      screen.getByRole("heading", { name: "Screens and features" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Discuss a project" }),
    ).toHaveAttribute("href", "/contact");
    // No live link: a real game runs on Secret Santa.
    expect(
      screen.queryByRole("link", { name: /Open/ }),
    ).not.toBeInTheDocument();
    // The header's language switch names "Русский" by design.
    expect(screen.getByRole("main").textContent).not.toMatch(CYRILLIC);

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Open: Thank-you wall, mobile",
      })[0]!,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAccessibleName("Thank-you wall · mobile");
    expect(
      within(dialog).getByRole("button", { name: "Close" }),
    ).toBeInTheDocument();
  });
});

describe("/ru/work (ludvik4.dev in Russian)", () => {
  it("keeps the Russian texts and the /ru prefix", () => {
    render(<CasesIndexView site={devRuCaseSite} baseUrl={BASE} />);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["smallFriendFiles", "Gridfin", "Тайный Санта", "qa-pilot"]);
    expect(
      screen
        .getAllByRole("link", { name: "Подробнее о проекте →" })
        .map((a) => a.getAttribute("href")),
    ).toEqual([
      "/ru/work/smallfriendfiles",
      "/ru/work/gridfin",
      "/ru/work/secret-santa",
      "/ru/work/qa-pilot",
    ]);
  });

  it("leads the breadcrumbs and the call to action to the /ru pages", () => {
    render(
      <CaseStudyPageView site={devRuCaseSite} slug="gridfin" baseUrl={BASE} />,
    );
    const crumbs = screen.getByRole("navigation", { name: "Хлебные крошки" });
    expect(
      within(crumbs).getByRole("link", { name: "Главная" }),
    ).toHaveAttribute("href", "/ru");
    expect(
      within(crumbs).getByRole("link", { name: "Работы" }),
    ).toHaveAttribute("href", "/ru/work");
    expect(
      screen.getByRole("link", { name: "Обсудить задачу" }),
    ).toHaveAttribute("href", "/ru/contact");
  });
});
