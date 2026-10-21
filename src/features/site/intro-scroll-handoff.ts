import { type RefObject, useEffect } from "react";

// Between the full-screen intro and the content below there is no "halfway":
// the first scroll gesture down from the intro glides the page to the content,
// and the first gesture up from the top of the content glides back. Below that
// point, scrolling is untouched.

/** Glide duration — slow on purpose, so the hand-off reads as a transition. */
export const HANDOFF_MS = 1100;

/** Wheel events closer together than this are one gesture (incl. momentum). */
const GESTURE_GAP_MS = 180;

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/**
 * Where a scroll gesture should glide to, or null to leave it alone.
 * `introBottom` is the document offset where the content starts.
 */
export function handoffTarget(
  scrollY: number,
  introBottom: number,
  direction: "down" | "up",
): number | null {
  const edge = 2;
  if (direction === "down" && scrollY < introBottom - edge) return introBottom;
  if (direction === "up" && scrollY > 0 && scrollY <= introBottom + edge) {
    return 0;
  }
  return null;
}

function reducedMotion(): boolean {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

const DOWN_KEYS = new Set(["ArrowDown", "PageDown", " ", "Spacebar"]);
const UP_KEYS = new Set(["ArrowUp", "PageUp"]);

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export function useIntroScrollHandoff(stageRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reducedMotion()) return;

    let frame = 0;
    let gliding = false;
    let settling = false;
    let lastWheel = 0;

    const introBottom = () =>
      stage.getBoundingClientRect().bottom + window.scrollY;

    const glide = (to: number) => {
      const from = window.scrollY;
      const start = performance.now();
      gliding = true;
      const step = (now: number) => {
        const t = Math.min((now - start) / HANDOFF_MS, 1);
        window.scrollTo({
          top: from + (to - from) * easeInOutCubic(t),
          behavior: "instant",
        });
        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          gliding = false;
          settling = true;
        }
      };
      frame = requestAnimationFrame(step);
    };

    /** Returns true when the gesture was taken over (caller cancels it). */
    const take = (direction: "down" | "up"): boolean => {
      if (gliding) return true;
      // The intro is hidden on phones: nothing to hand off from.
      if (!stage.offsetHeight) return false;
      const to = handoffTarget(window.scrollY, introBottom(), direction);
      if (to === null) return false;
      glide(to);
      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0) return;
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (gliding) {
        event.preventDefault();
        return;
      }
      // A trackpad keeps firing momentum events after the glide; swallow that
      // tail so it neither overshoots into the content nor glides back.
      if (settling) {
        if (gap < GESTURE_GAP_MS) {
          event.preventDefault();
          return;
        }
        settling = false;
      }
      if (take(event.deltaY > 0 ? "down" : "up")) event.preventDefault();
    };

    let touchY: number | null = null;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      if (touchY === null || y === undefined) return;
      const dy = touchY - y;
      if (gliding) {
        event.preventDefault();
        return;
      }
      if (Math.abs(dy) < 8) return;
      if (take(dy > 0 ? "down" : "up")) {
        event.preventDefault();
        touchY = null;
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;
      const direction = DOWN_KEYS.has(event.key)
        ? "down"
        : UP_KEYS.has(event.key)
          ? "up"
          : null;
      if (direction && take(direction)) event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [stageRef]);
}
