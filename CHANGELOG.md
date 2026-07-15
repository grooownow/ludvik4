# Changelog

All notable changes to the Liftkit template are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/); versions
follow [semver](https://semver.org/).

## How updates reach you

Your project starts as a **copy** of this template, so updates don't arrive
automatically. Each release below ships two things:

1. **Release notes** — what changed and why.
2. **An apply plan** — a short prompt-plan written for your agent. Open your
   project in Claude Code, paste the plan, and the agent applies the update
   to your codebase (adapting around your own changes) and runs the gates.

New projects don't need any of this — just start from the latest template.

---

## [Unreleased]

_Nothing yet._

---

## [0.4.0] — 2026-07-15

**Starting a project is now foolproof, whichever way you grab the template.**
Your project has to be a standalone _copy_ of the template — its own git history,
no remote pointing back upstream — or `/update` can't pull future releases into
your code. GitHub's "Use this template" gives you exactly that, but nothing said
to use it: the README jumped straight to `./scripts/bootstrap`, so a raw
`git clone` left you wired to the template, and a ZIP download left no repo at
all. Bootstrap now sorts this out for you, and the README points you at the right
door in the first place.

### Apply plan

Run `/update`, or paste this into your project's Claude Code session. This
release only touches first-run onboarding and docs — it does **not** change your
running app, so for an already-started project it's low-risk housekeeping.

> Update this Liftkit project from 0.3.0 to 0.4.0. Work on a branch
> (`chore/update-0.4.0`) and commit once at the end. Stop and ask me before
> anything you cannot reconcile cleanly.
>
> 1. **Get the real files.** Clone the template into a temp dir —
>    `git clone --depth 1 https://github.com/grooownow/liftkit-template.git "$(mktemp -d)/liftkit"` —
>    and copy the files below OUT OF THAT CLONE. Do not write them from memory; if
>    the clone fails, stop and tell me.
> 2. **`scripts/bootstrap`** — take the template's version. It now normalizes git
>    on first run: initializes a fresh repo for an archive download, and for a raw
>    clone of the template offers (only at a real terminal) to reset to a clean
>    history, else safely detaches the template remote. It is a no-op for a project
>    that already has its own `origin` — which mine does — so nothing about my
>    running project changes. If I've customized `bootstrap`, reconcile rather than
>    clobber and show me the merge.
> 3. **`README.md`** — the Quickstart now leads with GitHub's "Use this template"
>    and explains the copy-not-fork model. If I've already replaced the README with
>    my own product's, SKIP this file — it's the template's onboarding doc, not
>    mine.
> 4. **Stamp the version.** Set `.liftkit-version` to exactly `0.4.0`. Leave
>    `package.json`'s `version` alone — that field is my product's.
> 5. **Check it works:** run `pnpm lint && pnpm test` and report what each printed.
> 6. Commit as `chore(update): apply Liftkit 0.4.0`.

### Changed

- **First run makes your project a standalone copy.** `scripts/bootstrap` now
  normalizes git before installing dependencies (so lefthook's prepare hook has a
  repo): it initializes a repository if you downloaded an archive, and if you
  cloned the template directly it offers — at a real terminal — to reset to a
  clean history, or safely detaches the template remote otherwise. A project
  created via "Use this template" is already correct, so bootstrap leaves it
  untouched. This is what keeps `/update` able to copy future releases in without
  ever merging against an upstream.
- **The README Quickstart starts with acquisition.** It leads with
  **"Use this template" → "Create a new repository"** (or `gh repo create
--template`) and spells out why your project is a copy, not a fork — the step
  that used to be silently assumed.

---

## [0.3.0] — 2026-07-13

**Updates you can find, and apply without reading anything.** Until now a new
release was invisible: the apply plan sat in a changelog you had no reason to
open. Now your project tells you, and one command adopts it.

### Apply plan

This is the last update you apply by hand. Copy everything below into Claude Code
in your project — after it lands you'll have `/update`, and every future release
is one command.

> Update this Liftkit project from 0.2.0 to 0.3.0. Work on a branch
> (`chore/update-0.3.0`), and commit once at the end. Stop and ask me before
> anything you cannot reconcile cleanly.
>
> 1. **Get the real files.** Clone the template into a temp dir —
>    `git clone --depth 1 https://github.com/grooownow/liftkit-template.git "$(mktemp -d)/liftkit"` —
>    and copy every file this plan names OUT OF THAT CLONE. Do not write any of
>    them from memory: if the clone fails, stop and tell me, don't reconstruct.
> 2. **The update system itself** — copy `scripts/hooks/update-check.ts`,
>    `scripts/hooks/session-update-check.ts`, `scripts/hooks/update-check.test.ts`,
>    and the whole `.claude/skills/update/` directory.
> 3. **Register the session hook.** Merge the `SessionStart` entry from the
>    template's `.claude/settings.json` into mine — merge, do not overwrite: my
>    file may already carry hooks I want to keep.
> 4. **Stamp the version.** Create `.liftkit-version` containing exactly `0.3.0`.
>    This tracks the TEMPLATE's version, and is deliberately separate from
>    `package.json`'s `version`, which is my own product's — leave that field
>    alone, whatever it currently says.
> 5. **Skills are compiled now** (this shipped in 0.2.0; skip this step if my
>    `.claude/skills/*/` already contain `SKILL.md.tmpl` files). Each `SKILL.md`
>    is generated from a `SKILL.md.tmpl` by `pnpm skills:gen`. If I customised any
>    `SKILL.md` by hand, move my edits into a new `.tmpl` for that skill (put
>    `{{PREAMBLE}}` as the first line of its `## Ground rules`) and show me
>    anything you are unsure about — do not discard a customisation.
> 6. **Check it works**: run `pnpm lint && pnpm test`, then
>    `pnpm exec tsx scripts/hooks/session-update-check.ts` — it should print
>    nothing (I'm on the latest). Report what each command actually printed.
> 7. Commit as `chore(update): apply Liftkit 0.3.0`.

### Added

- **A session-start notice.** Once a day at most, your agent tells you when a
  newer template has shipped: _"Liftkit 0.4.0 is available (you're on 0.3.0). Run
  /update…"_. Silent when there's nothing new, no network, or no access — a check
  that nags is a check you'd turn off.
- **The `/update` skill.** It reads what changed between your version and the
  latest, walks each release's apply plan in order, copies real files from a fresh
  template clone, adapts around the code you've already written, commits per
  version, and gates between each. Your project is a copy, not a fork, so it never
  merges or rebases against the template.
- **`.liftkit-version`** — the template version your project is on, tracked
  separately from `package.json`'s `version`, which stays yours. Ship your own
  1.0.0 whenever you like; the update check won't get confused.
- **`pnpm release <x.y.z>`** (maintainers only, not shipped in the template) cuts
  a release and propagates it to the template in one command — or refuses, if the
  version has no changelog section with an apply plan. No plan, no release.

---

## [0.2.0] — 2026-07-13

**The agent layer stops asking and starts enforcing.** Every rule in this
release moved from the prose column into the machine column: an invariant that
used to be a request an agent could talk itself out of is now a hook that
refuses the write, a test that fails the build, or a gate that goes red.

### Apply plan

Paste this into your project's Claude Code session. It adapts the changes around
whatever you have already built, and stops to ask before anything destructive.

> Update this project from Liftkit 0.1.0 to 0.2.0. Work on a branch, commit each
> step, and run `pnpm lint && pnpm test` before you finish.
>
> 1. **Invariant hook.** Copy `scripts/hooks/` and `.claude/settings.json` from
>    the template. If I already have a `.claude/settings.json`, merge the
>    `hooks.PreToolUse` entry into it rather than overwriting my file. Then
>    check my `src/` for code the hook would now deny — an internal `<a href>`,
>    a `window.location` assignment, any network or db call in
>    `src/middleware.ts` — and show me each one before fixing it.
> 2. **Skill compiler.** Copy `scripts/gen-skills.ts`, `scripts/lib/codegen.ts`
>    and the `skills:gen`/`skills:check` scripts. My `.claude/skills/*/SKILL.md`
>    files are now GENERATED: for each skill I have customised, move my edits
>    into a new `SKILL.md.tmpl` (put `{{PREAMBLE}}` as the first line of its
>    `## Ground rules`), then run `pnpm skills:gen`. Do not throw away a
>    customisation — show me anything you are unsure about.
> 3. **The rest**, in order, running the gates after each: the coverage floor and
>    size budget (`scripts/lib/skill-coverage.ts`, `scripts/skill-coverage.test.ts`,
>    `scripts/fixtures/skill-size-baseline.json` — regenerate the baseline from
>    MY skills, not the template's); the `learn` and `design` skills; the
>    detection eval and its `tests/fixtures/planted-defects/`; the updated
>    `review`, `feature` and `doubt` skills; the `CLAUDE.md`/`AGENTS.md` entry-map
>    test.
> 4. Add `docs/research/` to `.gitignore` if you keep competitor notes locally.

### Added

- **The hard invariants are enforced, not requested.** A `PreToolUse` hook
  (`scripts/hooks/pretooluse.ts`, registered in `.claude/settings.json`) reads
  every proposed edit and denies an internal `<a href>`/`window.location`
  navigation, any network or db call in `src/middleware.ts`, and a
  non-conventional commit subject; a server action that takes input with no
  visible `zod` parse is escalated to `ask`. The hook always exits 0 and fails
  open — a guard that can brick a session is a guard that gets uninstalled.
- **Skills are compiled, not copy-pasted.** `SKILL.md` is now generated from
  `SKILL.md.tmpl` (`pnpm skills:gen`), with the shared prelude written once and
  injected by tier. `pnpm skills:check` fails CI if a generated file was
  hand-edited. This landed because the "chat in the project's language" rule had
  drifted into five different wordings across five skills.
- **Two new skills.** `learn` — cross-session memory in `docs/learnings.jsonl`
  that garbage-collects itself (a note whose file is gone is stale; a note a
  newer one contradicts is superseded; nothing is deleted without asking).
  `design` — the visual loop: a token SSOT read out of the real stylesheet,
  variants that must differ on a named axis, a taste profile that decays 5% a
  week, and a 375/768/1280 review with a screenshot behind every finding.
- **The skill harness can now fail.** A coverage floor (every skill must be
  registered with what proves it works), a size budget against a committed
  baseline (a skill's body is a running token cost, and the shared preamble is a
  multiplier), and a detection eval (`pnpm skills:evals:detection`) that runs
  `review` against five planted defects and asserts a detection-rate floor.
  The eval is a **local** command run under your Claude subscription, not a CI
  job — Actions has no subscription to borrow, and a gate that is always red
  teaches people to ignore gates.
- **`feature` gained a plan artifact and a resume protocol.** The plan ends with
  the literal line `NO UNRESOLVED DECISIONS`, read back before implementing, so
  "did planning finish?" is a grep rather than a feeling.

- **Working login out of the box.** Email/password sign-in with a seeded admin
  (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, hashed with bcryptjs into a new
  nullable `users.password_hash` column). No OAuth account needed — Google and
  GitHub stay optional and are unreachable in some regions. The sign-in action
  validates with `zod` and rate-limits before checking the hash; the
  credentials check lives in `src/lib/auth.ts` so the edge-safe config and
  middleware stay database-free. A failed sign-in shows a generic error under
  the form and keeps the email you typed.
- **Dev bypass.** `pnpm dev` signs you in as the seeded admin automatically
  (`AUTH_DEV_BYPASS=true` in the new `.env.development`, which Next loads only
  when `NODE_ENV=development`). It defaults to off everywhere else, and the app
  refuses to boot if it is on in production. `scripts/seed.ts` refuses to run
  against production.
- **Onboarding shows you the app.** `/liftoff` Step 5 now starts the dev
  server, prints the URL, and waits for you to look before finishing —
  the server stays running afterwards. New sub-step 4f explains the auth mode
  and hands you the admin credentials.
- **Chat language is chosen, not guessed.** Step 0 asks which language the
  agent should chat in and records it in `docs/manifest.md`, so every later
  session — with or without skills — uses it. Repo artifacts stay English.

### Changed

- `review` now scores each finding for confidence and **drops** any it cannot
  quote a line for — not softened, not filed under "possible issues".
- `doubt` carries a one-way-door registry: whether a decision must be asked is a
  declared property of the decision, not a read on how confident the agent feels.
- `CLAUDE.md` and `AGENTS.md` are tested to name the same rules files. They had
  drifted: AGENTS.md silently omitted `definition-of-done.md` and `sources.md`.
- **One app port, 3210** (`config/ports.ts`), replacing the hardcoded `3000` in
  Playwright, Lighthouse, and env defaults. `pnpm dev` shifts to the next free
  port if 3210 is taken and prints the URL it actually bound.
- **The e2e suite always boots its own production build**
  (`reuseExistingServer: false`), so a running `pnpm dev` can no longer be
  tested by mistake in place of the real build. It runs with the dev bypass
  off, exercising the real login on every gate run.

### Fixed

- PGlite is loaded via native `require` (`serverExternalPackages`); bundled
  into a server chunk it crashed the credentials sign-in in a production build.
- Sign-in normalises email case and whitespace, so `Admin@example.local` logs
  in and the rate-limit bucket cannot be sidestepped by varying the case.

---

## [0.1.0] — 2026-07-09

Initial release.

### Added

- **Skeleton**: Next.js (App Router) + TypeScript strict + Tailwind v4 +
  shadcn/ui with two-theme design tokens; Drizzle ORM with PGlite by default
  (zero external services) and a `LIFTKIT_DB=remote` switch for real
  Postgres; Auth.js v5 with local-JWT sessions; error surfaces, structured
  logging (pino + `onRequestError`), env-gated Sentry and PostHog slots;
  security baseline (validated env, security headers, rate-limit helper);
  SEO minimum (metadata, sitemap, robots, OG template).
- **Quality gates**: one `pnpm lint` chain (oxlint → ESLint architecture
  boundaries → Prettier → tsc); three Vitest projects (unit / component /
  integration on real PGlite); Playwright e2e (desktop + mobile, including
  an SPA-navigation gate); Lighthouse budgets (perf & a11y ≥ 0.90);
  dependency audit gate; lefthook pre-commit.
- **Agent infrastructure**: `/liftoff` onboarding (idea → PRD → specs →
  adapted running app, resumable); daily skills `feature`, `review`,
  `verify`, `deploy`; six rules files with named enforcement;
  authoring templates and ADR system.
- **Playbooks**: deploy (Vercel + managed Postgres), billing (Stripe),
  pricing, landing, analytics, compliance, AI integration.
- **qa-pilot bridge**: pre-filled project profile for the optional QA
  copilot plugin.
