import { localizeHref } from "@/lib/i18n";
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
import { uiFor } from "./ui-for";

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
  const { home, locale } = content;
  // ludvik4.dev pages link within their language; the RU market has none.
  const contactHref = locale ? localizeHref(locale, "/contact") : undefined;
  // The RU market (ludvik4.ru, no locale) shows the work right after the
  // services and the three steps after it (owner, 2026-11-12); ludvik4.dev
  // keeps steps → work.
  const worksFirst = !locale;
  const steps = <HomeSteps copy={home.steps} lang={content.lang} />;
  return (
    <div className="bg-background text-foreground min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <HomeStage content={content} />
      <HomeCollection
        copy={home.collection}
        lang={content.lang}
        contactHref={contactHref}
      />
      {worksFirst ? null : steps}
      <HomeGallery
        copy={home.work}
        exhibitEyebrow={home.exhibit.eyebrow}
        lang={content.lang}
        exhibits={exhibits}
        labels={locale ? uiFor(locale).gallery : undefined}
      />
      {worksFirst ? steps : null}
      <HomeAbout
        copy={home.about}
        href={locale ? localizeHref(locale, "/about") : undefined}
      />
      <HomeClosing copy={home.closing} contactHref={contactHref} />
      <SiteFooter content={content} />
    </div>
  );
}
