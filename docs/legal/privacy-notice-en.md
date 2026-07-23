# Ludvik4 EN privacy notice

Status: implementation draft
Last reviewed: 2026-07-23

The public version is implemented at `/privacy`. Its wording is based on the
actual EN enquiry flow:

- optional name, required reply contact, and task description;
- Vercel hosts the application;
- a one-minute in-memory IP rate-limit window;
- Telegram Bot API delivery;
- no PostHog, Sentry, Resend, or Turnstile in the current local configuration.
- controller identity: Ekaterina Pustovaia, trading as Ludvik4, Avenida de
  Francia 79, 46024 Valencia, Spain.

## Required before EN production

1. Confirm a GDPR-compliant transfer and processing arrangement for Telegram
   Bot API delivery. Telegram publishes Bot Developer Terms and a privacy
   policy, but no controller-to-processor DPA/SCC for Bot API was verified
   during this review. The lower-risk path is to deliver the EN form only by
   email through a provider with an accepted DPA/SCC, while keeping Telegram as
   an optional direct-contact link.
2. Make the stated 12-month enquiry deletion schedule operational for every
   delivery channel.
3. Keep `NEXT_PUBLIC_POSTHOG_KEY`, Sentry, and Turnstile disabled unless this
   notice is updated and any required consent controls and processor terms are
   in place.

## Primary sources checked

- GDPR, especially Articles 6, 13, and Chapter V:
  https://eur-lex.europa.eu/eli/reg/2016/679/oj
- AEPD layered information guidance:
  https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/6-el-deber-de-informacion/FAQ-0217-que-informacion-debe-facilitarse-cuando-los-datos-se-obtengan-directamente-del-afectado
- Telegram privacy policy:
  https://telegram.org/privacy
- Telegram Bot Platform Developer Terms:
  https://telegram.org/tos/bot-developers
- Vercel DPA:
  https://vercel.com/legal/dpa
