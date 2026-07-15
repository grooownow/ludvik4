# Ludvik4 — дизайн-промпты для Pencil (V0)

> Готовые промпты по секциям + общая визуальная рамка. Копируй промпт секции в Pencil,
> генерируй, дальше правим. Тексты — финальные из `docs/site-v0.md`, менять по вкусу.
> Реализация опирается на дизайн-токены темы (`src/app/globals.css`) — см. «Токены» ниже.

## Визуальная рамка (mood)

- **Характер:** современный, минималистичный, технологичный, но тёплый. Уверенно, без пафоса
  и без «агентство-градиент-соуп». Много воздуха, крупная типографика, чёткая иерархия.
- **Ассоциация:** личный бренд инженера / маленькой студии из мира `.dev`. Спокойная сила.
- **Не надо:** стоковых иллюстраций людей, обилия иконок, ярких градиентов, теней-«облаков»,
  маркетингового шума. Одна мысль на экран.

### Цвет

- База — нейтральная (тема уже есть: светлая и тёмная). Сайт работает в обеих.
- **Один акцент** — на кнопках, ссылках, активных состояниях. Цвет пока не выбран.
  Предлагаю на выбор (скажи — поставлю в `globals.css`):
  - **Indigo/violet** — `oklch(0.55 0.18 275)` — техно, спокойный, «dev».
  - **Тёплый янтарь** — `oklch(0.70 0.15 65)` — теплее, человечнее.
  - **Спокойный тил** — `oklch(0.60 0.12 190)` — свежий, сдержанный.
- Акцент — точечно. Всё остальное держим на нейтралях.

### Типографика

- Основной шрифт — **Geist** (уже подключён). Заголовки — крупно и плотно (tight leading).
- **Вордмарк «Ludvik4»** и мелкие технические подписи (eyebrow-лейблы секций) — моно
  (Geist Mono), нижним/верхним регистром — это добавляет «dev»-характера. Опционально.

### Ритм и сетка

- Контейнер по центру, макс. ширина ~1100–1200px; текстовые блоки уже (~640–720px).
- Крупные вертикальные отступы между секциями (дышащий ритм).
- Радиусы и границы — из токенов (`--radius`, `--border`), карточки со сдержанной рамкой.
- Брейкпоинты: **375 / 768 / 1280**. Мобайл — одна колонка, сетки схлопываются.

## Токены (дизайн-контракт — не выдумывать свои)

`--background` `--foreground` · `--card` / `--card-foreground` · `--primary` / `--primary-foreground`
(акцент) · `--muted` / `--muted-foreground` · `--border` · `--ring` · `--radius` (0.625rem).
Светлая/тёмная — оба блока в `globals.css`. Компоненты — из shadcn (Button, Card, Input, Label,
Textarea). Новых паттернов не вводим.

---

## Промпты по секциям

### 0. Общий каркас страницы

> Landing page, single column, centered container max-width ~1180px, generous vertical rhythm.
> Modern, minimal, confident. Neutral base with one accent color. Light and dark variants.
> Sections in order: sticky-lite top bar → hero → services grid → how-it-works → about → contact form → footer.

### 1. Top bar (лёгкая)

> Slim top bar: left — wordmark «Ludvik4» (mono). Right — a single «Обсудить задачу» button
> (accent) and a theme toggle. Transparent over hero, subtle border on scroll. No nav menu.

### 2. Hero

> Big, calm hero. Wordmark/eyebrow «Ludvik4» small on top (mono).
> H1 (large, tight): «Веб-продукты — от идеи до релиза.»
> Sub (muted, ~600px): «Сайты, веб-приложения и SaaS, плагины, автоматизация рутины — довожу до рабочего релиза.»
> Primary button «Обсудить задачу» + quiet secondary link «LinkedIn».
> Lots of whitespace. No hero image; maybe a very subtle abstract mark or grid texture.

### 3. Услуги — «Что делаю» (сетка карточек)

> Section eyebrow «Что делаю». Grid of 4 cards (2×2 desktop, 1 col mobile), equal height,
> subtle border, no heavy shadow. Each card: bold title + one muted line.
>
> 1. **Сайты** — Лендинги, промо- и персональные сайты, корпоративные страницы. Быстрые, адаптивные, готовые к SEO.
> 2. **Веб-приложения и SaaS** — Продукты с логикой, аккаунтами и оплатой. SaaS — сервис по подписке прямо в браузере: трекер, дашборд, CRM-лайт, внутренний инструмент.
> 3. **AI-инструменты и плагины** — Инструменты для команд и тех, кто пишет код с AI: плагины для AI-ассистентов, стартер-паки, утилиты и интеграции.
> 4. **Автоматизация** — Рутина уходит в скрипты, боты и связки между сервисами: сбор и обработка данных, отчёты, интеграции. Где уместно — с AI поверх готовых моделей.

### 4. Форматы работы (компактная лента)

> A compact row/strip of 4 items (chips or minimal cards), one line each, under the services:
> «Под ключ» · «От идеи до MVP» · «Усиление команды (frontend/fullstack)» · «Миграция легаси».
> Small, secondary weight — a supporting band, not a headline block.

### 5. Как это работает

> Section eyebrow «Как это работает». Lead line (medium): «Вы приходите с идеей или болью — я предлагаю, как её решить.»
> Then 3 steps in a row (stack on mobile), numbered 01/02/03 (mono numerals):
> 01 **Не нужно готового ТЗ.** Расскажете, что хочется или что не так, — я предложу варианты и придумаю решение под вас. Задачу и результат опишем вместе.
> 02 **Оптимальный MVP.** Рабочая версия в короткий срок, которая снимает острую боль.
> 03 **Формат под вас.** Разовый продукт, развитие или поддержка с доработками. Под смежные задачи — дизайн, бренд, видео, анимацию — подключаю нужных специалистов.

### 6. Кто за этим стоит

> Narrow, understated block (~640px), left-aligned. Small eyebrow «Кто за этим стоит».
> Text: «За Ludvik4 — инженер с более чем 10-летним опытом в вебе: от продуктовой команды в крупном финтехе до собственных приложений. Techlead за плечами, глубоко в современном фронтенде, fullstack и AI-инструментах. Строю быстро, но не на выброс.»
> One quiet link «LinkedIn →». No photo, no name.

### 7. Контакт + форма

> Section eyebrow «Контакт». H2: «Расскажите, что нужно». Sub: «Опишите задачу — предложу решение и подскажу, с чего начать.»
> Card with a form: field «Имя» (optional), field «Задача» (textarea, required),
> field «Как с вами связаться» (required, placeholder: «email или ссылка на мессенджер / телефон»),
> a captcha slot (Cloudflare Turnstile), primary submit «Отправить заявку».
> Beside/under the form — a quiet «Или напишите в Telegram → t.me/ludvik4».
> Success and error states below the button (inline, no modal).

### 8. Футер

> Minimal footer: «© 2026 Ludvik4» left; right — Telegram, LinkedIn links. Thin top border. Muted.

---

## Что делает Claude (не Pencil)

- Реальную форму, валидацию, капчу, доставку заявки (Telegram/email) и адаптив в коде —
  по этой же структуре. Pencil даёт визуал; я переношу его на shadcn-компоненты и токены.
- После твоего дизайна — сверю вёрстку с макетом на 375/768/1280 со скриншотами.
