import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/features/lead";
import { jsonLdString } from "@/lib/json-ld";
import { type MarketContent, TELEGRAM_URL } from "./content";
import { ServiceScopes } from "./service-scopes";
import { buildHomeJsonLd } from "./seo";
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

      {/* Hero — the illustration is a full-bleed backdrop, not a column: its
          empty left half carries the copy, the diagram sits on the right.
          Height comes from `min-h` alone. Do NOT reach for `aspect-[3/1]`
          here: combined with a min-height the browser resolves the band's
          WIDTH from the ratio (min-h × 3 = 1248px at a 1024px viewport) and
          the whole page gains a horizontal scrollbar. Below lg the band is
          text-only — a 3:1 backdrop there would either shrink to a stripe or
          swallow the copy. */}
      <div className="relative w-full lg:min-h-[26rem] xl:min-h-[30rem]">
        {content.hero.illustration ? (
          // z-0, not -z-10: a negative index would drop the image behind the
          // page's own opaque `bg-background`, rendering it invisible.
          <div className="absolute inset-0 z-0 hidden overflow-hidden lg:block">
            <Image
              src="/hero-product-wide.png"
              alt="How a digital product is built: from idea and mockup through code to launch and analytics"
              fill
              priority
              quality={95}
              sizes="100vw"
              // `contain`, not `cover`: below ~1280 the copy makes the band
              // taller than the artwork's 3:1, and `cover` would then scale up
              // and clip the right-hand cards off-screen. The artwork's own
              // background is #fefdfd, so the letterboxing is invisible.
              className="object-contain object-right"
            />
            {/* Readability scrim. The artwork's left half is near-white but
                one wireframe card reaches into the headline's last line; the
                wash hides it while leaving the diagram itself untouched from
                ~70% rightwards. */}
            <div className="from-background/60 via-background/90 absolute inset-0 bg-gradient-to-r from-15% via-48% to-transparent to-72%" />
          </div>
        ) : null}
        <div className="relative z-10 mx-auto flex h-full max-w-5xl items-center px-6 py-16">
          <div className="max-w-xl">
            <Eyebrow>{content.hero.eyebrow}</Eyebrow>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
              {content.hero.title}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-lg text-lg">
              {content.hero.lead}
            </p>
            <div className="mt-7">
              <Button asChild size="lg">
                <Link href="#contact">{content.hero.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <Section id="services">
        <Eyebrow>{content.services.eyebrow}</Eyebrow>
        <ServiceGrid items={content.services.items} />
      </Section>

      {/* Process */}
      {content.howItWorks ? (
        <Section>
          <Eyebrow>{content.howItWorks.eyebrow}</Eyebrow>
          <p className="max-w-3xl text-xl font-semibold tracking-tight text-balance">
            {content.howItWorks.lead}
          </p>
          <div className="mt-9 grid gap-8 sm:grid-cols-3">
            {content.howItWorks.steps.map((step) => (
              <div key={step.n}>
                <p className="text-primary font-mono text-xs font-semibold">
                  {step.n}
                </p>
                <h2 className="mt-3 font-semibold">{step.title}</h2>
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

      {/* AI-assisted development — the hook for GitHub/qa-pilot visitors */}
      {content.aiBlock ? (
        <Section>
          <Eyebrow>{content.aiBlock.eyebrow}</Eyebrow>
          <p className="max-w-2xl text-xl font-semibold tracking-tight text-balance">
            {content.aiBlock.title}
          </p>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            {content.aiBlock.body}
          </p>
        </Section>
      ) : null}

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
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                {content.contact.telegramText}
              </a>
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
