import Link from "next/link";
import type { MarketContent } from "./content";
import { SiteFooter, SiteHeader } from "./site-chrome";

const PRIVACY_EMAIL = "ludvik4good.me@gmail.com";

export function PrivacyPage({ content }: { content: MarketContent }) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SiteHeader content={content} contactHref="/#contact" />
      <main className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
        <p className="text-primary mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
          Legal
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Privacy Notice
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Last updated: 23 July 2026
        </p>

        <div className="mt-10 space-y-9 text-[15px] leading-7">
          <section>
            <h2 className="text-xl font-bold">1. Who is responsible</h2>
            <p className="text-muted-foreground mt-3">
              The data controller is the independent business operating under
              the Ludvik4 name in Spain. For privacy questions or to exercise
              your rights, email{" "}
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
              Ludvik4 through the Telegram Bot API and are therefore processed
              by Telegram. These providers process technical and message data as
              needed to provide their services. Information may also be
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
              Vercel and Telegram may process personal data outside the European
              Economic Area. Where required, transfers by service providers must
              be covered by an adequacy decision or appropriate safeguards under
              Chapter V GDPR. Vercel incorporates the European Commission&apos;s
              Standard Contractual Clauses into its data processing terms.
              Telegram is established outside the EEA and names an EEA
              representative in its privacy policy.
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
              investigate or prevent abuse.
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
              Ludvik4 does not currently use non-essential analytics or
              advertising cookies on this website. If this changes, this notice
              and the website&apos;s consent controls will be updated before
              non-essential tracking is enabled.
            </p>
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
