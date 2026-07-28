import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  canonicalPath,
  getServicePage,
  ServicePageView,
  servicePages,
} from "@/features/site";
import { env } from "@/lib/env";

type Params = { slug: string };

export function generateStaticParams() {
  if (env.SITE_MARKET !== "ru") return [];
  return servicePages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service || env.SITE_MARKET !== "ru") return {};
  const servicePath = canonicalPath("ru", `/uslugi/${service.slug}`);

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: servicePath },
    openGraph: {
      title: service.title,
      description: service.description,
      url: servicePath,
      images: ["/og-image-ru.png"],
    },
  };
}

export default async function ServiceRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service || env.SITE_MARKET !== "ru") notFound();

  return (
    <ServicePageView service={service} baseUrl={env.NEXT_PUBLIC_APP_URL} />
  );
}
