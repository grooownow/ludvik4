"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { CursorDrop } from "./cursor-drop";
import {
  DEFAULT_INTRO_VARIANT,
  DROP_TINT,
  INTRO_ART,
  INTRO_VARIANTS,
  INTRO_VARIANT_STORAGE_KEY,
  type IntroVariant,
  introSources,
  parseIntroVariant,
} from "./intro-variants";

type Props = {
  alt: string;
  switcher: { label: string; candy: string; fuchsia: string };
  /** Copy overlaid on the artwork (rendered by the server component). */
  children: ReactNode;
};

// Raw swatch colours are allowed for the intro (owner's call, see ADR 0011):
// they preview each artwork, so they are the art's colours, not theme tokens.
const SWATCH: Record<IntroVariant, string> = {
  candy: "bg-[linear-gradient(135deg,#ffe066,#ff3d00)]",
  fuchsia: "bg-[linear-gradient(135deg,#ff2ccf,#3a0a2c)]",
};

function readStoredVariant(): IntroVariant | null {
  try {
    return parseIntroVariant(
      window.localStorage.getItem(INTRO_VARIANT_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

function storeVariant(variant: IntroVariant) {
  try {
    window.localStorage.setItem(INTRO_VARIANT_STORAGE_KEY, variant);
  } catch {
    // Private mode or blocked storage: the choice just won't persist.
  }
}

export function IntroStage({ alt, switcher, children }: Props) {
  const [variant, setVariant] = useState<IntroVariant>(DEFAULT_INTRO_VARIANT);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Read after hydration so server and first client render agree.
  useEffect(() => {
    const stored = readStoredVariant();
    if (stored) setVariant(stored);
  }, []);

  const choose = (next: IntroVariant) => {
    setVariant(next);
    storeVariant(next);
  };

  const src = introSources(variant);

  return (
    <div
      ref={stageRef}
      data-variant={variant}
      className="relative aspect-[390/600] w-full overflow-hidden md:aspect-[1304/680] 2xl:aspect-auto 2xl:h-[760px]"
    >
      <picture key={variant}>
        <source
          media="(max-width: 767px)"
          type="image/avif"
          srcSet={src.mobileAvif}
        />
        <source
          media="(max-width: 767px)"
          type="image/webp"
          srcSet={src.mobileWebp}
        />
        <source type="image/avif" srcSet={src.desktopAvif} sizes="100vw" />
        <source type="image/webp" srcSet={src.desktopWebp} sizes="100vw" />
        <img
          ref={imageRef}
          src={src.fallback}
          alt={alt}
          width={INTRO_ART.desktop.width}
          height={INTRO_ART.desktop.height}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <CursorDrop
        imageRef={imageRef}
        stageRef={stageRef}
        tint={DROP_TINT[variant]}
        imageKey={variant}
      />

      {children}

      <fieldset className="bg-intro/40 absolute right-4 bottom-4 flex gap-2 rounded-full border-0 p-1.5 backdrop-blur-sm md:right-6 md:bottom-6">
        <legend className="sr-only">{switcher.label}</legend>
        {INTRO_VARIANTS.map((option) => (
          <button
            key={option}
            type="button"
            aria-label={switcher[option]}
            aria-pressed={variant === option}
            title={switcher[option]}
            onClick={() => choose(option)}
            className={`${SWATCH[option]} ring-offset-intro focus-visible:ring-intro-foreground aria-pressed:ring-intro-foreground h-7 w-7 rounded-full ring-offset-2 transition-shadow outline-none focus-visible:ring-2 aria-pressed:ring-2`}
          />
        ))}
      </fieldset>
    </div>
  );
}
