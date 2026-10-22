# Immersive Home ("the exhibition") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home of both storefronts with the "exhibition" home: a live WebGL roly-poly on a pink studio stage, then the collection, three steps, framed work, about and a closing CTA — and move the lead form to a new `/contact` page.

**Architecture:** Everything stays in the `src/features/site` slice. The stage is a client component (`exhibit-canvas.tsx`) that runs one fragment shader (ported from `experiments/nevalyashka/stage-lab.html`) over a pre-rendered still; pure logic (physics, gating) lives in testable `.ts` modules. One `Home` server component renders both markets from `MarketContent`; the old silk/smoosh intro, scroll-reveal header, scroll hand-off, hero, scopes, pricing and FAQ leave the home.

**Tech Stack:** Next.js 16 (App Router, `typedRoutes`), React 19, Tailwind, raw WebGL 1, Vitest + Testing Library, Playwright.

**Spec:** `docs/specs/immersive-home.md` (approved 2026-10-22). Read it first; this plan only adds the decisions the spec leaves open.

## Global Constraints

- Branch `feat/immersive-home` off `main`; no git worktree (owner preference). Conventional Commits. Push the branch over SSH (`git@github.com:grooownow/ludvik4.git`) for a Vercel preview; **do not push to `main` or deploy production** — the owner swaps production after reviewing the preview.
- **Keep the old home's code in the repo** (owner, 2026-10-22): nothing from the old intro/home is deleted; it is simply no longer rendered by `/`.
- Internal navigation only via `<Link>` (hook-enforced). No network calls in middleware.
- Every checked-in string, comment and doc is English, **except** RU market copy in `content.ts` and RU views.
- Text colours on the stage: wordmark `#1a1a1a`; everything else `rgba(42,20,32,.7)` (add token `--stage-muted`); `Contact` `#ff4fb6` (`--primary`).
- Mascot colour `#d80e66` → uniform `[0.847, 0.055, 0.4]`. Light direction `(-0.7, 0.85, 1.25)`. Camera fixed: yaw `-0.25`, pitch `0.16`, distance `10`, focal `1.75`.
- Exhibit label copy (EN), verbatim: `EXHIBIT Nº 04` / `Ludvik` / `Pure code, WebGL, zero polygons.` / `Handle with curiosity.`
- Live scene gate (unchanged from ADR 0012): fine pointer AND motion allowed AND `(min-width: 768px) and (orientation: landscape)` AND WebGL AND not a software renderer. Otherwise the static still.
- Render scale `0.7 × devicePixelRatio (max 2)`, render width capped at `1600` px; loop paused when the stage is off-screen or `document.hidden`.
- No prices anywhere. No FAQ on the home. No language switcher.
- RU copy ships to production only after the owner approves it. While the owner is away the draft goes to the preview branch and is listed for approval in the handoff.

## Decisions taken by this plan (not in the spec)

- **Mascot's exhibit number = number of work exhibits + 1.** EN shows 3 works → `Nº 04` (matches the approved copy). RU shows 4 → `№ 05`, so it never collides with qa-pilot `№ 04`.
- **"Services" menu item → a new minimal services index** (`/services` EN, `/uslugi` RU) that renders the existing `ServiceGrid` with the existing `content.services.items` (they already carry links). The halls stay plain cards, and service pages stay reachable, as the spec requires.
- **Header:** `SiteHeader` becomes a text-only nav site-wide (pink `Contact` link replaces the CTA button). On the home it renders `variant="stage"`: transparent, absolutely positioned over the stage, scrolls away with it. Other pages keep it sticky. Phones keep the existing `<details>` burger.
- **Gallery layout:** two columns; when the count is odd the first exhibit spans two rows (EN: big left + two stacked, as approved); when even, an equal 2×N grid (RU: 2×2).
- **Contact page links:** Telegram (`TELEGRAM_URL`) only for now; `CONTACT_LINKS` is an array so email/LinkedIn are a one-line add once the owner provides them. EN shows the lead form; RU does not (no lead backend in the RU build).
- **CTA analytics placements:** `"hero"` is renamed `"closing"`; `"nav"`/`"nav_mobile"` keep their names; add `"contact_page"` is not needed (the form tracks itself).
- **H1:** visually hidden (`sr-only`) inside the stage section, text = the current `hero.title` of each market.

