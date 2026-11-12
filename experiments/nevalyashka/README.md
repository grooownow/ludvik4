# Roly-poly jelly mascot concepts

Created on 2026-10-22 with the built-in image generation tool, outside Pencil.
Reference: `design.pen`, node `O7O2hV` (Jelly scene).

- `variant-a-classic.png`: separate head and broad round lower body.
- `variant-b-integrated.png`: softer joined pear-shaped silhouette.
- `variant-b-rounder-v2.png`: wider, plumper revision of B, requested by the user.
- `prompt-rounder-v2.txt`: exact built-in image generation edit prompt for v2.
- `reference/O7O2hV.png`: exported original node, including its shader material.
- `prompts.txt`: exact prompts for both concepts.

Both concepts keep the fuchsia glossy jelly material, ball-tipped antenna,
two eye openings, belly opening, short arms with ring hands, and a ground shadow.
These are static 3D-style concept renders on an off-white background, not
transparent cutouts or editable 3D models. No Pencil generation was used and
the design canvas was not changed.

## Animated volume study

Open `rocking-3d.html` directly in a WebGL-capable browser. It is a single
self-contained offline HTML file with no library, build step or server dependency.
The earlier `index.html` draft is preserved separately.

The character is reconstructed as a volumetric signed-distance field: round
body and head, gently flared through-bores, capsule arms, ring hands and antenna.
It is not an animated PNG or an exported mesh. Its stylized glossy shader
approximates the concept material; it does not exactly reproduce the generated
render's transparency/refraction. The first full-refraction pass showed
artifacts, so this preview uses stable highlights and tinted ground shadows.

Controls: drag to orbit through 360 degrees; click, use arrow keys, or press
Nudge to add an impulse; Pause freezes the scene; Reset view restores the
camera and equilibrium. Set Rocking to zero to observe the impulse decay
without ongoing idle rocking. Save PNG exports the current frame with its floor
and shadow. Reduced-motion users start paused. Two damped springs control
roll/pitch and the ground shadow is recomputed from the moving volume.

Local preview during this session: `http://127.0.0.1:8766/rocking-3d.html`.
Screenshots: `preview-desktop.png`, `preview-mobile.png`.

## Validation — 2026-10-22

Checked in Chromium using the connected Playwright browser after the local CLI
wrapper was found unavailable. Runtime assertions passed for stable paused
pixels, changed animated pixels (9,257 sampled pixels), moving ground shadow
(1,171 sampled pixels), orbit, nudge/resume, PNG download, reduced-motion pause
and visible WebGL-unavailable fallback. The motion assertion was proven to
reject an intentionally paused scene before the active-motion check passed.
Widths 375/768/1280 rendered with no horizontal overflow; browser console had
zero errors or warnings. Screenshots were visually reviewed. This is an isolated
local art prototype; no production route, deployment or production build changed.
