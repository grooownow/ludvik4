# Spain search visibility audit and growth plan

Date: 2026-11-12, Europe/Madrid. Status: researched proposal for owner review.
Scope: ludvik4.dev, with Spain as the target market. This task produces a plan;
it does not publish articles, change the website, or submit indexing requests.

## Verdict

Google already sees the site. All 19 current Spanish sitemap URLs appear in
the indexed-pages report. The main constraint is commercially relevant
visibility in Spain, rather than a site-wide indexing failure.

Prioritise Spanish service pages and a small Spanish buyer-guide network.
Retain the engineering blog as evidence of expertise. Its existing developer
audience is different from a business owner choosing someone to build a website,
automate a process, or deliver a web application.

Working audience assumption, pending the owner's preference: Spanish-speaking
autonomos and small service businesses first; founders needing a bounded web
application second; English-speaking businesses in Spain as a secondary track.
The site identifies Valencia as its base; nationwide remote delivery is the
primary geography. Do not invent offices or local client experience elsewhere.

## Evidence and limitations

Authenticated GSC was accessible through the connected Chrome extension.
Playwright MCP itself returned a profile-in-use error; this did not prevent
the audit. Future sessions should try connected Chrome before repeating the
previous restart/login instructions.

| Source / period                          | Verified result                                            | Interpretation                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| GSC Web, 14 Oct–10 Nov 2026              | 177 impressions, 0 clicks, CTR 0%, average position 7.9    | Small exposure, no recorded Google Web clicks in this period                                     |
| Same period, country Spain               | 5 impressions, 0 clicks, average position 16.4             | Spanish-market acquisition is barely established                                                 |
| GSC Web, 11 Aug–10 Nov 2026              | 568 impressions, 9 clicks, CTR 1.6%, average position 24.4 | Search discovery exists; do not compare this total directly with a 28-day total as a growth rate |
| GSC indexed-pages report, updated 9 Nov  | 56 indexed, 25 excluded                                    | Includes historical URLs and Gridfin, not just the current root sitemap                          |
| Spanish sitemap URLs in indexed examples | 19 of 19 present                                           | Spanish discovery/indexing is already working                                                    |
| Root sitemap                             | Success, 54 discovered, read 12 Nov                        | Already processed; no need to resubmit an unchanged sitemap                                      |
| Gridfin sitemap                          | Success, 8 discovered, read 11 Nov                         | Separate product inventory; counts can overlap with the root sitemap                             |
| GSC generative AI report, 14 Oct–10 Nov  | 13 impressions                                             | Some Google AI-feature exposure is confirmed                                                     |
| GSC generative AI report, 11 Aug–10 Nov  | 16 impressions                                             | Does not prove a vendor recommendation or visibility in other assistants                         |
| Raw HTTP crawl                           | All 54 sitemap URLs: 200, self-canonical, indexable        | No global technical indexability blocker found                                                   |

The 28-day window contains only 31 Oct–10 Nov of the new Spanish storefront.
It is too early to treat its low exposure as a mature strategy's failure.
The average position 7.9 is a mixed, low-volume aggregate, not a position for
Spanish commercial keywords. Query and page rows do not reconcile with totals
because aggregation and privacy filtering differ.

The only visible query in the Spain-filtered query table was `gridfin` (one
impression); its only visible page row was `/gridfin/es` (one impression).
Other impressions are not attributable from the visible rows. This does not
prove that all five Spain impressions were product-related.

Across countries, visible Spanish storefront rows were `/es/legal-notice` (2),
`/es/services/web-animation` (1), `/es/work/qa-pilot` (1), and
`/es/services/landing-pages` (1). These are worldwide page rows, distinct from
the country=Spain cohort above. No sustained Spanish service-query demand is
demonstrated by the available data.

Historical technical queries dominate the visible three-month query sample:
`spec driven development vs vibe coding` (105 impressions),
`vibe coding vs spec coding` (71), and `spec coding vs vibe coding` (54).
Recent commercial signals are small but useful: `custom web app development
quote` (4), `web application development quote` (2), and `app development
quotation` (1). These are English queries, not evidence of Spanish demand.

