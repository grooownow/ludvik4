"use client";

import { Button } from "@/components/ui/button";
import { INTERNAL_PARAM } from "@/lib/analytics";

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
      className="motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in border-pink-soft bg-card fixed inset-x-0 bottom-0 z-50 block border-t shadow-[0_-14px_40px_-24px_rgba(26,26,26,0.25)] motion-safe:duration-300"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {muted ? (
            <>
              <span className="text-foreground font-medium">
                Analytics is off on this device.
              </span>{" "}
              Visits from this browser are no longer counted. The setting is
              remembered per browser, so a phone and a laptop are two separate
              decisions. Add{" "}
              <code className="text-foreground">?{INTERNAL_PARAM}=0</code> to
              any page here to switch it back on.
            </>
          ) : (
            <>
              <span className="text-foreground font-medium">
                Analytics is on again on this device.
              </span>{" "}
              Visits from this browser are counted like anyone else&apos;s.
            </>
          )}
        </p>

        <div className="shrink-0">
          <Button variant="outline" size="lg" onClick={onDismiss}>
            Got it
          </Button>
        </div>
      </div>
    </output>
  );
}
