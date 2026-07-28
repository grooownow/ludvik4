"use client";

import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

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

    if (!POSTHOG_KEY || event.defaultPrevented) {
      return;
    }

    void import("posthog-js").then(({ default: posthog }) => {
      posthog.capture("contact.telegram_clicked", {
        path: pathname,
        placement,
      });
    });
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
