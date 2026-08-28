"use client";

import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { AnchorLink } from "./anchor-link";

/**
 * Where on the site the call to action was pressed. Kept as a closed union so
 * a new CTA has to name itself rather than land in the data as a typo.
 */
export type CtaPlacement = "nav" | "nav_mobile" | "hero" | "service";

type CtaLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  placement: CtaPlacement;
};

/**
 * The contact call to action, reporting itself as `cta.clicked`.
 *
 * It exists because every page that renders a CTA — the header, the home hero,
 * the service pages — is a Server Component and cannot carry an `onClick`.
 * Wrapping `AnchorLink` rather than `Link` keeps the in-page scroll behaviour
 * those CTAs already rely on; on a page without a `#contact` section
 * `AnchorLink` falls through to a normal navigation, exactly as before.
 */
export function CtaLink({ placement, onClick, ...props }: CtaLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    track(ANALYTICS_EVENTS.ctaClicked, {
      placement,
      target: "contact",
      path: pathname,
    });
  }

  return <AnchorLink onClick={handleClick} {...props} />;
}
