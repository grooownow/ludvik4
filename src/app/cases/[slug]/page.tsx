import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, CaseStudyPageView, getCaseStudy } from "@/features/site";
import { env } from "@/lib/env";

type Params = { slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "ru") return [];
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || env.SITE_MARKET !== "ru") return {};

  return {
    title: `${study.title} — кейс`,
    description: study.description,
    alternates: { canonical: `/cases/${study.slug}` },
    openGraph: {
      title: `${study.title} — кейс Ludvik4`,
      description: study.description,
      url: `/cases/${study.slug}`,
      images: [study.image],
    },
  };
}

export default async function CaseStudyRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || env.SITE_MARKET !== "ru") notFound();

  return <CaseStudyPageView study={study} baseUrl={env.NEXT_PUBLIC_APP_URL} />;
}
