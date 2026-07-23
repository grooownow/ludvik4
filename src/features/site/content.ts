import type { LeadFormLabels } from "@/features/lead";

// Typed marketing content, one object per market. The shared section components
// render from these objects; the two home compositions (home-ru / home-en) only
// choose which sections to show and in what order. Copy and positioning are
// approved in docs/agent-briefs/01-rebuild-market-sites.ru.md — do not widen the
// promises or re-introduce a "permanent team" claim.

export type Market = "ru" | "en";

export const TELEGRAM_URL = "https://t.me/ludvik4";

export type ServiceCard = { module: string; title: string; body: string };
export type Step = { n: string; title: string; body: string };
export type PriceRow = { title: string; price: string; note?: string };
export type FooterLink = { href: string; label: string; external?: boolean };

export type MarketContent = {
  market: Market;
  /** `<html lang>` and JSON-LD inLanguage. */
  lang: "ru" | "en";
  ogLocale: string;
  /** SEO <title>. */
  title: string;
  /** Short share-preview title (og/twitter). */
  shareTitle: string;
  description: string;
  keywords: string[];
  nav: { cta: string; blogLabel?: string };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    illustration: boolean;
  };
  services: { eyebrow: string; items: ServiceCard[] };
  /** RU "how it works". */
  howItWorks?: { eyebrow: string; lead: string; steps: Step[] };
  /** RU pricing block. */
  pricing?: {
    eyebrow: string;
    title: string;
    intro: string;
    rows: PriceRow[];
  };
  /** RU FAQ accordion (shared FaqSection). */
  faq?: boolean;
  /** EN AI-assisted-development block. */
  aiBlock?: { eyebrow: string; title: string; body: string };
  /** RU studio/model block. */
  about?: { eyebrow: string; body: string };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    telegramText: string;
    /** RU has no form; EN keeps it. */
    form?: {
      labels?: LeadFormLabels;
      /** Placeholder until an approved privacy notice exists (release blocker). */
      privacyNotice: string;
    };
  };
  footer: { links: FooterLink[] };
};

const EN_LEAD_LABELS: LeadFormLabels = {
  nameLabel: "Name",
  nameOptional: "optional",
  messageLabel: "Your task",
  messagePlaceholder: "Describe what you need…",
  contactLabel: "How to reach you",
  contactPlaceholder: "email or a messenger link / phone",
  submit: "Send request",
  submitting: "Sending…",
  success: "Request sent — I'll get back to you soon. Thanks!",
};

const ru: MarketContent = {
  market: "ru",
  lang: "ru",
  ogLocale: "ru_RU",
  title: "Ludvik4 — студия цифровых продуктов",
  shareTitle: "Ludvik4 — студия цифровых продуктов",
  description:
    "Студия цифровых продуктов: проектируем и запускаем сайты, автоматизации и веб-приложения с законченным пользовательским сценарием.",
  keywords: [
    "разработка сайтов",
    "лендинг",
    "автоматизация бизнес-процессов",
    "MVP",
    "веб-приложение",
    "SaaS",
    "студия цифровых продуктов",
    "AI-разработка",
    "Ludvik4",
  ],
  nav: { cta: "Обсудить задачу", blogLabel: "Блог" },
  hero: {
    eyebrow: "Ludvik4",
    title: "Цифровые продукты — от идеи до запуска",
    lead: "Проектируем и запускаем сайты, автоматизации и веб-приложения с законченным пользовательским сценарием",
    cta: "Обсудить задачу",
    illustration: true,
  },
  services: {
    eyebrow: "Что делаем",
    items: [
      {
        module: "Module / Site",
        title: "Сайт или лендинг",
        body: "Опубликованный адаптивный сайт для продукта, услуги, события или небольшого бизнеса с одним понятным целевым действием: структура, интерфейс, базовое SEO и аналитика",
      },
      {
        module: "Module / Automation",
        title: "Автоматизация бизнес-процессов",
        body: "Повторяющиеся ручные процессы переносим в контролируемые workflow: обработка заявок, извлечение данных из документов, подготовка контента на согласование, регулярные отчёты — на скриптах, интеграциях, ботах и AI",
      },
      {
        module: "Module / App",
        title: "Веб-приложение или компактный SaaS",
        body: "Приложение под одну ключевую задачу с понятным, законченным сценарием пользователя. При необходимости — аккаунты, база, файлы, уведомления, AI или оплата",
      },
    ],
  },
  howItWorks: {
    eyebrow: "Как это работает",
    lead: "Вы приходите с идеей или болью — предлагаем, как её решить",
    steps: [
      {
        n: "01",
        title: "Поможем оформить задачу",
        body: "Расскажете, что хочется или какая задача стоит, — предложим варианты и придумаем решение под вас. Задачу и результат опишем вместе.",
      },
      {
        n: "02",
        title: "Собираем ключевой сценарий",
        body: "Первая рабочая версия закрывает главную задачу и выходит быстро, дальше развиваем по обратной связи.",
      },
      {
        n: "03",
        title: "Формат под вас",
        body: "Разовый продукт, развитие или поддержка с доработками. За проектом — единая точка ответственности, профильные специалисты подключаются по необходимости.",
      },
    ],
  },
  // TODO(owner amounts): amounts pending owner decision (docs plan). Composition
  // and copy are final; only the `price` values here change once received.
  pricing: {
    eyebrow: "Ориентиры по цене",
    title: "Сколько это стоит",
    intro:
      "Точная стоимость зависит от задачи — вот ориентиры, чтобы понять порядок. Оценка бесплатно.",
    rows: [
      { title: "Сайт или лендинг", price: "от 10 000 ₽" },
      { title: "Автоматизация бизнес-процессов", price: "от 10 000 ₽" },
      { title: "Веб-приложение или компактный SaaS", price: "от 50 000 ₽" },
    ],
  },
  faq: true,
  about: {
    eyebrow: "О студии",
    body: "Ludvik4 — студия цифровых продуктов. Проектируем и запускаем сайты, автоматизации и веб-приложения с законченным пользовательским сценарием. Состав команды зависит от задачи: за проектом закреплена единая точка ответственности, а профильные специалисты подключаются по необходимости.",
  },
  contact: {
    eyebrow: "Контакт",
    title: "Расскажите, что нужно",
    body: "Опишите задачу — предложим решение и подскажем, с чего начать",
    telegramText: "Напишите в Telegram → t.me/ludvik4",
  },
  footer: {
    links: [
      { href: "/blog", label: "Блог" },
      { href: TELEGRAM_URL, label: "Telegram", external: true },
    ],
  },
};

