import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { TelegramLink } from "@/components/telegram-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/features/lead";
import { AnchorLink } from "./anchor-link";
import { jsonLdString } from "@/lib/json-ld";
import { type MarketContent, TELEGRAM_URL } from "./content";
import { ServiceScopes } from "./service-scopes";
import { buildHomeJsonLd } from "./seo";
import { internationalFaq } from "./international-content";
import { InternationalWorkGrid } from "./international-work-grid";
import {
  Eyebrow,
  Section,
  ServiceGrid,
  SiteFooter,
  SiteHeader,
} from "./site-chrome";

// International (English) market home. Shorter than RU by design (brief):
// hero + illustration, services, process, scope, AI-assisted-development, and
// contact WITH the existing lead form. No pricing block, no blog.

export function HomeEn({
  content,
  baseUrl,
  turnstileSiteKey,
}: {
  content: MarketContent;
  baseUrl: string;
  turnstileSiteKey?: string;
}) {
  const jsonLd = buildHomeJsonLd(content, baseUrl);
  const form = content.contact.form;
  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <SiteHeader content={content} />

      {/* Hero — same two-column composition as the RU market: copy left,
          illustration right, hidden below lg. */}
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
                <AnchorLink href="#contact">{content.hero.cta}</AnchorLink>
              </Button>
            </div>
          </div>
          {content.hero.illustration ? (
            <div className="hidden lg:block lg:justify-self-end">
              <Image
                src="/hero-product-diagram.png"
                alt="How a digital product is built: from idea and mockup through code to launch and analytics"
                width={1021}
                height={622}
                // q=95, not the default 75: this flat-colour vector export
                // bands visibly on its thin pink strokes when compressed
                // harder. Next 16 serves only the levels declared in
                // `images.qualities` and silently falls back to 75 otherwise.
                quality={95}
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
        <h2 className="mb-8 text-3xl font-semibold tracking-tight text-balance">
          {content.services.title}
        </h2>
        <ServiceGrid items={content.services.items} />
      </Section>

      {/* Process */}
      {content.howItWorks ? (
        <Section>
          <Eyebrow>{content.howItWorks.eyebrow}</Eyebrow>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance">
            {content.howItWorks.title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
            {content.howItWorks.lead}
          </p>
          <div className="mt-9 grid gap-8 sm:grid-cols-3">
            {content.howItWorks.steps.map((step) => (
              <div key={step.n}>
                <p className="text-primary font-mono text-xs font-semibold">
                  {step.n}
                </p>
                <h3 className="mt-3 font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* What's included — no public EN pricing */}
      {content.scopes ? <ServiceScopes scopes={content.scopes} /> : null}

      <Section id="work">
        <Eyebrow>Selected work</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight">
          Public work you can inspect
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          Evidence matters more than a list of technologies. These products have
          public code, documentation, or a working product experience you can
          inspect directly.
        </p>
        <InternationalWorkGrid />
        <Link
          href={"/work" as Route}
          className="text-primary mt-6 inline-block font-mono text-sm font-semibold"
        >
          View selected work →
        </Link>
      </Section>

      {/* AI-assisted development — the hook for GitHub/qa-pilot visitors */}
      {content.aiBlock ? (
        <Section>
          <Eyebrow>{content.aiBlock.eyebrow}</Eyebrow>
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance">
            {content.aiBlock.title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            {content.aiBlock.body}
          </p>
        </Section>
      ) : null}

      {content.about ? (
        <Section>
          <Eyebrow>{content.about.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-semibold tracking-tight">
            Direct responsibility from discovery to launch
          </h2>
          <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
            {content.about.body}
          </p>
          <Link
            href={"/about" as Route}
            className="text-primary mt-5 inline-block font-mono text-sm font-semibold"
          >
            How I work →
          </Link>
        </Section>
      ) : null}

      <Section id="faq">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="text-3xl font-semibold tracking-tight">
          Before you send an enquiry
        </h2>
        <Accordion type="single" collapsible className="mt-8">
          {internationalFaq.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground max-w-3xl leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* Contact — email form plus an optional direct Telegram link */}
      <section id="contact" className="bg-surface-warm">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>{content.contact.eyebrow}</Eyebrow>
            <h2 className="text-2xl font-bold tracking-tight">
              {content.contact.title}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-sm">
              {content.contact.body}
            </p>
            <p className="mt-6 font-mono text-sm">
              <TelegramLink
                href={TELEGRAM_URL}
                placement="home_contact"
                className="text-foreground underline underline-offset-4"
              >
                {content.contact.telegramText}
              </TelegramLink>
            </p>
          </div>
          <div>
            <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_14px_40px_-24px_rgba(26,26,26,0.18)]">
              <LeadForm
                turnstileSiteKey={turnstileSiteKey}
                labels={form?.labels}
              />
            </div>
            {form ? (
              <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                {form.privacyNotice.text}{" "}
                <Link
                  href={form.privacyNotice.href as Route}
                  className="text-foreground underline underline-offset-4"
                >
                  {form.privacyNotice.linkLabel}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <SiteFooter content={content} />
    </div>
  );
}
