import type { Metadata } from "next";
import {
  AboutRuView,
  canonicalPath,
  InternationalAboutView,
  languageAlternates,
} from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata =
  env.SITE_MARKET === "ru"
    ? {
        title: "О студии",
        description:
          "Ludvik4 — студия веб-разработки: сайты, автоматизация и веб-приложения от задачи до запуска.",
        alternates: { canonical: canonicalPath(env.SITE_MARKET, "/about") },
      }
    : {
        title: "About the Studio",
        description:
          "Ludvik4 is a founder-led web product studio based in Spain, working worldwide on websites, workflow automation, MVPs, and custom web applications.",
        alternates: { canonical: "/about", ...languageAlternates("/about") },
        openGraph: {
          title: "About Ludvik4",
          description:
            "A founder-led web product studio in Spain, working worldwide.",
          url: "/about",
        },
      };

export default function AboutPage() {
  if (env.SITE_MARKET === "ru") return <AboutRuView />;
  return <InternationalAboutView />;
}
