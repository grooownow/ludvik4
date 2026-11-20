// The works gallery (/cases on ludvik4.ru, /work, /es/work and /ru/work on
// ludvik4.dev):
// which works each storefront shows, their texts and screens, and the page
// chrome in its language. Views: case-pages.tsx. Spec:
// docs/superpowers/specs/2026-11-17-works-gallery-en.md and
// docs/superpowers/specs/2026-11-20-works-gallery-es.md.
import { type CaseGallery, caseGalleries } from "./case-gallery";
import { caseScreensEn } from "./case-screens-en";
import { caseScreensEs } from "./case-screens-es";
import { DEV_CASE_SLUGS, type DevCaseSlug } from "./case-slugs";
import {
  caseStudies,
  type CaseStudy,
  getCaseStudy,
} from "./commercial-content";
import { getMarketContent, type MarketContent } from "./content";
import { getLocaleBundle } from "./locale-content";
import type { GalleryLabels } from "./screen-gallery";

export type CaseSlug = CaseStudy["slug"];
export { DEV_CASE_SLUGS, type DevCaseSlug };

export type CaseUi = {
  lang: "ru" | "en" | "es";
  screenCount: (n: number) => string;
  /** "Все 14 экранов" — the strip tile and the hero button. */
  allScreens: (n: number) => string;
  open: (caption: string, kind: string) => string;
  gallery: GalleryLabels;
  strip: { left: string; right: string };
  openProject: string;
  home: string;
  breadcrumbsAria: string;
  works: string;
  indexTitle: string;
  indexLead: string;
  indexJsonLdName: string;
  indexJsonLdDescription: string;
  more: string;
  caseTitle: (title: string) => string;
  allScreensTitle: string;
  allScreensNote: (n: number) => string;
  storyTitle: string;
  insideTitle: string;
  task: string;
  result: string;
  stack: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};

function ruScreenCount(n: number): string {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return `${n} экран`;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return `${n} экрана`;
  return `${n} экранов`;
}

export const ruCaseUi: CaseUi = {
  lang: "ru",
  screenCount: ruScreenCount,
  allScreens: (n) => `Все ${ruScreenCount(n)}`,
  open: (caption, kind) => `Открыть: ${caption}, ${kind}`,
  gallery: {
    mobile: "мобильная",
    desktop: "десктоп",
    close: "Закрыть",
    prev: "Предыдущий экран",
    next: "Следующий экран",
  },
  strip: { left: "Прокрутить влево", right: "Прокрутить вправо" },
  openProject: "Открыть проект",
  home: "Главная",
  breadcrumbsAria: "Хлебные крошки",
  works: "Работы",
  indexTitle: "Проекты студии Ludvik4",
  indexLead:
    "Листайте экраны прямо здесь — нажмите на любой, чтобы открыть на весь экран.",
  indexJsonLdName: "Работы Ludvik4",
  indexJsonLdDescription:
    "Публичные примеры сайтов, веб-приложений и AI-инструментов Ludvik4 с экранами каждого проекта.",
  more: "Подробнее о проекте →",
  caseTitle: (title) => `${title} — работа Ludvik4`,
  allScreensTitle: "Все экраны",
  allScreensNote: (n) => `${n} · десктоп и мобильная версия`,
  storyTitle: "Экраны и функции",
  insideTitle: "Что внутри",
  task: "Задача",
  result: "Результат",
  stack: "Технологии",
  ctaTitle: "Обсудить похожую задачу",
  ctaBody: "Коротко опишите идею — ответим с вариантами и сроками.",
  ctaButton: "Обсудить задачу",
};

const enScreenCount = (n: number) => `${n} ${n === 1 ? "screen" : "screens"}`;

