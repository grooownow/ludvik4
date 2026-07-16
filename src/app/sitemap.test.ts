import { describe, expect, it } from "vitest";
import { getAllArticles, getPublishedArticles } from "@/features/blog";
import { env } from "@/lib/env";
import sitemap from "./sitemap";

const baseURL = env.NEXT_PUBLIC_APP_URL;

describe("sitemap", () => {
  it("includes the landing and the blog list", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain(`${baseURL}/`);
    expect(urls).toContain(`${baseURL}/blog`);
  });

  it("includes exactly the published articles — never drafts", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const article of getPublishedArticles()) {
      expect(urls).toContain(`${baseURL}/blog/${article.slug}`);
    }
    for (const article of getAllArticles().filter((a) => a.draft)) {
      expect(urls).not.toContain(`${baseURL}/blog/${article.slug}`);
    }
    // Sanity: nothing beyond landing + blog list + published articles.
    expect(urls).toHaveLength(2 + getPublishedArticles().length);
  });

  it("excludes authenticated and auth-entry routes", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).not.toContain(`${baseURL}/dashboard`);
    expect(urls).not.toContain(`${baseURL}/signin`);
  });
});
