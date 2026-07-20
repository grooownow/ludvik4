import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeadForm, type LeadFormLabels } from "@/features/lead";
import { env } from "@/lib/env";
import { jsonLdString } from "@/lib/json-ld";

const TELEGRAM_URL = "https://t.me/ludvik4";
const BASE_URL = env.NEXT_PUBLIC_APP_URL;

const TITLE = "Ludvik4 — digital products from idea to launch";
const DESCRIPTION =
  "A studio building digital products with a focus on AI-assisted development: websites, web apps & SaaS, AI tools & plugins, automation.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: "/en",
    languages: { ru: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en",
    siteName: "Ludvik4",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const services = [
  {
    module: "Module / Sites",
    title: "Sites",
    body: "Landing, promo and corporate sites — fast, responsive, SEO-ready.",
  },
  {
    module: "Module / SaaS",
    title: "Web apps & SaaS",
    body: "Products with logic, accounts and payments — subscription SaaS right in the browser: tracker, dashboard, CRM-lite, internal tools.",
  },
  {
    module: "Module / AI Kit",
    title: "AI tools & plugins",
    body: "Tools for teams and people who code with AI: plugins for AI assistants, starter kits, utilities and integrations.",
  },
  {
    module: "Module / Auto",
    title: "Automation",
    body: "Routine turned into scripts, bots and service integrations — with AI on top of ready-made models where it fits.",
  },
];

const EN_LEAD_LABELS: LeadFormLabels = {
  nameLabel: "Name",
  nameOptional: "optional",
  messageLabel: "Your task",
  messagePlaceholder: "Describe what you need…",
  contactLabel: "How to reach you",
  contactPlaceholder: "email or a messenger link / phone",
  submit: "Send request",
  submitting: "Sending…",
  success: "Request sent — we'll get back to you soon. Thanks!",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE_URL}/en#webpage`,
  url: `${BASE_URL}/en`,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "en",
  about: { "@type": "Organization", name: "Ludvik4", url: BASE_URL },
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-primary mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
      {children}
    </p>
  );
}

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-14">
      {children}
    </section>
  );
}

export default function EnHomePage() {
  return (
    <div lang="en" className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      {/* Top bar */}
      <header className="border-pink-soft bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <span className="font-mono text-sm font-bold tracking-tight">
            Ludvik4
          </span>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground font-mono text-sm"
            >
              RU
            </Link>
            <Button asChild size="sm">
              <Link href="#contact">Let&apos;s talk</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-2xl">
          <Eyebrow>Ludvik4</Eyebrow>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Digital products — from idea to launch
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg">
            Websites, web apps & SaaS, plugins and automation — with a focus on
            AI-assisted development.
          </p>
          <div className="mt-7">
            <Button asChild size="lg">
              <Link href="#contact">Let&apos;s talk</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Services */}
      <Section id="services">
        <Eyebrow>What we do</Eyebrow>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="border-border bg-card rounded-2xl border p-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="bg-primary/50 h-px w-8" />
                <span className="font-mono text-[10px] tracking-wider text-[#9ca3af] uppercase">
                  {s.module}
                </span>
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* AI-assisted development — the hook for GitHub/qa-pilot visitors */}
      <Section>
        <Eyebrow>AI-assisted development</Eyebrow>
        <p className="max-w-2xl text-xl font-semibold tracking-tight text-balance">
          We make projects AI-agent-ready
        </p>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          AGENTS.md, project rules, spec-driven development and the automation
          around them — the same discipline behind our open-source tooling, such
          as{" "}
          <a
            href="https://github.com/grooownow/qa-pilot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            qa-pilot
          </a>
          . We bring it to client work.
        </p>
      </Section>

      {/* Contact */}
      <section id="contact" className="bg-surface-warm">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="text-2xl font-bold tracking-tight">
              Tell us what you need
            </h2>
            <p className="text-muted-foreground mt-3 max-w-sm">
              Describe the task — we&apos;ll suggest a solution and where to
              start.
            </p>
            <p className="mt-6 font-mono text-sm">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                Or message us on Telegram → t.me/ludvik4
              </a>
            </p>
          </div>
          <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_14px_40px_-24px_rgba(26,26,26,0.18)]">
            <LeadForm
              turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              labels={EN_LEAD_LABELS}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-warm">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 font-mono text-sm">
          <span>© 2026 Ludvik4</span>
          <span className="flex items-center gap-5">
            <Link href="/" className="hover:text-foreground">
              RU
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Telegram
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