export const enCaseUi: CaseUi = {
  lang: "en",
  screenCount: enScreenCount,
  allScreens: (n) => `All ${enScreenCount(n)}`,
  open: (caption, kind) => `Open: ${caption}, ${kind}`,
  gallery: {
    mobile: "mobile",
    desktop: "desktop",
    close: "Close",
    prev: "Previous screen",
    next: "Next screen",
  },
  strip: { left: "Scroll left", right: "Scroll right" },
  openProject: "Open project",
  home: "Home",
  breadcrumbsAria: "Breadcrumbs",
  works: "Work",
  indexTitle: "Ludvik4 studio projects",
  indexLead:
    "Scroll through the screens right here — click any of them to open it full screen.",
  indexJsonLdName: "Ludvik4 work",
  indexJsonLdDescription:
    "Public examples of Ludvik4 websites, web applications and AI tools, with screens from each project.",
  more: "About the project →",
  caseTitle: (title) => `${title} — Ludvik4 case study`,
  allScreensTitle: "All screens",
  allScreensNote: (n) => `${n} · desktop and mobile`,
  storyTitle: "Screens and features",
  insideTitle: "What's inside",
  task: "Task",
  result: "Result",
  stack: "Technologies",
  ctaTitle: "Discuss a similar project",
  ctaBody:
    "Briefly describe your idea — we'll reply with options and timelines.",
  ctaButton: "Discuss a project",
};

const esScreenCount = (n: number) =>
  `${n} ${n === 1 ? "pantalla" : "pantallas"}`;

export const esCaseUi: CaseUi = {
  lang: "es",
  screenCount: esScreenCount,
  allScreens: (n) => `${n === 1 ? "La" : "Las"} ${esScreenCount(n)}`,
  open: (caption, kind) => `Abrir: ${caption}, ${kind}`,
  gallery: {
    mobile: "móvil",
    desktop: "escritorio",
    close: "Cerrar",
    prev: "Pantalla anterior",
    next: "Pantalla siguiente",
  },
  strip: { left: "Desplazar a la izquierda", right: "Desplazar a la derecha" },
  openProject: "Abrir el proyecto",
  home: "Inicio",
  breadcrumbsAria: "Ruta de navegación",
  works: "Proyectos",
  indexTitle: "Proyectos del estudio Ludvik4",
  indexLead:
    "Desliza las pantallas aquí mismo: pulsa cualquiera para abrirla a pantalla completa.",
  indexJsonLdName: "Proyectos de Ludvik4",
  indexJsonLdDescription:
    "Ejemplos públicos de webs, aplicaciones web y herramientas de IA de Ludvik4, con pantallas de cada proyecto.",
  more: "Sobre el proyecto →",
  caseTitle: (title) => `${title}: caso de estudio de Ludvik4`,
  allScreensTitle: "Todas las pantallas",
  allScreensNote: (n) => `${n} · escritorio y móvil`,
  storyTitle: "Pantallas y funciones",
  insideTitle: "Qué incluye",
  task: "Reto",
  result: "Resultado",
  stack: "Tecnologías",
  ctaTitle: "Hablemos de un proyecto parecido",
  ctaBody:
    "Cuéntanos tu idea en pocas líneas y te responderemos con opciones y plazos.",
  ctaButton: "Hablar del proyecto",
};

type EnSlug = keyof typeof caseScreensEn;

