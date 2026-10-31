import { localeNotFoundCopy, LocaleNotFoundView } from "@/features/site";

// A missing page under /es or /ru answers in that language (the view reads
// the language from the URL; not-found receives no params).
export default function LocaleNotFoundPage() {
  return <LocaleNotFoundView copy={localeNotFoundCopy()} />;
}
