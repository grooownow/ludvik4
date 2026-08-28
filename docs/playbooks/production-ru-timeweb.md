---
title: RU production runbook — ludvik4.ru on Timeweb
status: live
owner: user's agent
---

# RU production — ludvik4.ru (Timeweb)

The Russian storefront (`SITE_MARKET=ru`) runs on Timeweb App Platform as a
static build. GitHub remains the source-of-truth repository.

## Coordinates

| Item                | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| Canonical domain    | `https://ludvik4.ru`                                         |
| Additional host     | `https://www.ludvik4.ru`                                     |
| Timeweb application | `ludvik4-ru-v2`, ID `228103`, project `2747503`              |
| Technical domain    | `https://ludvik4go-ludvik4-4387.twc1.net`                    |
| SourceCraft mirror  | `https://sourcecraft.dev/ludvik4go/ludvik4`, branch `deploy` |
| Build command       | `pnpm build:ru-static`                                       |
| Build output        | `/out`                                                       |

The static export uses directory indexes (`/cases/index.html`,
`/uslugi/razrabotka-lendinga/index.html`) so Timeweb can serve clean nested
URLs without custom rewrite rules.

`/gridfin/` is the Gridfin product landing (RU). It is NOT built by this
repository: the self-contained bundle (index.html + assets/ + subpages) is
generated in `grooownow/gridfin` (`pnpm landing:build` →
`marketing/landing/dist/ru/`; the source moved from `landing/` to
`marketing/landing/` in that repo's marketing reorganization, 2026-08-11)
and committed verbatim into `resources/ru-public/gridfin/`, which
`scripts/build-ru-static.ts` copies into `out/gridfin` for the RU export
only — the EN build never ships it. To update it, rebuild there and
re-copy; the folder is excluded from prettier. Live since 2026-08-07
(commit `15a717a`).

Timeweb deployment settings may still contain `NEXT_PUBLIC_POSTHOG_KEY`, but
the RU build hard-disables PostHog in code. The library is not initialized and
`contact.telegram_clicked` is not captured. Remove the variable from Timeweb
when convenient as defence in depth; the browser-exposed project key is not a
server secret.

Дзен domain ownership is verified through the public static file
`/zen_e6h1u9CR24KoSJLaDqT7Nvm2K1DMC6PEIbplq2l5MUmKTIc3v1vpdCyJbf2oHRU.html`.
The token is public by design and is committed with the static storefront.

The previous app `ludvik4-ru` (`228059`) is not part of the production path.
Confirm that no domains or deploy automation target it before deleting it.

## Autodeploy flow

The `.github/workflows/deploy-ru.yml` workflow runs after every push to GitHub
`main`:

1. build the RU storefront on the GitHub runner;
2. push the same commit SHA to the SourceCraft mirror's `deploy` branch;
3. call the Timeweb API for application `228103`;
4. wait until Timeweb publishes that exact commit SHA.

The separate `deploy` branch is required because SourceCraft protects its
mirrored `main` branch from direct pushes. Scheduled `main` synchronization is
auxiliary and is not used by production.

GitHub Actions uses two repository secrets:

- `SOURCECRAFT_SSH_KEY`;
- `TIMEWEB_TOKEN`.

Secret values are not stored in the repository. The Timeweb token is limited
to project `2747503`, has App Platform access without service deletion, and
expires on 25 July 2027.

## Manual deploy

The normal recovery path is to rerun the `Deploy RU` workflow in GitHub
Actions. Before running it, confirm that the intended commit is on GitHub
`main`.

To inspect the mirror:

```bash
git ls-remote ssh://ssh.sourcecraft.dev:443/ludvik4go/ludvik4.git refs/heads/deploy
```

## Rollback

In Timeweb, open `ludvik4-ru-v2`, select the `deploy` branch in deployment
settings, choose the last successful commit, and deploy it. A later push to
GitHub `main` resumes the normal automated flow.

## Production checks

```bash
curl -fsSL https://ludvik4.ru |
  grep -o 'https://ludvik4.ru/og-image-ru.png'
curl -fsSI https://ludvik4.ru/og-image-ru.png |
  grep -i '^content-type: image/png'
curl -fsSL https://ludvik4.ru/sitemap.xml |
  grep 'https://ludvik4.ru'
curl -fsSL https://ludvik4.ru/uslugi/razrabotka-lendinga/ |
  grep -o '<title>Разработка лендинга[^<]*'
```

Also check `/`, `/blog`, one article, `/privacy`, `/robots.txt`, and
`/sitemap.xml`. The HTML must use `lang="ru"`, the apex canonical, and RU-only
metadata.

## `www` policy

Both `ludvik4.ru` and `www.ludvik4.ru` currently return `200` with the same RU
build. Every page declares the apex URL as canonical, so search engines have a
single preferred host.

A strict `www` → apex redirect is deliberately deferred. Timeweb App Platform
does not support a per-host redirect, REG.RU forwarding cannot cover this
HTTPS subdomain case, and a dedicated Timeweb backend costs 510 RUB/month.
Do not create the standalone redirect service unless this decision is
revisited. See `docs/decisions/0003-defer-ru-www-redirect.md`.

## Incident history

On 27 July 2026, Timeweb resolved ticket `12354415` by removing an orphaned
Caddy vhost left by the previous app and rebinding the domains to app `228103`.
Before closing the ticket, apex HTML and `og-image-ru.png` were verified as
byte-identical to the technical domain.

If the technical domain updates while a custom domain remains stale, compare
`Last-Modified`, HTML hashes, and OG metadata. If the symptoms match ticket
`12354415`, avoid repeated deployments and ask Timeweb to remove the orphaned
Caddy vhost.

## Maintenance

- Rotate the limited Timeweb token before 25 July 2027 and update
  `TIMEWEB_TOKEN` in GitHub Actions.
- When rotating the SourceCraft key, add the new public key first, update
  `SOURCECRAFT_SSH_KEY`, verify the workflow, and only then remove the old key.
- Recheck apex and `www` after DNS, domain, or Timeweb application changes.