const en: MarketContent = {
  market: "en",
  lang: "en",
  ogLocale: "en_US",
  title: "Ludvik4 — a founder-led product studio",
  shareTitle: "Ludvik4 — product studio",
  description:
    "A founder-led product studio working with clients worldwide: focused websites, business automations, and compact web applications with a complete user journey.",
  keywords: [
    "product studio",
    "web development",
    "landing page",
    "business automation",
    "MVP",
    "compact SaaS",
    "AI-assisted development",
    "Ludvik4",
  ],
  nav: { cta: "Let's talk" },
  hero: {
    eyebrow: "Ludvik4",
    title: "Digital products — from idea to launch",
    lead: "I design and launch focused websites, business automations, and compact web applications with a complete user journey.",
    cta: "Let's talk",
    illustration: false,
  },
  services: {
    eyebrow: "What I do",
    items: [
      {
        module: "Module / Site",
        title: "Website or landing page",
        body: "A published, responsive site for a product, service, event or small business with one clear call to action: structure, interface, basic SEO and analytics.",
      },
      {
        module: "Module / Automation",
        title: "Business workflow automation",
        body: "Repetitive manual processes moved into controlled workflows: intake handling, document data extraction, content prepared for review, scheduled reports — with scripts, integrations, bots and AI.",
      },
      {
        module: "Module / App",
        title: "Web app or compact SaaS",
        body: "A small app around one core task with a clear, complete user journey. When it needs it: accounts, a database, files, notifications, AI or payments.",
      },
    ],
  },
  aiBlock: {
    eyebrow: "AI-assisted development",
    title: "I make projects AI-agent-ready",
    body: "AGENTS.md, project rules, spec-driven development and the automation around them — the same discipline behind my open-source tooling, such as qa-pilot. I lead each project from definition to launch and bring in trusted specialists when the scope needs them.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell me what you need",
    body: "Describe the task — I'll suggest a solution and where to start.",
    telegramText: "Or message me on Telegram → t.me/ludvik4",
    form: {
      labels: EN_LEAD_LABELS,
      // Release blocker: no approved privacy notice exists yet. Shown as plain
      // text (no link) on purpose — see docs plan + final report.
      privacyNotice:
        "By sending this form your message and contact are delivered to me over Telegram. A full privacy notice is in preparation.",
    },
  },
  footer: {
    links: [{ href: TELEGRAM_URL, label: "Telegram", external: true }],
  },
};

const CONTENT: Record<Market, MarketContent> = { ru, en };

/** Pure market-content accessor — the unit-test entry point for both markets. */
export function getMarketContent(market: Market): MarketContent {
  return CONTENT[market];
}
