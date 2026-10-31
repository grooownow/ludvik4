# EN storefront parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** ludvik4.dev sells what ludvik4.ru sells, in natural English, in EUR, for a studio based in Spain, while the RU build stays byte-identical in content.

**Architecture:** `PricingPageView` and the small client pieces gain copy props whose defaults are today's Russian strings. EN data lives in `international-pricing.ts` and reaches the shared view as a `PricingCatalog`. Order buttons on EN link to `/contact?service=&package=`; the lead form validates the params and prefills the message.

**Tech Stack:** Next.js App Router, zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-31-en-storefront-parity-design.md`

## Global Constraints

- RU `out/` text unchanged against the baseline in the scratchpad.
- Package cards show the price only, with no VAT wording.
- Prices exactly as in the spec table. Internal links use `<Link>`.
- No Cyrillic, `₽`, `152-ФЗ`, `РФ` or Russia-only products in EN service data.
- MAX and Yandex Browser are never named. No deploy, push or merge before the owner sees the local result.

## Review Focus

- `/contact?service=<garbage>` or `?service=__proto__`: empty form, no crash.
- Typed text in the form is not overwritten by the prefill after a failed submit.
- A price string with `€` and `,` gives a correct JSON-LD number (`1950`), and `from €1,050` too.
- `/services/<slug>` serves both kinds of page; an unknown slug is a 404; RU build gets none of them.
- Phone width: long English package titles and tab chips do not overflow.

---

### Task 1: Shared view takes a catalog (RU unchanged)

**Files:** Modify `pricing-page.tsx`, `pricing-tabs.tsx`, `motion-gallery.tsx`, `order-cta.tsx`, `mascot-reply.tsx`, `home-stage.tsx`; tests beside them.

**Produces:** `PricingCatalog { services, href(id), copy, orderHref(service, pack), jsonLd }`, `ruPricingCatalog`, `PricingPageView({ content, activeId, baseUrl, catalog? })`, `OrderCta` prop `contactHref?`, `MotionGallery({ items? })`, `MascotReply({ copy? })`.

- [ ] Existing RU tests stay green with no edits; add a test that a catalog's copy renders in place of Russian.

### Task 2: EN catalog and pages

**Files:** Create `international-pricing.ts` + test, `src/app/services/page.tsx`; modify `src/app/services/[slug]/page.tsx`, `seo.ts`, `llms.txt/route.ts`, `index.ts`.

- [ ] Failing tests: the 15 spec prices; no Russian residue; sitemap has six new URLs; offers parse to numbers.
- [ ] Implement, pass, commit.

### Task 3: Order to prefilled contact form

**Files:** Create `src/features/lead/order-prefill.ts` + test; modify `lead-form.tsx`, `market-contact.tsx`.

- [ ] Failing tests from Review Focus 1 and 2; implement; commit.

### Task 4: EN site copy, voice, Spain, halls, mascot

**Files:** Modify `content.ts`, `international-content.ts`, `international-pages.tsx`, `service-files.ts`, `src/app/about/page.tsx`, tests that pin the old claims; docs `manifest.md`, `rules/content.md`, `marketing/en/`.

- [ ] Update tests first (hall links, Spain, no "Europe-based"), then copy; commit.

### Task 5: Legal pages

**Files:** Create `legal-en.tsx` + test, `src/app/legal-notice/page.tsx`, `src/app/cookies/page.tsx`, `src/app/terms/page.tsx`; modify `content.ts` footer, `consent-banner.tsx`, `privacy-page.tsx`, `seo.ts`.

- [ ] Verify the law from BOE and AEPD, write failing test for routes and footer, implement, commit.

### Task 6: Editing passes

- [ ] Native-reader editor with no Russian; RU-to-EN meaning check; apply; commit.

### Task 7: Verify

- [ ] `pnpm lint`, `pnpm test`, `pnpm test:e2e`, EN build, RU build diff against baseline, browser check at 375, 768, 1280. Update roadmap Now. Show the owner the local result.