/** The English texts of each work; the screens come from case-screens-en.ts. */
const enTexts: Record<EnSlug, Omit<CaseGallery, "screens">> = {
  smallfriendfiles: {
    title: "smallFriendFiles",
    kind: "Web application",
    line: "A pet's digital medical file: AI reads the documents, tracks vaccinations and builds packs for the vet in their language",
    website: "https://smallfriendfiles.fyi/en",
    layout: "story",
    lead: "A pet's digital medical file. Documents are uploaded as photos or PDFs, and their data is extracted automatically. Fully multilingual, with four languages supported.",
    task: "A pet's medical documents are scattered across photos, PDFs and paper, and when you change clinics or travel, the one you need is nowhere to be found. The task was to gather everything into one history without filling anything in by hand.",
    points: [
      {
        title: "Home",
        text: "Everything important about the pet on one screen. The “Needs attention” block automatically tracks expiring vaccinations and insurance and missing passport fields, and updates whenever new documents are uploaded.",
        screens: [2, 3],
      },
      {
        title: "Pet passport",
        text: "The data is collected automatically from photos or a PDF of the passport. You can upload several passports, choose the primary one and edit any field.",
        screens: [4, 5],
      },
      {
        title: "Documents",
        text: "The user uploads photos or PDFs. AI extracts the data, fills in every field and writes a short summary. Nothing else is required from the user — notes are optional.",
        screens: [6, 7],
      },
      {
        title: "Vaccinations",
        text: "The data is first extracted from photos of the passport. New vaccinations can be added at any time by uploading photos — AI extracts the data and highlights vaccinations that are about to expire.",
        screens: [8, 9],
      },
      {
        title: "Document packs",
        text: "Documents can be grouped for a vet or another person and shared by link or QR code, or downloaded as a single PDF. Anyone can open the public link, choose their language and get a full translation, document titles included. The originals stay unchanged.",
        screens: [10, 11],
      },
      {
        title: "Profile",
        text: "Several pets with quick switching between them. This is also where you download all your data as one archive, choose the app language, deactivate a pet or delete the account.",
        screens: [12, 13],
      },
    ],
    result:
      "Live in open beta. The path from a photo of a document to sending it to the vet happens in one service. Automatic processing takes care of the routine; medical decisions stay with the vet.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Supabase",
      "Claude and Gemini APIs",
      "Playwright",
    ],
    cover: { desktop: 0 },
    strip: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  gridfin: {
    title: "Gridfin",
    kind: "Studio product",
    line: "A starter kit for building with Claude Code: from an idea to a working, tested application in an hour",
    website: "https://ludvik4.dev/gridfin/en",
    websiteLabel: "Open the landing",
    note: "The kit itself is available on request — early access is open.",
    layout: "landing",
    lead: "A starter kit for building with Claude Code. One terminal command takes you from an idea to a working application with tests in an hour. Inside: a ready architecture, engineering rules and quality gates the agent follows at every step.",
    task: "Make Claude Code build applications with an architecture, tests and a process like an engineering team's, not one-evening prototypes.",
    points: [
      {
        title: "One-command start",
        text: "The /gridfin command asks about the idea, writes the product brief and the first specifications, and adapts the template to the project: name, data schema, demo data.",
        screens: [],
      },
      {
        title: "A feature from spec to commit",
        text: "The /feature command builds one feature end to end: specification, change plan, code, mandatory tests, checks and a commit.",
        screens: [],
      },
      {
        title: "Quality gates",
        text: "Linters, type checks, unit, component, integration and end-to-end tests run with one command. For every check the agent shows the result with the command output.",
        screens: [],
      },
      {
        title: "Review and design",
        text: "The /review command checks changes against the project's rules and looks for bugs; /design shows 3–5 screen variants in the browser and remembers the chosen one.",
        screens: [],
      },
      {
        title: "Landing",
        text: "A sales page in several languages: the problem, the process step by step, what's inside the kit, who it's for and an early-access request.",
        screens: [],
      },
    ],
    result:
      "The landing is live in several languages and early access is open. We use the kit in our own projects.",
    stack: [
      "Claude Code",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Vitest",
      "Playwright",
    ],
    cover: { desktop: 0, mobile: 1 },
    strip: [0, 1, 2],
  },
  "secret-santa": {
    title: "Secret Santa",
    kind: "Web application",
    line: "An online Secret Santa game for neighbours, colleagues and friends: the draw, gift hand-over and the Santa reveal",
    layout: "story",
    lead: "An online Secret Santa game for neighbours, colleagues and friends. The organiser invites participants by link or QR code and runs the draw with one button, while emails, reminders, gift hand-over and the Santa reveal are handled by the service.",
    task: "Run Secret Santa for a large group of people who speak different languages and barely know each other: no spreadsheets or chats, an honest secret draw, and nobody left without a gift.",
    points: [
      {
        title: "Promo page",
        text: "What the game is, who it suits — friends, an office, a remote team, neighbours — and how it works: the steps for the organiser and for participants.",
        screens: [0, 1],
      },
      {
        title: "Profile",
        text: "Name, delivery address, an optional photo, wishes and what not to give. An adult can add their children to their account. Wishes are translated automatically into the other interface languages — five in total: English, Spanish, German, Russian and Ukrainian.",
        screens: [2, 3],
      },
      {
        title: "Participant's account",
        text: "A summary of the current stage of the game: before the draw — the profile status and the draw date; after it — the recipient and the days left until the exchange; during the exchange — the gift waiting for you. If an account has several participants, it shows who is playing now.",
        screens: [4],
      },
      {
        title: "Gift hand-over",
        text: "The Santa marks where the gift was left and can add an anonymous note. The mark is final and can't be changed. The recipient immediately gets an email with the spot and the note, and if the gift isn't there, reports it in one click.",
        screens: [5, 6],
      },
      {
        title: "Guess your Santa",
        text: "During the exchange, everyone can guess who their Santa is and change the guess. On 1 January the Santas are revealed, and each participant sees whether they guessed right.",
        screens: [7],
      },
      {
        title: "Thank-you wall",
        text: "A feed of thank-you posts with photos of the gifts, open during the exchange. Photos open full screen, and posts are also translated automatically into the reader's language.",
        screens: [8, 9],
      },
      {
        title: "Admin and the draw",
        text: "The organiser reviews the entries and runs the draw with one button. The algorithm makes sure nobody gives to their own family and children give to children. Nobody sees the pairs — not in the admin, not in emails. If someone drops out, the chain closes on its own, and a backup Santa helps whoever is left without a gift.",
        screens: [10],
      },
    ],
    result:
      "A live game is running now: sign-ups are open and the draw is in December. Five languages, emails at every stage, backup Santas and an organiser admin. After the game all data is deleted automatically.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Drizzle",
      "Postgres",
      "next-auth",
      "Groq",
    ],
    cover: { desktop: 0, mobile: 1 },
    strip: [0, 1, 2, 3, 4, 5, 6],
  },
  "qa-pilot": {
    title: "qa-pilot",
    kind: "AI plugin",
    line: "An open QA plugin for Claude Code: a test plan per task, requirement and test audits, tests proven able to fail",
    website: "https://ludvik4.dev/qa-pilot",
    websiteLabel: "Open the landing",
    note: "The plugin is open source, with the code on GitHub. It installs with two commands in Claude Code.",
    layout: "brief",
    lead: "A Claude Code plugin that turns testing into a repeatable process. The agent plans checks before the code, verifies the task after it, writes tests to the project's rules and runs audits, backing every conclusion with a link to the code or the requirement.",
    task: "AI agents write tests fast, but those tests are often shallow, over-mocked and pass whatever the behaviour. We needed a process in which the agent tests like an experienced QA engineer and the result can be checked.",
    points: [
      {
        title: "Project profile",
        text: "The /qa-pilot:onboard command studies the stack, test layers, commands and CI once, asks about what isn't in the code — safe environments, critical flows — and writes a profile the other commands read.",
        screens: [],
      },
      {
        title: "QA for every task",
        text: "Before development, /qa-pilot:test drafts a test plan and looks for gaps in the requirements; after development, it verifies the task, walks the flows in a browser and writes tests from the plan.",
        screens: [],
      },
      {
        title: "Audits",
        text: "The /qa-pilot:audit command assesses the whole project, one feature's requirements or the test code: false-green and flaky tests, duplicates. The output is a prioritised work list.",
        screens: [],
      },
      {
        title: "A test must be able to fail",
        text: "Every new test is checked: the agent breaks the code under test, sees the failure and reverts the change. The expected result comes from the spec or the requirement, not from the code itself.",
        screens: [],
      },
      {
        title: "Priority by risk",
        text: "Findings are split into Must, Should and Highlight by their impact on the product, not by coverage percentage. Should is capped at eight, so the list can actually be done.",
        screens: [],
      },
      {
        title: "Rule base and scripts",
        text: "Over 1,300 testing rules checked against standards (ISTQB, OWASP, W3C, NIST). Scripts without an LLM pick the rules for the product, validate reports and check the profile against the repository.",
        screens: [],
      },
    ],
    result:
      "The plugin is published on GitHub and on its own landing page. Plans, reports and tests are saved as files in the user's repository, and an interrupted session can be resumed.",
    stack: ["Claude Code", "Skills and agents", "Playwright MCP", "Python"],
    cover: { desktop: 0, mobile: 1 },
    strip: [0, 1],
  },
};

