import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { MDXComponents } from "next-mdx-remote-client/rsc";
import { Button } from "@/components/ui/button";
import {
  getPublishedArticlesForMarket,
  getPublishedArticleBySlugForMarket,
} from "@/features/blog";
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
const articleCopy = isRu
  ? {
      home: "Главная",
      blog: "Блог",
      sourceEyebrow: "Источник",
      sourceBody:
        "Материал подготовлен Ludvik4 на основе практики разработки сайтов, автоматизаций, MVP и AI-assisted development. Связанные услуги и разборы ниже помогают перейти от общей темы к конкретному сценарию.",
      ctaTitle: "Есть похожая задача?",
      ctaBody: "Опишите её — предложим решение и оценку. Бесплатно.",
      ctaLabel: "Обсудить задачу",
      allArticles: "Все статьи",
    }
  : {
      home: "Home",
      blog: "Articles",
      sourceEyebrow: "About this article",
      sourceBody:
        "Ludvik4 publishes practical engineering notes from building websites, workflow automations, MVPs, and AI-assisted development systems. The links below connect the method to inspectable work and project planning.",
      ctaTitle: "Planning a product or workflow?",
      ctaBody:
        "Describe the problem and the outcome you need. I will suggest a sensible first step.",
      ctaLabel: "Discuss your project",
      allArticles: "All articles",
    };

// Published articles only — drafts get no static page in either market build.
export function generateStaticParams() {
  return getPublishedArticlesForMarket(env.SITE_MARKET).map((article) => ({
    slug: article.slug,
  }));
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
  const article = getPublishedArticleBySlugForMarket(env.SITE_MARKET, slug);
  if (!article) {
    return {};
  }
  const articlePath = canonicalPath(env.SITE_MARKET, `/blog/${article.slug}`);
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: articlePath },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: articlePath,
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

type RelatedLink = {
  href: string;
  title: string;
  description: string;
};

const defaultRelatedLinksRu: RelatedLink[] = [
  {
    href: "/uslugi/razrabotka-lendinga",
    title: "Разработка лендинга",
    description: "Структура, тексты, базовое SEO, аналитика и запуск.",
  },
  {
    href: "/uslugi/avtomatizatsiya-biznes-processov",
    title: "Автоматизация бизнес-процессов",
    description: "Workflow, интеграции, AI и контроль ошибок.",
  },
  {
    href: "/uslugi/razrabotka-mvp",
    title: "Разработка MVP",
    description: "Первый рабочий релиз вокруг одного сценария.",
  },
];

const defaultRelatedLinksEn: RelatedLink[] = [
  {
    href: "/about",
    title: "Founder-led delivery",
    description:
      "How written scope, tests, and quality gates fit the studio model.",
  },
  {
    href: "/work/qa-pilot",
    title: "qa-pilot",
    description:
      "Inspect an open-source quality workflow for AI-assisted development.",
  },
  {
    href: "/guides/mvp-scope-one-user-journey",
    title: "Scope one complete user journey",
    description:
      "A worksheet for turning a product idea into a focused first release.",
  },
];

