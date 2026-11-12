import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { jsonLdString } from "@/lib/json-ld";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";
import {
  type CaseGallery,
  caseGalleries,
  type Screen,
  type ScreenImage,
} from "./case-gallery";
import { caseStudies, type CaseStudy } from "./commercial-content";
import { getMarketContent } from "./content";
import { ScreenButton, ScreenGalleryProvider } from "./screen-gallery";
import { ScrollStrip } from "./scroll-strip";
import { publicUrl } from "./seo";
import { SiteFooter, SiteHeader } from "./site-chrome";

// The RU works section: /cases lists every work as a row with a strip of its
// screens, /cases/<slug> tells one work point by point with its screens.
// Any screen opens the fullscreen gallery. Mockups: .design/works/
// (preview-b.html?all, case-4.html); spec:
// docs/superpowers/specs/2026-11-11-works-gallery-design.md.

const ruContent = getMarketContent("ru");
const WRAP = "mx-auto w-full max-w-[1120px] px-6";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <SiteHeader content={ruContent} />
      <main className="flex-1">{children}</main>
      <SiteFooter content={ruContent} />
    </div>
  );
}

const screensBySlug = (slugs: CaseStudy["slug"][]) =>
  Object.fromEntries(slugs.map((s) => [s, caseGalleries[s].screens]));

export function screenCount(n: number): string {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return `${n} экран`;
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return `${n} экрана`;
  return `${n} экранов`;
}

const kindLabel = (s: Screen) =>
  s.kind === "mobile" ? "мобильная" : "десктоп";
const openLabel = (s: Screen) => `Открыть: ${s.caption}, ${kindLabel(s)}`;

/** Aspect ratio of a whole-page preview, cut at the bottom only for very tall pages. */
function cappedRatio(img: ScreenImage, max: number): string {
  return img.height / img.width > max
    ? `1 / ${max}`
    : `${img.width} / ${img.height}`;
}