/** The Spanish texts of each work; the screens come from case-screens-es.ts. */
const esTexts: Record<EnSlug, Omit<CaseGallery, "screens">> = {
  smallfriendfiles: {
    title: "smallFriendFiles",
    kind: "Aplicación web",
    line: "El historial médico digital de tu mascota: la IA lee los documentos, controla las vacunas y prepara paquetes de documentos para el veterinario en su idioma",
    website: "https://smallfriendfiles.fyi/es",
    layout: "story",
    lead: "El historial médico digital de una mascota. Los documentos se suben como fotos o PDF y sus datos se extraen automáticamente. Disponible en cuatro idiomas.",
    task: "Los documentos médicos de una mascota acaban repartidos entre fotos, PDF y papeles, y cuando cambias de clínica o viajas, el que necesitas no aparece. El reto era reunirlo todo en un solo historial sin rellenar nada a mano.",
    points: [
      {
        title: "Inicio",
        text: "Todo lo importante de la mascota en una pantalla. El bloque «Requiere atención» vigila automáticamente las vacunas y los seguros a punto de caducar y los datos que faltan en el pasaporte, y se actualiza cada vez que se suben documentos nuevos.",
        screens: [2, 3],
      },
      {
        title: "Pasaporte",
        text: "Los datos se recogen automáticamente de fotos o de un PDF del pasaporte. Se pueden subir varios pasaportes, elegir el principal y editar cualquier campo.",
        screens: [4, 5],
      },
      {
        title: "Documentos",
        text: "El usuario sube fotos o PDF. La IA extrae los datos, rellena todos los campos y escribe un resumen breve. No hace falta nada más: las notas son opcionales.",
        screens: [6, 7],
      },
      {
        title: "Vacunas",
        text: "Los datos se extraen primero de las fotos del pasaporte. Las vacunas nuevas se añaden en cualquier momento subiendo fotos: la IA extrae los datos y marca las que están a punto de caducar.",
        screens: [8, 9],
      },
      {
        title: "Paquetes de documentos",
        text: "Los documentos se agrupan para el veterinario u otra persona y se comparten por enlace o código QR, o se descargan en un solo PDF. Cualquiera puede abrir el enlace público, elegir su idioma y obtener una traducción completa, títulos incluidos. Los originales no cambian.",
        screens: [10, 11],
      },
      {
        title: "Perfil",
        text: "Varias mascotas y cambio rápido entre ellas. Aquí también se descargan todos los datos en un archivo, se elige el idioma de la app, se desactiva una mascota o se elimina la cuenta.",
        screens: [12, 13],
      },
    ],
    result:
      "En beta abierta. Del documento fotografiado al envío al veterinario, todo ocurre en un solo servicio. El procesamiento automático se encarga de la rutina; las decisiones médicas siguen en manos del veterinario.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Supabase",
      "API de Claude y Gemini",
      "Playwright",
    ],
    cover: { desktop: 0 },
    strip: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  gridfin: {
    title: "Gridfin",
    kind: "Producto del estudio",
    line: "Un starter para desarrollar con Claude Code: de una idea a una aplicación funcional y con tests en una hora",
    website: "https://ludvik4.dev/gridfin/es",
    websiteLabel: "Abrir la landing",
    note: "El kit se entrega bajo petición y el acceso anticipado ya está abierto.",
    layout: "landing",
    lead: "Un starter para desarrollar con Claude Code. Un solo comando en el terminal te lleva de una idea a una aplicación funcional con tests en una hora. Incluye una arquitectura lista, reglas de ingeniería y controles de calidad que el agente sigue en cada paso.",
    task: "Conseguir que Claude Code construya aplicaciones con arquitectura, tests y un proceso como los de un equipo de ingeniería, no prototipos de una tarde.",
    points: [
      {
        title: "Arranque con un comando",
        text: "El comando /gridfin pregunta por la idea, escribe el brief del producto y las primeras especificaciones, y adapta la plantilla al proyecto: nombre, esquema de datos y datos de demostración.",
        screens: [],
      },
      {
        title: "Una funcionalidad, de la especificación al commit",
        text: "El comando /feature construye una funcionalidad de principio a fin: especificación, plan de cambios, código, tests obligatorios, comprobaciones y commit.",
        screens: [],
      },
      {
        title: "Controles de calidad",
        text: "Los linters, la comprobación de tipos y los tests unitarios, de componentes, de integración y end-to-end se ejecutan con un solo comando. El agente respalda cada resultado con la salida del comando.",
        screens: [],
      },
      {
        title: "Revisión y diseño",
        text: "El comando /review revisa los cambios según las reglas del proyecto y busca errores; /design muestra 3–5 variantes de pantalla en el navegador y recuerda la elegida.",
        screens: [],
      },
      {
        title: "Landing",
        text: "Una página de venta en varios idiomas: el problema, el proceso paso a paso, qué incluye el kit, para quién es y un formulario para pedir acceso anticipado.",
        screens: [],
      },
    ],
    result:
      "La landing está publicada en varios idiomas y el acceso anticipado está abierto. Usamos el kit en nuestros propios proyectos.",
    stack: [
      "Claude Code",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Vitest",
      "Playwright",
    ],
    cover: { desktop: 0, mobile: 1 },
    strip: [0, 1, 2],
  },
  "secret-santa": {
    title: "Secret Santa",
    kind: "Aplicación web",
    line: "Un Amigo Invisible online para vecinos, compañeros y amigos: el sorteo, la entrega de regalos y la revelación de los Santas",
    layout: "story",
    lead: "Un Amigo Invisible online para vecinos, compañeros y amigos. La organización invita a los participantes por enlace o código QR y hace el sorteo con un botón; los correos, los recordatorios, la entrega de regalos y la revelación corren por cuenta del servicio.",
    task: "Organizar un Amigo Invisible para un grupo grande de personas que hablan idiomas distintos y apenas se conocen: sin hojas de cálculo ni chats, con un sorteo secreto de verdad y sin que nadie se quede sin regalo.",
    points: [
      {
        title: "Página promocional",
        text: "Qué es el juego, para quién es (amigos, una oficina, un equipo remoto, vecinos) y cómo funciona: los pasos para la organización y para los participantes.",
        screens: [0, 1],
      },
      {
        title: "Ficha",
        text: "Nombre, dirección de entrega, una foto opcional, deseos y qué no regalar. Una persona adulta puede añadir a sus hijos a su cuenta. Los deseos se traducen automáticamente a los demás idiomas de la interfaz, cinco en total: español, inglés, alemán, ruso y ucraniano.",
        screens: [2, 3],
      },
      {
        title: "Cuenta del participante",
        text: "Muestra en qué fase está el juego: antes del sorteo, el estado de la ficha y la fecha del sorteo; después, el destinatario y los días que faltan para el intercambio; durante el intercambio, el regalo que te espera. Si en una cuenta hay varios participantes, muestra quién juega ahora.",
        screens: [4],
      },
      {
        title: "Entrega del regalo",
        text: "El Santa indica dónde ha dejado el regalo y puede añadir una nota anónima. Una vez marcada, la entrega ya no se puede cambiar. El destinatario recibe al momento un correo con el lugar y la nota y, si el regalo no está, lo avisa con un clic.",
        screens: [5, 6],
      },
      {
        title: "Adivina tu Santa",
        text: "Durante el intercambio, cada participante puede intentar adivinar quién es su Santa y cambiar su respuesta. El 1 de enero se revelan los Santas y cada uno ve si ha acertado.",
        screens: [7],
      },
      {
        title: "Muro de agradecimientos",
        text: "Un muro de mensajes de agradecimiento con fotos de los regalos, abierto durante el intercambio. Las fotos se abren a pantalla completa y los mensajes también se traducen automáticamente al idioma de quien los lee.",
        screens: [8, 9],
      },
      {
        title: "Administración y sorteo",
        text: "La organización revisa las inscripciones y hace el sorteo con un botón. El algoritmo se asegura de que nadie regale a alguien de su propia familia y de que los niños regalen a otros niños. Nadie ve las parejas: ni en la administración ni en los correos. Si alguien se da de baja, la cadena se cierra sola, y un Santa de reserva ayuda a quien se quede sin regalo.",
        screens: [10],
      },
    ],
    result:
      "Ahora mismo hay un juego en marcha: las inscripciones están abiertas y el sorteo es en diciembre. Cinco idiomas, correos en cada fase, Santas de reserva y un panel para la organización. Al terminar el juego, todos los datos se borran automáticamente.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Drizzle",
      "Postgres",
      "next-auth",
      "Groq",
    ],
    cover: { desktop: 0, mobile: 1 },
    strip: [0, 1, 2, 3, 4, 5, 6],
  },
  "qa-pilot": {
    title: "qa-pilot",
    kind: "Plugin de IA",
    line: "Un plugin de QA abierto para Claude Code: un plan de tests por tarea, auditorías de requisitos y de tests, y tests que demuestran que pueden fallar",
    website: "https://ludvik4.dev/qa-pilot",
    websiteLabel: "Abrir la landing (en inglés)",
    note: "El plugin es de código abierto, con el código en GitHub. Se instala con dos comandos en Claude Code.",
    layout: "brief",
    lead: "Un plugin de Claude Code que convierte el testing en un proceso repetible. El agente planifica las comprobaciones antes de escribir código, verifica la tarea después, escribe los tests según las reglas del proyecto y hace auditorías. Cada conclusión va respaldada por un enlace al código o al requisito.",
    task: "Los agentes de IA escriben tests rápido, pero esos tests suelen ser superficiales, abusan de los mocks y pasan sea cual sea el comportamiento. Necesitábamos un proceso en el que el agente pruebe como un QA con experiencia y el resultado se pueda comprobar.",
    points: [
      {
        title: "Perfil del proyecto",
        text: "El comando /qa-pilot:onboard estudia una vez el stack, los niveles de tests, los comandos y la CI, pregunta por lo que no está en el código (entornos seguros, flujos críticos) y escribe un perfil que leen los demás comandos.",
        screens: [],
      },
      {
        title: "QA en cada tarea",
        text: "Antes del desarrollo, /qa-pilot:test prepara un plan de tests y busca huecos en los requisitos; después, verifica la tarea, recorre los flujos en el navegador y escribe los tests del plan.",
        screens: [],
      },
      {
        title: "Auditorías",
        text: "El comando /qa-pilot:audit evalúa todo el proyecto, los requisitos de una funcionalidad o el código de los tests, donde busca falsos verdes, tests inestables y duplicados. El resultado es una lista de trabajo priorizada.",
        screens: [],
      },
      {
        title: "Un test tiene que poder fallar",
        text: "Cada test nuevo se comprueba: el agente rompe el código bajo prueba, ve el fallo y revierte el cambio. El resultado esperado sale de la especificación o del requisito, no del propio código.",
        screens: [],
      },
      {
        title: "Prioridad por riesgo",
        text: "Los hallazgos se dividen en Must, Should y Highlight según su impacto en el producto, no según el porcentaje de cobertura. Should admite como máximo ocho, así que la lista se puede terminar de verdad.",
        screens: [],
      },
      {
        title: "Base de reglas y scripts",
        text: "Más de 1300 reglas de testing contrastadas con estándares (ISTQB, OWASP, W3C, NIST). Unos scripts sin LLM seleccionan las reglas adecuadas para el producto, validan los informes y comprueban el perfil contra el repositorio.",
        screens: [],
      },
    ],
    result:
      "El plugin está publicado en GitHub y en su propia landing. Los planes, informes y tests se guardan como archivos en el repositorio del usuario, y una sesión interrumpida se puede retomar.",
    stack: ["Claude Code", "Skills y agentes", "Playwright MCP", "Python"],
    cover: { desktop: 0, mobile: 1 },
    strip: [0, 1],
  },
};

