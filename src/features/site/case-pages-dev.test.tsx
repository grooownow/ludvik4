import { existsSync } from "node:fs";
import { join } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseStudyPageView, CasesIndexView } from "./case-pages";
import {
  DEV_CASE_SLUGS,
  devRuCaseSite,
  enCaseSite,
  esCaseSite,
  getCaseGallery,
} from "./case-sites";

// ludvik4.dev's works gallery: the RU layout with English texts and screens
// on /work, Spanish on /es/work, Russian on /ru/work, FortNoise on none.
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
    expect(getCaseGallery(esCaseSite, "fortnoise")).toBeUndefined();
  });

  it.each([
    ["en", enCaseSite],
    ["es", esCaseSite],
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

  it("writes the Spanish texts in Spanish, with Spanish screens", () => {
    for (const slug of DEV_CASE_SLUGS) {
      const g = esCaseSite.galleries[slug]!;
      const en = enCaseSite.galleries[slug]!;
      const texts = [
        g.kind,
        g.line,
        g.lead,
        g.task,
        g.result,
        g.note ?? "",
        g.websiteLabel ?? "",
        ...g.points.flatMap((p) => [p.title, p.text]),
      ];
      for (const t of texts) {
        expect(t, `${slug}: ${t}`).not.toMatch(CYRILLIC);
        // Translated, not copied from the English page.
        expect([en.line, en.lead, en.task, en.result], slug).not.toContain(t);
      }
      // qa-pilot has only an English landing: its English screens.
      const dir = slug === "qa-pilot" ? "en" : "es";
      for (const s of g.screens) {
        expect(s.full.src, slug).toMatch(new RegExp(`^/cases/${slug}/${dir}/`));
      }
    }
  });

  it("shapes every Spanish case like the English one: same screens, same sizes", () => {
    const widths = (img?: { width: number }) => img?.width;
    for (const slug of DEV_CASE_SLUGS) {
      const g = esCaseSite.galleries[slug]!;
      const en = enCaseSite.galleries[slug]!;
      expect(g.layout, slug).toBe(en.layout);
      expect(g.strip, slug).toEqual(en.strip);
      expect(g.cover, slug).toEqual(en.cover);
      expect(
        g.points.map((p) => p.screens),
        slug,
      ).toEqual(en.points.map((p) => p.screens));
      expect(g.screens, slug).toHaveLength(en.screens.length);
      g.screens.forEach((s, i) => {
        const e = en.screens[i]!;
        const at = `${slug} #${i}`;
        expect(s.kind, at).toBe(e.kind);
        expect(Boolean(s.openWhole), at).toBe(Boolean(e.openWhole));
        for (const k of [
          "full",
          "thumb",
          "stripThumb",
          "squareThumb",
          "longThumb",
        ] as const) {
          expect(widths(s[k]), `${at} ${k}`).toBe(widths(e[k]));
        }
      });
    }
  });

  it("links the Spanish pages to the Spanish landings where they exist", () => {
    expect(esCaseSite.galleries.smallfriendfiles!.website).toBe(
      "https://smallfriendfiles.fyi/es",
    );
    expect(esCaseSite.galleries.gridfin!.website).toBe(
      "https://ludvik4.dev/gridfin/es",
    );
    // No live link: a real game runs on Secret Santa.
    expect(esCaseSite.galleries["secret-santa"]!.website).toBeUndefined();
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

describe("/work gallery: Gridfin opens whole", () => {
  // Fitted = the whole page on screen; at width = cropped, scrolls.
  const fitted = (img: HTMLElement) => img.classList.contains("max-h-full");

  it.each([
    ["Open: Landing, desktop", "Landing"],
    ["Open: Landing, mobile", "Landing"],
  ])("%s opens fitted and zooms on a click", (name, alt) => {
    render(<CasesIndexView site={enCaseSite} baseUrl={BASE} />);
    const row = screen
      .getByRole("heading", { name: "Gridfin" })
      .closest("section")!;
    fireEvent.click(within(row).getByRole("button", { name }));
    const img = () =>
      within(screen.getByRole("dialog")).getByRole("img", { name: alt });
    expect(fitted(img())).toBe(true);
    fireEvent.click(img());
    expect(fitted(img())).toBe(false);
  });

  it("leaves the other tall pages opening at width", () => {
    render(<CasesIndexView site={enCaseSite} baseUrl={BASE} />);
    const row = screen
      .getByRole("heading", { name: "Secret Santa" })
      .closest("section")!;
    fireEvent.click(
      within(row).getByRole("button", { name: "Open: Promo page, mobile" }),
    );
    const img = within(screen.getByRole("dialog")).getByRole("img", {
      name: "Promo page",
    });
    expect(fitted(img)).toBe(false);
  });
});

describe("/es/work (ludvik4.dev in Spanish)", () => {
  it("lists the four works with Spanish chrome and /es links", () => {
    render(<CasesIndexView site={esCaseSite} baseUrl={BASE} />);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual(["smallFriendFiles", "Gridfin", "Secret Santa", "qa-pilot"]);
    expect(
      screen
        .getAllByRole("link", { name: "Sobre el proyecto →" })
        .map((a) => a.getAttribute("href")),
    ).toEqual([
      "/es/work/smallfriendfiles",
      "/es/work/gridfin",
      "/es/work/secret-santa",
      "/es/work/qa-pilot",
    ]);
    expect(
      screen.getByRole("link", { name: /Las 14\spantallas/ }),
    ).toHaveAttribute("href", "/es/work/smallfriendfiles");
    expect(screen.getByRole("main").textContent).not.toMatch(CYRILLIC);
  });

  it("tells a case in Spanish and opens the gallery with Spanish labels", () => {
    render(
      <CaseStudyPageView
        site={esCaseSite}
        slug="secret-santa"
        baseUrl={BASE}
      />,
    );
    const crumbs = screen.getByRole("navigation", {
      name: "Ruta de navegación",
    });
    expect(
      within(crumbs).getByRole("link", { name: "Inicio" }),
    ).toHaveAttribute("href", "/es");
    expect(
      within(crumbs).getByRole("link", { name: "Proyectos" }),
    ).toHaveAttribute("href", "/es/work");
    expect(
      screen.getByRole("heading", { name: "Pantallas y funciones" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Hablar del proyecto" }),
    ).toHaveAttribute("href", "/es/contact");
    expect(screen.getByRole("main").textContent).not.toMatch(CYRILLIC);

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Abrir: Muro de agradecimientos, móvil",
      })[0]!,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAccessibleName("Muro de agradecimientos · móvil");
    expect(
      within(dialog).getByRole("button", { name: "Cerrar" }),
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