function Shot({
  img,
  alt = "",
  className,
  style,
  priority,
}: {
  img: ScreenImage;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  return (
    <Image
      src={img.src}
      alt={alt}
      width={img.width}
      height={img.height}
      unoptimized
      priority={priority}
      className={cn("block object-cover object-top", className)}
      style={style}
    />
  );
}

function WebsiteButton({ g }: { g: CaseGallery }) {
  if (!g.website) return null;
  return (
    <Button asChild className="h-11 px-5 text-[15px] font-semibold">
      <a href={g.website} target="_blank" rel="noopener noreferrer">
        {g.websiteLabel ?? "Открыть проект"} ↗
      </a>
    </Button>
  );
}

// ─── /cases ──────────────────────────────────────────────────────────────

export function CasesIndexView({ baseUrl }: { baseUrl: string }) {
  const url = publicUrl("ru", baseUrl, "/cases");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Работы Ludvik4",
        description:
          "Публичные примеры сайтов, веб-приложений и AI-инструментов Ludvik4 с экранами каждого проекта.",
        url,
        isPartOf: { "@id": `${baseUrl}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: caseStudies.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: publicUrl("ru", baseUrl, `/cases/${item.slug}`),
            name: item.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: `${baseUrl}/`,
          },
          { "@type": "ListItem", position: 2, name: "Работы", item: url },
        ],
      },
    ],
  };

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <ScreenGalleryProvider
        galleries={screensBySlug(caseStudies.map((c) => c.slug))}
      >
        <div className={cn(WRAP, "py-10 sm:py-14")}>
          <Breadcrumbs items={[{ label: "Работы" }]} />
          <p className="text-primary mt-8 font-mono text-xs">Работы</p>
          <h1 className="mt-2 text-[clamp(30px,4.6vw,40px)] font-extrabold tracking-tight">
            Проекты студии Ludvik4
          </h1>
          <p className="text-muted-foreground mt-3 max-w-[640px] text-lg leading-relaxed">
            Листайте экраны прямо здесь — нажмите на любой, чтобы открыть на
            весь экран.
          </p>
          <div className="mt-4">
            {caseStudies.map((study) => (
              <CaseRow key={study.slug} slug={study.slug} />
            ))}
          </div>
        </div>
      </ScreenGalleryProvider>
    </Shell>
  );
}

function CaseRow({ slug }: { slug: CaseStudy["slug"] }) {
  const g = caseGalleries[slug];
  const href = `/cases/${slug}` as Route;
  const count = screenCount(g.screens.length);
  return (
    <section className="border-border grid gap-[18px] border-t py-7 first:border-t-0 min-[801px]:grid-cols-[260px_minmax(0,1fr)] min-[801px]:gap-8 min-[801px]:py-9">
      <div>
        <p className="text-primary font-mono text-xs">{g.kind}</p>
        <h2 className="mt-1.5 text-[22px] font-bold tracking-tight">
          <Link href={href} className="hover:text-primary">
            {g.title}
          </Link>
        </h2>
        <p className="text-muted-foreground mt-1.5 mb-2.5 leading-normal min-[801px]:mt-2 min-[801px]:mb-4">
          {g.line}
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-2 min-[801px]:flex-col min-[801px]:justify-start">
          <Link
            href={href}
            className="text-primary font-mono text-sm font-semibold"
          >
            Подробнее о проекте →
          </Link>
          <span className="text-muted-foreground font-mono text-[13px]">
            {count}
          </span>
        </div>
      </div>
      <ScrollStrip className="-mx-6 scroll-pl-6 items-end gap-2.5 px-6 pb-2.5 min-[801px]:mx-0 min-[801px]:scroll-pl-0 min-[801px]:gap-3.5 min-[801px]:px-0 min-[801px]:pb-3">
        {g.strip.map((i) => {
          const s = g.screens[i]!;
          const img = s.stripThumb ?? s.thumb;
          const mobile = s.kind === "mobile";
          return (
            <ScreenButton
              key={i}
              slug={slug}
              index={i}
              label={openLabel(s)}
              className={cn(
                "group bg-muted relative flex-none snap-start overflow-hidden p-0",
                mobile
                  ? "border-intro h-[300px] rounded-[14px] border-4 min-[801px]:h-80"
                  : "border-border h-[190px] self-center rounded-xl border min-[801px]:h-80 min-[801px]:self-auto",
              )}
            >
              <Shot
                img={img}
                className="h-full w-auto"
                style={{ aspectRatio: cappedRatio(img, mobile ? 3.2 : 1.7) }}
              />
              <span className="bg-background/95 text-foreground absolute bottom-2 left-2 rounded-full px-2.5 py-0.5 text-xs transition-opacity min-[801px]:opacity-0 min-[801px]:group-hover:opacity-100 min-[801px]:group-focus-visible:opacity-100">
                {s.caption}
              </span>
            </ScreenButton>
          );
        })}
        {g.strip.length < g.screens.length ? (
          <Link
            href={href}
            className="bg-accent border-pink-soft text-primary grid w-[120px] flex-none snap-start place-items-center self-stretch rounded-xl border text-center font-mono text-sm font-semibold min-[801px]:w-[150px]"
          >
            <span>
              Все {count.replace(" ", " ")}
              <br />→
            </span>
          </Link>
        ) : null}
      </ScrollStrip>
    </section>
  );
}

// ─── /cases/<slug> ───────────────────────────────────────────────────────

const DESKTOP_BOX = "w-[60%] shrink-0 overflow-hidden rounded-xl lg:w-[380px]";
const PHONE_BOX =
  "bg-intro w-[calc((60%-8px)*390/844+8px)] shrink-0 rounded-[14px] p-1 shadow-lg lg:w-[180px]";

function DesktopPreview({
  slug,
  index,
  s,
}: {
  slug: string;
  index: number;
  s: Screen;
}) {
  return (
    <ScreenButton
      slug={slug}
      index={index}
      label={openLabel(s)}
      className={cn(DESKTOP_BOX, "shadow-lg")}
    >
      <Shot
        img={s.squareThumb ?? s.thumb}
        className="aspect-square h-auto w-full rounded-xl lg:aspect-auto lg:h-[380px]"
      />
    </ScreenButton>
  );
}

function PhonePreview({
  slug,
  index,
  s,
}: {
  slug: string;
  index: number;
  s: Screen;
}) {
  return (
    <ScreenButton
      slug={slug}
      index={index}
      label={openLabel(s)}
      className={PHONE_BOX}
    >
      <Shot
        img={s.thumb}
        className="aspect-[390/844] h-auto w-full rounded-[10px] lg:aspect-auto lg:h-[372px]"
      />
    </ScreenButton>
  );
}

function PointShots({
  slug,
  g,
  screens,
}: {
  slug: string;
  g: CaseGallery;
  screens: number[];
}) {
  const desktop = screens.find((i) => g.screens[i]?.kind === "desktop");
  const phones = screens.filter((i) => g.screens[i]?.kind === "mobile");
  if (desktop == null) {
    return (
      <div className="flex gap-4 lg:justify-end lg:gap-6">
        {phones.map((i) => (
          <PhonePreview key={i} slug={slug} index={i} s={g.screens[i]!} />
        ))}
      </div>
    );
  }
  const phone = phones[0];
  return (
    <div className="flex items-start gap-3 lg:justify-end lg:gap-6">
      <DesktopPreview slug={slug} index={desktop} s={g.screens[desktop]!} />
      {phone != null ? (
        <PhonePreview slug={slug} index={phone} s={g.screens[phone]!} />
      ) : null}
    </div>
  );
}

function HeroShots({ slug, g }: { slug: string; g: CaseGallery }) {
  const d = g.screens[g.cover.desktop]!;
  const mIndex = g.cover.mobile;
  const m = mIndex != null ? g.screens[mIndex] : undefined;
  const dLabel = openLabel(d);

  if (!m || mIndex == null) {
    // A short, wide first screen: the whole desktop alone.
    return (
      <ScreenButton
        slug={slug}
        index={g.cover.desktop}
        label={dLabel}
        className="w-full overflow-hidden rounded-xl shadow-lg"
      >
        <Shot img={d.thumb} priority className="h-auto w-full rounded-xl" />
      </ScreenButton>
    );
  }

  if (g.layout === "brief") {
    // Both first screens whole, side by side at about one height.
    return (
      <div className="flex items-start gap-4 lg:gap-6">
        <ScreenButton
          slug={slug}
          index={g.cover.desktop}
          label={dLabel}
          className="min-w-0 flex-[1.6_1_0%] overflow-hidden rounded-xl shadow-lg"
        >
          <Shot img={d.thumb} priority className="h-auto w-full rounded-xl" />
        </ScreenButton>
        <ScreenButton
          slug={slug}
          index={mIndex}
          label={openLabel(m)}
          className="bg-intro min-w-0 flex-[0.462_1_0%] rounded-[14px] p-1 shadow-lg"
        >
          <Shot img={m.thumb} className="h-auto w-full rounded-[10px]" />
        </ScreenButton>
      </div>
    );
  }

  // The pair fills the column; both show the top of their page.
  return (
    <div className="flex gap-3 lg:justify-end lg:gap-6">
      <ScreenButton
        slug={slug}
        index={g.cover.desktop}
        label={dLabel}
        className="w-[60%] shrink-0 overflow-hidden rounded-xl shadow-lg lg:w-auto lg:min-w-0 lg:flex-1"
      >
        <Shot
          img={d.thumb}
          priority
          className="aspect-square h-auto w-full rounded-xl lg:aspect-auto lg:h-[445px]"
        />
      </ScreenButton>
      <ScreenButton
        slug={slug}
        index={mIndex}
        label={openLabel(m)}
        className={cn(PHONE_BOX, "lg:w-[210px]")}
      >
        <Shot
          img={m.thumb}
          priority
          className="aspect-[390/844] h-auto w-full rounded-[10px] lg:aspect-auto lg:h-[437px]"
        />
      </ScreenButton>
    </div>
  );
}

const Num = ({ n }: { n: number }) => (
  <span className="text-primary mr-1.5 font-mono text-sm font-semibold">
    {String(n + 1).padStart(2, "0")}
  </span>
);

function PointsList({
  g,
  twoColumns,
}: {
  g: CaseGallery;
  twoColumns?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-[22px]",
        twoColumns && "lg:grid-cols-2 lg:gap-x-12 lg:gap-y-7",
      )}
    >
      {g.points.map((p, n) => (
        <div key={p.title}>
          <h3 className="mb-1.5 text-[22px] font-bold tracking-tight">
            <Num n={n} />
            {p.title}
          </h3>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            {p.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function LandingRow({ slug, g }: { slug: string; g: CaseGallery }) {
  const d = g.screens.findIndex((s) => s.kind === "desktop");
  const m = g.screens.findIndex((s) => s.kind === "mobile");
  const ds = g.screens[d]!;
  const ms = g.screens[m]!;
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_584px] lg:gap-16">
      <PointsList g={g} />
      {/* The whole landing: the phone is as tall as the desktop page beside it. */}
      <div className="flex items-stretch gap-3 lg:justify-end lg:gap-6">
        <ScreenButton
          slug={slug}
          index={d}
          label={openLabel(ds)}
          className={cn(DESKTOP_BOX, "self-start shadow-lg")}
        >
          <Shot img={ds.thumb} className="h-auto w-full rounded-xl" />
        </ScreenButton>
        <ScreenButton
          slug={slug}
          index={m}
          label={openLabel(ms)}
          className={cn(PHONE_BOX, "relative")}
        >
          <Shot
            img={ms.longThumb ?? ms.thumb}
            className="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)] rounded-[10px]"
          />
        </ScreenButton>
      </div>
    </div>
  );
}

function StoryRows({ slug, g }: { slug: string; g: CaseGallery }) {
  return (
    <div className="grid gap-3 lg:gap-0">
      {g.points.map((p, n) => (
        <div
          key={p.title}
          className="grid gap-3 py-3 lg:grid-cols-[minmax(0,1fr)_584px] lg:items-start lg:gap-16 lg:py-5"
        >
          <div className="lg:sticky lg:top-6 lg:pt-10">
            <h3 className="mb-2 hidden text-[22px] font-bold tracking-tight lg:block">
              <Num n={n} />
              {p.title}
            </h3>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              <span className="lg:hidden">
                <Num n={n} />
                <b className="text-foreground font-semibold">{p.title}.</b>{" "}
              </span>
              {p.text}
            </p>
          </div>
          <PointShots slug={slug} g={g} screens={p.screens} />
        </div>
      ))}
    </div>
  );
}

export function CaseStudyPageView({
  study,
  baseUrl,
}: {
  study: CaseStudy;
  baseUrl: string;
}) {
  const slug = study.slug;
  const g = caseGalleries[slug];
  const url = publicUrl("ru", baseUrl, `/cases/${slug}`);
  const story = g.layout === "story";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: study.title,
        description: study.description,
        url,
        image: `${baseUrl}${study.image}`,
        creator: { "@type": "Organization", name: "Ludvik4", url: baseUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная",
            item: `${baseUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Работы",
            item: publicUrl("ru", baseUrl, "/cases"),
          },
          { "@type": "ListItem", position: 3, name: study.title, item: url },
        ],
      },
    ],
  };

  return (
    <Shell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <ScreenGalleryProvider galleries={screensBySlug([slug])}>
        <section className="bg-[radial-gradient(120%_90%_at_85%_10%,var(--pink-soft),var(--accent)_55%,var(--background))] pt-4 pb-7 lg:pt-6 lg:pb-10">
          <div className={WRAP}>
            <Breadcrumbs
              items={[{ label: "Работы", href: "/cases" }, { label: g.title }]}
            />
            <div className="mt-3 grid gap-5 lg:mt-5 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start lg:gap-14">
              <div>
                <p className="text-primary font-mono text-xs">{g.kind}</p>
                <h1 className="mt-2.5 text-[clamp(32px,5vw,44px)] leading-[1.05] font-extrabold tracking-tight">
                  {g.title}
                </h1>
                <p className="text-muted-foreground mt-3.5 text-base leading-relaxed lg:text-[17px]">
                  {g.lead}
                </p>
                <div className="mt-[18px] flex flex-wrap gap-2.5">
                  <WebsiteButton g={g} />
                  {story ? (
                    <ScreenButton
                      slug={slug}
                      index={0}
                      label={`Все ${screenCount(g.screens.length)}`}
                      className="border-border bg-background hover:bg-muted inline-flex h-11 items-center rounded-lg border px-5 text-[15px] font-semibold"
                    >
                      Все {screenCount(g.screens.length)}
                    </ScreenButton>
                  ) : null}
                </div>
                {g.note ? (
                  <p className="text-muted-foreground mt-2.5 text-sm">
                    {g.note}
                  </p>
                ) : null}
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {g.stack.map((s) => (
                    <li
                      key={s}
                      className="border-pink-soft bg-background rounded-full border px-3 py-1 font-mono text-[13px]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <HeroShots slug={slug} g={g} />
            </div>
          </div>
        </section>

        {story ? (
          <section className="py-7 lg:py-10">
            <div className={WRAP}>
              <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-3 lg:mb-5">
                <h2 className="text-[22px] font-semibold tracking-tight lg:text-[26px]">
                  Все экраны
                </h2>
                <span className="text-muted-foreground text-sm">
                  {g.screens.length} · десктоп и мобильная версия
                </span>
              </div>
              <ScrollStrip className="-mx-6 gap-2.5 px-6 pt-1 pb-2 lg:mx-0 lg:px-0">
                {g.screens.map((s, i) => {
                  const img = s.stripThumb ?? s.thumb;
                  return (
                    <ScreenButton
                      key={i}
                      slug={slug}
                      index={i}
                      label={openLabel(s)}
                      className="border-border bg-card h-[260px] flex-none snap-start overflow-hidden rounded-[10px] border p-0 lg:h-[340px]"
                    >
                      <Shot
                        img={img}
                        className="h-full w-auto"
                        style={{
                          aspectRatio: cappedRatio(
                            img,
                            s.kind === "mobile" ? 3.2 : 1.7,
                          ),
                        }}
                      />
                    </ScreenButton>
                  );
                })}
              </ScrollStrip>
            </div>
          </section>
        ) : null}

        <section className={cn("pb-7 lg:pb-10", !story && "pt-7 lg:pt-10")}>
          <div className={WRAP}>
            <h2 className="mb-3.5 text-[22px] font-semibold tracking-tight lg:mb-5 lg:text-[26px]">
              {story ? "Экраны и функции" : "Что внутри"}
            </h2>
            {g.layout === "landing" ? (
              <LandingRow slug={slug} g={g} />
            ) : g.layout === "brief" ? (
              <PointsList g={g} twoColumns />
            ) : (
              <StoryRows slug={slug} g={g} />
            )}
          </div>
        </section>

        <section className="pb-10 lg:pb-14">
          <div className={WRAP}>
            <div className="border-border grid gap-4 border-t pt-6 md:grid-cols-3 md:gap-7">
              {[
                ["Задача", g.task],
                ["Результат", g.result],
                ["Технологии", g.stack.join(" · ")],
              ].map(([title, text]) => (
                <div key={title} className="text-[15px] leading-relaxed">
                  <h2 className="text-muted-foreground mb-1.5 font-mono text-[13px] font-medium">
                    {title}
                  </h2>
                  {text}
                </div>
              ))}
            </div>
            <div className="border-border mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
              <div>
                <h2 className="text-xl font-bold">Обсудить похожую задачу</h2>
                <p className="text-muted-foreground mt-1 text-[15px]">
                  Коротко опишите идею — ответим с вариантами и сроками.
                </p>
              </div>
              <Button asChild className="h-11 px-5 text-[15px] font-semibold">
                <Link href={"/contact" as Route}>Обсудить задачу</Link>
              </Button>
            </div>
          </div>
        </section>
      </ScreenGalleryProvider>
    </Shell>
  );
}
