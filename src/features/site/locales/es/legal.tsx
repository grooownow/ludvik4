import { CookiePolicyView, LegalNoticeView, TermsView } from "../../legal-en";
import { PrivacyPage } from "../../privacy-page";
import { esContent } from "./content";

// TRANSLATION STUB — replaced by the es translation.
export function EsLegalNotice() {
  return <LegalNoticeView />;
}
export function EsCookiePolicy() {
  return <CookiePolicyView />;
}
export function EsTerms() {
  return <TermsView />;
}
export function EsPrivacy() {
  return <PrivacyPage content={esContent} />;
}
