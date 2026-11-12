// Screens and texts of the /cases pages (RU). Screens live in public/cases/<slug>/:
// full = the whole page (opened in the gallery), thumb = preview (desktop full length at
// 760px, phone top crop), stripThumb = shorter crop for strips, squareThumb = a short
// desktop padded to a square for the 380×380 point preview, longThumb = the whole phone
// page at preview width (landing layout). Spec: docs/superpowers/specs/2026-11-11-works-gallery-design.md.
import type { CaseStudy } from "./commercial-content";

export type ScreenImage = { src: string; width: number; height: number };

export type Screen = {
  kind: "desktop" | "mobile";
  caption: string;
  full: ScreenImage;
  thumb: ScreenImage;
  stripThumb?: ScreenImage;
  squareThumb?: ScreenImage;
  longThumb?: ScreenImage;
};

export type CasePoint = {
  title: string;
  text: string;
  /** Indexes into `screens`: at most one desktop and the phones of this point. */
  screens: number[];
};

/**
 * story — hero, "Все экраны" strip, one row per point with its screens;
 * landing — one row: the points as a list + the whole landing (desktop and phone);
 * brief — screens only in the hero, the points as a two-column text grid.
 */
export type CaseLayout = "story" | "landing" | "brief";

export type CaseGallery = {
  title: string;
  kind: string;
  line: string;
  website?: string;
  websiteLabel?: string;
  note?: string;
  layout: CaseLayout;
  lead: string;
  task: string;
  points: CasePoint[];
  result: string;
  stack: string[];
  /**
   * Hero screens. Without `mobile` the hero shows the whole desktop alone:
   * a short, wide first screen would lose its sides in the cropped pair.
   */
  cover: { desktop: number; mobile?: number };
  /** Indexes into `screens` shown in the /cases strip, in order. */
  strip: number[];
  screens: Screen[];
};

