import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { env } from "@/lib/env";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
});

const SITE_NAME = "Ludvik4";
const SITE_TITLE = "Ludvik4 — цифровые продукты от идеи до запуска";
const SITE_DESCRIPTION =
  "Сайты, веб-приложения и SaaS, плагины, автоматизация рутины — довожу до готового продукта. Инженер с опытом 10+ лет.";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Ludvik4",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "разработка сайтов",
    "веб-приложения",
    "SaaS",
    "MVP",
    "автоматизация",
    "AI-разработка",
    "фрилансер разработчик",
    "лендинг",
    "Ludvik4",
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#ff4fb6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={cn("font-sans", geist.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
