import { cn } from "@/lib/utils";
import { AnchorLink } from "./anchor-link";
import type { MarketContent } from "./content";
import { ExhibitStage } from "./exhibit-stage";
import { OrderCta } from "./order-cta";
import { SiteHeader } from "./site-chrome";
import { uiFor } from "./ui-for";

// First screen of the exhibition home: one exhibit (the jelly roly-poly) on a
// pink studio stage, a museum label beside it, the text-only menu above and a
// scroll arrow below. No visible headline — the H1 is for search and screen
// readers (docs/specs/immersive-home.md).

/** The label's order: the animation service, no package picked yet. */
const ANIMATION_ORDER = { service: "Анимации и 3D", plan: "", price: "" };

export function HomeStage({ content }: { content: MarketContent }) {
  const { exhibit } = content.home;
  const stage = content.locale ? uiFor(content.locale).stage : undefined;
  const scrollLabel =
    stage?.scroll ??
    (content.lang === "ru"
      ? "Прокрутить к коллекции"
      : "Scroll to the collection");

  return (
    <ExhibitStage
      label={exhibit.name}
      pushLabel={
        stage?.push ??
        (content.lang === "ru" ? "Толкнуть неваляшку" : "Push the roly-poly")
      }
    >
      <h1 className="sr-only">{content.h1}</h1>

      <SiteHeader content={content} variant="stage" />

      {/* Right of the head at rest (stage-lab.html), clamped so it never
          leaves the viewport. In near-square windows the clamp pulls it in
          toward the head, so it rises to clear it. Phones: a small, dense
          label at the top right, beside the head (it may overlap it), with
          only the first line (what it is made of). It is as wide as its
          longest piece: the button or the wrapped description. It ends with
          "an animation like this", styled as the bubble's pink link was
          (owner, 2026-11-12: replaced the bubble). */}
      <div
        data-testid="exhibit-label"
        className="text-stage-muted absolute top-[calc(50%-25vmin)] left-[min(calc(50%+32vmin),calc(100%-17rem))] rounded-lg bg-white/55 px-4 py-3.5 text-xs leading-relaxed backdrop-blur-md max-sm:top-[17vh] max-sm:right-[3.2vw] max-sm:bottom-auto max-sm:left-auto max-sm:w-max max-sm:rounded-md max-sm:px-2.5 max-sm:py-2 max-sm:text-[9.5px] max-sm:leading-snug max-sm:whitespace-normal sm:max-lg:top-[calc(50%-38vmin)]! sm:max-lg:right-[3.2vw] sm:max-lg:left-auto sm:max-lg:w-[14rem] sm:max-lg:px-4 sm:max-lg:py-4 lg:w-[15.5rem] sm:[@media(max-aspect-ratio:5/4)]:top-[calc(50%-31vmin)]"
      >
        <b className="mb-1.5 block text-[15px] font-semibold max-sm:mb-0.5 max-sm:text-[11px]">
          {exhibit.name}
        </b>
        {/* Each line is its own short paragraph. Phones: the first only. */}
        {exhibit.lines.map((line, i) => (
          <span
            key={line}
            className={cn(
              "block",
              i > 0 ? "mt-1.5 max-sm:hidden" : "max-sm:w-[5.25rem]",
            )}
          >
            {line}
          </span>
        ))}
        <OrderCta
          target={ANIMATION_ORDER}
          placement="mascot"
          contactHref={exhibit.cta.contactHref}
          className="text-primary hover:text-primary/80 hover:bg-primary/5 focus-visible:ring-primary pointer-events-auto -mx-2.5 mt-1.5 -mb-2 inline-flex cursor-pointer items-center gap-1 rounded-xl px-2.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none max-sm:-mx-1.5 max-sm:mt-0.5 max-sm:-mb-1.5 max-sm:px-1.5 max-sm:py-1.5 max-sm:text-[10px]"
        >
          {exhibit.cta.label}
          <span aria-hidden="true">→</span>
        </OrderCta>
      </div>

      {/* Only the scroll cue, in the tagline's muted ink; a round
          iridescent glow rises behind it on hover (.scroll-cue). */}
      <div className="absolute inset-x-0 bottom-[3.4vh] flex justify-center">
        <AnchorLink
          href="#collection"
          aria-label={scrollLabel}
          className="scroll-cue text-foreground/45 hover:text-foreground/80 focus-visible:text-foreground/80 pointer-events-auto relative flex size-12 cursor-pointer items-center justify-center rounded-full text-xl leading-none transition-colors duration-300"
        >
          ↓
        </AnchorLink>
      </div>
    </ExhibitStage>
  );
}
