import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { MarketContent, ServiceCard } from "./content";

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

export function SiteHeader({ content }: { content: MarketContent }) {
  return (
    <header className="border-pink-soft bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="font-mono text-sm font-bold tracking-tight">
          Ludvik4
        </span>
        <div className="flex items-center gap-5">
          {content.nav.blogLabel ? (
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground font-mono text-sm"
            >
              {content.nav.blogLabel}
            </Link>
          ) : null}
          <Button asChild size="sm">
            <Link href="#contact">{content.nav.cta}</Link>
          </Button>
        </div>
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
            link.external ? (
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

export function ServiceGrid({ items }: { items: ServiceCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((s) => (
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
  );
}
