---
title: EN production runbook — ludvik4.dev on Vercel
status: live
owner: user's agent
---

# EN production — ludvik4.dev (Vercel)

The international market (`SITE_MARKET=en`) runs on Vercel at
`https://ludvik4.dev`. The RU market is a separate deploy on separate
infrastructure and shares nothing but the Git repo — see the RU runbook
(ТЗ 2, `docs/agent-briefs/02-deploy-two-market-sites.ru.md`).

Switched from the RU build to the EN build on **2026-07-25**.

## Coordinates

| What              | Value                                           |
| ----------------- | ----------------------------------------------- |
| Vercel scope      | `krobox-6504s-projects` (Hobby)                 |
| Project           | `ludvik4` (`prj_BboglE3vZfuhoMyXmyT7QA7BQnYE`)  |
| Production branch | `main` — every push auto-deploys production     |
| Primary domain    | `ludvik4.dev` (`www` 308-redirects to the apex) |
| Dashboard         | vercel.com/krobox-6504s-projects/ludvik4        |

Account owner, recovery email and 2FA live with the owner, not in this repo.

## What makes the build EN

`SITE_MARKET` is a **build-time** constant (inlined by `next.config.ts` so the
other market's home — and the RU blog — is dead-code-eliminated). Changing it
requires a rebuild, not just a restart.

Production env vars that define this deploy:

| Variable              | Value                 | Why                               |
| --------------------- | --------------------- | --------------------------------- |
| `SITE_MARKET`         | `en`                  | selects market, copy, routes, SEO |
| `NEXT_PUBLIC_APP_URL` | `https://ludvik4.dev` | canonical, sitemap, robots, OG    |
| `RESEND_API_KEY`      | secret                | lead-form delivery (EN only)      |
| `LEAD_EMAIL_TO/FROM`  | secret                | lead-form delivery (EN only)      |

`GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION`, `SENTRY_DSN`,
`NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY` are also set for
Production + Preview.

**Preview caveat:** `SITE_MARKET` is set for Production only — preview deploys
therefore fall back to the `ru` default and do **not** mirror production. Add
`SITE_MARKET=en` to Preview in the dashboard (CLI 54.4.1 loops on
`vercel env add … preview`; a newer CLI or the dashboard works). Preview also
carries its own copies of the Resend variables — production secrets do not
belong in preview (ТЗ 2 §Этап 4); rotate or clear them there.

## Deploy

Normal path — merge/push to `main`; Vercel builds and aliases `ludvik4.dev`.

Manual rebuild of the current production commit (e.g. after an env change):

```bash
vercel ls ludvik4 --prod --scope krobox-6504s-projects   # newest prod URL
vercel redeploy <that-url> --scope krobox-6504s-projects
```

`--scope` is not optional: without it the CLI resolves the personal team and
fails with "Deployment belongs to a different team".

An env change alone changes nothing until a rebuild — `SITE_MARKET` and every
`NEXT_PUBLIC_*` value are baked into the build.

## Rollback

Vercel deploys are atomic; a failed build leaves the previous one serving.

```bash
vercel rollback --scope krobox-6504s-projects            # to the previous prod
vercel promote <older-deployment-url> --scope krobox-6504s-projects
```

`vercel ls ludvik4 --prod --scope krobox-6504s-projects` lists candidates. To
roll back the _market_ (EN → RU) the env var must change too, then redeploy.

## Smoke checks after a production deploy

```bash
for p in / /en /blog /privacy /sitemap.xml /robots.txt /llms.txt; do
  printf "%-16s %s\n" "$p" "$(curl -sS -o /dev/null -w '%{http_code}' https://ludvik4.dev$p)"
done
curl -sS https://ludvik4.dev/ | grep -oE '<html lang="[a-z]+"|<title>[^<]*</title>'
```

Expected on the EN build: `/` 200 · `/en` 308 → `/` · `/blog*` 404 ·
`/privacy` 200 · `lang="en"` · sitemap lists only `/` and `/privacy` ·
robots disallows `/blog`, `/dashboard`, `/signin`.

The lead form is only proven by a real submission (the success message means
Resend accepted the message — confirm the mail actually lands in
`LEAD_EMAIL_TO`).

## Diagnosing: DNS vs application

- `dig +short ludvik4.dev` — empty/wrong → DNS, not Vercel.
- HTTP 200 with the wrong language → env/build problem (`SITE_MARKET`), not DNS.
- Vercel error page (`DEPLOYMENT_NOT_FOUND`, `404: NOT_FOUND` with a Vercel
  ID) → the domain resolves but no deployment is aliased.
- Build logs: `vercel inspect <deployment-url> --logs --scope krobox-6504s-projects`
  or the dashboard → Deployments → the failing build.
- Runtime logs: `vercel logs <deployment-url> --scope krobox-6504s-projects`.

## Known follow-ups

- `/blog/*` returns 404 on `ludvik4.dev` since the market switch. The owner
  chose a 301 to the RU domain **once it is live** (`/blog/<slug>` →
  `https://<ru-domain>/blog/<slug>`) — not before, to avoid redirecting into a
  dead host. Add it to `next.config.ts` `redirects()` beside the `/en` rule.
- `/signin` (200) and `/dashboard` (307) are Liftkit starter auth surfaces
  still published on a marketing site; they are the reason `pnpm audit` reports
  three critical `next-auth` beta advisories in CI.
- No uptime monitor is configured for `ludvik4.dev` yet (ТЗ 2 §Мониторинг).
