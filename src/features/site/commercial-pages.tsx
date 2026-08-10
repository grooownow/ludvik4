import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { TelegramLink } from "@/components/telegram-link";
import { Button } from "@/components/ui/button";
import { jsonLdString } from "@/lib/json-ld";
import {
  caseStudies,
  type CaseStudy,
  type ServicePage,
} from "./commercial-content";
import { Breadcrumbs } from "./breadcrumbs";
import { getMarketContent, TELEGRAM_URL } from "./content";
import { publicUrl } from "./seo";
import { Eyebrow, Section, SiteFooter, SiteHeader } from "./site-chrome";

const ruContent = getMarketContent("ru");

function PageShell({
  children,
  contactHref = "/#contact",
}: {
  children: React.ReactNode;
  contactHref?: string;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={ruContent} contactHref={contactHref} />
      <main className="flex-1">{children}</main>
      <SiteFooter content={ruContent} />
    </div>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="border-border bg-card rounded-xl border p-4 text-sm leading-relaxed"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

type RelatedLink = {
  href: Route;
  title: string;
  description: string;
};

type ReadinessItem = {
  title: string;
  body: string;
};

const serviceRelatedLinks: Record<ServicePage["slug"], RelatedLink[]> = {
  "razrabotka-lendinga": [
    {
      href: "/blog/stoimost-lendinga-2026",
      title: "Сколько стоит лендинг",
      description: "Из чего складывается цена и что входит в базовую работу.",
    },
    {
      href: "/blog/chto-podgotovit-pered-zakazom-lendinga",
      title: "Что обдумать перед заказом",
      description: "Вопросы, которые помогают быстрее собрать структуру.",
    },
    {
      href: "/blog/lending-ili-mnogostranichnyy-sayt",
      title: "Лендинг или многостраничный сайт",
      description: "Как выбрать формат под задачу, рекламу и SEO.",
    },
  ],
  "avtomatizatsiya-biznes-processov": [
    {
      href: "/blog/ai-avtomatizatsiya-malogo-biznesa",
      title: "AI-автоматизация малого бизнеса",
      description: "Где AI уместен, а где достаточно обычной логики.",
    },
    {
      href: "/blog/avtomatizatsiya-obrabotki-zayavok",
      title: "Автоматизация обработки заявок",
      description: "Схема заявки от формы до ответственного и статуса.",
    },
    {
      href: "/blog/vnutrennee-veb-prilozhenie-dlya-biznesa",
      title: "Когда нужно внутреннее приложение",
      description: "Граница между автоматизацией, таблицей и отдельным UI.",
    },
  ],
  "razrabotka-mvp": [
    {
      href: "/blog/mvp-etapy-sroki-pervyy-reliz",
      title: "Этапы и состав MVP",
      description: "Как ограничить первый релиз одним рабочим сценарием.",
    },
    {
      href: "/blog/stoimost-razrabotki-mvp",
      title: "Стоимость разработки MVP",
      description: "Что влияет на бюджет компактного веб-приложения.",
    },
    {
      href: "/blog/vnutrennee-veb-prilozhenie-dlya-biznesa",
      title: "Внутреннее веб-приложение",
      description: "Когда готовых сервисов и таблиц уже недостаточно.",
    },
  ],
};

const serviceReadiness: Record<ServicePage["slug"], ReadinessItem[]> = {
  "razrabotka-lendinga": [
    {
      title: "Входные данные",
      body: "задача, аудитория, материалы, домен или доступы, ограничения по текстам и интеграциям",
    },
    {
      title: "Критерий готовности",
      body: "страница опубликована, адаптивна, объясняет предложение и ведёт к одному целевому действию",
    },
    {
      title: "Передача",
      body: "доступы, исходный код или проект, базовая аналитика и список гарантийных исправлений",
    },
  ],
  "avtomatizatsiya-biznes-processov": [
    {
      title: "Входные данные",
      body: "описание процесса, реальные примеры, доступы к системам, правила ошибок и ручных подтверждений",
    },
    {
      title: "Критерий готовности",
      body: "процесс проходит реальные сценарии, пишет логи и не теряет заявку, документ или статус",
    },
    {
      title: "Передача",
      body: "схема workflow, инструкция, доступы к коду или настройкам и границы поддержки после запуска",
    },
  ],
  "razrabotka-mvp": [
    {
      title: "Входные данные",
      body: "ключевой пользователь, сценарий, данные, роли, интеграции и критерий успешного первого релиза",
    },
    {
      title: "Критерий готовности",
      body: "пользователь может пройти основной сценарий в опубликованном продукте без ручной подмены результата",
    },
    {
      title: "Передача",
      body: "репозиторий, окружения, инструкция запуска, список известных ограничений и план следующих итераций",
    },
  ],
};

const serviceCaseLinks: Partial<Record<ServicePage["slug"], RelatedLink>> = {
  "avtomatizatsiya-biznes-processov": {
    href: "/cases/fortnoise",
    title: "FortNoise",
    description:
      "Кейс с каталогом, модерацией и рабочими процессами публикации.",
  },
  "razrabotka-mvp": {
    href: "/cases/gridfin",
    title: "Gridfin",
    description: "Собственный продукт с specs, тестами и quality gates.",
  },
};

function RelatedLinksSection({
  title,
  items,
}: {
  title: string;
  items: RelatedLink[];
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border-border bg-card hover:border-primary/40 rounded-xl border p-4 transition-colors"
          >
            <h3 className="text-sm font-bold">{item.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ReadinessSection({ items }: { items: ReadinessItem[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">
        Как фиксируется результат
      </h2>
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="border-border bg-card rounded-xl border p-4"
          >
            <dt className="text-primary font-mono text-xs font-semibold uppercase">
              {item.title}
            </dt>
            <dd className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.body}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ServicePageView({
  service,
  baseUrl,
}: {
  service: ServicePage;
  baseUrl: string;
}) {
  const url = publicUrl("ru", baseUrl, `/uslugi/${service.slug}`);
  const caseLink = serviceCaseLinks[service.slug];
  const relatedLinks = caseLink
    ? [...serviceRelatedLinks[service.slug], caseLink]
    : serviceRelatedLinks[service.slug];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        serviceType: service.eyebrow,
        description: service.description,
        provider: {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
          name: "Ludvik4",
          url: baseUrl,
        },
        areaServed: "Worldwide",
        audience: {
          "@type": "Audience",
          audienceType: "малый бизнес и основатели",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "RUB",
          price: service.price.replace(/[^\d]/g, ""),
          url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Услуги",
            item: `${baseUrl}/#services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <PageShell contactHref="#contact">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs
          items={[
            { label: "Услуги", href: "/#services" },
            { label: service.title },
          ]}
        />
        <div className="mt-10 max-w-3xl">
          <Eyebrow>{service.eyebrow}</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            {service.h1}
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            {service.lead}
          </p>
        </div>
        <dl className="border-pink-soft mt-10 grid border-y py-6 sm:grid-cols-3">
          <div className="py-3 sm:pr-6">
            <dt className="text-muted-foreground text-xs uppercase">Цена</dt>
            <dd className="mt-1 font-semibold">{service.price}</dd>
          </div>
          <div className="border-pink-soft py-3 sm:border-l sm:px-6">
            <dt className="text-muted-foreground text-xs uppercase">Срок</dt>
            <dd className="mt-1 font-semibold">{service.timeline}</dd>
          </div>
          <div className="border-pink-soft py-3 sm:border-l sm:pl-6">
            <dt className="text-muted-foreground text-xs uppercase">
              Результат
            </dt>
            <dd className="mt-1 text-sm leading-relaxed">{service.result}</dd>
          </div>
        </dl>
      </div>

      <Section>
        <div className="grid gap-12">
          <BulletSection title="Когда это подходит" items={service.forWhom} />
          <BulletSection title="Что входит в работу" items={service.includes} />
          <BulletSection title="Примеры задач" items={service.examples} />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Этапы работы
            </h2>
            <ol className="mt-5 grid gap-5 sm:grid-cols-2">
              {service.process.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="text-primary font-mono text-sm font-bold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <BulletSection
            title="Границы базовой оценки"
            items={service.boundaries}
          />
          <ReadinessSection items={serviceReadiness[service.slug]} />
          <RelatedLinksSection
            title="Связанные материалы"
            items={relatedLinks}
          />
        </div>
      </Section>

      <section id="contact" className="bg-surface-warm">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Обсудить похожую задачу
          </h2>
          <p className="text-muted-foreground mt-3">
            Коротко опишите задачу, текущую ситуацию и желаемый результат.
          </p>
          <Button asChild size="lg" className="mt-6">
            <TelegramLink href={TELEGRAM_URL} placement="service_contact">
              Написать в Telegram
            </TelegramLink>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}

/** The two-per-row card grid shared by the homepage preview and /cases. */
function CaseGrid({ items }: { items: CaseStudy[] }) {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/cases/${item.slug}` as Route}
          className="border-border bg-card hover:border-primary/40 overflow-hidden rounded-2xl border transition-colors"
        >
          <Image
            src={item.image}
            alt={item.imageAlt}
            width={1200}
            height={675}
            sizes="(min-width: 640px) 480px, 100vw"
            className="aspect-video w-full object-cover object-top"
          />
          <div className="p-6">
            <p className="text-primary font-mono text-xs">{item.kind}</p>
            <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** Homepage cases slot: FortNoise + Gridfin only, with the link to /cases. */
export const HOME_CASE_SLUGS = ["fortnoise", "gridfin"] as const;

export function CasesPreview() {
  const featured = HOME_CASE_SLUGS.map((slug) =>
    caseStudies.find((item) => item.slug === slug)!,
  );
  return (
    <Section id="cases">
      <Eyebrow>Работы</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight">
        Примеры проектов
      </h2>
      <p className="text-muted-foreground mt-4 max-w-2xl">
        Реальные продукты с публичным результатом: клиентский сервис и
        собственный продукт для Claude Code.
      </p>
      <CaseGrid items={featured} />
      <Link
        href={"/cases" as Route}
        className="text-primary mt-6 inline-block font-mono text-sm font-semibold"
      >
        Все кейсы →
      </Link>
    </Section>
  );
}

export function CasesIndexView({ baseUrl }: { baseUrl: string }) {
  const url = publicUrl("ru", baseUrl, "/cases");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Кейсы Ludvik4",
        description:
          "Публичные примеры сайтов, автоматизаций, MVP и AI-assisted development проектов Ludvik4.",
        url,
        isPartOf: { "@id": `${baseUrl}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: caseStudies.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: publicUrl("ru", baseUrl, `/cases/${item.slug}`),
            name: item.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Кейсы",
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs items={[{ label: "Кейсы" }]} />
        <div className="mt-10">
          <Eyebrow>Работы</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Кейсы Ludvik4
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            Продукты, которые можно открыть, проверить и изучить подробнее.
          </p>
          <CaseGrid items={caseStudies} />
        </div>
      </div>
    </PageShell>
  );
}

export function CaseStudyPageView({
  study,
  baseUrl,
}: {
  study: CaseStudy;
  baseUrl: string;
}) {
  const url = publicUrl("ru", baseUrl, `/cases/${study.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: study.title,
        description: study.description,
        url,
        image: `${baseUrl}${study.image}`,
        creator: { "@type": "Organization", name: "Ludvik4", url: baseUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Кейсы",
            item: publicUrl("ru", baseUrl, "/cases"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: study.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs
          items={[{ label: "Кейсы", href: "/cases" }, { label: study.title }]}
        />
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow>{study.kind}</Eyebrow>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {study.title}
            </h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
              {study.lead}
            </p>
            <a
              href={study.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mt-6 inline-block font-mono text-sm font-semibold"
            >
              Открыть проект ↗
            </a>
          </div>
          <Image
            src={study.image}
            alt={study.imageAlt}
            width={1200}
            height={675}
            priority
            sizes="(min-width: 1024px) 520px, 100vw"
            className="border-border aspect-video w-full rounded-2xl border object-cover object-top"
          />
        </div>
      </div>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Задача</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {study.task}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Решение</h2>
            <ul className="mt-4 space-y-3">
              {study.solution.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span className="text-primary" aria-hidden="true">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Результат</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {study.result}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Технологии
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {study.stack.map((item) => (
                <li
                  key={item}
                  className="border-pink-soft bg-accent rounded-full border px-3 py-1 font-mono text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
