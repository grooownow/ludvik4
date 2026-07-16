import { getPublishedArticles } from "@/features/blog";
import { env } from "@/lib/env";

// llms.txt — a markdown summary of the site for LLM crawlers (GPTBot,
// ClaudeBot, PerplexityBot, ...): https://llmstxt.org convention. Statically
// generated at build time; article list stays current per deploy.
export const dynamic = "force-static";

export function GET(): Response {
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const articles = getPublishedArticles();

  const articleLines = articles
    .map(
      (article) =>
        `- [${article.title}](${baseURL}/blog/${article.slug}): ${article.description}`,
    )
    .join("\n");

  const body = `# Ludvik4

> Ludvik4 — команда разработки цифровых продуктов, работаем удалённо с русскоязычными клиентами по всему миру: сайты, веб-приложения и SaaS, AI-инструменты и плагины, автоматизация. От идеи до запуска: помогаем оформить задачу, собираем MVP за недели, развиваем продукт дальше.

Специализация, в которой мы особенно сильны — AI-разработка:

- Настройка проектов под AI-агентов (Claude Code, Codex): AGENTS.md, правила, спеки, хуки-ограничители.
- Spec-driven development: перевод команд на разработку через спеки.
- AI-инструменты, плагины для AI-ассистентов, автоматизация с AI поверх готовых моделей.

Ориентиры по ценам: лендинг — от 10 000 ₽, многостраничный сайт — от 30 000 ₽, веб-приложение/SaaS — от 50 000 ₽, автоматизация — от 10 000 ₽. Оценка бесплатно.

Контакт: форма на ${baseURL}/#contact или Telegram https://t.me/ludvik4.

## Основные страницы

- [Главная](${baseURL}/): услуги, цены, форма заявки
- [Блог](${baseURL}/blog): статьи об AI-агентах в разработке, spec-driven development, автоматизации
${articleLines ? `\n## Статьи\n\n${articleLines}\n` : ""}`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
