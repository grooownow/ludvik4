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
// Share-preview title (og:title / twitter) — kept short and distinct from the
// description below so social cards don't show the same line twice.
const SHARE_TITLE = "Ludvik4 — цифровые продукты";
// Browser tab / SEO <title> — the fuller phrasing.
const SITE_TITLE = "Ludvik4 — цифровые продукты от идеи до запуска";
const SITE_DESCRIPTION =
  "Сайты, приложения, автоматизация — от идеи до запуска.";

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
    "студия разработки",
    "команда разработчиков",
    "лендинг",
    "Ludvik4",
  ],
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
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
    title: SHARE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SITE_DESCRIPTION,
  },
  // Search-engine ownership verification — env-driven slots (unset → no
  // meta tag emitted), same OFF-by-default pattern as PostHog/Sentry.
  verification: {
    ...(env.GOOGLE_SITE_VERIFICATION && {
      google: env.GOOGLE_SITE_VERIFICATION,
    }),
    ...(env.YANDEX_VERIFICATION && { yandex: env.YANDEX_VERIFICATION }),
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
