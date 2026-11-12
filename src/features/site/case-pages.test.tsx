import { existsSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { caseGalleries } from "./case-gallery";
import { CaseStudyPageView, CasesIndexView, screenCount } from "./case-pages";
import { caseStudies, getCaseStudy } from "./commercial-content";
import { homeExhibits } from "./home-exhibits";

const BASE = "https://ludvik4.ru";
const page = (slug: string) =>
  render(<CaseStudyPageView study={getCaseStudy(slug)!} baseUrl={BASE} />);

describe("case gallery data", () => {
  it("has a gallery for every case study and every reference resolves", () => {
    for (const study of caseStudies) {
      const g = caseGalleries[study.slug];
      const n = g.screens.length;
      const refs = [
        ...g.strip,
        g.cover.desktop,
        ...(g.cover.mobile != null ? [g.cover.mobile] : []),
        ...g.points.flatMap((p) => p.screens),
      ];
      for (const i of refs) {
        expect(i, `${study.slug}: screen ${i}`).toBeGreaterThanOrEqual(0);
        expect(i, `${study.slug}: screen ${i}`).toBeLessThan(n);
      }
      expect(g.screens[g.cover.desktop]?.kind).toBe("desktop");
      // A point row shows at most one desktop.
      for (const p of g.points) {
        const desktops = p.screens.filter(
          (i) => g.screens[i]?.kind === "desktop",
        );
        expect(desktops.length, `${study.slug}: ${p.title}`).toBeLessThan(2);
      }
    }
  });

  it("ships every referenced image file", () => {
    for (const g of Object.values(caseGalleries)) {
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
});

describe("screenCount", () => {
  it("uses the Russian plural forms", () => {
    expect(screenCount(1)).toBe("1 экран");
    expect(screenCount(2)).toBe("2 экрана");
    expect(screenCount(11)).toBe("11 экранов");
    expect(screenCount(14)).toBe("14 экранов");
    expect(screenCount(22)).toBe("22 экрана");
  });
});

describe("CasesIndexView", () => {
  it("lists all five works in order, qa-pilot last", () => {
    render(<CasesIndexView baseUrl={BASE} />);
    const titles = screen
      .getAllByRole("heading", { level: 2 })
      .map((h) => h.textContent);
    expect(titles).toEqual([
      "smallFriendFiles",
      "FortNoise",
      "Gridfin",
      "Тайный Санта",
      "qa-pilot",
    ]);
  });

  it("shows the «Все N экранов» tile only when the strip hides screens", () => {
    render(<CasesIndexView baseUrl={BASE} />);
    // smallFriendFiles and FortNoise: part of 14 in the strip; Gridfin: all 3.
    expect(
      screen
        .getAllByRole("link", { name: /Все 14\u00a0экранов/ })
        .map((a) => a.getAttribute("href")),
    ).toEqual(["/cases/smallfriendfiles", "/cases/fortnoise"]);
    expect(
      screen.queryByRole("link", { name: /Все 3 экрана/ }),
    ).not.toBeInTheDocument();
  });
});

describe("CaseStudyPageView", () => {
  it("opens the live project in a new tab", () => {
    page("fortnoise");
    const link = screen.getByRole("link", { name: /Открыть проект/ });
    expect(link).toHaveAttribute("href", "https://fn39.ru");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has no live link for Secret Santa (a live game runs there)", () => {
    page("secret-santa");
    expect(
      screen.queryByRole("link", { name: /Открыть/ }),
    ).not.toBeInTheDocument();
  });

  it("links the breadcrumbs to the home and the works list", () => {
    page("gridfin");
    const crumbs = screen.getByRole("navigation", { name: "Хлебные крошки" });
    expect(
      within(crumbs).getByRole("link", { name: "Главная" }),
    ).toHaveAttribute("href", "/");
    expect(
      within(crumbs).getByRole("link", { name: "Работы" }),
    ).toHaveAttribute("href", "/cases");
  });

  it("tells every point of the story layout with its screens", () => {
    page("fortnoise");
    for (const p of caseGalleries.fortnoise.points) {
      expect(screen.getAllByText(p.title).length).toBeGreaterThan(0);
    }
    expect(
      screen.getByRole("heading", { name: "Все экраны" }),
    ).toBeInTheDocument();
  });

  it("hides the «Все экраны» strip on the landing and brief layouts", () => {
    page("qa-pilot");
    expect(
      screen.queryByRole("heading", { name: "Все экраны" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Что внутри" }),
    ).toBeInTheDocument();
  });
});

describe("screen gallery", () => {
  it("opens a screen, pages with the arrow keys and closes on Escape, returning focus", () => {
    page("fortnoise");
    // The first one is in the «Все экраны» strip, the second in the point row.
    const opener = screen.getAllByRole("button", {
      name: "Открыть: Карта, десктоп",
    })[1]!;
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAccessibleName("Карта · десктоп");
    expect(within(dialog).getByText("3 / 14")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(screen.getByRole("dialog")).toHaveAccessibleName(
      "Карта · мобильная",
    );
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(screen.getByRole("dialog")).toHaveAccessibleName(
      "Афиша · мобильная",
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it("closes on a click outside the picture but not on the picture", () => {
    page("gridfin");
    fireEvent.click(
      screen.getAllByRole("button", { name: /Открыть: Лендинг, десктоп/ })[0]!,
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("img", { name: "Лендинг" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("wraps around from the last screen to the first", () => {
    page("qa-pilot");
    fireEvent.click(
      screen.getByRole("button", { name: "Открыть: Первый экран, мобильная" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Следующий экран" }));
    expect(
      within(screen.getByRole("dialog")).getByText("1 / 2"),
    ).toBeInTheDocument();
  });
});

describe("home exhibits", () => {
  it("keep their four works — Secret Santa is only on /cases", () => {
    expect(homeExhibits("ru").map((e) => e.slug)).toEqual([
      "smallfriendfiles",
      "fortnoise",
      "gridfin",
      "qa-pilot",
    ]);
  });
});
