import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getInternationalGuide,
  InternationalGuideView,
  internationalGuides,
} from "@/features/site";
import { env } from "@/lib/env";

type Params = { slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return internationalGuides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getInternationalGuide(slug);
  if (!guide || env.SITE_MARKET !== "en") return {};
  const path = `/guides/${guide.slug}`;

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: path,
    },
  };
}

export default async function InternationalGuideRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guide = getInternationalGuide(slug);
  if (!guide || env.SITE_MARKET !== "en") notFound();

  return (
    <InternationalGuideView guide={guide} baseUrl={env.NEXT_PUBLIC_APP_URL} />
  );
}
