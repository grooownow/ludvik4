"use client";

import { type ReactNode, useEffect, useRef } from "react";

/** Fraction of the viewport height scrolled by which the header is fully in. */
export const REVEAL_DISTANCE = 0.3;

/**
 * Header opacity for a scroll position: 0 at the top of the page, 1 once
 * `REVEAL_DISTANCE` of the viewport has scrolled past, with a smoothstep ease
 * so it fades in softly instead of linearly.
 */
export function revealOpacity(scrollY: number, viewportHeight: number): number {
  const distance = Math.max(viewportHeight * REVEAL_DISTANCE, 1);
  const t = Math.min(Math.max(scrollY / distance, 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * Home-page header that sits over the full-screen intro and surfaces as the
 * visitor scrolls. Opacity follows the scroll position, eased toward it on
 * every frame so wheel steps don't make it jump. Fully transparent, it is also
 * `visibility: hidden` — no invisible links to click or tab into; at the very
 * top the intro and the hero CTA are the page's first stops. Once it has any
 * opacity, focus inside it (keyboard users) shows it fully at once.
 */
export function ScrollRevealHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let shown = revealOpacity(window.scrollY, window.innerHeight);
    let focused = false;
    let frame = 0;
    let last = performance.now();

    const phone = () =>
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 767px)").matches;

    const paint = () => {
      // Phones have no intro (see intro-hero): the header is just the header.
      if (phone()) {
        el.style.opacity = "";
        el.style.visibility = "";
        return;
      }
      const value = focused ? 1 : shown;
      el.style.opacity = value.toFixed(3);
      el.style.visibility = value < 0.01 ? "hidden" : "visible";
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const target = revealOpacity(window.scrollY, window.innerHeight);
      // Exponential approach with a ~0.18 s time constant: smooth, not laggy.
      shown += (target - shown) * (1 - Math.exp(-dt / 0.18));
      if (Math.abs(target - shown) < 0.002) shown = target;
      paint();
      frame = Math.abs(target - shown) > 0 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const onFocusIn = () => {
      focused = true;
      paint();
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!el.contains(event.relatedTarget as Node | null)) {
        focused = false;
        paint();
      }
    };

    paint();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-testid="scroll-reveal-header"
      // From md up the server HTML starts hidden, so the header does not flash
      // over the intro before hydration; the effect then drives it inline.
      // Phones keep the ordinary sticky header.
      className="sticky top-0 z-30 md:invisible md:fixed md:inset-x-0 md:opacity-0"
    >
      {children}
    </div>
  );
}