## Review Focus

1. Window resize / DPR change while live → canvas and label must re-fit with no stretch (Task 3, test `resizes the drawing buffer on resize`).
2. Tab hidden or stage scrolled off-screen → no frames rendered (Task 3, test `pauses while hidden or off-screen`).
3. Clicking header links / label over the canvas → links work; a drag that starts on the canvas never selects page text (Task 6, test `menu links stay clickable over the stage`; Task 3 sets `user-select:none` on the stage).
4. WebGL context lost or shader compile failure → falls back to the still, no thrown error, `onLiveChange(false)` (Task 3, test `falls back when the program fails to link`).
5. Short or ultra-wide viewports (1280×600, 2560×1080) → label never overlaps the head; stage min-height `560px` (Task 6, e2e `label clears the mascot on short and wide screens`).

---

### Task 1: Live-scene gate module

**Files:**

- Create: `src/features/site/exhibit-gate.ts`
- Test: `src/features/site/exhibit-gate.test.ts`

**Interfaces:**

- Produces: `shouldRunLiveStage(env: { finePointer: boolean; reducedMotion: boolean; wideLandscape: boolean; webgl: boolean; softwareRenderer: boolean }): boolean`, `isSoftwareRenderer(renderer: string): boolean`, `MAX_RENDER_WIDTH = 1600`, `RENDER_SCALE = 0.7`, `renderSize(cssW: number, cssH: number, dpr: number): { width: number; height: number }`.

- [ ] **Step 1: Write failing tests** — copy the cases of `shouldRunLiveIntro`/`isSoftwareRenderer` from `intro-scene-shaders.test.ts` (rename to `shouldRunLiveStage`), plus:
  - `renderSize(1440, 900, 2)` → `{ width: 1600, height: 1000 }` (0.7×2×1440 = 2016 capped to 1600, height scaled by the same factor);
  - `renderSize(1000, 800, 1)` → `{ width: 700, height: 560 }`;
  - `renderSize(1000, 800, 3)` uses dpr 2 → `{ width: 1400, height: 1120 }`.
- [ ] **Step 2:** `pnpm vitest run src/features/site/exhibit-gate.test.ts` → FAIL (module missing).
- [ ] **Step 3:** Implement (move the two functions verbatim; `renderSize` rounds).
- [ ] **Step 4:** Re-run → PASS.
- [ ] **Step 5:** `git commit -m "feat(site): add live-stage gate for the exhibit scene"`

### Task 2: Mascot physics

**Files:**

- Create: `src/features/site/exhibit-physics.ts`
- Test: `src/features/site/exhibit-physics.test.ts`

**Interfaces:**

- Produces:

  ```ts
  export type MascotInput = { holdTilt: number | null; spinDelta: number; spinVelocity: number | null; push: { a: number; b: number } | null };
  export type MascotPose = { tiltA: number; tiltB: number; lagX: number; lagZ: number; spin: number };
  export type MascotState; // opaque, created by createMascotState()
  export function createMascotState(): MascotState;
  export function stepMascot(state: MascotState, input: MascotInput, dt: number, time: number, yaw: number): MascotPose;
  ```

  Port the model from `stage-lab.html` `frame()` exactly: free spring ω=3.4, ζ=0.08; hold spring ω=9, ζ=0.9 toward `(-tilt·sin(yaw), tilt·cos(yaw))`; idle rock `0.16·sin(2.3t)·(0.75+0.25cos(0.41t))` and `0.1·sin(1.63t+1.3)` faded by `hold` (rate 6/s); tilt clamp ±0.5; lag spring ω=11, ζ=0.22 toward `(0.05·da, -0.05·db)`, clamp ±0.14; spin inertia decay `exp(-3dt)`; `dt` clamped to 1/30. `holdTilt` is clamped to ±0.45 by the caller (Task 3).

