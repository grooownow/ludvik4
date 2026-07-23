import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/features/faq";
import { jsonLdString } from "@/lib/json-ld";
import { type MarketContent, TELEGRAM_URL } from "./content";
import { buildHomeJsonLd } from "./seo";
import {
  Eyebrow,
  Section,
  ServiceGrid,
  SiteFooter,
  SiteHeader,
} from "./site-chrome";

// Russian market home. Richer than EN by design (brief §Информационная
// архитектура): hero + illustration · services · tag chips · how-it-works ·
// pricing · FAQ · studio · contact WITHOUT a form (Telegram is the only CTA).

export function HomeRu({
  content,
  baseUrl,
}: {
  content: MarketContent;
  baseUrl: string;
}) {
  const jsonLd = buildHomeJsonLd(content, baseUrl);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <SiteHeader content={content} />

      {/* Hero */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>{content.hero.eyebrow}</Eyebrow>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
              {content.hero.title}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-lg">
              {content.hero.lead}
            </p>
            <div className="mt-7">
              <Button asChild size="lg">
                <Link href="#contact">{content.hero.cta}</Link>
              </Button>
            </div>
          </div>
          {content.hero.illustration ? (
            <div className="hidden lg:block lg:justify-self-end">
              <Image
                src="/hero-product-illustration.png"
                alt="Схема создания цифрового продукта: от идеи и макета через код к запуску и аналитике"
                width={1536}
                height={1024}
                priority
                sizes="(min-width: 1024px) 480px, 100vw"
                className="h-auto w-full max-w-xl"
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Services */}
      <Section id="services">
        <Eyebrow>{content.services.eyebrow}</Eyebrow>
        <ServiceGrid items={content.services.items} />
      </Section>

      {/* How it works */}
      {content.howItWorks ? (
        <Section>
          <Eyebrow>{content.howItWorks.eyebrow}</Eyebrow>
          <p className="max-w-2xl text-xl font-semibold tracking-tight text-balance">
            {content.howItWorks.lead}
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {content.howItWorks.steps.map((step) => (
              <div key={step.n}>
                <span className="text-primary font-mono text-sm font-bold">
                  {step.n}
                </span>
                <h3 className="mt-2 font-bold">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Pricing */}
      {content.pricing ? (
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <Eyebrow>{content.pricing.eyebrow}</Eyebrow>
              <h2 className="text-3xl font-semibold tracking-tight text-balance">
                {content.pricing.title}
              </h2>
              <p className="text-muted-foreground mt-5 max-w-md">
                {content.pricing.intro}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {content.pricing.rows.map((p) => (
                <div
                  key={p.title}
                  className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-2xl border px-6 py-5 ${
                    p.note
                      ? "border-[#f1b2d0] bg-[#fff0f6]"
                      : "border-border bg-card"
                  }`}
                >
                  <div>
                    <span className="font-semibold">{p.title}</span>
                    {p.note ? (
                      <span className="text-muted-foreground mt-1 block max-w-xs text-sm">
                        {p.note}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-primary font-mono font-semibold whitespace-nowrap">
                    {p.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* FAQ */}
      {content.faq ? <FaqSection /> : null}

      {/* About / studio */}
      {content.about ? (
        <Section>
          <Eyebrow>{content.about.eyebrow}</Eyebrow>
          <p className="max-w-2xl text-lg leading-relaxed text-pretty">
            {content.about.body}
          </p>
        </Section>
      ) : null}

      {/* Contact — no form; Telegram is the primary and only action. Single
          centered column keeps the warm block balanced without an empty slot. */}
      <section id="contact" className="bg-surface-warm">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <Eyebrow>{content.contact.eyebrow}</Eyebrow>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {content.contact.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md">
            {content.contact.body}
          </p>
          <div className="mt-7">
            <Button asChild size="lg">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                {content.contact.telegramText}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter content={content} />
    </div>
  );
}
