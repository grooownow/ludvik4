# Plan — mobile first screen (immersive-home, phone)

Spec: `docs/specs/immersive-home.md` → "Mobile first screen". Branch:
`feat/immersive-home` (shared with a session working on the sections below;
touch only the stage files listed here).

Touch-points (all in `src/features/site/`, no new slice, no schema, no env):

- `exhibit-gate.ts` — `shouldRunLiveStage` drops the fine-pointer and
  wide-landscape conditions; `PHONE_FRAMING` / `stageFraming(narrow)`.
- `exhibit-shader.ts` — `uZoom`, `uCenter` in the uv mapping.
- `exhibit-physics.ts` — `createMascotState({ free })`, `PHONE_SPRING`,
  `tapKick(heldMs)`.
- `exhibit-canvas.tsx` — framing uniforms (recomputed on resize), touch =
  tap-only with the press-scaled kick and a 12 px slop, calm spring on
  `pointer: coarse`, `touch-manipulation` so swipes scroll.
- `exhibit-stage.tsx` — a framing wrapper around both still layers on narrow
  screens (scale 1.38, translate 3% / −7%).
- `home-stage.tsx` — one-line strip; `established` hidden below `sm`.
- `scripts/render-stage-still.ts` — sets `uZoom` 1 and `uCenter` 0.5/0.5.
- Tests per the spec's scenarios 1–5.

Open decisions: none — framing, gesture, spring and copy were settled with the
owner in chat (mockup variant A); the still's push staying as it is is my
call, written into the spec.

NO UNRESOLVED DECISIONS
