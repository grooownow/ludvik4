"use client";

import { Button } from "@/components/ui/button";

/**
 * Confirmation that `?ludvik4_internal=…` took effect on this device.
 *
 * A console line would have been cheaper, but the device this feature exists
 * for is most often a phone, where there is no console to read. Without a
 * visible answer there is no way to tell a muted browser from one where the
 * link was mistyped — and the whole point is to trust that your own visits
 * stopped being counted.
 *
 * Presentation only, like `ConsentBanner`: it never touches storage, and
 * `AnalyticsProvider` decides whether it appears. It appears only on a page
 * load that actually carried the parameter, so an ordinary visitor never
 * meets it.
 */
export function InternalNotice({
  muted,
  onDismiss,
}: {
  muted: boolean;
  onDismiss: () => void;
}) {
  return (
    <output
      aria-label="Analytics on this device"
      className="motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in border-pink-soft bg-card fixed inset-x-0 bottom-0 z-50 block max-h-[50dvh] overflow-y-auto border-t shadow-lg motion-safe:duration-300"
    >
      <div className="mx-auto flex max-w-5xl items-start justify-between gap-3 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6">
        <p className="text-foreground min-w-0 py-3 text-sm leading-snug font-medium">
          {muted
            ? "Analytics is off on this device."
            : "Analytics is on again on this device."}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 shrink-0"
          aria-label="Dismiss analytics notice"
          onClick={onDismiss}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-4"
          >
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </Button>
      </div>
    </output>
  );
}
