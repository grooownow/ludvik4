import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InternationalWorkIndexView } from "@/features/site";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected Ludvik4 work with public evidence, including open-source products, documentation, and inspectable code.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Selected Work — Ludvik4",
    description: "Digital products with public, inspectable evidence.",
    url: "/work",
  },
};

export default function InternationalWorkPage() {
  if (env.SITE_MARKET !== "en") notFound();
  return <InternationalWorkIndexView />;
}
