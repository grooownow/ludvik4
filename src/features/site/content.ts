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
export type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
  /** An internal page that opens in a new tab (the legal documents). */
  newTab?: boolean;
};
export type NavLink = { href: string; label: string };

/** Copy of the exhibition home (docs/specs/immersive-home.md). Two-part titles
 *  are `[plain, accent]`: the accent half renders in the brand pink. */
export type HallExhibit =
  "browser" | "landing" | "app" | "gears" | "widget" | "motion" | "question";

export type HomeContent = {
  /** Museum label next to the mascot; its number comes from mascotExhibitNumber(). */
  exhibit: { eyebrow: string; name: string; lines: readonly string[] };
  collection: {
    eyebrow: string;
    title: [string, string];
    halls: {
      index: string;
      name: string;
      line: string;
      /** The fine-line plan drawn in the card (hall-plans.tsx). */
      exhibit: HallExhibit;
      /** A contact button in the card ("Something else?" only). */
      cta?: string;
      /** The whole card opens this page — the service's tab (RU). */
      href?: string;
    }[];
  };
  steps: { eyebrow: string; title: [string, string]; items: Step[] };
  work: { eyebrow: string; title: [string, string] };
  about: {
    eyebrow: string;
    title: [string, string];
    /** Paragraphs, in order. */
    body: string[];
    /** Alt text of the curator portrait (public/about/curator-portrait.webp). */
    photoAlt: string;
    linkLabel: string;
  };
  closing: { eyebrow: string; title: string; cta: string };
  /** Footer, left: "© Ludvik4 · <current year> · <reach>". */
  footerReach: string;
};

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
  nav: {
    cta: string;
    links?: NavLink[];
    /** Short category line centred in the header ("what is this site"). */
    tagline?: string;
  };
  /** Full-bleed brand intro above the hero (pre-rendered wordmark art). */
  intro: {
    tagline: string;
    services: string;
    /** The wordmark lives in the image, so its alt carries the brand name. */
    imageAlt: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    /** Desktop line breaks of `title` (joined with spaces they equal it). */
    titleLines?: readonly string[];
    lead: string;
    cta: string;
    illustration: boolean;
    illustrationAlt: string;
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
  /** Visually hidden page H1 on the exhibition home (the stage has no headline). */
  h1: string;
  home: HomeContent;
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
    tagline: "Студия веб-разработки",
    cta: "Контакты",
    links: [
      { href: "/#work", label: "Работы" },
      { href: "/uslugi", label: "Услуги" },
      { href: "/about", label: "О студии" },
    ],
  },
  intro: {
    tagline: "Продуктовая студия · Веб-разработка под ключ",
    services: "Сайты · Автоматизация процессов · Веб-приложения",
    imageAlt: "Ludvik4",
  },
  hero: {
    eyebrow: "Ludvik4",
    title: "Сайты, автоматизация и веб-приложения — от задачи до запуска",
    titleLines: [
      "Сайты, автоматизация",
      "и веб-приложения",
      "— от задачи до запуска",
    ],
    lead: "Проектирование и запуск цифровых продуктов для малого бизнеса и основателей: понятный первый релиз, фиксированный состав работ и одна точка ответственности",
    cta: "Обсудить задачу",
    illustration: true,
    illustrationAlt:
      "Желейный робот из соединённых блоков, как цепочка автоматизации",
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
          "шаблоны всех юридических текстов, которые нужны сайту: политика конфиденциальности, согласия, уведомление о cookies — вы проверяете и дорабатываете их под себя",
        ],
        separate: [
          "глубокое маркетинговое исследование и нейминг",
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
          "шаблоны всех юридических текстов, которые нужны сервису: политика конфиденциальности, согласия, уведомление о cookies — вы проверяете и дорабатываете их под себя",
        ],
        separate: [
          "развитие продукта и поддержка после гарантии",
          "комиссии платёжных систем",
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
      { title: "Лендинг", price: "от 20 000 ₽" },
      { title: "Сайт", price: "от 35 000 ₽" },
      { title: "Анимация для сайта", price: "от 10 000 ₽" },
      { title: "Автоматизация бизнес-процессов", price: "от 35 000 ₽" },
      { title: "Веб-приложение", price: "от 150 000 ₽" },
    ],
  },
  faq: true,
  about: {
    eyebrow: "Кто стоит за Ludvik4",
    body: "Ludvik4 — студия разработки цифровых продуктов. Мы ведём каждый проект от постановки задачи до запуска, и на всех этапах у вас одна точка ответственности. Когда задаче нужны дополнительные компетенции, подключаем проверенных профильных специалистов.",
  },
  h1: "Сайты, автоматизация и веб-приложения — от задачи до запуска",
  // Draft Russian adaptation of the approved EN copy — awaits the owner's OK.
  home: {
    exhibit: {
      eyebrow: "Экспонат",
      name: "Ludvik",
      lines: [
        "Анимированный маскот студии.",
        "Живая WebGL-сцена на чистом коде.",
        "Откликается на клик, перетаскивание и свайп по тачпаду.",
      ],
    },
    collection: {
      eyebrow: "Коллекция · Что мы делаем",
      title: ["Всё, что работает в браузере, —", "сделаем."],
      halls: [
        {
          index: "Зал 01",
          name: "Лендинги",
          line: "одно предложение, одно действие",
          exhibit: "landing",
          href: "/uslugi/lendingi",
        },
        {
          index: "Зал 02",
          name: "Сайты",
          line: "для продуктов, студий, событий",
          exhibit: "browser",
          href: "/uslugi/razrabotka-sajtov",
        },
        {
          index: "Зал 03",
          name: "Веб-приложения",
          line: "аккаунты, данные, оплаты, AI",
          exhibit: "app",
          href: "/uslugi/veb-prilozheniya",
        },
        {
          index: "Зал 04",
          name: "Анимации",
          line: "живые герои и интерактив — как Людвик",
          exhibit: "motion",
          href: "/uslugi/animatsiya-dlya-sajta",
        },
        {
          index: "Зал 05",
          name: "Автоматизации",
          line: "рутина на автомате",
          exhibit: "gears",
          href: "/uslugi/avtomatizatsii",
        },
        {
          index: "Зал 06",
          name: "Что-то ещё?",
          line: "виджеты, интеграции — спросите, скорее всего, это возможно",
          exhibit: "question",
          cta: "Расскажите идею",
        },
      ],
    },
    steps: {
      eyebrow: "Как это работает",
      title: ["Три шага,", "всё прозрачно."],
      items: [
        {
          n: "01",
          title: "Обсуждаем",
          body: "Разбираем задачу и ваши материалы, фиксируем объём, сроки и цену.",
        },
        {
          n: "02",
          title: "Делаем и показываем",
          body: "Сначала показываем прототип или черновик, собираем ваши правки и дорабатываем до готовой версии.",
        },
        {
          n: "03",
          title: "Запускаем",
          body: "Публикуем, передаём код и доступы. Дальше — поддержка и развитие, если нужно.",
        },
      ],
    },
    work: {
      eyebrow: "Избранные работы · Открытые экспонаты",
      title: ["Работы, которые", "можно посмотреть вживую."],
    },
    about: {
      eyebrow: "О студии",
      title: ["Вы ставите задачу —", "мы доводим её до запуска."],
      body: [
        "Я Екатерина Пустовая — основательница студии Ludvik4, full‑stack developer с опытом в UX/UI. Больше 8 лет разрабатываю веб-приложения разного масштаба и знаю, как сделать продукт качественным, масштабируемым и по-настоящему решающим задачи бизнеса.",
        "Студия работает онлайн с клиентами по всему миру. Берём проект под ключ: от идеи до работающего запуска — дизайн, разработка и всё, что нужно продукту. Вы работаете напрямую со мной, а я собираю под задачу всю нужную экспертизу.",
      ],
      photoAlt:
        "Портрет автора Ludvik4: тёмное худи, улыбка и взгляд вверх на розовом фоне",
      linkLabel: "Подробнее о студии",
    },
    closing: {
      eyebrow: "Ваш экспонат — следующий?",
      title: "Есть идея?",
      cta: "Обсудить проект",
    },
    footerReach: "Работаем по всему миру",
  },
  contact: {
    eyebrow: "Контакт",
    title: "Расскажите о задаче",
    body: "Оставьте контакт и пару слов о задаче — ответим в течение рабочего дня. Удобнее написать самим? Почта и Telegram ниже.",
    telegramText: "Напишите в Telegram → t.me/ludvik4work",
  },
  footer: {
    links: [
      // The menu lives in the header; the footer keeps only what it lacks.
      {
        href: "/politika-konfidentsialnosti",
        label: "Политика конфиденциальности",
        external: false,
        newTab: true,
      },
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
    cta: "Contact",
    links: [
      { href: "/#work", label: "Work" },
      { href: "/#collection", label: "Services" },
      { href: "/guides", label: "Guides" },
      { href: "/about", label: "About" },
    ],
  },
  intro: {
    tagline: "Founder-led product studio · Europe · Worldwide",
    services: "Websites · Workflow automation · Web apps",
    imageAlt: "Ludvik4",
  },
  hero: {
    eyebrow: "Founder-led product studio · Europe · Worldwide",
    title: "Websites, workflow automation, and web apps — built for launch",
    titleLines: [
      "Websites, workflow",
      "automation, and web apps",
      "— built for launch",
    ],
    lead: "I turn a business problem or product idea into a focused digital product: clear scope, direct communication, production-ready delivery, and one point of accountability.",
    cta: "Discuss your project",
    illustration: true,
    illustrationAlt: "Jelly robot made of connected workflow blocks",
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
  h1: "Websites, workflow automation, and web apps — built for launch",
  home: {
    exhibit: {
      eyebrow: "Exhibit",
      name: "Ludvik",
      lines: ["Pure code, WebGL, zero polygons.", "Handle with curiosity."],
    },
    collection: {
      eyebrow: "The collection · What I build",
      title: ["If it lives in a browser,", "I can build it."],
      halls: [
        {
          index: "Hall 01",
          name: "Websites",
          line: "for products, studios, events",
          exhibit: "browser",
        },
        {
          index: "Hall 02",
          name: "Landing pages",
          line: "one offer, one action",
          exhibit: "landing",
        },
        {
          index: "Hall 03",
          name: "Web apps",
          line: "accounts, data, payments, AI",
          exhibit: "app",
        },
        {
          index: "Hall 04",
          name: "Automations",
          line: "the boring parts, handled",
          exhibit: "gears",
        },
        {
          index: "Hall 05",
          name: "Widgets & tools",
          line: "small, sharp, embeddable",
          exhibit: "widget",
        },
        {
          index: "Hall 06",
          name: "Something else?",
          line: "ask — it’s probably possible",
          exhibit: "question",
          cta: "Tell me the idea",
        },
      ],
    },
    steps: {
      eyebrow: "How it works",
      title: ["Three steps,", "no fog."],
      items: [
        {
          n: "01",
          title: "Talk",
          body: "We shape the problem and agree on scope and price.",
        },
        {
          n: "02",
          title: "Build",
          body: "The first useful version, shown as it grows.",
        },
        {
          n: "03",
          title: "Launch",
          body: "Live, handed over with the code — then it evolves.",
        },
      ],
    },
    work: {
      eyebrow: "Selected work · Public exhibits",
      title: ["Work you can", "inspect."],
    },
    about: {
      eyebrow: "About",
      title: ["One person,", "end to end."],
      body: [
        "I'm Kate Pustovaya — founder of Ludvik4 and a full‑stack developer with a background in UX/UI. For 8+ years I've been building web applications of every size, and I know what it takes to make a product solid, scalable and genuinely useful to the business behind it.",
        "The studio is based in Spain and works with clients worldwide. We take a project end to end: from an idea to a working launch — design, development and whatever else the product needs. You work with me directly, and I bring together the expertise the job calls for.",
      ],
      photoAlt:
        "Portrait of the Ludvik4 founder in a dark hoodie, smiling and looking up against pink",
      linkLabel: "More about me",
    },
    closing: {
      eyebrow: "Your exhibit next?",
      title: "Have something in mind?",
      cta: "Discuss a project",
    },
    footerReach: "Worldwide",
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
      // The menu lives in the header; the footer keeps only what it lacks.
      { href: "/privacy", label: "Privacy", external: false, newTab: true },
      { href: TELEGRAM_URL, label: "Telegram", external: true },
    ],
  },
};

const CONTENT: Record<Market, MarketContent> = { ru, en };

/** Pure market-content accessor — the unit-test entry point for both markets. */
export function getMarketContent(market: Market): MarketContent {
  return CONTENT[market];
}

/** The mascot's exhibit number: it is the next exhibit after the work shown. */
// Ludvik4 the mascot is always exhibit Nº 04 (owner, 2026-10-23); the work
// exhibits are numbered around it — 01, 02, 03, 05… — so no two share one.
const MASCOT_EXHIBIT = 4;

function exhibitNumber(n: number, lang: "ru" | "en"): string {
  const padded = String(n).padStart(2, "0");
  return lang === "ru" ? `№ ${padded}` : `Nº ${padded}`;
}

export function mascotExhibitNumber(lang: "ru" | "en"): string {
  return exhibitNumber(MASCOT_EXHIBIT, lang);
}

/** Number of the work exhibit at gallery position `index` (0-based). */
export function workExhibitNumber(index: number, lang: "ru" | "en"): string {
  const n = index + 1;
  return exhibitNumber(n < MASCOT_EXHIBIT ? n : n + 1, lang);
}
