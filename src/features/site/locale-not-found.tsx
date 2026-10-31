"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type Locale, localizeHref, splitLocale } from "@/lib/i18n";
import type { UiCopy } from "./ui-copy";

/** 404 in the language of the URL it was asked for. */
export function LocaleNotFoundView({
  copy,
}: {
  copy: Record<Locale, UiCopy["notFound"]>;
}) {
  const { locale } = splitLocale(usePathname() ?? "/");
  const text = copy[locale];
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{text.title}</h1>
      <p className="text-muted-foreground max-w-md text-sm">{text.body}</p>
      <Button asChild>
        <Link href={localizeHref(locale, "/") as Route}>{text.cta}</Link>
      </Button>
    </main>
  );
}
