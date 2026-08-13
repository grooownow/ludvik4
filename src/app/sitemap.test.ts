import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  getAllArticles,
  getArticleContentDir,
  getPublishedArticles,
} from "@/features/blog";
import { buildSitemap } from "@/features/site";
import { env } from "@/lib/env";
import sitemap from "./sitemap";

const baseURL = env.NEXT_PUBLIC_APP_URL;
const articles = getPublishedArticles().map((a) => ({
  slug: a.slug,
  date: a.date,
}));
const enArticles = getPublishedArticles(getArticleContentDir("en")).map(
  (a) => ({
    slug: a.slug,
    date: a.date,
  }),
);

describe("buildSitemap", () => {
  it("RU: landing, commercial pages, cases and published articles", () => {
    const urls = buildSitemap("ru", baseURL, articles).map((e) => e.url);

    expect(urls).toContain(`${baseURL}/`);
    expect(urls).toContain(`${baseURL}/blog/`);
    expect(urls).toContain(`${baseURL}/uslugi/razrabotka-lendinga/`);
    expect(urls).toContain(
      `${baseURL}/uslugi/avtomatizatsiya-biznes-processov/`,
    );
    expect(urls).toContain(`${baseURL}/uslugi/razrabotka-mvp/`);
    expect(urls).toContain(`${baseURL}/cases/`);
    expect(urls).toContain(`${baseURL}/cases/fortnoise/`);
    expect(urls).toContain(`${baseURL}/cases/gridfin/`);
    expect(urls).toContain(`${baseURL}/cases/qa-pilot/`);
    // Gridfin landing + its supporting pages (static files in public/gridfin/).
    expect(urls).toContain(`${baseURL}/gridfin/`);
    expect(urls).toContain(`${baseURL}/gridfin/docs/application-skeleton/`);
    expect(urls).toContain(
      `${baseURL}/gridfin/guides/why-ai-needs-engineering-rules/`,
    );
    // No hreflang / cross-market URL — the EN storefront lives on its own domain.
    expect(urls).not.toContain(`${baseURL}/en`);
    for (const a of getPublishedArticles()) {
      expect(urls).toContain(`${baseURL}/blog/${a.slug}/`);
    }
    for (const d of getAllArticles().filter((a) => a.draft)) {
      expect(urls).not.toContain(`${baseURL}/blog/${d.slug}/`);
    }
    expect(urls).toHaveLength(12 + getPublishedArticles().length);
  });

  it("EN: landing, service pages, proof, source pages and EN articles", () => {
    const urls = buildSitemap("en", baseURL, enArticles).map((e) => e.url);
    expect(urls).toEqual([
      `${baseURL}/`,
      `${baseURL}/services/websites`,
      `${baseURL}/services/workflow-automation`,
      `${baseURL}/services/mvp-development`,
      `${baseURL}/work`,
      `${baseURL}/work/qa-pilot`,
      `${baseURL}/about`,
      `${baseURL}/guides`,
      `${baseURL}/guides/website-project-brief`,
      `${baseURL}/guides/automation-priority-scorecard`,
      `${baseURL}/guides/mvp-scope-one-user-journey`,
      `${baseURL}/privacy`,
      `${baseURL}/gridfin/en`,
      `${baseURL}/gridfin/en/docs/application-skeleton`,
      `${baseURL}/gridfin/en/guides/why-ai-needs-engineering-rules`,
      `${baseURL}/blog`,
      `${baseURL}/blog/agents-md-vs-claude-md-vs-cursor-rules`,
    ]);
  });
});

describe("app sitemap() (default RU market)", () => {
  it("delegates to the market builder and excludes auth routes", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain(`${baseURL}/`);
    expect(urls).toContain(`${baseURL}/blog/`);
    expect(urls).not.toContain(`${baseURL}/dashboard`);
    expect(urls).not.toContain(`${baseURL}/signin`);
  });
});

