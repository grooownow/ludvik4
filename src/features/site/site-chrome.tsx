import type { Route } from "next";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { TelegramLink } from "@/components/telegram-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnchorLink, HomeLink } from "./anchor-link";
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
  // Root-relative: a bare "#contact" silently does nothing on subpages
  // (blog, privacy) where the anchor does not exist.
  contactHref = "/#contact",
}: {
  content: MarketContent;
  contactHref?: string;
}) {
  const navigationLabel =
    content.lang === "ru" ? "Основная навигация" : "Main navigation";
  const menuLabel = content.lang === "ru" ? "Открыть меню" : "Open menu";

  return (
    <header className="border-pink-soft bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <HomeLink
          href="/"
          className="font-mono text-sm font-bold tracking-tight"
          aria-label={
            content.lang === "ru" ? "Ludvik4 — на главную" : "Ludvik4 — home"
          }
        >
          Ludvik4
        </HomeLink>
        <nav
          aria-label={navigationLabel}
          className="hidden items-center gap-5 sm:flex"
        >
          {content.nav.links?.map((link) => (
            <Link
              key={link.href}
              href={link.href as Route}
              className="text-muted-foreground hover:text-foreground font-mono text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Button asChild size="sm">
            <AnchorLink href={contactHref}>{content.nav.cta}</AnchorLink>
          </Button>
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
            {content.nav.links?.map((link) => (
              <Link
                key={link.href}
                href={link.href as Route}
                className="hover:bg-muted rounded-md px-3 py-2 font-mono text-sm"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2">
              <AnchorLink href={contactHref}>{content.nav.cta}</AnchorLink>
            </Button>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter({ content }: { content: MarketContent }) {
  return (
    <footer className="bg-surface-warm">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 font-mono text-sm">
        <span>© 2026 Ludvik4</span>
        <span className="flex items-center gap-5">
          {content.footer.links.map((link) =>
            link.href === TELEGRAM_URL ? (
              <TelegramLink
                key={link.href}
                href={link.href}
                placement="footer"
                className="hover:text-foreground"
              >
                {link.label}
              </TelegramLink>
            ) : link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href as Route}
                className="hover:text-foreground"
              >
                {link.label}
              </Link>
            ),
          )}
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
