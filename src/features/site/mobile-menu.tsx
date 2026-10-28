"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { NavLink } from "./content";
import { NavLinks } from "./nav-links";

// The burger menu for phones and tablets. A rounded glass panel unfolds from
// the top-right corner and takes the toggle inside it; the three lines of the
// icon fold into a cross. It closes on a link, on Escape, on a press outside
// it and on a route change.

const LINE =
  "absolute left-1/2 h-[1.5px] w-5 -translate-x-1/2 rounded-full bg-current transition-[translate,rotate,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]";

export function MobileMenu({
  links,
  cta,
  navigationLabel,
  openLabel,
  closeLabel,
}: {
  links: NavLink[];
  cta: { href: string; label: string };
  navigationLabel: string;
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    // A link inside closes the menu; its navigation or section scroll still
    // happens, so this only listens and never prevents anything.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest("a");
      if (link && root.current?.contains(link)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = open ? closeLabel : openLabel;

  return (
    <div ref={root} className="relative lg:hidden">
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "absolute -top-2.5 -right-2.5 z-10 min-w-48 origin-top-right rounded-3xl bg-white/80 px-2 pt-12 pb-2 shadow-[0_18px_50px_-20px_rgba(120,20,80,0.35)] ring-1 ring-white/70 backdrop-blur-xl transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0",
        )}
      >
        <nav aria-label={navigationLabel} className="flex flex-col">
          <NavLinks
            links={links}
            cta={{
              href: cta.href,
              label: cta.label,
              placement: "nav_mobile",
              className:
                "text-primary hover:bg-primary/10 rounded-2xl px-4 py-2 text-[15px] transition-colors",
            }}
            className="contents"
            itemClassName="text-foreground hover:bg-primary/10 rounded-2xl px-4 py-2 text-[15px] transition-colors"
          />
        </nav>
      </div>

      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        title={label}
        onClick={() => setOpen((v) => !v)}
        className="text-foreground relative z-20 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/60"
      >
        <span
          aria-hidden="true"
          className={cn(
            LINE,
            "top-[11px]",
            open && "translate-y-[6.75px] rotate-45",
          )}
        />
        <span
          aria-hidden="true"
          className={cn(LINE, "top-[17.25px]", open && "opacity-0")}
        />
        <span
          aria-hidden="true"
          className={cn(
            LINE,
            "top-[23.5px]",
            open && "-translate-y-[6.75px] -rotate-45",
          )}
        />
      </button>
    </div>
  );
}
