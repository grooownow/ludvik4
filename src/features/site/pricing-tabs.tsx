"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

// Tabs of the services page. Each tab is its own page, /uslugi/<slug>
// (owner, 2026-10-27), so search engines see one service per URL and a hall
// card on the home links straight to it. The tabs are links; the chosen one
// is the current page.

type Tab = { id: string; label: string; href: string };

export function PricingTabs({
  tabs,
  activeId,
}: {
  tabs: Tab[];
  activeId: string;
}) {
  return (
    // Phones: one scrollable row of chips.
    <nav
      aria-label="Услуги"
      className="-mx-6 flex [scrollbar-width:none] gap-2 overflow-x-auto px-6 pb-1"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href as Route}
          scroll={false}
          aria-current={activeId === tab.id ? "page" : undefined}
          className={cn(
            "shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-colors",
            activeId === tab.id
              ? "border-foreground bg-foreground text-white"
              : "border-pink-soft text-stage-muted hover:border-primary/40 hover:text-foreground bg-white/60",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * The tabs used to live in the URL hash (/uslugi#saity). Old links still
 * work: on the hub, a known hash moves to that tab's own page.
 */
export function LegacyHashRedirect({ tabs }: { tabs: Tab[] }) {
  const router = useRouter();
  useEffect(() => {
    const id = new URL(document.URL).hash.slice(1);
    const tab = tabs.find((t) => t.id === id);
    if (tab) router.replace(tab.href as Route);
  }, [router, tabs]);
  return null;
}
