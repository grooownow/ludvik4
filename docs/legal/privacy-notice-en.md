# Ludvik4 EN privacy notice

Status: implementation draft
Last reviewed: 2026-08-30

The public version is implemented at `/privacy`. Its wording is based on the
actual EN enquiry flow:

- optional name, required reply contact, and task description;
- Vercel hosts the application;
- a one-minute in-memory IP rate-limit window;
- email delivery through Resend;
- PostHog EU Cloud for limited usage analytics on the EN build only, with no
  PostHog initialization on the RU build. Consent-dependent:
  `cookieless_mode: "on_reject"` paired with
  `opt_out_capturing_by_default: true`, so a visitor who declines or ignores
  the banner is measured cookielessly and stores nothing; granting consent adds
  a browser-stored analytics identifier and session replay.
  `person_profiles: "never"` in both states;
- session replay is initialized disabled and started only on an explicit grant,
  with `maskAllInputs` and `maskInputOptions` covering text, textarea and email
  so lead-form content is never recorded;
- Sentry (Functional Software, Inc.) for error diagnostics, initialized on the
  server, edge and client runtimes whenever `SENTRY_DSN` /
  `NEXT_PUBLIC_SENTRY_DSN` are set — which they are in Vercel Production and
  Preview. `sendDefaultPii` is not enabled; observed event content is the error
  and stack trace, the page address, browser and OS, and an approximate
  location derived from the request's network address;
- no Turnstile in the current local configuration.
- controller identity: Ekaterina Pustovaia, trading as Ludvik4, Avenida de
  Francia 79, 46024 Valencia, Spain.

## Required before EN production

1. Configure and test `RESEND_API_KEY`, `LEAD_EMAIL_TO`, and
   `LEAD_EMAIL_FROM` in the EN production deployment. The sender domain must be
   verified in Resend.
2. Make the stated 12-month enquiry deletion schedule operational for every
   delivery channel.
3. Keep Turnstile disabled unless this notice is updated and any required
   consent controls and processor terms are in place. Sentry is live in
   production and is now disclosed in section 4 of `/privacy`; do not enable
   `sendDefaultPii` without revisiting this notice, since that would start
   attaching IP addresses and user identifiers to error reports.
4. Consent is recorded in PostHog's own persistence, not in a second store.
   Withdrawal is offered in the footer of every page and in section 9 of
   `/privacy`, and must stop session replay before clearing the choice —
   otherwise a recorder keeps running for someone who just withdrew.
5. Both legal bases are in play and must stay distinguishable: legitimate
   interest (Art. 6(1)(f)) for the cookieless path, consent (Art. 6(1)(a)) for
   cookies and replay. Withdrawal does not affect prior processing.
6. Enable **Cookieless server hash mode** in PostHog Project Settings → Web
   analytics; PostHog ignores cookieless events when this project setting is
   disabled.

## Primary sources checked

- GDPR, especially Articles 6, 13, and Chapter V:
  https://eur-lex.europa.eu/eli/reg/2016/679/oj
- AEPD layered information guidance:
  https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/6-el-deber-de-informacion/FAQ-0217-que-informacion-debe-facilitarse-cuando-los-datos-se-obtengan-directamente-del-afectado
- Vercel DPA:
  https://vercel.com/legal/dpa
- Resend DPA:
  https://resend.com/legal/dpa
- PostHog cookieless analytics and the consent pattern:
  https://posthog.com/tutorials/cookieless-tracking
- PostHog session replay privacy and input masking:
  https://posthog.com/docs/session-replay/privacy
- Sentry data processing and sub-processors:
  https://sentry.io/legal/dpa/
