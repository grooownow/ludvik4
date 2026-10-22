import { AnchorLink } from "./anchor-link";
import { exhibitNumber, type MarketContent } from "./content";
import { ExhibitStage } from "./exhibit-stage";
import { SiteHeader } from "./site-chrome";

// First screen of the exhibition home: one exhibit (the jelly roly-poly) on a
// pink studio stage, a museum label beside it, the text-only menu above and a
// quiet strip below. No visible headline — the H1 is for search and screen
// readers (docs/specs/immersive-home.md).
export function HomeStage({
  content,
  workCount,
}: {
  content: MarketContent;
  /** Work exhibits shown below; the mascot is numbered after them. */
  workCount: number;
}) {
  const { exhibit, strip } = content.home;
  const scrollLabel =
    content.lang === "ru"
      ? "Прокрутить к коллекции"
      : "Scroll to the collection";

  return (
    <ExhibitStage label={exhibit.name}>
      <h1 className="sr-only">{content.h1}</h1>

      <SiteHeader content={content} variant="stage" />

      {/* Landscape: right of the head at rest (stage-lab.html), clamped so it
          never leaves the viewport. Portrait (phones, until the mobile intro
          is designed): centred below the mascot, above the strip. */}
      <div
        data-testid="exhibit-label"
        className="text-stage-muted absolute top-[calc(50%-25vmin)] left-[min(calc(50%+30vmin),calc(100%-17rem))] rounded-lg bg-white/55 px-4 py-3.5 text-xs leading-relaxed whitespace-nowrap backdrop-blur-md portrait:top-auto portrait:bottom-[13vh] portrait:left-1/2 portrait:-translate-x-1/2"
      >
        <span className="font-mono tracking-[0.12em] uppercase">
          {exhibit.eyebrow} {exhibitNumber(workCount, content.lang)}
        </span>
        <b className="mt-1 mb-1.5 block text-[15px] font-semibold">
          {exhibit.name}
        </b>
        {exhibit.lines[0]}
        <br />
        {exhibit.lines[1]}
      </div>

      <div className="text-stage-muted absolute inset-x-[3.2vw] bottom-[3.4vh] flex items-center justify-between font-mono text-[11px] tracking-[0.12em] uppercase">
        <span>
          <i
            aria-hidden="true"
            className="mr-2 inline-block size-[7px] rounded-full bg-[#1db954] align-middle"
          />
          {strip.status}
        </span>
        <AnchorLink
          href="#collection"
          aria-label={scrollLabel}
          className="pointer-events-auto px-3.5 py-2 text-xl leading-none opacity-25 transition-opacity hover:opacity-90"
        >
          ↓
        </AnchorLink>
        <span>{strip.established}</span>
      </div>
    </ExhibitStage>
  );
}
