import { getPublishedArticles } from "@/features/blog";
import { env } from "@/lib/env";

// llms.txt — a markdown summary of the site for LLM crawlers (GPTBot,
// ClaudeBot, PerplexityBot, ...): https://llmstxt.org convention. Statically
// generated at build time. Market-scoped: the RU build lists the blog +
// articles; the EN build describes the international studio without them.
export const dynamic = "force-static";

function ruBody(baseURL: string): string {
  const articles = getPublishedArticles();
  const articleLines = articles
    .map((a) => `- [${a.title}](${baseURL}/blog/${a.slug}): ${a.description}`)
    .join("\n");

  return `# Ludvik4

> Ludvik4 — студия цифровых продуктов: проектируем и запускаем сайты, автоматизации бизнес-процессов и компактные веб-приложения с законченным пользовательским сценарием. За проектом закреплена единая точка ответственности, а профильные специалисты подключаются по необходимости.

Три направления работы:

- Сайт или лендинг: опубликованный адаптивный сайт с одним понятным целевым действием.
- Автоматизация одного бизнес-процесса: перенос ручного процесса в контролируемый workflow — скрипты, интеграции, боты, AI.
- MVP одного ключевого сценария или компактный SaaS: небольшое приложение вокруг одной задачи и одного законченного пути пользователя.

Специализация — AI-разработка: настройка проектов под AI-агентов (Claude Code, Codex): AGENTS.md, правила, спеки; spec-driven development. Оценка бесплатно.

Контакт: Telegram https://t.me/ludvik4.

## Основные страницы

- [Главная](${baseURL}/): услуги, цены, контакт
- [Блог](${baseURL}/blog): статьи об AI-агентах в разработке, spec-driven development, автоматизации
${articleLines ? `\n## Статьи\n\n${articleLines}\n` : ""}`;
}

function enBody(baseURL: string): string {
  return `# Ludvik4

> Ludvik4 is a founder-led product studio working with clients worldwide: focused websites, business automations, and compact web applications with a complete user journey. One point of accountability per project; trusted specialists are brought in when the scope needs them.

Three services:

- Website or landing page: a published, responsive site with one clear call to action.
- One business workflow automation: a repetitive manual process moved into a controlled workflow — scripts, integrations, bots, AI.
- Focused MVP or compact SaaS: a small web app around one core task and one complete user journey.

Focus: AI-assisted development — AGENTS.md, project rules and spec-driven development, plus open-source tooling such as qa-pilot.

Contact: Telegram https://t.me/ludvik4.

## Main pages

- [Home](${baseURL}/): services and contact
`;
}

export function GET(): Response {
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const body = env.SITE_MARKET === "ru" ? ruBody(baseURL) : enBody(baseURL);

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
