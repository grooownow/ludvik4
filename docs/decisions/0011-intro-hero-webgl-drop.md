# ADR 0011: Brand intro as baked artwork plus a live WebGL drop

## Context

The owner designed a full-bleed brand intro in design.pen: an animated silk
background, a "Ludvik4" wordmark with a shader material (candy gummy or
fuchsia studio chrome) melted by the smoosh shader, and a liquid-glass drop
that follows the cursor. Both variants should ship with a switcher, on both
markets, above the existing home hero. The site so far had no client-side
graphics, Lighthouse guards Performance ≥ 0.90 on the home page, and the RU
market is a static export without image optimisation.

## Options considered

1. **Run every shader live** (silk, smoosh, wordmark material, drop) — exact
   match to the canvas, but four heavy ray-marched passes per frame on the
   LCP element; phones and Lighthouse would pay for it.
2. **Export a video loop** — keeps the motion, but a large first-paint asset
   and no cursor interaction.
3. **Bake the background + wordmark into images, keep only the drop live** —
   static art, one light single-pass fragment shader over it.

## Decision

Option 3. The artwork is exported from design.pen (desktop 1304×680 and
mobile 390×600, AVIF + WebP, both variants) and served through a plain
`<picture>` so the RU static export works without the image optimiser. The
drop is a `"use client"` leaf (`cursor-drop.tsx`) that ports
`cursor-drop.glsl` to WebGL 1 and samples the displayed `<img>` as its
texture. It renders only when the device has a fine pointer, the visitor has
not asked for reduced motion, and WebGL is available; otherwise the intro is
just the image. The visitor's variant choice is stored in `localStorage`.

Deviation from `docs/rules/frontend.md` (tokens only): the owner allowed raw
colours for the intro. Text uses the new `intro` / `intro-foreground` tokens;
only the two switcher swatches use raw gradient colours, because they preview
the artwork rather than the theme.

## Consequences

- Changing the intro look means re-exporting the frames from design.pen
  (`k6P8zl`, `HGwzH` and their mobile crops) and re-encoding to
  `public/intro/`; the code does not change.
- The silk and melt do not move on the site. Adding motion later is a video
  or a live-shader follow-up with its own performance budget.
- The drop's render loop pauses while the intro is off-screen or the tab is
  hidden.

## Status

`superseded by 0012` for the background (now live on desktop), the
variant switcher (removed) and phones (no intro).
