// The works gallery (/cases on ludvik4.ru, /work and /ru/work on ludvik4.dev):
// which works each storefront shows, their texts and screens, and the page
// chrome in its language. Views: case-pages.tsx. Spec:
// docs/superpowers/specs/2026-11-17-works-gallery-en.md.
import { type CaseGallery, caseGalleries } from "./case-gallery";
import { caseScreensEn } from "./case-screens-en";
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
  lang: "ru" | "en";
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

const enGalleries = Object.fromEntries(
  DEV_CASE_SLUGS.map((slug) => [
    slug,
    { ...enTexts[slug], screens: caseScreensEn[slug] },
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
  /** The language prefix on ludvik4.dev: "" or "/ru". */
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
