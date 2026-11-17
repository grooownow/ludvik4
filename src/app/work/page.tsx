import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CasesIndexView,
  enCaseSite,
  languageAlternates,
} from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Ludvik4 studio projects with their real screens: the smallFriendFiles pet medical file, the Gridfin starter kit, an online Secret Santa game and the qa-pilot plugin.",
  alternates: { canonical: "/work", ...languageAlternates("/work") },
  openGraph: {
    title: "Ludvik4 work",
    description: "Digital products shown screen by screen.",
    url: "/work",
  },
};

export default function InternationalWorkPage() {
  if (env.SITE_MARKET !== "en") notFound();
  return <CasesIndexView site={enCaseSite} baseUrl={env.NEXT_PUBLIC_APP_URL} />;
}
