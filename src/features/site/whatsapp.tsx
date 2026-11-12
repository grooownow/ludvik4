"use client";

import { usePathname } from "next/navigation";
import { type ComponentPropsWithoutRef, useEffect, useState } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { UiCopy } from "./ui-copy";

// The WhatsApp chat with the owner, ludvik4.dev only
// (docs/specs/whatsapp-button.md): a floating button, a header icon and a
// footer link, all opening the same chat with a greeting typed in.

/** +34 665 575 316: digits only, as the wa.me link wants it. */
export const WHATSAPP_NUMBER = "34665575316";

/**
 * The click-to-chat link. Per WhatsApp's own FAQ
 * (https://faq.whatsapp.com/5913398998672934) the number goes in full
 * international form without "+", spaces or dashes, and `text` is the
 * URL-encoded message prefilled in the chat.
 */
export function whatsappHref(greeting: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(greeting)}`;
}

/** The WhatsApp glyph (Simple Icons, CC0). Inherits the text colour. */
export function WhatsAppMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export type WhatsAppPlacement = "float" | "header" | "footer";

type WhatsAppLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "target" | "rel"
> & {
  copy: UiCopy["whatsapp"];
  placement: WhatsAppPlacement;
};

/** The chat link; reports `contact.whatsapp_clicked` like Telegram does. */
export function WhatsAppLink({
  copy,
  placement,
  onClick,
  children,
  ...props
}: WhatsAppLinkProps) {
  const pathname = usePathname();
  return (
    <a
      href={whatsappHref(copy.greeting)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        track(ANALYTICS_EVENTS.whatsappClicked, { path: pathname, placement });
      }}
      {...props}
    >
      {children}
    </a>
  );
}

/** localStorage key: "1" once the visitor hid the floating button on a phone. */
export const WHATSAPP_FLOAT_HIDDEN_KEY = "ludvik4:whatsapp-float-hidden";

// Storage can be blocked (private mode): the × then hides it for this page.
function wasHidden() {
  try {
    return localStorage.getItem(WHATSAPP_FLOAT_HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberHidden() {
  try {
    localStorage.setItem(WHATSAPP_FLOAT_HIDDEN_KEY, "1");
  } catch {
    // Not remembered; hidden on this page only.
  }
}

/**
 * Fixed bottom right. Desktop: a larger white pill with the green mark and
 * the caption. Phones: a smaller round green button with a × that hides it —
 * remembered, and only below `sm`, so a widened window shows the pill again.
 * Rendered after mount: the static HTML cannot know the stored choice.
 */
export function WhatsAppFloat({ copy }: { copy: UiCopy["whatsapp"] }) {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(wasHidden());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      data-testid="whatsapp-float"
      data-hidden={hidden || undefined}
      className={cn(
        "motion-safe:animate-in motion-safe:fade-in fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 motion-safe:duration-500 sm:right-6 sm:bottom-6",
        hidden && "max-sm:hidden",
      )}
    >
      <WhatsAppLink
        copy={copy}
        placement="float"
        aria-label={copy.label}
        className="bg-whatsapp text-whatsapp-foreground focus-visible:ring-ring sm:bg-card sm:text-card-foreground sm:border-border flex size-13 items-center justify-center rounded-full shadow-[0_10px_30px_-10px_rgba(26,26,26,0.45)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none motion-reduce:transition-none sm:size-auto sm:gap-3 sm:border sm:py-2.5 sm:pr-5 sm:pl-2.5"
      >
        <span className="sm:bg-whatsapp sm:text-whatsapp-foreground flex items-center justify-center rounded-full sm:size-11">
          <WhatsAppMark className="size-7 sm:size-6" />
        </span>
        <span className="hidden max-w-[13rem] text-sm leading-snug font-medium sm:block">
          {copy.caption}
        </span>
      </WhatsAppLink>
      {/* Phones only: a small × on the button's corner. */}
      <button
        type="button"
        onClick={() => {
          setHidden(true);
          rememberHidden();
        }}
        aria-label={copy.hide}
        className="bg-card text-muted-foreground border-border hover:text-foreground focus-visible:ring-ring absolute -top-2 -left-2 grid size-6 cursor-pointer place-items-center rounded-full border text-xs leading-none shadow-sm after:absolute after:-inset-2.5 after:content-[''] focus-visible:ring-2 focus-visible:outline-none sm:hidden"
      >
        ×
      </button>
    </div>
  );
}
