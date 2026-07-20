import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/features/blog";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const articles = getPublishedArticles();

  // /dashboard — authenticated, excluded from search
  // /signin — auth entry page, adds no search value
  return [
    {
      url: `${baseURL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      // English landing (lightweight) — entry point for the international
      // (GitHub/qa-pilot) audience; hreflang alternates live in page metadata.
      url: `${baseURL}/en`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseURL}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${baseURL}/blog/${article.slug}`,
      lastModified: article.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
