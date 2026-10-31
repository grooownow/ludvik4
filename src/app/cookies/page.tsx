import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CookiePolicyView, MARKET } from "@/features/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies Ludvik4 uses, why, and how to change your choice.",
  alternates: { canonical: "/cookies" },
};

export default function Page() {
  if (MARKET !== "en") notFound();
  return <CookiePolicyView />;
}