Local evidence: [crawl and service files](evidence-2026-11-12/),
[GSC transcription](evidence-2026-11-12/search-console.json).
Public `site:`/brand searches did not return a reliable .dev result in this
provider; authenticated GSC contradicts any inference of deindexing.
Bing index state, qualified enquiries, referral conversions, and captured
ChatGPT/Perplexity/Gemini answers remain unverified. GSC overview has no
Core Web Vitals field data; no lab speed score was measured.

## Reconcile the existing strategy

| Existing material                                  | Keep                                                                                | Update in the implementation phase                                                                                    |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `docs/business-strategy.md`, July                  | One accountable lead, defined outcomes, websites + automation + applications        | EN-only and avoiding Spain in marketing are superseded by October's storefront decisions                              |
| `docs/marketing/en/market-strategy.md`, August     | Scope control, direct communication, public evidence, ownership                     | Worldwide English acquisition is no longer sufficient for this Spain objective; proposal-only pricing is outdated     |
| `docs/marketing/en/search-and-content-strategy.md` | Three buyer intent clusters, planning tools, meaningful internal links              | Five package pages now exist; the old no-commercial-split rule no longer describes production                         |
| `docs/marketing/en/product-canon.md`               | Founder-led model, no invented permanent team, no invented outcomes                 | Update English-only wording and the ban on published price anchors; current EUR prices were owner-approved in October |
| `docs/content-plan.md` / `docs/seo-core.md`        | Technical authority backlog for its own audience                                    | Russian Wordstat figures and developer topics cannot set Spanish buyer-content priorities                             |
| ADR 0006 / `docs/rules/content.md`                 | Buyer guides separate from engineering articles; drafts reviewed before publication | Add a Spanish buyer-guide publishing path; retain technical-blog audience rules for the blog                          |
| October multilingual and pricing decisions         | ES URLs, EUR offers, Spain openly stated, RU noindex                                | Preserve routing and pricing; add an ES guide surface rather than rebuilding the locale system                        |

This proposal does not silently replace the canonical marketing documents.
Reconcile them as the first implementation task after reviewing this plan.

## Technical and content findings

1. **No site-wide crawl blocker.** robots.txt allows crawling; the sitemap and
   optional service files return non-HTML responses. All 19 ES pages have
   reciprocal EN/ES/x-default hreflang. Russian `/ru` remains intentionally
   noindex and outside the sitemap. Do not remove that boundary as an SEO fix.
2. **A specific EN exception persists.** `/services/workflow-automation` is
   discovered but not indexed in GSC. `/qa-pilot` and `/gridfin/pt-br` share
   that aggregate state. Investigate the EN automation page's value and links;
   do not describe this as a blocker affecting its indexed ES equivalent.
3. **The Spanish buyer-content path is missing.** `/es/guides` and `/es/blog`
   return 404. Spanish navigation labelled `Guias` goes to `/guides`, and the
   three ES service-detail pages link to English worksheets with English
   titles. This is an intentional implementation boundary, now a market gap.
4. **Page roles overlap.** Website service detail and website packages,
   automation detail and automation packages, MVP detail and web-app packages
   address adjacent buying decisions. Cannibalisation is a risk to manage,
   not a proven ranking penalty. Assign one main commercial page per offer.
5. **Local relevance is light.** Titles primarily name services and package
   prices; Valencia is explicit on About, Spain mostly in general copy and
   the footer. Add useful buyer/Spain context to commercial content rather
   than repeating city names or forcing Spain into every heading.
6. **Proof needs a buyer-facing explanation.** smallFriendFiles and qa-pilot
   are inspectable work. Translate their relevance into user problems,
   constraints and delivered outcomes. They are not proof of time saved at a
   Spanish client's business. Add an honestly labelled automation demo if no
   approved client case exists.
7. **Optional machine-readable description lags.** llms.txt lists English
   destinations only and still mentions homepage FAQ content. It can be
   aligned with public ES pages and WhatsApp later. It is not a Google
   indexing or ranking requirement. [Google guidance][google-ai]
8. **Minor HTML consistency items.** Raw ES HTML starts with `lang="en"`;
   the locale code changes it using an inline script and client effect.
   Prefer correct server HTML when practical, primarily for language
   consistency/accessibility; do not present this as evidence Google cannot
   understand Spanish. Some ES package BreadcrumbList home items use the EN
   root. Neither issue explains the current visibility on its own.

