import { getPublishedArticles } from "@/features/blog";
import {
  caseStudies,
  internationalGuides,
  internationalServicePages,
  internationalWork,
  publicUrl,
  servicePages,
} from "@/features/site";
import { env } from "@/lib/env";

// llms.txt — a markdown summary of the site for LLM crawlers (GPTBot,
// ClaudeBot, PerplexityBot, ...): https://llmstxt.org convention. Statically
// generated at build time. Market-scoped: the RU build lists the blog +
// articles; the EN build describes the international studio without them.
export const dynamic = "force-static";

function ruBody(baseURL: string): string {
  const articles = getPublishedArticles();
  const articleLines = articles
    .map(
      (a) =>
        `- [${a.title}](${publicUrl("ru", baseURL, `/blog/${a.slug}`)}): ${a.description}`,
    )
    .join("\n");
  const serviceLines = servicePages
    .map(
      (service) =>
        `- [${service.title}](${publicUrl("ru", baseURL, `/uslugi/${service.slug}`)}): ${service.description}`,
    )
    .join("\n");
  const caseLines = caseStudies
    .map(
      (study) =>
        `- [${study.title}](${publicUrl("ru", baseURL, `/cases/${study.slug}`)}): ${study.description}`,
    )
    .join("\n");

  return `# Ludvik4

> Ludvik4 — независимый проект по разработке сайтов, автоматизаций бизнес-процессов и MVP веб-приложений для малого бизнеса и основателей. Каждый проект ведётся от постановки задачи до запуска с единой точкой ответственности.

Три направления работы:

- Сайт или лендинг: опубликованный адаптивный сайт с одним понятным целевым действием.
- Автоматизация бизнес-процессов: повторяющиеся ручные процессы переносятся в контролируемые workflow — скрипты, интеграции, боты, AI.
- Веб-приложение или компактный SaaS: приложение под одну ключевую задачу с законченным сценарием пользователя.

AI-инструменты и spec-driven development используются как метод работы, а блог и open-source продукт qa-pilot показывают практическую экспертизу в этой области.

Контакт: Telegram https://t.me/ludvik4work.

## Основные страницы

- [Главная](${baseURL}/): услуги, цены, кейсы и контакт
- [Кейсы](${publicUrl("ru", baseURL, "/cases")}): публичные примеры работ
- [Блог](${publicUrl("ru", baseURL, "/blog")}): статьи об AI-агентах в разработке, spec-driven development, автоматизации
${serviceLines ? `\n## Услуги\n\n${serviceLines}\n` : ""}
${caseLines ? `\n## Кейсы\n\n${caseLines}\n` : ""}
${articleLines ? `\n## Статьи\n\n${articleLines}\n` : ""}`;
}

function enBody(baseURL: string): string {
  const serviceLines = internationalServicePages
    .map(
      (service) =>
        `- [${service.title}](${publicUrl("en", baseURL, `/services/${service.slug}`)}): ${service.description}`,
    )
    .join("\n");
  const workLines = internationalWork
    .map(
      (item) =>
        `- [${item.title}](${publicUrl("en", baseURL, `/work/${item.slug}`)}): ${item.description}`,
    )
    .join("\n");
  const guideLines = internationalGuides
    .map(
      (guide) =>
        `- [${guide.title}](${publicUrl("en", baseURL, `/guides/${guide.slug}`)}): ${guide.description}`,
    )
    .join("\n");

  return `# Ludvik4

> Ludvik4 is a Europe-based, founder-led web product studio working with clients worldwide. It designs and builds focused websites, controlled business workflow automations, MVPs, and custom web applications. One point of accountability leads each project from discovery through launch.

Three services:

- Website or landing page: a published, responsive site with one clear call to action.
- Business workflow automation: repetitive manual processes moved into controlled workflows — scripts, integrations, bots, AI.
- Web app or compact SaaS: a small app around one core task with a complete user journey.

Delivery model: direct founder communication, written scope, production-ready delivery, source-code handover, and trusted specialists only when the agreed work needs them.

Engineering approach: AI assists research, implementation, testing, and review inside a process with specifications, version control, automated tests, and quality gates. The public qa-pilot project demonstrates this approach.

Contact: Telegram https://t.me/ludvik4work.

## Main pages

- [Home](${baseURL}/): positioning, services, process, proof, FAQ, and contact
- [Selected work](${publicUrl("en", baseURL, "/work")}): public evidence and case studies
- [Planning guides](${publicUrl("en", baseURL, "/guides")}): practical decision tools for website, automation, and MVP projects
- [About](${publicUrl("en", baseURL, "/about")}): founder-led delivery model and engineering approach
- [Privacy](${publicUrl("en", baseURL, "/privacy")}): enquiry form data handling

## Services

${serviceLines}

## Public work

${workLines}

## Planning guides

${guideLines}

## Gridfin

- [Gridfin for Claude Code](${publicUrl("en", baseURL, "/gridfin/en")}): an Application Skeleton and enforced spec-driven workflow for focused products built with Claude Code
- [What is an Application Skeleton?](${publicUrl("en", baseURL, "/gridfin/en/docs/application-skeleton")}): the stack, rules, tests, quality gates, skills and playbooks that form Gridfin's architectural foundation
- [Why AI development needs engineering rules](${publicUrl("en", baseURL, "/gridfin/en/guides/why-ai-needs-engineering-rules")}): why instructions alone are insufficient and how hooks, proven-failing tests and gates make the workflow enforceable
`;
}

export function GET(): Response {
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const body = env.SITE_MARKET === "ru" ? ruBody(baseURL) : enBody(baseURL);

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
