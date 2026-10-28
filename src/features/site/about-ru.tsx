import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMarketContent } from "./content";
import { OrderCta } from "./order-cta";
import { Eyebrow, SiteFooter, SiteHeader } from "./site-chrome";

const ru = getMarketContent("ru");

// Russian About page, in the studio's voice (owner, 2026-10-28): one person
// responsible for the project, specialists brought in when the task needs
// them, and the client pays for the result, not for who did what.
const SECTIONS = [
  {
    title: "Прямая связь и понятный объём работ",
    body: "Вы общаетесь напрямую с руководителем проекта — он принимает продуктовые и технические решения и отвечает за результат. Мы превращаем идею или операционную проблему в письменный объём работ, заранее проговариваем допущения и привязываем работу к измеримому результату, а не к растущему списку функций.",
  },
  {
    title: "Нужные специалисты подключаются под задачу",
    body: "Когда проекту нужна дополнительная экспертиза, мы подключаем проверенных специалистов. Кого позвать, как распределить работу и как всё скоординировать — решаем сами. Для вас остаются один контакт, единый план и готовый результат.",
  },
  {
    title: "Инженерная дисциплина, а не AI-магия",
    body: "AI помогает нам работать быстрее, а качество держится на проверенных инженерных практиках: подробном техническом задании, автотестах, проверке кода второй парой глаз и тестировании перед каждым обновлением. Поэтому сайт или приложение надёжно работает и после запуска.",
  },
];

export function AboutRuView() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={ru} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="max-w-3xl">
            <Eyebrow>О студии</Eyebrow>
            {/* The home's two-tone title: the promise, its second half in
                the accent colour. */}
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              Вы ставите задачу —{" "}
              <span className="text-primary inline-block">
                мы доводим её до запуска
              </span>
            </h1>
            <p className="text-stage-muted mt-6 text-lg leading-relaxed">
              Ludvik4 — студия веб-разработки. Мы проектируем и делаем сайты,
              автоматизации бизнес-процессов и веб-приложения для частных
              специалистов, небольших команд и компаний. У каждого проекта один
              ответственный — от первой формулировки задачи до запуска и
              передачи.
            </p>
          </div>
          {/* Numbered like the home's "Как это работает": pink numerals on a
              soft rule. */}
          <div className="mt-16 grid max-w-3xl gap-14">
            {SECTIONS.map((section, i) => (
              <section key={section.title}>
                <div className="flex items-center gap-4">
                  <span className="text-primary text-5xl leading-none font-semibold tracking-tighter">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="bg-pink-soft h-px flex-1"
                  />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  {section.title}
                </h2>
                <p className="text-stage-muted mt-3 leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
            {/* The blog stays live and indexed, but off the home and menu:
                this is its one entry point on the site (owner, 2026-10-24). */}
            <section className="border-pink-soft rounded-2xl border bg-white/60 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight">Блог</h2>
              <p className="text-stage-muted mt-3 leading-relaxed">
                Пишем о разработке с AI, автоматизации и запуске продуктов.
              </p>
              <Link
                href={"/blog" as Route}
                className="text-primary hover:text-primary/80 mt-4 inline-block text-sm font-medium transition-colors"
              >
                Читать блог →
              </Link>
            </section>
          </div>
        </div>
        <section className="bg-surface-warm">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Обсудить похожий проект
            </h2>
            <p className="text-muted-foreground mt-3">
              Опишите задачу, текущую ситуацию и нужный результат — предложим
              разумный первый шаг.
            </p>
            <Button asChild size="lg" className="mt-6">
              <OrderCta placement="service">Обсудить проект</OrderCta>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter content={ru} />
    </div>
  );
}
