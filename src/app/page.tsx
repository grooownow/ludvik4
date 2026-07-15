import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/features/lead";
import { env } from "@/lib/env";

const LINKEDIN_URL = "https://www.linkedin.com/in/kate-pustovaia/";
const TELEGRAM_URL = "https://t.me/ludvik4";

const services = [
  {
    title: "Сайты",
    body: "Лендинги, промо- и персональные сайты, корпоративные страницы. Быстрые, адаптивные, готовые к SEO.",
  },
  {
    title: "Веб-приложения и SaaS",
    body: "Продукты с логикой, аккаунтами и оплатой. SaaS — сервис по подписке прямо в браузере: трекер, дашборд, CRM-лайт, внутренний инструмент.",
  },
  {
    title: "AI-инструменты и плагины",
    body: "Инструменты для команд и тех, кто пишет код с AI: плагины для AI-ассистентов, стартер-паки, утилиты и интеграции.",
  },
  {
    title: "Автоматизация",
    body: "Рутина уходит в скрипты, боты и связки между сервисами: сбор и обработка данных, отчёты, интеграции. Где уместно — с AI поверх готовых моделей.",
  },
];

const formats = [
  "Под ключ",
  "От идеи до MVP",
  "Усиление команды (frontend / fullstack)",
  "Миграция легаси",
];

const steps = [
  {
    n: "01",
    title: "Не нужно готового ТЗ",
    body: "Расскажете, что хочется или что не так, — я предложу варианты и придумаю решение под вас. Задачу и результат опишем вместе.",
  },
  {
    n: "02",
    title: "Оптимальный MVP",
    body: "Рабочая версия в короткий срок, которая снимает острую боль.",
  },
  {
    n: "03",
    title: "Формат под вас",
    body: "Разовый продукт, развитие или поддержка с доработками. Под смежные задачи — дизайн, бренд, видео, анимацию — подключаю нужных специалистов.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
      {children}
    </p>
  );
}

export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top bar */}
      <header className="border-border/60 bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <span className="font-mono text-sm font-semibold tracking-tight">
            Ludvik4
          </span>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href="#contact">Обсудить задачу</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* Hero */}
        <section className="py-20 sm:py-28">
          <Eyebrow>Ludvik4</Eyebrow>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Веб-продукты — от идеи до релиза.
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg">
            Сайты, веб-приложения и SaaS, плагины, автоматизация рутины — довожу
            до рабочего релиза.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button asChild size="lg">
              <Link href="#contact">Обсудить задачу</Link>
            </Button>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="border-border/60 border-t py-16">
          <Eyebrow>Что делаю</Eyebrow>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                className="border-border bg-card rounded-xl border p-6"
              >
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* Formats strip */}
          <div className="mt-6 flex flex-wrap gap-2">
            {formats.map((f) => (
              <span
                key={f}
                className="border-border text-muted-foreground rounded-full border px-3 py-1 text-xs"
              >
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-border/60 border-t py-16">
          <Eyebrow>Как это работает</Eyebrow>
          <p className="max-w-2xl text-xl font-medium tracking-tight text-balance">
            Вы приходите с идеей или болью — я предлагаю, как её решить.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n}>
                <span className="text-muted-foreground font-mono text-sm">
                  {step.n}
                </span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="border-border/60 border-t py-16">
          <Eyebrow>Кто за этим стоит</Eyebrow>
          <p className="max-w-2xl text-lg leading-relaxed text-pretty">
            За Ludvik4 — инженер с более чем 10-летним опытом в вебе: от
            продуктовой команды в крупном финтехе до собственных приложений.
            Techlead за плечами, глубоко в современном фронтенде, fullstack и
            AI-инструментах. Строю быстро, но не на выброс.
          </p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground mt-4 inline-block text-sm underline underline-offset-4"
          >
            LinkedIn →
          </a>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="border-border/60 grid gap-10 border-t py-16 sm:grid-cols-2"
        >
          <div>
            <Eyebrow>Контакт</Eyebrow>
            <h2 className="text-2xl font-semibold tracking-tight">
              Расскажите, что нужно
            </h2>
            <p className="text-muted-foreground mt-3 max-w-sm">
              Опишите задачу — предложу решение и подскажу, с чего начать.
            </p>
            <p className="text-muted-foreground mt-6 text-sm">
              Или напишите в{" "}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                Telegram → t.me/ludvik4
              </a>
            </p>
          </div>
          <LeadForm turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border/60 border-t">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 text-sm">
          <span>© 2026 Ludvik4</span>
          <div className="flex gap-4">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Telegram
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
