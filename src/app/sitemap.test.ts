import { describe, expect, it } from "vitest";
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
    expect(urls).toContain(`${baseURL}/cases/qa-pilot/`);
    // No hreflang / cross-market URL — the EN storefront lives on its own domain.
    expect(urls).not.toContain(`${baseURL}/en`);
    for (const a of getPublishedArticles()) {
      expect(urls).toContain(`${baseURL}/blog/${a.slug}/`);
    }
    for (const d of getAllArticles().filter((a) => a.draft)) {
      expect(urls).not.toContain(`${baseURL}/blog/${d.slug}/`);
    }
    expect(urls).toHaveLength(8 + getPublishedArticles().length);
  });

  it("EN: landing + privacy notice — no blog or articles", () => {
    const urls = buildSitemap("en", baseURL, articles).map((e) => e.url);
    expect(urls).toEqual([`${baseURL}/`, `${baseURL}/privacy`]);
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
