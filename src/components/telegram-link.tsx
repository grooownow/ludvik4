"use client";

import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

type TelegramLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "target" | "rel"
> & {
  href: string;
  placement: "home_contact" | "service_contact" | "footer";
};

export function TelegramLink({
  href,
  placement,
  children,
  onClick,
  ...props
}: TelegramLinkProps) {
  const pathname = usePathname();

  const handleClick: NonNullable<ComponentPropsWithoutRef<"a">["onClick"]> = (
    event,
  ) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    // `track` owns the market/key guard and the lazy posthog-js import, so
    // this component no longer carries either. The event name is the one
    // already in production and must not change — old data would not follow.
    track(ANALYTICS_EVENTS.telegramClicked, { path: pathname, placement });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
