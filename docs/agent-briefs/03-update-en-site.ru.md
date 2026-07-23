# ТЗ 3: адаптация английской версии Ludvik4

## Статус

Требования частично реализованы в текущей ветке. Перед изменениями проверить
фактическое состояние `src/features/site/content.ts`, `home-en.tsx` и
`service-scopes.tsx`. Не переписывать рабочую реализацию без причины: задача
агента — сверить ее с этим ТЗ, исправить расхождения и провести полную проверку.

Это обновление контента и структуры EN-сборки, а не редизайн.

## Цель

Адаптировать английскую витрину под уточненный состав услуг Ludvik4:

1. website or landing page;
2. business workflow automation;
3. web app or compact SaaS.

EN остается founder-led версией от первого лица и работает для международной
аудитории. Не переносить на нее русское позиционирование независимого
разработчика и не добавлять ссылки на русский сайт.

## Обязательный порядок блоков

1. Header.
2. Text-only hero.
3. `What I do` — три карточки услуг.
4. `How it works` — три этапа.
5. `What's included` — подробный состав услуг.
6. `AI-assisted development`.
7. Contact с существующей EN-формой и Telegram.
8. Footer.

Не добавлять:

- публичные цены;
- FAQ только ради симметрии с RU;
- блог или русские статьи;
- отдельный блок About;
- переключатель языка;
- новую hero-иллюстрацию.

## Позиционирование и голос

Сохранить:

> Ludvik4 is a founder-led product studio working with clients worldwide.

Hero:

> I design and launch focused websites, business automations, and compact web
> applications with a complete user journey.

Текст должен быть ясным международному клиенту без знания российского рынка.
Использовать `I`, когда речь идет об ответственности владельца. В описаниях
этапов и границ допустим нейтральный продуктовый язык.

## How it works

Подзаголовок:

> From an idea or operational problem to a clear solution and a working
> product.

Этапы:

1. **Define the problem.** Clarify the problem, target user and successful
   outcome.
2. **Build the first useful release.** Focus the first version on the core user
   journey without speculative features.
3. **Launch and move forward.** Deploy or hand over the product, then extend,
   support or operate it independently.

Сохранить визуальную композицию текущего русского блока процесса, но не
переводить текст дословно, если английская формулировка звучит неестественно.

## What's included

Использовать общий компонент scope-аккордеона. Первый пункт открыт по умолчанию.
Локализовать все подписи:

- `Stages`;
- `Baseline scope`;
- `Quoted separately`.

Для каждой услуги показать:

1. ожидаемый результат;
2. основные этапы;
3. базовые границы;
4. то, что оценивается отдельно.

Не показывать внутренние оценки в часах и суммы. Во вводном тексте сообщить:

> Each engagement is scoped around a clear outcome. After a short discovery, I
> provide a fixed scope and price.

Актуальное подробное содержание трех услуг находится в
`docs/service-scopes-ru.md` и типизированном EN-контенте
`src/features/site/content.ts`.

## AI-assisted development

Сохранить этот блок как международный дифференциатор после `What's included`.
Он должен объяснять agent-ready delivery, spec-driven development и личную
ответственность за проект. Не превращать блок в четвертую услугу и не обещать
неподтвержденную экономию или автономность AI.

## Контакт и форма

- Сохранить текущую EN lead form и Telegram.
- Не расширять набор собираемых данных.
- Сохранить английские labels и сообщения.
- Утвержденная privacy notice по-прежнему является release blocker.
- Не публиковать выдуманный юридический текст.

## Визуальные ограничения

Текущий дизайн Ludvik4 — обязательный референс:

- сохранить палитру, типографику, контейнеры и разделители;
- использовать существующие `Section`, `ServiceGrid` и `ServiceScopes`;
- не создавать новые карточки или визуальную концепцию;
- обеспечить отсутствие переполнений и горизонтального скролла;
- проверить длинные английские заголовки на desktop и mobile.

## Проверка

1. `SITE_MARKET=en` показывает процесс и три scope-пункта.
2. EN не содержит публичных цен.
3. EN сохраняет форму и founder-led голос.
4. RU по-прежнему содержит цены и не содержит форму.
5. На EN нет русского контента, блога и переключателя локали.
6. Пройти lint, typecheck, unit/component tests и production build.
7. Сделать полностраничные скриншоты EN минимум на 1440×900 и 390×844.

## Критерии приемки

- Порядок блоков соответствует ТЗ.
- Три услуги одинаково называются в карточках и scope-аккордеоне.
- `How it works` и `What's included` естественно читаются по-английски.
- Публичные цены отсутствуют.
- Визуальный язык текущего сайта сохранен.
- EN production build и все проверки проходят.
