import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CaseStudyPageView,
  DEV_CASE_SLUGS,
  enCaseSite,
  getCaseGallery,
  languageAlternates,
} from "@/features/site";
import { env } from "@/lib/env";
import { isTranslatedPath } from "@/lib/i18n";

type Params = { slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return DEV_CASE_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getCaseGallery(enCaseSite, slug);
  if (!g || env.SITE_MARKET !== "en") return {};
  const path = `/work/${slug}`;
  const { image } = enCaseSite.seo(slug as (typeof DEV_CASE_SLUGS)[number]);

  return {
    title: `${g.title} — Case Study`,
    description: g.line,
    alternates: {
      canonical: path,
      // Only the works translated into every language have alternates.
      ...(isTranslatedPath(path) ? languageAlternates(path) : {}),
    },
    openGraph: {
      title: enCaseSite.ui.caseTitle(g.title),
      description: g.line,
      url: path,
      images: [image],
    },
  };
}

export default async function InternationalWorkRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const g = getCaseGallery(enCaseSite, slug);
  if (!g || env.SITE_MARKET !== "en") notFound();
  return (
    <CaseStudyPageView
      site={enCaseSite}
      slug={slug as (typeof DEV_CASE_SLUGS)[number]}
      baseUrl={env.NEXT_PUBLIC_APP_URL}
    />
  );
}
