import { getPublishedArticles } from "@/features/blog";
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
  // The blog + RSS are a RU-market surface only.
  if (env.SITE_MARKET !== "ru") {
    return new Response("Not found", { status: 404 });
  }
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const articles = getPublishedArticles();

  const items = articles
    .map((article) => {
      const url = `${baseURL}/blog/${article.slug}`;
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
    <title>Блог Ludvik4</title>
    <link>${escapeXml(`${baseURL}/blog`)}</link>
    <description>AI-агенты в разработке, spec-driven development, автоматизация и запуск цифровых продуктов</description>
    <language>ru</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
