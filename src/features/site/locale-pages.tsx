import { env } from "@/lib/env";
import { type Locale, localePrefix } from "@/lib/i18n";
import { ContactPageView } from "./contact-page";
import { Home } from "./home";
import { workExhibits } from "./home-exhibits";
import { InternationalServiceView } from "./international-pages";
import { getLocaleBundle } from "./locale-content";
import { PricingPageView } from "./pricing-page";

// The pages of ludvik4.dev's Spanish and Russian versions (`app/[locale]`).
// Same views as English, fed with the language's bundle.

export function LocaleHome({ locale }: { locale: Locale }) {
  const { content, work } = getLocaleBundle(locale);
  return (
    <Home
      content={content}
      exhibits={workExhibits(work, localePrefix(locale))}
      baseUrl={env.NEXT_PUBLIC_APP_URL}
    />
  );
}

/** /contact in a language; the lead form exists on the EN build only. */
export async function LocaleContact({ locale }: { locale: Locale }) {
  const { content, orderPrefills } = getLocaleBundle(locale);
  if (process.env.SITE_MARKET !== "en") return null;
  const { LeadForm } = await import("@/features/lead");
  return (
    <ContactPageView
      content={content}
      form={
        <LeadForm
          turnstileSiteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          labels={content.contact.form?.labels}
          orderPrefills={orderPrefills}
          locale={locale}
        />
      }
    />
  );
}

export function LocalePricing({
  locale,
  activeId,
}: {
  locale: Locale;
  activeId?: string;
}) {
  const { content, pricingCatalog } = getLocaleBundle(locale);
  return (
    <PricingPageView
      content={content}
      catalog={pricingCatalog}
      activeId={activeId}
      baseUrl={activeId ? env.NEXT_PUBLIC_APP_URL : undefined}
    />
  );
}

/** /services/<slug>: a detailed service page or a pricing tab. */
export function LocaleServiceSlug({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}): React.ReactNode {
  const { servicePages, pricingServices } = getLocaleBundle(locale);
  const service = servicePages.find((page) => page.slug === slug);
  if (service) {
    return (
      <InternationalServiceView
        service={service}
        baseUrl={env.NEXT_PUBLIC_APP_URL}
        locale={locale}
      />
    );
  }
  if (pricingServices.some((s) => s.slug === slug)) {
    return <LocalePricing locale={locale} activeId={slug} />;
  }
  return null;
}

/** The 404 copy of every language, for the client view. */
export function localeNotFoundCopy() {
  return {
    en: getLocaleBundle("en").ui.notFound,
    es: getLocaleBundle("es").ui.notFound,
    ru: getLocaleBundle("ru").ui.notFound,
  };
}