export const caseGalleries: Record<CaseStudy["slug"], CaseGallery> = {
  smallfriendfiles: {
    title: "smallFriendFiles",
    kind: "Веб-приложение",
    line: "Электронная медкарта питомца: AI разбирает документы, следит за прививками, подборки для врача на его языке",
    website: "https://smallfriendfiles.fyi/ru",
    layout: "story",
    lead: "Электронная медкарта питомца. Документы загружаются фотографией или PDF — данные из них извлекаются автоматически. Полная мультиязычность, поддержка четырёх языков.",
    task: "Медицинские документы питомца разбросаны по фото, PDF и бумажкам, а при смене клиники или поездке нужное не найти. Задача — собрать всё в одну историю, ничего не заполняя руками.",
    points: [
      {
        title: "Главная",
        text: "Вся важная информация о питомце на одном экране. Блок «Требует внимания» автоматически отслеживает истекающие прививки и страховки, незаполненные поля паспорта и обновляется при загрузке новых документов.",
        screens: [2, 3],
      },
      {
        title: "Ветпаспорт",
        text: "Данные собираются автоматически из фотографий или PDF паспорта. Можно загрузить несколько паспортов, выбрать основной и отредактировать любое поле.",
        screens: [4, 5],
      },
      {
        title: "Документы",
        text: "Пользователь загружает фотографии или PDF. AI извлекает данные, заполняет все поля и пишет краткую выжимку. От пользователя ничего не требуется — только при желании добавить заметки.",
        screens: [6, 7],
      },
      {
        title: "Прививки",
        text: "Первоначально данные извлекаются из фотографий паспорта. В любой момент можно загрузить фотографии с новыми прививками — AI извлечёт данные и подсветит прививки с истекающим сроком.",
        screens: [8, 9],
      },
      {
        title: "Подборки документов",
        text: "Документы можно сгруппировать для передачи врачу или другому человеку по ссылке или QR-коду, а также скачать себе одним PDF. Публичную ссылку может открыть любой человек, выбрать свой язык и получить полный перевод, включая названия документов. Исходники не меняются.",
        screens: [10, 11],
      },
      {
        title: "Профиль",
        text: "Несколько питомцев и быстрое переключение между ними. Здесь же — скачать все свои данные одним архивом, выбрать язык приложения, отключить питомца или удалить аккаунт.",
        screens: [12, 13],
      },
    ],
    result:
      "Опубликовано, открытая бета. Путь от фото документа до отправки врачу — в одном сервисе. Автоматический разбор берёт на себя рутину, медицинские решения остаются за ветеринаром.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Supabase",
      "Claude и Gemini API",
      "Playwright",
    ],
    cover: { desktop: 0 },
    strip: [0, 1, 2, 3, 4, 5, 6, 7],
    screens: [
      {
        kind: "desktop",
        caption: "Лендинг",
        full: {
          src: "/cases/smallfriendfiles/welcome-d.webp",
          width: 2400,
          height: 1500,
        },
        thumb: {
          src: "/cases/smallfriendfiles/welcome-d-t.webp",
          width: 1200,
          height: 750,
        },
      },
      {
        kind: "mobile",
        caption: "Лендинг",
        full: {
          src: "/cases/smallfriendfiles/welcome-m.webp",
          width: 1170,
          height: 2532,
        },
        thumb: {
          src: "/cases/smallfriendfiles/welcome-m-t.webp",
          width: 600,
          height: 1298,
        },
      },
      {
        kind: "desktop",
        caption: "Главная",
        full: {
          src: "/cases/smallfriendfiles/xgHTM.webp",
          width: 2400,
          height: 1600,
        },
        thumb: {
          src: "/cases/smallfriendfiles/xgHTM-t.webp",
          width: 1200,
          height: 800,
        },
      },
      {
        kind: "mobile",
        caption: "Главная",
        full: {
          src: "/cases/smallfriendfiles/OS83o.webp",
          width: 1170,
          height: 3900,
        },
        thumb: {
          src: "/cases/smallfriendfiles/OS83o-t.webp",
          width: 600,
          height: 2000,
        },
      },
      {
        kind: "desktop",
        caption: "Ветпаспорт",
        full: {
          src: "/cases/smallfriendfiles/LioTf.webp",
          width: 2400,
          height: 2200,
        },
        thumb: {
          src: "/cases/smallfriendfiles/LioTf-t.webp",
          width: 1200,
          height: 1100,
        },
      },
      {
        kind: "mobile",
        caption: "Ветпаспорт",
        full: {
          src: "/cases/smallfriendfiles/U4KOO.webp",
          width: 1137,
          height: 8192,
        },
        thumb: {
          src: "/cases/smallfriendfiles/U4KOO-t.webp",
          width: 600,
          height: 4323,
        },
      },
      {
        kind: "desktop",
        caption: "Документ",
        full: {
          src: "/cases/smallfriendfiles/doc-d.webp",
          width: 2400,
          height: 1548,
        },
        thumb: {
          src: "/cases/smallfriendfiles/doc-d-t.webp",
          width: 1200,
          height: 774,
        },
      },
      {
        kind: "mobile",
        caption: "Документ",
        full: {
          src: "/cases/smallfriendfiles/doc-m.webp",
          width: 782,
          height: 1700,
        },
        thumb: {
          src: "/cases/smallfriendfiles/doc-m-t.webp",
          width: 600,
          height: 1304,
        },
      },
      {
        kind: "desktop",
        caption: "Прививки",
        full: {
          src: "/cases/smallfriendfiles/xLzLo.webp",
          width: 2400,
          height: 2500,
        },
        thumb: {
          src: "/cases/smallfriendfiles/xLzLo-t.webp",
          width: 1200,
          height: 1250,
        },
      },
      {
        kind: "mobile",
        caption: "Прививки",
        full: {
          src: "/cases/smallfriendfiles/P6zcT.webp",
          width: 1170,
          height: 5400,
        },
        thumb: {
          src: "/cases/smallfriendfiles/P6zcT-t.webp",
          width: 600,
          height: 2769,
        },
      },
      {
        kind: "desktop",
        caption: "Подборка документов",
        full: {
          src: "/cases/smallfriendfiles/pack-d.webp",
          width: 2400,
          height: 1583,
        },
        thumb: {
          src: "/cases/smallfriendfiles/pack-d-t.webp",
          width: 1200,
          height: 792,
        },
      },
      {
        kind: "mobile",
        caption: "Подборка документов",
        full: {
          src: "/cases/smallfriendfiles/pack-m.webp",
          width: 784,
          height: 1704,
        },
        thumb: {
          src: "/cases/smallfriendfiles/pack-m-t.webp",
          width: 600,
          height: 1304,
        },
      },
      {
        kind: "desktop",
        caption: "Профиль",
        full: {
          src: "/cases/smallfriendfiles/prof-d.webp",
          width: 2400,
          height: 1551,
        },
        thumb: {
          src: "/cases/smallfriendfiles/prof-d-t.webp",
          width: 1200,
          height: 776,
        },
      },
      {
        kind: "mobile",
        caption: "Профиль",
        full: {
          src: "/cases/smallfriendfiles/prof-m.webp",
          width: 774,
          height: 1712,
        },
        thumb: {
          src: "/cases/smallfriendfiles/prof-m-t.webp",
          width: 600,
          height: 1327,
        },
      },
    ],
  },
  fortnoise: {
    title: "FortNoise",
    kind: "Сайт",
    line: "Афиша живой музыки Калининграда: лента событий, карта, справочник площадок и заявки без регистрации",
    website: "https://fn39.ru",
    layout: "story",
    lead: "Афиша живой музыки Калининграда для независимого медиа FORT NOISE об андеграундной и рок-сцене города. Задача — собрать концерты независимых музыкантов на собственном сайте и показать их во времени и в пространстве: лентой по датам и на карте города.",
    task: "Собрать андеграундные и независимые концерты Калининграда на своём сайте, не завися от соцсетей, и показать их по датам и на карте.",
    points: [
      {
        title: "Афиша",
        text: "Лента предстоящих событий андеграундной сцены Калининграда: концерты, квартирники, вечеринки. Сортировка по дате и быстрые фильтры «Сегодня», «Завтра», «Неделя» и выбор даты. Рядом — превью карты со всеми событиями.",
        screens: [0, 1],
      },
      {
        title: "Карта",
        text: "Все события на карте города, а под картой — список ближайших. По нажатию на точку открывается превью события: постер, дата и площадка.",
        screens: [2, 3],
      },
      {
        title: "Мероприятие",
        text: "Страница с подробным описанием предстоящего концерта или вечеринки: постер, дата и время, цена, площадка со ссылкой на карту, контакты и ссылки на билеты.",
        screens: [4, 5],
      },
      {
        title: "Площадки",
        text: "Справочник площадок, на которых проходили события. Новое место сохраняется в справочник автоматически, когда его указывают в событии; модератор дополняет описание, контакты и фотографии.",
        screens: [6, 7],
      },
      {
        title: "Площадка",
        text: "Страница конкретного места — клуба, бара, ресторана или концертного зала. Рассказываем, что это за место и что там обычно проходит, показываем фотографии и основную информацию: адрес и как добраться, средний чек, контакты. Ниже — ближайшие концерты и архив прошедших.",
        screens: [8, 9],
      },
      {
        title: "О проекте",
        text: "Кто стоит за афишей и как события в неё попадают. Разделы и фотографии модератор редактирует прямо на странице.",
        screens: [10, 11],
      },
      {
        title: "Добавить событие",
        text: "Форма заявки: название, тип и жанр, дата и площадка, цена, ссылки на источник и билеты, постер. Отправить событие может любой человек без регистрации — заявка уходит на модерацию и после проверки появляется в ленте и на карте.",
        screens: [12, 13],
      },
    ],
    result:
      "Запущен в июле 2026 года на собственном домене fn39.ru. Проведена SEO- и GEO-оптимизация: техническое SEO и разметка для поисковиков и ИИ-ассистентов, отдельные страницы под популярные запросы (концерты сегодня, выходные, рок, квартирники, бесплатные события), индексация в Google, Яндексе и Bing. За октябрь — около 3000 показов и 200 переходов из Google и около 250 показов в ответах генеративного ИИ Google.",
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Auth.js",
      "Docker",
      "Яндекс Карты",
      "SEO и GEO",
    ],
    cover: {
      desktop: 0,
      mobile: 1,
    },
    strip: [0, 1, 2, 3, 4, 5, 6],
    screens: [
      {
        kind: "desktop",
        caption: "Афиша",
        full: {
          src: "/cases/fortnoise/af.webp",
          width: 2240,
          height: 4060,
        },
        thumb: {
          src: "/cases/fortnoise/af-t.webp",
          width: 1200,
          height: 2175,
        },
      },
      {
        kind: "mobile",
        caption: "Афиша",
        full: {
          src: "/cases/fortnoise/XDNWn.webp",
          width: 1170,
          height: 3720,
        },
        thumb: {
          src: "/cases/fortnoise/XDNWn-t.webp",
          width: 600,
          height: 1908,
        },
      },
      {
        kind: "desktop",
        caption: "Карта",
        full: {
          src: "/cases/fortnoise/map.webp",
          width: 2240,
          height: 3420,
        },
        thumb: {
          src: "/cases/fortnoise/map-t.webp",
          width: 1200,
          height: 1832,
        },
      },
      {
        kind: "mobile",
        caption: "Карта",
        full: {
          src: "/cases/fortnoise/map-m.webp",
          width: 1170,
          height: 3840,
        },
        thumb: {
          src: "/cases/fortnoise/map-m-t.webp",
          width: 600,
          height: 1969,
        },
      },
      {
        kind: "desktop",
        caption: "Мероприятие",
        full: {
          src: "/cases/fortnoise/j747dc.webp",
          width: 2240,
          height: 3368,
        },
        thumb: {
          src: "/cases/fortnoise/j747dc-t.webp",
          width: 1200,
          height: 1804,
        },
      },
      {
        kind: "mobile",
        caption: "Мероприятие",
        full: {
          src: "/cases/fortnoise/YgmkI.webp",
          width: 1170,
          height: 5439,
        },
        thumb: {
          src: "/cases/fortnoise/YgmkI-t.webp",
          width: 600,
          height: 2789,
        },
      },
      {
        kind: "desktop",
        caption: "Площадки",
        full: {
          src: "/cases/fortnoise/aZte2.webp",
          width: 2400,
          height: 3550,
        },
        thumb: {
          src: "/cases/fortnoise/aZte2-t.webp",
          width: 1200,
          height: 1775,
        },
      },
      {
        kind: "mobile",
        caption: "Площадки",
        full: {
          src: "/cases/fortnoise/s3DT20.webp",
          width: 1125,
          height: 6219,
        },
        thumb: {
          src: "/cases/fortnoise/s3DT20-t.webp",
          width: 600,
          height: 3317,
        },
      },
      {
        kind: "desktop",
        caption: "Площадка",
        full: {
          src: "/cases/fortnoise/LCtoj.webp",
          width: 2400,
          height: 3800,
        },
        thumb: {
          src: "/cases/fortnoise/LCtoj-t.webp",
          width: 1200,
          height: 1900,
        },
      },
      {
        kind: "mobile",
        caption: "Площадка",
        full: {
          src: "/cases/fortnoise/Dp3PK.webp",
          width: 1125,
          height: 5103,
        },
        thumb: {
          src: "/cases/fortnoise/Dp3PK-t.webp",
          width: 600,
          height: 2722,
        },
      },
      {
        kind: "desktop",
        caption: "О проекте",
        full: {
          src: "/cases/fortnoise/UqjR8.webp",
          width: 2240,
          height: 3840,
        },
        thumb: {
          src: "/cases/fortnoise/UqjR8-t.webp",
          width: 1200,
          height: 2057,
        },
      },
      {
        kind: "mobile",
        caption: "О проекте",
        full: {
          src: "/cases/fortnoise/U8eOs.webp",
          width: 1170,
          height: 5634,
        },
        thumb: {
          src: "/cases/fortnoise/U8eOs-t.webp",
          width: 600,
          height: 2889,
        },
      },
      {
        kind: "desktop",
        caption: "Добавить событие",
        full: {
          src: "/cases/fortnoise/kO6t0.webp",
          width: 2240,
          height: 6440,
        },
        thumb: {
          src: "/cases/fortnoise/kO6t0-t.webp",
          width: 1200,
          height: 3450,
        },
      },
      {
        kind: "mobile",
        caption: "Добавить событие",
        full: {
          src: "/cases/fortnoise/ukbJH.webp",
          width: 1170,
          height: 3117,
        },
        thumb: {
          src: "/cases/fortnoise/ukbJH-t.webp",
          width: 600,
          height: 1598,
        },
      },
    ],
  },
  gridfin: {
    title: "Gridfin",
    kind: "Продукт студии",
    line: "Стартовый шаблон для разработки с Claude Code: от идеи до работающего протестированного приложения за час",
    website: "https://ludvik4.ru/gridfin/",
    websiteLabel: "Открыть лендинг",
    note: "Сам шаблон выдаём по запросу — идёт ранний доступ.",
    layout: "landing",
    lead: "Стартовый шаблон для разработки с Claude Code. Одна команда в терминале — и за час от идеи до работающего приложения с тестами. Внутри готовая архитектура, инженерные правила и проверки качества, которые агент соблюдает на каждом шаге.",
    task: "Сделать так, чтобы Claude Code собирал не прототипы на один вечер, а приложения с архитектурой, тестами и процессом, как в инженерной команде.",
    points: [
      {
        title: "Запуск одной командой",
        text: "Команда /gridfin расспрашивает об идее, пишет описание продукта и первые спецификации и подстраивает шаблон под проект: название, схему данных, демо-данные.",
        screens: [],
      },
      {
        title: "Фича от спецификации до коммита",
        text: "Команда /feature собирает одну фичу целиком: спецификация, план изменений, код, обязательные тесты, проверки и коммит.",
        screens: [],
      },
      {
        title: "Проверки качества",
        text: "Линтеры, проверка типов, юнит-, компонентные, интеграционные и end-to-end-тесты запускаются одной командой. По каждой проверке агент показывает результат с выводом команд.",
        screens: [],
      },
      {
        title: "Ревью и дизайн",
        text: "Команда /review разбирает изменения по правилам проекта и ищет ошибки, /design показывает 3–5 вариантов экрана в браузере и запоминает выбранный.",
        screens: [],
      },
      {
        title: "Лендинг",
        text: "Продающая страница на русском и английском: проблема, процесс по шагам, что внутри шаблона, для кого он и заявка на ранний доступ.",
        screens: [],
      },
    ],
    result:
      "Лендинг запущен на русском и английском, идёт ранний доступ. Шаблон используется в наших собственных проектах.",
    stack: [
      "Claude Code",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Vitest",
      "Playwright",
    ],
    cover: {
      desktop: 0,
      mobile: 1,
    },
    strip: [0, 1, 2],
    screens: [
      {
        kind: "desktop",
        caption: "Лендинг",
        full: {
          src: "/cases/gridfin/landing-d.webp",
          width: 2400,
          height: 14080,
        },
        thumb: {
          src: "/cases/gridfin/landing-d-t.webp",
          width: 760,
          height: 4459,
        },
        stripThumb: {
          src: "/cases/gridfin/landing-d-s.webp",
          width: 600,
          height: 1020,
        },
      },
      {
        kind: "mobile",
        caption: "Лендинг",
        full: {
          src: "/cases/gridfin/landing-m.jpg",
          width: 780,
          height: 27174,
        },
        thumb: {
          src: "/cases/gridfin/landing-m-t.webp",
          width: 360,
          height: 779,
        },
        longThumb: {
          src: "/cases/gridfin/landing-m-f.webp",
          width: 360,
          height: 12542,
        },
      },
      {
        kind: "desktop",
        caption: "Первый экран",
        full: {
          src: "/cases/gridfin/hero-d.webp",
          width: 2400,
          height: 1320,
        },
        thumb: {
          src: "/cases/gridfin/hero-d-t.webp",
          width: 1200,
          height: 660,
        },
      },
    ],
  },
  "secret-santa": {
    title: "Тайный Санта",
    kind: "Веб-приложение",
    line: "Онлайн-игра «Тайный Санта» для соседей, коллег и друзей: жеребьёвка, передача подарков и раскрытие Сант",
    layout: "story",
    lead: "Онлайн-игра «Тайный Санта» для соседей, коллег и друзей. Организатор приглашает участников ссылкой или QR-кодом и запускает жеребьёвку одной кнопкой, а письма, напоминания, передачу подарков и раскрытие Сант сервис берёт на себя.",
    task: "Провести «Тайного Санту» для большой группы людей, которые говорят на разных языках и мало знакомы: без таблиц и чатов, с честной тайной жеребьёвкой и так, чтобы никто не остался без подарка.",
    points: [
      {
        title: "Промо-страница",
        text: "Что это за игра, для кого она подходит — друзья, офис, удалённая команда, соседи — и как проходит: шаги для организатора и для участника.",
        screens: [0, 1],
      },
      {
        title: "Анкета",
        text: "Имя, адрес для подарка, фото по желанию, пожелания и что не дарить. Взрослый добавляет в свой аккаунт детей. Пожелания автоматически переводятся на остальные языки интерфейса — всего их пять: русский, украинский, английский, испанский и немецкий.",
        screens: [2, 3],
      },
      {
        title: "Кабинет участника",
        text: "Сводка по текущему этапу игры: до жеребьёвки — статус анкеты и дата жеребьёвки, после — получатель и дни до обмена подарками, в дни обмена — подарок для тебя. Если в аккаунте несколько участников, видно, кто сейчас играет.",
        screens: [4],
      },
      {
        title: "Передача подарка",
        text: "Санта отмечает, где оставил подарок, и может добавить анонимную записку. Отметка окончательная, изменить её нельзя. Получателю сразу приходит письмо с местом и запиской, а если подарка нет на месте, он сообщает об этом в один клик.",
        screens: [5, 6],
      },
      {
        title: "Угадай своего Санту",
        text: "В дни обмена каждый может предположить, кто его Санта, и поменять догадку. 1 января Санты раскрываются, и участник видит, угадал ли он.",
        screens: [7],
      },
      {
        title: "Стена благодарностей",
        text: "Лента благодарностей с фотографиями подарков, открывается в дни обмена. Фото открываются на весь экран, записи тоже автоматически переводятся на язык читателя.",
        screens: [8, 9],
      },
      {
        title: "Админка и жеребьёвка",
        text: "Организатор проверяет заявки и запускает жеребьёвку одной кнопкой. Алгоритм следит, чтобы никто не дарил своей семье, а дети дарили детям. Пары не видит никто — ни в админке, ни в письмах. Если кто-то выбывает, цепочка смыкается сама, а тому, кто остался без подарка, помогает запасной Санта.",
        screens: [10],
      },
    ],
    result:
      "Сейчас идёт живая игра: открыт сбор участников, жеребьёвка в декабре. Пять языков, письма на каждом этапе, запасные Санты и админка организатора. После игры все данные удаляются автоматически.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Drizzle",
      "Postgres",
      "next-auth",
      "Groq",
    ],
    cover: {
      desktop: 0,
      mobile: 1,
    },
    strip: [0, 1, 2, 3, 4, 5, 6],
    screens: [
      {
        kind: "desktop",
        caption: "Промо-страница",
        full: {
          src: "/cases/secret-santa/promo-d.webp",
          width: 2400,
          height: 5631,
        },
        thumb: {
          src: "/cases/secret-santa/promo-d-t.webp",
          width: 760,
          height: 1783,
        },
      },
      {
        kind: "mobile",
        caption: "Промо-страница",
        full: {
          src: "/cases/secret-santa/promo-m.jpg",
          width: 1170,
          height: 17691,
        },
        thumb: {
          src: "/cases/secret-santa/promo-m-t.webp",
          width: 360,
          height: 864,
        },
      },
      {
        kind: "desktop",
        caption: "Анкета",
        full: {
          src: "/cases/secret-santa/RCoTL.webp",
          width: 2400,
          height: 1651,
        },
        thumb: {
          src: "/cases/secret-santa/RCoTL-t.webp",
          width: 760,
          height: 523,
        },
        squareThumb: {
          src: "/cases/secret-santa/RCoTL-sq.webp",
          width: 760,
          height: 760,
        },
      },
      {
        kind: "mobile",
        caption: "Анкета",
        full: {
          src: "/cases/secret-santa/KjReh.webp",
          width: 1170,
          height: 3167,
        },
        thumb: {
          src: "/cases/secret-santa/KjReh-t.webp",
          width: 360,
          height: 864,
        },
      },
      {
        kind: "mobile",
        caption: "Кабинет участника",
        full: {
          src: "/cases/secret-santa/MAQfu.webp",
          width: 1170,
          height: 2552,
        },
        thumb: {
          src: "/cases/secret-santa/MAQfu-t.webp",
          width: 360,
          height: 785,
        },
      },
      {
        kind: "mobile",
        caption: "Оставить подарок",
        full: {
          src: "/cases/secret-santa/b4x7S.webp",
          width: 1170,
          height: 3007,
        },
        thumb: {
          src: "/cases/secret-santa/b4x7S-t.webp",
          width: 360,
          height: 864,
        },
      },
      {
        kind: "mobile",
        caption: "Подарок ждёт",
        full: {
          src: "/cases/secret-santa/pgbnS.webp",
          width: 1170,
          height: 2536,
        },
        thumb: {
          src: "/cases/secret-santa/pgbnS-t.webp",
          width: 360,
          height: 780,
        },
      },
      {
        kind: "mobile",
        caption: "Угадай своего Санту",
        full: {
          src: "/cases/secret-santa/zY7JF.webp",
          width: 1170,
          height: 2536,
        },
        thumb: {
          src: "/cases/secret-santa/zY7JF-t.webp",
          width: 360,
          height: 780,
        },
      },
      {
        kind: "desktop",
        caption: "Стена благодарностей",
        full: {
          src: "/cases/secret-santa/S1a6y.webp",
          width: 2400,
          height: 1838,
        },
        thumb: {
          src: "/cases/secret-santa/S1a6y-t.webp",
          width: 760,
          height: 582,
        },
        squareThumb: {
          src: "/cases/secret-santa/S1a6y-sq.webp",
          width: 760,
          height: 760,
        },
      },
      {
        kind: "mobile",
        caption: "Стена благодарностей",
        full: {
          src: "/cases/secret-santa/z6Qz5.webp",
          width: 1170,
          height: 2735,
        },
        thumb: {
          src: "/cases/secret-santa/z6Qz5-t.webp",
          width: 360,
          height: 841,
        },
      },
      {
        kind: "mobile",
        caption: "Админка организатора",
        full: {
          src: "/cases/secret-santa/ThhEp.webp",
          width: 1170,
          height: 2536,
        },
        thumb: {
          src: "/cases/secret-santa/ThhEp-t.webp",
          width: 360,
          height: 780,
        },
      },
    ],
  },
  "qa-pilot": {
    title: "qa-pilot",
    kind: "AI-плагин",
    line: "Открытый QA-плагин для Claude Code: план проверок по задаче, аудит требований и тестов, тесты, которые доказали, что умеют падать",
    website: "https://ludvik4.ru/qa-pilot/",
    websiteLabel: "Открыть лендинг",
    note: "Плагин открытый, код на GitHub. Ставится двумя командами в Claude Code.",
    layout: "brief",
    lead: "Плагин для Claude Code, который превращает тестирование в повторяемый процесс. Агент планирует проверки до кода, проверяет задачу после, пишет тесты по правилам проекта и проводит аудиты, а каждый вывод подкрепляет ссылкой на код или требование.",
    task: "AI-агенты быстро пишут тесты, но такие тесты часто поверхностные, перегружены моками и проходят при любом поведении. Нужен процесс, в котором агент тестирует как опытный QA-инженер, а результат можно проверить.",
    points: [
      {
        title: "Профиль проекта",
        text: "Команда /qa-pilot:onboard один раз изучает стек, тестовые слои, команды и CI, задаёт вопросы о том, чего нет в коде, — безопасные окружения, критичные флоу, — и записывает профиль, который читают остальные команды.",
        screens: [],
      },
      {
        title: "QA каждой задачи",
        text: "Команда /qa-pilot:test до разработки составляет план проверок и ищет дыры в требованиях, после разработки проверяет задачу, проходит флоу в браузере и пишет тесты по готовому плану.",
        screens: [],
      },
      {
        title: "Аудиты",
        text: "Команда /qa-pilot:audit оценивает весь проект, требования одной фичи или код тестов: ложно-зелёные и нестабильные тесты, дубли. Результат — список работ по приоритету.",
        screens: [],
      },
      {
        title: "Тест должен уметь падать",
        text: "Каждый новый тест проверяется: агент ломает проверяемый код, видит падение и откатывает правку. Ожидаемый результат берётся из спеки или требования, а не из самого кода.",
        screens: [],
      },
      {
        title: "Приоритет по риску",
        text: "Находки делятся на Must, Should и Highlight по последствиям для продукта, а не по проценту покрытия. Should — не больше восьми, чтобы список можно было реально сделать.",
        screens: [],
      },
      {
        title: "База правил и скрипты",
        text: "Больше 1300 правил тестирования, сверенных со стандартами (ISTQB, OWASP, W3C, NIST). Скрипты без LLM отбирают правила под продукт, валидируют отчёты и сверяют профиль с репозиторием.",
        screens: [],
      },
    ],
    result:
      "Плагин опубликован на GitHub и на отдельном лендинге на русском и английском. Планы, отчёты и тесты сохраняются файлами в репозитории пользователя, прерванную сессию можно продолжить.",
    stack: ["Claude Code", "Скиллы и агенты", "Playwright MCP", "Python"],
    cover: {
      desktop: 0,
      mobile: 1,
    },
    strip: [0, 1],
    screens: [
      {
        kind: "desktop",
        caption: "Первый экран",
        full: {
          src: "/cases/qa-pilot/hero-d.webp",
          width: 2400,
          height: 1500,
        },
        thumb: {
          src: "/cases/qa-pilot/hero-d-t.webp",
          width: 1200,
          height: 750,
        },
      },
      {
        kind: "mobile",
        caption: "Первый экран",
        full: {
          src: "/cases/qa-pilot/hero-m.webp",
          width: 780,
          height: 1688,
        },
        thumb: {
          src: "/cases/qa-pilot/hero-m-t.webp",
          width: 360,
          height: 779,
        },
      },
    ],
  },
};
