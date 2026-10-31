import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaLink } from "./cta-link";
import { type Locale, localePrefix, localizeHref } from "@/lib/i18n";
import { jsonLdString } from "@/lib/json-ld";
import { Breadcrumbs } from "./breadcrumbs";
import { getLocaleBundle } from "./locale-content";
import type {
  InternationalGuide,
  InternationalServicePage,
  InternationalWorkItem,
} from "./international-content";
import { internationalGuides } from "./international-content";
import { InternationalWorkGrid } from "./international-work-grid";
import { publicUrl } from "./seo";
import { Eyebrow, Section, SiteFooter, SiteHeader } from "./site-chrome";

function InternationalShell({
  children,
  locale = "en",
}: {
  children: React.ReactNode;
  locale?: Locale;
}) {
  const { content } = getLocaleBundle(locale);
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={content} />
      <main className="flex-1">{children}</main>
      <SiteFooter content={content} />
    </div>
  );
}

/** Breadcrumbs in the page's language, starting at that language's home. */
function LocaleBreadcrumbs({
  locale,
  items,
}: {
  locale: Locale;
  items: { label: string; href?: string }[];
}) {
  const { ui } = getLocaleBundle(locale);
  return (
    <Breadcrumbs
      homeLabel={ui.breadcrumbs.home}
      homeHref={localizeHref(locale, "/")}
      ariaLabel={ui.breadcrumbs.aria}
      items={items.map((item) => ({
        label: item.label,
        ...(item.href
          ? { href: localizeHref(locale, item.href) as Route }
          : {}),
      }))}
    />
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
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
    </section>
  );
}

function EnquiryCta({ locale = "en" }: { locale?: Locale }) {
  const { enquiry } = getLocaleBundle(locale).ui;
  return (
    <section className="bg-surface-warm">
      <div className="mx-auto max-w-3xl px-6 py-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{enquiry.title}</h2>
        <p className="text-muted-foreground mt-3">{enquiry.body}</p>
        <Button asChild size="lg" className="mt-6">
          <CtaLink href={localizeHref(locale, "/contact")} placement="service">
            {enquiry.cta}
          </CtaLink>
        </Button>
      </div>
    </section>
  );
}

