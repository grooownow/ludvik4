import { env } from "@/lib/env";
import { ContactPageView } from "./contact-page";
import { getMarketContent } from "./content";

// /contact for whichever market this build serves.
//
// The branch keys off `process.env.SITE_MARKET`, which next.config.ts inlines
// as a build-time constant — so the bundler drops the unused branch, INCLUDING
// its dynamic import(). The lead form and its "use server" action live only in
// the EN branch: that is what keeps the RU build from bundling (or
// registering) the lead backend (brief §Контакты). This used to live in
// market-home.tsx before the form moved off the home.
export async function MarketContact() {
  if (process.env.SITE_MARKET === "en") {
    const { LeadForm } = await import("@/features/lead");
    const content = getMarketContent("en");
    return (
      <ContactPageView
        content={content}
        form={
          <LeadForm
            turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            labels={content.contact.form?.labels}
          />
        }
      />
    );
  }
  return <ContactPageView content={getMarketContent("ru")} />;
}
