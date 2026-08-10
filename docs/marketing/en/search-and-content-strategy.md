---
title: Ludvik4 International Search, Topical Map, and SCN Strategy
status: v1 — 2026-08-10
---

# Search, Topical Map, and Semantic Content Network

## Source context

- Site: Ludvik4 international storefront.
- Central entity: a Europe-based, founder-led web product studio.
- Audience: startup founders, small-business owners, and small operations teams.
- Business model: scoped custom development engagements.
- Source advantage: direct delivery experience plus inspectable open-source
  engineering artefacts.

## Central search intent

Home intent: evaluate a small founder-led studio that can design and build a
website, workflow automation, MVP, or custom web application.

The home page must not try to rank as the final answer for all three services.
It defines the source and routes the user to a page whose entity, scope,
examples, and objections match one commercial intent.

| Page | Primary intent family | Decision stage |
| --- | --- | --- |
| `/` | founder-led web product studio / custom web development studio | category evaluation |
| `/services/websites` | website design and development for startups/small business | vendor evaluation |
| `/services/workflow-automation` | business workflow automation / custom process automation | problem and vendor evaluation |
| `/services/mvp-development` | MVP development / custom web app development for founders | vendor evaluation |
| `/work` | product studio portfolio / proof | trust evaluation |
| `/work/qa-pilot` | qa-pilot / AI-assisted testing product case | evidence and branded discovery |
| `/about` | Ludvik4 / founder-led delivery model | source verification |

## Raw topical inventory

| Entity / topic | Type | Attributes and questions | Query family |
| --- | --- | --- | --- |
| Website development | core service | scope, copy, responsive design, SEO, analytics, launch, ownership | website design and development service |
| Landing page | supporting | campaign vs company site, conversion path, content requirements | landing page development |
| Workflow automation | core service | process map, integrations, validation, logs, approvals, maintenance | business workflow automation |
| AI automation | supporting | appropriate use, data, error cost, human-in-the-loop | AI automation for small business |
| MVP development | core service | first-release scope, journey, acceptance criteria, launch, iteration | MVP development for startups |
| Custom web app | core/adjacent | portal, internal tool, niche SaaS, ownership | custom web application development |
| Founder-led studio | source entity | accountability, communication, specialist network | founder-led product studio |
| Delivery evidence | quality node | code, tests, releases, documentation, outcomes | product development case study |

## Processed hub map

| Hub | Role | Central entity | Supporting pages | Links to |
| --- | --- | --- | --- | --- |
| Home | source/category hub | Ludvik4 studio | About, Work, three services | every P1 page |
| Websites | commercial hub | production-ready business website | website brief, landing vs multi-page | Work, About, contact |
| Workflow automation | commercial hub | controlled business workflow | automation opportunity map, human approval | Work, About, contact |
| MVP development | commercial hub | focused first release | MVP scope guide, MVP vs prototype | Work, About, contact |
| Work | evidence hub | inspectable delivered/public products | qa-pilot and later approved cases | relevant service, About |
| About | source-quality node | founder-led delivery model | future engineering principles page only if needed | services, Work, contact |

## First content wave

The first wave stays deliberately small. Google explicitly recommends unique,
non-commodity, first-hand content for generative AI search features and warns
against creating a separate page for every fan-out query variation. Source:
https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

| Priority | Page / working H1 | Micro-context | Commercial bridge | Required original value |
| --- | --- | --- | --- | --- |
| P1 | What to prepare before hiring a website developer | inputs and decision readiness | Websites | downloadable brief/checklist derived from the delivery process |
| P1 | Landing page or multi-page website: how to choose | information architecture decision | Websites | decision table and two real scope patterns |
| P1 | What business process should you automate first? | automation opportunity selection | Workflow automation | process scoring worksheet: frequency, error cost, stability, data access |
| P1 | Human-in-the-loop automation: where approval belongs | automation control design | Workflow automation | workflow diagram and failure-mode examples |
| P1 | How to scope an MVP around one complete user journey | first-release boundary | MVP development | worked scope example with acceptance criteria |
| P1 | MVP, prototype, or internal tool: what should you build? | solution-type choice | MVP development | comparison table tied to evidence needed after launch |
| P2 | AI-assisted development without unverified code | delivery method | About + MVP | qa-pilot artefacts and a test-that-can-fail example |
| P2 | Custom software or no-code automation? | build/buy boundary | Automation + MVP | maintenance, ownership, risk, and data criteria |

## Cannibalisation boundaries

| Boundary | Separate pages? | Rule |
| --- | --- | --- |
| landing page vs company website | no commercial split yet | one Websites service; separate informational comparison only |
| MVP vs custom web app | no | one service until evidence shows distinct buyer journeys |
| workflow automation vs AI automation | no | AI is an implementation option, not a standalone offer |
| customer portal vs internal tool vs niche SaaS | no | examples within MVP; separate only after a case and repeated distinct demand |
| Europe/country/city variants | no | no thin location pages; geography is source context, not page multiplication |
| technologies | no | technologies support delivery; they are not service entities |

## Internal-link rules

- Every support page links to exactly one primary commercial hub in the first
  direct-answer section, plus one genuinely adjacent page where useful.
- Commercial pages link to Work and About for proof/source context, not to a
  generic blog archive.
- Case studies link back to the service demonstrated by the case once that
  relationship is truthful and specific.
- Anchors name the entity and decision (`workflow automation service`, `MVP
  scope`) rather than `learn more`.
- The home, header, footer, sitemap, and `llms.txt` expose every P1 commercial
  and quality node.

## LLM visibility

The baseline query set is stored in `llm-visibility-matrix.md`. Test discovery,
understanding, selection, and citation separately across available surfaces.
Current web-search checks on 2026-08-10 returned no reliable `ludvik4.dev`
result for brand or `site:` queries, so discovery is the first problem; category
selection cannot be meaningfully judged yet.

On-site sequence:

1. Make every P1 page crawlable, self-canonical, linked, and present in sitemap
   and `llms.txt`.
2. Keep one canonical brand/category definition across Home, About,
   Organization schema, humans.txt, and external profiles.
3. Publish direct, reusable answers and first-hand artefacts.
4. Build honest third-party consensus through GitHub and selected professional
   profiles.
5. Re-run the matrix monthly after indexing begins.
