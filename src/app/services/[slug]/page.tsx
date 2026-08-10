import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getInternationalService,
  InternationalServiceView,
  internationalServicePages,
} from "@/features/site";
import { env } from "@/lib/env";

type Params = { slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "en") return [];
  return internationalServicePages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getInternationalService(slug);
  if (!service || env.SITE_MARKET !== "en") return {};
  const path = `/services/${service.slug}`;

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: path },
    openGraph: {
      title: service.title,
      description: service.description,
      url: path,
    },
  };
}

export default async function InternationalServiceRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getInternationalService(slug);
  if (!service || env.SITE_MARKET !== "en") notFound();

  return (
    <InternationalServiceView
      service={service}
      baseUrl={env.NEXT_PUBLIC_APP_URL}
    />
  );
}
