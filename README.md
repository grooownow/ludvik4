# Liftkit

Agent-native SaaS starter for Claude Code. One command, one guided hour:
from idea to a running, tested app.

## Quickstart

Prerequisites: Node >= 22, git, pnpm (optional — bootstrap can install it via corepack), [Claude Code](https://code.claude.com).

**1. Get your own copy.** On GitHub, click **"Use this template" → "Create a new
repository"** (or run `gh repo create my-app --template grooownow/liftkit-template --private --clone`).
This gives your project its **own clean git history — a copy, not a fork**. That
is what lets `/update` pull future template releases into your code without ever
merging against an upstream. Then clone your new repo and `cd` into it.

**2. Set up, then onboard.**

```bash
./scripts/bootstrap
```

Then open Claude Code in this folder and type `/liftoff`.
The onboarding agent takes it from there: your idea → PRD → specs → a running app.

(Bootstrap is forgiving if you skipped step 1: if you cloned the template
directly it offers to reset git to your own history, and if you downloaded an
archive it initializes a repo for you.)

Day to day after onboarding: `/feature <name>` to build the next thing,
`/review` to self-review a diff, `/verify` to run the full gate sequence
before merging. For occasional flows — deploy, billing, pricing, analytics,
compliance — see `docs/playbooks/`.

## Under the hood

- Next.js (App Router) + TypeScript strict + Tailwind
- Drizzle ORM + PGlite locally (zero external services); `LIFTKIT_DB=remote` for real Postgres
- Email/password auth that works on first run: a seeded admin you can sign in
  as, no OAuth account required (`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` in
  `.env.example`). `pnpm dev` signs you in automatically — set
  `AUTH_DEV_BYPASS=false` in `.env.development` to use the real login form.
- `pnpm dev` serves on port 3210 (or the next free one) and prints the URL
- Feature-first architecture enforced by lint (`docs/rules/architecture.md`)
- One gate: `pnpm lint` (oxlint → ESLint → Prettier → tsc) + `pnpm test`

## Quality gates

CI (and `pnpm lint`/`pnpm test` locally) enforce:

- **Lint chain**: `oxlint` → `eslint` → `prettier --check` → `tsc --noEmit`.
- **Tests** (`pnpm test`, three Vitest projects): `unit` (node, mocked db),
  `component` (jsdom + Testing Library), `integration` (real PGlite db,
  direct handler/action calls).
- **E2E** (`pnpm test:e2e`, Playwright): desktop + mobile smoke, including an
  SPA-navigation assertion (client-side nav must not trigger a full reload).
- **Lighthouse budgets** (`lighthouserc.js`, CI job `lighthouse`):
  performance and accessibility ≥ 0.90 on `/` and `/signin`, asserted against
  a production build (`pnpm build` + `pnpm start`).
- **Dependency audit** (`pnpm audit --audit-level high`): red on any
  high/critical advisory. Escape hatch for false positives or advisories
  without an available fix: an `overrides` entry in `pnpm-workspace.yaml` with a
  comment explaining why — see `docs/rules/security.md`. Currently
  applied: `tmp@<0.2.6: ^0.2.6` to override GHSA-ph9p-34f9-6g65 (via @lhci/cli,
  dev-only); remove when upstream updates.

## Testing

Built-in three-level harness, one command: `pnpm test` runs all three Vitest
projects (`unit`, `component`, `integration`) in one pass; `pnpm test:e2e`
runs the Playwright desktop + mobile smoke suite against a production build.
See `docs/rules/testing.md` for the decision table (what belongs at which
level), the prove-can-fail rule, and anti-flaky conventions.

**Optional companion:** the [qa-pilot](https://github.com/grooownow/qa-pilot)
Claude Code plugin adds test-authoring/audit/coverage skills on top of this
harness — `/plugin marketplace add grooownow/qa-pilot`. This repo ships with
`docs/qa/project-profile.md` already pre-filled for the stack above, so you
can skip `qa-pilot:onboard` and go straight to `qa-pilot:cover`.

## Where your local data lives

Your local database is the `.pglite/` folder in this repo — a real embedded
Postgres. It **survives dev-server restarts and reboots**, but it is **not in
git**: deleting the folder or making a fresh clone starts you from an empty
database — `pnpm db:reset` rebuilds it (migrations + seed) in one command. To back it up, copy the
folder. For longer-lived shared data, switch to a real Postgres:
`docker compose up -d` + `LIFTKIT_DB=remote` in `.env` (see `docker-compose.yml`).
Production always uses a managed Postgres — see the deploy playbook.

## Updating a project you've already started

Your project is a **copy** of the template, so updates don't arrive over git —
you pull them in on purpose, and it's safe to do on a project you're already
building. You don't have to watch for them: at the start of a session the agent
tells you when a newer version has shipped ("Liftkit 0.3.0 is available…").

To update, just type **`/update`** in Claude Code. The agent reads what changed
between your version and the latest, walks you through each release's apply plan,
adapts the changes around the code you've already written, and runs the gates —
stopping to ask before anything it can't cleanly reconcile. You can also read the
changes yourself first in `CHANGELOG.md`; every release there carries an
**Apply plan** — the exact prompt `/update` runs.

Your installed **template** version lives in `.liftkit-version`. That is
deliberately separate from `package.json`'s `version`, which is **your product's**
version — set it to whatever you like, ship your own 1.0.0, it won't confuse the
update check.

## License

Liftkit is a commercial template: build unlimited products with it (yours
and clients'), own everything you build; don't resell the template itself —
full terms in `LICENSE.md`. Your purchase includes all future updates.
