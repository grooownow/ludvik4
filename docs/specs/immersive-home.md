# Spec: Immersive home — "the exhibition"

Design record from the 2026-10-22 brainstorm with the owner. Prototypes and
mockups referenced below live in `experiments/nevalyashka/` (not shipped code).

## Problem

The current home (EN, `ludvik4.dev`) opens with the live silk/smoosh brand
intro (ADR 0012) followed by a text-heavy commercial page: services, how it
works, a long Project Scope block, selected work, FAQ, articles. The owner
finds the intro fun but off-style for the rest of the site, and the page
explains too much in words.

The goal of the home is a lead: a visitor should want Ludvik4 to build their
website or web app. The first seconds must make them **impressed and
curious** — "this is beautiful, alive, creative; she can build striking
visual things" — while the whole page still reads as **disciplined and
professional, not "quirky for its own sake"**. Owner's balance: juicy, bright,
a little cartoonish — but not much of it.

## Concept

One through-line metaphor: **the site is a small exhibition.**

- First screen: a single exhibit on a stage — the jelly roly-poly mascot
  "Ludvik" — with a museum label next to it.
- Services: the "halls" of the collection.
- Work: exhibits in frames with museum labels.
- Closing call to action: "Your exhibit next?"

Minimal copy everywhere. The metaphor carries the story, not paragraphs.

## Page structure (top to bottom)

All copy below was approved by the owner as written in the mockup
(`experiments/nevalyashka/ideas/page-flow.html`).

### 1. Intro — the stage (full viewport)

Reference prototype: `experiments/nevalyashka/stage-lab.html`.

- **Scene:** seamless saturated-pink studio cyclorama (wall melts into floor,
  no horizon line), one soft, wide light beam from front-upper-left —
  _between the mascot and the viewer_, so the belly reads as volume. Barely
  visible haze in the air. Soft pink-tinted floor shadow.
- **Mascot:** the approved roly-poly from
  `experiments/nevalyashka/nevalyashka-final.html`, "Classic" shape, glossy
  jelly material (sharp bright highlights, refraction, subsurface glow),
  colour `#d80e66`. **No mouth** on the first screen (see Out-of-scope).
  Centered, the dominant element.
- **Motion:** idle gentle rocking in 3D with a jelly lag on head and antenna.
- **Interaction (pointer):**
  - click / tap → a push; it rocks and settles like a real roly-poly;
  - drag left/right → spins the mascot around its own vertical axis, with
    inertia;
  - drag down / up → tilts it toward / away from the viewer while held;
    on release it springs back and wobbles.
  - The **camera and the light never move** — only the mascot does, so the
    shadow and highlights stay on the same side.
- **Exhibit label** (static, does not follow the mascot), to the right of the
  head, frosted white plate, no leader line:
  ```
  EXHIBIT Nº 04
  Ludvik
  Pure code, WebGL, zero polygons.
  Handle with curiosity.
  ```
  RU keeps only the first line, «Чистый код, WebGL, ноль полигонов.»
  (owner, 2026-10-23).
- **Header:** left the wordmark `Ludvik4` (bright, near-black); right a
  text-only menu (no buttons, no burger on desktop):
  `Work · Services · Guides · About · Contact`. "Articles" is removed.
- **Bottom strip** (monospace, uppercase, small): left a green status dot +
  `Taking projects · Q1 2027`; centre a scroll arrow `↓` (faint, full on
  hover); right `Est. 2024 · Europe`.
- **Text colour discipline — exactly three colours on this screen:** the
  wordmark (bright), one muted colour for everything else (menu, label,
  bottom strip — currently `rgba(42,20,32,.7)`), and pink `#ff4fb6` for
  `Contact` only.
- Scrolling away: the mascot stays on its stage and scrolls out with the
  section ("we say goodbye"). No pinned/scroll-driven mascot.

### 2. The collection — what I build

- Eyebrow: `THE COLLECTION · WHAT I BUILD`
- Heading: `If it lives in a browser, / I can build it.` (second line pink)
- Six "hall" tiles, 3×2, soft pink / lighter pink backgrounds, each: a mono
  index, a name, one short line. **Plain cards, not links.** Their content is
  a placeholder for now: richer content (images, a longer description, maybe
  opened in a modal) will be designed separately. Service pages stay
  reachable from the `Services` menu item:
  - Hall 01 — Websites — for products, studios, events
  - Hall 02 — Landing pages — one offer, one action
  - Hall 03 — Web apps & SaaS — accounts, data, payments, AI
  - Hall 04 — Automations — the boring parts, handled
  - Hall 05 — Widgets & tools — small, sharp, embeddable
  - Hall 06 — Something else? — ask — it's probably possible

### 3. How it works

