"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

type FaqItem = {
  question: string;
  answer: string;
};

/**
 * The FAQ accordion, reporting `faq.item_opened`.
 *
 * Which questions people open is the cheapest read on what is still unclear
 * before an enquiry — and therefore on why a visit ends without one. Only
 * opening is reported; a close is the same question, not a second one.
 *
 * Rendering markup identical to the inline version it replaces, so the
 * FAQPage structured data generated from the same array stays truthful.
 */
export function TrackedFaqAccordion({ items }: { items: readonly FaqItem[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="mt-8"
      onValueChange={(question) => {
        if (question) {
          track(ANALYTICS_EVENTS.faqItemOpened, { question });
        }
      }}
    >
      {items.map((item) => (
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
  );
}
