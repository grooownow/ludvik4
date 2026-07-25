import type { LeadFormLabels } from "@/features/lead";

// Typed marketing content, one object per market. The shared section components
// render from these objects; the two home compositions (home-ru / home-en) only
// choose which sections to show and in what order. Copy and positioning are
// approved in docs/agent-briefs/01-rebuild-market-sites.ru.md — do not widen the
// promises or re-introduce a "permanent team" claim.

export type Market = "ru" | "en";

export const TELEGRAM_URL = "https://t.me/ludvik4work";

export type ServiceCard = { module: string; title: string; body: string };
export type Step = { n: string; title: string; body: string };
export type ScopeItem = {
  title: string;
  result: string;
  steps: string[];
  boundaries: string[];
  separate: string[];
};
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
  /** Open accordion of per-service scope (no public hour estimates). */
  scopes?: {
    eyebrow: string;
    title: string;
    lead: string;
    labels: {
      steps: string;
      boundaries: string;
      separate: string;
    };
    items: ScopeItem[];
  };
  /** Three-step delivery process. */
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
      privacyNotice: {
        text: string;
        linkLabel: string;
        href: "/privacy";
      };
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
  title: "Ludvik4 — разработка цифровых продуктов",
  shareTitle: "Ludvik4 — разработка цифровых продуктов",
  description:
    "Сайты, автоматизации и веб-приложения с законченным пользовательским сценарием — от постановки задачи до запуска.",
  keywords: [
    "разработка сайтов",
    "лендинг",
    "автоматизация бизнес-процессов",
    "MVP",
    "веб-приложение",
    "SaaS",
    "разработка цифровых продуктов",
    "AI-разработка",
    "Ludvik4",
  ],
  nav: { cta: "Обсудить задачу", blogLabel: "Блог" },
  hero: {
    eyebrow: "Ludvik4",
    title: "Цифровые продукты — от идеи до запуска",
    lead: "Сайты, автоматизации и веб-приложения с законченным пользовательским сценарием — от постановки задачи до запуска",
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
        body: "Контролируемые workflow для повторяющихся ручных процессов: обработка заявок, извлечение данных из документов, подготовка контента на согласование, регулярные отчёты — на скриптах, интеграциях, ботах и AI",
      },
      {
        module: "Module / App",
        title: "Веб-приложение или компактный SaaS",
        body: "Приложение под одну ключевую задачу с понятным, законченным сценарием пользователя. При необходимости — аккаунты, база, файлы, уведомления, AI или оплата",
      },
    ],
  },
  scopes: {
    eyebrow: "Состав работ",
    title: "Что входит в работу",
    lead: "Цена зависит от объёма. Ниже — что входит в каждую услугу: результат, этапы и границы. Точную оценку и фиксированную цену называем после разбора задачи.",
    labels: {
      steps: "Этапы",
      boundaries: "Базовые границы",
      separate: "Оценивается отдельно",
    },
    items: [
      {
        title: "Сайт или лендинг",
        result:
          "Опубликованный адаптивный сайт под одно предложение и одно целевое действие — от лендинга до небольшого многостраничного сайта.",
        steps: [
          "Разбор задачи и требований",
          "Структура и тексты",
          "Визуальное направление",
          "Адаптивная разработка",
          "Тестирование",
          "Публикация и передача",
        ],
        boundaries: [
          "один язык и один визуальный концепт",
          "лендинг или сайт примерно до 5 типов страниц",
          "до двух собранных раундов правок",
          "гарантийные исправления после запуска",
        ],
        separate: [
          "глубокое маркетинговое исследование и нейминг",
          "юридические тексты (предоставляет клиент)",
          "CMS, несколько языков, сложные интеграции",
          "платные шрифты, фото, домен и хостинг",
        ],
      },
      {
        title: "Автоматизация одного процесса",
        result:
          "Работающий и контролируемый процесс — с логами, проверками и ручными подтверждениями там, где цена ошибки высока, а не просто отдельный скрипт.",
        steps: [
          "Разбор текущего процесса",
          "Проектирование",
          "Прототип на реальных примерах",
          "Разработка и интеграции",
          "Тестирование и надёжность",
          "Запуск и передача",
        ],
        boundaries: [
          "один процесс с чёткими началом и результатом",
          "ограниченное число систем и интеграций",
          "доступы, тестовые данные и описание — от клиента",
          "гарантийные исправления после запуска",
        ],
        separate: [
          "стоимость API, моделей, платформ и серверов",
          "изменение регламентов и обучение большого числа сотрудников",
          "постоянное ручное сопровождение процесса",
          "отдельный этап исследования, если процесс ещё не описан",
        ],
      },
      {
        title: "Веб-приложение или компактный SaaS",
        result:
          "Первая рабочая версия продукта вокруг одной ключевой задачи и одного законченного пользовательского сценария.",
        steps: [
          "Определение первого релиза",
          "Проектирование продукта",
          "UX/UI",
          "Разработка (frontend, backend, база)",
          "Тестирование",
          "Запуск",
          "Стабилизация",
        ],
        boundaries: [
          "одна продуктовая задача и один основной сценарий",
          "ограниченное число ролей, сущностей и интеграций",
          "одна web-платформа, без нативных iOS и Android",
          "гарантийные исправления после запуска",
        ],
        separate: [
          "развитие продукта и поддержка после гарантии",
          "юридические документы и комиссии платёжных систем",
          "инфраструктура и использование AI/API",
          "оценка следующих итераций",
        ],
      },
    ],
  },
  howItWorks: {
    eyebrow: "Как это работает",
    lead: "От идеи или проблемы — к понятному решению и рабочему продукту",
    steps: [
      {
        n: "01",
        title: "Разбор задачи",
        body: "Определяем, какую проблему нужно решить, для кого создаётся продукт и какой результат будет считаться успешным.",
      },
      {
        n: "02",
        title: "Первый рабочий релиз",
        body: "В первую версию входит ключевой пользовательский сценарий без лишней функциональности. После запуска продукт можно развивать по обратной связи.",
      },
      {
        n: "03",
        title: "Запуск и дальнейшая работа",
        body: "Готовый продукт публикуется или передаётся заказчику. Дальше возможны развитие, поддержка или самостоятельная работа с проектом.",
      },
    ],
  },
  pricing: {
    eyebrow: "Ориентиры по цене",
    title: "Сколько это стоит",
    intro:
      "Точная стоимость зависит от задачи — вот ориентиры, чтобы понять порядок. Итоговую цену называем после разбора и оценки.",
    rows: [
      { title: "Сайт или лендинг", price: "от 40 000 ₽" },
      { title: "Автоматизация бизнес-процессов", price: "от 40 000 ₽" },
      { title: "Веб-приложение или компактный SaaS", price: "от 110 000 ₽" },
    ],
  },
  faq: true,
  about: {
    eyebrow: "Кто стоит за Ludvik4",
    body: "Ludvik4 — независимый проект по разработке цифровых продуктов. Я веду каждый проект от постановки задачи до запуска и остаюсь основной точкой контакта на всех этапах. Когда задаче нужны дополнительные компетенции, подключаю проверенных профильных специалистов.",
  },
  contact: {
    eyebrow: "Контакт",
    title: "Расскажите о задаче",
    body: "Опишите задачу в Telegram — там можно обсудить контекст и определить следующий шаг",
    telegramText: "Напишите в Telegram → t.me/ludvik4work",
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
    illustration: true,
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
  howItWorks: {
    eyebrow: "How it works",
    lead: "From an idea or operational problem to a clear solution and a working product",
    steps: [
      {
        n: "01",
        title: "Define the problem",
        body: "The project starts by clarifying the problem, who the product is for, and what a successful outcome looks like.",
      },
      {
        n: "02",
        title: "Build the first useful release",
        body: "The first version focuses on the core user journey without speculative features. It can evolve after launch based on real feedback.",
      },
      {
        n: "03",
        title: "Launch and move forward",
        body: "The product is deployed or handed over with its source code. From there, it can be extended, supported, or run independently.",
      },
    ],
  },
  scopes: {
    eyebrow: "Project scope",
    title: "What's included",
    lead: "Each engagement is scoped around a clear outcome. The breakdown below shows the standard stages, baseline boundaries, and items quoted separately. After a short discovery, I provide a fixed scope and price.",
    labels: {
      steps: "Stages",
      boundaries: "Baseline scope",
      separate: "Quoted separately",
    },
    items: [
      {
        title: "Website or landing page",
        result:
          "A responsive, production-ready site built around one offer and one primary action — from a landing page to a focused multi-page website.",
        steps: [
          "Discovery and requirements",
          "Structure and copy",
          "Visual direction",
          "Responsive development",
          "Testing",
          "Launch and handover",
        ],
        boundaries: [
          "one language and one visual direction",
          "a landing page or up to about five page types",
          "up to two consolidated revision rounds",
          "post-launch warranty fixes",
        ],
        separate: [
          "in-depth market research and naming",
          "legal copy supplied or approved by the client",
          "CMS, additional languages, and complex integrations",
          "paid fonts, assets, domain, and hosting",
        ],
      },
      {
        title: "Business workflow automation",
        result:
          "A controlled, working process with logs, checks, and human approval where errors carry real consequences — not just an isolated script.",
        steps: [
          "Review the current process",
          "Design the workflow",
          "Prototype with real examples",
          "Build and integrate",
          "Test reliability and edge cases",
          "Launch and handover",
        ],
        boundaries: [
          "one process with a clear start and outcome",
          "a limited number of systems and integrations",
          "access, sample data, and process details supplied by the client",
          "post-launch warranty fixes",
        ],
        separate: [
          "API, model, platform, and server costs",
          "company-wide process redesign and large-team training",
          "ongoing manual operation of the workflow",
          "a discovery phase when the process is not yet defined",
        ],
      },
      {
        title: "Web app or compact SaaS",
        result:
          "The first production-ready version of a product built around one core task and one complete user journey.",
        steps: [
          "Define the first release",
          "Product and data design",
          "UX/UI",
          "Frontend, backend, and database",
          "Testing",
          "Launch",
          "Stabilisation",
        ],
        boundaries: [
          "one product problem and one primary user journey",
          "a limited number of roles, entities, and integrations",
          "one web platform, without native iOS or Android apps",
          "post-launch warranty fixes",
        ],
        separate: [
          "future product iterations and ongoing support",
          "legal documents and payment-provider fees",
          "infrastructure and AI/API usage",
          "scoping and delivery of later releases",
        ],
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
    telegramText: "Or message me on Telegram → t.me/ludvik4work",
    form: {
      labels: EN_LEAD_LABELS,
      privacyNotice: {
        text: "Ludvik4 uses your details to reply to your enquiry and take requested pre-contractual steps. Form submissions are delivered by email through Resend, which may process data outside the EEA.",
        linkLabel: "Read the Privacy Notice.",
        href: "/privacy",
      },
    },
  },
  footer: {
    links: [
      { href: "/privacy", label: "Privacy", external: false },
      { href: TELEGRAM_URL, label: "Telegram", external: true },
    ],
  },
};

const CONTENT: Record<Market, MarketContent> = { ru, en };

/** Pure market-content accessor — the unit-test entry point for both markets. */
export function getMarketContent(market: Market): MarketContent {
  return CONTENT[market];
}