- Eyebrow `HOW IT WORKS`, heading `Three steps, no fog.` ("no fog." pink)
- Three columns on a thin connecting line, big pink numerals:
  01 Talk — We shape the problem and agree on scope and price.
  02 Build — The first useful version, shown as it grows.
  03 Launch — Live, handed over with the code — then it evolves.

### 4. Selected work — public exhibits

- Eyebrow `SELECTED WORK · PUBLIC EXHIBITS`, heading `Work you can inspect.`
- Gallery: first exhibit large on the left, two stacked on the right. Each
  preview sits in a white "frame" (padding, soft pink shadow) with a museum
  label underneath (`EXHIBIT Nº 0X`, name, kind + one-line description).
  Ludvik4 the mascot is always `Nº 04` on both markets; work exhibits are
  numbered around it — 01, 02, 03, 05… (owner, 2026-10-23).
  Today: smallFriendFiles, Gridfin, qa-pilot. More will be added — the layout
  must take 4–6 exhibits gracefully.

### 5. About

Two columns: a portrait plate (`CURATOR`) and `About` → `One person, end to
end.` + one short paragraph + `More about me →` to the About page.

### 6. Closing CTA + footer

Dark plum band: `YOUR EXHIBIT NEXT?` / `Have something in mind?` / pink
`Discuss a project` button. Footer: `Ludvik4 · Est. 2024` and
`Guides · About · Contact`.

`Contact` (menu, footer) and `Discuss a project` lead to a **new `/contact`
page**: the lead form (moved off the home), the email address and social
links (e.g. LinkedIn). Its visual design is done separately; for the first
slice it uses the site's existing form and styles. The owner's photo belongs
on About, not on Contact.

### Removed from the home

Project Scope block (each project gets its own scope separately), FAQ,
articles section, the RU pricing block, and the lead form (moved to
`/contact`).

## Markets

Both storefronts get the new home: EN (`ludvik4.dev`) and RU (`ludvik4.ru`),
as the two existing separate builds (`SITE_MARKET`, see
`docs/specs/dual-market-sites.plan.md`). **No multilingual site and no
language switcher** — each market is its own version. The EN copy above is
approved; the RU copy is a Russian adaptation of the same structure and
metaphor, drafted for the owner's approval before it ships.

RU follows the same structure, translated:

- Menu: `Работы · Услуги · Обо мне · Контакты` (no Guides, no Blog in the
  menu). This needs an RU **About** page (a Russian version of the EN About)
  and an RU **Contact** page; RU "Работы" lead to the existing `/cases`.
- Selected work on RU shows **four** exhibits: smallFriendFiles, FortNoise,
  Gridfin, qa-pilot. EN shows three: smallFriendFiles, Gridfin, qa-pilot.
- The RU build carries no lead backend today
  (`docs/specs/dual-market-sites.plan.md`), so the RU Contact page shows email
  and social links without a form unless the owner decides otherwise.
- **No prices anywhere**, RU included: the RU home's pricing block is removed.
  Whether to show prices is an open question parked for later (see
  Out-of-scope).

## Goals

- First screen makes the visitor stop, play with the mascot, and scroll on.
- Whole page reads as one exhibition story with very little text.
- Keeps the current site's palette and type (white, `#ff4fb6`, `#ffd7eb`,
  Geist / Geist Mono) — the mascot and the pink stage are the only "loud"
  things.

## Non-goals

- A scroll-driven "journey" through 3D space (Apricode-style). Discussed and
  set aside; the mascot does not travel with the scroll.
- Redesigning About, Guides, service or work detail pages (only links to
  them change).

## Anti-goals (failure even if it "works")

- The page feels childish, noisy or "neformal" — too many colours, too many
  effects, decorative clutter around the mascot.
- Literal copy on the intro ("knock knock", "come in") — rejected as too
  on-the-nose; metaphor over words.
- Light washing the stage out to white, or a matte, flat-looking mascot.

## Constraints