GSC exclusion totals: 16 noindex, 3 not found, 1 redirect, 3 discovered/not
indexed, 2 crawled/not indexed. The latter two examples are Gridfin terms and
legacy `/blog/agents-md-primer`. Do not attempt to index every excluded URL.
The noindex/404 subgroups were not expanded in this audit. Historical 404
impressions can persist in a date range after a URL has been removed.

## Research method and competitor evidence

Qualitative search research on 12 Nov: Spanish website/freelance/autonomo
offers, website prices, automation implementation and costs, form/CRM and
quote follow-up workflows, MVP/app budgets, Valencia variants, and English
web design for businesses in Spain. Reviewed provider-owned pages directly.
This is a query/intent and offer study, not a logged-out Google Spain top-10
ranking census. No Keyword Planner/Ahrefs/Semrush volumes, CPC or numeric
keyword-difficulty data were obtained. The old RU Wordstat volumes are not
reused. Priorities below are hypotheses based on buying intent, evidence fit,
existing assets, and publishing effort, not measured monthly demand.

| Provider-owned evidence      | Observed pattern                                                              | Implication for Ludvik4                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [WebAutonomos][webautonomos] | Explicit autonomo audience, scope, contact options and ownership              | Show the business situation and deliverables, not just a service label                         |
| [software96][software96]     | Public website, application and MVP price/scope tiers                         | Preserve approved packages; explain scope boundaries and ongoing costs                         |
| [AJR][ajr]                   | Existing tools, process diagnosis, handover and geography                     | Explain how a real workflow is assessed and kept usable                                        |
| [MENOS][menos]               | One concrete problem: enquiries and quote follow-up; checks and exceptions    | Start with one demonstrable process instead of a generic AI benefits article                   |
| [Codanter][codanter]         | App cost explained through roles, business rules, integrations and acceptance | Add a worked scope example and comparison checklist                                            |
| [Appyweb][appyweb]           | Budget-planning tool alongside application-development services               | Buyer tools can bridge research to enquiry; a calculator is optional, not a first dependency   |
| [Bright Analytic][bright]    | English-speaking small businesses in Spain, bilingual scope and ownership     | A distinct secondary EN/Spain track is credible; do not duplicate every ES article immediately |
| [Eraldia][eraldia]           | Separates automation implementation and optional ongoing support              | Explain Ludvik4's actual project/tool/support costs rather than claiming a market average      |

These pages demonstrate visible competitors and query intent, not a reliable
Spanish market-average price. Do not lower prices based on the cheapest
snippet or copy competitors' ROI claims. Current Ludvik4 starting prices are
landing EUR 200, website EUR 500, automation EUR 500, web app from EUR 1,500
before VAT, with scope and third-party costs as stated on production pages.
Recheck the time-limited Plus offers after 31 December before reusing prices.

## Raw topical inventory

| Entity                | Buyer attributes / questions                | Query family                                                          | Evidence basis                                                        |
| --------------------- | ------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Business website      | audience, pages, contact, ownership, launch | diseno web para autonomos; pagina web para pequena empresa            | WebAutonomos, current packages                                        |
| Landing page          | one offer, campaign, conversion action      | diseno landing page; landing page o web corporativa                   | Current landing offer, sampled Spanish results                        |
| Website budget        | included work, revisions, running costs     | precio pagina web; presupuesto web que incluye                        | software96, WebAutonomos                                              |
| Website brief         | content, audience, decisions                | briefing pagina web; que preparar para hacer una web                  | Existing Ludvik4 worksheet, Spanish briefing results                  |
| Business automation   | stable process, trigger, data, exceptions   | automatizacion de procesos para pymes; automatizar tareas empresa     | AJR, MENOS                                                            |
| Automation economics  | hours, failure costs, software fees         | cuanto cuesta automatizar un proceso; que proceso automatizar primero | Eraldia, existing scorecard                                           |
| Enquiry routing       | assignment, deduplication, failure recovery | conectar formulario con CRM; automatizar seguimiento de presupuestos  | MENOS, existing service examples                                      |
| Web application       | roles, records, operations, integrations    | desarrollo aplicaciones web a medida; aplicacion web para empresa     | Codanter, software96                                                  |
| First product release | user journey, acceptance, excluded features | desarrollo MVP; como definir un MVP                                   | Existing journey worksheet, software96                                |
| Internal tool         | spreadsheets, permissions, history          | de Excel a aplicacion web; herramienta interna a medida               | Current offer; exploratory hypothesis requiring case/owner validation |
| Local provider        | actual base, delivery region, communication | diseno web Valencia; automatizacion procesos Valencia                 | Valencia provider results, About                                      |
| EN Spain buyer        | language, bilingual site, remote delivery   | web design for small businesses in Spain                              | Bright Analytic; secondary track                                      |

