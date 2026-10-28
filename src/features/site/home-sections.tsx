import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type HomeContent, type Market, workExhibitNumber } from "./content";
import { OrderCta } from "./order-cta";
import { HallCard, HallsStage } from "./hall-card";
import type { HomeExhibit } from "./home-exhibits";

// Sections of the exhibition home below the stage (docs/specs/immersive-home.md,
// mockup experiments/nevalyashka/ideas/page-flow.html). Minimal copy: the
// metaphor — halls, exhibits, a curator — carries the story.

function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-stage-muted font-mono text-xs tracking-[0.14em] uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Two-part heading on one line: the second half is the brand-pink accent. */
function Title({
  parts,
  narrow = false,
  long = false,
  twoLines = false,
}: {
  parts: [string, string];
  /** In a half-width column: a step smaller. It may wrap there (the RU
   *  About title would otherwise squeeze the portrait beside it). */
  narrow?: boolean;
  /** Russian full-width titles run longer than one line at the usual size
   *  (the work title runs ~21.5em): a step smaller on desktop, held
   *  on one line (they still wrap on phones). All RU section titles take it
   *  so they stay the same size. */
  long?: boolean;
  /** Phones: exactly two lines — the first part sized to the width, the
   *  accent whole on the second (the EN collection title). */
  twoLines?: boolean;
}) {
  return (
    <h2
      className={cn(
        "mt-3 text-4xl leading-[1.02] font-semibold tracking-tight text-balance",
        narrow
          ? "sm:text-5xl"
          : long
            ? "sm:text-5xl lg:text-[2.75rem] lg:whitespace-nowrap xl:text-[3.125rem]"
            : "sm:text-6xl",
        twoLines && "max-sm:text-[min(2.25rem,8.4vw)]",
      )}
    >
      {parts[0]}{" "}
      {/* In a narrow column the accent wraps as one piece ("от начала до
          конца." moves to its own line rather than leaving "от" behind). */}
      <span
        className={cn(
          "text-primary",
          narrow && "block sm:inline-block",
          twoLines && "max-sm:block",
        )}
      >
        {parts[1]}
      </span>
    </h2>
  );
}

function Band({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("border-pink-soft border-t", className)}>
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">{children}</div>
    </section>
  );
}

export function HomeCollection({
  copy,
  lang,
}: {
  copy: HomeContent["collection"];
  lang: Market;
}) {
  return (
    <HallsStage>
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <Title parts={copy.title} long={lang === "ru"} twoLines={lang === "en"} />
      <ul className="halls-grid mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.halls.map((hall, i) => (
          <HallCard key={hall.index} hall={hall} index={i} lang={lang} />
        ))}
      </ul>
    </HallsStage>
  );
}

