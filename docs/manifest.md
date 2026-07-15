# Product Manifest

This file is your project's identity card — the one doc every agent session
reads first (see `CLAUDE.md`/`AGENTS.md`). Filled during setup; keep it current
as the product evolves.

## Product name

Ludvik4

## One-liner

Персональный бренд-сайт независимого инженера: витрина услуг (сайты,
веб-приложения и SaaS, AI-инструменты, автоматизация) с формой заявки.

## Target user

Небольшой бизнес или основатель, которому нужен цифровой продукт под ключ или
MVP — приходит с идеей/болью, а не с готовым ТЗ. Бренд намеренно обезличен
(«то ли человек, то ли студия»); имя владельца на сайте не раскрывается.

## Domain entities

Нет доменной модели/БД — сайт статический (SSG). Единственный «поток данных» —
заявка из контакт-формы (`src/features/lead/`), которая доставляется в Telegram
(и опционально email через Resend), нигде не хранится.

## Current phase

`live`

## Chat language

The language the agent speaks with you in chat (artifacts stay English).
To change it later, edit the value below (or just ask the agent to switch).

Russian

## Key URLs

| What       | URL                                   |
| ---------- | ------------------------------------- |
| Production | https://ludvik4.dev (serves on `www`) |
| Staging    | n/a — Vercel preview deploys per PR   |
| Repo       | https://github.com/grooownow/ludvik4  |

## Status

Manifest complete — MVP shipped and live. See `docs/roadmap.md` for what's next
and `docs/site-v0.md` for the content/structure source of truth.
