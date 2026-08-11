export type InternationalServicePage = {
  slug: "websites" | "workflow-automation" | "mvp-development";
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  outcome: string;
  fit: string[];
  deliverables: string[];
  examples: string[];
  process: string[];
  boundaries: string[];
};

export type InternationalWorkItem = {
  slug: "qa-pilot";
  title: string;
  kind: string;
  description: string;
  lead: string;
  problem: string;
  solution: string[];
  result: string;
  website: string;
  websiteLabel: string;
};

export type InternationalGuide = {
  slug:
    | "website-project-brief"
    | "automation-priority-scorecard"
    | "mvp-scope-one-user-journey";
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  summary: string;
  sections: Array<{
    title: string;
    body: string;
    items: Array<{ title: string; body: string }>;
  }>;
  worksheetTitle: string;
  worksheetIntro: string;
  worksheet: Array<{ label: string; prompt: string }>;
  decisionTitle: string;
  decisions: Array<{ signal: string; action: string }>;
  relatedService: { href: string; label: string };
};

export const internationalServicePages: InternationalServicePage[] = [
  {
    slug: "websites",
    title: "Website Design and Development",
    description:
      "Founder-led website design and development for startups and small businesses: strategy, copy structure, responsive development, SEO foundations, analytics, and launch.",
    eyebrow: "Websites",
    h1: "Website design and development for a clear offer",
    lead: "A focused website or landing page that explains what you do, gives visitors a clear next step, and is ready to publish on your domain.",
    outcome:
      "A responsive, production-ready website built around one audience, one offer, and one primary conversion path.",
    fit: [
      "You are launching a service, product, event, or small business",
      "Your current website looks dated or does not explain the offer clearly",
      "You need a focused page for a campaign, launch, or market test",
    ],
    deliverables: [
      "Discovery around the audience, offer, and primary action",
      "Page structure and collaborative copy development",
      "Visual direction and responsive interface design",
      "Development, technical SEO foundations, and analytics setup",
      "Cross-device testing, launch, handover, and warranty fixes",
    ],
    examples: [
      "A service-business website",
      "A product or campaign landing page",
      "A compact multi-page company website",
    ],
    process: [
      "Clarify the offer, audience, constraints, and success criteria",
      "Agree the information structure, copy, and visual direction",
      "Build and test the responsive website",
      "Publish it on your domain and hand over access and source files",
    ],
    boundaries: [
      "One language and one visual direction in the baseline scope",
      "A landing page or a focused site with a small set of page types",
      "Legal copy, paid assets, hosting, and complex integrations are quoted separately",
    ],
  },
  {
    slug: "workflow-automation",
    title: "Business Workflow Automation",
    description:
      "Custom workflow automation for small teams: integrations, document processing, reporting, bots, and AI with logs, checks, and human approval where it matters.",
    eyebrow: "Automation",
    h1: "Workflow automation for repetitive business processes",
    lead: "Turn a recurring manual process into a controlled workflow with clear inputs, visible outcomes, and human review where mistakes carry a real cost.",
    outcome:
      "A working automation with logs, validation, error handling, and an operating guide — not an unmonitored script.",
    fit: [
      "Your team copies the same information between tools",
      "Documents, enquiries, reports, or content follow a repeatable process",
      "An off-the-shelf integration handles the happy path but not your real rules",
    ],
    deliverables: [
      "A map of the current process, decisions, and failure points",
      "A proposed workflow and prototype using representative data",
      "Custom scripts, APIs, integrations, bots, or AI where appropriate",
      "Validation, logs, retries, and human approval for high-risk steps",
      "Testing, deployment, documentation, and warranty fixes",
    ],
    examples: [
      "Enquiry intake, routing, and follow-up preparation",
      "Structured data extraction from invoices, forms, or contracts",
      "Recurring reporting or content preparation for approval",
    ],
    process: [
      "Document the current process and define the intended outcome",
      "Check data quality, API access, integrations, and risk points",
      "Prototype the workflow with representative real-world cases",
      "Add controls, test edge cases, deploy, and hand over the process",
    ],
    boundaries: [
      "One process with a defined trigger and outcome",
      "API, AI-model, platform, and infrastructure fees are separate",
      "If the process is not yet understood, discovery is scoped first",
    ],
  },
  {
    slug: "mvp-development",
    title: "MVP and Custom Web App Development",
    description:
      "Founder-led MVP and custom web app development for startup founders and small teams: product scoping, UX/UI, frontend, backend, testing, and launch.",
    eyebrow: "Web applications",
    h1: "MVP development around one complete user journey",
    lead: "A production-ready first release that solves one important problem end to end — scoped tightly enough to launch, learn, and extend without speculative features.",
    outcome:
      "A working web product that real users can try, with source code, deployment, and a documented path for the next iteration.",
    fit: [
      "You have a product idea but need to define a credible first release",
      "Generic software does not fit one important operational workflow",
      "You need a customer portal, internal tool, niche SaaS, or AI-enabled feature",
    ],
    deliverables: [
      "First-release scope, user journey, and acceptance criteria",
      "Product, data, and interface design",
      "Frontend, backend, database, and required integrations",
      "Accounts, files, notifications, AI, or payments when the core journey needs them",
      "Automated tests, deployment, stabilisation, and technical handover",
    ],
    examples: [
      "A customer portal or internal operations tool",
      "A niche subscription product",
      "A focused AI-assisted application",
    ],
    process: [
      "Define the primary user, problem, and measurable success condition",
      "Prototype the journey and lock the first-release boundaries",
      "Build in short, reviewable increments with automated quality checks",
      "Test, launch, stabilise, and plan later releases from evidence",
    ],
    boundaries: [
      "One product problem and one primary end-to-end journey",
      "A web product, without native iOS or Android applications",
      "Ongoing support, later releases, infrastructure, and provider fees are separate",
    ],
  },
];