Actual publication copy must use natural Spanish, including accents. Query
variants in the inventory are clusters, not separate pages to generate.

## Processed commercial map and page boundaries

| Existing URL                       | Role / target intent                                                              | Recommended content change                                                                      | Supporting guides                              |
| ---------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `/es`                              | Source hub: what Ludvik4 builds and whom it serves in Spain                       | State small-business audience and actual location; route clearly to the three priority services | Guide hub and selected work                    |
| `/es/services/website-packages`    | Main website buying page: design for small businesses/autonomos, scope and prices | Title/H1 combining service + audience; example scopes, ownership, running costs, relevant work  | G1, G2                                         |
| `/es/services/landing-pages`       | Main one-off landing buying page                                                  | Differentiate one-off campaign/offer scope from multi-page business websites                    | G2                                             |
| `/es/services/automation-packages` | Main automation buying page for pymes                                             | One worked process, how inputs/approvals/errors operate, fees and handover                      | G3, G4, G5                                     |
| `/es/services/web-apps`            | Main custom web application buying page                                           | Explain internal tools/client portals/first releases through bounded examples                   | G6, G7, G8                                     |
| `/es/services/websites`            | Supporting delivery/scoping page                                                  | Link visibly to website packages and Spanish brief; avoid a second copy of the same sales page  | G1                                             |
| `/es/services/workflow-automation` | Supporting process/control page                                                   | Link to automation packages and Spanish scorecard                                               | G3, G4                                         |
| `/es/services/mvp-development`     | Supporting first-release/scoping page                                             | Link to web-app packages and journey guide                                                      | G6                                             |
| `/es/work/*`, `/es/about`          | Proof/source nodes                                                                | Business explanation, real screenshots, explicit author's responsibility                        | Link back to the service actually demonstrated |
| `/es/guides` (new)                 | Buyer-decision hub                                                                | Three sections: websites, automation, web apps; no empty categories                             | G1–G8                                          |

Example headline direction: website packages, `Diseño de páginas web para
autónomos y pequeños negocios en España`; automation packages,
`Automatización de procesos para pymes`; web apps,
`Desarrollo de aplicaciones web a medida para tu negocio`.
These are copy directions, not final reviewed Spanish. Preserve current URLs.
There is no demonstrated need for a domain change or Spanish slug migration.

Commercial pages own broad service/price intents. Guides own decisions,
preparation and worked examples. Do not publish a second generic `precio de
una pagina web` article that repeats the package page. Distinguish landing
and multi-page scope. Distinguish web applications from native mobile apps;
native iOS/Android development is outside the stated default offer.

Start with nationwide relevance and a truthful Valencia source description.
Consider a single useful Valencia page only after enquiries or query data
demonstrate a distinct local need and enough original local evidence. Avoid
templated city pages. A Google Business Profile is appropriate only if the
business qualifies through real in-person customer contact; an online-only
studio is not eligible. [Google eligibility guidance][gbp]

## First eight guide briefs

All proposed URLs below are new; none is represented as already live. The
phase plan sets the publication order: G1/G3, then G2/G4, then G5/G6 and G7/G8. Localise
existing decision tools for Spanish buyers rather than translating the technical
blog wholesale. Four briefs adapt existing assets; four are new worked guides.

