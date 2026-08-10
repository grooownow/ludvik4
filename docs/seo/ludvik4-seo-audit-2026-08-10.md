# Ludvik4 SEO/SRO Audit - 2026-08-10

## Verdict

Technical SEO is healthy. `https://ludvik4.ru/` is crawlable, indexable, self-canonical, present in the root sitemap, and supported by clean service files. The site is already discoverable in public search for branded and several content queries.

The main growth opportunity is not technical indexing. It is semantic consolidation: make Ludvik4 easier to understand as one source with three commercial offers, two expertise clusters, and a clear founder-led delivery model.

## Inventory

Sitemap contains 25 canonical URLs:

- Home: `/`
- Services: `/uslugi/razrabotka-lendinga/`, `/uslugi/avtomatizatsiya-biznes-processov/`, `/uslugi/razrabotka-mvp/`
- Cases: `/cases/`, `/cases/fortnoise/`, `/cases/gridfin/`, `/cases/qa-pilot/`
- Gridfin: `/gridfin/`, `/gridfin/docs/application-skeleton/`, `/gridfin/guides/why-ai-needs-engineering-rules/`
- Blog hub: `/blog/`
- Blog articles: 13 published URLs

All sampled pages return `200`, have self-canonical URLs, and are not blocked by robots or `noindex`.

## Technical Indexing

| Area          | Status | Evidence                                                                                            |
| ------------- | ------ | --------------------------------------------------------------------------------------------------- |
| `robots.txt`  | Pass   | `200`, allows public pages, declares root sitemap                                                   |
| `sitemap.xml` | Pass   | `200`, parseable, 25 URLs                                                                           |
| service files | Pass   | `llms.txt`, `humans.txt`, `security.txt`, `ads.txt`, `app-ads.txt` are plain text, no HTML fallback |
| home page     | Pass   | `200`, canonical `https://ludvik4.ru/`, robots `index, follow`                                      |
| blog hub      | Pass   | `200`, canonical `/blog/`, in sitemap                                                               |
| Gridfin pages | Pass   | all priority URLs return `200`, self-canonical, in sitemap                                          |

## Source Context

Source: Ludvik4, a founder-led product studio for small businesses and founders.

Current source context is coherent:

- websites and landing pages;
- business process automation;
- MVP web applications and compact SaaS;
- AI-assisted development as an execution method;
- public case evidence through FortNoise, Gridfin, and qa-pilot.

The best current source signal is `llms.txt`: it states the entity, services, cases, articles, and contact path clearly.

## Central Entity

Central entity: `Ludvik4`.

Current definition: independent project/studio for websites, automations, and MVP web applications, with one point of accountability from task framing to launch.

Core attributes already present:

- service categories;
- price ranges;
- delivery process;
- case studies;
- AI/spec-driven development expertise;
- Telegram contact.

Entity gaps:

- no standalone About/identity page with stable facts about Ludvik4;
- limited author/source signals on articles;
- service pages do not expose `Service`/`Offer` schema individually;
- cases are useful but compact: they need more measurable outcomes where available.

## Central Search Intent

Primary commercial intent:

- "разработка лендинга под ключ";
- "автоматизация бизнес-процессов";
- "разработка MVP веб-приложения";
- "сайт/автоматизация/MVP для малого бизнеса".

Primary informational intent:

- AI automation for small business;
- how to prepare for landing-page work;
- MVP scope, budget, and stages;
- spec-driven development and AI-agent-ready projects.

Fit: strong. The site answers both commercial and educational intents, and informational pages generally link back to relevant services.

Risk: the home page intentionally covers three offers at once. That is good for source context, but category rankings will depend more on the three `/uslugi/*` pages and supporting articles than on `/`.

## Semantic Content Network

Current SCN:

- `/` links to the three service pages, cases, and blog.
- Service pages receive relevant links from supporting articles.
- Blog hub links to all articles.
- Gridfin landing has its own mini-cluster with two supporting pages.

Gaps:

- several blog articles receive only one internal link, from `/blog/`;
- AI-agent cluster and commercial cluster are adjacent but not strongly connected;
- cases link out to product/project pages, but commercial pages do not consistently link back to the most relevant cases;
- service pages have similar structure, but not enough lateral links between related offers.

Priority internal-link fixes:

