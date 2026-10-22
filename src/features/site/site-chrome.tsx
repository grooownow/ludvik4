import type { Route } from "next";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ConsentSettingsButton } from "@/components/consent-settings-button";
import { TelegramLink } from "@/components/telegram-link";
import { cn } from "@/lib/utils";
import { HomeLink } from "./anchor-link";
import { NavLinks } from "./nav-links";
import { TELEGRAM_URL, type MarketContent, type ServiceCard } from "./content";

// Shared presentational chrome for both markets. Purely visual — every string
// comes from the market content object, so the classes (and therefore the
// design) stay identical across RU and EN. No RU/EN switcher lives here: a
// build serves one market only.

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-primary mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
      {children}
    </p>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={className}>
      <div className="border-pink-soft mx-auto max-w-5xl border-t px-6 py-14">
        {children}
      </div>
    </section>
  );
}

export function SiteHeader({
  content,
  contactHref = "/contact",
  variant = "default",
}: {
  content: MarketContent;
  contactHref?: string;
  /** "stage": transparent, over the exhibit stage, scrolls away with it. */
  variant?: "default" | "stage";
}) {
  const navigationLabel =
    content.lang === "ru" ? "Основная навигация" : "Main navigation";
  const menuLabel = content.lang === "ru" ? "Открыть меню" : "Open menu";
  const stage = variant === "stage";

  // Text-only menu (docs/specs/immersive-home.md): the wordmark is the one
  // bright word, the links share one muted colour, Contact is pink.
  return (
    <header
      className={cn(
        "z-20",
        stage
          ? "pointer-events-auto absolute inset-x-0 top-0"
          : "border-pink-soft bg-background/90 sticky top-0 border-b backdrop-blur",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between",
          stage ? "px-[3.2vw] pt-[3.4vh]" : "mx-auto max-w-5xl px-6 py-3",
        )}
      >
        <HomeLink
          href="/"
          className={cn(
            "text-foreground font-semibold tracking-tight",
            stage ? "text-[15px]" : "font-mono text-sm",
          )}
          aria-label={
            content.lang === "ru" ? "Ludvik4 — на главную" : "Ludvik4 — home"
          }
        >
          Ludvik4
        </HomeLink>
        <nav
          aria-label={navigationLabel}
          className={cn(
            "text-stage-muted hidden items-center sm:flex",
            stage ? "gap-8 text-[15px]" : "gap-5 font-mono text-sm",
          )}
        >
          <NavLinks
            links={content.nav.links ?? []}
            cta={{
              href: contactHref,
              label: content.nav.cta,
              placement: "nav",
              className: "text-primary hover:text-primary/80 transition-colors",
            }}
            className="contents"
            itemClassName="hover:text-foreground transition-colors"
          />
        </nav>

        <details className="group relative sm:hidden">
          <summary
            className="hover:bg-muted flex size-9 cursor-pointer list-none items-center justify-center rounded-md [&::-webkit-details-marker]:hidden"
            aria-label={menuLabel}
            title={menuLabel}
          >
            <Menu className="size-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden size-5 group-open:block" aria-hidden="true" />
          </summary>
          <nav
            aria-label={navigationLabel}
            className="border-pink-soft bg-background absolute top-11 right-0 flex min-w-52 flex-col border p-2 shadow-lg"
          >
            <NavLinks
              links={content.nav.links ?? []}
              cta={{
                href: contactHref,
                label: content.nav.cta,
                placement: "nav_mobile",
                className:
                  "text-primary hover:bg-muted rounded-md px-3 py-2 font-mono text-sm",
              }}
              className="contents"
              itemClassName="hover:bg-muted rounded-md px-3 py-2 font-mono text-sm"
            />
          </nav>
        </details>
      </div>
    </header>
  );
}

// One dark footer site-wide, continuing the home's closing band. The shadow
// paints the same plum far below the page (a shadow adds no scroll height),
// so iOS rubber-band overscroll at the bottom shows plum instead of white.
export function SiteFooter({ content }: { content: MarketContent }) {
  return (
    <footer className="bg-intro border-t border-white/10 pb-[env(safe-area-inset-bottom)] text-white/45 shadow-[0_100vh_0_100vh_var(--intro)]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 font-mono text-sm">
        <span>{content.home.footerTagline}</span>
        <span className="flex flex-wrap items-center gap-5">
          {content.footer.links.map((link) =>
            link.href === TELEGRAM_URL ? (
              <TelegramLink
                key={link.href}
                href={link.href}
                placement="footer"
                className="hover:text-white"
              >
                {link.label}
              </TelegramLink>
            ) : link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href as Route}
                className="hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
          {/* Renders nothing on RU and on any build without a PostHog key —
              the footer is shared, so the control suppresses itself. */}
          <ConsentSettingsButton className="h-auto p-0 font-mono text-sm font-normal text-white/45 hover:bg-transparent hover:text-white" />
        </span>
      </div>
    </footer>
  );
}

// Three equal cards read as equal offers: one row on wide screens (3 cols),
// two on tablet (the 3rd card spans the row and lays out title-left /
// description-right so it looks intentional, not a leftover), one on phone.
export function ServiceGrid({ items }: { items: ServiceCard[] }) {
  const stretchLast = items.length === 3;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => {
        const spanRow = stretchLast && i === 2;
        return (
          <div
            key={s.title}
            className={cn(
              "border-border bg-card rounded-2xl border p-6",
              spanRow && "sm:col-span-2 lg:col-span-1",
            )}
          >
            <div
              className={cn(
                spanRow && "sm:flex sm:items-start sm:gap-10 lg:block",
              )}
            >
              <div className={cn(spanRow && "sm:w-2/5 sm:shrink-0 lg:w-auto")}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="bg-primary/50 h-px w-8" />
                  <span className="font-mono text-[10px] tracking-wider text-[#9ca3af] uppercase">
                    {s.module}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{s.title}</h3>
              </div>
              <p
                className={cn(
                  "text-muted-foreground text-sm leading-relaxed",
                  spanRow ? "mt-2 sm:mt-0 lg:mt-2" : "mt-2",
                )}
              >
                {s.body}
              </p>
              {s.href && s.linkLabel ? (
                <Link
                  href={s.href as Route}
                  className="text-primary mt-4 inline-block font-mono text-xs font-semibold"
                >
                  {s.linkLabel} →
                </Link>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
