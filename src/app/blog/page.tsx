import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArticles } from "@/features/blog";
import { Breadcrumbs, getMarketContent, SiteHeader } from "@/features/site";
import { env } from "@/lib/env";

const ruContent = getMarketContent("ru");

export const metadata: Metadata = {
  title: "Блог",
  description:
    "Статьи Ludvik4: AI-агенты в разработке, spec-driven development, автоматизация и запуск цифровых продуктов.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Блог Ludvik4",
    description:
      "AI-агенты в разработке, spec-driven development, автоматизация и запуск цифровых продуктов.",
    url: "/blog",
  },
};

// Formats "2026-07-16" for display without constructing a Date in render
// (content dates are plain ISO strings by contract).
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

export default function BlogPage() {
  // The blog is a RU-market surface; an EN build 404s it.
  if (env.SITE_MARKET !== "ru") notFound();
  const articles = getPublishedArticles();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={ruContent} contactHref="/#contact" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        <Breadcrumbs items={[{ label: "Блог" }]} />
        <p className="text-primary mt-10 mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
          Блог
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Заметки о разработке с AI
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          AI-агенты в разработке, spec-driven development, автоматизация — из
          практики Ludvik4.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          {articles.length === 0 ? (
            <p className="text-muted-foreground border-border rounded-2xl border border-dashed p-6 text-sm">
              Первые статьи уже в работе — скоро здесь появятся
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
            На главную
          </Link>
        </div>
      </footer>
    </div>
  );
}
