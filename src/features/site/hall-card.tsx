"use client";

import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import type { HomeContent, Market } from "./content";
import { CtaLink } from "./cta-link";
import { HallPlan } from "./hall-plans";

// The collection halls as fine-line plans (owner's pick from
// experiments/nevalyashka/ideas/halls-v2.html: "Чертежи" → "Подробный").
// Each card draws its plan once, when it scrolls into view; cards of one row
// start a beat apart. On hover the plan darkens and its one accent turns
// pink. Around them a soft pool of pink light follows the cursor over the
// section (the owner's pick over a dark hall, 2026-10-23).
// Styles: "Collection halls" in globals.css.

type Hall = HomeContent["collection"]["halls"][number];

/** Delay before a card draws: a beat per column, so a row reads left to right. */
export function drawDelay(index: number) {
  return (index % 3) * 220;
}

export function HallCard({
  hall,
  index,
  lang,
}: {
  hall: Hall;
  index: number;
  lang: Market;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    // No observer (old browsers, tests): show the finished plan.
    if (typeof IntersectionObserver !== "function") {
      setDrawn(true);
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        timer = setTimeout(() => setDrawn(true), drawDelay(index));
      },
      { threshold: 0.45, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(card);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [index]);

  return (
    <li
      ref={ref}
      data-drawn={drawn}
      data-cta={hall.cta ? true : undefined}
      className="hall-plan"
    >
      <div aria-hidden="true" className="hall-plan-art">
        <HallPlan kind={hall.exhibit} lang={lang} />
      </div>
      <span className="text-stage-muted relative z-10 font-mono text-xs tracking-[0.14em] uppercase">
        {hall.index}
      </span>
      <span className="relative z-10">
        <span className="block text-2xl font-semibold tracking-tight">
          {hall.name}
        </span>
        <span className="text-stage-muted mt-1 block text-sm">{hall.line}</span>
        {hall.cta ? (
          <CtaLink
            href="/contact"
            placement="hall"
            className="bg-foreground text-background hover:bg-primary focus-visible:ring-primary mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {hall.cta}
            <span aria-hidden="true">→</span>
          </CtaLink>
        ) : null}
      </span>
    </li>
  );
}

/**
 * The collection section. A pool of light eases after the cursor
 * (--spot-x/y); on touch, or with reduced motion, it rests where the CSS
 * puts it.
 */
function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function HallsStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const step = () => {
    const stage = ref.current;
    const at = current.current;
    if (!stage || !at) return;
    at.x += (target.current.x - at.x) * 0.08;
    at.y += (target.current.y - at.y) * 0.08;
    stage.style.setProperty("--spot-x", `${at.x}px`);
    stage.style.setProperty("--spot-y", `${at.y}px`);
    const moving =
      Math.abs(target.current.x - at.x) + Math.abs(target.current.y - at.y) >
      0.5;
    frame.current = moving ? requestAnimationFrame(step) : 0;
  };

  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    target.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    current.current ??= { ...target.current };
    if (!frame.current) frame.current = requestAnimationFrame(step);
  };

  return (
    <section
      ref={ref}
      id="collection"
      onPointerMove={move}
      className="halls-stage"
    >
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        {children}
      </div>
    </section>
  );
}