export const internationalWork: InternationalWorkItem[] = [
  {
    slug: "qa-pilot",
    title: "qa-pilot",
    kind: "Open-source product",
    description:
      "A Codex plugin that plans, writes, audits, and runs software tests with project-specific context and evidence-based quality checks.",
    lead: "qa-pilot turns testing from an afterthought into a repeatable workflow that an AI coding agent can follow and verify.",
    problem:
      "AI coding tools can generate tests quickly, but generated coverage is often shallow, over-mocked, or unable to prove that it protects real behaviour.",
    solution: [
      "A project onboarding flow that records the actual stack and test conventions",
      "Separate workflows for test planning, implementation, exploratory testing, and suite audits",
      "A mandatory proof that every new automated test can fail for the intended reason",
      "Persistent project context so quality decisions survive across sessions",
    ],
    result:
      "The plugin is publicly available through the Codex plugin ecosystem and is developed in the open on GitHub.",
    website: "https://github.com/grooownow/qa-pilot",
    websiteLabel: "View qa-pilot on GitHub",
  },
];

export const internationalGuides: InternationalGuide[] = [
  {
    slug: "website-project-brief",
    title: "Build a Website Project Brief",
    description:
      "A practical website project brief template for founders and small teams: define the offer, audience, conversion path, evidence, content, constraints, and launch decision before requesting estimates.",
    eyebrow: "Website planning guide",
    h1: "How to build a website project brief before hiring a developer",
    lead: "A useful brief does not prescribe a layout. It gives a developer enough product context to recommend the right page structure, expose missing inputs, and estimate a defined outcome.",
    summary:
      "Use this worksheet to turn an open-ended website request into a decision-ready brief without designing the solution in advance.",
    sections: [
      {
        title: "Start with the business decision",
        body: "The page exists to help a specific visitor make a specific next decision. Define that decision before listing sections, animations, or technical preferences.",
        items: [
          {
            title: "Name one audience",
            body: "Describe the buyer or user in operational terms: their situation, urgency, and what they already understand.",
          },
          {
            title: "Name one primary action",
            body: "Choose the action the site should make easier: enquire, book, apply, buy, join a waitlist, or understand a complex offer.",
          },
          {
            title: "Define the launch decision",
            body: "State what the first release needs to prove — for example, whether the offer is understood well enough to generate qualified enquiries.",
          },
        ],
      },
      {
        title: "Separate inputs from design decisions",
        body: "Supply the evidence and constraints that only you know. Leave information architecture, component choices, and responsive behaviour open for the delivery team to solve.",
        items: [
          {
            title: "Inputs you own",
            body: "Offer details, audience knowledge, proof, legal requirements, brand assets, access, deadlines, and the person who approves the work.",
          },
          {
            title: "Decisions to make together",
            body: "Page count, content order, interaction model, CMS needs, analytics events, technical stack, and the smallest credible launch scope.",
          },
          {
            title: "Unknowns to expose",
            body: "Mark assumptions explicitly. An unknown is safer in the brief than hidden inside an estimate as an untested expectation.",
          },
        ],
      },
    ],
    worksheetTitle: "Website brief worksheet",
    worksheetIntro:
      "Write one or two concrete sentences for each row. If a row is unknown, label it as an open question instead of filling it with a guess.",
    worksheet: [
      {
        label: "Offer",
        prompt:
          "What is being offered, to whom, and why would they choose it now?",
      },
      {
        label: "Primary visitor",
        prompt:
          "What situation brings this person to the site and what do they need to understand first?",
      },
      {
        label: "Primary action",
        prompt:
          "What single action should become easier after reading the page?",
      },
      {
        label: "Proof",
        prompt:
          "Which public examples, outcomes, credentials, process details, or product evidence can support the claims?",
      },
      {
        label: "Content inputs",
        prompt:
          "Which copy, images, brand assets, legal text, and product information already exist?",
      },
      {
        label: "Constraints",
        prompt:
          "Record the real deadline, languages, integrations, approval process, accessibility needs, and budget range.",
      },
      {
        label: "Launch test",
        prompt:
          "What observable result will tell you that the first version is useful enough to keep or extend?",
      },
    ],
    decisionTitle: "Choose the likely website shape",
    decisions: [
      {
        signal: "One audience, one offer, one primary action",
        action:
          "Start by testing whether a focused landing page can carry the decision.",
      },
      {
        signal: "Several distinct services or audience paths",
        action:
          "Plan a compact multi-page site with a clear page for each search and buying intent.",
      },
      {
        signal: "Content changes frequently across many entries",
        action:
          "Treat a CMS and content model as part of the scope, not as a late implementation detail.",
      },
    ],
    relatedService: {
      href: "/services/websites",
      label: "Explore website development",
    },
  },
  {
    slug: "automation-priority-scorecard",
    title: "Score an Automation Opportunity",
    description:
      "A practical workflow automation scorecard for choosing which repetitive business process to automate first, including readiness, risk, exceptions, data, and human approval.",
    eyebrow: "Automation decision guide",
    h1: "Which business process should you automate first?",
    lead: "The best first automation is usually not the task that feels most annoying. It is a repeatable process with a clear trigger, usable inputs, observable outcomes, and failure modes that can be controlled.",
    summary:
      "Score one real process before selecting tools. The worksheet makes value, readiness, and operational risk visible in the same decision.",
    sections: [
      {
        title: "How to use the scorecard",
        body: "Choose one process with a named start and finish. Score each dimension from 0 to 2 using representative cases, then review the pattern rather than treating the total as an automatic approval.",
        items: [
          {
            title: "0 — not ready",
            body: "The process is unclear, rare, highly variable, or depends on inputs that are not reliably available.",
          },
          {
            title: "1 — partly ready",
            body: "The recurring path is visible, but rules, access, sample data, or exception handling still need discovery.",
          },
          {
            title: "2 — strong candidate",
            body: "The trigger, inputs, rules, outcome, owner, and review points can be described and tested with real examples.",
          },
        ],
      },
      {
        title: "Value and safety must be assessed together",
        body: "High volume alone does not make a safe automation. A useful first release keeps risky decisions visible, logs what happened, and gives a person a clear way to review or recover failed cases.",
        items: [
          {
            title: "Automate movement before judgement",
            body: "Collection, validation, routing, drafting, and reporting are often easier to control than an irreversible decision.",
          },
          {
            title: "Design the exception path",
            body: "Define what happens when data is missing, an integration fails, confidence is low, or a case does not match the normal rules.",
          },
          {
            title: "Keep an accountable owner",
            body: "Name who reviews alerts, approves sensitive outcomes, and decides when a changed process requires the automation to be updated.",
          },
        ],
      },
    ],
    worksheetTitle: "Automation priority scorecard",
    worksheetIntro:
      "Score each dimension 0, 1, or 2. Add a note with the evidence behind the score; the note is more useful than the number when the workflow is scoped.",
    worksheet: [
      {
        label: "Frequency and volume",
        prompt:
          "How often does the same workflow run, and how much repeated handling does it create?",
      },
      {
        label: "Trigger and outcome",
        prompt:
          "Can you name the event that starts the process and the observable result that finishes it?",
      },
      {
        label: "Rule clarity",
        prompt:
          "Can the normal decisions be written as explicit rules rather than individual judgement?",
      },
      {
        label: "Input quality",
        prompt:
          "Are the required fields, documents, permissions, and representative examples consistently available?",
      },
      {
        label: "Exception rate",
        prompt:
          "How many cases leave the normal path, and can those cases be detected and routed to a person?",
      },
      {
        label: "Error reversibility",
        prompt:
          "Can a wrong output be stopped, reviewed, corrected, and replayed before it causes material harm?",
      },
      {
        label: "Ownership",
        prompt:
          "Is one person accountable for the process, its rules, alerts, and post-launch changes?",
      },
    ],
    decisionTitle: "Interpret the result",
    decisions: [
      {
        signal: "Mostly 2s, with reversible errors and a clear owner",
        action:
          "A prototype using representative cases is a sensible next step.",
      },
      {
        signal: "Strong value, but weak rules or poor sample data",
        action:
          "Scope discovery first: map the process and collect edge cases before choosing the implementation.",
      },
      {
        signal: "High error cost with no reliable approval or recovery point",
        action:
          "Do not automate the final decision yet; automate preparation and keep a human checkpoint.",
      },
      {
        signal: "Low frequency and many unique exceptions",
        action:
          "Improve the manual workflow or templates before funding custom automation.",
      },
    ],
    relatedService: {
      href: "/services/workflow-automation",
      label: "Explore workflow automation",
    },
  },
  {
    slug: "mvp-scope-one-user-journey",
    title: "Scope an MVP Around One Journey",
    description:
      "A practical MVP scoping worksheet for founders: define one primary user journey, acceptance criteria, boundaries, operational dependencies, and evidence for the next release.",
    eyebrow: "MVP scoping guide",
    h1: "How to scope an MVP around one complete user journey",
    lead: "A credible MVP is a complete path through one important problem, not a thin sample of every future feature. The user should be able to reach a meaningful outcome without the product pretending to be finished everywhere.",
    summary:
      "Use this worksheet to define the smallest production release that completes one valuable journey and produces evidence for the next product decision.",
    sections: [
      {
        title: "Write the journey before the feature list",
        body: "Describe the user, starting situation, action, and completed outcome in one sentence. Features enter the release only when the journey cannot work without them.",
        items: [
          {
            title: "Start condition",
            body: "State what is true when the user begins: their role, need, access, and the input they bring.",
          },
          {
            title: "Critical path",
            body: "List only the decisions and system responses required to move from that start to the intended result.",
          },
          {
            title: "Completed outcome",
            body: "Define what the user can now do, see, receive, or hand off that was not possible before the journey.",
          },
        ],
      },
      {
        title: "Protect the boundary of the first release",
        body: "Every requested capability should be classified as required for the journey, required for safe operation, or deferred. This keeps the release small without hiding operational work.",
        items: [
          {
            title: "Required for value",
            body: "The journey cannot produce its outcome without this capability.",
          },
          {
            title: "Required for operation",
            body: "The product needs it to be supportable or safe: access control, validation, logs, backups, moderation, or an admin path.",
          },
          {
            title: "Deferred by evidence",
            body: "The capability may matter later, but the first release can test the core assumption without it.",
          },
        ],
      },
    ],
    worksheetTitle: "One-journey MVP worksheet",
    worksheetIntro:
      "Complete the rows in order. If the success evidence cannot be named, return to the problem statement before estimating development.",
    worksheet: [
      {
        label: "Primary user",
        prompt:
          "Who experiences the problem and has permission to complete the journey?",
      },
      {
        label: "Problem moment",
        prompt:
          "What event or situation makes the user start this journey now?",
      },
      {
        label: "Journey statement",
        prompt:
          "As this user, I can move from the starting situation to a specific useful outcome in one coherent flow.",
      },
      {
        label: "Acceptance criteria",
        prompt:
          "Which observable behaviours prove that the normal path and its important failure states work?",
      },
      {
        label: "Operational path",
        prompt:
          "Who handles support, approvals, failed jobs, content, refunds, or data corrections behind the interface?",
      },
      {
        label: "Release boundary",
        prompt:
          "Which roles, platforms, integrations, and secondary journeys are explicitly outside the first release?",
      },
      {
        label: "Decision evidence",
        prompt:
          "What usage, completion, enquiry, retention, or operational evidence will decide the next iteration?",
      },
    ],
    decisionTitle: "Test the scope",
    decisions: [
      {
        signal: "The release contains several unrelated primary users",
        action:
          "Choose the user whose completed outcome tests the most important assumption first.",
      },
      {
        signal:
          "A feature does not change the primary journey or safe operation",
        action:
          "Move it to a later-release list with the evidence that would justify bringing it back.",
      },
      {
        signal: "The happy path works only through hidden manual intervention",
        action:
          "Document that operation explicitly and decide whether it is an acceptable first-release process.",
      },
      {
        signal: "Success is described only as shipping the product",
        action:
          "Define the user or business evidence the release is intended to produce.",
      },
    ],
    relatedService: {
      href: "/services/mvp-development",
      label: "Explore MVP development",
    },
  },
];

