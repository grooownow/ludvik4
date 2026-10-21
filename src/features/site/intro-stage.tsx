"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { IntroScene } from "./intro-scene";
import {
  DEFAULT_INTRO_VARIANT,
  INTRO_ART,
  INTRO_VARIANTS,
  INTRO_VARIANT_STORAGE_KEY,
  type IntroVariant,
  TALL_ART_MEDIA,
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
  const [live, setLive] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

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
    // Fills the viewport (svh: stable under mobile browser toolbars), with a
    // floor so short landscape phones still fit the wordmark and copy.
    <div
      ref={stageRef}
      data-variant={variant}
      data-live={live}
      className="group relative h-svh min-h-[560px] w-full overflow-hidden"
    >
      <picture key={variant}>
        <source
          media={TALL_ART_MEDIA}
          type="image/avif"
          srcSet={src.tallAvif}
          sizes="100vw"
        />
        <source
          media={TALL_ART_MEDIA}
          type="image/webp"
          srcSet={src.tallWebp}
          sizes="100vw"
        />
        <source type="image/avif" srcSet={src.desktopAvif} sizes="100vw" />
        <source type="image/webp" srcSet={src.desktopWebp} sizes="100vw" />
        <img
          src={src.fallback}
          alt={alt}
          width={INTRO_ART.desktop.width}
          height={INTRO_ART.desktop.height}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-data-[live=true]:opacity-100">
        <IntroScene
          stageRef={stageRef}
          copyRef={copyRef}
          variant={variant}
          onLiveChange={setLive}
        />
      </div>

      {/* While the live scene paints, it draws this copy itself (so the drop
          can refract it); the HTML stays for screen readers and search. */}
      <div
        ref={copyRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-data-[live=true]:opacity-0"
      >
        {children}
      </div>

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
