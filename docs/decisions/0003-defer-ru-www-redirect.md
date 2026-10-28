# ADR 0003: Defer the RU `www` redirect

## Context

The RU deployment uses `https://ludvik4.ru` as its canonical host. Timeweb App
Platform serves the same static build on `https://www.ludvik4.ru` but cannot
configure a host-specific redirect. The deployment brief originally required
the secondary host to redirect permanently to the canonical host.

## Options considered

1. **Dedicated Timeweb backend** — provides a strict `301` redirect while
   preserving path and query, but costs 510 RUB/month solely for that redirect.
2. **REG.RU forwarding** — inexpensive, but does not support the required HTTPS
   subdomain redirect.
3. **Cloudflare redirect** — available at low cost, but introduces an
   unnecessary dependency and possible accessibility risk for the primary RU
   audience.
4. **Serve the same build on both hosts** — no added cost; canonical metadata
   consolidates indexing signals, but the secondary host continues to return
   `200` instead of `301`.

## Decision

Keep both hosts on the current Timeweb static application and use
`https://ludvik4.ru` as the canonical URL. Do not operate a separate redirect
service unless duplicate-host behavior becomes a measurable SEO or analytics
problem.

## Consequences

The RU storefront remains inexpensive and has no runtime service to maintain.
Search engines receive a consistent apex canonical, but requests to `www` are
not normalized at the HTTP layer. Any future infrastructure change must retain
the apex canonical and may supersede this decision if it can provide the
redirect without a disproportionate recurring cost.

## Status

`superseded` (2026-10-29). Timeweb App Platform now offers host redirects in
the app's web-server settings («Настройки веб-сервера» → «Редиректы», type
`host`). `www.ludvik4.ru` → `ludvik4.ru` is a `301` there, keeping path and
query, at no extra cost. See `docs/playbooks/production-ru-timeweb.md`.
