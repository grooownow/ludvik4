import type { Metadata } from "next";
import {
  AboutRuView,
  canonicalPath,
  InternationalAboutView,
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
          "Ludvik4 is a Europe-based, founder-led web product studio working worldwide on websites, workflow automation, MVPs, and custom web applications.",
        alternates: { canonical: "/about" },
        openGraph: {
          title: "About Ludvik4",
          description:
            "A founder-led web product studio in Europe, working worldwide.",
          url: "/about",
        },
      };

export default function AboutPage() {
  if (env.SITE_MARKET === "ru") return <AboutRuView />;
  return <InternationalAboutView />;
}
