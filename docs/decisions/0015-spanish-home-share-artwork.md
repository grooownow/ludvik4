# ADR 0015: Spanish home share artwork

## Context

The owner wants a Facebook link post to show the approved pink service artwork
and lead to the studio website when clicked. The Spanish home currently emits
no Open Graph image because its layout replaces the root Open Graph fields.

## Decision

Use a versioned static 1200 × 630 PNG at
`public/social/ludvik4-facebook-es-v1.png` for `/es` only, through
`localeHomeMetadata`. Retain the existing Spanish title, description, URL and
locale. Set both Open Graph and Twitter image metadata. Other pages keep their
existing metadata.

Next.js 16.4.2 metadata objects merge shallowly, so the home override carries
the layout's Open Graph and Twitter fields along with the image:
https://nextjs.org/docs/app/api-reference/functions/generate-metadata#merging
Verified against the installed Next.js documentation in this session.

## Consequences

- The Facebook post must share `https://ludvik4.dev/es`, rather than upload the
  image as a separate photo attachment.
- The image URL is public and versioned so a future replacement can use a new
  path. After deployment, refresh `/es` in the Facebook Sharing Debugger.
- Facebook controls the final card layout and may crop previews in some
  placements; the source artwork uses safe margins.
- The approved generated artwork remains visibly consistent with the studio;
  no claim is made that the platform will omit an AI-content label.

## Status

Accepted by the owner and deployed on 2026-11-12 (`4b16c3f`). Production
verification with `facebookexternalhit` passed: the Spanish home emits the
expected metadata in `<head>` and serves the approved 1200 × 630 PNG byte for
byte. Facebook Sharing Debugger requires owner login, so its cached preview
was not refreshed or observed in this session.
