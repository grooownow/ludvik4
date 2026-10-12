# ADR 0009: Use actual dates for coordinated article releases

## Context

The historical RU content batch was deliberately spread across calendar dates,
and a content test required every RU article, including drafts, to have a unique
date. The article schema and public loaders do not require this restriction.

On 2026-10-12 the user explicitly instructed publication of two completed
client-facing article pairs in both markets and autonomous completion of the
release. Keeping one pair dated 2026-10-13 would misstate its publication date;
backdating the other pair would also be inaccurate.

## Decision

Publish both pairs with their actual release date, 2026-10-12. Remove the
uniqueness-only editorial test. Multiple articles may share a publication date
when they are released together. The existing date-format validation, newest-
first sorting, draft filtering and market isolation remain unchanged.

## Consequences

Release dates describe publication rather than an artificial posting cadence.
The original historical dates remain untouched. Coordinated batches can ship
without future-dating or backdating articles. Scheduling remains an editorial
choice, not a requirement enforced by the content loader.

## Status

`accepted` — the user explicitly authorised the coordinated release.
