import type { MarketContent } from "./content";
import { IntroStage } from "./intro-stage";

// Full-bleed brand intro above the hero, shared by both markets. The artwork
// (wordmark + silk + melt) is a pre-rendered image; the copy over it is real
// text from content.ts so each market reads its own language. The page H1
// stays in the hero below — this section is a brand banner, not a heading.

export function IntroHero({ content }: { content: MarketContent }) {
  const { intro } = content;
  return (
    <section
      aria-label={intro.imageAlt}
      className="bg-intro text-intro-foreground"
    >
      <IntroStage alt={intro.imageAlt} switcher={intro.switcher}>
        <p className="absolute inset-x-0 top-[13%] px-6 text-center font-mono text-[11px] tracking-[0.2em] uppercase opacity-90 md:top-[17%] md:text-xs">
          {intro.tagline}
        </p>
        <p className="absolute inset-x-0 bottom-[16%] px-6 text-center text-base font-medium opacity-90 md:bottom-[10%] md:text-lg">
          {intro.services}
        </p>
      </IntroStage>
    </section>
  );
}
