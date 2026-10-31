"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { type Locale, localizeHref, splitLocale } from "@/lib/i18n";

// The banner speaks the page's language (ludvik4.dev: EN, ES, RU).
const COPY: Record<
  Locale,
  {
    region: string;
    text: string;
    policy: string;
    decline: string;
    accept: string;
  }
> = {
  en: {
    region: "Cookie choice",
    text: "Analytics here runs without cookies by default. Allowing cookies lets us see how visitors actually move through the site — including session replays, with everything you type in the contact form hidden — so we can fix what does not work.",
    policy: "Cookie Policy",
    decline: "Decline",
    accept: "Allow cookies",
  },
  es: {
    region: "Elección de cookies",
    text: "Por defecto, la analítica de esta web funciona sin cookies. Si las aceptas, veremos cómo se mueven realmente los visitantes por la web —también con grabaciones de sesión, en las que todo lo que escribas en el formulario de contacto queda oculto— y podremos arreglar lo que no funciona.",
    policy: "Política de cookies",
    decline: "Rechazar",
    accept: "Aceptar cookies",
  },
  ru: {
    region: "Выбор cookies",
    text: "По умолчанию аналитика на сайте работает без cookies. Если вы их разрешите, мы увидим, как посетители на самом деле ходят по сайту, включая записи сессий (всё, что вы вводите в форме заявки, в них скрыто), и сможем исправить то, что не работает.",
    policy: "Политика cookies",
    decline: "Отклонить",
    accept: "Разрешить cookies",
  },
};

/**
 * The cookie choice, as a bottom bar.
 *
 * Presentation only — it never reads consent and never talks to PostHog, so it
 * renders in a test without the SDK. `AnalyticsProvider` owns the decision of
 * whether it appears at all.
 *
 * Both buttons carry the same size and sit side by side, and Decline is not
 * demoted to a link: consent that is harder to refuse than to give is not
 * freely given. Declining costs the visitor nothing either way — analytics
 * stays cookieless — which is why the copy says what consent *adds* rather
 * than asking for permission to exist.
 */
export function ConsentBanner({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  const region = useRef<HTMLElement>(null);
  const { locale } = splitLocale(usePathname() ?? "/");
  const copy = COPY[locale];

  useEffect(() => {
    // Move focus to the banner so a keyboard or screen-reader visitor meets it
    // instead of tabbing past it. Focus is *not* trapped: the page behind stays
    // usable, because this asks for an upgrade rather than blocking the site.
    region.current?.focus();
  }, []);

  useEffect(() => {
    // The bar is fixed, so without this it sits on top of the last screenful —
    // on a phone that is most of the footer. Reserve exactly its height, and
    // re-measure on resize, where the copy reflows to a different line count.
    const reserve = () => {
      document.body.style.paddingBottom = `${region.current?.offsetHeight ?? 0}px`;
    };

    reserve();
    window.addEventListener("resize", reserve);

    return () => {
      window.removeEventListener("resize", reserve);
      document.body.style.paddingBottom = "";
    };
  }, []);

  useEffect(() => {
    // Escape declines, from anywhere. On the banner itself the handler would
    // only fire while focus happened to be inside it — and since focus is
    // deliberately not trapped, that is most of the time not the case.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDecline();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onDecline]);

  return (
    <section
      ref={region}
      aria-label={copy.region}
      tabIndex={-1}
      className="motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in border-pink-soft bg-card fixed inset-x-0 bottom-0 z-50 border-t shadow-[0_-14px_40px_-24px_rgba(26,26,26,0.25)] outline-none motion-safe:duration-300"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {copy.text}{" "}
          <Link
            href={localizeHref(locale, "/cookies") as Route}
            className="text-foreground underline underline-offset-4"
          >
            {copy.policy}
          </Link>
        </p>

        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="lg" onClick={onDecline}>
            {copy.decline}
          </Button>
          <Button size="lg" onClick={onAccept}>
            {copy.accept}
          </Button>
        </div>
      </div>
    </section>
  );
}