const relatedBySlug: Partial<Record<string, RelatedLink[]>> = {
  "agents-md-vs-claude-md-vs-cursor-rules": [
    {
      href: "/blog/agents-md-primer",
      title: "AGENTS.md: пример и шаблон",
      description: "Рабочая структура файла инструкций для coding agents.",
    },
    {
      href: "/blog/cursor-rules",
      title: "Cursor Rules",
      description: "Формат MDC, области действия и типы подключения правил.",
    },
    {
      href: "/gridfin/",
      title: "Gridfin",
      description:
        "Application Skeleton, где правила связаны с тестами и gates.",
    },
  ],
  "ai-avtomatizatsiya-malogo-biznesa": [
    {
      href: "/uslugi/avtomatizatsiya-biznes-processov",
      title: "Автоматизация бизнес-процессов",
      description: "Как превратить повторяющуюся ручную работу в workflow.",
    },
    {
      href: "/blog/avtomatizatsiya-obrabotki-zayavok",
      title: "Автоматизация обработки заявок",
      description: "Пример процесса с входом, статусами и уведомлениями.",
    },
    {
      href: "/blog/vnutrennee-veb-prilozhenie-dlya-biznesa",
      title: "Внутреннее веб-приложение",
      description: "Когда автоматизации уже нужен отдельный интерфейс.",
    },
  ],
  "avtomatizatsiya-obrabotki-zayavok": [
    {
      href: "/uslugi/avtomatizatsiya-biznes-processov",
      title: "Автоматизация бизнес-процессов",
      description: "Состав работы и границы проекта автоматизации.",
    },
    {
      href: "/blog/ai-avtomatizatsiya-malogo-biznesa",
      title: "AI-автоматизация малого бизнеса",
      description: "Где модель помогает, а где нужна обычная логика.",
    },
    {
      href: "/cases/fortnoise",
      title: "Кейс FortNoise",
      description: "Публичный сервис с пользовательскими публикациями.",
    },
  ],
  "chto-podgotovit-pered-zakazom-lendinga": [
    {
      href: "/uslugi/razrabotka-lendinga",
      title: "Разработка лендинга",
      description: "Как выглядит работа над страницей под одно действие.",
    },
    {
      href: "/blog/stoimost-lendinga-2026",
      title: "Стоимость лендинга",
      description: "Что входит в цену и что оценивается отдельно.",
    },
    {
      href: "/blog/lending-ili-mnogostranichnyy-sayt",
      title: "Лендинг или сайт",
      description: "Как выбрать структуру под поисковый и рекламный трафик.",
    },
  ],
  "lending-ili-mnogostranichnyy-sayt": [
    {
      href: "/uslugi/razrabotka-lendinga",
      title: "Разработка лендинга",
      description: "Под одно предложение и одно целевое действие.",
    },
    {
      href: "/blog/chto-podgotovit-pered-zakazom-lendinga",
      title: "Подготовка к лендингу",
      description: "Какие вопросы помогают собрать правильную структуру.",
    },
    {
      href: "/blog/stoimost-lendinga-2026",
      title: "Стоимость лендинга",
      description: "Как сравнивать предложения на разработку.",
    },
  ],
  "lending-vs-tilda": [
    {
      href: "/uslugi/razrabotka-lendinga",
      title: "Разработка лендинга",
      description: "Индивидуальная страница под структуру, SEO и запуск.",
    },
    {
      href: "/blog/lending-ili-mnogostranichnyy-sayt",
      title: "Лендинг или сайт",
      description: "Как выбрать формат под рекламу, SEO и развитие.",
    },
    {
      href: "/blog/stoimost-lendinga-2026",
      title: "Стоимость лендинга",
      description: "Что входит в цену и что оценивается отдельно.",
    },
  ],
  "mvp-etapy-sroki-pervyy-reliz": [
    {
      href: "/uslugi/razrabotka-mvp",
      title: "Разработка MVP",
      description: "Компактное веб-приложение под одну ключевую задачу.",
    },
    {
      href: "/blog/stoimost-razrabotki-mvp",
      title: "Стоимость MVP",
      description: "Как рассчитать бюджет первого релиза.",
    },
    {
      href: "/blog/vnutrennee-veb-prilozhenie-dlya-biznesa",
      title: "Внутреннее приложение",
      description: "Когда первый релиз нужен для рабочих процессов.",
    },
  ],
  "stoimost-lendinga-2026": [
    {
      href: "/uslugi/razrabotka-lendinga",
      title: "Разработка лендинга",
      description: "Базовый состав работы и границы оценки.",
    },
    {
      href: "/blog/chto-podgotovit-pered-zakazom-lendinga",
      title: "Что обдумать перед заказом",
      description: "Как подготовить исходные материалы без лишнего брифа.",
    },
    {
      href: "/blog/lending-ili-mnogostranichnyy-sayt",
      title: "Лендинг или многостраничный сайт",
      description: "Как формат влияет на цену и развитие.",
    },
  ],
  "stoimost-razrabotki-mvp": [
    {
      href: "/uslugi/razrabotka-mvp",
      title: "Разработка MVP",
      description: "Проектирование, UX/UI, backend, тестирование и запуск.",
    },
    {
      href: "/blog/mvp-etapy-sroki-pervyy-reliz",
      title: "Этапы MVP",
      description: "Как определить состав первого релиза.",
    },
    {
      href: "/blog/vnutrennee-veb-prilozhenie-dlya-biznesa",
      title: "Внутреннее веб-приложение",
      description: "Когда MVP решает внутренний рабочий сценарий.",
    },
  ],
  "mvp-ili-vnutrenniy-instrument": [
    {
      href: "/uslugi/razrabotka-mvp",
      title: "Разработка MVP",
      description: "Первый релиз продукта вокруг одного сценария.",
    },
    {
      href: "/blog/mvp-etapy-sroki-pervyy-reliz",
      title: "Этапы MVP",
      description: "Как ограничить первый релиз и не раздуть объём.",
    },
    {
      href: "/blog/vnutrennee-veb-prilozhenie-dlya-biznesa",
      title: "Внутреннее приложение",
      description: "Когда задача уже про процесс команды, а не рынок.",
    },
  ],
  "vnutrennee-veb-prilozhenie-dlya-biznesa": [
    {
      href: "/uslugi/razrabotka-mvp",
      title: "Разработка MVP",
      description: "Первый релиз продукта или внутреннего инструмента.",
    },
    {
      href: "/uslugi/avtomatizatsiya-biznes-processov",
      title: "Автоматизация процесса",
      description: "Когда достаточно workflow без отдельного приложения.",
    },
    {
      href: "/blog/stoimost-razrabotki-mvp",
      title: "Стоимость MVP",
      description: "Какие части увеличивают бюджет веб-приложения.",
    },
  ],
  "no-code-avtomatizatsiya-ili-custom-workflow": [
    {
      href: "/uslugi/avtomatizatsiya-biznes-processov",
      title: "Автоматизация бизнес-процессов",
      description: "Workflow, интеграции, AI и контроль ошибок.",
    },
    {
      href: "/blog/avtomatizatsiya-obrabotki-zayavok",
      title: "Автоматизация обработки заявок",
      description: "Как проходит заявка от формы до ответственного.",
    },
    {
      href: "/blog/vnutrennee-veb-prilozhenie-dlya-biznesa",
      title: "Внутреннее приложение",
      description: "Когда workflow нужен отдельный интерфейс.",
    },
  ],
  "cursor-rules": [
    {
      href: "/blog/agents-ready-project",
      title: "Подготовка проекта к AI-агентам",
      description: "AGENTS.md, правила, спеки и механические ограничители.",
    },
    {
      href: "/blog/agents-md-primer",
      title: "AGENTS.md",
      description: "Пример и шаблон файла инструкций для AI-агентов.",
    },
    {
      href: "/gridfin/",
      title: "Gridfin",
      description: "Application Skeleton с rules, specs, tests и gates.",
    },
  ],
  "github-spec-kit": [
    {
      href: "/blog/spec-driven-development",
      title: "Spec-driven development",
      description: "Разработка через спецификации на практике.",
    },
    {
      href: "/gridfin/docs/application-skeleton",
      title: "Application Skeleton",
      description: "Чем каркас приложения отличается от boilerplate.",
    },
    {
      href: "/cases/gridfin",
      title: "Кейс Gridfin",
      description: "Как процесс встроен в собственный продукт.",
    },
  ],
  "agents-md-primer": [
    {
      href: "/blog/agents-ready-project",
      title: "Проект для AI-агентов",
      description: "Какие правила и проверки нужны вокруг AGENTS.md.",
    },
    {
      href: "/blog/cursor-rules",
      title: "Cursor rules",
      description: "Как правила работают в Cursor и чем отличаются.",
    },
    {
      href: "/gridfin/",
      title: "Gridfin",
      description: "Готовый каркас для Claude Code с правилами и гейтами.",
    },
  ],
  "spec-driven-development": [
    {
      href: "/blog/github-spec-kit",
      title: "GitHub Spec Kit",
      description: "Инструментарий для spec-driven development.",
    },
    {
      href: "/blog/agents-ready-project",
      title: "Проект для AI-агентов",
      description: "Как спеки, правила и тесты собираются в систему.",
    },
    {
      href: "/gridfin/guides/why-ai-needs-engineering-rules",
      title: "Зачем AI нужны инженерные правила",
      description: "Почему rules-файла недостаточно без hooks и gates.",
    },
  ],
  "agents-ready-project": [
    {
      href: "/blog/agents-md-primer",
      title: "AGENTS.md",
      description: "Конкретный пример файла инструкций для агентов.",
    },
    {
      href: "/cases/qa-pilot",
      title: "Кейс qa-pilot",
      description: "QA-копилот для аудита, планирования и тестирования.",
    },
    {
      href: "/gridfin/",
      title: "Gridfin",
      description: "Application Skeleton для проектов с Claude Code.",
    },
  ],
};