- [ ] **Step 1: Failing tests:**
  - `settles after a push`: push `{a:3.5,b:0}`, step 600×(1/60) with idle rock disabled via `time` frozen at 0 and `hold` forced… — simpler: assert `|tiltA - idle(t)| < 0.02` after 10 s.
  - `holds the tilt while dragging`: `holdTilt: 0.3`, 120 steps → `tiltB ≈ 0.3·cos(-0.25)` within 0.03.
  - `springs back and overshoots on release`: after the hold above, `holdTilt:null`; within 1.5 s `tiltB` changes sign at least once.
  - `clamps tilt to ±0.5` under a huge push.
  - `spin keeps inertia then stops`: `spinVelocity: 6` once, then nulls → spin grows, and after 4 s the per-step change is < 0.001.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** `git commit -m "feat(site): add roly-poly physics for the exhibit stage"`

### Task 3: Shader + client canvas

**Files:**

- Create: `src/features/site/exhibit-shader.ts` (exports `EXHIBIT_VERTEX`, `EXHIBIT_FRAGMENT` — the fragment shader of `experiments/nevalyashka/stage-lab.html` verbatim, uniforms `uRes uColor uTilt uLag uCam uSpin`)
- Create: `src/features/site/exhibit-canvas.tsx` (`"use client"`)
- Test: `src/features/site/exhibit-canvas.test.tsx`, `src/features/site/exhibit-shader.test.ts`

**Interfaces:**

- Consumes: Task 1 gate + `renderSize`; Task 2 `createMascotState`/`stepMascot`.
- Produces: `ExhibitCanvas({ stageRef, onLiveChange }: { stageRef: RefObject<HTMLElement | null>; onLiveChange: (live: boolean) => void })` — renders a full-size `<canvas aria-hidden>`; pointer handlers attached to the canvas: tap (< 4 px move) → push away from the tap side; horizontal drag → `spinDelta = dx·0.01`; vertical drag → `holdTilt += dy·0.004` clamped ±0.45; release → `spinVelocity` from the last move.

- [ ] **Step 1: Failing tests:**
  - shader test: `EXHIBIT_FRAGMENT` declares exactly the six uniforms above and contains no `uSmile`/`uSurprise` (no mouth on the first screen).
  - canvas tests (jsdom has no WebGL): `stays static without WebGL` → `onLiveChange` never called with `true`; `falls back when the program fails to link` (stub `getContext` returning a fake GL whose `getProgramParameter` is false) → `onLiveChange(false)`, no throw; `pauses while hidden or off-screen` (fake GL + mocked `IntersectionObserver`/`document.hidden`, count `drawArrays` calls across mocked rAF ticks); `resizes the drawing buffer on resize` (dispatch `resize`, expect `canvas.width` to equal `renderSize(...)`).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. Gate probing mirrors `intro-scene.tsx` lines 191–222. Listen for `webglcontextlost` → stop and `onLiveChange(false)`.
- [ ] **Step 4:** Run → PASS. Then `pnpm dev`, open `/` at 1440×900 in a browser with a GPU and compare against `stage-lab.html` side by side: glossy highlights, soft shadow back-right, spin/tilt/push feel identical.
- [ ] **Step 5:** `git commit -m "feat(site): add live exhibit canvas with the jelly mascot"`

### Task 4: Static still of the stage

**Files:**

