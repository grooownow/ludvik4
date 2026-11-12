"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// A horizontal strip of screens with ← → arrows (spec: every horizontal image
// strip gets them). Arrows scroll smoothly on pointer devices, hide at the
// ends, and are not shown on touch screens or narrow viewports.

export function ScrollStrip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: true });

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const sync = () =>
      setEnds({
        start: el.scrollLeft < 4,
        end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4,
      });
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    // Absent in old browsers and jsdom: the arrows then sync on scroll only.
    const ro =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync);
    ro?.observe(el);
    // Images arriving later change the scroll width.
    const images = [...el.querySelectorAll("img")];
    images.forEach((img) => img.addEventListener("load", sync));
    return () => {
      images.forEach((img) => img.removeEventListener("load", sync));
      el.removeEventListener("scroll", sync);
      ro?.disconnect();
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.max(240, el.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-w-0">
      <Arrow side="l" hidden={ends.start} onClick={() => step(-1)} />
      <Arrow side="r" hidden={ends.end} onClick={() => step(1)} />
      <div
        ref={strip}
        className={cn("flex snap-x snap-mandatory overflow-x-auto", className)}
      >
        {children}
      </div>
    </div>
  );
}

function Arrow({
  side,
  hidden,
  onClick,
}: {
  side: "l" | "r";
  hidden: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden || undefined}
      aria-label={side === "l" ? "Прокрутить влево" : "Прокрутить вправо"}
      onClick={onClick}
      className={cn(
        "border-border bg-background text-foreground hover:border-primary hover:text-primary absolute top-[calc(50%-6px)] z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border text-lg shadow-md transition-opacity [@media(hover:hover)_and_(min-width:801px)]:grid",
        side === "l" ? "-left-[18px]" : "-right-[18px]",
        hidden && "pointer-events-none opacity-0",
      )}
    >
      {side === "l" ? "←" : "→"}
    </button>
  );
}
