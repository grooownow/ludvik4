import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { TelegramLink } from "@/components/telegram-link";
import { type MarketContent, TELEGRAM_URL } from "./content";
import { SiteFooter, SiteHeader } from "./site-chrome";

/** Direct email for enquiries (owner, 2026-10-23). No LinkedIn for now. */
export const CONTACT_EMAIL = "ludvik4good.me@gmail.com";

// /contact (docs/specs/immersive-home.md): the lead form moved here from the
// home, plus direct links. Visual design comes later; for now it reuses the
// site's existing form card and styles. `form` is passed in by the EN build
// only, so the RU build never bundles the lead backend.
export function ContactPageView({
  content,
  form,
  orderForm,
}: {
  content: MarketContent;
  form?: ReactNode;
  /** RU: the order form, already in its own card. */
  orderForm?: ReactNode;
}) {
  const { contact } = content;
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={content} />
      <main className="mx-auto grid w-full max-w-5xl flex-1 content-start gap-10 px-6 py-16 sm:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-stage-muted font-mono text-xs tracking-[0.14em] uppercase">
            {contact.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance">
            {contact.title}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-sm">{contact.body}</p>
          <ul className="mt-6 space-y-2 font-mono text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-foreground underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <TelegramLink
                href={TELEGRAM_URL}
                placement="contact_page"
                className="text-foreground underline underline-offset-4"
              >
                {contact.telegramText}
              </TelegramLink>
            </li>
          </ul>
        </div>
        {form ? (
          <div>
            <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_14px_40px_-24px_rgba(26,26,26,0.18)]">
              {form}
            </div>
            {contact.form ? (
              <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
                {contact.form.privacyNotice.text}{" "}
                <Link
                  href={contact.form.privacyNotice.href as Route}
                  target="_blank"
                  className="text-foreground underline underline-offset-4"
                >
                  {contact.form.privacyNotice.linkLabel}
                </Link>
              </p>
            ) : null}
          </div>
        ) : (
          orderForm
        )}
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
