// SEO route handlers exercised for real — no mocks: the RSS feed and
// llms.txt are static Response-returning handlers over repo content.
import { describe, expect, it } from "vitest";
import { GET as getRss } from "@/app/blog/rss.xml/route";
import { GET as getLlms } from "@/app/llms.txt/route";
import { getAllArticles, getPublishedArticles } from "@/features/blog";

describe("GET /blog/rss.xml", () => {
  it("returns 200 with an RSS 2.0 XML document", async () => {
    const response = getRss();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain(
      "application/rss+xml",
    );

    const body = await response.text();
    expect(body).toContain('<rss version="2.0">');
    expect(body).toContain("<title>Блог Ludvik4</title>");
  });

  it("lists exactly the published articles — never drafts", async () => {
    const body = await getRss().text();

    for (const article of getPublishedArticles()) {
      expect(body).toContain(`/blog/${article.slug}</link>`);
    }
    for (const draft of getAllArticles().filter((a) => a.draft)) {
      expect(body).not.toContain(`/blog/${draft.slug}`);
    }
  });
});

describe("GET /llms.txt", () => {
  it("returns 200 plain-text markdown describing the brand", async () => {
    const response = getLlms();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");

    const body = await response.text();
    expect(body).toContain("# Ludvik4");
    expect(body).toContain("AI-агент");
    expect(body).toContain("https://t.me/ludvik4work");
  });

  it("links published articles only", async () => {
    const body = await getLlms().text();

    for (const article of getPublishedArticles()) {
      expect(body).toContain(`/blog/${article.slug}`);
    }
    for (const draft of getAllArticles().filter((a) => a.draft)) {
      expect(body).not.toContain(`/blog/${draft.slug}`);
    }
  });
});
