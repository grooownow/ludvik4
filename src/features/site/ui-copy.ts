// Interface copy of the ludvik4.dev storefront that does not live in the
// content objects: headings and labels hard-wired into the views, the About
// page, page metadata. One object per locale; Spanish and Russian live in
// ./locales/<locale>/ui.ts and follow this shape, so a missing string fails tsc.

export type PageMeta = { title: string; description: string };

export type UiCopy = {
  chrome: {
    navigation: string;
    openMenu: string;
    closeMenu: string;
    homeAria: string;
    /** Accessible name of the language switch. */
    language: string;
  };
  stage: { scroll: string; push: string };
  /** The WhatsApp chat (docs/specs/whatsapp-button.md). */
  whatsapp: {
    /** Accessible name of the icon-only links, and the footer link text. */
    label: string;
    /** The desktop floating pill's text. */
    caption: string;
    /** Prefilled in the chat; the visitor sends or edits it. */
    greeting: string;
    /** The phone ×. */
    hide: string;
  };
  gallery: { open: string; newWindow: string; about: string };
  /** Screen-reader note on a work card that opens in a new tab. */
  newTab: string;
  breadcrumbs: {
    aria: string;
    home: string;
    services: string;
    work: string;
    about: string;
  };
  enquiry: { title: string; body: string; cta: string };
  service: {
    outcome: string;
    fit: string;
    includes: string;
    examples: string;
    process: string;
    boundaries: string;
    guideTitle: string;
    guideBody: string;
  };
  workIndex: { eyebrow: string; title: string; lead: string };
  workPage: { problem: string; built: string; result: string };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    sections: { title: string; body: string }[];
    articlesTitle: string;
    articlesBody: string;
    articlesLink: string;
  };
  legal: {
    eyebrow: string;
    updatedLabel: string;
    updated: string;
    back: string;
  };
  notFound: { title: string; body: string; cta: string };
  meta: {
    services: PageMeta;
    about: PageMeta & { ogTitle: string; ogDescription: string };
    contact: PageMeta & { ogTitle: string };
    work: PageMeta & { ogTitle: string; ogDescription: string };
    /** "<title> — Case Study" and its share title. */
    caseStudy: (title: string) => { title: string; ogTitle: string };
    privacy: PageMeta;
    cookies: PageMeta;
    legalNotice: PageMeta;
    terms: PageMeta;
  };
  /** VAT line under each package price: "€423.50 incl. VAT". */
  vatLabel: string;
};

export const enUi: UiCopy = {
  chrome: {
    navigation: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    homeAria: "Ludvik4 — home",
    language: "Language",
  },
  stage: { scroll: "Scroll to the collection", push: "Push the roly-poly" },
  whatsapp: {
    label: "Message us on WhatsApp",
    caption: "Question or proposal? Message us on WhatsApp",
    greeting: "Hi! I'm writing from ludvik4.dev.",
    hide: "Hide the WhatsApp button",
  },
  gallery: {
    open: "Open",
    newWindow: "(opens in a new window)",
    about: "about the project",
  },
  newTab: " (opens in a new tab)",
  breadcrumbs: {
    aria: "Breadcrumbs",
    home: "Home",
    services: "Services",
    work: "Work",
    about: "About",
  },
  enquiry: {
    title: "Discuss a similar project",
    body: "Describe the problem, current situation, and outcome you need. We will suggest a sensible first step.",
    cta: "Send a project enquiry",
  },
  service: {
    outcome: "Outcome",
    fit: "When this is a good fit",
    includes: "What the engagement includes",
    examples: "Typical projects",
    process: "Delivery process",
    boundaries: "Baseline boundaries",
    guideTitle: "Related planning guide",
    guideBody:
      "Use the practical worksheet before requesting an estimate. It makes the starting context, open questions, and first useful scope easier to review.",
  },
  workIndex: {
    eyebrow: "Selected work",
    title: "Products with public evidence",
    lead: "Work appears here when the product, code, or outcome can be checked publicly. Explore a pet records application, an open-source testing tool, and a product for structured AI-assisted development.",
  },
  workPage: { problem: "Problem", built: "What I built", result: "Result" },
  about: {
    eyebrow: "About Ludvik4",
    title: "A founder-led web product studio in Spain",
    lead: "From Valencia, we design and build focused websites, workflow automations, and web applications for founders and small teams worldwide. Every project has one accountable lead from the first problem statement through launch and handover.",
    sections: [
      {
        title: "Direct communication, explicit scope",
        body: "You work directly with the person making product and engineering decisions. We turn the initial idea or operational problem into a written scope, surface assumptions early, and keep delivery tied to an observable outcome rather than an expanding feature list.",
      },
      {
        title: "Small by design, not limited to one discipline",
        body: "The studio stays founder-led. Trusted specialists join only when the agreed work needs a dedicated discipline; accountability and day-to-day communication do not move to an account layer.",
      },
      {
        title: "Engineering evidence over AI theatre",
        body: "AI is part of the toolchain, alongside specifications, version control, automated tests, review, and deployment checks. Public open-source work such as qa-pilot shows how those controls are applied in practice.",
      },
    ],
    articlesTitle: "Articles",
    articlesBody:
      "We write about AI-assisted development, specifications, tests and shipping products.",
    articlesLink: "Read the articles →",
  },
  legal: {
    eyebrow: "Legal",
    updatedLabel: "Last updated:",
    updated: "12 November 2026",
    back: "Back to Ludvik4",
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for does not exist or has been moved.",
    cta: "Go home",
  },
  meta: {
    services: {
      title: "Services and Prices",
      description:
        "Landing pages, websites, web apps, animations and automations: what each package includes, timelines and prices in euros.",
    },
    about: {
      title: "About the Studio",
      description:
        "Ludvik4 is a founder-led web product studio based in Spain, working worldwide on websites, workflow automation, MVPs, and custom web applications.",
      ogTitle: "About Ludvik4",
      ogDescription:
        "A founder-led web product studio in Spain, working worldwide.",
    },
    contact: {
      title: "Contact",
      description:
        "Tell Ludvik4 about your website, automation or web app project — send a request or message on Telegram.",
      ogTitle: "Contact — Ludvik4",
    },
    work: {
      title: "Selected Work",
      description:
        "Selected Ludvik4 work with public evidence, including developer products, documentation, and inspectable code.",
      ogTitle: "Selected Work — Ludvik4",
      ogDescription: "Digital products with public, inspectable evidence.",
    },
    caseStudy: (title) => ({
      title: `${title} — Case Study`,
      ogTitle: `${title} — Ludvik4 Case Study`,
    }),
    privacy: {
      title: "Privacy Notice",
      description:
        "How Ludvik4 collects, uses, retains, and protects personal data.",
    },
    cookies: {
      title: "Cookie Policy",
      description:
        "Which cookies Ludvik4 uses, why, and how to change your choice.",
    },
    legalNotice: {
      title: "Legal Notice",
      description:
        "Who runs Ludvik4: owner, address, tax ID and contact details.",
    },
    terms: {
      title: "Terms of Service",
      description:
        "How Ludvik4 works with clients: scope, payment, rights and withdrawal.",
    },
  },
  vatLabel: "incl. VAT",
};
