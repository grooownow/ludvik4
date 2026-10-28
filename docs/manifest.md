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
(на каждой витрине своя, см. ниже).

## Domain entities

Нет доменной модели/БД — сайт статический (SSG). RU-витрина также содержит
страницы услуг с пакетами и ценами и раздел работ. Единственный «поток данных» —
заявки, которые нигде не хранятся в собственной БД:

- EN: контакт-форма (`src/features/lead/`), письмо через Resend.
- RU (с 2026-10-28): форма заказа (`src/features/order/`) отправляет заявку в
  функцию Yandex Cloud, та шлёт письмо в Яндекс Почту и сигнал без
  персональных данных в Telegram через посредника на Vercel. RU-сборка
  по-прежнему не содержит lead-бэкенда EN. См. `docs/specs/order-form-ru.md`.

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

The international storefront was rebuilt locally on 2026-08-10 around the
category `founder-led web product studio`: three intent-specific service pages,
an English-only work/evidence layer, About, and market-scoped service files.
Product canon and search strategy live in `docs/marketing/en/`; audit and
retest evidence live in `docs/seo/`. The commercial rebuild reached production
on 2026-08-10. The 2026-08-11 content wave adds an English planning-guide hub
and one original decision worksheet for each service cluster.
