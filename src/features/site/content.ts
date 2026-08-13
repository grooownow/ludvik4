import type { LeadFormLabels } from "@/features/lead";

// Typed marketing content, one object per market. The shared section components
// render from these objects; the two home compositions (home-ru / home-en) only
// choose which sections to show and in what order. Copy and positioning are
// approved in docs/agent-briefs/01-rebuild-market-sites.ru.md — do not widen the
// promises or re-introduce a "permanent team" claim.

export type Market = "ru" | "en";

export const TELEGRAM_URL = "https://t.me/ludvik4work";

export type ServiceCard = {
  module: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
};
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
export type NavLink = { href: string; label: string };

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
  nav: { cta: string; links?: NavLink[] };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    cta: string;
    illustration: boolean;
  };
  services: { eyebrow: string; title?: string; items: ServiceCard[] };
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
  howItWorks?: {
    eyebrow: string;
    title?: string;
    lead: string;
    steps: Step[];
  };
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
  title: "Разработка сайтов, автоматизаций и веб-приложений — Ludvik4",
  shareTitle: "Ludvik4 — сайты, автоматизация и веб-приложения",
  description:
    "Сайты, автоматизации и веб-приложения для малого бизнеса и основателей: разработка лендингов, бизнес-процессов и MVP — от задачи до запуска.",
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
  nav: {
    cta: "Обсудить задачу",
    links: [
      { href: "/#services", label: "Услуги" },
      { href: "/cases", label: "Кейсы" },
      { href: "/blog", label: "Блог" },
    ],
  },
  hero: {
    eyebrow: "Ludvik4",
    title: "Сайты, автоматизация и веб-приложения — от задачи до запуска",
    lead: "Проектирование и запуск цифровых продуктов для малого бизнеса и основателей: понятный первый релиз, фиксированный состав работ и одна точка ответственности",
    cta: "Обсудить задачу",
    illustration: true,
  },
  services: {
    eyebrow: "Что делаем",
    title: "Сайты, автоматизация и веб-приложения",
    items: [
      {
        module: "Module / Site",
        title: "Сайт или лендинг",
        body: "Опубликованный адаптивный сайт для продукта, услуги, события или небольшого бизнеса с одним понятным целевым действием: структура, интерфейс, базовое SEO и аналитика",
        href: "/uslugi/razrabotka-lendinga",
        linkLabel: "Подробнее о разработке лендинга",
      },
      {
        module: "Module / Automation",
        title: "Автоматизация бизнес-процессов",
        body: "Контролируемые workflow для повторяющихся ручных процессов: обработка заявок, извлечение данных из документов, подготовка контента на согласование, регулярные отчёты — на скриптах, интеграциях, ботах и AI",
        href: "/uslugi/avtomatizatsiya-biznes-processov",
        linkLabel: "Подробнее об автоматизации",
      },
      {
        module: "Module / App",
        title: "Веб-приложение или компактный SaaS",
        body: "Приложение под одну ключевую задачу с понятным, законченным сценарием пользователя. При необходимости — аккаунты, база, файлы, уведомления, AI или оплата",
        href: "/uslugi/razrabotka-mvp",
        linkLabel: "Подробнее о разработке MVP",
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
    title: "От задачи до рабочего продукта",
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
    body: "Ludvik4 — независимый проект по разработке цифровых продуктов. Я веду каждый проект от постановки задачи до запуска и остаюсь единой точкой ответственности на всех этапах. Когда задаче нужны дополнительные компетенции, подключаю проверенных профильных специалистов.",
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
  title: "Custom Websites, Workflow Automation & Web Apps — Ludvik4",
  shareTitle: "Ludvik4 — founder-led web product studio",
  description:
    "A Europe-based, founder-led web product studio designing and building custom websites, business workflow automations, MVPs, and web apps for clients worldwide.",
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
  nav: {
    cta: "Discuss a project",
    links: [
      { href: "/#services", label: "Services" },
      { href: "/work", label: "Work" },
      { href: "/blog", label: "Articles" },
      { href: "/guides", label: "Guides" },
      { href: "/about", label: "About" },
    ],
  },
  hero: {
    eyebrow: "Founder-led product studio · Europe · Worldwide",
    title: "Websites, workflow automation, and web apps — built for launch",
    lead: "I turn a business problem or product idea into a focused digital product: clear scope, direct communication, production-ready delivery, and one point of accountability.",
    cta: "Discuss your project",
    illustration: true,
  },
  services: {
    eyebrow: "What I do",
    title: "Website, automation, and web app development",
    items: [
      {
        module: "Module / Site",
        title: "Website or landing page",
        body: "A responsive website for a product, service, event, or small business — from offer structure and copy to technical SEO, analytics, and launch.",
        href: "/services/websites",
        linkLabel: "Explore website development",
      },
      {
        module: "Module / Automation",
        title: "Business workflow automation",
        body: "A repetitive manual process rebuilt as a controlled workflow with integrations, validation, logs, and human approval where mistakes carry a cost.",
        href: "/services/workflow-automation",
        linkLabel: "Explore workflow automation",
      },
      {
        module: "Module / App",
        title: "Web app or compact SaaS",
        body: "A production-ready first release around one important task and one complete user journey — with accounts, data, AI, or payments when the product needs them.",
        href: "/services/mvp-development",
        linkLabel: "Explore MVP development",
      },
    ],
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "From an unclear problem to a working release",
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
    eyebrow: "Engineering approach",
    title: "AI-assisted delivery, with the quality controls left on",
    body: "AI supports research, implementation, testing, and review inside a documented engineering process. Requirements, version control, automated tests, and quality gates remain explicit — the same discipline behind my open-source qa-pilot project.",
  },
  about: {
    eyebrow: "Founder-led",
    body: "Ludvik4 is an independent web product studio based in Europe and working with clients worldwide. I lead each engagement from problem definition through launch, remain the single point of accountability, and involve trusted specialists only when the agreed scope needs them.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell me what needs to work better",
    body: "Describe the problem, the current situation, and the outcome you need. I will review it and suggest a sensible first step.",
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
      { href: "/services/websites", label: "Services", external: false },
      { href: "/work", label: "Work", external: false },
      { href: "/blog", label: "Articles", external: false },
      { href: "/guides", label: "Guides", external: false },
      { href: "/about", label: "About", external: false },
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