- Create: `scripts/render-stage-still.ts`
- Create: `public/stage/stage-1440.webp`, `stage-2880.webp`, `stage-tall-780.webp`, `stage-tall-1560.webp`
- Create: `src/features/site/exhibit-art.ts` (`STAGE_SOURCES`, `STAGE_ART = { desktop: {width:1440,height:900}, tall: {width:780,height:1560} }`, `TALL_MEDIA = "(orientation: portrait)"`)

- [ ] **Step 1:** Script: launch `@playwright/test` chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader`, load a page rendering `EXHIBIT_FRAGMENT` with the mascot at rest (tilt 0, lag 0, spin 0), size the canvas to each target, wait 1 s, `canvas.toDataURL('image/webp', 0.9)`, write to `public/stage/`. Run with `pnpm tsx scripts/render-stage-still.ts`.
- [ ] **Step 2:** Verify: four files exist, each < 250 KB, and opening `stage-1440.webp` shows the mascot centred with the shadow back-right and no mouth.
- [ ] **Step 3:** `git commit -m "feat(site): add pre-rendered stage stills"`

### Task 5: Content model for the new home

**Files:**

- Modify: `src/features/site/content.ts` (types + both markets)
- Modify: `src/features/site/content.test.ts`

**Interfaces:**

- Produces on `MarketContent` (and removes `intro`, `scopes`, `pricing`, `faq`, `aiBlock`, `about`; keeps `hero` reduced to `{ title: string }` → rename to `h1: string`; replaces `howItWorks`):
  ```ts
  home: {
    exhibit: { eyebrow: string; name: string; lines: [string, string] };   // eyebrow without number; number is computed
    strip: { status: string; established: string };
    collection: { eyebrow: string; title: [string, string]; halls: { index: string; name: string; line: string }[] };
    steps: { eyebrow: string; title: [string, string]; items: Step[] };
    work: { eyebrow: string; title: [string, string]; exhibitEyebrow: string };
    about: { eyebrow: string; title: [string, string]; body: string; plate: string; linkLabel: string };
    closing: { eyebrow: string; title: string; cta: string };
    footerTagline: string;
  };
  ```
  `title: [plain, pinkAccent]`. `nav.cta` stays (used as the `Contact` label). Exported `exhibitNumber(workCount: number, lang: "ru"|"en"): string` → `"Nº 04"` / `"№ 05"`.
- EN copy: verbatim from the spec. `h1` = current EN `hero.title`. `nav.links` = Work `/work`, Services `/services`, Guides `/guides`, About `/about`; `nav.cta` = `"Contact"`. Footer links = Guides, About, Contact `/contact`, Privacy, Telegram.
- RU copy (draft for owner approval):

  | Key        | RU                                                                                                                                                                                                                                                                                                                                       |
  | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | exhibit    | `ЭКСПОНАТ` / `Ludvik` / `Чистый код, WebGL, ноль полигонов.` / `Обращаться с любопытством.`                                                                                                                                                                                                                                              |
  | strip      | `Беру проекты · I кв. 2027` / `С 2024 · Европа`                                                                                                                                                                                                                                                                                          |
  | collection | `КОЛЛЕКЦИЯ · ЧТО Я ДЕЛАЮ` / `Если это живёт в браузере,` + `я это сделаю.`                                                                                                                                                                                                                                                               |
  | halls      | Зал 01 Сайты — для продуктов, студий, событий · Зал 02 Лендинги — одно предложение, одно действие · Зал 03 Веб-приложения и SaaS — аккаунты, данные, оплаты, AI · Зал 04 Автоматизации — рутина на автомате · Зал 05 Виджеты и инструменты — маленькие, точные, встраиваемые · Зал 06 Что-то ещё? — спросите, скорее всего, это возможно |
  | steps      | `КАК ЭТО РАБОТАЕТ` / `Три шага,` + `без тумана.` · 01 Обсуждаем — Формулируем задачу, договариваемся об объёме и цене. · 02 Делаем — Первая полезная версия, которую видно по ходу работы. · 03 Запускаем — Запуск и передача кода — дальше развиваем.                                                                                   |
  | work       | `ИЗБРАННЫЕ РАБОТЫ · ОТКРЫТЫЕ ЭКСПОНАТЫ` / `Работы, которые` + `можно потрогать.`                                                                                                                                                                                                                                                         |
  | about      | `ОБО МНЕ` / `Один человек,` + `от начала до конца.` / `Независимая студия в Европе. Веду проект от смутной идеи до работающего запуска — и всё это время остаюсь вашим единственным контактом.` / plate `КУРАТОР` / `Подробнее обо мне →`                                                                                                |
  | closing    | `ВАШ ЭКСПОНАТ — СЛЕДУЮЩИЙ?` / `Есть идея?` / `Обсудить проект`                                                                                                                                                                                                                                                                           |
  | footer     | `Ludvik4 · с 2024`                                                                                                                                                                                                                                                                                                                       |
  | nav        | Работы `/cases`, Услуги `/uslugi`, Обо мне `/about`; `nav.cta` = `Контакты`                                                                                                                                                                                                                                                              |
  | h1         | current RU `hero.title`                                                                                                                                                                                                                                                                                                                  |

- [ ] **Step 1: Failing tests** in `content.test.ts`: both markets expose `home` with 6 halls and 3 steps; EN `home.exhibit.lines` equals the spec's two lines exactly; no market has `pricing`/`faq`/`scopes`; `exhibitNumber(3,"en") === "Nº 04"`, `exhibitNumber(4,"ru") === "№ 05"`; every `nav.links[].href` is one of the routes that exist for that market.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement. Fix every compile error `tsc` reports in `seo.ts` (drop the `FAQPage` node and its `@id #faq`; title/description unchanged).
- [ ] **Step 4:** `pnpm vitest run src/features/site/content.test.ts` → PASS; `pnpm typecheck` passes except for the home files replaced in Task 7 (note the list).
- [ ] **Step 5:** Commit `feat(site): content model for the exhibition home`.
- [ ] **Step 6: Owner gate.** Show the RU table above to the owner in chat, in full; apply their edits before Task 7 ships RU.

