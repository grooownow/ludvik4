import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canonicalPath, ServicesIndexView, siteContent } from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Ludvik4 services: custom websites, workflow automation, and web apps or compact SaaS products.",
  alternates: { canonical: canonicalPath(env.SITE_MARKET, "/services") },
};

export default function ServicesPage() {
  if (env.SITE_MARKET !== "en") notFound();
  return <ServicesIndexView content={siteContent} />;
}
