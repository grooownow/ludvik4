---
title: Deploy to Vercel + managed Postgres
status: lite
owner: user's agent
---

# Deploy

Ship this app to production: Vercel hosting + a managed Postgres database
(Neon or Supabase). Driven by the `deploy` skill, one checkpoint at a time.

## Prerequisites

- A GitHub account (repo can be pushed as part of step 1 if not already).
- A Vercel account (free tier is enough — vercel.com, sign in with GitHub).
- Gate sequence green (`verify` skill) — never deploy red.

## Steps

### 1. Push the repo to GitHub

**Agent does:** check `git remote -v`. No remote → create one
(`gh repo create <name> --source=. --private --push` if `gh` is available;
otherwise ask the user to create an empty repo on github.com, then
`git remote add origin <url> && git push -u origin main`).

**Done when:** `main` is visible on github.com.

### 2. Create a managed Postgres database

**User does** (navigation may differ by provider version — look for the
nearest equivalent action if a label doesn't match):

- **Neon** (neon.tech): sign in → "New Project" → region close to your
  Vercel region → "Connection Details" → copy the **pooled** connection
  string (hostname usually contains `-pooler`).
- **Supabase** (supabase.com): sign in → "New Project" → set a db password →
  Project Settings → Database → "Connection string" → **URI** tab,
  "Transaction" pooling mode.

**Done when:** one Postgres connection string is copied — paste it directly
into Vercel's env UI in step 4, not into chat.

### 3. Import the project into Vercel

**Dashboard path (first-timers):** vercel.com/new → "Import Git Repository"
→ select the repo from step 1 → Next.js preset auto-detects → add env vars
first (step 4) before the first deploy.

**CLI alternative:** `npx vercel link`, then `npx vercel` for a preview or
`npx vercel --prod` once env vars are set.

**Done when:** the project exists in the Vercel dashboard (a failed first
build is expected — env vars aren't set yet).

### 4. Set environment variables

**User does** (dashboard: Project → Settings → Environment Variables; CLI:
`npx vercel env add <NAME>`); **agent does** helps produce the values:

| Variable                                | Value                                                                 |
| --------------------------------------- | --------------------------------------------------------------------- |
| `DATABASE_URL`                          | The connection string from step 2.                                    |
| `LIFTKIT_DB`                            | `remote` — switches off local PGlite.                                 |
| `AUTH_SECRET`                           | `npx auth secret` (agent runs, gives the user the printed value).     |
| `AUTH_TRUST_HOST`                       | Not needed on Vercel (auto-trusted). Only for self-hosting elsewhere. |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | If GitHub sign-in is used — see callback note below.                  |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | If Google sign-in is used — see callback note below.                  |
| `NEXT_PUBLIC_APP_URL`                   | The production URL Vercel assigns (or custom domain from step 7).     |

**OAuth callback URLs** — update before sign-in works in production:

- GitHub OAuth App → "Authorization callback URL" →
  `https://<your-domain>/api/auth/callback/github`
- Google Cloud Console → Credentials → OAuth client → "Authorized redirect
  URIs" → `https://<your-domain>/api/auth/callback/google`

**Done when:** vars are set and the redeploy succeeds.

### 5. Run migrations against production

**Agent does**, from your local machine (never edit an applied migration —
`docs/rules/architecture.md`):

```bash
LIFTKIT_DB=remote DATABASE_URL="<connection string from step 2>" pnpm db:migrate
```

**Done when:** exits 0, reports the applied migrations.

### 6. Smoke check

**Agent does:** `curl -I https://<your-domain>/` (expect `200`); then a real
browser pass: `/` renders, `/signin` completes an actual sign-in round-trip.

**Done when:** both checks pass with quoted evidence.

### 7. Custom domain (optional)

**User does:** Vercel → Settings → Domains → add domain → follow the DNS
records shown (usually `CNAME`/`A` at your registrar). **Agent does:** once
DNS resolves, update `NEXT_PUBLIC_APP_URL` and OAuth callback URLs to match.

**Done when:** the domain serves the app over HTTPS.

### Production auth checklist

- Set `AUTH_DEV_BYPASS=false` in the production env vars (step 4) — the app
  refuses to boot otherwise (`src/lib/env.ts` throws at startup).
- Do **not** run `pnpm db:seed` against production — it refuses when
  `NODE_ENV=production`; create the first real user manually instead.
- Set `AUTH_SECRET` (already listed in step 4's table) — required in
  production.

## Done when (overall)

- Live URL serves `/` with a real 200 and expected content.
- Sign-in works end-to-end on the live URL.
- Lighthouse spot-check (Chrome DevTools panel, or `npx lighthouse <url> --view`)
  is in the same range as the local budget in `lighthouserc.js`
  (performance + accessibility ≥ 0.90).

## Notes

- `src/lib/rate-limit.ts` is in-memory, per-instance — fine for a single
  deployment; scaling to multiple instances needs a store-backed limiter
  (`docs/rules/security.md`).
- Local dev keeps using PGlite; only the deployed environment needs
  `LIFTKIT_DB=remote`.
