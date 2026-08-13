import { getPublishedArticlesForMarket } from "@/features/blog";
import { publicUrl } from "@/features/site";
import { env } from "@/lib/env";

// Statically generated at build time — content lives in the repo, so every
// deploy rebuilds the feed. No request input is read.
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET(): Response {
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const articles = getPublishedArticlesForMarket(env.SITE_MARKET);
  const isRu = env.SITE_MARKET === "ru";
  const title = isRu ? "Блог Ludvik4" : "Ludvik4 Articles";
  const description = isRu
    ? "AI-агенты в разработке, spec-driven development, автоматизация и запуск цифровых продуктов"
    : "Practical notes on AI coding agents, spec-driven development, engineering controls, and focused digital products";

  const items = articles
    .map((article) => {
      const url = publicUrl(env.SITE_MARKET, baseURL, `/blog/${article.slug}`);
      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(article.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <link>${escapeXml(publicUrl(env.SITE_MARKET, baseURL, "/blog"))}</link>
    <description>${description}</description>
    <language>${env.SITE_MARKET}</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
