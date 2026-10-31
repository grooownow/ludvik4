# Translation brief — ludvik4.dev in Spanish and Russian

Repo: /Users/ekaterinapustovaa/Documents/Pet-projects/ludvik4, branch `feat/multilingual`.
Design: docs/superpowers/specs/2026-10-31-multilingual-dev-design.md (read it first).

## What the site is

Ludvik4 — a founder-led web studio (owner: Kate / Ekaterina Pustovaia, an
autónoma in Valencia, Spain) building landing pages, websites, web apps,
web animations and business automations for clients worldwide. Prices in EUR,
21% Spanish VAT for private clients. The home is an "exhibition": collection
halls, exhibits, a jelly roly-poly mascot called Ludvik.

The English site (ludvik4.dev) is the SOURCE OF TRUTH for facts, prices,
packages, legal facts. You translate it. You never add or drop a promise,
a price, a fact, a legal claim.

## Quality bar (the owner's words: "not machine translation — switch the brain on")

- Write as a native copywriter of that language would write this page for
  this audience. Selling, warm, clear, concise. No calques of English idioms.
  Re-phrase freely where the English construction is unnatural, keep the
  meaning and every fact.
- Keep the length close to the English (titles that sit on one line must stay
  short: home section titles, hall names, nav labels, buttons).
- Follow docs/rules/content.md (editorial standards) where it applies.
- Never mention the MAX messenger, Yandex Browser.

## Spanish (es-ES, Spain)

- Address the reader with **tú** (modern Spanish marketing for founders and
  small businesses). The studio speaks as **nosotros**; the About/founder
  paragraphs that are first person in English stay first person (yo).
- Spain Spanish: "web", "ordenador", "móvil", "presupuesto", "autónoma",
  "IVA". Not Latin-American forms.
- Money is formatted by code, do not type prices. Where a sentence mentions
  an amount, write it Spanish-style: `1500 €`, `350 €`.

Glossary (use exactly):
| English | Spanish |
|---|---|
| Landing pages / landing page | Landing pages / landing page |
| Websites | Webs (nav, hall, tab) · sitio web in running text |
| Web apps | Aplicaciones web |
| Animations | Animaciones |
| Automations | Automatizaciones |
| Basic / Plus / Premium (packages) | Básico / Plus / Premium |
| Hall 01 | Sala 01 |
| Exhibit (museum label) | Pieza |
| incl. VAT | IVA incl. |
| Get started (package button) | Lo quiero |
| Contact (nav button) | Contacto |
| Work (nav) | Proyectos |
| Services | Servicios |
| Guides | Guías |
| About | Estudio |
| Privacy Notice | Política de privacidad |
| Cookie Policy | Política de cookies |
| Legal Notice | Aviso legal |
| Terms of Service | Condiciones del servicio |
| Price until 31 December | Precio hasta el 31 de diciembre |
| GDPR | RGPD |
| Home (breadcrumb) | Inicio |

## Russian (for Russian speakers abroad, prices in EUR)

- Most Russian copy already exists on ludvik4.ru, in this repo:
  `src/features/site/content.ts` (the `ru` block), `src/features/site/pricing-draft.ts`
  and `pricing-catalog.ts` (`ruPricingCatalog`), `src/features/site/about-ru.tsx`,
  `src/features/site/legal-ru.tsx`, `src/features/site/mascot-reply.tsx` (`RU_COPY`),
  `src/features/lead/lead-form.tsx` (`RU_LEAD_LABELS`). **Reuse its wording
  wherever the meaning matches the English page** — the owner approved it.
  Where the English (.dev) differs (prices, EUR, Spain, packages, VAT, GDPR,
  EU hosting, Valencia, legal facts), the English .dev version wins and you
  write the Russian for it.
- Remove everything Russia-specific: 152-ФЗ, Роскомнадзор, рубли/₽,
  российский хостинг, 1С, Битрикс, VK, Авито, Яндекс (Метрика, Директ…),
  самозанятость/НПД, «договор по законам РФ». The studio is in Spain.
- «вы» lowercase; the studio is «мы»; first-person founder paragraphs stay
  «я». Typography: «ёлочки», em dash —, non-breaking where the RU site does.
- Amounts in running text: `1 500 €`, `350 €`.

Glossary (use exactly; check it against the ru block — prefer the ru wording
when it already exists for the same thing):
| English | Russian |
|---|---|
| Landing pages | Лендинги |
| Websites | Сайты |
| Web apps | Веб-приложения |
| Animations | Анимации |
| Automations | Автоматизации |
| Basic / Plus / Premium | the names ludvik4.ru uses (pricing-draft.ts) |
| Hall 01 | Зал 01 |
| Exhibit | Экспонат |
| incl. VAT | с НДС |
| Get started | Заказать |
| Contact (nav button) | as the ru block's nav.cta |
| Work / Services / Guides / About | Работы / Услуги / Гайды / О студии |
| Privacy Notice | Политика конфиденциальности |
| Cookie Policy | Политика cookies |
| Legal Notice | Правовая информация |
| Terms of Service | Условия оказания услуг |
| VAT (Spanish) | НДС (IVA) |
| GDPR | GDPR |
| Home (breadcrumb) | Главная |

## Links

Write internal links as the ENGLISH paths (`/services/web-apps`, `/contact`,
`/#work`). The code adds `/es` or `/ru` itself (src/features/site/localize.ts).
Exceptions are stated in your task. External URLs stay as they are.

## How to work

- Edit ONLY the files your task names. Do not commit. Do not run git
  commands that change state.
- Write the file progressively (section by section) so partial work survives
  if you are interrupted.
- When done: `npx prettier --write <your files>`, then `npx tsc --noEmit -p .`
  and `pnpm vitest run src/features/site` must pass (other agents edit other
  files in parallel; if a failure is clearly in someone else's file, say so
  and move on).
- Final report: files written, any term you were unsure about, any English
  source sentence you think is wrong or unclear (do not "fix" facts yourself).