- From `/uslugi/razrabotka-lendinga/` link to `stoimost-lendinga-2026`, `chto-podgotovit-pered-zakazom-lendinga`, and `lending-ili-mnogostranichnyy-sayt`.
- From `/uslugi/avtomatizatsiya-biznes-processov/` link to `ai-avtomatizatsiya-malogo-biznesa`, `avtomatizatsiya-obrabotki-zayavok`, and `vnutrennee-veb-prilozhenie-dlya-biznesa`.
- From `/uslugi/razrabotka-mvp/` link to `mvp-etapy-sroki-pervyy-reliz`, `stoimost-razrabotki-mvp`, and `vnutrennee-veb-prilozhenie-dlya-biznesa`.
- From AI-agent articles link to Gridfin and qa-pilot when the context is about rules, tests, specs, and agent workflow.

## Topical Map

| Hub                                         | Role            | Central Entity                  | Supporting Pages                                                |
| ------------------------------------------- | --------------- | ------------------------------- | --------------------------------------------------------------- |
| `/`                                         | Source hub      | Ludvik4                         | services, cases, blog                                           |
| `/uslugi/razrabotka-lendinga/`              | Commercial page | landing page development        | landing prep, landing vs website, landing price                 |
| `/uslugi/avtomatizatsiya-biznes-processov/` | Commercial page | business process automation     | AI automation, lead processing, internal web app                |
| `/uslugi/razrabotka-mvp/`                   | Commercial page | MVP web app development         | MVP stages, MVP price, internal web app                         |
| `/gridfin/`                                 | Product landing | Gridfin Application Skeleton    | Application Skeleton doc, engineering rules guide, Gridfin case |
| `/blog/`                                    | Knowledge hub   | AI-assisted product development | 13 articles                                                     |

## LLM Visibility

Discovery and understanding are supported by:

- clean `llms.txt`;
- Organization/WebSite/ProfessionalService schema on home;
- descriptive titles and headings;
- public search discovery for home, service, blog, and article URLs.

Selection/citation is weaker for non-branded prompts because off-site consensus is likely thin. The site needs more external corroboration if the goal is to be cited for broad queries like "best developer for small business automation" or "Tilda alternative for custom MVP".

Recommended baseline query groups:

- Brand: "What is Ludvik4?", "Ludvik4 pricing", "Ludvik4 review".
- Category: "разработка лендинга под ключ для малого бизнеса", "автоматизация заявок для малого бизнеса", "разработка MVP веб-приложения".
- Problem: "как автоматизировать обработку заявок", "как подготовить проект к AI-агентам".
- Comparison: "Tilda или кастомный лендинг", "Tilda alternatives for small business".
- Definition: "что такое spec-driven development", "что такое Application Skeleton".

## Scored Audit

| Block                      | Score |
| -------------------------- | ----: |
| Central Search Intent      |  8/10 |
| Source Context             |  8/10 |
| Central Entity             |  7/10 |
| Topical Coverage           |  7/10 |
| Information Responsiveness |  8/10 |
| Macro Semantics            |  8/10 |
| Micro Semantics            |  8/10 |
| Contextual Flow            |  8/10 |
| SCN                        |  6/10 |
| Internal Linking           |  6/10 |
| Content Configuration      |  7/10 |
| Technical SEO              |  9/10 |

Total: 90/120.

## Fix Plan

### Critical

None.

### Implemented Locally

1. Added richer per-service `Service`/`Offer` JSON-LD to each `/uslugi/*` page.
2. Added `Blog`/`ItemList`/`BreadcrumbList` JSON-LD to `/blog/`.
3. Added `CollectionPage`/`ItemList`/`BreadcrumbList` JSON-LD to `/cases/`.
4. Added service-page related links to supporting article clusters.
5. Added service-page "Как фиксируется результат" blocks with input, acceptance, and handoff context.
6. Added visible source-authority blocks to article pages.
7. Added contextual article links, including AI-agent articles linking to Gridfin and qa-pilot.

### Important Remaining

1. Commit, push, deploy, and rerun live post-deploy checks after explicit approval.
2. Add a standalone About/source-authority page if the site should have a durable entity URL beyond the home section.
3. Expand case studies with measurable outcomes where available.

### Desirable

1. Add `FAQPage` schema where FAQ content is page-specific and visible.
2. Add comparison/decision content: custom landing vs Tilda, no-code automation vs custom workflow, MVP vs internal tool.
3. Add stronger lateral links inside the AI-agent content cluster as new articles appear.

### Final Polish

1. Review article descriptions that are close to truncation in snippets.
2. Add more descriptive anchors instead of generic "Есть похожая задача?" where possible.
3. Keep `lastmod` trustworthy; update only when content materially changes.
