import { describe, expect, it } from "vitest";
import {
  getMarketContent,
  mascotExhibitNumber,
  workExhibitNumber,
} from "./content";
import { buildHomeJsonLd, buildSiteMetadata } from "./seo";

const RU_BASE = "https://ludvik4.ru";
const EN_BASE = "https://ludvik4.example";

// The old, now-forbidden "permanent team" claim fragments (brief §Позиционирование).
const TEAM_CLAIM = /ML-инженер|команда: разработчики|команда разработчиков/;

describe("market content", () => {
  it("RU is the independent-developer positioning with exactly three services", () => {
    const ru = getMarketContent("ru");
    expect(ru.lang).toBe("ru");
    expect(ru.services.items).toHaveLength(3);
    expect(ru.services.items.map((s) => s.title)).toEqual([
      "Сайт или лендинг",
      "Автоматизация бизнес-процессов",
      "Веб-приложение или компактный SaaS",
    ]);
    // Exhibition home (docs/specs/immersive-home.md): same menu as EN, translated.
    expect(ru.nav.links).toEqual([
      { href: "/#work", label: "Работы" },
      { href: "/#collection", label: "Услуги" },
      { href: "/about", label: "Обо мне" },
    ]);
    expect(ru.nav.cta).toBe("Контакты");
    expect(ru.description).toContain("Сайты, автоматизации и веб-приложения");
    expect(ru.hero.lead).not.toMatch(/проектируем|предлагаем|поможем/i);
    expect(ru.about?.body).not.toMatch(TEAM_CLAIM);
  });

  it("EN is the founder-led studio, first person, with three services", () => {
    const en = getMarketContent("en");
    expect(en.lang).toBe("en");
    expect(en.services.items).toHaveLength(3);
    expect(en.description).toContain("founder-led web product studio");
    expect(en.hero.lead).toMatch(/^I turn/);
    expect(en.howItWorks?.steps).toHaveLength(3);
    expect(en.scopes?.items).toHaveLength(3);
    expect(en.pricing).toBeUndefined();
    // EN keeps the lead form; RU does not.
    expect(en.contact.form).toBeDefined();
    expect(getMarketContent("ru").contact.form).toBeUndefined();
    expect(en.nav.links).toEqual([
      { href: "/#work", label: "Work" },
      { href: "/#collection", label: "Services" },
      { href: "/guides", label: "Guides" },
      { href: "/about", label: "About" },
    ]);
    expect(en.nav.cta).toBe("Contact");
  });
});

describe("exhibition home content", () => {
  it.each(["ru", "en"] as const)(
    "%s has six halls, three steps and a hidden H1",
    (market) => {
      const { home, h1, hero } = getMarketContent(market);
      expect(home.collection.halls).toHaveLength(6);
      expect(home.steps.items).toHaveLength(3);
      expect(h1).toBe(hero.title);
      expect(home.collection.title).toHaveLength(2);
    },
  );

  it("EN uses the approved exhibit and section copy verbatim", () => {
    const { home } = getMarketContent("en");
    expect(home.exhibit).toEqual({
      eyebrow: "Exhibit",
      name: "Ludvik",
      lines: ["Pure code, WebGL, zero polygons.", "Handle with curiosity."],
    });
    expect(home.collection.title).toEqual([
      "If it lives in a browser,",
      "I can build it.",
    ]);
    expect(home.steps.title).toEqual(["Three steps,", "no fog."]);
    expect(home.work.title).toEqual(["Work you can", "inspect."]);
    expect(home.about.title).toEqual(["One person,", "end to end."]);
    expect(home.closing).toEqual({
      eyebrow: "Your exhibit next?",
      title: "Have something in mind?",
      cta: "Discuss a project",
    });
    expect(home.strip).toEqual({
      status: "Taking projects · Q4 2026",
      established: "Est. 2024 · Europe",
    });
  });

  it("keeps Nº 04 for Ludvik4 the mascot; works number around it", () => {
    expect(mascotExhibitNumber("en")).toBe("Nº 04");
    expect(mascotExhibitNumber("ru")).toBe("№ 04");
    expect([0, 1, 2, 3, 4].map((i) => workExhibitNumber(i, "ru"))).toEqual([
      "№ 01",
      "№ 02",
      "№ 03",
      "№ 05",
      "№ 06",
    ]);
  });

  it("never mentions prices on the exhibition home", () => {
    for (const market of ["ru", "en"] as const) {
      expect(JSON.stringify(getMarketContent(market).home)).not.toMatch(
        /₽|\$|€/,
      );
    }
  });
});

