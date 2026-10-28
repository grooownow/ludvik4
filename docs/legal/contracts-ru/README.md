# RU service contracts

Contract templates for the Russian studio (ludvik4.ru). The templates are in
Russian because the contract text itself is the deliverable; this index stays
in English. Nothing here has been reviewed by a lawyer yet.

The owner's private legal/tax notes (sanctions analysis, tax regimes, payment
services, self-employed registration checklist) live outside the repo:
`~/Documents/Personal/Ludvik4 — юридическое/legal-payments-ru.md`. Never copy
personal data from there into this folder.

## Templates

| Service      | File                       | Status                                |
| ------------ | -------------------------- | ------------------------------------- |
| Landing page | [landing.md](./landing.md) | Draft v2 (2026-10-27), owner-approved |
| Website      | [site.md](./site.md)       | Draft v2 (2026-10-27), owner-approved |
| Web app      | [webapp.md](./webapp.md)   | Draft v1 (2026-10-27), to review      |
| Animation/3D | —                          | To do                                 |
| Automation   | —                          | To do                                 |

## Who we contract with

- **In Russia:** sole traders (ИП) and self-employed (НПД) only, under the
  Civil Code. Companies established in Russia are out of scope (EU sanctions,
  Reg. 833/2014 Art. 5n). The owner vets each client before signing; the
  contract carries no client-status representation clause (owner's decision,
  2026-10-27).
- **Outside Russia:** companies, invoiced in EUR by the owner's EU business.
  Needs its own template (EN/RU) — to do.
- **Individuals (consumers):** consumer-protection law changes refunds and
  penalties; needs its own variant if ever offered — to do.

## Shared conventions (reuse in every template)

- Executor: citizen of Russia on НПД. Identified by full name, ИНН, bank
  details and contact channels only — no passport data, no registration
  address (owner's decision, 2026-10-27).
- Payment: 50% within 3 business days of signing, 50% within 3 business days
  of demo acceptance and before publishing. Bank transfer or an invoice from
  «Мой налог»; a НПД receipt for every payment; no VAT. No card acquiring at
  first.
- Client registers and pays for hosting, domain and paid services on their
  own accounts.
- Revision round = one consolidated list of comments; fixing the executor's
  errors is not a round. Approved stages are not redone for free.
- Silent acceptance after 5 business days. Exclusive rights pass on full
  payment; portfolio use allowed after publishing.
- Client is the personal-data operator; policy/consent texts are templates,
  not legal advice.
- Web apps differ: a framework contract. Paid preparation (spec and
  prototype) has a fixed price; development price is an estimate until the
  spec is approved. Every stage is prepaid in full before it starts. Each
  development stage includes a reserve for small changes agreed in chat
  (days set in the plan, 1 business day by default); anything bigger is a
  change request.
- Client cancellation (Civil Code Art. 717) is settled by fixed stage shares
  (landing: brief and design 40%, development 50%, publishing 10%).
- Penalties 0.1% a day, capped at 10%, both ways; executor's liability capped
  at the amount received.
- Disputes: claim procedure, then the court at the executor's place of
  residence; Russian law. Documents signed by exchanging scans/PDF.

## Open items

- Lawyer review of the landing template and of the sanctions question for
  sole traders and self-employed clients.
- Lawyer review of web app clause 8.2: remote access from the EU to Russian
  users' personal data (cross-border transfer under 152-FZ, GDPR for an
  EU-based processor).
- Keep package tables in the annexes in sync with
  `src/features/site/pricing-draft.ts` when prices or scope change.
- Reword «Работаем по договору» / «с компаниями» claims on the site to match
  the client scope above.

## Web app stage shares (starting point for the plan in Annex 1)

| Stage                         | Basic | Extended | Maximum           |
| ----------------------------- | ----- | -------- | ----------------- |
| Preparation (+ research)      | 15%   | 20%      | 20%               |
| Design and design system      | 15%   | 15%      | 15%               |
| Development, scenario 1       | 50%   | 25%      | 15%               |
| Development, further scenarios | —     | 20%      | 10% each (up to 3) |
| Testing and launch            | 20%   | 20%      | 20%               |

Adjust per project from the hour estimate; the shares must add up to 100%.
