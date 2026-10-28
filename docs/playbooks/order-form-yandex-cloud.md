# Форма заказа: Yandex Cloud, почта, бот

Спецификация: `docs/specs/order-form-ru.md`. Здесь описано, что уже настроено и
что осталось сделать руками. Форма работает на ludvik4.ru с 2026-10-28.

## Что уже есть (2026-10-27)

- Облако `cloud-ludvik4go`, каталог `default` (`b1g1bdgfn4uj49ufqe01`). Это
  аккаунт с черепашкой на аватарке; биллинг подключён.
- SmartCaptcha `ludvik4-order-form` (`bpn0ul3j276ogu93bo3j`), хост
  `ludvik4.ru` (localhost убран 2026-10-29; для локальной проверки вернуть его
  и `http://localhost:3344` в `ALLOWED_ORIGINS`, потом убрать снова). Ключ клиента (публичный):
  `ysc1_e3IAWjW1QFgktYxs5dbbRVpU2wWYiDKSdMBLfGxXe125326c`.
  Согласие на обучение ML-моделей Яндекса не дано.
- Функция `ludvik4-order` (`d4e50mjlh5me455rdigc`): Node.js 22, точка входа
  `index.handler`, таймаут 10 с, публичная.
  Адрес: `https://functions.yandexcloud.net/d4e50mjlh5me455rdigc`.
  Переменные окружения: `SMTP_USER=ludvik4go@yandex.com`,
  `ALLOWED_ORIGINS=https://ludvik4.ru` (localhost убран 2026-10-29).
- Посредник для Telegram `tg.ludvik4.dev` (см. ниже).
- Рядом с ней функция `gridfin-lead` для лендинга Gridfin. Её не трогать.

## Переменные окружения функции

Где вводить: Cloud Functions → `ludvik4-order` → «Редактор» → «Переменные
окружения». Слева «Ключ» (имя переменной), справа «Значение». После ввода
нажать «Сохранить изменения» внизу страницы.

### Уже введены (ничего делать не нужно)

| Ключ                 | Значение                              |
| -------------------- | ------------------------------------- |
| `SMTP_USER`          | `ludvik4go@yandex.com`                |
| `ALLOWED_ORIGINS`    | `https://ludvik4.ru`                  |
| `TELEGRAM_RELAY_URL` | `https://tg.ludvik4.dev/api/telegram` |

### Секреты (введены владелицей, 2026-10-28)

Таблица нужна, если секрет придётся заменить.

| Ключ                      | Значение                                 | Где взять значение                                                                                                                                                                  |
| ------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SMARTCAPTCHA_SERVER_KEY` | ключ сервера капчи, начинается с `ysc2_` | Консоль Yandex Cloud → SmartCaptcha → `ludvik4-order-form` → поле «Ключ сервера» → нажать на звёздочки → скопировать.                                                               |
| `SMTP_PASSWORD`           | пароль приложения, 16 латинских букв     | 1) Яндекс Почта → Настройки → «Почтовые программы» → включить IMAP и «Пароли приложений». 2) id.yandex.ru → «Безопасность» → «Пароли приложений» → «Почта» → создать → скопировать. |
| `TELEGRAM_BOT_TOKEN`      | токен бота, вида `1234567890:AAH…`       | Telegram → @BotFather → `/mybots` → `@ludvik4bot` → «API Token» → скопировать.                                                                                                      |
| `TELEGRAM_CHAT_ID`        | число, например `123456789`              | 1) Написать боту @userinfobot любое сообщение, он ответит вашим Id, скопировать это число. 2) Нажать «Старт» в @ludvik4bot, иначе бот не сможет вам писать.                         |

Пароль от почты сюда не подходит, нужен именно пароль приложения.

## Проверка

1. `pnpm order:build` пересобирает архив
   `cloud/order-function/dist/order-function.zip`. Если код менялся, архив
   загружается в «Редактор» → «ZIP-архив».
2. Локально в `.env.local` (уже записано):
   `NEXT_PUBLIC_ORDER_ENDPOINT=https://functions.yandexcloud.net/d4e50mjlh5me455rdigc`,
   `NEXT_PUBLIC_SMARTCAPTCHA_SITE_KEY=<ключ клиента>`.
