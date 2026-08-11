import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { jsonLdString } from "@/lib/json-ld";
import { Breadcrumbs } from "./breadcrumbs";
import { getMarketContent } from "./content";
import type {
  InternationalGuide,
  InternationalServicePage,
  InternationalWorkItem,
} from "./international-content";
import {
  internationalGuides,
  internationalWork,
} from "./international-content";
import { publicUrl } from "./seo";
import { Eyebrow, Section, SiteFooter, SiteHeader } from "./site-chrome";

const enContent = getMarketContent("en");

function InternationalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={enContent} />
      <main className="flex-1">{children}</main>
      <SiteFooter content={enContent} />
    </div>
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

function EnquiryCta() {
  return (
    <section className="bg-surface-warm">
      <div className="mx-auto max-w-3xl px-6 py-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Discuss a similar project
        </h2>
        <p className="text-muted-foreground mt-3">
          Describe the problem, current situation, and outcome you need. I will
          suggest a sensible first step.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/#contact">Send a project enquiry</Link>
        </Button>
      </div>
    </section>
  );
}

export function InternationalServiceView({
  service,
  baseUrl,
}: {
  service: InternationalServicePage;
  baseUrl: string;
}) {
  const url = publicUrl("en", baseUrl, `/services/${service.slug}`);
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
        provider: { "@id": `${baseUrl}/#organization` },
        areaServed: "Worldwide",
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${baseUrl}/#contact`,
        },
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
            name: "Services",
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
    <InternationalShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs
          homeLabel="Home"
          items={[
            { label: "Services", href: "/#services" },
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
            Outcome
          </p>
          <p className="mt-2 max-w-3xl leading-relaxed">{service.outcome}</p>
        </div>
      </div>

      <Section>
        <div className="grid gap-12">
          <BulletSection title="When this is a good fit" items={service.fit} />
          <BulletSection
            title="What the engagement includes"
            items={service.deliverables}
          />
          <BulletSection title="Typical projects" items={service.examples} />
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Delivery process
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
            title="Baseline boundaries"
            items={service.boundaries}
          />
          {relatedGuide ? (
            <section>
              <h2 className="text-2xl font-semibold tracking-tight">
                Related planning guide
              </h2>
              <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
                Use the practical worksheet before requesting an estimate. It
                makes the starting context, open questions, and first useful
                scope easier to review.
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
      <EnquiryCta />
    </InternationalShell>
  );
}

function WorkCard({ item }: { item: InternationalWorkItem }) {
  return (
    <Link
      href={`/work/${item.slug}` as Route}
      className="border-border bg-card hover:border-primary/60 block rounded-2xl border p-6 transition-colors"
    >
      <p className="text-muted-foreground font-mono text-xs font-semibold tracking-widest uppercase">
        {item.kind}
      </p>
      <h2 className="mt-3 text-2xl font-bold">{item.title}</h2>
      <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
        {item.description}
      </p>
      <span className="text-primary mt-5 inline-block font-mono text-sm font-semibold">
        Read the case study →
      </span>
    </Link>
  );
}

export function InternationalWorkIndexView() {
  return (
    <InternationalShell>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs homeLabel="Home" items={[{ label: "Work" }]} />
        <div className="mt-10 max-w-3xl">
          <Eyebrow>Selected work</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Products with public evidence
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            Work appears here when the product, code, or outcome can be checked
            publicly. The first case is an open-source tool built and maintained
            in the open.
          </p>
        </div>
        <div className="mt-10 grid gap-5">
          {internationalWork.map((item) => (
            <WorkCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
      <EnquiryCta />
    </InternationalShell>
  );
}

export function InternationalWorkView({
  item,
  baseUrl,
}: {
  item: InternationalWorkItem;
  baseUrl: string;
}) {
  const url = publicUrl("en", baseUrl, `/work/${item.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.description,
    url,
    creator: { "@id": `${baseUrl}/#organization` },
    sameAs: item.website,
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
            { label: "Work", href: "/work" as Route },
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
        </div>
      </div>
      <Section>
        <div className="grid max-w-3xl gap-12">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Problem</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {item.problem}
            </p>
          </section>
          <BulletSection title="What I built" items={item.solution} />
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Result</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {item.result}
            </p>
          </section>
        </div>
      </Section>
      <EnquiryCta />
    </InternationalShell>
  );
}

export function InternationalAboutView() {
  return (
    <InternationalShell>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <Breadcrumbs homeLabel="Home" items={[{ label: "About" }]} />
        <div className="mt-10 max-w-3xl">
          <Eyebrow>About Ludvik4</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            A founder-led web product studio in Europe
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
            I design and build focused websites, workflow automations, and web
            applications for founders and small teams worldwide. Every project
            has one accountable lead from the first problem statement through
            launch and handover.
          </p>
        </div>
      </div>
      <Section>
        <div className="grid max-w-3xl gap-12">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Direct communication, explicit scope
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              You work directly with the person making product and engineering
              decisions. I turn the initial idea or operational problem into a
              written scope, surface assumptions early, and keep delivery tied
              to an observable outcome rather than an expanding feature list.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Small by design, not limited to one discipline
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              The studio stays founder-led. Trusted specialists join only when
              the agreed work needs a dedicated discipline; accountability and
              day-to-day communication do not move to an account layer.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Engineering evidence over AI theatre
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              AI is part of the toolchain, alongside specifications, version
              control, automated tests, review, and deployment checks. Public
              open-source work such as qa-pilot shows how those controls are
              applied in practice.
            </p>
          </section>
        </div>
      </Section>
      <EnquiryCta />
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
