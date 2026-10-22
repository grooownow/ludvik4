import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canonicalPath, ServicesIndexView, siteContent } from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Услуги Ludvik4: разработка сайтов и лендингов, автоматизация бизнес-процессов, веб-приложения и компактные SaaS.",
  alternates: { canonical: canonicalPath(env.SITE_MARKET, "/uslugi") },
};

export default function UslugiPage() {
  if (env.SITE_MARKET !== "ru") notFound();
  return <ServicesIndexView content={siteContent} />;
}
