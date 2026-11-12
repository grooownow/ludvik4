# Spec: WhatsApp contact button (ludvik4.dev)

## Problem

International visitors of ludvik4.dev mostly live in WhatsApp, but the site
offers only Telegram, email and the contact page. Someone ready to ask a
question has to copy a number or switch apps by hand.

## Scope

ludvik4.dev only (the EN build: `/`, `/es/*`, `/ru/*`). ludvik4.ru is not
touched.

- One WhatsApp chat link, `https://wa.me/34665575316?text=<greeting>`
  (the owner's number, +34 665 575 316), with a short greeting prefilled in
  the page's language. On a phone it opens the WhatsApp app straight in the
  chat; on a computer WhatsApp Desktop or WhatsApp Web.
- **Floating button**, fixed bottom right on every page that renders the site
  footer:
  - desktop (`sm` and up): a larger white pill — the green WhatsApp mark and
    the caption "Question or proposal? Message us on WhatsApp";
  - phones: a smaller round green button with the mark only, plus a × that
    hides it. The choice is remembered in `localStorage`
    (`ludvik4:whatsapp-float-hidden`) so it stays hidden on later pages and
    visits; desktop never hides it.
- **Header**: a WhatsApp icon link next to the language switch (all widths).
- **Footer**: a "WhatsApp" text link next to Telegram.
- Analytics: one new event `contact.whatsapp_clicked` with
  `placement: "float" | "header" | "footer"` (same guard as Telegram).
- Copy in EN, ES and RU (`UiCopy.whatsapp`).

Touches: `src/features/site/{site-chrome.tsx,ui-copy.ts,locales/*/ui.ts}`,
new `src/features/site/whatsapp.tsx`, `src/lib/analytics.ts`,
`src/app/globals.css` (one brand token, `--whatsapp`).

## UX flow

1. A visitor opens any ludvik4.dev page; after hydration the floating button
   fades in at the bottom right (safe-area aware).
2. Tap/click → new tab/app opens the WhatsApp chat with the greeting typed in.
3. On a phone, × hides the floating button now and on later pages; the header
   and footer links stay.

No loading/empty/error states: it is a plain external link.

## Data model

None (no db). One `localStorage` flag per browser.

## Edge cases

- Storage blocked (private mode) → × still hides it for the current page.
- Dismissed on a phone, then the window widens → the desktop pill shows (the
  flag only hides it below `sm`).
- RU market build → nothing renders (no locale on the content).
- Cookie banner (z-50, full width at the bottom) on a first visit → it
  covers the button (z-40) until answered; the header link stays reachable.

## Test scenarios

- Component: on a `.dev` page the footer has the WhatsApp link with the exact
  `wa.me` URL and the locale's greeting (EN and ES); the header has the icon
  link; the RU market page has none of the three.
- Component: × hides the floating button and writes the flag; with the flag
  set it renders hidden on phones; desktop caption present.
- Unit: the link builder encodes the greeting; analytics catalog includes the
  new event.
- E2E smoke is not extended (external link, no flow).

## Out-of-scope

WhatsApp Business API, chat widgets, a WhatsApp option on ludvik4.ru.

## Status

`shipped` — approved by the owner in chat and merged on 2026-11-12.