describe("buildSiteMetadata", () => {
  it("RU: canonical /, RSS alternate, no hreflang linking the two markets", () => {
    const meta = buildSiteMetadata(getMarketContent("ru"), {
      baseUrl: RU_BASE,
      hasBlog: true,
      verification: undefined,
    });
    expect(meta.alternates?.canonical).toBe("/");
    expect(meta.alternates?.languages).toBeUndefined();
    expect(meta.alternates?.types).toMatchObject({
      "application/rss+xml": "/blog/rss.xml",
    });
    expect(meta.openGraph?.locale).toBe("ru_RU");
    expect(meta.openGraph?.images).toMatchObject([
      {
        url: "/og-image-ru.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ]);
    expect(meta.twitter?.images).toMatchObject([
      { url: "/og-image-ru.png", width: 1200, height: 630 },
    ]);
    expect(meta.keywords).not.toContain("команда разработчиков");
  });

  it("EN: RSS alternate for the international blog and no hreflang", () => {
    const meta = buildSiteMetadata(getMarketContent("en"), {
      baseUrl: EN_BASE,
      hasBlog: true,
      verification: undefined,
    });
    expect(meta.alternates?.canonical).toBe("/");
    expect(meta.alternates?.languages).toBeUndefined();
    expect(meta.alternates?.types).toMatchObject({
      "application/rss+xml": "/blog/rss.xml",
    });
    expect(meta.openGraph?.locale).toBe("en_US");
    expect(meta.openGraph?.images).toBeUndefined();
    expect(meta.twitter?.images).toBeUndefined();
  });
});

describe("buildHomeJsonLd", () => {
  it("RU: studio graph with offers, no permanent-team claim", () => {
    const jsonLd = buildHomeJsonLd(getMarketContent("ru"), RU_BASE);
    const raw = JSON.stringify(jsonLd);
    expect(raw).not.toMatch(TEAM_CLAIM);
    expect(raw).toContain(`${RU_BASE}/og-image-ru.png`);

    const service = jsonLd["@graph"].find(
      (n) => n["@type"] === "ProfessionalService",
    ) as Record<string, unknown>;
    expect(Array.isArray(service.makesOffer)).toBe(true);

    const website = jsonLd["@graph"].find((n) => n["@type"] === "WebSite") as {
      inLanguage: string;
    };
    expect(website.inLanguage).toBe("ru");
  });

  it("EN: English studio graph, no offers, Europe-based and worldwide", () => {
    const jsonLd = buildHomeJsonLd(getMarketContent("en"), EN_BASE);
    const raw = JSON.stringify(jsonLd);
    expect(raw).not.toMatch(TEAM_CLAIM);
    expect(raw).toContain('"addressCountry":"ES"');
    expect(raw).toContain('"areaServed":"Worldwide"');
    expect(raw).not.toMatch(/russia|russian|\.ru\b/i);

    const service = jsonLd["@graph"].find(
      (n) => n["@type"] === "ProfessionalService",
    ) as Record<string, unknown>;
    expect(service.makesOffer).toBeUndefined();
    expect(service.description).toContain("founder-led web product studio");
  });
});

describe("footer", () => {
  it.each(["ru", "en"] as const)(
    "%s does not repeat the header menu",
    (market) => {
      const { nav, footer } = getMarketContent(market);
      const navHrefs = new Set([
        ...(nav.links ?? []).map((l) => l.href),
        "/contact",
      ]);
      for (const link of footer.links) {
        expect(navHrefs.has(link.href), link.href).toBe(false);
      }
    },
  );
});
