import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  canonicalPath,
  PrivacyPolicyRuView,
  getMarketContent,
} from "@/features/site";
import { env } from "@/lib/env";

// RU legal page for the order form (docs/specs/order-form-ru.md).
const path = canonicalPath("ru", "/politika-konfidentsialnosti");

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description:
    "Какие персональные данные получает студия Ludvik4 через сайт, зачем, где хранит и как их удалить.",
  alternates: { canonical: path },
};

export default function Page() {
  if (env.SITE_MARKET !== "ru") notFound();
  return <PrivacyPolicyRuView content={getMarketContent("ru")} />;
}