- The live scene is GPU raymarching (one fragment shader). It must not starve
  scrolling or the CPU: cap render resolution (prototype renders at 0.7× and
  is smooth on Apple silicon), pause when off-screen or the tab is hidden,
  and keep a static fallback (a pre-rendered still of the stage + mascot) for
  no-WebGL, CPU-emulated WebGL (see ADR 0012's SwiftShader finding) and
  `prefers-reduced-motion`.
- Copy stays real HTML (SEO, screen readers); the label, menu and strip are
  DOM over the canvas.
- Everything checked in is English (`docs/rules/docs.md`).

## Calls made by the agent (owner to check)

- **H1 / SEO.** The intro has no visible headline, so the stage carries a
  visually hidden `<h1>` with the category phrase the current hero uses
  (founder-led web product studio: websites, web apps, automation). Title and
  meta description stay. `FAQPage` JSON-LD goes away with the FAQ section.
- **ADR 0012 is replaced by a new ADR.** The header is visible on the intro
  (no fade-in), the first-scroll glide is removed, the silk/smoosh intro and
  its scroll hand-off are removed. The live scene runs where ADR 0012's live
  intro ran (fine pointer, ≥ 768 px landscape, GPU WebGL, motion allowed);
  everywhere else — including phones and touch tablets until the mobile
  intro is designed — shows the static still of the stage. This avoids the
  drag-to-tilt vs. scroll conflict on touch for now.

## Left to the builder

Component/slice structure, how the shader is packaged (inline vs a `.glsl`
module like the current intro), render-scale heuristics, exact type scale
and spacing within the site's existing tokens, the static-fallback pipeline,
and keyboard access to the mascot (at minimum: it must not trap focus).

## Out-of-scope (later, owner wants these)

- **Mobile intro.** Keep the mascot on phones, smaller, playable by touch.
  To be designed separately; until then the builder may ship a static
  fallback on phones.
- **Mood switch.** An emoji button cycling calm → surprised (belly opening,
  round eyes) → smile (closed-loop "sausage" lips with a deep non-through
  slit) — built and approved in `nevalyashka-final.html`. Where/how it
  appears on the site is undecided.
- The "hello" lettering kept in `ideas/IDEAS.md` for some future spot.
- **Hall cards' real content** (images, detail, maybe a modal) — designed
  separately.
- **Contact page visual design** — designed separately.
- **Prices.** Shown nowhere for now. The owner is being told prices should be
  shown, possibly on RU at least — parked as an open decision.

## Mobile first screen (approved by the owner in chat, 2026-10-23)

Same goal as the desktop: a visitor on a phone smiles, is surprised, wants to
touch the exhibit and wants a site like it. The phone is not a reduced
version. Reference mockup (variant A): `public/_mockups/mobile-first-screen.html`.

- **Live scene on phones.** The raymarched mascot runs on phones and tablets
  with GPU WebGL, not only with a mouse on a wide screen. Reduced motion,
  no WebGL and CPU-emulated WebGL keep the rocking still; the quality ladder
  still steps a slow phone down to it.
- **Framing (narrow screens, < 640 px):** the mascot is 1.38× its default
  size and its centre sits at 53% across, 43% down — both arms in frame on a
  375 px phone. The still layers get the identical framing, so the crossfade
  from still to live shows one mascot.
- **The one gesture is a tap = a hit.** Touch has no drag-to-tilt or spin; any
  swipe scrolls the page. The hit lands on release and its strength follows
  the press: ≤ 80 ms gives 40% of the kick, ≥ 350 ms the full kick, linear in
  between. A finger that travels > 12 px (or that the browser takes for a
  scroll) is not a hit. Side: a hit left of the mascot tips it right.
- **Calmer rocking on touch devices** (`pointer: coarse`): free spring
  w 2.6, zeta 0.25 (~1.2 s swings, three or four visible). Desktop keeps
  w 3.4, zeta 0.08 — owner: do not change it.
- **Label** below the mascot (as now on narrow screens), one description line
  in RU. **Strip:** one line — status and the scroll arrow; `Est. 2024 ·
Europe` is hidden on narrow screens. Header: wordmark and the burger, as now.
- **Out of scope here:** the sections below the first screen (another
  session works on them), and the rocking still's push, which keeps its
  current animation.

Test scenarios:

1. Unit (gate): a phone (coarse pointer, portrait) with GPU WebGL runs the
   live stage; reduced motion, no WebGL or a software renderer do not.
2. Unit (physics): the phone spring makes ≤ 4 visible swings, the first over
   1.1 s; the desktop spring is unchanged. `tapKick(ms)` gives 40% at ≤ 80 ms,
   100% at ≥ 350 ms, linear in between.
3. Component (canvas): a quick touch tap swings less than a 400 ms press; a
   touch that moves > 12 px or is cancelled does not hit; touch never tilts or
   spins; a narrow stage sends the phone framing to the shader, a wide one the
   default.
4. Unit (shader): declares `uZoom` and `uCenter`.
5. E2E (phone project): the strip is one line and hides `С 2024 · Европа`;
   the still keeps scaling by the width.

## Handoff — where the work stopped (2026-10-23)

Branch `feat/immersive-home`, pushed; Vercel previews build on every push
(`vercel ls` → newest Preview). Not merged into `main`, production untouched.
The old home and intro code stay in the repo, unrendered, by owner decision.

Done since the plan (`immersive-home.plan.md`), all on the branch:

- Stills match the live framing (wide 3.2:1 / tall 1:2.4), split into two
  layers (stage + mascot) by `scripts/render-stage-still.ts`.
- Silhouette antialiasing in the shader; render scale 0.85, cap 2048. The
  full tier never renders below 1 px per CSS px (`minDensity`), so a 1x
  monitor gets 1:1 instead of an upscaled staircase (owner, 2026-10-23).
- A horizontal swipe on a Magic Mouse or trackpad (wheel `deltaX`) spins the
  mascot like a drag; vertical wheel still scrolls the page.
- Moving the window to a screen with another pixel ratio re-sizes the canvas
  (a `resolution` media query), so Retina → 1x monitor stays crisp.
- The silhouette ramp is centred on the true outline (rays march a body inset
  by 0.75 px), softening the steps on 1x screens.
- Supersampling on 1x screens: after the full tier proves fast, the stage
  tries rendering at 2x (up to 4096 px wide) and keeps it only if the median
  frame time stays within 10% (+1 ms) of the full-tier one; otherwise it
  returns to full and never retries. `?quality=super` pins it.
- The label moves below the mascot only on narrow screens (< 640 px), not in
  any window taller than wide; near-square windows raise it to clear the head.
- Quality ladder by measured frame time (`exhibit-quality.ts`): full →
  0.6 scale → 0.45 + lite shader → rocking CSS still. `?quality=super|full|
medium|lite|still` pins a tier. The rocking still (with a tap-to-push button) is
  also what phones, touch and no-GPU machines get; reduced motion keeps it
  still.
- Menu: Work → `/#work`, Services → `/#collection` (smooth scroll via
  AnchorLink); the `/services` and `/uslugi` index pages were removed; the
  current item is marked (ink + thin underline). RU menu: Работы · Услуги ·
  Обо мне · Контакты.
- Dark footer site-wide, no repeated menu links, pinned to the bottom on
  short pages. Rubber-band overscroll: a fixed layer behind pages with the
  site footer shows the page's top colour above (the stage's #ffe0fa on the
  home, white elsewhere) and the footer plum below; the home's theme-color is
  #ffe0fa.
