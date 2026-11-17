"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import type { Screen } from "./case-gallery";

// Fullscreen screen gallery for the /cases pages. A page opens whole (fitted
// to the screen); a click on the picture zooms it to width with scrolling and
// back. Phones and very tall pages (over 3× their width, unless the screen
// sets `openWhole`) open at width — a fitted 15 000px page is an unreadable
// sliver. Arrows / ← → / swipe page,
// Esc or any click outside the picture closes, focus returns to the opener.

type Open = (slug: string, index: number) => void;
const GalleryContext = createContext<Open | null>(null);

/** Gallery chrome in the page's language. */
export type GalleryLabels = {
  mobile: string;
  desktop: string;
  close: string;
  prev: string;
  next: string;
};

export const RU_GALLERY_LABELS: GalleryLabels = {
  mobile: "мобильная",
  desktop: "десктоп",
  close: "Закрыть",
  prev: "Предыдущий экран",
  next: "Следующий экран",
};

const LabelsContext = createContext<GalleryLabels>(RU_GALLERY_LABELS);

export function ScreenGalleryProvider({
  galleries,
  labels = RU_GALLERY_LABELS,
  children,
}: {
  galleries: Record<string, Screen[]>;
  labels?: GalleryLabels;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<{ slug: string; index: number } | null>(
    null,
  );
  const opener = useRef<HTMLElement | null>(null);
  const open = useCallback<Open>((slug, index) => {
    opener.current = document.activeElement as HTMLElement | null;
    setState({ slug, index });
  }, []);
  const close = useCallback(() => {
    setState(null);
    opener.current?.focus();
  }, []);
  const screens = state ? (galleries[state.slug] ?? []) : [];

  return (
    <GalleryContext.Provider value={open}>
      <LabelsContext.Provider value={labels}>
        {children}
        {state && screens.length > 0 ? (
          <GalleryDialog
            screens={screens}
            index={state.index}
            onIndex={(index) => setState({ slug: state.slug, index })}
            onClose={close}
          />
        ) : null}
      </LabelsContext.Provider>
    </GalleryContext.Provider>
  );
}

/** A button that opens screen `index` of project `slug` in the gallery. */
export function ScreenButton({
  slug,
  index,
  label,
  className,
  children,
}: {
  slug: string;
  index: number;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  const open = useContext(GalleryContext);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => open?.(slug, index)}
      className={cn("cursor-zoom-in", className)}
    >
      {children}
    </button>
  );
}

function GalleryDialog({
  screens,
  index,
  onIndex,
  onClose,
}: {
  screens: Screen[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const labels = useContext(LabelsContext);
  const n = screens.length;
  const i = ((index % n) + n) % n;
  const screen = screens[i]!;
  const tall = !screen.openWhole && screen.full.height / screen.full.width > 3;
  const [fit, setFit] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const go = useCallback((d: number) => onIndex(i + d), [i, onIndex]);

  // Each screen starts at the top, fitted unless it is a phone-width view or a very tall page.
  useEffect(() => {
    setFit(window.innerWidth > 700 && !tall);
    if (body.current) body.current.scrollTop = 0;
  }, [i, tall]);

  useEffect(() => {
    closeBtn.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Tab" && dialog.current) {
        // Keep focus inside the dialog.
        // Only buttons that can take focus: the arrows are hidden on phones.
        const items = [
          ...dialog.current.querySelectorAll<HTMLElement>("button"),
        ].filter((b) => b.offsetParent !== null);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const onPictureClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // A picture that already fits at width has nothing to zoom (phones).
    if (!fit) {
      const el = body.current;
      if (el && e.currentTarget.offsetHeight <= el.clientHeight) return;
      return setFit(true);
    }
    // Zoom in around the clicked point.
    const r = e.currentTarget.getBoundingClientRect();
    const k = (e.clientY - r.top) / r.height;
    setFit(false);
    requestAnimationFrame(() => {
      const el = body.current;
      const img = el?.querySelector("img");
      if (el && img) el.scrollTop = k * img.offsetHeight - el.clientHeight / 2;
    });
  };

  // Any click outside the picture and the buttons closes. A native listener:
  // the dialog itself is not an interactive element (Esc and ✕ are the
  // keyboard ways out).
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest("img, button")) onClose();
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [onClose]);

  return (
    <dialog
      ref={dialog}
      open
      aria-modal="true"
      aria-label={`${screen.caption} · ${screen.kind === "mobile" ? labels.mobile : labels.desktop}`}
      className="bg-intro/95 text-intro-foreground fixed inset-0 z-[100] m-0 flex h-full max-h-none w-full max-w-none flex-col border-0 p-0"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
        <span>
          <span className="font-semibold">
            {screen.caption} ·{" "}
            {screen.kind === "mobile" ? labels.mobile : labels.desktop}
          </span>{" "}
          <span className="font-mono opacity-70">
            {i + 1} / {n}
          </span>
        </span>
        <button
          ref={closeBtn}
          type="button"
          aria-label={labels.close}
          onClick={onClose}
          className="border-intro-foreground/25 bg-intro-foreground/5 grid size-11 place-items-center rounded-full border text-xl"
        >
          ✕
        </button>
      </div>
      <div
        ref={body}
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          const x0 = touchX.current;
          touchX.current = null;
          const x1 = e.changedTouches[0]?.clientX;
          if (x0 == null || x1 == null) return;
          if (Math.abs(x1 - x0) > 60) go(x1 < x0 ? 1 : -1);
        }}
        className={cn(
          "flex min-h-0 flex-1 justify-center overscroll-contain px-2 pb-4 sm:px-16 sm:pb-6",
          fit ? "items-center overflow-hidden" : "overflow-y-auto",
        )}
      >
        <Image
          key={screen.full.src}
          src={screen.full.src}
          alt={screen.caption}
          width={screen.full.width}
          height={screen.full.height}
          unoptimized
          onClick={onPictureClick}
          className={cn(
            "rounded-lg",
            fit
              ? "h-auto max-h-full w-auto max-w-full cursor-zoom-in self-center"
              : cn(
                  "h-auto w-full cursor-zoom-out self-start",
                  // Desktop zooms to the full width: a cap could make it smaller than fitted.
                  screen.kind === "mobile" ? "max-w-[420px]" : "max-w-none",
                ),
          )}
        />
      </div>
      {n > 1 ? (
        <>
          <NavButton side="prev" onClick={() => go(-1)} />
          <NavButton side="next" onClick={() => go(1)} />
        </>
      ) : null}
    </dialog>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "prev" | "next";
  onClick: () => void;
}) {
  const labels = useContext(LabelsContext);
  return (
    <button
      type="button"
      aria-label={side === "prev" ? labels.prev : labels.next}
      onClick={onClick}
      className={cn(
        "border-intro-foreground/25 bg-intro-foreground/5 absolute top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border text-xl sm:grid",
        side === "prev" ? "left-3" : "right-3",
      )}
    >
      {side === "prev" ? "←" : "→"}
    </button>
  );
}