3. Открыть `http://localhost:3344/uslugi/lendingi`, нажать «Заказать» и
   отправить тестовую заявку. Ожидаемый результат:
   - письмо приходит на `ludvik4go@yandex.com`;
   - в Telegram приходит «Новая заявка: … Подробности на почте».
4. Логи в консоли могут быть закрыты (ограниченный режим Яндекса). На время
   проверки добавить функции переменную `ORDER_DEBUG_TRACE=1`: тогда ответ
   содержит поле `trace` — ответ SMTP-сервера и результат сигнала.
   `250 Ok: queued` значит, что Яндекс принял письмо; доставка в ящик может
   занять несколько минут. **После проверки переменную удалить.** Раньше
   `trace` включался заголовком `Origin: http://localhost…`, который может
   подделать кто угодно (исправлено 2026-10-28).
5. Telegram из Yandex Cloud недоступен, поэтому сигнал идёт через посредника
   (см. ниже).

## Посредник для Telegram

Из Yandex Cloud не открываются `api.telegram.org` и `*.vercel.app`, а
`ludvik4.dev` открывается (проверено 2026-10-28). Поэтому:

- Код: `src/features/order/server/telegram-relay.ts` (логика и тесты),
  `cloud/telegram-relay/api/telegram.ts` (функция Vercel). Посредник не хранит
  секретов: токен приходит в запросе, принимается только токен @ludvik4bot.
- Vercel: проект `ludvik4-telegram-relay` в `krobox-6504s-projects`, домен
  `tg.ludvik4.dev`. DNS в Porkbun: `CNAME tg → 5be77a170f4580f0.vercel-dns-017.com`.
- В функции: `TELEGRAM_RELAY_URL=https://tg.ludvik4.dev/api/telegram`.
- Обновить посредника: `pnpm order:relay-build`, затем в
  `cloud/telegram-relay/dist`:
  `vercel link --yes --project ludvik4-telegram-relay --scope krobox-6504s-projects`
  и `vercel deploy --prod --yes --scope krobox-6504s-projects`.

## Ограничение масштабирования (защита счёта)

Функция → «Обзор» → настройки масштабирования: «Экземпляры функции в зоне
доступности» = 2, «Одновременные вызовы» = 4. Настроить вместе при запуске.
Почему не API Gateway: `docs/specs/order-form-ru.md` → «Защита».

## Сделано 2026-10-29

- Загружена версия функции с исправлениями безопасности от 2026-10-28
  (`d4ehr8ni5nb0ugm7hq89`); `ORDER_DEBUG_TRACE` не задан.
- `localhost` убран из `ALLOWED_ORIGINS` и из хостов капчи.
- Масштабирование: `zone_instances_limit=2`, `zone_requests_limit=4` для
  `$latest`. В консоли этих полей нет, задаётся из Cloud Shell:
  `yc serverless function set-scaling-policy --id d4e50mjlh5me455rdigc --tag '$latest' --zone-instances-limit 2 --zone-requests-limit 4`.
- Предзапрос `OPTIONS` с чужого Origin получает от платформы
  `Access-Control-Allow-Origin: *` — это добавляет Yandex Cloud, не наш код;
  сам `POST` с чужого Origin функция отклоняет (403).

Осталось: юрист проверяет `/politika-konfidentsialnosti` и `/soglasie`;
уведомление в Роскомнадзор (pd.rkn.gov.ru) — если юрист подтвердит, что оно
нужно.

Переменные сборки в Timeweb не нужны: адрес функции и ключ клиента капчи
зашиты в `config/ru-static-env.ts`.
