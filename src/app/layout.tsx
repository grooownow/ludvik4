import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { shouldLoadVercelAnalytics } from "@/lib/analytics";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { VercelAnalytics } from "@/components/vercel-analytics";
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
        {/*
          Vercel Web Analytics carries the traffic baseline — and the
          geolocation PostHog cannot see, because cookieless server hash mode
          strips the IP before enrichment runs. EN only: the RU export is
          served from Timeweb, where /_vercel/insights/* does not exist.
          Custom events are deliberately not routed here — the Vercel team is
          on Hobby, which has none (docs/specs/analytics-events.md).

          Off Vercel this logs two console errors per page load, because
          /_vercel/insights/script.js exists only on a Vercel deployment. That
          is accepted rather than gated behind `process.env.VERCEL`: that flag
          is only exposed when "Enable access to System Environment Variables"
          is ticked in project settings, so gating on it would silently stop
          collection in production the day someone unticks it. Local console
          noise is the cheaper failure.

          Wrapped rather than mounted directly so a device muted with
          `?ludvik4_internal=1` drops its own events here too — see
          src/components/vercel-analytics.tsx.
        */}
        {shouldLoadVercelAnalytics(MARKET) ? <VercelAnalytics /> : null}
      </body>
    </html>
  );
}
