import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { buildHomeJsonLd, buildSiteMetadata } from "./seo";

const RU_BASE = "https://ludvik4.dev";
const EN_BASE = "https://ludvik4.example";

// The old, now-forbidden "permanent team" claim fragments (brief §Позиционирование).
const TEAM_CLAIM = /ML-инженер|команда: разработчики|команда разработчиков/;

describe("market content", () => {
  it("RU is the Russian studio positioning with exactly three services", () => {
    const ru = getMarketContent("ru");
    expect(ru.lang).toBe("ru");
    expect(ru.services.items).toHaveLength(3);
    expect(ru.services.items.map((s) => s.title)).toEqual([
      "Сайт или лендинг",
      "Автоматизация бизнес-процессов",
      "Веб-приложение или компактный SaaS",
    ]);
    expect(ru.description).toContain("Разработка цифровых продуктов");
    expect(ru.about?.body).not.toMatch(TEAM_CLAIM);
  });

  it("EN is the founder-led studio, first person, with three services", () => {
    const en = getMarketContent("en");
    expect(en.lang).toBe("en");
    expect(en.services.items).toHaveLength(3);
    expect(en.description).toContain("founder-led product studio");
    expect(en.hero.lead).toMatch(/^I design and launch/);
    // EN keeps the lead form; RU does not.
    expect(en.contact.form).toBeDefined();
    expect(getMarketContent("ru").contact.form).toBeUndefined();
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
    expect(meta.keywords).not.toContain("команда разработчиков");
  });

  it("EN: no RSS alternate (no blog) and no hreflang", () => {
    const meta = buildSiteMetadata(getMarketContent("en"), {
      baseUrl: EN_BASE,
      hasBlog: false,
      verification: undefined,
    });
    expect(meta.alternates?.canonical).toBe("/");
    expect(meta.alternates?.languages).toBeUndefined();
    expect(meta.alternates?.types).toBeUndefined();
    expect(meta.openGraph?.locale).toBe("en_US");
  });
});

describe("buildHomeJsonLd", () => {
  it("RU: studio graph with offers, no permanent-team claim", () => {
    const jsonLd = buildHomeJsonLd(getMarketContent("ru"), RU_BASE);
    const raw = JSON.stringify(jsonLd);
    expect(raw).not.toMatch(TEAM_CLAIM);

    const service = jsonLd["@graph"].find(
      (n) => n["@type"] === "ProfessionalService",
    ) as Record<string, unknown>;
    expect(Array.isArray(service.makesOffer)).toBe(true);

    const website = jsonLd["@graph"].find((n) => n["@type"] === "WebSite") as {
      inLanguage: string;
    };
    expect(website.inLanguage).toBe("ru");
  });

  it("EN: English studio graph, no offers, no country marketing tag", () => {
    const jsonLd = buildHomeJsonLd(getMarketContent("en"), EN_BASE);
    const raw = JSON.stringify(jsonLd);
    expect(raw).not.toMatch(TEAM_CLAIM);
    expect(raw).not.toContain("Spain");

    const service = jsonLd["@graph"].find(
      (n) => n["@type"] === "ProfessionalService",
    ) as Record<string, unknown>;
    expect(service.makesOffer).toBeUndefined();
    expect(service.description).toContain("founder-led product studio");
  });
});
