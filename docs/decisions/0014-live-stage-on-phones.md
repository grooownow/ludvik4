# ADR 0014: Live exhibit stage on phones, a tap is the only gesture

Status: accepted by the owner (2026-10-23). Amends ADR 0013, which kept
phones on the still "until the mobile intro is designed".

## Context

ADR 0013 ran the live raymarched mascot only with a mouse on a wide landscape
screen; phones, touch and narrow windows got pre-rendered stills. The owner's
goal for the phone is the desktop's: the visitor smiles, wants to touch the
exhibit and wants a site like it — a still that rocks on a tap fell short. The
mobile first screen was designed with the owner on a mockup
(`public/_mockups/mobile-first-screen.html`, variant A; removed before release,
see commit `6dda335`).

## Options considered

1. **Keep the still on phones** — no GPU cost or battery, but the exhibit is a
   picture on the device most visitors arrive on.
2. **Live scene on phones with the desktop's gestures** — drag to tilt and
   spin fights the page scroll on a touch screen (a long press to grab was
   tried in the mockup and dropped by the owner).
3. **Live scene on phones, a tap is the only gesture** — the hit's strength
   follows the press length, any swipe scrolls; a calmer spring on touch.

## Decision

Option 3. The gate drops the mouse and wide-landscape conditions: any device
whose GPU renders WebGL, with motion allowed, gets the live scene, and the
quality ladder steps a slow one down to the still. Narrow stages (< 640 px)
frame the mascot 1.38× larger at 53% / 43%, in the shader and in the still
layers alike. Details: `docs/specs/immersive-home.md` → "Mobile first screen".

## Consequences

- Phones and tablets do real GPU work per frame while the stage is on screen
  (paused off screen and in hidden tabs). A slow phone falls back to the still
  through the existing frame-time ladder, not through a device list.
- Touch has no tilt or spin; the desktop's gestures and spring are unchanged.
- The still layers carry the phone framing in CSS; re-rendering the stills
  (`scripts/render-stage-still.ts`) keeps the default framing.