const enGalleries = Object.fromEntries(
  DEV_CASE_SLUGS.map((slug) => [
    slug,
    { ...enTexts[slug], screens: caseScreensEn[slug] },
  ]),
) as Record<DevCaseSlug, CaseGallery>;

/**
 * ludvik4.dev/es: the Spanish texts and screens. qa-pilot has only an English
 * landing, so its screens are the English ones (case-screens-es.ts points at
 * public/cases/qa-pilot/en/).
 */
const esGalleries = Object.fromEntries(
  DEV_CASE_SLUGS.map((slug) => [
    slug,
    { ...esTexts[slug], screens: caseScreensEs[slug] },
  ]),
) as Record<DevCaseSlug, CaseGallery>;

/**
 * ludvik4.dev/ru: the RU texts and screens, except Gridfin and qa-pilot —
 * their landings on ludvik4.dev are English, so they keep the English
 * screens (with Russian captions) and link to the .dev landings.
 */
const devRuGalleries = Object.fromEntries(
  DEV_CASE_SLUGS.map((slug) => {
    const ru = caseGalleries[slug];
    if (slug !== "gridfin" && slug !== "qa-pilot") return [slug, ru];
    return [
      slug,
      {
        ...ru,
        website: enTexts[slug].website,
        screens: caseScreensEn[slug].map((s, i) => ({
          ...s,
          caption: ru.screens[i]!.caption,
        })),
      },
    ];
  }),
) as Record<DevCaseSlug, CaseGallery>;

