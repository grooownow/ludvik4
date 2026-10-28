import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canonicalPath, CasesIndexView } from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Работы",
  description:
    "Работы студии Ludvik4: медкарта питомца SmallFriendFiles, городская афиша FortNoise, Gridfin и qa-pilot.",
  alternates: { canonical: canonicalPath(env.SITE_MARKET, "/cases") },
  openGraph: {
    title: "Работы Ludvik4",
    description: "Реальные цифровые продукты с публичным результатом.",
    url: canonicalPath(env.SITE_MARKET, "/cases"),
    images: ["/og-image-ru.png"],
  },
};

export default function CasesPage() {
  if (env.SITE_MARKET !== "ru") notFound();
  return <CasesIndexView baseUrl={env.NEXT_PUBLIC_APP_URL} />;
}
