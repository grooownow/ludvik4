import Link from "next/link";
import { ConsentSettingsButton } from "@/components/consent-settings-button";
import { Breadcrumbs } from "./breadcrumbs";
import { getMarketContent } from "./content";
import { SiteFooter, SiteHeader } from "./site-chrome";

// The international legal pages for a business established in Spain (design:
// docs/superpowers/specs/2026-10-31-en-storefront-parity-design.md). Written
// against the BOE consolidated texts of the LSSI and the TRLGDCU and the AEPD
// cookie guide (May 2024). Awaiting a lawyer's review.

const en = getMarketContent("en");
const EMAIL = "ludvik4good.me@gmail.com";
const UPDATED = "31 October 2026";

function Mail() {
  return (
    <a
      className="text-foreground underline underline-offset-4"
      href={`mailto:${EMAIL}`}
    >
      {EMAIL}
    </a>
  );
}

function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader content={en} />
      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        <Breadcrumbs items={[{ label: title }]} homeLabel="Home" />
        <p className="text-primary mt-10 mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
          Legal
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Last updated: {UPDATED}
        </p>
        <div className="mt-10 space-y-9 text-[15px] leading-7">{children}</div>
        <Link
          href="/"
          className="mt-12 inline-block font-mono text-sm underline underline-offset-4"
        >
          Back to Ludvik4
        </Link>
      </main>
      <SiteFooter content={en} />
    </div>
  );
}

function Part({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="text-muted-foreground mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function LegalNoticeView() {
  return (
    <LegalLayout title="Legal Notice">
      <Part title="Website owner">
        <p>
          This website is run by Ekaterina Pustovaia, a self-employed
          professional (autónoma) in Spain, trading as Ludvik4.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Address: Avenida de Francia 79, 46024 Valencia, Spain</li>
          <li>Tax ID (NIF): Z2391039X</li>
          <li>
            Email: <Mail />
          </li>
          <li>Activity: software design and development</li>
        </ul>
      </Part>
      <Part title="Prices">
        <p>
          Prices on this website are in euros and do not include VAT or other
          applicable taxes. Where VAT applies, it is set out in the written
          agreement.
        </p>
      </Part>
      <Part title="Intellectual property">
        <p>
          The content, design and code of this website belong to Ludvik4 or are
          used with permission. Please do not copy them without written consent.
          Client work shown here belongs to its respective owners.
        </p>
      </Part>
      <Part title="Use of this website">
        <p>
          Information here is general and may change. It is not a binding offer:
          a project starts only under a written agreement, as described in the{" "}
          <Link className="text-foreground underline" href="/terms-of-service">
            Terms of Service
          </Link>
          . Links to other websites are provided for convenience, and Ludvik4 is
          not responsible for their content.
        </p>
      </Part>
      <Part title="Personal data and cookies">
        <p>
          See the{" "}
          <Link className="text-foreground underline" href="/privacy">
            Privacy Notice
          </Link>{" "}
          and the{" "}
          <Link className="text-foreground underline" href="/cookies">
            Cookie Policy
          </Link>
          .
        </p>
      </Part>
    </LegalLayout>
  );
}

export function CookiePolicyView() {
  return (
    <LegalLayout title="Cookie Policy">
      <Part title="What cookies are">
        <p>
          Cookies and similar technologies store and read small pieces of
          information in your browser. They can recognise a returning browser,
          measure how a site is used or remember a setting.
        </p>
      </Part>
      <Part title="What this website uses">
        <p>
          Ekaterina Pustovaia, trading as Ludvik4, runs this website and decides
          how these technologies are used. There are no advertising cookies.
        </p>
        <p>
          By default, analytics runs without cookies and stores nothing in your
          browser for that purpose.
        </p>
        <p>
          <span className="text-foreground font-medium">
            Only if you allow cookies:
          </span>{" "}
          PostHog, a third-party analytics service, stores an identifier in a
          persistent first-party cookie (name beginning with <code>ph_</code>)
          for up to 12 months and in browser storage. It recognises returning
          visits and enables session replay, with everything you type in the
          contact form hidden.
        </p>
        <p>
          <span className="text-foreground font-medium">
            Needed for the site to work:
          </span>{" "}
          your cookie choice, and small settings kept in your browser, such as a
          dismissed hint. The contact form uses Cloudflare Turnstile to block
          spam.
        </p>
      </Part>
      <Part title="Your choice">
        <p>
          The banner lets you allow or decline cookies. Declining, or ignoring
          the banner, leaves analytics cookieless. You can change your choice at
          any time, as easily as you made it, using the control below or the one
          in the footer of every page. You can also block or delete cookies in
          your browser settings.
        </p>
        <ConsentSettingsButton className="text-foreground h-auto p-0 underline underline-offset-4" />
      </Part>
      <Part title="More information">
        <p>
          PostHog is hosted in the EU. The{" "}
          <Link className="text-foreground underline" href="/privacy">
            Privacy Notice
          </Link>{" "}
          covers legal bases, providers, international transfers and your
          rights. For questions, email <Mail />.
        </p>
      </Part>
    </LegalLayout>
  );
}

export function TermsView() {
  return (
    <LegalLayout title="Terms of Service">
      <Part title="1. Who these terms apply to">
        <p>
          These terms cover design and development services by Ekaterina
          Pustovaia, trading as Ludvik4 (details in the{" "}
          <Link className="text-foreground underline" href="/legal-notice">
            Legal Notice
          </Link>
          ). A project starts under a written agreement. If the agreement and
          these terms differ, the agreement prevails, except where the law
          protects you as a consumer.
        </p>
      </Part>
      <Part title="2. Scope and price">
        <p>
          Packages on this website describe typical scope. The final scope,
          timeline and price are fixed in the written agreement once the scope
          is agreed. Prices are in euros and do not include VAT or other
          applicable taxes. Where VAT applies, the agreement shows it and the
          total to pay.
        </p>
      </Part>
      <Part title="3. Payment">
        <p>
          For landing pages, websites, animations and automations, you pay 50%
          before work starts and 50% on delivery. Web apps are paid for in
          stages set out in the agreement.
        </p>
      </Part>
      <Part title="4. Delivery and acceptance">
        <p>
          You review each delivery and tell us what, if anything, needs fixing
          against the agreed scope. Your silence does not count as acceptance.
        </p>
      </Part>
      <Part title="5. Code and rights">
        <p>
          Rights to the code and design created for you pass to you on full
          payment. Third-party components stay under their own licences.
        </p>
      </Part>
      <Part title="6. If you are a private client: your right to withdraw">
        <p>
          If you are a consumer and the agreement is made at a distance, you can
          withdraw within 14 calendar days of concluding it, without giving a
          reason. Send a clear statement to <Mail />. We refund what you paid
          without undue delay and within 14 days at the latest.
        </p>
        <p>
          We start within those 14 days only if you expressly ask us to. If you
          then withdraw, you pay a proportional amount for the work done up to
          that point. Once the service has been fully performed at your express
          request, and you knew this would end your right to withdraw, you can
          no longer withdraw.
        </p>
      </Part>
      <Part title="7. Liability">
        <p>
          We fix defects in the agreed scope during the support period of your
          package. For businesses, liability is limited to the price paid under
          the agreement, except for intent or gross negligence. Nothing here
          limits rights that the law gives consumers.
        </p>
      </Part>
      <Part title="8. Governing law">
        <p>
          These terms are governed by Spanish law. Disputes with businesses go
          to the courts of Valencia, Spain. Consumers keep the mandatory
          protections and the courts available to them where they live.
        </p>
      </Part>
    </LegalLayout>
  );
}
