import { enContent, TELEGRAM_URL, type MarketContent } from "../../content";

// Russian copy of the ludvik4.dev storefront: the EN offer (Spain, EUR,
// worldwide) for Russian speakers abroad. Wording reuses the approved
// ludvik4.ru copy (the `ru` object in ../../content.ts) wherever the meaning
// matches; facts follow the English page.
export const ruContent: MarketContent = {
  market: "en",
  lang: "ru",
  locale: "ru",
  ogLocale: "ru_RU",
  title: "Сайты, автоматизации и веб-приложения на заказ — Ludvik4",
  shareTitle: "Ludvik4 — авторская студия веб-продуктов",
  description:
    "Авторская студия веб-продуктов из Испании: сайты на заказ, автоматизация бизнес-процессов, MVP и веб-приложения для клиентов по всему миру.",
  keywords: [
    "продуктовая студия",
    "веб-разработка",
    "лендинг",
    "автоматизация бизнеса",
    "MVP",
    "компактный SaaS",
    "AI-разработка",
    "Ludvik4",
  ],
  nav: {
    cta: "Контакты",
    links: [
      { href: "/#work", label: "Работы" },
      { href: "/services", label: "Услуги" },
      { href: "/guides", label: "Гайды" },
      { href: "/about", label: "О студии" },
    ],
  },
  // Unrendered legacy blocks of the old EN home: kept from the English copy.
  intro: enContent.intro,
  hero: enContent.hero,
  howItWorks: enContent.howItWorks,
  scopes: enContent.scopes,
  aiBlock: enContent.aiBlock,
  about: enContent.about,
  services: {
    eyebrow: "Что делаем",
    title: "Разработка сайтов, автоматизаций и веб-приложений",
    items: [
      {
        module: "Module / Site",
        title: "Сайт или лендинг",
        body: "Адаптивный сайт для продукта, услуги, события или небольшого бизнеса — от структуры предложения и текстов до технического SEO, аналитики и запуска.",
        href: "/services/websites",
        linkLabel: "Подробнее о разработке сайтов",
      },
      {
        module: "Module / Automation",
        title: "Автоматизация бизнес-процессов",
        body: "Повторяющийся ручной процесс превращаем в контролируемый workflow: интеграции, проверки, журнал действий и ручное подтверждение там, где цена ошибки высока.",
        href: "/services/workflow-automation",
        linkLabel: "Подробнее об автоматизации",
      },
      {
        module: "Module / App",
        title: "Веб-приложение или компактный SaaS",
        body: "Готовый к работе первый релиз вокруг одной ключевой задачи и одного законченного сценария пользователя — с аккаунтами, данными, AI или оплатой, если они нужны продукту.",
        href: "/services/mvp-development",
        linkLabel: "Подробнее о разработке MVP",
      },
    ],
  },
  h1: "Сайты, автоматизация и веб-приложения — от задачи до запуска",
  home: {
    exhibit: {
      eyebrow: "Экспонат",
      name: "Ludvik",
      lines: [
        "Чистый код, WebGL, ноль полигонов.",
        "Обращаться с любопытством.",
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
          href: "/services/landing-pages",
        },
        {
          index: "Зал 02",
          name: "Сайты",
          line: "для продуктов, студий, событий",
          exhibit: "browser",
          href: "/services/website-packages",
        },
        {
          index: "Зал 03",
          name: "Веб-приложения",
          line: "аккаунты, данные, оплаты, AI",
          exhibit: "app",
          href: "/services/web-apps",
        },
        {
          index: "Зал 04",
          name: "Анимации",
          line: "живые герои и интерактив — как Людвик",
          exhibit: "motion",
          href: "/services/web-animation",
        },
        {
          index: "Зал 05",
          name: "Автоматизации",
          line: "рутина на автомате",
          exhibit: "gears",
          href: "/services/automation-packages",
        },
        {
          index: "Зал 06",
          name: "Что-то ещё?",
          line: "спросите — скорее всего, это возможно",
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
          body: "Разбираем задачу, договариваемся об объёме и цене.",
        },
        {
          n: "02",
          title: "Делаем и показываем",
          body: "Собираем первую полезную версию и показываем её по ходу работы.",
        },
        {
          n: "03",
          title: "Запускаем",
          body: "Публикуем и передаём вместе с кодом. Дальше — развитие.",
        },
      ],
    },
    work: {
      eyebrow: "Избранные работы · Открытые экспонаты",
      title: ["Работы, которые", "можно посмотреть вживую."],
    },
    about: {
      eyebrow: "О студии",
      title: ["Один человек —", "от начала до конца."],
      body: [
        "Я Екатерина Пустовая — основательница студии Ludvik4, full‑stack developer с опытом в UX/UI. Больше 8 лет разрабатываю веб-приложения разного масштаба и знаю, как сделать продукт качественным, масштабируемым и по-настоящему решающим задачи бизнеса.",
        "Студия базируется в Испании и работает с клиентами по всему миру. Берём проект под ключ: от идеи до работающего запуска — дизайн, разработка и всё, что нужно продукту. Вы работаете напрямую со мной, а я собираю под задачу всю нужную экспертизу.",
      ],
      photoAlt:
        "Портрет основательницы Ludvik4: тёмное худи, улыбка и взгляд вверх на розовом фоне",
      linkLabel: "Подробнее обо мне",
    },
    closing: {
      eyebrow: "Ваш экспонат — следующий?",
      title: "Есть идея?",
      cta: "Обсудить проект",
    },
    footerReach: "Испания · весь мир",
    mascotReply: {
      close: "Скрыть подсказку",
      idle: "Меня можно потрогать! ",
      touched: "Понравилось? ",
      line: "Такого героя — или ещё круче — сделаем и для вашего сайта.",
      cta: "Хочу такую анимацию →",
      contactHref: "/contact?service=web-animation",
    },
  },
  contact: {
    eyebrow: "Контакт",
    title: "Расскажите, что должно работать лучше",
    body: "Опишите задачу, текущую ситуацию и нужный результат — посмотрим и предложим разумный первый шаг.",
    telegramText: "Или напишите в Telegram → t.me/ludvik4work",
    form: {
      // RU_LEAD_LABELS (src/features/lead/lead-form.tsx), copied: that module
      // is a client component, so its constants are not imported here.
      labels: {
        nameLabel: "Имя",
        nameOptional: "необязательно",
        messageLabel: "Задача",
        messagePlaceholder: "Опишите, что нужно сделать…",
        contactLabel: "Как с вами связаться",
        contactPlaceholder: "email или ссылка на мессенджер / телефон",
        submit: "Отправить заявку",
        submitting: "Отправляю…",
        success: "Заявка отправлена — ответим в ближайшее время. Спасибо!",
      },
      privacyNotice: {
        text: "Ludvik4 использует ваши данные, чтобы ответить на заявку и выполнить запрошенные вами преддоговорные действия. Заявки с формы приходят на почту через сервис Resend, который может обрабатывать данные за пределами Европейской экономической зоны.",
        linkLabel: "Политика конфиденциальности.",
        href: "/privacy",
      },
    },
  },
  footer: {
    links: [
      // The menu lives in the header; the footer keeps only what it lacks.
      {
        href: "/privacy",
        label: "Конфиденциальность",
        external: false,
        newTab: true,
      },
      { href: "/cookies", label: "Cookies", external: false, newTab: true },
      {
        href: "/terms-of-service",
        label: "Условия",
        external: false,
        newTab: true,
      },
      {
        href: "/legal-notice",
        label: "Правовая информация",
        external: false,
        newTab: true,
      },
      { href: TELEGRAM_URL, label: "Telegram", external: true },
    ],
  },
};
