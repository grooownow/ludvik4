import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InternationalGuideIndexView } from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Digital Product Planning Guides",
  description:
    "Practical Ludvik4 worksheets for planning a website, prioritising workflow automation, and scoping an MVP around one complete user journey.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Digital Product Planning Guides — Ludvik4",
    description:
      "Practical decision tools for website, automation, and MVP projects.",
    url: "/guides",
  },
};

export default function InternationalGuidesPage() {
  if (env.SITE_MARKET !== "en") notFound();
  return <InternationalGuideIndexView />;
}
