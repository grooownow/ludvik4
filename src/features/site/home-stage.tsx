import { AnchorLink } from "./anchor-link";
import { type MarketContent, mascotExhibitNumber } from "./content";
import { ExhibitStage } from "./exhibit-stage";
import { SiteHeader } from "./site-chrome";

// First screen of the exhibition home: one exhibit (the jelly roly-poly) on a
// pink studio stage, a museum label beside it, the text-only menu above and a
// quiet strip below. No visible headline — the H1 is for search and screen
// readers (docs/specs/immersive-home.md).
function StatusDot() {
  return (
    <i
      aria-hidden="true"
      className="mr-2 inline-block size-[7px] rounded-full bg-[#1db954] align-middle"
    />
  );
}

export function HomeStage({ content }: { content: MarketContent }) {
  const { exhibit, strip } = content.home;
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
        className="text-stage-muted absolute top-[calc(50%-25vmin)] left-[min(calc(50%+30vmin),calc(100%-17rem))] rounded-lg bg-white/55 px-4 py-3.5 text-xs leading-relaxed whitespace-nowrap backdrop-blur-md max-sm:top-[17vh] max-sm:right-[3.2vw] max-sm:bottom-auto max-sm:left-auto max-sm:w-max max-sm:rounded-md max-sm:px-2.5 max-sm:py-2 max-sm:text-[9.5px] max-sm:leading-snug max-sm:whitespace-normal sm:[@media(max-aspect-ratio:5/4)]:top-[calc(50%-31vmin)]"
      >
        <span className="font-mono tracking-[0.12em] uppercase max-sm:tracking-[0.08em]">
          {exhibit.eyebrow} {mascotExhibitNumber(content.lang)}
        </span>
        <b className="mt-1 mb-1.5 block text-[15px] font-semibold max-sm:mt-0.5 max-sm:mb-0.5 max-sm:text-[11px]">
          {exhibit.name}
        </b>
        {exhibit.lines.map((line, i) => (
          <span
            key={line}
            className={
              i > 0 ? "block max-sm:hidden" : "block max-sm:w-[5.25rem]"
            }
          >
            {line}
          </span>
        ))}
      </div>

      {/* Desktop: availability on the left, the current year and reach on
          the right. Phones: one line — availability and reach, then the
          arrow. The year is the build's: every deploy rebuilds the page. */}
      <div className="text-stage-muted absolute inset-x-[3.2vw] bottom-[3.4vh] flex items-center justify-between font-mono text-[11px] tracking-[0.12em] uppercase">
        <span>
          <StatusDot />
          {strip.status}
          <span className="sm:hidden"> · {strip.worldwide}</span>
        </span>
        <AnchorLink
          href="#collection"
          aria-label={scrollLabel}
          className="pointer-events-auto px-3.5 py-2 text-xl leading-none opacity-25 transition-opacity hover:opacity-90"
        >
          ↓
        </AnchorLink>
        <span className="max-sm:hidden">
          {new Date().getFullYear()} · {strip.worldwide}
        </span>
      </div>
    </ExhibitStage>
  );
}
