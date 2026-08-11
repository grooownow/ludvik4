import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getInternationalWork,
  internationalCaseStudies,
  InternationalWorkView,
} from "@/features/site";
import { env } from "@/lib/env";

type Params = { slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return internationalCaseStudies.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getInternationalWork(slug);
  if (!item || env.SITE_MARKET !== "en") return {};
  const path = `/work/${item.slug}`;

  return {
    title: `${item.title} — Case Study`,
    description: item.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${item.title} — Ludvik4 Case Study`,
      description: item.description,
      url: path,
    },
  };
}

export default async function InternationalWorkRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const item = getInternationalWork(slug);
  if (!item || env.SITE_MARKET !== "en") notFound();
  return (
    <InternationalWorkView item={item} baseUrl={env.NEXT_PUBLIC_APP_URL} />
  );
}
