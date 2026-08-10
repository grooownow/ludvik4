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
