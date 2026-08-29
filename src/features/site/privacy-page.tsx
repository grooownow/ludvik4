import Link from "next/link";
import { Breadcrumbs } from "./breadcrumbs";
import { ConsentSettingsButton } from "@/components/consent-settings-button";
import type { MarketContent } from "./content";
import { SiteFooter, SiteHeader } from "./site-chrome";

const PRIVACY_EMAIL = "ludvik4good.me@gmail.com";

export function PrivacyPage({ content }: { content: MarketContent }) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader content={content} contactHref="/#contact" />
      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        <Breadcrumbs items={[{ label: "Privacy Notice" }]} homeLabel="Home" />
        <p className="text-primary mt-10 mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
          Legal
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Privacy Notice
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Last updated: 30 August 2026
        </p>

        <div className="mt-10 space-y-9 text-[15px] leading-7">
          <section>
            <h2 className="text-xl font-bold">1. Who is responsible</h2>
            <p className="text-muted-foreground mt-3">
              The data controller is Ekaterina Pustovaia, trading as Ludvik4,
              Avenida de Francia 79, 46024 Valencia, Spain. For privacy
              questions or to exercise your rights, email{" "}
              <a
                className="text-foreground underline underline-offset-4"
                href={`mailto:${PRIVACY_EMAIL}`}
              >
                {PRIVACY_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. Data collected</h2>
            <p className="text-muted-foreground mt-3">
              When you submit the enquiry form, Ludvik4 receives the name you
              provide, your contact details, and the contents of your message.
              Your name is optional. Please do not include sensitive personal
              data unless it is genuinely necessary for your enquiry.
            </p>
            <p className="text-muted-foreground mt-3">
              The server also reads your IP address to limit repeated
              submissions. It is held in the server process for approximately
              one minute for this purpose. The hosting provider may process
              ordinary request and security logs needed to operate and protect
              the website.
            </p>
            <p className="text-muted-foreground mt-3">
              On the international website, PostHog receives limited technical
              usage data such as page URLs, referrers, device and browser
              information, and interaction events. By default it operates in
              cookieless mode: the website stores no analytics identifier in
              your browser and creates no persistent person profiles.
            </p>
            <p className="text-muted-foreground mt-3">
              If you allow cookies, PostHog additionally stores an analytics
              identifier in your browser and records a replay of your visit —
              the pages you view and where you click, scroll and move. Text you
              type into the contact form is masked and is never recorded.
              Persistent person profiles remain switched off. See section 9.
            </p>
            <p className="text-muted-foreground mt-3">
              When something on the website fails, Sentry receives a diagnostic
              report: the error and its technical stack trace, the page address
              it happened on, your browser and operating system, and an
              approximate location derived from the network address the request
              came from. These reports are not tied to an analytics identifier
              and are not used to build a profile of you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. Purposes and legal bases</h2>
            <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5">
              <li>
                To answer your enquiry, discuss the requested work, and take
                steps at your request before entering into a contract. The legal
                basis is Article 6(1)(b) GDPR.
              </li>
              <li>
                To prevent spam, abuse, and security incidents. The legal basis
                is Ludvik4&apos;s legitimate interest in protecting the website
                and communications under Article 6(1)(f) GDPR.
              </li>
              <li>
                To understand aggregate website use and improve the service. The
                legal basis is Ludvik4&apos;s legitimate interest in measuring
                and improving the website under Article 6(1)(f) GDPR. Analytics
                operates without browser storage or persistent person profiles.
              </li>
              <li>
                To detect, diagnose, and fix faults so the website keeps
                working. The legal basis is Ludvik4&apos;s legitimate interest
                in the security and reliability of the service under Article
                6(1)(f) GDPR.
              </li>
              <li>
                To retain information where required to establish, exercise, or
                defend legal claims or comply with a legal obligation. The legal
                bases are Articles 6(1)(f) and 6(1)(c) GDPR, as applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">
              4. Service providers and recipients
            </h2>
            <p className="text-muted-foreground mt-3">
              The website is hosted by Vercel. Form submissions are delivered to
              Ludvik4 by email through Resend (Plus Five Five, Inc.). Limited
              usage analytics are provided by PostHog, using its EU cloud
              service. Error diagnostics are processed by Sentry (Functional
              Software, Inc.). These providers process technical and message
              data as needed to provide their services. Information may also be
              disclosed to professional advisers or public authorities where
              this is necessary and permitted by law.
            </p>
            <p className="text-muted-foreground mt-3">
              If you contact Ludvik4 directly through Telegram, Telegram
              processes your account and message data under its own{" "}
              <a
                className="text-foreground underline underline-offset-4"
                href="https://telegram.org/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">
              5. International data transfers
            </h2>
            <p className="text-muted-foreground mt-3">
              Vercel, Resend, PostHog, and Sentry may process personal data
              outside the European Economic Area. Where required, transfers are
              covered by an adequacy decision or appropriate safeguards under
              Chapter V GDPR. Vercel incorporates the European Commission&apos;s
              Standard Contractual Clauses into its data processing terms.
              Resend&apos;s data processing terms include the Standard
              Contractual Clauses and state its participation in the EU-U.S.
              Data Privacy Framework.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. Retention</h2>
            <p className="text-muted-foreground mt-3">
              Enquiry messages are normally retained for up to 12 months after
              the last meaningful contact, then deleted from the communication
              channels used to receive them. If the enquiry results in a
              contract, relevant correspondence may be retained for the
              applicable statutory limitation, tax, accounting, and legal record
              periods. Security data is retained only for as long as needed to
              investigate or prevent abuse. Analytics events are retained
              according to the retention period configured in PostHog and are
              reviewed periodically for deletion or reduction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">7. Your rights</h2>
            <p className="text-muted-foreground mt-3">
              Depending on the circumstances, you may request access,
              rectification, erasure, restriction, or portability of your
              personal data, and object to processing based on legitimate
              interests. Send a request to{" "}
              <a
                className="text-foreground underline underline-offset-4"
                href={`mailto:${PRIVACY_EMAIL}`}
              >
                {PRIVACY_EMAIL}
              </a>
              . Identity may need to be verified before a request is completed.
            </p>
            <p className="text-muted-foreground mt-3">
              You may also lodge a complaint with the{" "}
              <a
                className="text-foreground underline underline-offset-4"
                href="https://www.aepd.es/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spanish Data Protection Agency (AEPD)
              </a>{" "}
              or your local supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">
              8. Required information and automated decisions
            </h2>
            <p className="text-muted-foreground mt-3">
              Providing a message and a way to contact you is necessary for
              Ludvik4 to respond. There is no statutory obligation to provide
              this information. The form data is not used for automated
              decision-making or profiling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold">9. Cookies and analytics</h2>
            <p className="text-muted-foreground mt-3">
              Ludvik4 uses PostHog for limited audience measurement and product
              analytics on the international website. Ludvik4 does not use
              advertising cookies, and analytics is switched off entirely on the
              Russian-language website.
            </p>
            <p className="text-muted-foreground mt-3">
              Unless you allow cookies, PostHog runs in cookieless mode and
              stores nothing in your browser — no analytics cookie and no
              identifier in local or session storage. The legal basis for that
              measurement is Ludvik4&apos;s legitimate interest under Article
              6(1)(f) GDPR. Declining, or simply ignoring the banner, leaves the
              website in this state.
            </p>
            <p className="text-muted-foreground mt-3">
              Allowing cookies is optional and adds two things: an analytics
              identifier stored in your browser, so returning visits can be
              recognised as the same visitor, and session replay. The legal
              basis for both is your consent under Article 6(1)(a) GDPR.
            </p>
            <p className="text-muted-foreground mt-3">
              You can withdraw your consent at any time, as easily as it was
              given — the control below, also in the footer of every page,
              clears your choice, stops any session replay and lets you decide
              again. Withdrawal does not affect processing carried out before
              you withdrew.
            </p>
            <ConsentSettingsButton className="text-foreground mt-3 h-auto p-0 underline underline-offset-4" />
          </section>

          <section>
            <h2 className="text-xl font-bold">10. Changes</h2>
            <p className="text-muted-foreground mt-3">
              This notice may be updated when the website or its service
              providers change. The current version and its update date will
              remain available on this page.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-12 inline-block font-mono text-sm underline underline-offset-4"
        >
          Back to Ludvik4
        </Link>
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
