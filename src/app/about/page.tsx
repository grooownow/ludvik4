import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InternationalAboutView } from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata = {
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
  if (env.SITE_MARKET !== "en") notFound();
  return <InternationalAboutView />;
}
