# Ludvik4 — настройка секретов (форма + деплой)

> Что нужно сделать руками, чтобы форма доставляла заявки и стоял анти-спам.
> Всё опционально для локали: без секретов форма работает и логирует, но в
> production заявка не роняется молча (просит написать в Telegram).
> Переменные добавляем в Vercel (Project → Settings → Environment Variables) и,
> для локального теста, в `.env`. Пример со всеми ключами — в `.env.example`.

## 1. Telegram-бот (доставка сейчас — без ожидания DNS)

1. Открой [@BotFather](https://t.me/BotFather) → `/newbot` → задай имя/юзернейм →
   получишь **токен** → это `TELEGRAM_BOT_TOKEN`.
2. Напиши созданному боту любое сообщение (иначе он не сможет писать тебе первым).
3. Узнай свой numeric id у [@userinfobot](https://t.me/userinfobot) → это `TELEGRAM_CHAT_ID`.
4. Пропиши обе переменные. Готово — заявки падают тебе в личку.

```
TELEGRAM_BOT_TOKEN=123456:AA...
TELEGRAM_CHAT_ID=123456789
```

## 2. Email через Resend (доставка следом)

1. Зарегистрируйся на [resend.com](https://resend.com), создай **API key** → `RESEND_API_KEY`.
2. Добавь и верифицируй домен `ludvik4.dev` (Resend даст DNS-записи — добавь их у
   регистратора; распространение занимает время, поэтому это «следом», не к анонсу).
3. Пропиши:

```
RESEND_API_KEY=re_...
LEAD_EMAIL_TO=ludvik4good.me@gmail.com
LEAD_EMAIL_FROM=Ludvik4 <hi@ludvik4.dev>
```

`LEAD_EMAIL_FROM` должен быть на верифицированном домене, иначе Resend отклонит отправку.

## 3. Cloudflare Turnstile (капча от спама)

1. В [Cloudflare Dashboard](https://dash.cloudflare.com) → Turnstile → Add site →
   домен `ludvik4.dev`. Получишь **Site key** и **Secret key**.
2. Пропиши:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAA...
TURNSTILE_SECRET_KEY=0x4AAA...
```

Без этих ключей капча просто не показывается, форма работает (honeypot + rate-limit
остаются). С ключами — виджет появляется и проверяется на сервере.

> **CSP:** если после включения капча не грузится, проверь Content-Security-Policy —
> нужно разрешить `https://challenges.cloudflare.com` в `script-src`/`frame-src`.
> (В текущем шаблоне жёсткого CSP нет — но проверь после первого деплоя.)

## 4. Деплой на Vercel

1. Импортируй репозиторий в Vercel (Framework preset — Next.js, определится сам).
2. Добавь переменные окружения из шагов выше (как минимум Telegram).
3. `NEXT_PUBLIC_APP_URL=https://ludvik4.dev` — чтобы OG/robots/sitemap знали прод-URL.
4. Подключи домен `ludvik4.dev` (Project → Domains). SSL Vercel выдаст сам.
5. Проверь после деплоя: главная открывается, форма шлёт тестовую заявку тебе в Telegram,
   превью-ссылки (OG) показывают «Ludvik4».

## Заметки

- Rate-limit сейчас in-memory и живёт per-instance — на serverless это «слабый», но для
  MVP-анти-спама достаточно (боты чаще ловятся honeypot + Turnstile). Для строгого лимита
  позже подключим store-backed лимитер (см. deploy-плейбук).
- Тариф Vercel Hobby формально «некоммерческий» — сайт услуг ближе к коммерческому, на
  будущее может понадобиться Pro. На старте не блокирует.
