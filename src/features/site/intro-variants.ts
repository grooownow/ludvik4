// The two pre-rendered intro artworks (exported from design.pen frames
// k6P8zl / HGwzH and their mobile crops). The wordmark, silk background and
// melt are baked into the image; only the glass drop is live (cursor-drop).

export type IntroVariant = "candy" | "fuchsia";

export const INTRO_VARIANTS: readonly IntroVariant[] = ["candy", "fuchsia"];

export const DEFAULT_INTRO_VARIANT: IntroVariant = "candy";

export const INTRO_VARIANT_STORAGE_KEY = "ludvik4:intro-variant";

/** Width/height of the desktop and mobile art, in CSS pixels at 1x. */
export const INTRO_ART = {
  desktop: { width: 1304, height: 680 },
  mobile: { width: 390, height: 600 },
} as const;

export function introSources(variant: IntroVariant) {
  const dir = `/intro/intro-${variant}`;
  return {
    mobileAvif: `${dir}-mobile-780.avif`,
    mobileWebp: `${dir}-mobile-780.webp`,
    desktopAvif: `${dir}-desktop-1304.avif 1304w, ${dir}-desktop-2608.avif 2608w`,
    desktopWebp: `${dir}-desktop-1304.webp 1304w, ${dir}-desktop-2608.webp 2608w`,
    fallback: `${dir}-desktop-1304.webp`,
  };
}

/** Drop tint per variant, as linear 0..1 RGB for the shader. */
export const DROP_TINT: Record<IntroVariant, [number, number, number]> = {
  candy: [1, 0.82, 0.9],
  fuchsia: [1, 0.7, 0.93],
};

export function parseIntroVariant(value: unknown): IntroVariant | null {
  return value === "candy" || value === "fuchsia" ? value : null;
}
