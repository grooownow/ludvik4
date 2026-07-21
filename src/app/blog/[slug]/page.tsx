import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXComponents } from "next-mdx-remote-client/rsc";
import { Button } from "@/components/ui/button";
import {
  getPublishedArticles,
  getPublishedArticleBySlug,
} from "@/features/blog";
import { env } from "@/lib/env";
import { jsonLdString } from "@/lib/json-ld";

// Published articles only — drafts get no static page.
export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

// Unknown slugs 404 immediately instead of triggering an on-demand render
// (which would hit the fs-based article loader inside a serverless function
// at request time). Drafts are filtered out of the loader in every mode, so
// nothing is lost by disabling the dynamic fallback.
export const dynamicParams = false;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) {
    return {};
  }
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/blog/${article.slug}`,
      publishedTime: article.date,
      ...(article.cover && {
        images: [
          {
            url: article.cover,
            width: 1600,
            height: 900,
            alt: article.coverAlt ?? article.title,
          },
        ],
      }),
    },
    ...(article.cover && {
      twitter: { card: "summary_large_image", images: [article.cover] },
    }),
  };
}

// Typographic mapping for MDX output — token classes only, no plugin.
// `children` is spelled out (not left inside the spread) so jsx-a11y can
// prove headings/anchors have accessible content.
const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      className="mt-10 text-2xl font-semibold tracking-tight text-balance"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-8 text-lg font-bold" {...props}>
      {children}
    </h3>
  ),
  p: (props) => (
    <p className="text-foreground/90 mt-5 leading-relaxed" {...props} />
  ),
  ul: (props) => (
    <ul className="mt-5 flex list-disc flex-col gap-2 pl-6" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-5 flex list-decimal flex-col gap-2 pl-6" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  // Internal links must stay SPA (hard invariant #1): article markdown like
  // [text](/#contact) renders as <Link>, external URLs as a plain anchor.
  a: ({ children, href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link
        href={href as Route}
        className="text-primary underline underline-offset-4"
      >
        {children}
      </Link>
    ) : (
      <a
        className="text-primary underline underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
        href={href}
        {...props}
      >
        {children}
      </a>
    ),
  strong: (props) => <strong className="font-semibold" {...props} />,
  code: (props) => (
    <code
      className="bg-surface-warm rounded px-1.5 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: "ru",
    url: `${baseURL}/blog/${article.slug}`,
    ...(article.cover && { image: `${baseURL}${article.cover}` }),
    author: { "@type": "Organization", name: "Ludvik4", url: baseURL },
    publisher: { "@type": "Organization", name: "Ludvik4", url: baseURL },
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground font-mono text-sm"
        >
          ← Блог
        </Link>
        <article className="mt-6">
          <time
            dateTime={article.date}
            className="text-muted-foreground font-mono text-xs"
          >
            {article.date}
          </time>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {article.title}
          </h1>
          {article.cover ? (
            <Image
              src={article.cover}
              alt={article.coverAlt ?? article.title}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="border-border mt-6 aspect-video w-full rounded-2xl border object-cover"
            />
          ) : null}
          <MDXRemote source={article.content} components={mdxComponents} />
        </article>

        <div className="border-pink-soft bg-accent mt-14 rounded-2xl border p-6">
          <h2 className="text-lg font-bold">Есть похожая задача?</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Опишите её — предложим решение и оценку. Бесплатно.
          </p>
          <div className="mt-4">
            <Button asChild size="sm">
              <Link href="/#contact">Обсудить задачу</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-surface-warm mt-14">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 font-mono text-sm">
          <span>© 2026 Ludvik4</span>
          <Link href="/blog" className="hover:text-foreground">
            Все статьи
          </Link>
        </div>
      </footer>
    </div>
  );
}
