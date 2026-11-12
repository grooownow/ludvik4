# Plan: whatsapp-button

Spec: `docs/specs/whatsapp-button.md`. Lives in the existing `site` slice
(it is site chrome, not a domain feature) — no new slice, no route, no schema,
no env var.

- `src/features/site/whatsapp.tsx` — `WHATSAPP_NUMBER`, `whatsappHref(text)`,
  `WhatsAppMark` (Simple Icons glyph, CC0), `WhatsAppLink` (client: tracks
  `contact.whatsapp_clicked`), `WhatsAppFloat` (client: fixed button, phone ×
  with the `localStorage` flag). Colocated `whatsapp.test.tsx`.
- `src/features/site/ui-copy.ts` (+ `locales/es/ui.ts`, `locales/ru/ui.ts`) —
  `whatsapp: { label, caption, greeting, hide }`.
- `src/features/site/site-chrome.tsx` — header icon link next to the language
  switch, footer link next to Telegram, `WhatsAppFloat` in the footer; all
  only when `content.locale` is set (ludvik4.dev).
- `src/lib/analytics.ts` — `whatsappClicked: "contact.whatsapp_clicked"`;
  `docs/playbooks/analytics.md` catalog row if it lists events.
- `src/app/globals.css` — `--whatsapp` brand token (+ `--color-whatsapp`).

Open decisions: none (owner fixed number, placement, sizes and the phone ×
in chat on 2026-11-12; storage-remembered hide and the green-mark-on-white
pill are within the spec).

NO UNRESOLVED DECISIONS
