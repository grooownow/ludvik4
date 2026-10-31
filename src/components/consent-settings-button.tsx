"use client";

import { usePathname } from "next/navigation";
import { useAnalyticsConsent } from "@/components/analytics-provider";
import { Button } from "@/components/ui/button";
import { type Locale, splitLocale } from "@/lib/i18n";

const LABEL: Record<Locale, string> = {
  en: "Cookie settings",
  es: "Configurar cookies",
  ru: "Настройки cookies",
};

/**
 * Withdraws the cookie choice, bringing the banner back.
 *
 * GDPR wants withdrawing consent to be as easy as giving it, so this sits in
 * the footer of every page rather than behind a settings screen.
 *
 * It renders nothing until a status exists — which means nothing at all on the
 * RU build and on any build without a PostHog key. The suppression lives here
 * rather than at the call sites because the footer is shared between markets,
 * and a control that cannot do anything is worse than no control.
 */
export function ConsentSettingsButton({ className }: { className?: string }) {
  const { status, withdraw } = useAnalyticsConsent();
  const { locale } = splitLocale(usePathname() ?? "/");

  if (status === null || status === "pending") {
    return null;
  }

  return (
    <Button variant="link" size="xs" onClick={withdraw} className={className}>
      {LABEL[locale]}
    </Button>
  );
}
