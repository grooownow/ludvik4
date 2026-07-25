---
title: RU production runbook — ludvik4.ru на Timeweb
status: degraded
owner: user's agent
---

# RU-продакшен — ludvik4.ru (Timeweb)

Русская витрина (`SITE_MARKET=ru`) работает на Timeweb App Platform как
статическая сборка. GitHub остаётся единственным основным репозиторием.

> **Временная проблема Timeweb, 2026-07-25.** Создано чистое приложение
> `228103`: его технический домен обслуживает актуальный деплой, но после
> переноса `ludvik4.ru` публичный хост всё равно остаётся на старом каталоге
> Caddy. Тикет Timeweb № `12354415` дополнен результатами проверки; поддержка
> согласилась выполнить перепривязку и деплой со своей стороны.

## Координаты

| Что                | Значение                                                    |
| ------------------ | ----------------------------------------------------------- |
| Основной домен     | `https://ludvik4.ru`                                        |
| Дополнительный     | `https://www.ludvik4.ru` (временно на старом приложении)    |
| Timeweb-приложение | `ludvik4-ru-v2`, ID `228103`, проект `2747503`              |
| Технический домен  | `https://ludvik4go-ludvik4-4387.twc1.net`                   |
| Старое приложение  | `ludvik4-ru`, ID `228059` (временный откат, не удалять)     |
| SourceCraft        | `https://sourcecraft.dev/ludvik4go/ludvik4`, ветка `deploy` |
| Команда сборки     | `pnpm build:ru-static`                                      |
| Результат сборки   | `/out`                                                      |

## Как работает автодеплой

Workflow `.github/workflows/deploy-ru.yml` запускается после каждого push в
GitHub `main`:

1. собирает RU-версию локально на GitHub runner;
2. отправляет тот же commit SHA в ветку `deploy` зеркала SourceCraft;
3. вызывает API Timeweb для приложения `228103`;
4. ждёт, пока Timeweb опубликует именно этот commit SHA.

Отдельная ветка `deploy` нужна потому, что SourceCraft защищает зеркальную
`main` от прямых push. Плановая синхронизация `main` из GitHub остаётся
вспомогательной и в продакшене не участвует.

GitHub Actions использует два repository secret:

- `SOURCECRAFT_SSH_KEY`;
- `TIMEWEB_TOKEN`.

Значения секретов в репозитории не хранятся. Токен Timeweb ограничен проектом
`2747503`, имеет доступ только к App Platform, не разрешает удаление сервисов и
истекает 25 июля 2027 года.

## Ручной деплой

Обычный путь — повторно запустить workflow `Deploy RU` во вкладке Actions.
Перед ручным запуском убедиться, что нужный commit находится в GitHub `main`.

Для диагностики можно проверить зеркало:

```bash
git ls-remote ssh://ssh.sourcecraft.dev:443/ludvik4go/ludvik4.git refs/heads/deploy
```

## Откат

В Timeweb открыть приложение `ludvik4-ru-v2` → настройки деплоя → ветка
`deploy`, выбрать последний успешный commit и запустить деплой. После
исправления повторный push в GitHub `main` снова возвращает обычный
автоматический поток.

## Проверка после деплоя

```bash
curl -fsSL https://ludvik4.ru |
  grep -o 'https://ludvik4.ru/og-image-ru.png'
curl -fsSI https://ludvik4.ru/og-image-ru.png |
  grep -i '^content-type: image/png'
curl -fsSL https://ludvik4.ru/sitemap.xml |
  grep 'https://ludvik4.ru'
```

Дополнительно проверить главную, `/blog`, один материал, `/robots.txt` и
`/sitemap.xml`. `www.ludvik4.ru` должен возвращать постоянный редирект на apex;
App Platform не поддерживает такой редирект, поэтому его нужно настроить
отдельно.

## Обслуживание

- До 25 июля 2027 года перевыпустить ограниченный Timeweb-токен и обновить
  `TIMEWEB_TOKEN` в GitHub Actions.
- При замене ключа SourceCraft сначала добавить новый публичный ключ, затем
  обновить `SOURCECRAFT_SSH_KEY`, проверить workflow и только после этого
  удалить старый ключ.
- Если технический домен обновился, а собственные домены показывают старую
  версию, сравнить `Last-Modified` и OG metadata. Если проблема повторяет тикет
  № `12354415`, не перезапускать деплои по кругу: обратиться в Timeweb с
  просьбой очистить осиротевший vhost Caddy.
