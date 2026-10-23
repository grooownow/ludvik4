"use client";

import { useSearchParams } from "next/navigation";
import {
  type PointerEvent,
  type ReactNode,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import type { HomeContent, Market } from "./content";
import { HallPlan } from "./hall-plans";

// The collection halls as fine-line plans (owner's pick from
// experiments/nevalyashka/ideas/halls-v2.html: "Чертежи" → "Подробный").
// Each card draws its plan once, when it scrolls into view; cards of one row
// start a beat apart. On hover the plan darkens and its one accent turns
// pink. The section around them has two looks under review: a dark hall
// (default) and a spotlight that follows the cursor (`?halls=spot`).
// Styles: "Collection halls" in globals.css.

type Hall = HomeContent["collection"]["halls"][number];

export type HallsMode = "dark" | "spot";

/** `?halls=spot` shows the spotlight look; anything else the dark hall. */
export function hallsMode(search: string): HallsMode {
  return new URLSearchParams(search).get("halls") === "spot" ? "spot" : "dark";
}

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
    <li ref={ref} data-drawn={drawn} className="hall-plan">
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
      </span>
    </li>
  );
}

/** Reports the look asked for in the URL. Kept apart, under Suspense, so
 *  reading the query never stops the section itself from prerendering. */
function ModeFromUrl({ onMode }: { onMode: (mode: HallsMode) => void }) {
  const search = useSearchParams()?.toString() ?? "";
  useEffect(() => onMode(hallsMode(search)), [search, onMode]);
  return null;
}

/**
 * The collection section: the dark hall unless the URL asks for the
 * spotlight, which eases a pool of light after the cursor (--spot-x/y).
 */
export function HallsStage({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<HallsMode>("dark");
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
    if (mode !== "spot" || event.pointerType !== "mouse") return;
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
      data-halls={mode}
      onPointerMove={move}
      className="halls-stage"
    >
      <Suspense fallback={null}>
        <ModeFromUrl onMode={setMode} />
      </Suspense>
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        {children}
      </div>
    </section>
  );
}
