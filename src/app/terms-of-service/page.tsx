import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TermsView, MARKET } from "@/features/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "How Ludvik4 works with clients: scope, payment, rights and withdrawal.",
  alternates: { canonical: "/terms-of-service" },
};

export default function Page() {
  if (MARKET !== "en") notFound();
  return <TermsView />;
}