export function HomeSteps({
  copy,
  lang,
}: {
  copy: HomeContent["steps"];
  lang: Market;
}) {
  return (
    <Band id="how-it-works">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <Title parts={copy.title} long={lang === "ru"} />
      <ol className="relative mt-14 grid gap-10 sm:grid-cols-3">
        <span
          aria-hidden="true"
          className="bg-pink-soft absolute inset-x-0 top-[2.1rem] hidden h-px sm:block"
        />
        {copy.items.map((step) => (
          <li key={step.n} className="relative">
            <span className="text-primary bg-background relative inline-block pr-4 text-6xl leading-none font-semibold tracking-tighter">
              {step.n}
            </span>
            <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
            <p className="text-stage-muted mt-2 text-sm leading-relaxed">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Band>
  );
}

export function HomeGallery({
  copy,
  exhibitEyebrow,
  lang,
  exhibits,
}: {
  copy: HomeContent["work"];
  exhibitEyebrow: string;
  lang: Market;
  exhibits: HomeExhibit[];
}) {
  const openLabel = lang === "ru" ? "Открыть" : "Open";
  const newWindowLabel =
    lang === "ru" ? "(откроется в новом окне)" : "(opens in a new window)";
  const aboutLabel = lang === "ru" ? "о проекте" : "about the project";
  // Odd count: the first exhibit spans two rows (big left, others stacked);
  // even count: an equal grid.
  const featureFirst = exhibits.length % 2 === 1;
  return (
    <Band id="work" className="bg-[#fff8fb]">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <Title parts={copy.title} long={lang === "ru"} />
      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        {exhibits.map((exhibit, i) => {
          const featured = featureFirst && i === 0;
          return (
            <div
              key={exhibit.slug}
              data-exhibit={exhibit.slug}
              className={cn(featured && "sm:row-span-2")}
            >
              {/* Two targets: the preview leads to the work's own page (the
                  image eases in on hover); the arrow in its corner, a slightly
                  larger hit area of its own, opens the live work in a new
                  window and is the only part that moves when aimed at. */}
              <div className="relative">
                <Link
                  href={exhibit.href as Route}
                  {...(exhibit.newTab
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={`${exhibit.name}: ${aboutLabel}`}
                  className="group/preview ring-pink-soft relative block rounded-md bg-white p-4 shadow-[0_14px_30px_rgba(214,40,130,0.10)] ring-1 transition-shadow duration-500 hover:shadow-[0_22px_48px_rgba(214,40,130,0.2)]"
                >
                  <span className="block overflow-hidden rounded-sm">
                    <Image
                      src={exhibit.image}
                      alt={exhibit.imageAlt}
                      width={1200}
                      height={675}
                      sizes="(min-width: 640px) 560px, 100vw"
                      className={cn(
                        "w-full object-cover object-top transition-transform duration-700 ease-out group-hover/preview:scale-[1.035] motion-reduce:transition-none",
                        featured ? "aspect-[4/3.6]" : "aspect-video",
                      )}
                    />
                  </span>
                  {/* A soft plum scrim in the corner (no hard shape) keeps the
                      white arrow legible on light and dark previews alike. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 bottom-4 size-40 rounded-br-sm bg-[radial-gradient(circle_at_100%_100%,rgba(20,4,12,0.55),transparent_70%)]"
                  />
                </Link>
                <a
                  href={exhibit.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${openLabel} ${exhibit.name} ${newWindowLabel}`}
                  className="group/arrow focus-visible:ring-primary absolute right-4 bottom-4 grid size-16 place-items-center rounded-br-sm focus-visible:ring-2 focus-visible:outline-none"
                >
                  <svg
                    data-arrow
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-8 text-white drop-shadow-[0_1px_4px_rgba(20,4,12,0.5)] transition-transform duration-300 group-hover/arrow:translate-x-1 group-hover/arrow:-translate-y-1 group-hover/arrow:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 19 19 5M8 5h11v11" />
                  </svg>
                </a>
              </div>
              <div className="text-stage-muted mt-4 text-sm leading-relaxed">
                <span className="font-mono text-xs tracking-[0.12em] uppercase">
                  {exhibitEyebrow} {workExhibitNumber(i, lang)}
                </span>
                <Link
                  href={exhibit.href as Route}
                  {...(exhibit.newTab
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-foreground hover:text-primary mt-1 block w-fit text-lg font-semibold transition-colors"
                >
                  {exhibit.name}
                </Link>
                {exhibit.kind} · {exhibit.line}
              </div>
            </div>
          );
        })}
      </div>
    </Band>
  );
}

export function HomeAbout({ copy }: { copy: HomeContent["about"] }) {
  return (
    <Band id="about">
      {/* Below lg the text runs taller than the photo: the eyebrow sits above
          both columns at the left edge, and the photo starts at the title's
          cap line. From lg up the eyebrow stays in the text column. */}
      <Eyebrow className="mb-4 sm:mb-0 lg:hidden">{copy.eyebrow}</Eyebrow>
      <div className="grid items-start gap-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center">
        {/* The owner's own edit of the photo, used as is (4:5); no label on
            it, the title beside it already says who this is. */}
        <div className="bg-pink-soft relative aspect-[4/5] overflow-hidden rounded-2xl sm:mt-5 lg:mt-0">
          <Image
            src="/about/curator-portrait.webp"
            alt={copy.photoAlt}
            width={1093}
            height={1368}
            sizes="(min-width: 640px) 460px, 100vw"
            className="size-full object-cover"
          />
        </div>
        <div>
          <Eyebrow className="hidden lg:block">{copy.eyebrow}</Eyebrow>
          <Title parts={copy.title} narrow />
          {copy.body.map((paragraph, i) => (
            <p
              key={paragraph}
              className={cn(
                "text-stage-muted max-w-xl text-sm leading-relaxed",
                i === 0 ? "mt-6" : "mt-4",
              )}
            >
              {paragraph}
            </p>
          ))}
          <Link
            href={"/about" as Route}
            className="mt-6 inline-block border-b border-current text-sm"
          >
            {copy.linkLabel} →
          </Link>
        </div>
      </div>
    </Band>
  );
}

export function HomeClosing({ copy }: { copy: HomeContent["closing"] }) {
  return (
    <section className="bg-intro text-intro-foreground">
      <div className="mx-auto max-w-6xl px-6 py-48 text-center sm:py-16">
        <p className="font-mono text-xs tracking-[0.14em] text-white/50 uppercase">
          {copy.eyebrow}
        </p>
        <h2 className="mt-8 text-4xl font-semibold tracking-tight text-balance sm:mt-14 sm:text-6xl">
          {copy.title}
        </h2>
        <Button asChild size="lg" className="mt-12 rounded-full px-8 sm:mt-16">
          <OrderCta placement="closing">{copy.cta}</OrderCta>
        </Button>
      </div>
    </section>
  );
}