### Task 6: Stage section and text-only header

**Files:**

- Modify: `src/features/site/site-chrome.tsx` (`SiteHeader` text-only, `variant?: "default" | "stage"`, Contact → `/contact`)
- Modify: `src/features/site/cta-link.tsx` (`CtaPlacement` `"hero"` → `"closing"`); update `docs/specs/analytics-events.md` placement list
- Create: `src/features/site/exhibit-stage.tsx` (client wrapper: still `<picture>` + `ExhibitCanvas` fading in on live, label, bottom strip, `sr-only` `<h1>`, header slot)
- Modify: `src/app/globals.css` (`--stage-muted`)
- Test: `src/features/site/exhibit-stage.test.tsx`, update `site-chrome` usages' tests

**Interfaces:**

- Consumes: Task 3 `ExhibitCanvas`, Task 4 `STAGE_SOURCES`, Task 5 `home.exhibit`, `home.strip`, `h1`, `exhibitNumber`.
- Produces: `ExhibitStage({ content, workCount }: { content: MarketContent; workCount: number })`.

Layout (from the approved prototype): section `h-svh min-h-[560px] select-none`, header `absolute top-[3.4vh] inset-x-[3.2vw]`, label placed right of the head: `left: calc(50% + 14vmin); top: 30%` with `max-width` so it never leaves the viewport; strip `absolute bottom-[3.4vh]`, mono 11px uppercase, `↓` button-less link to `#collection` with `opacity .22 → .9` on hover.

- [ ] **Step 1: Failing tests:** stage renders the hidden `h1` with the market's `h1`; label shows `EXHIBIT Nº 04`, `Ludvik` and both lines for EN with `workCount=3`; strip shows status and established; `menu links stay clickable over the stage` (header nav is rendered after the canvas in DOM order and has `relative z-10`); header has no `<button>` CTA and `Contact` links to `/contact`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat(site): exhibit stage section and text-only header`.

