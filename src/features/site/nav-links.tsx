"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnchorLink } from "./anchor-link";
import type { NavLink } from "./content";
import { type CtaPlacement, CtaLink } from "./cta-link";

// The header menu. Section links ("/#work") scroll smoothly on the home and
// navigate there from other pages (AnchorLink). The current item is marked
// quietly: the muted text turns full ink with a thin underline — for page
// links by route, for section links by the section on screen.

const ACTIVE =
  "aria-[current]:text-foreground aria-[current]:underline aria-[current]:decoration-1 aria-[current]:underline-offset-[6px]";

function sectionId(href: string): string | null {
  return href.startsWith("/#") ? href.slice(2) : null;
}

/** Id of the home section currently in the middle band of the viewport. */
function useSectionOnScreen(idList: string, enabled: boolean) {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled || !idList) return;
    // Ids arrive joined so the effect re-runs only when they really change.
    const ids = idList.split(",");
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setCurrent(ids.find((id) => visible.has(id)) ?? null);
      },
      // A band across the middle of the screen: a section counts as "here"
      // once it reaches it, not when its first pixel scrolls in.
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [idList, enabled]);
  return current;
}

export function NavLinks({
  links,
  cta,
  className,
  itemClassName,
}: {
  links: NavLink[];
  cta?: {
    href: string;
    label: string;
    placement: CtaPlacement;
    className?: string;
  };
  className?: string;
  itemClassName?: string;
}) {
  // Null outside the App Router (tests, static previews).
  const pathname = usePathname() ?? "";
  const onHome = pathname === "/";
  const ids = links.map((l) => sectionId(l.href)).filter(Boolean);
  const section = useSectionOnScreen(ids.join(","), onHome);

  const currentFor = (href: string): "page" | "location" | undefined => {
    const id = sectionId(href);
    if (id) return onHome && section === id ? "location" : undefined;
    return pathname === href || pathname.startsWith(`${href}/`)
      ? "page"
      : undefined;
  };

  return (
    <div className={className}>
      {links.map((link) => (
        <AnchorLink
          key={link.href}
          href={link.href}
          aria-current={currentFor(link.href)}
          className={cn(itemClassName, ACTIVE)}
        >
          {link.label}
        </AnchorLink>
      ))}
      {cta ? (
        <CtaLink
          href={cta.href}
          placement={cta.placement}
          aria-current={currentFor(cta.href)}
          className={cn(cta.className, ACTIVE, "aria-[current]:text-primary")}
        >
          {cta.label}
        </CtaLink>
      ) : null}
    </div>
  );
}
