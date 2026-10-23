"use client";

import type { Route } from "next";
import Link from "next/link";
import { type PointerEvent, useRef } from "react";
import { cn } from "@/lib/utils";
import type { HomeContent } from "./content";
import { HallExhibitArt } from "./hall-exhibits";

// One hall of the collection (owner chose variant B of
// experiments/nevalyashka/ideas/halls.html). On hover the card squashes and
// springs back like jelly, a gloss follows the cursor, the exhibit rocks away
// from the side the cursor came in, and the "what's inside" chips slide in
// under the subtitle, pushing the text up. Halls do not open: only the last
// hall's chip is a link (to the contact page). Styles: .hall-card in
// globals.css.

type Hall = HomeContent["collection"]["halls"][number];

/** A roly-poly's wobble: tilt (deg) per keyframe, decaying. */
const WOBBLE = [0, 12, -8, 4.5, -2, 0];

/** Which way the exhibit tips: away from the side the cursor entered. */
export function entryDirection(clientX: number, left: number, width: number) {
  return clientX < left + width / 2 ? 1 : -1;
}

function prefersReducedMotion() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function HallCard({
  hall,
  soft,
  contactHref,
}: {
  hall: Hall;
  /** The pinker background of the first and last halls. */
  soft: boolean;
  /** Where the last hall's chip leads; other halls have plain chips. */
  contactHref?: string;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  const enter = (event: PointerEvent<HTMLLIElement>) => {
    const card = cardRef.current;
    const art = artRef.current;
    if (!card || !art || typeof card.animate !== "function") return;
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = card.getBoundingClientRect();
    const dir = entryDirection(event.clientX, rect.left, rect.width);

    card.animate(
      [
        { transform: "scale(1, 1)" },
        { transform: "scale(1.045, 0.955)", offset: 0.18 },
        { transform: "scale(0.985, 1.025)", offset: 0.4 },
        { transform: "scale(1.012, 0.99)", offset: 0.62 },
        { transform: "scale(1, 1)" },
      ],
      { duration: 750, easing: "ease-out" },
    );
    art.animate(
      WOBBLE.map((deg) => ({ transform: `rotate(${deg * dir}deg)` })),
      { duration: 1300, easing: "ease-out" },
    );
    const spring = "cubic-bezier(.2,.9,.25,1.2)";
    for (const [part, turn] of [
      ["spin", 90],
      ["spin-back", -135],
    ] as const) {
      art
        .querySelector(`[data-part="${part}"]`)
        ?.animate(
          [{ transform: "rotate(0)" }, { transform: `rotate(${turn}deg)` }],
          { duration: 1200, easing: spring },
        );
    }
    art
      .querySelector('[data-part="knob"]')
      ?.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-76px)" },
          { transform: "translateX(-76px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 1600, easing: "cubic-bezier(.3,1.4,.4,1)" },
      );
  };

  const move = (event: PointerEvent<HTMLLIElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--hall-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--hall-y", `${event.clientY - rect.top}px`);
  };

  return (
    <li
      ref={cardRef}
      onPointerEnter={enter}
      onPointerMove={move}
      className={cn(
        "hall-card group relative isolate flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-7",
        soft ? "bg-pink-soft" : "bg-accent",
      )}
    >
      <span className="text-stage-muted relative z-10 font-mono text-xs tracking-[0.14em] uppercase">
        {hall.index}
      </span>
      <div aria-hidden="true" className="hall-exhibit">
        <div ref={artRef} className="hall-exhibit-art size-full">
          <HallExhibitArt kind={hall.exhibit} />
        </div>
      </div>
      <span className="relative z-10">
        <span className="block text-2xl font-semibold tracking-tight">
          {hall.name}
        </span>
        <span className="text-stage-muted mt-1 block text-sm">{hall.line}</span>
        <span className="hall-more flex gap-1.5">
          {hall.more.map((chip) =>
            contactHref ? (
              <Link
                key={chip}
                href={contactHref as Route}
                className="bg-foreground text-background focus-visible:ring-primary rounded-full px-2.5 py-1 text-[0.8rem] whitespace-nowrap focus-visible:ring-2 focus-visible:outline-none"
              >
                {chip}
              </Link>
            ) : (
              <span
                key={chip}
                className="rounded-full bg-white/70 px-2.5 py-1 text-[0.8rem] whitespace-nowrap"
              >
                {chip}
              </span>
            ),
          )}
        </span>
      </span>
    </li>
  );
}
