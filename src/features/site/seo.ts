import type { Metadata, MetadataRoute } from "next";
import { type Market, type MarketContent, TELEGRAM_URL } from "./content";

// Per-market SEO surfaces, built from the market content object. Pure functions
// of (content, baseUrl) so both markets are unit-testable without re-parsing env.
//
// Deliberately market-scoped (brief §Архитектура / §SEO):
// - no `languages`/hreflang linking the RU and EN storefronts;
// - metadata never references the other market's domain (baseUrl is this
//   market's own NEXT_PUBLIC_APP_URL);
// - the RSS alternate is emitted only where a blog exists (RU);
// - JSON-LD claims no permanent team and uses no country as a marketing tag.

export type SiteMetadataOptions = {
  baseUrl: string;
  hasBlog: boolean;
  verification: Metadata["verification"];
};

export function buildSiteMetadata(
  content: MarketContent,
  { baseUrl, hasBlog, verification }: SiteMetadataOptions,
): Metadata {
  return {
    metadataBase: new URL(baseUrl),
    title: { default: content.title, template: "%s · Ludvik4" },
    description: content.description,
    keywords: content.keywords,
    applicationName: "Ludvik4",
    alternates: {
      canonical: "/",
      ...(hasBlog ? { types: { "application/rss+xml": "/blog/rss.xml" } } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    openGraph: {
      type: "website",
      locale: content.ogLocale,
      url: "/",
      siteName: "Ludvik4",
      title: content.shareTitle,
      description: content.description,
    },
    twitter: {
      card: "summary_large_image",
      title: content.shareTitle,
      description: content.description,
    },
    verification,
  };
}

export type ArticleRef = { slug: string; date: string };

/**
 * sitemap.xml entries for a market. RU adds the blog list + its articles; EN
 * (or any non-RU market) lists only the landing. Never the other market's URLs.
 * Pure so both markets are unit-testable in one process.
 */
export function buildSitemap(
  market: Market,
  baseUrl: string,
  articles: ArticleRef[],
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
  ];

  if (market === "ru") {
    entries.push({
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const article of articles) {
      entries.push({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: article.date,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}

/**
 * robots rules for a market. /dashboard + /signin are disallowed everywhere;
 * a non-RU market additionally disallows /blog (the blog is a RU surface that
 * 404s there).
 */
export function buildRobots(
  market: Market,
  baseUrl: string,
): MetadataRoute.Robots {
  const disallow = ["/dashboard", "/signin"];
  if (market !== "ru") disallow.push("/blog");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

/** Lowest price row as a schema.org priceRange string, or undefined. */
function priceRangeOf(content: MarketContent): string | undefined {
  const digits = content.pricing?.rows
    .map((r) => Number(r.price.replace(/[^\d]/g, "")))
    .filter((n) => n > 0);
  if (!digits || digits.length === 0) return undefined;
  return content.pricing?.rows.find(
    (r) => Number(r.price.replace(/[^\d]/g, "")) === Math.min(...digits),
  )?.price;
}

/**
 * Structured data as one @graph: Organization (a studio identity for search
 * engines and LLM crawlers), WebSite, and the ProfessionalService offer
 * catalogue — cross-linked by @id. No team-size or country marketing claim.
 */
export function buildHomeJsonLd(content: MarketContent, baseUrl: string) {
  const service: Record<string, unknown> = {
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#service`,
    name: "Ludvik4",
    description: content.description,
    url: baseUrl,
    areaServed: "Worldwide",
    sameAs: [TELEGRAM_URL],
    parentOrganization: { "@id": `${baseUrl}/#organization` },
  };

  const priceRange = priceRangeOf(content);
  if (content.pricing && priceRange) {
    service.priceRange = priceRange;
    service.makesOffer = content.pricing.rows.map((row) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: row.title },
      priceCurrency: content.market === "ru" ? "RUB" : "EUR",
      price: row.price.replace(/[^\d]/g, ""),
    }));
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Ludvik4",
        url: baseUrl,
        logo: `${baseUrl}/opengraph-image`,
        description: content.description,
        sameAs: [TELEGRAM_URL],
        knowsAbout: [
          ...content.services.items.map((s) => s.title),
          "AI-assisted development",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Ludvik4",
        inLanguage: content.lang,
        publisher: { "@id": `${baseUrl}/#organization` },
      },
      service,
    ],
  };
}
