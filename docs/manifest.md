# Product Manifest

This file is your project's identity card — the one doc every agent session
reads first (see `CLAUDE.md`/`AGENTS.md`). Filled during setup; keep it current
as the product evolves.

## Product name

Ludvik4

## One-liner

Бренд-сайт независимого разработчика цифровых продуктов Ludvik4: три услуги (сайт/лендинг,
автоматизация бизнес-процессов, веб-приложение/компактный SaaS). **Две рыночные
витрины из одной кодовой базы** (`SITE_MARKET=ru|en`): русская и международная.

## Target user

Небольшой бизнес или основатель, которому нужен законченный цифровой продукт
или MVP — приходит с идеей/болью, а не с готовым ТЗ. RU: Ludvik4 — бренд
независимого продуктового разработчика; основной текст нейтральный, первое лицо
используется в блоке о личной ответственности. EN: `founder-led product studio`,
от первого лица. Постоянная команда не заявляется; профильные специалисты
подключаются по необходимости. Связь — Telegram (обе витрины) + форма заявки
(**только EN-витрина**).

## Domain entities

Нет доменной модели/БД — сайт статический (SSG). Единственный «поток данных» —
заявка из контакт-формы (`src/features/lead/`), которая доставляется на email
через Resend и нигде не хранится в собственной БД. **Форма есть только в
EN-сборке**; RU-витрина форму не показывает и не регистрирует lead-экшен (её build
физически не содержит lead-бэкенда — см. `docs/specs/dual-market-sites.plan.md`).

## Current phase

`live`

## Chat language

The language the agent speaks with you in chat (artifacts stay English).
To change it later, edit the value below (or just ask the agent to switch).

Russian

## Key URLs

| What          | URL                                                          |
| ------------- | ------------------------------------------------------------ |
| Production EN | https://ludvik4.dev (international market, `SITE_MARKET=en`) |
| Production RU | https://ludvik4.ru (Timeweb, `SITE_MARKET=ru`)               |
| Staging       | n/a — Vercel preview deploys per PR                          |
| Repo          | https://github.com/grooownow/ludvik4                         |

## Status

Manifest complete — MVP shipped and live; rebuilt into two market storefronts
(ТЗ 1, 2026-07-22; RU voice updated 2026-07-23; both production deployments
live by 2026-07-27). Positioning + services SSOT: `docs/business-strategy.md` +
`docs/agent-briefs/01-rebuild-market-sites.ru.md`; build/architecture:
`docs/specs/dual-market-sites.plan.md`. `docs/site-v0.md` is the original
single-market design record (superseded for positioning/services/RU-form — see
its banner). Deployment runbooks: `docs/playbooks/production-en-vercel.md` and
`docs/playbooks/production-ru-timeweb.md`. What's next: `docs/roadmap.md`.
