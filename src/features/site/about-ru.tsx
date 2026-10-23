import { Button } from "@/components/ui/button";
import { getMarketContent } from "./content";
import { CtaLink } from "./cta-link";
import { SiteFooter, SiteHeader } from "./site-chrome";

const ru = getMarketContent("ru");

// Russian About page: the EN About (international-pages.tsx) adapted to the RU
// positioning — one independent developer, specialists only when the scope
// needs them. Draft copy, awaiting the owner's approval.
const SECTIONS = [
  {
    title: "Прямая связь и понятный объём работ",
    body: "Вы общаетесь напрямую с тем, кто принимает продуктовые и технические решения. Я превращаю идею или операционную проблему в письменный объём работ, заранее проговариваю допущения и привязываю работу к измеримому результату, а не к растущему списку функций.",
  },
  {
    title: "Небольшой по замыслу — не ограниченный одной специальностью",
    body: "Ludvik4 остаётся проектом одного человека. Проверенные специалисты подключаются, только когда этого требует согласованная задача; ответственность и ежедневная связь при этом остаются у меня.",
  },
  {
    title: "Инженерная дисциплина, а не AI-магия",
    body: "AI — часть инструментов наравне со спецификациями, контролем версий, автотестами, ревью и проверками перед выкладкой. Открытый проект qa-pilot показывает, как эти проверки работают на практике.",
  },
];

export function AboutRuView() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={ru} />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="text-stage-muted font-mono text-xs tracking-[0.14em] uppercase">
              О Ludvik4
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Один исполнитель — от задачи до запуска
            </h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
              Я проектирую и разрабатываю сайты, автоматизации бизнес-процессов
              и веб-приложения для основателей и небольших команд. У каждого
              проекта один ответственный — от первой формулировки задачи до
              запуска и передачи.
            </p>
          </div>
          <div className="mt-14 grid max-w-3xl gap-12">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {section.title}
                </h2>
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
        <section className="bg-surface-warm">
          <div className="mx-auto max-w-3xl px-6 py-14 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Обсудить похожий проект
            </h2>
            <p className="text-muted-foreground mt-3">
              Опишите задачу, текущую ситуацию и нужный результат — предложу
              разумный первый шаг.
            </p>
            <Button asChild size="lg" className="mt-6">
              <CtaLink href="/contact" placement="service">
                Обсудить проект
              </CtaLink>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter content={ru} />
    </div>
  );
}
