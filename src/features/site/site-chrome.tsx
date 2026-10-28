import type { Route } from "next";
import Link from "next/link";
import { ConsentSettingsButton } from "@/components/consent-settings-button";
import { TelegramLink } from "@/components/telegram-link";
import { cn } from "@/lib/utils";
import { HomeLink } from "./anchor-link";
import { MobileMenu } from "./mobile-menu";
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
  const closeLabel = content.lang === "ru" ? "Закрыть меню" : "Close menu";
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
      {/* Three parts: the wordmark and the menu share the spare width
          equally (flex-1 each), so the tagline between them stays on the
          true centre whatever their own widths. */}
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          stage ? "px-[3.2vw] pt-[3.4vh]" : "mx-auto max-w-5xl px-6 py-3",
        )}
      >
        <HomeLink
          href="/"
          className={cn(
            "text-foreground flex-1 font-semibold tracking-tight",
            stage ? "text-[15px]" : "font-mono text-sm",
          )}
          aria-label={
            content.lang === "ru" ? "Ludvik4 — на главную" : "Ludvik4 — home"
          }
        >
          Ludvik4
        </HomeLink>
        {/* Thin, widely tracked capitals in the muted ink: it names the
            category without competing with the wordmark. The left padding
            equals the tracking so the trailing letter gap does not push the
            line off centre. */}
        {content.nav.tagline ? (
          <p
            className={cn(
              "text-foreground/45 shrink-0 pl-[0.3em] text-center text-[10px] font-light tracking-[0.3em] whitespace-nowrap uppercase",
              // The stage sets it larger from tablets up; inner pages keep
              // the compact one inside their narrower container.
              stage
                ? "sm:text-[16px] xl:pl-[0.4em] xl:tracking-[0.4em]"
                : "sm:pl-[0.22em] sm:text-[11px] sm:tracking-[0.22em] lg:text-[12px]",
            )}
          >
            {content.nav.tagline}
          </p>
        ) : null}
        <div className="flex flex-1 justify-end">
          {/* Phones and tablets get the burger; the full menu from lg. */}
          <nav
            aria-label={navigationLabel}
            className={cn(
              "text-stage-muted hidden items-center lg:flex",
              stage
                ? "gap-4 text-[13px] whitespace-nowrap xl:gap-8 xl:text-[15px]"
                : "gap-5 font-mono text-sm whitespace-nowrap",
            )}
          >
            <NavLinks
              links={content.nav.links ?? []}
              cta={{
                href: contactHref,
                label: content.nav.cta,
                placement: "nav",
                className:
                  "text-primary hover:text-primary/80 transition-colors",
              }}
              className="contents"
              itemClassName="hover:text-foreground transition-colors"
            />
          </nav>

          <MobileMenu
            links={content.nav.links ?? []}
            cta={{ href: contactHref, label: content.nav.cta }}
            navigationLabel={navigationLabel}
            openLabel={menuLabel}
            closeLabel={closeLabel}
          />
        </div>
      </div>
    </header>
  );
}

// One dark footer site-wide, continuing the home's closing band. Its
// data-site-footer marker turns on the overscroll layer in globals.css.
export function SiteFooter({ content }: { content: MarketContent }) {
  return (
    <footer
      data-site-footer
      className="bg-intro border-t border-white/10 pb-[env(safe-area-inset-bottom)] text-white/45"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 font-mono text-sm">
        {/* The year is the build's: every deploy rebuilds the static page. */}
        <span>
          © Ludvik4 · {new Date().getFullYear()} · {content.home.footerReach}
        </span>
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
                target={link.newTab ? "_blank" : undefined}
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
