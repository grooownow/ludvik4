# Rule: Security

**Applies to:** every server action, route handler, env var, and auth-adjacent
change (spec §5.8) — this is baseline, not opt-in.

## Validate every boundary

Every server action / route handler starts by validating its raw input with a
`zod` schema — exemplar: `src/features/profile/update-name-action.ts`
(`nameSchema.safeParse`, called before touching the database, with
authorization checked even earlier). Copy that file's shape for new mutations:
`requireUser()` first → `safeParse` → typed `{ ok: true } | { ok: false; error }`
result → db write scoped to the authenticated user's own id. Skipping
validation on a boundary is the anti-pattern this exists to prevent.
`(partly enforced — agent-side)`: no lint rule can prove a `zod` parse guards
the right input, so the `PreToolUse` hook (`scripts/hooks/pretooluse.ts`) takes
the honest half of the job — when an edit adds a server action or route handler
that takes input and carries no visible `zod` parse, the write is escalated to
`ask` rather than denied. A heuristic that blocks is a heuristic that gets
switched off. The review lens still owns the semantic question: is the _right_
boundary validated?

## Typed environment

All env vars are declared in the `zod` schema in `src/lib/env.ts`; an invalid
or missing required var throws at startup with a readable message
(`parseEnv`), not a runtime crash later. Adding a var means all three:
schema entry in `src/lib/env.ts`, a documented (commented, optional-by-default)
line in `.env.example`, and a case in `src/lib/env.test.ts`. Verified:
`env.test.ts` already asserts default-mode boots with zero config and that
`LIFTKIT_DB=remote` requires `DATABASE_URL`.

## Secrets hygiene

- Never put a secret in code or a commit — env vars only, read through
  `src/lib/env.ts`.
- `.env`/`.env.local` are gitignored (`.gitignore`); `.env.example` holds
  documented placeholders only, never real values.
- `pnpm audit --audit-level high` runs in CI (`quality` job,
  `.github/workflows/ci.yml`) — red on any high/critical advisory. **First
  reach for `pnpm update <pkg> --lockfile-only`, not for an override.** These
  advisories almost always land on a transitive dep whose parent declares a
  caret range the patch already satisfies, and then the fix is a re-resolved
  lockfile — no config, nothing to clean up later. Read the parent's declared
  range before concluding it pins the patch away: all seven highs that had
  main red on 2026-08-09 (undici, fast-uri, ip-address, brace-expansion,
  js-yaml ×2, nanoid) cleared on a plain refresh, with no override touched.
- Escape hatch, for the case where no reachable version fixes it: an
  `overrides:` entry in `pnpm-workspace.yaml` with a comment explaining why —
  precedent: `tmp@<0.2.6: ^0.2.6` (GHSA-ph9p-34f9-6g65, via `@lhci/cli`,
  dev-only). Every entry is debt; remove it once upstream updates.
- Renovate (`.github/renovate.json5`) opens a weekly `lockFileMaintenance` PR
  that does that refresh on a schedule, so this class of advisory stops
  reaching CI at all. The nightly audit is the detector; Renovate is the fixer.

## Headers and rate limiting

- Security headers (`X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`, `Permissions-Policy`) are set globally in
  `next.config.ts`'s `headers()`. A full Content-Security-Policy is
  **deliberately deferred** — a naive CSP breaks agent-added inline scripts in
  a skeleton this young; see the comment in `next.config.ts` before adding one.
- Public endpoints that accept unauthenticated input use
  `src/lib/rate-limit.ts` (`rateLimit(key, opts)`). It's an in-memory,
  per-instance fixed-window limiter — fine for a single-instance MVP; a
  multi-instance production deploy needs a store-backed limiter (see the
  deploy playbook), not this module as-is.

## Auth

- Middleware (`src/middleware.ts`) does a **local-only** JWT/cookie check via
  the edge-safe `src/lib/auth.config.ts` — no adapter, no db import. Do not
  add a network/db call there (see frontend.md rule 2 and the header comment
  in `src/middleware.ts` for why).
- Every protected server component/action calls `requireUser()`
  (`src/features/auth/require-user.ts`) directly — this is the real,
  db-backed guard; middleware alone is never sufficient authorization.
- Any redirect built from a user-supplied `callbackUrl` goes through
  `safeCallbackUrl()` (`src/features/auth/callback-url.ts`), which rejects
  absolute/protocol-relative targets to close the open-redirect vector — see
  its header comment for the exact cases it blocks.
- Credentials login (bcrypt hash check, db lookup) lives only in
  `src/lib/auth.ts` — never in the edge-safe `src/lib/auth.config.ts`
  (imported by `src/middleware.ts`), which stays db-free.
- `AUTH_DEV_BYPASS` defaults to `false` and is switched on for local runs by
  `.env.development`, which Next loads only when `NODE_ENV=development`. It
  can never reach a build or a production server by default; if one is
  configured with it on, `src/lib/env.ts` throws at startup, so a
  misconfigured deploy fails loudly instead of shipping an open door. (The
  default is `false` rather than `true` precisely because `next build` runs
  with `NODE_ENV=production` and evaluates that module.)
- `scripts/seed.ts` refuses to run when `NODE_ENV=production` — the seeded
  admin (`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`) is a dev-only convenience;
  the first real production user is created manually.
- The sign-in server action validates input with `zod` and calls
  `rateLimit()` **before** checking the password hash — never the reverse.

## Errors and observability (adjacent, checked here)

- `console.log`/`console.*` in product code is a red lint: `no-console` is
  `"error"` in `.oxlintrc.json` (scripts/** is exempted).
- Empty `catch` blocks are now enforced: `no-empty` is `"error"` in
  `.oxlintrc.json` (red `pnpm lint`). Unhandled/swallowed promises remain
  `(convention — checked at review)` — type-aware linting is not installed.

## Gates (self-check before done)

- [ ] New action/route validates input with `zod` before use
- [ ] New env var: schema + `.env.example` + `env.test.ts` case, all three
- [ ] No secret literal in a diff; `.env*` untouched in git
- [ ] `pnpm audit --audit-level high` green — by a lockfile refresh where that
      suffices, otherwise by a documented override
- [ ] New protected surface calls `requireUser()`, not just middleware
