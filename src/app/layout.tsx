import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { MARKET, siteMetadata } from "@/features/site";

const geist = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
});

// Title, description, keywords, canonical, OG locale, RSS alternate and
// verification are all market-scoped — built in the site slice from SITE_MARKET
// (src/features/site). No hreflang links the RU and EN storefronts.
export const metadata: Metadata = siteMetadata;

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
      lang={MARKET}
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
