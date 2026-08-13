import type { MetadataRoute } from "next";
import { getPublishedArticlesForMarket } from "@/features/blog";
import { buildSitemap } from "@/features/site";
import { env } from "@/lib/env";

export const dynamic = "force-static";

// Market-scoped sitemap — see buildSitemap in the site slice. Each build adds
// only its localized articles; no cross-market URL is emitted. /dashboard and
// /signin are never listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticlesForMarket(env.SITE_MARKET).map((a) => ({
    slug: a.slug,
    date: a.date,
  }));
  return buildSitemap(env.SITE_MARKET, env.NEXT_PUBLIC_APP_URL, articles);
}
