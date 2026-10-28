"use client";

import type { ComponentPropsWithoutRef } from "react";
import { OrderFormInline, useOrder, type OrderTarget } from "@/features/order";
import { CtaLink, type CtaPlacement } from "./cta-link";

type OrderCtaProps = Omit<ComponentPropsWithoutRef<"button">, "onClick"> & {
  /** The package being ordered; omit for "Обсудить проект". */
  target?: OrderTarget;
  placement: CtaPlacement;
  /** Called when the press opens the dialog (not on the /contact fallback). */
  onOpen?: () => void;
};

/**
 * "Обсудить проект" and "Заказать": opens the site's order dialog. While the
 * form is not configured (no function URL or captcha key in the build), it is
 * the old link to /contact. Works inside `<Button asChild>`.
 */
export function OrderCta({
  target,
  placement,
  onOpen,
  children,
  ...rest
}: OrderCtaProps) {
  const { config, open } = useOrder();
  if (!config) {
    return (
      <CtaLink
        href="/contact"
        placement={placement}
        {...(rest as Omit<ComponentPropsWithoutRef<"a">, "href">)}
      >
        {children}
      </CtaLink>
    );
  }
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      {...rest}
      onClick={() => {
        open(target, placement);
        onOpen?.();
      }}
    >
      {children}
    </button>
  );
}

/** The order form as a card on /contact; nothing while unconfigured. */
export function ContactOrderCard() {
  const { config } = useOrder();
  if (!config) return null;
  return (
    <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_14px_40px_-24px_rgba(26,26,26,0.18)]">
      <OrderFormInline />
    </div>
  );
}
