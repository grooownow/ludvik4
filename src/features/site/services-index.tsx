import type { MarketContent } from "./content";
import { ServiceGrid, SiteFooter, SiteHeader } from "./site-chrome";

// /services (EN) and /uslugi (RU): the menu's "Services" target. The home's
// halls are plain cards, so this minimal index keeps the three service pages
// one click from every page (docs/specs/immersive-home.plan.md decisions).
export function ServicesIndexView({ content }: { content: MarketContent }) {
  const title = content.lang === "ru" ? "Услуги" : "Services";
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={content} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <p className="text-stage-muted font-mono text-xs tracking-[0.14em] uppercase">
          {content.services.eyebrow}
        </p>
        <h1 className="mt-3 mb-10 text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        <ServiceGrid items={content.services.items} />
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
