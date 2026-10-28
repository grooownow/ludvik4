"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { OrderCta } from "./order-cta";

// The mascot's speech bubble (owner, 2026-10-26): it tells the visitor that an
// animation like Ludvik can be made for their own site. It waits for the
// visitor to touch the mascot — a press, a drag or a trackpad swipe on the
// stage — and comes on its own after a quiet while, inviting them to try.
// A comic bubble left of the head, its tail pointing at it. RU only.
// Once dismissed — its × or its order button — it stays gone on later visits
// (owner, 2026-10-28), until the visitor clears the site's storage.

const IDLE_MS = 8000;

/** localStorage key: "1" once the visitor dismissed the bubble. */
export const MASCOT_REPLY_DISMISSED_KEY = "ludvik4:mascot-reply-dismissed";

// Storage can be blocked (private mode, disabled site data): the bubble then
// simply behaves as before, per visit.
function wasDismissed() {
  try {
    return localStorage.getItem(MASCOT_REPLY_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberDismissed() {
  try {
    localStorage.setItem(MASCOT_REPLY_DISMISSED_KEY, "1");
  } catch {
    // Not remembered; it closes for this visit only.
  }
}

/** The bubble's order: the animation service, no package picked yet. */
const ANIMATION_ORDER = { service: "Анимации и 3D", plan: "", price: "" };

/** True once the mascot was touched: the live canvas or the still's push button. */
function useMascotTouched(root: React.RefObject<HTMLElement | null>) {
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    const stage = root.current?.closest("[data-stage]");
    if (!stage) return;
    const onTouch = (event: Event) => {
      const target = event.target as Element;
      if (target.tagName === "CANVAS" || target.closest("[data-exhibit-push]"))
        setTouched(true);
    };
    stage.addEventListener("pointerup", onTouch);
    stage.addEventListener("wheel", onTouch, { passive: true });
    return () => {
      stage.removeEventListener("pointerup", onTouch);
      stage.removeEventListener("wheel", onTouch);
    };
  }, [root]);
  return touched;
}

export function MascotReply() {
  const root = useRef<HTMLDivElement>(null);
  const touched = useMascotTouched(root);
  const [idle, setIdle] = useState(false);
  const [closed, setClosed] = useState(false);

  // Read after mount, not during render: the static HTML has no storage, and
  // the bubble is hidden until a touch or the idle timer anyway.
  useEffect(() => {
    if (wasDismissed()) {
      setClosed(true);
      return;
    }
    const t = setTimeout(() => setIdle(true), IDLE_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setClosed(true);
    rememberDismissed();
  };

  const shown = !closed && (touched || idle);

  return (
    <div ref={root} className="absolute inset-0">
      <div
        aria-live="polite"
        data-testid="mascot-reply"
        inert={!shown}
        className={cn(
          "absolute top-[calc(50%-33vmin)] right-[calc(50%+11vmin)] w-max max-w-[16rem] origin-bottom-right rounded-[1.4rem] rounded-br-[0.4rem] bg-white px-4 py-3 text-[13px] leading-snug text-[#3a1a2c] shadow-[0_14px_40px_-18px_rgba(120,20,80,0.45)] transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-opacity max-sm:top-[13vh] max-sm:right-auto max-sm:left-[3.2vw] max-sm:max-w-[11rem] max-sm:text-[11.5px]",
          shown
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-75 opacity-0",
        )}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Скрыть подсказку"
          className="text-stage-muted hover:text-foreground pointer-events-auto absolute top-0.5 right-0.5 grid size-8 cursor-pointer place-items-center rounded-full text-sm leading-none"
        >
          ×
        </button>
        <p className="pr-3">
          {touched ? "Понравилось? " : "Меня можно потрогать! "}
          Такого героя — или ещё круче — сделаем и для вашего сайта.
        </p>
        {/* A roomy hit area: padding around the line, pulled back with a
            negative margin so the text stays where it was. Pressing it (the order
            dialog, or the /contact link without one) also dismisses the
            bubble for good. */}
        <OrderCta
          target={ANIMATION_ORDER}
          placement="mascot"
          onOpen={dismiss}
          className="text-primary hover:text-primary/80 hover:bg-primary/5 pointer-events-auto -mx-2.5 mt-1 -mb-1.5 inline-flex cursor-pointer items-center rounded-xl px-2.5 py-2 font-medium whitespace-nowrap transition-colors"
        >
          Хочу такую анимацию →
        </OrderCta>
        {/* The tail: a thin curved tip toward the mascot's head, like a
            chat bubble's. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 16"
          className="absolute -right-[13px] bottom-0 h-5 w-6 fill-white"
        >
          <path d="M0 0 C1 7 6 13 20 16 C11 16 4 14 0 10 Z" />
        </svg>
      </div>
    </div>
  );
}
