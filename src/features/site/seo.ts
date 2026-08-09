import type { Metadata, MetadataRoute } from "next";
import { caseStudies, servicePages } from "./commercial-content";
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
  const ruShareImage =
    content.market === "ru"
      ? {
          url: "/og-image-ru.png",
          width: 1200,
          height: 630,
          type: "image/png",
          alt: "Ludvik4 — разработка цифровых продуктов",
        }
      : undefined;

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
      ...(ruShareImage ? { images: [ruShareImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: content.shareTitle,
      description: content.description,
      ...(ruShareImage ? { images: [ruShareImage] } : {}),
    },
    verification,
  };
}

export type ArticleRef = { slug: string; date: string };

/** Match the public URL style of each production host. */
export function canonicalPath(market: Market, path: string): string {
  if (market === "ru" && path !== "/" && !path.endsWith("/")) {
    return `${path}/`;
  }
  return path;
}

export function publicUrl(
  market: Market,
  baseUrl: string,
  path: string,
): string {
  return `${baseUrl.replace(/\/$/, "")}${canonicalPath(market, path)}`;
}

/**
 * sitemap.xml entries for a market. RU adds the blog list + its articles; EN
 * adds its privacy notice. Never the other market's URLs.
 * Pure so both markets are unit-testable in one process.
 */
export function buildSitemap(
  market: Market,
  baseUrl: string,
  articles: ArticleRef[],
): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: publicUrl(market, baseUrl, "/"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  if (market === "ru") {
    for (const service of servicePages) {
      entries.push({
        url: publicUrl(market, baseUrl, `/uslugi/${service.slug}`),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
    entries.push({
      url: publicUrl(market, baseUrl, "/cases"),
      changeFrequency: "monthly",
      priority: 0.8,
    });
    for (const study of caseStudies) {
      entries.push({
        url: publicUrl(market, baseUrl, `/cases/${study.slug}`),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    // The Gridfin landing and its supporting pages are static files in
    // public/gridfin/ (built in the grooownow/gridfin repo), not Next routes —
    // listed here because this host's sitemap is their only sitemap.
    for (const path of [
      "/gridfin",
      "/gridfin/docs/application-skeleton",
      "/gridfin/guides/why-ai-needs-engineering-rules",
    ]) {
      entries.push({
        url: publicUrl(market, baseUrl, path),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    entries.push({
      url: publicUrl(market, baseUrl, "/blog"),
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (const article of articles) {
      entries.push({
        url: publicUrl(market, baseUrl, `/blog/${article.slug}`),
        lastModified: article.date,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } else {
    entries.push({
      url: publicUrl(market, baseUrl, "/privacy"),
      changeFrequency: "yearly",
      priority: 0.2,
    });
  }

  return entries;
}

/**
 * robots rules, identical for every market: /dashboard + /signin are the only
 * disallowed paths. No `market` parameter — the rules no longer differ.
 *
 * The EN build used to additionally disallow /blog, back when the blog simply
 * 404'd outside RU. Since ТЗ 2 those paths permanently redirect to the RU
 * domain (config/redirects.ts), and a crawler forbidden to fetch a URL never
 * sees its 301 — disallowing them would strand the five live articles in the
 * index as "blocked by robots.txt" and drop the link equity the redirect
 * exists to carry.
 */
export function buildRobots(baseUrl: string): MetadataRoute.Robots {
  const disallow = ["/dashboard", "/signin"];
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
        logo:
          content.market === "ru"
            ? `${baseUrl}/og-image-ru.png`
            : `${baseUrl}/opengraph-image`,
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
