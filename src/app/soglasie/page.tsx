import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  canonicalPath,
  ConsentRuView,
  getMarketContent,
} from "@/features/site";
import { env } from "@/lib/env";

// RU legal page for the order form (docs/specs/order-form-ru.md).
const path = canonicalPath("ru", "/soglasie");

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Текст согласия на обработку персональных данных, которое даётся при отправке заявки на сайте Ludvik4.",
  alternates: { canonical: path },
};

export default function Page() {
  if (env.SITE_MARKET !== "ru") notFound();
  return <ConsentRuView content={getMarketContent("ru")} />;
}
