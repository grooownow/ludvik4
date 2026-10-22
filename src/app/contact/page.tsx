import type { Metadata } from "next";
import { canonicalPath, MarketContact } from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata =
  env.SITE_MARKET === "en"
    ? {
        title: "Contact",
        description:
          "Tell Ludvik4 about your website, automation or web app project — send a request or message on Telegram.",
        alternates: { canonical: canonicalPath(env.SITE_MARKET, "/contact") },
        openGraph: { title: "Contact — Ludvik4", url: "/contact" },
      }
    : {
        title: "Контакты",
        description:
          "Расскажите о задаче: сайт, автоматизация или веб-приложение — напишите в Telegram.",
        alternates: { canonical: canonicalPath(env.SITE_MARKET, "/contact") },
        openGraph: { title: "Контакты — Ludvik4", url: "/contact/" },
      };

export default function ContactPage() {
  return <MarketContact />;
}
