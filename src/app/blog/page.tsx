import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedArticlesForMarket } from "@/features/blog";
import {
  Breadcrumbs,
  canonicalPath,
  getMarketContent,
  publicUrl,
  SiteHeader,
} from "@/features/site";
import { env } from "@/lib/env";
import { jsonLdString } from "@/lib/json-ld";

const marketContent = getMarketContent(env.SITE_MARKET);
const isRu = env.SITE_MARKET === "ru";
const copy = isRu
  ? {
      metadataTitle: "Блог",
      metadataDescription:
        "Статьи Ludvik4: AI-агенты в разработке, spec-driven development, автоматизация и запуск цифровых продуктов.",
      shareTitle: "Блог Ludvik4",
      breadcrumbHome: "Главная",
      breadcrumbBlog: "Блог",
      eyebrow: "Блог",
      title: "Заметки о разработке с AI",
      intro:
        "AI-агенты в разработке, spec-driven development, автоматизация — из практики Ludvik4.",
      empty: "Первые статьи уже в работе — скоро здесь появятся",
      homeLink: "На главную",
      language: "ru",
    }
  : {
      metadataTitle: "Articles",
      metadataDescription:
        "Ludvik4 articles on AI coding agents, spec-driven development, engineering controls, and building focused digital products.",
      shareTitle: "Ludvik4 Articles",
      breadcrumbHome: "Home",
      breadcrumbBlog: "Articles",
      eyebrow: "Articles",
      title: "AI-assisted development, examined in practice",
      intro:
        "Practical comparisons and engineering notes on coding agents, specifications, rules, tests, and quality gates.",
      empty: "The first articles are in progress.",
      homeLink: "Back to home",
      language: "en",
    };

export const metadata: Metadata = {
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  alternates: { canonical: canonicalPath(env.SITE_MARKET, "/blog") },
  openGraph: {
    title: copy.shareTitle,
    description: copy.metadataDescription,
    url: canonicalPath(env.SITE_MARKET, "/blog"),
  },
};

// Formats "2026-07-16" for display without constructing a Date in render
// (content dates are plain ISO strings by contract).
function formatDate(isoDate: string): string {
  if (!isRu) return isoDate;
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

export default function BlogPage() {
  const articles = getPublishedArticlesForMarket(env.SITE_MARKET);
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const blogUrl = publicUrl(env.SITE_MARKET, baseURL, "/blog");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${blogUrl}#blog`,
        name: copy.shareTitle,
        description: copy.metadataDescription,
        url: blogUrl,
        inLanguage: copy.language,
        publisher: { "@id": `${baseURL}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: articles.map((article, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: publicUrl(env.SITE_MARKET, baseURL, `/blog/${article.slug}`),
            name: article.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: copy.breadcrumbHome,
            item: `${baseURL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.breadcrumbBlog,
            item: blogUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <SiteHeader content={marketContent} contactHref="/#contact" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        <Breadcrumbs items={[{ label: copy.breadcrumbBlog }]} />
        <p className="text-primary mt-10 mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
          {copy.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {copy.title}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl">{copy.intro}</p>

        <div className="mt-10 flex flex-col gap-4">
          {articles.length === 0 ? (
            <p className="text-muted-foreground border-border rounded-2xl border border-dashed p-6 text-sm">
              {copy.empty}
            </p>
          ) : null}
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="border-border bg-card hover:border-primary/40 flex flex-col gap-4 rounded-2xl border p-6 transition-colors sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="flex-1">
                <time
                  dateTime={article.date}
                  className="text-muted-foreground font-mono text-xs"
                >
                  {formatDate(article.date)}
                </time>
                <h2 className="mt-2 text-lg font-bold">{article.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {article.description}
                </p>
              </div>
              {article.cover ? (
                <Image
                  src={article.cover}
                  alt={article.coverAlt ?? article.title}
                  width={1600}
                  height={900}
                  sizes="(min-width: 640px) 224px, 100vw"
                  className="aspect-video w-full rounded-xl object-cover sm:w-56 sm:shrink-0"
                />
              ) : null}
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-surface-warm mt-14">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 font-mono text-sm">
          <span>© 2026 Ludvik4</span>
          <Link href="/" className="hover:text-foreground">
            {copy.homeLink}
          </Link>
        </div>
      </footer>
    </div>
  );
}