function relatedLinksFor(slug: string): RelatedLink[] {
  return isRu
    ? (relatedBySlug[slug] ?? defaultRelatedLinksRu)
    : defaultRelatedLinksEn;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getPublishedArticleBySlugForMarket(env.SITE_MARKET, slug);
  if (!article) {
    notFound();
  }

  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const articleUrl = publicUrl(
    env.SITE_MARKET,
    baseURL,
    `/blog/${article.slug}`,
  );
  const relatedLinks = relatedLinksFor(article.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        inLanguage: marketContent.lang,
        url: articleUrl,
        ...(article.cover && { image: `${baseURL}${article.cover}` }),
        author: {
          "@type": "Organization",
          "@id": `${baseURL}/#organization`,
          name: "Ludvik4",
          url: baseURL,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${baseURL}/#organization`,
          name: "Ludvik4",
          url: baseURL,
        },
        about: relatedLinks.map((link) => link.title),
        mainEntityOfPage: articleUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: articleCopy.home,
            item: `${baseURL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: articleCopy.blog,
            item: publicUrl(env.SITE_MARKET, baseURL, "/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: articleUrl,
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
        <Breadcrumbs
          items={[
            { label: articleCopy.blog, href: "/blog" },
            { label: article.title },
          ]}
        />
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

        <aside className="border-pink-soft mt-12 border-y py-6">
          <p className="text-muted-foreground font-mono text-xs font-semibold tracking-widest uppercase">
            {articleCopy.sourceEyebrow}
          </p>
          <p className="mt-3 max-w-3xl leading-relaxed">
            {articleCopy.sourceBody}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as Route}
                className="border-border bg-card hover:border-primary/40 rounded-xl border p-4 transition-colors"
              >
                <h2 className="text-sm font-bold">{link.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {link.description}
                </p>
              </Link>
            ))}
          </div>
        </aside>

        <div className="border-pink-soft bg-accent mt-14 rounded-2xl border p-6">
          <h2 className="text-lg font-bold">{articleCopy.ctaTitle}</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {articleCopy.ctaBody}
          </p>
          <div className="mt-4">
            <Button asChild size="sm">
              <Link href="/#contact">{articleCopy.ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-surface-warm mt-14">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 font-mono text-sm">
          <span>© 2026 Ludvik4</span>
          <Link href="/blog" className="hover:text-foreground">
            {articleCopy.allArticles}
          </Link>
        </div>
      </footer>
    </div>
  );
}