export type CaseSite = {
  /** The storefront: which canonical host the URLs belong to. */
  market: "ru" | "en";
  /** The language prefix on ludvik4.dev: "", "/es" or "/ru". */
  prefix: string;
  /** The works index path (without the prefix). */
  basePath: "/cases" | "/work";
  slugs: readonly CaseSlug[];
  galleries: Partial<Record<CaseSlug, CaseGallery>>;
  ui: CaseUi;
  content: MarketContent;
  /** Description and card image for structured data. */
  seo: (slug: CaseSlug) => { description: string; image: string };
};

const coverImage = (g: CaseGallery) => g.screens[g.cover.desktop]!.thumb.src;

export const ruCaseSite: CaseSite = {
  market: "ru",
  prefix: "",
  basePath: "/cases",
  slugs: caseStudies.map((study) => study.slug),
  galleries: caseGalleries,
  ui: ruCaseUi,
  content: getMarketContent("ru"),
  seo: (slug) => {
    const study = getCaseStudy(slug)!;
    return { description: study.description, image: study.image };
  },
};

export const enCaseSite: CaseSite = {
  market: "en",
  prefix: "",
  basePath: "/work",
  slugs: DEV_CASE_SLUGS,
  galleries: enGalleries,
  ui: enCaseUi,
  content: getLocaleBundle("en").content,
  seo: (slug) => {
    const g = enGalleries[slug as DevCaseSlug];
    return { description: g.line, image: coverImage(g) };
  },
};

export const esCaseSite: CaseSite = {
  market: "en",
  prefix: "/es",
  basePath: "/work",
  slugs: DEV_CASE_SLUGS,
  galleries: esGalleries,
  ui: esCaseUi,
  content: getLocaleBundle("es").content,
  seo: (slug) => {
    const g = esGalleries[slug as DevCaseSlug];
    return { description: g.line, image: coverImage(g) };
  },
};

export const devRuCaseSite: CaseSite = {
  market: "en",
  prefix: "/ru",
  basePath: "/work",
  slugs: DEV_CASE_SLUGS,
  galleries: devRuGalleries,
  ui: ruCaseUi,
  content: getLocaleBundle("ru").content,
  seo: (slug) => {
    const g = devRuGalleries[slug as DevCaseSlug];
    return { description: g.line, image: coverImage(g) };
  },
};

export function caseSiteHref(site: CaseSite, slug?: CaseSlug): string {
  return `${site.prefix}${site.basePath}${slug ? `/${slug}` : ""}`;
}

export function getCaseGallery(
  site: CaseSite,
  slug: string,
): CaseGallery | undefined {
  return site.slugs.includes(slug as CaseSlug)
    ? site.galleries[slug as CaseSlug]
    : undefined;
}
