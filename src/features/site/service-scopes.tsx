import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { MarketContent } from "./content";

// "Что входит в работу" — an open accordion of per-service scope, placed right
// after the three service cards (RU only). Server component; only the Radix
// accordion primitives are client-side. Section chrome mirrors FaqSection.
// Internal hour estimates are deliberately not shown here (see
// docs/service-scopes-ru.md § "Как показать это на сайте").

function ScopeLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground font-mono text-[11px] font-semibold tracking-widest uppercase">
      {children}
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5 text-sm">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-primary" aria-hidden="true">
            ·
          </span>
          <span className="text-foreground/80">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ServiceScopes({
  scopes,
}: {
  scopes: NonNullable<MarketContent["scopes"]>;
}) {
  return (
    <section id="scopes">
      <div className="border-pink-soft mx-auto max-w-5xl border-t px-6 py-14">
        <p className="text-primary mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
          {scopes.eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-balance">
          {scopes.title}
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          {scopes.lead}
        </p>

        <Accordion
          type="single"
          collapsible
          defaultValue="scope-0"
          className="mt-8"
        >
          {scopes.items.map((item, i) => (
            <AccordionItem key={item.title} value={`scope-${i}`}>
              <AccordionTrigger className="text-base">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid max-w-3xl gap-6 pt-1 pb-2">
                  <p className="text-foreground/80 leading-relaxed">
                    {item.result}
                  </p>

                  <div>
                    <ScopeLabel>Этапы</ScopeLabel>
                    {/* CSS columns fill top-to-bottom then across, so the
                        numbering reads down each column (01·02·03 | 04·05·06). */}
                    <ol className="mt-3 gap-x-8 sm:columns-2">
                      {item.steps.map((step, s) => (
                        <li
                          key={step}
                          className="mb-2.5 flex break-inside-avoid gap-2.5 text-sm"
                        >
                          <span className="text-primary pt-0.5 font-mono text-xs font-semibold">
                            {String(s + 1).padStart(2, "0")}
                          </span>
                          <span className="text-foreground/80">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <ScopeLabel>Базовые границы</ScopeLabel>
                      <Bullets items={item.boundaries} />
                    </div>
                    <div>
                      <ScopeLabel>Оценивается отдельно</ScopeLabel>
                      <Bullets items={item.separate} />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