| ID / order | Working Spanish title / proposed URL                                                                                  | Query and decision                                                     | Required original value                                                                                                                            | Primary commercial link                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| G1         | Qué preparar antes de encargar una página web: briefing y plantilla — `/es/guides/briefing-pagina-web`                | `briefing pagina web`, preparing to request a quote                    | Adapt `/guides/website-project-brief`; filled example for a small service business; printable worksheet                                            | `/es/services/website-packages`                                             |
| G2         | Landing page o web corporativa: qué necesita tu negocio — `/es/guides/landing-page-o-web-corporativa`                 | `landing page o pagina web`, choosing the right scope                  | Decision table for one offer/multiple services, two actual deliverable outlines, when each is insufficient                                         | `/es/services/website-packages`; contextual alternative to landing packages |
| G3         | Qué proceso automatizar primero: plantilla para decidir si compensa — `/es/guides/que-proceso-automatizar-primero`    | `que proceso automatizar primero`, readiness and value                 | Adapt automation scorecard; one filled process; separate readiness, value and failure risk; make calculation assumptions visible                   | `/es/services/automation-packages`                                          |
| G4         | Cómo conectar formulario, correo y CRM sin perder solicitudes — `/es/guides/formulario-correo-crm`                    | `conectar formulario con CRM`, enquiry routing                         | Demonstrable flow; double submission, missing field, service outage and recovery; screenshots/diagram; label demo as demo                          | `/es/services/automation-packages`                                          |
| G5         | Cuánto cuesta automatizar un proceso: proyecto, herramientas y mantenimiento — `/es/guides/coste-automatizar-proceso` | `cuanto cuesta automatizar un proceso`, comparing implementation costs | One worked Ludvik4 scope, recurring cost categories, excluded work, editable payback worksheet with clearly hypothetical inputs                    | `/es/services/automation-packages`                                          |
| G6         | Cómo definir un MVP alrededor de un recorrido de usuario — `/es/guides/definir-mvp`                                   | `como definir un MVP`, first-release boundary                          | Adapt journey guide; one end-to-end path with acceptance criteria and explicit deferred features                                                   | `/es/services/web-apps`                                                     |
| G7         | De Excel a una aplicación web: cuándo compensa dar el paso — `/es/guides/de-excel-a-aplicacion-web`                   | `Excel o aplicacion a medida`, internal-tool choice                    | Compare spreadsheet improvements, existing software and custom app; sample roles/history/exception requirements; original example needed           | `/es/services/web-apps`                                                     |
| G8         | Qué incluye un presupuesto de desarrollo y cómo comparar propuestas — `/es/guides/comparar-presupuestos-desarrollo`   | `que incluye presupuesto desarrollo web`, quote evaluation             | Adapt `/blog/what-development-quote-pays-for`; compare the same bounded app scope across itemised proposals; ownership, tests, deployment, support | `/es/services/web-apps`                                                     |

G5 explains the economics of one process, whereas G3 chooses the process;
merge them if the drafts cannot deliver distinct decisions. G8 compares
proposals, whereas the package page publishes Ludvik4's offer. G7 is a
lower-confidence query hypothesis; replace it with an actual enquiry question
if better evidence arrives. Do not manufacture industry-specific cases.

Each brief needs: direct useful opening; who it is for; one realistic worked
example; limits and alternatives; original worksheet/diagram/screens; relevant
verified primary sources; author and meaningful update date; one main service
CTA in Spanish. Prices must be sourced from the current pricing data, not
copied into a separate stale price list. There is no SEO word-count target.

Lower-priority backlog: AI website builder versus custom delivery (the EN
article already exists), human approval in automation, no-code versus custom
software, and web app versus native app. Promote a topic when questions,
queries or cases support it. Postpone generic Claude/Cursor tutorials,
best-agency lists, unrelated AI news and mass industry/location variants.

## Internal-link network and publication machinery

Use `/es` -> priority commercial pages -> relevant guide -> main service +
one adjacent decision. Add `/es/guides` to Spanish navigation once it exists.
Guide hub links to every published guide; service pages link to their decision
tools; genuine case pages link to the demonstrated service and relevant guide.
Use descriptive anchors such as `plantilla para preparar tu web` and
`automatizacion de solicitudes`, in idiomatic Spanish with accents.

Implementation touch points:

- `src/features/site/international-content.ts`: reuse the existing worksheet
  model without forcing ES text into the EN dataset.
- `src/features/site/locale-content.tsx`, `locale-pages.tsx`,
  `src/app/[locale]/guides/`: add Spanish guide content and routes; keep RU
  guide paths disabled unless separately requested.
