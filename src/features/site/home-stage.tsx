import { cn } from "@/lib/utils";
import { AnchorLink } from "./anchor-link";
import { type MarketContent, mascotExhibitNumber } from "./content";
import { ExhibitStage } from "./exhibit-stage";
import { MascotReply } from "./mascot-reply";
import { SiteHeader } from "./site-chrome";

// First screen of the exhibition home: one exhibit (the jelly roly-poly) on a
// pink studio stage, a museum label beside it, the text-only menu above and a
// scroll arrow below. No visible headline — the H1 is for search and screen
// readers (docs/specs/immersive-home.md).
export function HomeStage({ content }: { content: MarketContent }) {
  const { exhibit } = content.home;
  const scrollLabel =
    content.lang === "ru"
      ? "Прокрутить к коллекции"
      : "Scroll to the collection";

  return (
    <ExhibitStage
      label={exhibit.name}
      pushLabel={
        content.lang === "ru" ? "Толкнуть неваляшку" : "Push the roly-poly"
      }
    >
      <h1 className="sr-only">{content.h1}</h1>

      <SiteHeader content={content} variant="stage" />

      {/* Right of the head at rest (stage-lab.html), clamped so it never
          leaves the viewport. In near-square windows the clamp pulls it in
          toward the head, so it rises to clear it. Phones: a small, dense
          museum label at the top right, beside the head (it may overlap it),
          with only the first line (what it is made of). It is as wide as its
          longest piece: the one-line eyebrow or the wrapped description. */}
      <div
        data-testid="exhibit-label"
        className="text-stage-muted absolute top-[calc(50%-25vmin)] left-[min(calc(50%+32vmin),calc(100%-17rem))] rounded-lg bg-white/55 px-4 py-3.5 text-xs leading-relaxed backdrop-blur-md max-sm:top-[17vh] max-sm:right-[3.2vw] max-sm:bottom-auto max-sm:left-auto max-sm:w-max max-sm:rounded-md max-sm:px-2.5 max-sm:py-2 max-sm:text-[9.5px] max-sm:leading-snug max-sm:whitespace-normal sm:max-lg:top-[calc(50%-38vmin)]! sm:max-lg:right-[3.2vw] sm:max-lg:left-auto sm:max-lg:w-[14rem] sm:max-lg:px-4 sm:max-lg:py-4 lg:w-[15.5rem] sm:[@media(max-aspect-ratio:5/4)]:top-[calc(50%-31vmin)]"
      >
        <span className="font-mono tracking-[0.12em] uppercase max-sm:tracking-[0.08em]">
          {exhibit.eyebrow} {mascotExhibitNumber(content.lang)}
        </span>
        <b className="mt-1 mb-1.5 block text-[15px] font-semibold max-sm:mt-0.5 max-sm:mb-0.5 max-sm:text-[11px]">
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
      </div>

      {/* "An animation like this for your site" — the mascot's bubble. */}
      {content.lang === "ru" ? <MascotReply /> : null}

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
