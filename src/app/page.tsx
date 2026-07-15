import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/features/lead";
import { env } from "@/lib/env";

const LINKEDIN_URL = "https://www.linkedin.com/in/kate-pustovaia/";
const TELEGRAM_URL = "https://t.me/ludvik4";

const services = [
  {
    module: "Module / Sites",
    title: "Сайты",
    body: "Лендинги, промо- и персональные сайты, корпоративные страницы — быстрые, адаптивные, готовые к SEO",
  },
  {
    module: "Module / SaaS",
    title: "Веб-приложения и SaaS",
    body: "Продукты с логикой, аккаунтами и оплатой — SaaS по подписке прямо в браузере: трекер, дашборд, CRM-лайт, внутренний инструмент",
  },
  {
    module: "Module / AI Kit",
    title: "AI-инструменты и плагины",
    body: "Инструменты для команд и тех, кто пишет код с AI: плагины для AI-ассистентов, стартер-паки, утилиты и интеграции",
  },
  {
    module: "Module / Auto",
    title: "Автоматизация",
    body: "Рутина уходит в скрипты, боты и связки между сервисами: сбор и обработка данных, отчёты, интеграции — а где уместно, с AI поверх готовых моделей",
  },
];

const formats = ["Под ключ", "От идеи до MVP", "Миграция легаси"];

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
    <p className="text-primary mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
      {children}
    </p>
  );
}

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={className}>
      <div className="border-pink-soft mx-auto max-w-5xl border-t px-6 py-14">
        {children}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top bar */}
      <header className="border-pink-soft bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <span className="font-mono text-sm font-bold tracking-tight">
            Ludvik4
          </span>
          <Button asChild size="sm">
            <Link href="#contact">Обсудить задачу</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Eyebrow>Ludvik4</Eyebrow>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          Цифровые продукты — от идеи до запуска
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-lg">
          Сайты, веб-приложения и SaaS, плагины, автоматизация рутины — довожу
          до готового продукта
        </p>
        <div className="mt-7">
          <Button asChild size="lg">
            <Link href="#contact">Обсудить задачу</Link>
          </Button>
        </div>
      </div>

      {/* Services */}
      <Section id="services">
        <Eyebrow>Что делаю</Eyebrow>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="border-border bg-card rounded-2xl border p-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="bg-primary/50 h-px w-8" />
                <span className="font-mono text-[10px] tracking-wider text-[#9ca3af] uppercase">
                  {s.module}
                </span>
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {formats.map((f) => (
            <span
              key={f}
              className="border-border text-muted-foreground rounded-full border px-3 py-1 font-mono text-xs"
            >
              {f}
            </span>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <Eyebrow>Как это работает</Eyebrow>
        <p className="max-w-2xl text-xl font-semibold tracking-tight text-balance">
          Вы приходите с идеей или болью — я предлагаю, как её решить
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n}>
              <span className="text-primary font-mono text-sm font-bold">
                {step.n}
              </span>
              <h3 className="mt-2 font-bold">{step.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section>
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
          className="text-foreground mt-4 inline-block font-mono text-sm font-bold underline underline-offset-4"
        >
          LinkedIn →
        </a>
      </Section>

      {/* Contact */}
      <section id="contact" className="bg-surface-warm">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:grid-cols-2">
          <div>
            <Eyebrow>Контакт</Eyebrow>
            <h2 className="text-2xl font-bold tracking-tight">
              Расскажите, что нужно
            </h2>
            <p className="text-muted-foreground mt-3 max-w-sm">
              Опишите задачу — предложу решение и подскажу, с чего начать
            </p>
            <p className="mt-6 font-mono text-sm">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                Или напишите в Telegram → t.me/ludvik4
              </a>
            </p>
          </div>
          <div className="border-border bg-card rounded-2xl border p-6 shadow-[0_14px_40px_-24px_rgba(26,26,26,0.18)]">
            <LeadForm turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-warm">
        <div className="text-muted-foreground mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-6 font-mono text-sm">
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
