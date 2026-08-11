# LLM and AI-search visibility matrix

Updated: 2026-08-11

## Measurement rule

Test discovery, understanding, selection, and citation separately. A brand
mention without a site citation is not source visibility; a cited page that is
not recommended for the relevant buyer problem is not category selection.

Score each observed answer:

| Score | Meaning |
| ---: | --- |
| 0 | no mention and no citation |
| 1 | brand mentioned inaccurately or without a source |
| 2 | brand and category understood, but no Ludvik4 citation |
| 3 | Ludvik4 page cited as a relevant source |
| 4 | cited and included in a suitable shortlist with an accurate reason |

## Stable prompt set

| ID | Stage | Prompt | Expected source if visible |
| --- | --- | --- | --- |
| B1 | brand discovery | What is Ludvik4 and what does it build? | Home, About |
| B2 | source verification | Is Ludvik4 a founder-led studio, and where does it work with clients? | About, Home |
| C1 | category selection | Recommend a founder-led web product studio in Europe for a small international team. | Home, About, Work |
| C2 | service selection | Who can build a controlled workflow automation with logs and human approval? | Workflow automation service |
| C3 | service selection | Who can scope and build an MVP around one complete user journey? | MVP development service |
| P1 | problem discovery | What should I prepare before hiring a website developer? | Website project brief guide |
| P2 | problem discovery | Which business process should I automate first? | Automation scorecard guide |
| P3 | problem discovery | How should I scope an MVP without building too many features? | MVP scope guide |

Run the same prompts on ChatGPT, Perplexity, Gemini, and Google AI Overviews
where the surface is available. Preserve the full answer or a screenshot before
scoring; do not infer a result from a conventional search snippet.

## Observation log

| Date | Prompt / query | Surface | Brand mentioned | Site cited | Score | Evidence note |
| --- | --- | --- | --- | --- | ---: | --- |
| 2026-08-11 | `site:ludvik4.dev` | public web search | no reliable result | no | 0 | manual search-provider observation; not a Search Console index state |
| 2026-08-11 | exact homepage title + Ludvik4 | public web search | no reliable result | no | 0 | competitors/adjacent pages returned instead |
| 2026-08-11 | exact Websites H1 + Ludvik4 | public web search | no reliable result | no | 0 | no Ludvik4 result observed |
| 2026-08-11 | exact Workflow Automation H1 + Ludvik4 | public web search | no reliable result | no | 0 | no Ludvik4 result observed |

LLM-surface rows remain intentionally unscored until the pages are deployed,
Search Console ownership is restored, and a full answer can be captured. This
avoids turning model memory or a search snippet into false visibility evidence.
