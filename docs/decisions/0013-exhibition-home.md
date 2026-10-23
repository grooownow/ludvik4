# ADR 0013: The exhibition home replaces the live silk intro

## Context

ADR 0012 shipped the silk/smoosh brand intro above a text-heavy commercial
home. The owner found it fun but off-style for the rest of the site, and the
home explained too much in words. A brainstorm on 2026-10-22 produced the
"exhibition" concept (`docs/specs/immersive-home.md`): a jelly roly-poly
mascot as the single exhibit on a pink studio stage, then the collection,
three steps, framed work, the curator and a closing call to action.

## Options considered

1. **Keep the silk intro, restyle the sections below** — least work, but the
   intro was the part that clashed with the site's style.
2. **A scroll-driven 3D journey (Apricode-style)** — discussed and set aside:
   it would turn every section into scenery and fight the strict tone.
3. **One live exhibit on a static stage, ordinary sections below** — the
   mascot is the only "loud" element; it scrolls away with its section.

## Decision

Option 3, on both markets (separate builds, no language switcher).

- The stage is one fragment shader (`exhibit-shader.ts`, ported verbatim from
  `experiments/nevalyashka/stage-lab.html`) raymarching the mascot, the pink
  cyclorama, the soft beam and the floor shadow. Motion lives in the pure
  `exhibit-physics.ts`; `exhibit-canvas.tsx` wires pointer input (tap = push,
  horizontal drag = spin, vertical drag = tilt while held). Camera and light
  never move.
- Same live gate as ADR 0012 (`exhibit-gate.ts`): fine pointer, motion
  allowed, ≥ 768 px landscape, GPU WebGL. Everywhere else — phones, touch,
  reduced motion, CPU-emulated WebGL — shows pre-rendered stills
  (`public/stage/`, `scripts/render-stage-still.ts`). Render scale 0.7×DPR
  (max 2), capped at 1600 px; paused off-screen and in hidden tabs.
- The header is visible on the stage (text-only menu, no fade-in); the
  first-scroll glide is gone. The page H1 is visually hidden.
- The lead form moved from the home to `/contact` (EN only; the RU build still
  carries no lead backend). The menu's Services item goes to a minimal
  services index (`/services`, `/uslugi`).
- The old intro and old homes stay in the repository, unrendered, by owner
  decision.

## Consequences

- Changing the look of the stage means editing `exhibit-shader.ts` and
  re-running `pnpm tsx scripts/render-stage-still.ts` so the stills match.
- Phones see a still until the mobile intro is designed (spec Out-of-scope).
- ADR 0012 is superseded once this ships to production.

## Status

`accepted` — shipped to both markets on 2026-10-23; ADR 0012 is superseded.
