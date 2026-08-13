import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  articleFrontmatterSchema,
  getAllArticles,
  getPublishedArticles,
  getPublishedArticleBySlug,
} from "./articles";

const VALID_DIR = path.join(__dirname, "__fixtures__", "valid");
const MALFORMED_DIR = path.join(__dirname, "__fixtures__", "malformed");
const EN_CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog", "en");

describe("getAllArticles", () => {
  it("loads every .mdx file, newest first, drafts included", () => {
    const articles = getAllArticles(VALID_DIR);

    expect(articles.map((a) => a.slug)).toEqual([
      "2026-03-draft",
      "2026-02-newest",
      "2026-01-published",
    ]);
  });

  it("defaults draft to false when the flag is omitted", () => {
    const articles = getAllArticles(VALID_DIR);
    const newest = articles.find((a) => a.slug === "2026-02-newest");

    expect(newest?.draft).toBe(false);
  });

  it("strips frontmatter from content and keeps the body", () => {
    const articles = getAllArticles(VALID_DIR);
    const older = articles.find((a) => a.slug === "2026-01-published");

    expect(older?.content).toContain("Body of the older published article");
    expect(older?.content).not.toContain("draft: false");
  });

  it("throws a readable error naming the file on malformed frontmatter", () => {
    expect(() => getAllArticles(MALFORMED_DIR)).toThrow(
      /missing-description\.mdx.*description/,
    );
  });
});

describe("getPublishedArticles", () => {
  it("excludes drafts", () => {
    const slugs = getPublishedArticles(VALID_DIR).map((a) => a.slug);

    expect(slugs).toEqual(["2026-02-newest", "2026-01-published"]);
    expect(slugs).not.toContain("2026-03-draft");
  });
});

describe("getPublishedArticleBySlug", () => {
  it("returns a published article by slug", () => {
    const article = getPublishedArticleBySlug("2026-01-published", VALID_DIR);

    expect(article?.title).toBe("Older published article");
  });

  it("returns undefined for a draft slug — drafts are invisible by slug too", () => {
    expect(getPublishedArticleBySlug("2026-03-draft", VALID_DIR)).toBe(
      undefined,
    );
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPublishedArticleBySlug("no-such-article", VALID_DIR)).toBe(
      undefined,
    );
  });
});

describe("articleFrontmatterSchema — cover", () => {
  const base = { title: "T", description: "D", date: "2026-01-01" };

  it("rejects a cover without coverAlt (a11y/SEO)", () => {
    const result = articleFrontmatterSchema.safeParse({
      ...base,
      cover: "/blog/x/card.jpg",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a cover together with coverAlt", () => {
    const result = articleFrontmatterSchema.safeParse({
      ...base,
      cover: "/blog/x/card.jpg",
      coverAlt: "A description",
    });

    expect(result.success).toBe(true);
  });

  it("accepts an article with no cover at all", () => {
    expect(articleFrontmatterSchema.safeParse(base).success).toBe(true);
  });
});

describe("real content dir (src/content/blog)", () => {
  it("loads without throwing — malformed frontmatter would fail the build", () => {
    expect(() => getAllArticles()).not.toThrow();
  });

  it.each(["github-spec-kit", "spec-driven-development", "cursor-rules"])(
    "%s connects its engineering topic to both Gridfin market pages",
    (slug) => {
      const article = getPublishedArticleBySlug(slug);

      expect(article?.content).toContain("https://ludvik4.ru/gridfin/");
      expect(article?.content).toContain("https://ludvik4.dev/gridfin/en");
    },
  );

  it("keeps all five new English articles in content but publishes only the first", () => {
    const articles = getAllArticles(EN_CONTENT_DIR);
    const newSlugs = [
      "agents-md-vs-claude-md-vs-cursor-rules",
      "spec-driven-development-vs-vibe-coding",
      "github-spec-kit-vs-application-skeleton",
      "spec-first-spec-anchored-spec-as-source",
      "cursor-rules-best-practices",
    ];

    expect(articles.map((article) => article.slug)).toEqual(
      expect.arrayContaining(newSlugs),
    );
    expect(
      getPublishedArticles(EN_CONTENT_DIR)
        .filter((article) => newSlugs.includes(article.slug))
        .map((article) => article.slug),
    ).toEqual(["agents-md-vs-claude-md-vs-cursor-rules"]);
  });
});