### Task 7: The home page (both markets)

**Files:**

- Create: `src/features/site/home.tsx` (`Home`), `home-collection.tsx`, `home-steps.tsx`, `home-gallery.tsx`, `home-about.tsx`, `home-closing.tsx`
- Create: `src/features/site/home-exhibits.ts` — `homeExhibits(market): HomeExhibit[]` with `HomeExhibit = { slug; name; kind; line; image; imageAlt; href; newTab?: boolean }`; EN maps `internationalWork` (order smallFriendFiles, Gridfin, qa-pilot); RU maps `caseStudies` (order smallFriendFiles, FortNoise, Gridfin, qa-pilot, href `/cases/<slug>`)
- Modify: `src/features/site/market-home.tsx` (render `Home` for both; no dynamic import of the lead form any more)
- Keep (unused by `/`): `home-en.tsx`, `home-ru.tsx` and their tests
- Test: `src/features/site/home.test.tsx`, `home-exhibits.test.ts`

**Interfaces:**

- Consumes: Tasks 5–6.
- Produces: `Home({ content, baseUrl }: { content: MarketContent; baseUrl: string })`. Sections in order with ids: stage, `#collection`, `#how-it-works`, `#work`, `#about`, closing band; JSON-LD from `buildHomeJsonLd`.

Visuals follow `experiments/nevalyashka/ideas/page-flow.html` using site tokens: halls `bg-accent` / `bg-pink-soft` (01 and 06 the stronger pink), `rounded-2xl`, 3 cols ≥ lg / 2 ≥ sm / 1; step numerals `text-primary text-6xl font-semibold` on a 1px `border-pink-soft` line; gallery frames `bg-card p-4 rounded-md shadow-[0_14px_30px_rgba(214,40,130,.10)] ring-1 ring-pink-soft` with the museum label under each (`EXHIBIT Nº 0X` mono muted, name semibold, kind · line); closing band `bg-intro text-intro-foreground`, CTA `Button` → `/contact` with placement `"closing"`.

- [ ] **Step 1: Failing tests:** EN: headings `If it lives in a browser, I can build it.`, `Three steps, no fog.`, `Work you can inspect.`, `One person, end to end.`, `Have something in mind?`; six hall names, none inside a link; three exhibits with `EXHIBIT Nº 01..03`; no `Send request` button, no FAQ, no `What's included`. RU: four exhibits `№ 01..04`, stage label `№ 05`, no price text (`/₽/` absent). Gallery: odd count → first exhibit has `row-span-2`; even → none. `home-exhibits` hrefs: EN smallFriendFiles → `/work/smallfriendfiles`, Gridfin → `/gridfin/en` with `newTab`; RU all `/cases/<slug>`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement; leave the old homes in place.
- [ ] **Step 4:** `pnpm test` → PASS for the slice.
- [ ] **Step 5:** Commit `feat(site): exhibition home for both markets`.

### Task 8: `/contact` page

**Files:**

- Create: `src/app/contact/page.tsx`, `src/features/site/contact-page.tsx` (`ContactPageView`), `contact-links.ts` (`CONTACT_LINKS: { label: string; href: string; external: true }[]` = Telegram)
- Modify: `src/features/site/seo.ts` (sitemap entry `/contact` for both markets), `src/app/llms.txt` source if it lists pages (`grep -rn "llms" src/app`)
- Modify: `tests/e2e/anchor-scroll.spec.ts` (the `#contact` anchor cases move: CTA now navigates to `/contact`; keep the wordmark-clears-hash case)
- Test: `src/features/site/contact-page.test.tsx`

**Interfaces:**

- Produces: `ContactPageView({ content, turnstileSiteKey })`. The page uses the same market-branch dynamic import as the old `market-home.tsx` so **the RU build never bundles `LeadForm`** — keep that comment and pattern.

