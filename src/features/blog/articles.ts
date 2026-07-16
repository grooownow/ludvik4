import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

// Frontmatter contract for src/content/blog/*.mdx. Malformed or missing
// fields throw at load time — and loading happens during `next build`
// (generateStaticParams / sitemap / RSS), so a bad article fails the build
// instead of rendering a broken card (docs/specs/seo-geo-strategy.md).
export const articleFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  // ISO calendar date (YYYY-MM-DD) — used for sorting, sitemap lastModified
  // and RSS pubDate.
  date: z.iso.date(),
  draft: z.boolean().default(false),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export type Article = ArticleFrontmatter & {
  slug: string;
  /** MDX body with frontmatter stripped — ready for the MDX renderer. */
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

/** All articles (drafts included), newest first. */
export function getAllArticles(dir: string = CONTENT_DIR): Article[] {
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  const articles = files.map((file): Article => {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const parsed = articleFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid frontmatter in ${file}: ${details}`);
    }
    return { ...parsed.data, slug: file.replace(/\.mdx$/, ""), content };
  });

  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

/** Published (non-draft) articles, newest first — the only list the site renders. */
export function getPublishedArticles(dir: string = CONTENT_DIR): Article[] {
  return getAllArticles(dir).filter((article) => !article.draft);
}

/** A single published article, or undefined (drafts stay invisible by slug too). */
export function getPublishedArticleBySlug(
  slug: string,
  dir: string = CONTENT_DIR,
): Article | undefined {
  return getPublishedArticles(dir).find((article) => article.slug === slug);
}
