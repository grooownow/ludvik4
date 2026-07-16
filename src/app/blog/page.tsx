import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPublishedArticles } from "@/features/blog";

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
  const articles = getPublishedArticles();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-pink-soft bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-mono text-sm font-bold tracking-tight">
            Ludvik4
          </Link>
          <Button asChild size="sm">
            <Link href="/#contact">Обсудить задачу</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14">
        <p className="text-primary mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
          Блог
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Заметки о разработке с AI
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          AI-агенты в разработке, spec-driven development, автоматизация — из
          практики команды Ludvik4.
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
              className="border-border bg-card hover:border-primary/40 block rounded-2xl border p-6 transition-colors"
            >
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
