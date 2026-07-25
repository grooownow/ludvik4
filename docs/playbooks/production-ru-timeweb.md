---
title: RU production runbook — ludvik4.ru на Timeweb
status: live
owner: user's agent
---

# RU-продакшен — ludvik4.ru (Timeweb)

Русская витрина (`SITE_MARKET=ru`) работает на Timeweb App Platform как
статическая сборка. GitHub остаётся единственным основным репозиторием.

## Координаты

| Что                | Значение                                                    |
| ------------------ | ----------------------------------------------------------- |
| Основной домен     | `https://ludvik4.ru`                                        |
| Дополнительный     | `https://www.ludvik4.ru`                                    |
| Timeweb-приложение | `ludvik4-ru`, ID `228059`, проект `2747503`                 |
| Технический домен  | `https://ludvik4go-ludvik4-53df.twc1.net`                   |
| SourceCraft        | `https://sourcecraft.dev/ludvik4go/ludvik4`, ветка `deploy` |
| Команда сборки     | `pnpm build:ru-static`                                      |
| Результат сборки   | `/out`                                                      |

## Как работает автодеплой

Workflow `.github/workflows/deploy-ru.yml` запускается после каждого push в
GitHub `main`:

1. собирает RU-версию локально на GitHub runner;
2. отправляет тот же commit SHA в ветку `deploy` зеркала SourceCraft;
3. вызывает API Timeweb для приложения `228059`;
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

В Timeweb открыть приложение `ludvik4-ru` → настройки деплоя → ветка `deploy`,
выбрать последний успешный commit и запустить деплой. После исправления
повторный push в GitHub `main` снова возвращает обычный автоматический поток.

## Проверка после деплоя

```bash
curl -fsSL https://ludvik4.ru |
  grep -o 'https://ludvik4.ru/og-image-ru.png'
curl -fsSI https://ludvik4.ru/og-image-ru.png |
  grep -i '^content-type: image/png'
curl -fsSL https://ludvik4.ru/sitemap.xml |
  grep 'https://ludvik4.ru'
```

Дополнительно проверить `www.ludvik4.ru`, главную, `/blog`, один материал,
`/robots.txt` и `/sitemap.xml`.

## Обслуживание

- До 25 июля 2027 года перевыпустить ограниченный Timeweb-токен и обновить
  `TIMEWEB_TOKEN` в GitHub Actions.
- При замене ключа SourceCraft сначала добавить новый публичный ключ, затем
  обновить `SOURCECRAFT_SSH_KEY`, проверить workflow и только после этого
  удалить старый ключ.
- Если технический домен обновился, а собственные домены показывают старую
  версию, перепривязать домены в настройках приложения и запустить новый деплой.
