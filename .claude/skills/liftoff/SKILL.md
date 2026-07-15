---
name: liftoff
preamble-tier: 2
description: One-time onboarding for a fresh Liftkit template — interviews the user about their product idea (or generates candidates), writes the PRD and first feature specs, adapts the skeleton (name, brand, domain schema, seed data, manifest), and hands over a running app. Use when docs/manifest.md still contains liftoff:fill markers (the project has not been onboarded yet), or when the user asks to onboard, set up, or start their Liftkit project.
---

<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly. Regenerate: pnpm skills:gen -->

# Liftoff

Guide the user from raw idea to a running, adapted, gate-green app. This flow
is linear (Step 0 → 5), runs once per project, and every step ends in a git
commit so progress survives a dropped session. Create a todo per step before
starting.

## Ground rules

<!-- Generated from the shared preamble (scripts/lib/codegen.ts). Edit it there, not here. -->

- **Language:** chat with the user in the project's chat language
  (`docs/manifest.md` → _Chat language_; falls back to the language of the
  user's messages while unset). Every artifact that lives in the repo — code,
  docs, commit messages — is English.
- **Evidence, not adjectives.** Never report a command as green without quoting
  the line that proves it. "It should pass" is not a result, and the word
  _should_ in a status line is a red flag about your own honesty.
- **The hard invariants** (`CLAUDE.md`), which a `PreToolUse` hook
  (`scripts/hooks/pretooluse.ts`) enforces at the moment of the write — do not
  design around them, and do not treat a hook denial as a puzzle to route
  around:

  1. No internal `<a href>`/`window.location` navigation — always `<Link>`.
  2. No network/db call in `src/middleware.ts` — the JWT check stays local.
  3. No feature ships without a test proven able to fail.
  4. Every server action/route validates input with `zod` before use.
  5. Every commit follows Conventional Commits (one exception: `/liftoff`
     onboarding commits — see `docs/rules/git.md`).

- **Read the rule that governs the step you are on, at the moment you reach it** —
  not from memory, and not all of them up front:

  - `docs/rules/architecture.md` — new routes, feature slices, data access, import direction, schema changes.
  - `docs/rules/definition-of-done.md` — every change, without exception — this is the standing bar, and the one rules file that is never out of scope.
  - `docs/rules/docs.md` — any change to `docs/`, `CLAUDE.md`/`AGENTS.md`, or a decision worth remembering across sessions. Docs are the interface between agent sessions — stale docs are worse than missing ones.
  - `docs/rules/frontend.md` — any page, component, mutation, or loading state — responsiveness is an invariant here, not a nice-to-have.
  - `docs/rules/git.md` — every commit, branch, and merge in this repo.
  - `docs/rules/security.md` — every server action, route handler, env var, and auth-adjacent change — this is baseline, not opt-in.
  - `docs/rules/sources.md` — any line of code or prose that asserts how a third-party framework, library, or API behaves.
  - `docs/rules/testing.md` — every code change — no feature is done without tests.

- **One question per message.** Never batch interview questions; wait for each
  answer before asking the next.
- **Chat language before Step 0:** the manifest has not recorded one yet —
  follow the language of the user's messages until it does.
- **Commit convention:** `liftoff: step N — <what>` after every step; Step 4
  sub-steps commit as `liftoff: step 4<letter> — <what>` (4a..4e). This
  prefix is the sanctioned onboarding exception to `docs/rules/git.md`'s
  Conventional Commits rule (see the Exception line there) — it is the
  resume marker, do not vary it.
- **Format before every commit:** run `pnpm format` before EVERY liftoff
  commit, not just the final one — lefthook's pre-commit `prettier --check`
  rejects unformatted files.
- **Hard gates:** the fit check (Step 1) and PRD approval (Step 2) block all
  later steps. Never proceed past a gate that hasn't passed.
- **Failure honesty:** each step defines "Done when". If a command is red, fix
  it before proceeding — never skip a gate, never claim green without command
  output. After 2 honest fix attempts on the same failure, stop, report the
  exact error and state to the user, and ask how to proceed.
- **Read rules at the right moment, don't guess:** `docs/rules/*.md` are the
  source of truth for architecture, testing, and frontend conventions. This
  skill names which file to read at which step — read it then, not from
  memory.

## Resume protocol

Before Step 0, run `git log --oneline -30` and look for `liftoff:` commits.

- **Completion check first:** if `docs/manifest.md` has no `liftoff:fill`
  markers left and a `liftoff: step 5` commit exists, onboarding is complete
  — tell the user and point them to `docs/roadmap.md` and `/feature` instead
  of re-running. Only continue below when this does not hold.
- No `liftoff:` commits → start at Step 0.
- Found `liftoff:` commits → parse the **full subject** of the most recent
  one to find the last completed step:
  - `liftoff: step N — ...` with N ≠ 4 → last completed step is N; continue
    at step N+1.
  - `liftoff: step 4<letter> — ...` (4a..4e) → last completed sub-step;
    continue at the next letter (4a → 4b, …, 4d → 4e), or at Step 5 after 4e.
  - Bare `liftoff: step 4 — ...` with no letter (older run) → only that one
    sub-step is done; walk Step 4's done-when checklist and continue at the
    first sub-step whose artifact is missing.
- Before continuing, verify the "Done when" of the LAST recorded step or
  sub-step still holds (file exists / grep clean / gates green). If it fails,
  redo that step before moving on. Also check `git status` for uncommitted
  partial work from the next step (finish it if found).

## Step 0 — Environment

1. **Chat language (ask first, before anything else).** Check
   `docs/manifest.md` → `## Chat language`: if the field is already filled
   (no `liftoff:fill` marker), use that language and skip this question.
   Otherwise ask, in one message, **in English only** (options keep their
   native script):

   > Which language should I chat with you in?
   >
   > 1. English 2. Русский 3. Español 4. Deutsch 5. Français 6. 中文 <!-- allow-nonascii -->
   >    … or name any other language.

   Write the chosen language's name (e.g. `Russian`, `English`) into the
   `## Chat language` field, removing the `<!-- liftoff:fill -->` marker on
   that line. From here on, chat in the chosen language.

2. If `.env` or `node_modules/` is missing, run `./scripts/bootstrap` (it
   installs deps, creates `.env` from `.env.example`, migrates and seeds the
   local PGlite database).
3. Verify gates once: `pnpm lint && pnpm test`. A fresh template must be green
   here; a failure is an environment problem (Node >= 22? clean install?) —
   fix it before anything else. (`pnpm test:e2e` is exercised later by the
   `verify` flow; don't block onboarding on browser installs.)

**Done when:** both commands exit 0 and the `## Chat language` field is filled.
Step 0 now always changes a tracked file (the manifest), so it always commits:
`liftoff: step 0 — environment verified`.

## Step 1 — Idea

Read `references/interview.md` (relative to this skill's directory) for the
question bank, the no-idea generation procedure, and fit-check wording.

1. Ask whether the user already has a product idea (this is the first single
   question).
2. **Has an idea:** interview one question at a time — user, pain, alternative,
   wedge — per the question bank.
3. **No idea:** ask about their interests/skills/audience access, then generate
   3 candidates using `docs/templates/idea.md`, score each with its rubric,
   present the comparison, and let the user pick (or re-roll once).
4. **Fit check (hard gate):** before writing anything, test the idea against
   Liftkit's shape. Ideas needing a native mobile app, an ML training
   pipeline, heavy realtime (multiplayer, live cursors, video), hardware, or
   anything that isn't a server-rendered web app → give the honest "Liftkit
   isn't built for this" answer from the reference file and **STOP the whole
   flow**. Do not scaffold a bad fit.
5. Capture the result in `docs/idea.md` using the section structure of
   `docs/templates/idea.md` (pitch, user, pain, alternative, wedge, risks —
   plus the scoring table if candidates were generated).

**Done when:** `docs/idea.md` exists and the fit check passed.
Commit: `liftoff: step 1 — idea captured`.

## Step 2 — PRD (approval gate)

1. Copy the structure of `docs/templates/prd.md` to `docs/prd.md` and fill
   every section from the interview: problem, user, jobs, 3-5 v1 features,
   not-in-v1, success metric. Keep v1 brutally small — features cut here
   land in the roadmap's Later column at Step 5, they are not lost.
2. Show the user a short summary (features + not-in-v1 + metric) and ask for
   explicit approval — one question: "Approve this PRD, or what should
   change?" Iterate until they approve.
3. On approval, set the PRD's `## Status` section to `approved`.

**Done when:** `docs/prd.md` exists with `Status: approved` given explicitly
by the user — never assume or self-approve; this gate blocks Steps 3-5.
Commit: `liftoff: step 2 — PRD approved`.

## Step 3 — First specs

1. Pick the 2-3 PRD features that form the golden path (what must exist for
   one user to get the core job done once).
2. Read `docs/rules/testing.md` (the decision table) before writing any
   test-scenarios section.
3. For each feature, create `docs/specs/<feature-slug>.md` from
   `docs/templates/spec.md` (create `docs/specs/` if missing). Fill every
   section; the **Test scenarios** and **Data model** sections are mandatory
   and concrete (scenarios name their test level; data model names tables and
   ownership). Create each spec with status `draft`, then show the user a
   one-paragraph digest per spec and ask them to confirm. Set status
   `approved` only after the user confirms the digest; on an objection,
   revise the spec and re-confirm before approving.

**Done when:** 2-3 spec files exist, each with a filled Test scenarios
section and user-confirmed status `approved`.
Commit: `liftoff: step 3 — specs for <feature-1>, <feature-2>[, <feature-3>]`.

## Step 4 — Adaptation

Read `references/adaptation.md` before starting — it holds the schema-design,
factory, and seed patterns. Commit after each sub-step as
`liftoff: step 4<letter> — <what>`.

**Step 4 done when** (all six sub-steps' artifacts exist — on resume,
verify the last recorded sub-step's item before continuing; redo it if the
check fails):

- [ ] 4a — `grep -ri liftkit package.json src/app/layout.tsx src/app/opengraph-image.tsx src/app/page.tsx src/features/auth/sign-in-page.tsx src/lib/logger.ts src/lib/logger.test.ts` returns nothing; README title/H1 renamed. (`LIFTKIT_DB` env var and `@liftkit.dev` test-fixture emails are technical identifiers — they stay.)
- [ ] 4b — `--primary` and `--ring` have non-zero chroma in both theme
      blocks of `src/app/globals.css` and `--primary-foreground` matches the
      recipe's pairing (it may already equal the recipe value in the neutral
      template — that counts), or the user chose "keep neutral" (recorded by
      the `liftoff: step 4b — brand kept neutral` empty commit).
- [ ] 4c — domain tables in `src/db/schema.ts` and their migration applied.
- [ ] 4d — `make<Entity>()` per new table in `src/db/factories.ts`;
      `pnpm db:reset` reports seeded domain rows.
- [ ] 4e — `grep -l liftoff:fill docs/manifest.md docs/qa/project-profile.md` returns nothing.
- [ ] 4f — auth mode chosen and recorded in the env files (`AUTH_DEV_BYPASS`
      in `.env.development` set
      deliberately; creds shown to the user).

### 4a — Rename

Replace the Liftkit placeholder identity with the product's:

- `package.json` → `name` (kebab-case product name).
- `src/app/layout.tsx` → `metadata.title.default`, `title.template`,
  `description`.
- `src/app/page.tsx` → the hero `CardTitle` ("Liftkit") **and** the tagline
  `CardDescription` ("Agent-native SaaS starter") — the same tagline you
  replace in `layout.tsx` and the OG image.
- `src/features/auth/sign-in-page.tsx` → the `CardTitle`
  ("Sign in to Liftkit").
- `src/lib/logger.ts` → the `service` name in `base`.
- `src/lib/logger.test.ts` → update the expected `service` name to match logger.ts.
- `README.md` → the title/H1 and first paragraph are renamed to the product;
  stack-description mentions of Liftkit (e.g. "built on the Liftkit
  template") may stay. Keep the Quickstart/stack sections.
- `src/app/opengraph-image.tsx` → `alt` and both text nodes.

**Done when:** `grep -ri liftkit package.json src/app/layout.tsx src/app/opengraph-image.tsx src/app/page.tsx src/features/auth/sign-in-page.tsx src/lib/logger.ts src/lib/logger.test.ts` returns nothing — there are no intentional leftovers in the product identity. (`LIFTKIT_DB` env var and `@liftkit.dev` test-fixture emails are technical identifiers — they stay; the README per the rule above may still mention Liftkit as the template source.)
Commit: `liftoff: step 4a — rename to <product-name>`.

### 4b — Brand pass (minimal)

1. Ask one question: brand color preference (a color name, a hex, or "keep
   neutral"). If "keep neutral", make no CSS change but record the decision
   so the resume marker stays monotonic:
   `git commit --allow-empty -m "liftoff: step 4b — brand kept neutral"`,
   then continue to 4c.
2. Read `docs/rules/frontend.md` (Design tokens section), then edit
   `src/app/globals.css` per the token recipe in `references/adaptation.md`:
   set `--primary`, `--primary-foreground`, and `--ring` per the recipe in
   **both** theme blocks (`:root` and `.dark`) — nothing else. Note:
   `--primary-foreground` may already equal the recipe value in the neutral
   template; leaving it identical is correct, not an omission.

**Done when:** both blocks match the recipe (verify by value, not by diff:
`--primary`/`--ring` carry the brand hue with non-zero chroma,
`--primary-foreground` pairs per the recipe), `pnpm lint` green.
Commit: `liftoff: step 4b — brand primary hue`.

### 4c — Domain schema

1. Read `docs/rules/architecture.md` (Data access + Migrations sections) —
   its migration rule is binding: **never edit an applied migration file**.
2. Design tables from the PRD/specs' data models per the entity recipe in
   `references/adaptation.md`, and append them to `src/db/schema.ts` (keep the
   existing `users`/`accounts` tables untouched).
3. `pnpm db:generate` → **read the generated SQL** in `src/db/migrations/`
   and confirm it matches intent → `pnpm db:migrate`.

**Done when:** migration applied cleanly and `pnpm lint && pnpm test` green.
Commit: `liftoff: step 4c — domain schema (<entities>)`.

### 4d — Factories and seed

1. Re-read the Factories and seed section of `docs/rules/testing.md`: one
   factory per entity, shared by tests and seed.
2. Extend `src/db/factories.ts` with a `make<Entity>()` per new table
   (pattern in `references/adaptation.md`) and `scripts/seed.ts` to insert
   linked, realistic rows — a demo user owning real-looking domain data, not
   `"test1"` strings.
3. Prove it: `pnpm db:reset` (drops `.pglite/`, re-migrates, re-seeds) must
   report the seeded rows; then `pnpm lint && pnpm test`.

**Done when:** reset + gates green. Commit: `liftoff: step 4d — factories and seed for domain`.

### 4e — Manifest and profile

1. Fill every `docs/manifest.md` field from the PRD (product name, one-liner,
   target user, domain entities, current phase `building v1`, key URLs — use
   `n/a — not deployed yet` where truly unknown). Remove each `liftoff:fill`
   marker as its field is filled, and rewrite the `## Status` section to
   "Manifest complete — see `docs/roadmap.md` for what's next."
2. If `docs/qa/project-profile.md` exists, fill its product-specific
   placeholder fields the same way (stack fields are pre-filled — leave them).
3. **Prose mentions count too:** both files' intro text quotes the literal
   marker string (the manifest's header paragraph explains the unfilled
   state; the qa profile's blockquote and its "(filled by step 4e)"
   explainer reference it). The done-when grep matches those as well —
   rewrite each such sentence into a short "filled by `/liftoff` on <date>"
   note; do not leave any occurrence of the marker string in either file.

**Done when:** `grep -l liftoff:fill docs/manifest.md docs/qa/project-profile.md` returns nothing — both the manifest and the qa profile are fully filled.
Commit: `liftoff: step 4e — manifest filled`.

### 4f — Auth mode

The template ships a working email/password login with a seeded admin, and a
dev bypass (`AUTH_DEV_BYPASS=true` in `.env.development`) so `pnpm dev` skips
sign-in. Explain this to the user and let them choose — one question:

1. Show the seeded admin credentials (`SEED_ADMIN_EMAIL` /
   `SEED_ADMIN_PASSWORD` — the defaults live in `.env.example`) so they can
   log in.
2. Explain the three options and apply their choice by editing env files (not
   code): **keep the bypass on** (default, fastest local dev); **turn the
   bypass off** (set `AUTH_DEV_BYPASS=false` in `.env.development`) to
   exercise the real login now; or **add OAuth** (set `AUTH_GITHUB_*` /
   `AUTH_GOOGLE_*` in `.env` — the sign-in page shows provider buttons
   automatically when they are set).
3. Note that OAuth (Google/GitHub) requires reaching those providers, which is
   not always possible in every region — credentials login always works.

The bypass lives in `.env.development` on purpose: Next loads that file only
when `NODE_ENV=development`, so the bypass can never apply to `pnpm build` or
`pnpm start`. Do not move it into `.env`.

**Done when:** the choice is recorded in the env files and
`pnpm lint && pnpm test` are green.
Commit: `liftoff: step 4f — auth mode <mode>`.

## Step 5 — First run and handover

1. Start the app for the user to see: run `pnpm dev` in the background and
   read the actual URL from its output (`- Local: http://localhost:<port>`
   — the port is `3210` unless it was taken, in which case the wrapper picks
   the next free one). Smoke-check as the agent first: `/` returns 200 and
   the HTML contains the product name; `/signin` renders the email/password
   form; `/dashboard` returns 200 as the seeded admin when the dev bypass is
   on (Step 4f), or redirects to `/signin` when it is off. Report each check
   with actual evidence (status code / snippet).

   Then hand the running app to the user (hard gate — do not proceed until
   they answer, same as the Step 2 PRD approval): print the URL and a short
   checklist — open `/` (the product name renders), `/dashboard` (already
   signed in as the seeded admin, because the dev bypass is on), and
   `/signin` (the email/password form, which is what real users see). Repeat
   the seeded admin credentials from Step 4f. Ask them to look and reply when
   ready. **Leave the dev server running** after onboarding; tell them the URL
   and that they can stop it with Ctrl-C in its terminal (or by killing the
   `next dev` process).

2. Database check: run `pnpm db:seed` and expect the `Seed skipped` line
   (proves the app's database is reachable and already seeded). Then verify
   the seeded domain data is actually readable: if a domain page exists,
   load it and confirm seeded rows render; otherwise query a domain table
   via a one-off `tsx` script and confirm the seeded rows come back.
3. Seed `docs/roadmap.md` from the PRD: **Now** = the Step 3 spec'd features
   (link each to its `docs/specs/` file), **Next** = remaining PRD features
   (or an explicit "empty — all v1 features are in Now" line), **Later** =
   the PRD's Not-in-v1 items, **Shipped** = a "Nothing shipped yet" line.
   Remove every `liftoff:fill` marker in the file — the Shipped section has
   one too.
4. Hand over the map in chat (user's language):
   - Next command: `/feature <first-Now-feature>` — builds it spec-first.
   - `/review` for diff review, `/verify` for the full gate sequence
     (`pnpm lint && pnpm test && pnpm test:e2e && pnpm build`).
   - Playbooks index: `docs/playbooks/` (deploy, billing, pricing, and other
     occasional flows), if present.
   - **Data lifecycle note:** local data lives in `./.pglite/` — it survives
     restarts but is not in git; `pnpm db:reset` rebuilds it from migrations +
     seed at any time.
   - **Auth note:** email/password login works out of the box with the seeded
     admin. `pnpm dev` auto-signs-you-in as that admin
     (`AUTH_DEV_BYPASS=true` in `.env.development`); set it to `false` there
     to exercise the real sign-in form. OAuth buttons appear on `/signin`
     once `AUTH_GITHUB_*`/`AUTH_GOOGLE_*` are set (see `.env.example`).

**Done when:** smoke checks (including the db check) reported with evidence,
the user has confirmed they viewed the running app (preview gate), roadmap
has no `liftoff:fill` markers, and final gates `pnpm lint && pnpm test` are
green.
Run `pnpm format` before the final commit:
`liftoff: step 5 — first run green, roadmap seeded, handover`.

## Common rationalizations

| Rationalization                                                       | Reality                                                                                                                                               |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| "I'll batch these three questions, it's faster"                       | One question per message. Batched questions get batched, shallow answers — and the follow-up you would have asked never happens.                      |
| "The idea is close enough to a web app, the fit check is a formality" | The fit check is a hard gate. Scaffolding a mobile-first or ML-first idea onto this stack costs the user a week to discover.                          |
| "The pitch is vague but I can infer the persona"                      | Inferring the persona is how you build for nobody. Push once for one concrete person before writing `docs/idea.md`.                                   |
| "I'll fill the manifest markers as I go"                              | The `liftoff:fill` markers are the onboarding-complete signal that `CLAUDE.md` reads. Leaving one behind leaves the project permanently un-onboarded. |

## Red flags

- Two questions in one message
- `docs/idea.md` written before the fit check ran
- A candidate presented to the user that has not passed the fit check
- Any `liftoff:fill` marker surviving the handover