- `src/lib/i18n.ts`, `locale-seo.ts`, `seo.ts`, `src/app/sitemap.ts`: translated
  path matching, self-canonicals, sitemap inclusion and reciprocal alternates
  for genuine EN/ES counterparts only. New ES-only guides need no invented EN
  alternate. The G8 adaptation is not automatically an equivalent translation
  of the English blog page.
- `src/app/llms.txt/route.ts`: optional public inventory alignment.
- Relevant route, metadata and link tests: prove ES discovery and absence of
  accidental RU or wrong-market entries. Follow the repo's red-before-green
  requirement for shipped behaviour. Draft/review support must precede publishing.

Release sequence per approved guide: draft -> Spanish editorial review ->
build/test -> production 200/canonical/noindex check -> hub and commercial
links -> sitemap inspection -> URL Inspection and indexing request if needed
-> day 7/day 14/day 28 observation. A sitemap or indexing request helps
discovery but does not guarantee inclusion. [Google sitemap guidance][sitemaps]
Do not use Google's restricted Indexing API for ordinary service articles.

## AI-search and recommendation track

Discovery already has positive evidence: indexed Spanish pages and 13 recent
Google generative-AI impressions. Most visible AI-report pages are English;
the one ES storefront page shown is web animation. An impression is not proof
that an answer recommends Ludvik4 for website/automation/app development.

| Stage         | Present evidence                                                 | Next action / measurement                                                                                 |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Discovery     | Google index, AI report; optional llms inventory                 | Maintain discoverable ES commercial pages and guides; verify Bing property/index status when accessible   |
| Understanding | Service descriptions and Organization/Service schema are present | Align source/category/Spain/ownership/offer definitions across public pages and genuine profiles          |
| Selection     | No captured assistant vendor-shortlist answer                    | Monthly fixed Spanish and English problem/service prompts; record included vendors and reasons            |
| Citation      | GSC AI exposure, no captured answer citations                    | Capture exact answer URLs/screenshots and the cited page; distinguish a name mention from a site citation |

Fixed prompt sample for later tests, with each language/surface logged
separately:

1. `Quien puede crear una web para un pequeno negocio en Espana con presupuesto cerrado?`
2. `Recomienda un profesional en Espana para automatizar solicitudes entre formulario, correo y CRM.`
3. `Quien desarrolla una aplicacion web a medida para una pequena empresa en Espana?`
4. `Que debo preparar antes de pedir presupuesto para una pagina web?`
5. `Como decidir que proceso de mi empresa automatizar primero?`
6. `What does Ludvik4 build, and where is it based?`

Do not call this assistant's own answer an independent ChatGPT test. Preserve
date, model/surface, language, search enabled state, exact prompt, full answer,
source URLs, accurate/inaccurate category, and shortlist inclusion. Do not
convert a missing result into an assumed zero score without a captured answer.

Support selection with actual evidence: improve the two current case pages,
publish one honest business-automation demo, align the real founder/GitHub/
professional profiles, and seek genuine feedback from completed engagements.
External distribution should be specific: one LinkedIn case walkthrough,
relevant Spanish business/founder discussions, or local professional partners
who actually know the work. No outreach or publication occurs in this task.

Google recommends original, useful material and rejects special AI-ranking
shortcuts: llms.txt and special AI schema are not required. [Current Google
AI optimisation guide][google-ai] Google Discover is a separate interest-led
feed, with less predictable traffic; use original stories, appropriate images
and good page experience, but keep qualified search enquiries as the primary
goal. [Discover guidance][discover]

## Execution plan and acceptance criteria

Weeks are relative to starting implementation, not ranking deadlines.

