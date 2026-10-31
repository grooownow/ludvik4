import { CookiePolicyView, LegalNoticeView, TermsView } from "../../legal-en";
import { PrivacyPage } from "../../privacy-page";
import { ruContent } from "./content";

// TRANSLATION STUB — replaced by the ru translation.
export function RuLegalNotice() {
  return <LegalNoticeView />;
}
export function RuCookiePolicy() {
  return <CookiePolicyView />;
}
export function RuTerms() {
  return <TermsView />;
}
export function RuPrivacy() {
  return <PrivacyPage content={ruContent} />;
}
