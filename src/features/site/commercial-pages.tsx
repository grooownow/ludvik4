import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { jsonLdString } from "@/lib/json-ld";
import {
  caseStudies,
  type CaseStudy,
  type ServicePage,
} from "./commercial-content";
import { getMarketContent, TELEGRAM_URL } from "./content";
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

function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="text-muted-foreground font-mono text-sm"
    >
      <Link href="/" className="hover:text-foreground">
        Главная
      </Link>
      <span aria-hidden="true"> / </span>
      <span>{current}</span>
    </nav>
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

export function ServicePageView({
  service,
  baseUrl,
}: {
  service: ServicePage;
  baseUrl: string;
}) {
  const url = `${baseUrl}/uslugi/${service.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Organization",
          name: "Ludvik4",
          url: baseUrl,
        },
        areaServed: "RU",
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
        <Breadcrumbs current={service.title} />
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
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              Написать в Telegram
            </a>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}

export function CasesPreview() {
  return (
    <Section id="cases">
      <Eyebrow>Работы</Eyebrow>
      <h2 className="text-3xl font-semibold tracking-tight">
        Примеры проектов
      </h2>
      <p className="text-muted-foreground mt-4 max-w-2xl">
        Реальные продукты с публичным результатом: клиентский сервис и
        собственный open-source инструмент.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {caseStudies.map((item) => (
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
      <Link
        href={"/cases" as Route}
        className="text-primary mt-6 inline-block font-mono text-sm font-semibold"
      >
        Все кейсы →
      </Link>
    </Section>
  );
}

export function CasesIndexView() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs current="Кейсы" />
        <div className="mt-10">
          <Eyebrow>Работы</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Кейсы Ludvik4
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            Продукты, которые можно открыть, проверить и изучить подробнее.
          </p>
        </div>
      </div>
      <CasesPreview />
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
  const url = `${baseUrl}/cases/${study.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: study.description,
    url,
    image: `${baseUrl}${study.image}`,
    creator: { "@type": "Organization", name: "Ludvik4", url: baseUrl },
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs current={study.title} />
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
