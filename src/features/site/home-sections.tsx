import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type HomeContent, type Market, workExhibitNumber } from "./content";
import { CtaLink } from "./cta-link";
import type { HomeExhibit } from "./home-exhibits";

// Sections of the exhibition home below the stage (docs/specs/immersive-home.md,
// mockup experiments/nevalyashka/ideas/page-flow.html). Minimal copy: the
// metaphor — halls, exhibits, a curator — carries the story.

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-stage-muted font-mono text-xs tracking-[0.14em] uppercase">
      {children}
    </p>
  );
}

/** Two-part heading on one line: the second half is the brand-pink accent. */
function Title({
  parts,
  narrow = false,
}: {
  parts: [string, string];
  /** In a half-width column: a step smaller so one line still fits. */
  narrow?: boolean;
}) {
  return (
    <h2
      className={cn(
        "mt-3 text-4xl leading-[1.02] font-semibold tracking-tight text-balance",
        narrow ? "sm:text-5xl lg:whitespace-nowrap" : "sm:text-6xl",
      )}
    >
      {parts[0]} <span className="text-primary">{parts[1]}</span>
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

export function HomeCollection({ copy }: { copy: HomeContent["collection"] }) {
  return (
    <Band id="collection">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <Title parts={copy.title} />
      {/* Plain cards for now: their real content is designed separately. */}
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {copy.halls.map((hall, i) => (
          <li
            key={hall.index}
            className={cn(
              "flex aspect-[4/3] flex-col justify-between rounded-2xl p-7",
              i === 0 || i === copy.halls.length - 1
                ? "bg-pink-soft"
                : "bg-accent",
            )}
          >
            <span className="text-stage-muted font-mono text-xs tracking-[0.14em] uppercase">
              {hall.index}
            </span>
            <span>
              <span className="block text-2xl font-semibold tracking-tight">
                {hall.name}
              </span>
              <span className="text-stage-muted mt-1 block text-sm">
                {hall.line}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Band>
  );
}

export function HomeSteps({ copy }: { copy: HomeContent["steps"] }) {
  return (
    <Band id="how-it-works">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <Title parts={copy.title} />
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
  // Odd count: the first exhibit spans two rows (big left, others stacked);
  // even count: an equal grid.
  const featureFirst = exhibits.length % 2 === 1;
  return (
    <Band id="work" className="bg-[#fff8fb]">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <Title parts={copy.title} />
      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        {exhibits.map((exhibit, i) => {
          const featured = featureFirst && i === 0;
          return (
            <div
              key={exhibit.slug}
              data-exhibit={exhibit.slug}
              className={cn(featured && "sm:row-span-2")}
            >
              {/* The preview opens the live work itself in a new window; the
                  arrow in its corner says so (awwwards-style). */}
              <a
                href={exhibit.site}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${openLabel} ${exhibit.name} ${newWindowLabel}`}
                className="group/exhibit ring-pink-soft relative block rounded-md bg-white p-4 shadow-[0_14px_30px_rgba(214,40,130,0.10)] ring-1 transition-shadow hover:shadow-[0_18px_40px_rgba(214,40,130,0.18)]"
              >
                <Image
                  src={exhibit.image}
                  alt={exhibit.imageAlt}
                  width={1200}
                  height={675}
                  sizes="(min-width: 640px) 560px, 100vw"
                  className={cn(
                    "w-full rounded-sm object-cover object-top",
                    featured ? "aspect-[4/3.6]" : "aspect-video",
                  )}
                />
                {/* A soft plum scrim in the corner (no hard shape) keeps the
                    white arrow legible on light and dark previews alike. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 bottom-4 size-40 rounded-br-sm bg-[radial-gradient(circle_at_100%_100%,rgba(20,4,12,0.55),transparent_70%)]"
                />
                <svg
                  data-arrow
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="absolute right-8 bottom-8 size-8 text-white drop-shadow-[0_1px_4px_rgba(20,4,12,0.5)] transition-transform duration-300 group-hover/exhibit:translate-x-1 group-hover/exhibit:-translate-y-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19 19 5M8 5h11v11" />
                </svg>
              </a>
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
      <div className="grid items-center gap-12 sm:grid-cols-[1fr_1.4fr]">
        <div className="from-pink-soft flex aspect-[4/5] items-end rounded-2xl bg-gradient-to-br to-[#ffeaf4] p-5">
          <span className="text-stage-muted font-mono text-xs tracking-[0.14em] uppercase">
            {copy.plate}
          </span>
        </div>
        <div>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <Title parts={copy.title} narrow />
          <p className="text-stage-muted mt-6 max-w-xl text-lg leading-relaxed">
            {copy.body}
          </p>
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
      <div className="mx-auto max-w-6xl px-6 py-48 text-center sm:py-64">
        <p className="font-mono text-xs tracking-[0.14em] text-white/50 uppercase">
          {copy.eyebrow}
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {copy.title}
        </h2>
        <Button asChild size="lg" className="mt-10 rounded-full px-8">
          <CtaLink href="/contact" placement="closing">
            {copy.cta}
          </CtaLink>
        </Button>
      </div>
    </section>
  );
}