export const internationalFaq = [
  {
    question: "How does a project start?",
    answer:
      "Send a short description of the problem, current situation, and desired outcome. I will review it, identify the smallest sensible starting point, and suggest whether the work needs a short discovery or can move directly to a fixed scope and proposal.",
  },
  {
    question: "What does founder-led mean here?",
    answer:
      "You work directly with the person responsible for product decisions and delivery from discovery through launch. I remain the single point of accountability and bring in trusted specialists only when the agreed scope needs a specific discipline.",
  },
  {
    question: "Do you work with clients outside Europe?",
    answer:
      "Yes. Ludvik4 is based in Europe and works remotely with founders and small teams worldwide. Project communication, documentation, and delivery for the international site are in English.",
  },
  {
    question: "Can you improve an existing product?",
    answer:
      "Yes, when the codebase and access are available for review. The first step is a focused technical and product assessment so that risks, constraints, and the first useful change are explicit before implementation starts.",
  },
  {
    question: "How do you use AI in development?",
    answer:
      "AI assists research, implementation, testing, and review inside an engineering process with written requirements, version control, automated tests, and quality gates. It is a delivery tool, not a substitute for product decisions or verification.",
  },
  {
    question: "What happens after launch?",
    answer:
      "The baseline engagement includes deployment or handover, documentation, and warranty fixes for the agreed scope. Further development or ongoing support can be scoped separately; the source code and project access are handed over so you are not locked in.",
  },
] as const;

export function getInternationalService(
  slug: string,
): InternationalServicePage | undefined {
  return internationalServicePages.find((page) => page.slug === slug);
}

export function getInternationalWork(
  slug: string,
): InternationalWorkItem | undefined {
  return internationalWork.find((item) => item.slug === slug);
}

export function getInternationalGuide(
  slug: string,
): InternationalGuide | undefined {
  return internationalGuides.find((guide) => guide.slug === slug);
}