describe("public Gridfin sitemap", () => {
  it("serves a same-host XML sitemap for /gridfin/sitemap.xml", () => {
    const xml = readFileSync(
      path.join(process.cwd(), "resources/ru-public/gridfin/sitemap.xml"),
      "utf8",
    );

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<loc>https://ludvik4.ru/gridfin/</loc>");
    expect(xml).toContain(
      "<loc>https://ludvik4.ru/gridfin/docs/application-skeleton/</loc>",
    );
    expect(xml).toContain(
      "<loc>https://ludvik4.ru/gridfin/guides/why-ai-needs-engineering-rules/</loc>",
    );
    expect(xml).not.toContain("<loc>https://ludvik4.dev/");
    expect(xml).toContain('hreflang="en"');
  });
});

describe("public Gridfin RU landing", () => {
  it("uses Application Skeleton as the central product entity", () => {
    const html = readFileSync(
      path.join(process.cwd(), "resources/ru-public/gridfin/index.html"),
      "utf8",
    );

    expect(html).toContain(
      "<title>Gridfin — agent-native скелет SaaS для Claude Code</title>",
    );
    expect(html).toContain(
      '"applicationSubCategory":"Application Skeleton for Claude Code"',
    );
    expect(html).toContain(
      "<h1>Запускайте качественные сайты и приложения с Claude Code.</h1>",
    );
    expect(html).not.toMatch(/<title>[^<]*(?:starter|стартер)/i);
    expect(html).not.toMatch(/<h1>[^<]*(?:starter|стартер)/i);
  });
});

describe("public Gridfin international bundle", () => {
  const root = path.join(process.cwd(), "public/gridfin");

  it("keeps the RU market out of the .dev bundle", () => {
    const html = readFileSync(path.join(root, "en/index.html"), "utf8");
    const terms = readFileSync(path.join(root, "en/terms/index.html"), "utf8");

    expect(html).toContain(
      '<link rel="canonical" href="https://ludvik4.dev/gridfin/en">',
    );
    const switcher = html.match(
      /<details class="lang">[\s\S]*?<\/details>/,
    )?.[0];
    expect(switcher).toBeDefined();
    expect(switcher).not.toContain("ludvik4.ru");
    expect(switcher).not.toContain("Русский");
    expect(html).toContain(
      '<h2 class="price-heading-split"><span>Beta: you test —</span><span>I fix</span></h2>',
    );
    expect(html).not.toMatch(/Russia|functions\.yandexcloud\.net/);
    expect(terms).toContain("Gridfin International Beta Terms");
    expect(terms).toContain("laws of Spain");
    expect(terms).not.toMatch(/Yandex|Russia|Russian/);
  });

  it("advertises only what is deployed: every sitemap <loc> resolves to a committed file", () => {
    // The ADR 0005 rule generalized past a hardcoded count (the launch round
    // pinned 3 EN URLs; the locale round made that stale in the honest
    // direction). A <loc> whose index.html is missing from public/gridfin is
    // a 404 promised to crawlers — the exact defect this bundle shipped to
    // fix, so it stays impossible by construction.
    const xml = readFileSync(path.join(root, "sitemap.xml"), "utf8");
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);

    expect(locs.length).toBeGreaterThanOrEqual(3);
    for (const loc of locs) {
      const rel = loc.replace("https://ludvik4.dev/gridfin/", "");
      expect(
        existsSync(path.join(root, rel, "index.html")),
        `${loc} is advertised but ${rel}/index.html is not deployed`,
      ).toBe(true);
    }
    // Slashless style throughout — a trailing slash here would promise a URL
    // that 308s through the app's trailingSlash redirect.
    for (const loc of locs) {
      expect(loc.endsWith("/")).toBe(false);
    }
  });

  it("ships every locale the live hreflang block advertises", () => {
    const html = readFileSync(path.join(root, "en/index.html"), "utf8");
    const alternates = [
      ...html.matchAll(
        /hreflang="[^"]+" href="https:\/\/ludvik4\.dev\/gridfin\/([a-z-]+)"/g,
      ),
    ].map((m) => m[1]!);

    expect(alternates.length).toBeGreaterThanOrEqual(6); // en + 5 locales
    for (const locale of alternates) {
      expect(
        existsSync(path.join(root, locale, "index.html")),
        `hreflang advertises /gridfin/${locale} but the locale is not deployed`,
      ).toBe(true);
    }
  });
});