- [ ] **Step 1: Failing tests:** EN renders `LeadForm` (`Send request`), the privacy-notice link to `/privacy`, and a Telegram link; RU renders the Telegram link and **no** form element; metadata canonical `/contact`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement (reuse `content.contact` copy; page chrome = default `SiteHeader` + `SiteFooter`). **Step 4:** Run → PASS; `pnpm build:ru-static` and confirm `grep -r "Send request" out/` finds nothing.
- [ ] **Step 5:** Commit `feat(site): contact page with the lead form`.

### Task 9: Services index and RU About

**Files:**

- Create: `src/app/services/page.tsx` (EN), `src/app/uslugi/page.tsx` (RU) — `ServicesIndexView` in `src/features/site/services-index.tsx` rendering `ServiceGrid` with `content.services.items`; each page `notFound()` on the other market.
- Modify: `src/app/about/page.tsx` — RU renders new `AboutRuView` (`src/features/site/about-ru.tsx`), a Russian version of `InternationalAboutView`'s text with the same structure.
- Modify: `seo.ts` sitemap: `/services` (EN), `/uslugi` and `/about` (RU).
- Test: `services-index.test.tsx`, `about-ru.test.tsx`; update `tests/integration/seo-routes.test.ts`.

- [ ] **Step 1: Failing tests:** both index pages list three service links with the existing hrefs; RU `/about` renders an `h1` in Russian and no English paragraph; sitemap contains the new URLs per market.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4:** PASS.
- [ ] **Step 5: Owner gate.** Show the RU About text to the owner in chat, in full; apply edits.
- [ ] **Step 6:** Commit `feat(site): services index and Russian about page`.

### Task 10: ADR, docs, e2e, gates (old intro code kept)

**Files:**

- Keep: the old intro modules (`intro-*`, `pen-shader.ts`, `scroll-reveal-header.tsx`, `hero-title.tsx`, `service-scopes.tsx`), `public/intro/`, `features/faq` and their tests — unused by `/` but retained by owner decision. Old home tests that render the old homes keep passing because the old components still exist; tests that assert the _page_ (e2e) are updated.
- Create: `docs/decisions/0013-exhibition-home.md` (supersedes 0012: header visible, glide removed, same gate, static still on phones/touch; links the spec)
- Modify: `docs/decisions/0012-live-intro-scene.md` (status line "Superseded by 0013" — on merge), `docs/specs/immersive-home.md` status `in progress`. `docs/roadmap.md` has someone else's uncommitted edits on `main`: do not commit it from this branch; report the Now line to add instead.
- Modify: `tests/e2e/smoke.spec.ts` (RU default build: the stage section is visible; the hidden `h1` exists with the RU title; `Контакты` link → `/contact`; phones show the still), `tests/e2e/seo.spec.ts` (drop the FAQ-answer assertion)
- Create: `tests/e2e/exhibit-stage.spec.ts` — `label clears the mascot on short and wide screens`: at 1280×600 and 2560×1080 the label's bounding box does not intersect the central 30% × 60% box of the stage, and stays inside the viewport.

- [ ] **Step 1:** `pnpm typecheck` and `pnpm test` → green with the old modules still present.
- [ ] **Step 2:** Write the ADR and doc updates.
- [ ] **Step 3:** Update and add e2e; `pnpm test:e2e` → PASS.
- [ ] **Step 4: Gates:** `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build` (EN) and `pnpm build:ru-static` → all green; paste the summary lines.
- [ ] **Step 5:** Visual check at 375 / 768 / 1280 / 1440 for both markets in a real browser; compare the stage with `stage-lab.html`.
- [ ] **Step 6:** Commit `docs: ADR 0013 exhibition home`; push the branch over SSH; report the preview URL.

NO UNRESOLVED DECISIONS