export function InternationalServiceView({
  service,
  baseUrl,
  locale = "en",
}: {
  service: InternationalServicePage;
  baseUrl: string;
  locale?: Locale;
}) {
  const { ui } = getLocaleBundle(locale);
  const home = `${baseUrl}${localizeHref(locale, "/")}`.replace(/(.)\/$/, "$1");
  const url = publicUrl(
    "en",
    baseUrl,
    localizeHref(locale, `/services/${service.slug}`),
  );
  const relatedGuide = internationalGuides.find(
    (guide) => guide.relatedService.href === `/services/${service.slug}`,
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        description: service.description,
        url,
        inLanguage: locale,
        provider: { "@id": `${baseUrl}/#organization` },
        areaServed: "Worldwide",
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${baseUrl}${localizeHref(locale, "/contact")}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: ui.breadcrumbs.home,
            item: locale === "en" ? `${baseUrl}/` : home,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: ui.breadcrumbs.services,
            item: `${baseUrl}${localizeHref(locale, "/#services")}`,
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
    <InternationalShell locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <LocaleBreadcrumbs
          locale={locale}
          items={[
            { label: ui.breadcrumbs.services, href: "/#services" },
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
        <div className="border-pink-soft mt-10 border-y py-6">
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {ui.service.outcome}
          </p>
          <p className="mt-2 max-w-3xl leading-relaxed">{service.outcome}</p>
        </div>
      </div>

      <Section>
        <div className="grid gap-12">
          <BulletSection title={ui.service.fit} items={service.fit} />
          <BulletSection
            title={ui.service.includes}
            items={service.deliverables}
          />
          <BulletSection title={ui.service.examples} items={service.examples} />
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              {ui.service.process}
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
          </section>
          <BulletSection
            title={ui.service.boundaries}
            items={service.boundaries}
          />
          {relatedGuide ? (
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                {ui.service.guideTitle}
              </h2>
              <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
                {ui.service.guideBody}
              </p>
              <Link
                href={`/guides/${relatedGuide.slug}` as Route}
                className="text-primary mt-5 inline-block font-mono text-sm font-semibold"
              >
                {relatedGuide.title} →
              </Link>
            </section>
          ) : null}
        </div>
      </Section>
      <EnquiryCta locale={locale} />
    </InternationalShell>
  );
}

export function InternationalWorkIndexView({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const { ui, work } = getLocaleBundle(locale);
  return (
    <InternationalShell locale={locale}>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <LocaleBreadcrumbs
          locale={locale}
          items={[{ label: ui.breadcrumbs.work }]}
        />
        <div className="mt-10 max-w-3xl">
          <Eyebrow>{ui.workIndex.eyebrow}</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {ui.workIndex.title}
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            {ui.workIndex.lead}
          </p>
        </div>
        <InternationalWorkGrid
          items={work}
          newTabLabel={ui.newTab}
          prefix={localePrefix(locale)}
        />
      </div>
      <EnquiryCta locale={locale} />
    </InternationalShell>
  );
}

export function InternationalWorkView({
  item,
  baseUrl,
  locale = "en",
}: {
  item: InternationalWorkItem;
  baseUrl: string;
  locale?: Locale;
}) {
  const { ui } = getLocaleBundle(locale);
  const url = publicUrl(
    "en",
    baseUrl,
    localizeHref(locale, `/work/${item.slug}`),
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.description,
    inLanguage: locale,
    url,
    creator: { "@id": `${baseUrl}/#organization` },
    sameAs: item.website,
  };

  return (
    <InternationalShell locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <LocaleBreadcrumbs
          locale={locale}
          items={[
            { label: ui.breadcrumbs.work, href: "/work" },
            { label: item.title },
          ]}
        />
        <div className="mt-10 max-w-3xl">
          <Eyebrow>{item.kind}</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {item.title}
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            {item.lead}
          </p>
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary mt-6 inline-block font-mono text-sm font-semibold"
          >
            {item.websiteLabel} →
          </a>
          <Image
            src={item.image}
            alt={item.imageAlt}
            width={1200}
            height={675}
            priority
            sizes="(min-width: 1024px) 768px, 100vw"
            className="border-border mt-8 aspect-video w-full rounded-2xl border object-cover object-top"
          />
        </div>
      </div>
      <Section>
        <div className="grid max-w-3xl gap-12">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              {ui.workPage.problem}
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {item.problem}
            </p>
          </section>
          <BulletSection title={ui.workPage.built} items={item.solution} />
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              {ui.workPage.result}
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {item.result}
            </p>
          </section>
        </div>
      </Section>
      <EnquiryCta locale={locale} />
    </InternationalShell>
  );
}

export function InternationalAboutView({ locale = "en" }: { locale?: Locale }) {
  const { about, breadcrumbs } = getLocaleBundle(locale).ui;
  return (
    <InternationalShell locale={locale}>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <LocaleBreadcrumbs
          locale={locale}
          items={[{ label: breadcrumbs.about }]}
        />
        <div className="mt-10 max-w-3xl">
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            {about.title}
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            {about.lead}
          </p>
        </div>
      </div>
      <Section>
        <div className="grid max-w-3xl gap-12">
          {about.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
          {/* The blog stays live and indexed, but off the home: this is its
              entry point beside the menu's Guides (owner, 2026-10-24). The
              articles are in English in every language. */}
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              {about.articlesTitle}
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {about.articlesBody}
            </p>
            <Link
              href={"/blog" as Route}
              className="mt-4 inline-block border-b border-current text-sm"
            >
              {about.articlesLink}
            </Link>
          </section>
        </div>
      </Section>
      <EnquiryCta locale={locale} />
    </InternationalShell>
  );
}

function GuideCard({ guide }: { guide: InternationalGuide }) {
  return (
    <Link
      href={`/guides/${guide.slug}` as Route}
      className="border-border bg-card hover:border-primary/60 block rounded-2xl border p-6 transition-colors"
    >
      <p className="text-muted-foreground font-mono text-xs font-semibold tracking-widest uppercase">
        {guide.eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold">{guide.title}</h2>
      <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
        {guide.summary}
      </p>
      <span className="text-primary mt-5 inline-block font-mono text-sm font-semibold">
        Open the guide →
      </span>
    </Link>
  );
}

export function InternationalGuideIndexView() {
  return (
    <InternationalShell>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs homeLabel="Home" items={[{ label: "Guides" }]} />
        <div className="mt-10 max-w-3xl">
          <Eyebrow>Decision tools</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Practical guides for planning a digital product
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            Short, reusable worksheets for clarifying a website brief, choosing
            an automation opportunity, and defining a credible MVP boundary
            before development starts.
          </p>
        </div>
        <div className="mt-10 grid gap-5">
          {internationalGuides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </div>
      <EnquiryCta />
    </InternationalShell>
  );
}

export function InternationalGuideView({
  guide,
  baseUrl,
}: {
  guide: InternationalGuide;
  baseUrl: string;
}) {
  const url = publicUrl("en", baseUrl, `/guides/${guide.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: guide.h1,
        description: guide.description,
        url,
        datePublished: "2026-08-11",
        dateModified: "2026-08-11",
        author: { "@id": `${baseUrl}/#organization` },
        publisher: { "@id": `${baseUrl}/#organization` },
        inLanguage: "en",
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: `${baseUrl}/guides`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <InternationalShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs
          homeLabel="Home"
          items={[
            { label: "Guides", href: "/guides" as Route },
            { label: guide.title },
          ]}
        />
        <div className="mt-10 max-w-3xl">
          <Eyebrow>{guide.eyebrow}</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            {guide.h1}
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            {guide.lead}
          </p>
        </div>
      </div>

      <Section>
        <div className="grid max-w-4xl gap-12">
          {guide.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
                {section.body}
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {section.items.map((item) => (
                  <article
                    key={item.title}
                    className="border-border bg-card rounded-xl border p-4"
                  >
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              {guide.worksheetTitle}
            </h2>
            <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
              {guide.worksheetIntro}
            </p>
            <dl className="mt-5 grid gap-3">
              {guide.worksheet.map((row) => (
                <div
                  key={row.label}
                  className="border-border bg-card grid gap-2 rounded-xl border p-4 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-5"
                >
                  <dt className="font-semibold">{row.label}</dt>
                  <dd className="text-muted-foreground text-sm leading-relaxed">
                    {row.prompt}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              {guide.decisionTitle}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {guide.decisions.map((decision) => (
                <article
                  key={decision.signal}
                  className="border-border rounded-xl border p-4"
                >
                  <h3 className="font-semibold">{decision.signal}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {decision.action}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-pink-soft border-t pt-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Turn the worksheet into a delivery scope
            </h2>
            <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
              The guide is a planning aid, not an estimate. The related service
              page explains the normal deliverables, process, and baseline
              boundaries for this kind of engagement.
            </p>
            <Link
              href={guide.relatedService.href as Route}
              className="text-primary mt-5 inline-block font-mono text-sm font-semibold"
            >
              {guide.relatedService.label} →
            </Link>
          </section>
        </div>
      </Section>
      <EnquiryCta />
    </InternationalShell>
  );
}
