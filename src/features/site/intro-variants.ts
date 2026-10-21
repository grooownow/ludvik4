// The two pre-rendered intro artworks (exported from design.pen frames
// k6P8zl / HGwzH and their tall portrait versions). They are the first paint
// and the fallback; on desktop the live scene (intro-scene) paints over them.

export type IntroVariant = "candy" | "fuchsia";

export const INTRO_VARIANTS: readonly IntroVariant[] = ["candy", "fuchsia"];

export const DEFAULT_INTRO_VARIANT: IntroVariant = "candy";

export const INTRO_VARIANT_STORAGE_KEY = "ludvik4:intro-variant";

/** Width/height of the desktop and tall (portrait) art, in CSS px at 1x. */
export const INTRO_ART = {
  desktop: { width: 1304, height: 680 },
  tall: { width: 390, height: 844 },
} as const;

/** Portrait screens and phones get the tall art so the wordmark never crops. */
export const TALL_ART_MEDIA = "(max-width: 767px), (orientation: portrait)";

export function introSources(variant: IntroVariant) {
  const dir = `/intro/intro-${variant}`;
  return {
    tallAvif: `${dir}-tall-780.avif 780w, ${dir}-tall-1560.avif 1560w`,
    tallWebp: `${dir}-tall-780.webp 780w, ${dir}-tall-1560.webp 1560w`,
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
