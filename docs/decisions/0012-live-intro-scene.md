# ADR 0012: Live intro scene on desktop, no intro on phones

## Context

ADR 0011 shipped the brand intro as baked artwork with only the glass drop
live, plus a candy / fuchsia switcher. Reviewing it next to design.pen, the
owner asked for the site to match the canvas: the silk background and the
melt under the wordmark must move, the drop must refract the tagline and the
services line too, and the drop must trail the cursor heavily instead of
snapping to it. The intro must also fill the viewport, the header must fade in
with the scroll, and the first scroll gesture should glide between the intro
and the content. Fuchsia was dropped. On phones none of the live effect runs,
so the intro would only be a full screen to scroll past.

## Options considered

1. **Video loop of the background** — motion, but a heavy first-paint asset,
   no cursor interaction, and the copy could not be refracted.
2. **Run design.pen's own shaders on the site** — exact match to the canvas,
   but real GPU work per frame, so it must be gated to capable devices.
3. **Keep the intro on phones as a static banner** — brand presence, but it
   pushes the headline and CTA a full screen down on the devices where
   attention is shortest.

## Decision

Option 2 on desktop, and no intro on phones (narrower than 768 px).

- `silk.glsl` and `smoosh.glsl` run byte-for-byte (`intro-shaders.ts`) through
  a small Pen-shader runtime (`pen-shader.ts`) that applies Pen's `@default`
  values and binds `@time` / `@resolution` / `@backdrop`. Pipeline:
  silk → wordmark composite → smoosh → copy + drop (`intro-scene-shaders.ts`).
- The intro copy stays real HTML for search and screen readers; while the
  scene paints, the copy is redrawn into it so the drop refracts it.
- The drop follows the cursor on a spring (`DROP_SPRING`).
- The live scene runs only with a fine pointer, motion allowed, a landscape
  screen at least 768 px wide, and GPU WebGL. CPU-emulated WebGL (SwiftShader,
  llvmpipe) keeps the static artwork: in CI it starved the page enough to
  break smooth scrolling. Everything else gets the pre-rendered artwork,
  with a tall crop for portrait tablets.
- Phones: the intro section is `hidden`, its `<picture>` resolves to a blank
  pixel (no download), the header is the ordinary sticky header, and there is
  no scroll hand-off.
- Header: over the intro it is hidden and fades in by 30% of the viewport
  scrolled. While fully transparent it is also `visibility: hidden`, so it is
  not in the tab order at the very top of the page.
- Scroll hand-off: the first wheel, touch or key gesture inside the intro
  glides to the content in 1.1 s (ease-in-out). The first upward gesture from
  the top of the content glides back. It is off with reduced motion.

## Consequences

- Changing the look means changing uniforms in `intro-scene-config.ts`, or
  re-exporting the wordmark and fallback art from design.pen (frame `k6P8zl`,
  tall frame "Intro tall — candy") into `public/intro/`.
- The shader cost is capped (render width ≤ 1600 px). It pauses off-screen and
  in hidden tabs, but it is real GPU work on desktop.
- A visitor on a phone never sees the intro; the brand is the header wordmark
  and the hero.

## Status

`accepted` — supersedes the "bake the background" and switcher parts of ADR 0011.