- All section headings on one line; closing band has ~1.5× vertical padding.
- Work previews open the live site in a new window from a white corner
  arrow; the exhibit name links to the description page.
- Strip status: "Taking projects · Q4 2026" / «Беру проекты · IV кв. 2026».
- `/contact` shows the email ludvik4good.me@gmail.com and Telegram on both
  markets (no LinkedIn for now, owner 2026-10-23).
- Hall cards (owner chose variant B, 2026-10-23; prototype
  `experiments/nevalyashka/ideas/halls.html`; `hall-card.tsx`,
  `hall-exhibits.tsx`): each hall has a flat SVG jelly exhibit top-right at a
  fixed size (owner: do not shrink it on hover). On hover the card squashes
  and springs back, a gloss follows the cursor, the exhibit rocks away from
  the entry side (gears turn, the toggle flips) and up to three "what's
  inside" chips slide in under the subtitle. Halls do not open and show no
  pointer; only hall 06's chip is a link to `/contact`. Touch: chips shown,
  exhibits rock idly; reduced motion: still. Hall names shortened so text
  clears the exhibit: "Web apps" / «Веб-приложения», «Виджеты». RU chip copy
  is a draft awaiting owner approval with the rest of `ru.home`.

Waiting on the owner:

1. Check the preview on a real iPhone (overscroll) and an older laptop
   (quality ladder).
2. Approve the RU copy: `content.ts` → `ru.home`, and `about-ru.tsx`.
3. Later, designed separately: contact page design,
   mobile intro, the mood switch, prices, the "Worldwide" wording.
4. Then: merge into `main`, mark ADR 0012 superseded, set this spec to
   `shipped`, deploy both markets. Before the merge, delete the throwaway
   `public/_mockups/` (mobile first-screen variants, 2026-10-23).
5. Mobile home, being designed (2026-10-23): variant A of the mockups is the one
   being refined; on phones the only gesture is a tap = a hit (no long-press drag).
   The tap should rock calmer than the desktop click — ~1.2 s per swing,
   three or four visible swings (free spring w ≈ 2.6, zeta ≈ 0.25). Desktop
   keeps its current spring (w 3.4, zeta 0.08) — owner, do not change it.
   The hit lands on release and its strength follows the press: a flick
   (≤ 80 ms) gives 40% of the kick (~16° swing), a press of ~350 ms the full
   kick (the 0.5 rad cap, ~29°); a finger that travels > 12 px is a scroll,
   not a hit. Reference: the mockup's script.

Deferred review minors (final review 2026-10-23): stale spin velocity when a
drag pauses before release; WebGL contexts not released on unmount; no unit test for
`webglcontextlost`; the label can touch the mascot on 768–810 px landscape
windows.

## Status

`in progress` — branch `feat/immersive-home` (approved 2026-10-22)
