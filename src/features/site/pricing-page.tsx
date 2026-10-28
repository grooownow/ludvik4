import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { jsonLdString } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
import type { MarketContent } from "./content";
import { HomeClosing } from "./home-sections";
import { MotionGallery } from "./motion-gallery";
import { OrderCta } from "./order-cta";
import { PricingBenefits } from "./pricing-benefits";
import {
  type PricingService,
  pricingHref,
  pricingServices,
} from "./pricing-draft";
import { LegacyHashRedirect, PricingTabs } from "./pricing-tabs";
import { SiteFooter, SiteHeader } from "./site-chrome";

// /uslugi, services and prices (owner review, 2026-10-26). One tab per
// collection hall, each its own page /uslugi/<slug>; in each — what the
// client gets, what little we need from them, three packages, and a link to
// the service's detailed page. Built from the home's
// visual language: mono eyebrows, the two-part title with the pink accent,
// 1rem-rounded cards on a soft pink line. Texts and icons are placeholders.

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-stage-muted font-mono text-xs tracking-[0.14em] uppercase">
      {children}
    </p>
  );
}

/** One quiet line: little is needed from the client, the rest is on us. */
function Needs({ items }: { items: string[] }) {
  return (
    <div className="border-primary/30 mt-12 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-dashed px-6 py-5">
      <Eyebrow>От вас</Eyebrow>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="bg-pink-soft/70 rounded-full px-3.5 py-1.5 text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
      <p className="text-stage-muted text-sm">Остальное — на нас.</p>
    </div>
  );
}

// Packages: each card lists only what it adds to the one before ("Всё из
// Базового, плюс:"), so the list grows from left to right. Cards stretch to
// one height; the order button sits at the bottom of each.
function Packages({ service }: { service: PricingService }) {
  return (
    <>
      <ul className="mt-6 grid gap-4 lg:grid-cols-3">
        {service.packages.map((pack) => (
          <li
            key={pack.name}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6 sm:p-7",
              pack.featured
                ? "border-primary bg-white shadow-[0_24px_60px_-34px_rgba(255,79,182,0.7)]"
                : "border-pink-soft bg-white/60",
            )}
          >
            {pack.featured ? (
              <span className="bg-primary absolute -top-3 right-6 rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-white uppercase">
                Чаще выбирают
              </span>
            ) : null}
            <Eyebrow>{pack.name}</Eyebrow>
            <p className="mt-3 flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight">
                {pack.price}
              </span>
              {pack.oldPrice ? (
                <s className="text-stage-muted text-lg">{pack.oldPrice}</s>
              ) : null}
            </p>
            {pack.priceNote ? (
              <p className="text-stage-muted mt-1 text-sm">{pack.priceNote}</p>
            ) : null}
            {pack.promo ? (
              <p className="text-primary mt-1 text-sm font-medium">
                {pack.promo}
              </p>
            ) : null}
            <p className="text-stage-muted mt-1 text-sm">{pack.term}</p>
            {pack.includes ? (
              <p className="text-foreground mt-6 text-sm font-medium">
                {pack.includes}
              </p>
            ) : null}
            <ul
              className={cn(
                "mb-8 space-y-3.5 text-[15px] leading-snug",
                pack.includes ? "mt-3" : "mt-6",
              )}
            >
              {pack.items.map((item, i) => (
                <li
                  key={`${item}-${i}`}
                  className="text-foreground/80 flex gap-3"
                >
                  <span aria-hidden="true" className="text-primary">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button
              asChild
              size="lg"
              variant={pack.featured ? "default" : "outline"}
              className="mt-auto h-12 w-full rounded-full text-base font-medium"
            >
              <OrderCta
                target={{
                  service: service.name,
                  plan: pack.name,
                  price: pack.price,
                }}
                placement="service"
              >
                Заказать
              </OrderCta>
            </Button>
          </li>
        ))}
      </ul>
      <p className="text-stage-muted mt-5 text-sm leading-relaxed">
        <span className="text-foreground font-medium">Во всех пакетах:</span>{" "}
        {service.everywhere.join(" · ")}. {service.everywhereNote}
      </p>
    </>
  );
}

function ServicePanel({ service }: { service: PricingService }) {
  return (
    <article aria-labelledby={`title-${service.id}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <div className="max-w-2xl">
          <Eyebrow>{service.hall}</Eyebrow>
          <h2
            id={`title-${service.id}`}
            className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {service.name}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {service.lead}
          </p>
          {service.related ? (
            <ul className="mt-4 space-y-1.5 text-sm">
              {service.related.map((r) => (
                <li key={r.href} className="text-stage-muted">
                  {r.text}{" "}
                  <Link
                    href={r.href as Route}
                    className="text-primary hover:text-primary/80 font-medium whitespace-nowrap"
                  >
                    {r.label} →
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      {service.examples ? (
        <>
          <h3 className="mt-12 text-xl font-semibold tracking-tight">
            Например
          </h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {service.examples.map((example) => (
              <li
                key={example.title}
                className="bg-pink-soft/50 rounded-2xl px-5 py-4"
              >
                {example.href ? (
                  <Link
                    href={example.href as Route}
                    className="hover:text-primary font-semibold tracking-tight underline decoration-1 underline-offset-4 transition-colors"
                  >
                    {example.title}
                  </Link>
                ) : (
                  <p className="font-semibold tracking-tight">
                    {example.title}
                  </p>
                )}
                <p className="text-muted-foreground mt-1 text-sm leading-snug">
                  {example.link ? (
                    <>
                      {example.text.split(example.link.text)[0]}
                      <Link
                        href={example.link.href as Route}
                        className="text-foreground hover:text-primary underline decoration-1 underline-offset-2 transition-colors"
                      >
                        {example.link.text}
                      </Link>
                      {example.text
                        .split(example.link.text)
                        .slice(1)
                        .join(example.link.text)}
                    </>
                  ) : (
                    example.text
                  )}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {service.gallery ? (
        <>
          <h3 className="mt-12 text-xl font-semibold tracking-tight">
            Потрогайте сами
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Наведите курсор или коснитесь — анимации отвечают на ваши движения.
          </p>
          <div className="mt-6">
            <MotionGallery />
          </div>
        </>
      ) : null}

      {/* What they get, as plain statements; below it the short list of
          what we need from them. */}
      <h3 className="mt-12 text-xl font-semibold tracking-tight">
        Что вы получаете
      </h3>
      <div className="mt-6">
        <PricingBenefits items={service.benefits} />
        <Needs items={service.needs} />
      </div>

      {service.tech ? (
        <>
          <h3 className="mt-16 text-xl font-semibold tracking-tight">
            Под капотом
          </h3>
          <ul className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.tech.map((item) => (
              <li key={item.title}>
                <p className="text-stage-muted font-mono text-[11px] tracking-[0.14em] uppercase">
                  {item.title}
                </p>
                <p className="text-foreground/80 mt-1.5 text-sm leading-relaxed">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h3 className="mt-16 text-xl font-semibold tracking-tight">Пакеты</h3>
      <Packages service={service} />

      {service.detailHref ? (
        <Link
          href={service.detailHref as Route}
          className="mt-8 inline-block border-b border-current text-sm"
        >
          Подробнее об услуге →
        </Link>
      ) : null}
    </article>
  );
}

/** Service + offers (one per package) + breadcrumbs, for a tab's own page. */
function serviceJsonLd(service: PricingService, baseUrl: string) {
  const url = `${baseUrl}${pricingHref(service.id)}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.name,
        description: service.lead,
        url,
        areaServed: "RU",
        provider: { "@type": "Organization", name: "Ludvik4", url: baseUrl },
        offers: service.packages.map((pack) => ({
          "@type": "Offer",
          name: pack.name,
          priceCurrency: "RUB",
          price: pack.price.replace(/[^\d]/g, ""),
          url,
        })),
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
            item: `${baseUrl}/uslugi/`,
          },
          { "@type": "ListItem", position: 3, name: service.name, item: url },
        ],
      },
    ],
  };
}

