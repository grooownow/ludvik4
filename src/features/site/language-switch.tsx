"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  type Locale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_LABELS,
  switchHref,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Saves the visitor's language on this device: a cookie, so the server can
 * open the right language before the page renders (src/middleware.ts), and
 * localStorage, as the owner asked. Strictly necessary, set on the visitor's
 * own request; listed in the cookie policy.
 */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
  try {
    window.localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    // Storage blocked (private mode): the cookie alone is enough.
  }
}

// The language switch in the header: the current language's code; it opens a
// small glass panel (the burger menu's material) with every language by its
// own name. Each one is the same page in that language, or its home when the
// page exists in English only.
export function LanguageSwitch({
  current,
  locales,
  label,
  stage = false,
  className,
}: {
  current: Locale;
  locales: Locale[];
  /** Accessible name: "Language" in the current language. */
  label: string;
  /** Over the exhibit stage: the header's larger stage type. */
  stage?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname() ?? "/";
  // The query (e.g. a package prefilled on /contact) follows the visitor to
  // the same page in another language. Read after mount: pages stay static.
  const [search, setSearch] = useState("");
  useEffect(() => setSearch(new URL(document.URL).search), [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} data-language-switch className={cn("relative", className)}>
      <button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${label}: ${LOCALE_LABELS[current].name}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "text-stage-muted hover:text-foreground flex h-9 cursor-pointer items-center gap-1 rounded-full px-2 font-mono transition-colors",
          stage ? "text-[13px] xl:text-[15px]" : "text-sm",
        )}
      >
        {LOCALE_LABELS[current].short}
        <span
          aria-hidden="true"
          className={cn(
            "text-[10px] transition-transform duration-300",
            open && "rotate-180",
          )}
        >
          ▾
        </span>
      </button>
      <div
        id={panelId}
        inert={!open}
        className={cn(
          "absolute top-full right-0 z-30 mt-2 min-w-40 origin-top-right rounded-3xl bg-white/85 p-2 shadow-[0_18px_50px_-20px_rgba(120,20,80,0.35)] ring-1 ring-white/70 backdrop-blur-xl transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none",
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0",
        )}
      >
        <ul aria-label={label} className="flex flex-col">
          {locales.map((locale) => (
            <li key={locale}>
              <Link
                href={switchHref(`${pathname}${search}`, locale) as Route}
                hrefLang={locale}
                // A prefetch made before the click would carry the old
                // choice through the middleware's language redirect.
                prefetch={false}
                lang={locale}
                aria-current={locale === current ? "true" : undefined}
                onClick={() => rememberLocale(locale)}
                className="text-foreground hover:bg-primary/10 aria-[current]:text-primary flex items-center justify-between gap-4 rounded-2xl px-4 py-2 text-[15px] transition-colors"
              >
                {LOCALE_LABELS[locale].name}
                <span className="text-stage-muted font-mono text-xs">
                  {LOCALE_LABELS[locale].short}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
