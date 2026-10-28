import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  canonicalPath,
  getMarketContent,
  PricingPageView,
} from "@/features/site";
import { env } from "@/lib/env";

// Services and prices (RU only): the hub, first tab open. Each tab also has
// its own page, /uslugi/<slug>.
const path = canonicalPath("ru", "/uslugi");

export const metadata: Metadata = {
  title: "Услуги и цены",
  description:
    "Лендинги, сайты, веб-приложения, анимации и автоматизации: что входит в каждый пакет, сроки и фиксированные цены.",
  alternates: { canonical: path },
  openGraph: { url: path, images: ["/og-image-ru.png"] },
};

export default function PricingRoute() {
  if (env.SITE_MARKET !== "ru") notFound();
  return <PricingPageView content={getMarketContent("ru")} />;
}
