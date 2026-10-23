import { jsonLdString } from "@/lib/json-ld";
import type { MarketContent } from "./content";
import type { HomeExhibit } from "./home-exhibits";
import {
  HomeAbout,
  HomeClosing,
  HomeCollection,
  HomeGallery,
  HomeSteps,
} from "./home-sections";
import { HomeStage } from "./home-stage";
import { buildHomeJsonLd } from "./seo";
import { SiteFooter } from "./site-chrome";

// The exhibition home, shared by both markets (docs/specs/immersive-home.md):
// the stage with the jelly roly-poly, then the collection, three steps, the
// framed work, the curator and the closing call to action. The lead form
// lives on /contact; there is no FAQ, scope or pricing here.
export function Home({
  content,
  exhibits,
  baseUrl,
}: {
  content: MarketContent;
  exhibits: HomeExhibit[];
  baseUrl: string;
}) {
  const jsonLd = buildHomeJsonLd(content, baseUrl, {
    faq: false,
    prices: false,
  });
  const { home } = content;
  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <HomeStage content={content} />
      <HomeCollection copy={home.collection} lang={content.lang} />
      <HomeSteps copy={home.steps} />
      <HomeGallery
        copy={home.work}
        exhibitEyebrow={home.exhibit.eyebrow}
        lang={content.lang}
        exhibits={exhibits}
      />
      <HomeAbout copy={home.about} />
      <HomeClosing copy={home.closing} />
      <SiteFooter content={content} />
    </div>
  );
}
