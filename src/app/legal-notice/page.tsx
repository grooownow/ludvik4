import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalNoticeView, MARKET } from "@/features/site";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Who runs Ludvik4: owner, address, tax ID and contact details.",
  alternates: { canonical: "/legal-notice" },
};

export default function Page() {
  if (MARKET !== "en") notFound();
  return <LegalNoticeView />;
}
