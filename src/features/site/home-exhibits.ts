import { caseStudies } from "./commercial-content";
import type { Market } from "./content";
import { internationalWork } from "./international-content";

/** One framed work exhibit on the exhibition home. */
export type HomeExhibit = {
  slug: string;
  name: string;
  kind: string;
  line: string;
  image: string;
  imageAlt: string;
  /** Our description page. */
  href: string;
  newTab?: boolean;
  /** The live work itself, opened from the preview's arrow. */
  site: string;
};

// EN shows the international work layer (3), RU its case studies (4), each in
// the order the owner set (docs/specs/immersive-home.md → Markets).
export function homeExhibits(market: Market): HomeExhibit[] {
  if (market === "en") {
    return internationalWork.map((item) => ({
      slug: item.slug,
      name: item.title,
      kind: item.kind,
      line: item.description,
      image: item.image,
      imageAlt: item.imageAlt,
      href: item.cardLink?.href ?? `/work/${item.slug}`,
      site: item.website,
      ...(item.cardLink?.newTab ? { newTab: true } : {}),
    }));
  }
  return caseStudies.map((item) => ({
    slug: item.slug,
    name: item.title,
    kind: item.kind,
    line: item.description,
    image: item.image,
    imageAlt: item.imageAlt,
    href: `/cases/${item.slug}`,
    site: item.website,
  }));
}
