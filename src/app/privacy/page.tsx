import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MARKET, PrivacyPage, siteContent } from "@/features/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Ludvik4 collects, uses, retains, and protects personal data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyNoticePage() {
  if (MARKET !== "en") notFound();
  return <PrivacyPage content={siteContent} />;
}
