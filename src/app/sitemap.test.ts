import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getAllArticles, getPublishedArticles } from "@/features/blog";
import { buildSitemap } from "@/features/site";
import { env } from "@/lib/env";
import sitemap from "./sitemap";

const baseURL = env.NEXT_PUBLIC_APP_URL;
const articles = getPublishedArticles().map((a) => ({
  slug: a.slug,
  date: a.date,
}));

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

  it("EN: landing, service pages, proof and source pages — no RU content", () => {
    const urls = buildSitemap("en", baseURL, articles).map((e) => e.url);
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
