import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "./faq-data";

// FAQPage structured data — generated from the same array the accordion
// renders, so the JSON-LD can never drift from the visible content.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/**
 * Landing FAQ — server component; only the Radix accordion primitives are
 * client-side. Section chrome mirrors the landing's `Section` wrapper.
 */
export function FaqSection() {
  return (
    <section id="faq">
      <div className="border-pink-soft mx-auto max-w-5xl border-t px-6 py-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <p className="text-primary mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
          Вопросы и ответы
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-balance">
          Частые вопросы
        </h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqItems.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground max-w-3xl leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
