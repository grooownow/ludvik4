# Ludvik4

Brand site of Ludvik4 — an independent digital product developer. Three
services: websites/landing pages, business-process automation, and web apps /
compact SaaS. **Two market storefronts built from one codebase**
(`SITE_MARKET=ru|en`):

| Storefront | URL                                | Hosting                      |
| ---------- | ---------------------------------- | ---------------------------- |
| EN         | [ludvik4.dev](https://ludvik4.dev) | Vercel (SSG, preview per PR) |
| RU         | [ludvik4.ru](https://ludvik4.ru)   | Timeweb (static export)      |

The site is static — no database or domain model. The only data flow is the
contact form (`src/features/lead/`), which delivers leads to email via Resend
and stores nothing. The form ships **only in the EN build**; the RU build
physically contains no lead backend. The RU storefront additionally has three
commercial service pages and a cases section.

## Stack

Next.js (App Router) + TypeScript strict + Tailwind, shadcn/radix primitives,
MDX content, PostHog analytics, Sentry. Scaffolded from the
[Liftkit](https://github.com/grooownow/liftkit-template) template
(agent-native workflow: skills, rules, quality gates).

## Development

Prerequisites: Node >= 22, pnpm, git.

```bash
./scripts/bootstrap   # first-time setup (env, deps)
pnpm dev              # serves on port 3210 (or next free) and prints the URL
```

`SITE_MARKET` (env) selects the storefront being built/served; see
`docs/specs/dual-market-sites.plan.md` for how the two builds differ.

```bash
pnpm build            # EN production build (Vercel)
pnpm build:ru-static  # RU static export for Timeweb
```

## Quality gates

- `pnpm lint` — oxlint → eslint → prettier → tsc
- `pnpm test` — Vitest (unit, component, integration)
- `pnpm test:e2e` — Playwright desktop + mobile smoke
- CI additionally runs Lighthouse budgets (performance & a11y ≥ 0.90) and
  `pnpm audit`

Commits follow Conventional Commits (enforced by a pre-commit hook via
lefthook).

## Docs

- `docs/manifest.md` — product identity card (session entry point)
- `docs/roadmap.md` — what's next / current handoff
- `docs/business-strategy.md` + `docs/agent-briefs/01-rebuild-market-sites.ru.md`
  — positioning and services SSOT
- `docs/specs/dual-market-sites.plan.md` — dual-market build architecture
- `docs/playbooks/production-en-vercel.md`,
  `docs/playbooks/production-ru-timeweb.md` — deployment runbooks
- `docs/rules/` — engineering rules (architecture, testing, security, git,
  content, …)
