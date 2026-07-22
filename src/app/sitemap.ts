import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/features/blog";
import { buildSitemap } from "@/features/site";
import { env } from "@/lib/env";

// Market-scoped sitemap — see buildSitemap in the site slice. The RU build adds
// the blog + published articles; every other market lists only its landing. No
// cross-market URL (the other market lives on its own domain). /dashboard and
// /signin are never listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles().map((a) => ({
    slug: a.slug,
    date: a.date,
  }));
  return buildSitemap(env.SITE_MARKET, env.NEXT_PUBLIC_APP_URL, articles);
}