/**
 * /uslugi (the hub, first tab open) and each tab's own page,
 * /uslugi/<slug> (`activeId` set): there the title names the service.
 */
export function PricingPageView({
  content,
  activeId,
  baseUrl,
}: {
  content: MarketContent;
  activeId?: string;
  baseUrl?: string;
}) {
  const tabs = pricingServices.map((s) => ({
    id: s.id,
    label: s.name,
    href: pricingHref(s.id),
  }));
  const active =
    pricingServices.find((s) => s.id === activeId) ?? pricingServices[0]!;
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {activeId && baseUrl ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdString(serviceJsonLd(active, baseUrl)),
          }}
        />
      ) : (
        <LegacyHashRedirect tabs={tabs} />
      )}
      <SiteHeader content={content} />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
          <Eyebrow>Услуги и цены</Eyebrow>
          <h1 className="mt-3 text-4xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
            {activeId ? (
              <>
                {active.name} —{" "}
                <span className="text-primary">пакеты и цены.</span>
              </>
            ) : (
              <>
                Что мы делаем —{" "}
                <span className="text-primary">и сколько это стоит.</span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl leading-relaxed">
            Цену и сроки фиксируем в договоре до начала работы — вы заранее
            знаете, сколько заплатите и что получите. Выберите услугу, чтобы
            сравнить пакеты.
          </p>
        </section>

        <section className="border-pink-soft border-t">
          <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
            <PricingTabs tabs={tabs} activeId={active.id} />
            <div className="mt-10">
              <ServicePanel service={active} />
            </div>
          </div>
        </section>

        <HomeClosing
          copy={{
            eyebrow: "Не нашли свою задачу?",
            title: "Расскажите идею — оценим.",
            cta: "Обсудить проект",
          }}
        />
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