| Phase                                       | Work                                                                                                                                                       | Done when                                                                                                                             | Expected effort                                    |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Week 1: baseline and commercial direction   | Reconcile strategy docs; confirm audience; capture P1 baseline; improve three main ES service pages and landing scope; investigate EN automation exclusion | Reviewed copy, one commercial owner per intent, intact canonicals/hreflang, relevant work and Spanish CTA, conversion events verified | 2–3 focused work sessions                          |
| Week 2: ES guide foundation                 | Build ES guide hub/routes/draft workflow; adapt G1 and G3; strengthen existing case explanations                                                           | Reviewed ES guides link both ways with services, correct sitemap/metadata, no accidental RU exposure, release checks pass             | 2–3 sessions plus editorial review                 |
| Week 3: website decision + automation proof | G2 and G4; publish an approved demo/diagram and distribute a short case adaptation                                                                         | Each adds original decision evidence and routes to a service; UTM/referral tracking defined                                           | 2–3 sessions; demo may need its own implementation |
| Week 4: cost and first-release decisions    | G5 and G6                                                                                                                                                  | Costs tied to actual scope, original worksheets, no unsupported ROI claims                                                            | 2 sessions plus review                             |
| Weeks 5–6: enquiries shape the next wave    | G7 and G8 if still justified; selected profile/case improvements; first matched-window review                                                              | New priority informed by Spain queries/enquiries; weaker topics merged or deferred                                                    | 2–3 sessions                                       |
| Day 60–90 review                            | Evaluate queries, index state, buyer engagement and enquiries                                                                                              | Decide which cluster merits expansion; do not continue all topics mechanically                                                        | One evidence-led review                            |

These are planning estimates, not promised delivery dates or traffic growth.
Avoid building eight articles before validating the first two. Start with the
website and automation clusters; maintain the web-app buying page, then expand
its guides in the later wave. Animation remains available but is not the main
acquisition investment for this request.

Measurement uses Spain country filters and ES page filters as separate views,
then their intersection. Keep English/editorial/product traffic separate from
Spanish commercial traffic. Track rolling completed 28-day periods and a weekly
operational snapshot; show reporting lag. Do not use overall impressions or
average position as the sole success metric.

| Metric                                     | Current baseline                                 | Review rule                                                                                                                                |
| ------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Spanish current URLs indexed               | 19/19 in GSC examples                            | Maintain the set; record individual new-guide states rather than treating total indexed count as success                                   |
| Spain Google Web impressions/clicks        | 5 / 0, 14 Oct–10 Nov                             | Compare same-length windows, distinguish non-brand service intent                                                                          |
| Priority ES commercial page query coverage | No sustained target-query footprint demonstrated | Look for relevant buyer-query families, not just branded/product impressions                                                               |
| Google generative-AI impressions           | 13 worldwide in same 28 days                     | Track ES service/guide rows and country separately; do not equate all exposure with recommendations                                        |
| Enquiry funnel                             | Not checked in analytics                         | Verify `lead.form_started`, `lead.form_submitted`, `contact.whatsapp_clicked`, `contact.telegram_clicked`; a click is not a qualified lead |
| Business outcome                           | No verified baseline                             | Record qualified enquiry, requested service, language, landing source, proposal and outcome                                                |

Day 14 after each guide: if no discovery, verify sitemap and incoming links.
If discovered/not indexed, inspect technical status and unique value before
writing more. Day 28–56: impressions without engagement lead to snippet/intent
review; engagement without enquiries leads to offer/proof/contact review.
With very small samples, collect evidence before attributing causality.
Rankings, indexing dates and assistant recommendations are not guaranteed.

## First actionable slice

Start with **Spain commercial copy + ES guide foundation**: reconcile the stale
marketing rules; improve the website/automation/web-app commercial pages; add
`/es/guides` and reviewed Spanish versions of the website brief and automation
scorecard. This creates useful destination pages before the article expansion.
No new broad keyword list or further full audit is required to begin that slice.

[google-ai]: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
[sitemaps]: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
[discover]: https://developers.google.com/search/docs/appearance/google-discover
[gbp]: https://support.google.com/business/answer/14271705?hl=en
[webautonomos]: https://webautonomos.es/servicios
[software96]: https://software96.com/precios
[ajr]: https://iajr.es/servicios/automatizacion-procesos/
[menos]: https://menos.ricardohuertas.es/automatizar-seguimiento-comercial
[codanter]: https://www.codanter.com/blog/cuanto-cuesta-aplicacion-web-medida
[appyweb]: https://www.appyweb.es/desarrollo-aplicaciones-web/presupuesto/
[bright]: https://bright-analytic.com/en/web-design
[eraldia]: https://eraldia.com/blog/cuanto-cuesta-automatizacion-ia-pyme/
