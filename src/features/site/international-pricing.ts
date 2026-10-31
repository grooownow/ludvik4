import type { PricingCatalog } from "./pricing-catalog";
import type { PricingPackage, PricingService } from "./pricing-draft";

// The international services and prices: the same five services and three
// packages as /uslugi, adapted for clients in Spain, the EU and beyond. Prices
// are fixed strings set by the owner (2026-10-31), excluding VAT; see
// docs/superpowers/specs/2026-10-31-en-storefront-parity-design.md. Cards show the price only; VAT is handled
// in the written agreement (/terms says so).

const NEEDS = [
  "Your idea and goal",
  "Style preferences",
  "Whatever you already have: copy, a logo, photos",
];

const OWN_CODE = {
  title: "The code is yours",
  text: "You own the site and its source code, with no subscription. It runs on a modern stack, so it is easy to extend or move to any host.",
};
const FAST = {
  title: "Fast on every device",
  text: "We test speed on phones and slow connections, and you get the report.",
};
const HOSTING = {
  title: "Launch handled for you",
  text: "We help you pick a domain and hosting, in the EU by default. Then we deploy the site, set up HTTPS and publish it.",
};
const GDPR = {
  title: "GDPR templates included",
  text: "Templates for the privacy notice, consent forms, cookie notice and legal notice are included. You review them and adapt them to your business.",
};
const AGREEMENT = {
  title: "A written agreement",
  text: "Scope, deadlines and price are set out in a written agreement, so you know exactly what you are getting.",
};
const SUPPORT = {
  title: "Support after launch",
  text: "We fix bugs free of charge for one to three months. If you need more, we can look after the site long term, updates included.",
};

const LANDING_BENEFITS = [
  OWN_CODE,
  {
    title: "Custom design",
    text: "Designed around your style and brand. The Figma source and a style guide are included.",
  },
  {
    title: "Copy written for you",
    text: "We shape the copy around your product and what it stands for, and around the searches that bring the right people to the page.",
  },
  FAST,
  {
    title: "Visible to search and AI",
    text: "Markup and metadata for Google, Bing and AI assistants.",
  },
  HOSTING,
  GDPR,
  AGREEMENT,
  SUPPORT,
];

const LANDING_PACKAGES: PricingPackage[] = [
  {
    name: "Basic",
    price: "€200",
    term: "3–5 working days",
    items: [
      "2 hero section options",
      "Copy based on what you provide",
      "Simple animation",
      "Links to your social media and contact details",
      "Works on phones and tablets",
      "Ready for search engines",
      "1 month of support",
    ],
  },
  {
    name: "Plus",
    // Launch offer, as on RU: remove after 31 Dec.
    price: "€350",
    oldPrice: "€400",
    promo: "Price until 31 December",
    term: "1–2 weeks",
    includes: "Everything in Basic, plus:",
    items: [
      "3 hero section options",
      "Sales copy for your product and for search",
      "Contact form",
      "Submitted for search engine indexing",
      "2 months of support",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "€500",
    term: "2–4 weeks",
    includes: "Everything in Plus, plus:",
    items: [
      "Competitor and audience research, so you stand out",
      "3 design directions to choose from",
      "Custom animation in your brand's style",
      "Online payments",
      "A questionnaire or online booking, connected to your CRM if needed",
      "Visitor analytics with a consent banner, and a report after one month",
      "3 months of support",
    ],
  },
];

const SITE_EVERYWHERE = [
  "Source code",
  "Design files with a style guide",
  "Hosting setup and publishing",
  "Speed test",
  "Templates for your legal pages",
  "A written agreement",
];

const SITE_BENEFITS = [
  {
    title: "A clear structure",
    text: "We lay out the sections and menus so visitors find services, prices, work and contacts in a couple of clicks.",
  },
  {
    title: "Your own design system",
    text: "One set of rules for colours, fonts, buttons and sections. The site looks consistent and grows easily. Design files are included.",
  },
  {
    title: "Set up for search and AI answers",
    text: "We set up every page for Google, Bing and AI assistants. In Plus and Premium we also write copy around what your clients search for.",
  },
  OWN_CODE,
  FAST,
  HOSTING,
  GDPR,
  AGREEMENT,
  SUPPORT,
];

const SITE_PACKAGES: PricingPackage[] = [
  {
    name: "Basic",
    price: "€500",
    term: "2–3 weeks",
    items: [
      "Up to 5 pages, for example home, services and contact",
      "2 home page design options",
      "Copy based on what you provide",
      "Simple animation",
      "Social media links and a map",
      "Works on phones and tablets",
      "Ready for search engines",
      "1 month of support",
    ],
  },
  {
    name: "Plus",
    // Launch offer, as on RU: remove after 31 Dec.
    price: "€850",
    oldPrice: "€950",
    promo: "Price until 31 December",
    term: "3–4 weeks",
    includes: "Everything in Basic, plus:",
    items: [
      "Up to 10 pages",
      "3 home page design options",
      "Sales copy for each page, written for your product and for search",
      "You can edit selected pages yourself",
      "Contact and enquiry forms",
      "Submitted for search engine indexing",
      "2 months of support",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "€1,300",
    term: "5–8 weeks",
    includes: "Everything in Plus, plus:",
    items: [
      "Competitor and audience research, so you stand out",
      "Up to 20 pages",
      "3 design directions to choose from",
      "A blog, catalogue or portfolio with filters",
      "Custom animation in your brand's style",
      "Online payments",
      "A questionnaire or online booking, connected to your CRM if needed",
      "Visitor analytics with a consent banner, and a report after one month",
      "3 months of support",
    ],
  },
];

const WEBAPP_BENEFITS = [
  {
    title: "A reliable application",
    text: "Considered architecture and a modern stack chosen for the job. Key user journeys are covered by tests, so the app is easy to maintain and scale.",
  },
  {
    title: "A complete design system",
    text: "A UI kit and component library built on design tokens, so the design can grow with the product.",
  },
  {
    title: "Infrastructure, ready to run",
    text: "Servers, automatic releases, error tracking and backups all work from day one.",
  },
  {
    title: "All the source code is yours",
    text: "We hand over the code, access and rights, so you can continue with any team.",
  },
  {
    title: "Documentation",
    text: "We document how the app is built and run, so a new team can get up to speed quickly.",
  },
  {
    title: "Independent testing",
    text: "Before launch, the app is checked by testers who did not write the code.",
  },
  GDPR,
  AGREEMENT,
  {
    title: "Support and growth",
    text: "We fix bugs free of charge for 1 to 6 months, depending on the package. After that, a development package covers new features and improvements.",
  },
];

const WEBAPP_TECH = [
  {
    title: "Modern stack",
    text: "We choose technologies to suit the job and expected load: current, proven and reliable.",
  },
  {
    title: "Considered architecture",
    text: "We build on proven architectural patterns, so the system is easy to scale, change and move.",
  },
  {
    title: "Automated tests",
    text: "Every update is tested against the key user journeys before release.",
  },
  {
    title: "Error tracking",
    text: "Failures are logged automatically. We often hear about a problem before your users do.",
  },
  {
    title: "Release pipeline (CI/CD)",
    text: "Every change passes automatic checks and deploys itself within minutes, predictably and with a way to roll back.",
  },
  {
    title: "Design tokens",
    text: "Colours, fonts and spacing live in shared variables, so design and code change together.",
  },
];

const WEBAPP_PACKAGES: PricingPackage[] = [
  {
    name: "Basic",
    price: "from €1,500",
    priceNote:
      "Complex search and filters, file uploads, AI or integrations are quoted on top",
    term: "3–4 weeks",
    items: [
      "Preparation: product goal, user journeys and a specification",
      "A prototype of the key screens, to test the idea before development",
      "An app built around one main user journey",
      "User sign-in and an admin panel",
      "Notifications by email or messaging app",
      "1 month of support",
    ],
  },
  {
    name: "Plus",
    // Launch offer, as on RU: remove after 31 Dec.
    price: "€3,000",
    oldPrice: "€3,400",
    promo: "Price until 31 December",
    term: "2–3 months",
    includes: "Everything in Basic, plus:",
    items: [
      "Competitor and user research: what sets you apart",
      "2 user journeys: the main one and one more",
      "Roles and access rights that fit your process",
      "A staging copy of the app, so you see updates before release",
      "4 months of support",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "from €6,000",
    priceNote:
      "The final price depends on the number and depth of user journeys",
    term: "4–6 months",
    includes: "Everything in Plus, plus:",
    items: [
      "Product strategy: vision, positioning and a roadmap",
      "Up to 4 user journeys around the main goal",
      "User analytics and reports, with a consent banner",
      "24/7 availability and load monitoring",
      "6 months of support",
    ],
  },
];

const MOTION_EXAMPLES = [
  {
    title: "A striking hero section",
    text: "A character or logo follows the cursor, like Ludvik on our home page, while a glass lens drifts behind the mouse. It sticks in the mind from the first second. We can draw a character, quoted separately, or use yours.",
    href: "/",
  },
  {
    title: "A scrolling story",
    text: "As visitors scroll, screens change: product photos move closer, steps appear in turn, and the story leads to an enquiry.",
  },
  {
    title: "A moving background",
    text: "A silk gradient, particles or a liquid surface behind the text. The page feels alive and stays easy to read.",
  },
  {
    title: "Animated infographics",
    text: "Numbers count up, diagrams and steps appear as you scroll, and complex ideas land in seconds.",
  },
  {
    title: "A launch with impact",
    text: "A new product or collection arrives with animation while a countdown runs to launch. It's the kind of page people share.",
  },
  {
    title: "Interactive buttons and icons",
    text: "Buttons, icons and menus react when pressed, so the site feels polished and considered.",
  },
];

const MOTION_BENEFITS = [
  {
    title: "Animation in your brand's style",
    text: "In your colours and fonts, with movement that suits your company: calm, playful or precise.",
  },
  {
    title: "Fast loading",
    text: "Text loads first, then animation. Slower phones get a lighter version of the effect.",
  },
  {
    title: "Fits where you need it",
    text: "As a separate page on your domain or a section of your site, including Webflow and WordPress.",
  },
  {
    title: "The code is yours",
    text: "We hand over the source of the animation, so you can change it, develop it or move it to another site.",
  },
  {
    title: "Search-friendly",
    text: "Page text stays text, so Google, Bing and AI assistants can read it.",
  },
  {
    title: "A calmer version",
    text: "If a visitor's phone is set to reduce motion, the animation stops or softens, so the page is comfortable for everyone.",
  },
  {
    title: "Approved before we build",
    text: "We show you how the animation will move, collect your changes in one list and make them before sign-off.",
  },
  AGREEMENT,
  {
    title: "Support after launch",
    text: "We fix bugs free of charge for one week to one month, depending on the package.",
  },
];

const MOTION_PACKAGES: PricingPackage[] = [
  {
    name: "Basic",
    price: "€150",
    term: "3–5 working days",
    items: [
      "Light page animation: blocks fade in smoothly on scroll",
      "Animated buttons, icons and transitions",
      "Numbers that count up, and animated illustrations",
      "1 week of support",
    ],
  },
  {
    name: "Plus",
    price: "€300",
    term: "1–2 weeks",
    items: [
      "Interactive graphics right in the browser (WebGL): a liquid background, silk gradient, particles, glass lens or jelly, as in the gallery above",
      "Reacts to cursor, touch and scroll",
      "2 weeks of support",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "from €700",
    priceNote: "The final price depends on how complex the story is",
    term: "from 3 weeks",
    items: [
      "A story page: screens change on scroll or click",
      "A motion script and transitions between screens",
      "A storyboard: you approve each screen before development",
      "Several gallery effects within the story",
      "Sound if you want it: picked from free libraries, or yours",
      "Analytics: how far visitors get through the story",
      "1 month of support",
    ],
  },
];

const AUTOMATION_EXAMPLES = [
  {
    title: "Collecting and routing enquiries",
    text: "Enquiries from your site, social media, ads and marketplaces land in one queue and go to the right person. A bot reminds staff when a client is waiting and, a couple of days later, sends a polite follow-up to anyone who has gone quiet.",
  },
  {
    title: "An AI assistant on your site",
    text: "We build the knowledge base from your site, price list and common questions. The assistant answers visitors around the clock, takes enquiries and passes harder questions to a team member along with the conversation.",
  },
  {
    title: "Finding leads in chats and classifieds",
    text: "Every day, a bot goes through Telegram chats, classifieds, public tender portals and other sources. AI picks out requests for what you offer and sends them to you with links. Our own bot works this way.",
  },
  {
    title: "From emails, photos and PDFs into your records",
    text: "A photo of a client's order list becomes a draft order in Holded, Xero or your accounting tool, and a supplier's PDF price list becomes a summary of price rises. AI matches items to your catalogue, and an employee confirms.",
  },
  {
    title: "Checking marketplace payouts and fees",
    text: "Each week, a bot checks what Amazon and eBay deducted: shipping, size-related fees and commissions. It finds overcharges, reminds you of the dispute deadline and prepares the claim.",
  },
  {
    title: "Reports from job sites and workshops",
    text: "A foreman or technician sends the bot photos and a voice note. The bot sorts the data by project, fills in completion reports, counts the output and sends the manager a summary in the evening, instead of a hundred work chats.",
  },
  {
    title: "Reports for clients and owners",
    text: "Data from ad accounts, your CRM and spreadsheets comes together in a monthly report, and AI writes the conclusions. For an agency with 50 clients, that frees up dozens of hours a week.",
  },
  {
    title: "Supplier orders based on stock",
    text: "A bot checks stock and sales and suggests an order. You confirm with one click, and orders go to each supplier the way they prefer: by messaging app or email.",
  },
  {
    title: "Product listings for marketplaces",
    text: "Upload photos and a few words about the product. AI writes the title, description and specifications for Amazon, eBay, Etsy, your site and other channels.",
  },
];

const AUTOMATION_BENEFITS = [
  {
    title: "A process that runs itself",
    text: "It does the work, checks the data and tells you when a person is needed.",
  },
  {
    title: "Everything under control",
    text: "An action log and failure alerts show you what happened and tell you straight away when something goes wrong.",
  },
  {
    title: "EU data options",
    text: "We use EU hosting where the task allows, and AI providers that sign a data processing agreement.",
  },
  {
    title: "A diagram and instructions",
    text: "We describe how the process works and what to do if something changes.",
  },
  {
    title: "Accounts and access stay yours",
    text: "Bots, workflows and service access are set up in your name, so you can continue with any team.",
  },
  {
    title: "Every enquiry accounted for",
    text: "Each enquiry reaches a team member exactly once, with no duplicates or gaps.",
  },
  {
    title: "Measurable results",
    text: "We measure before and after: response time, missed enquiries and hours of manual work.",
  },
  AGREEMENT,
  {
    title: "Support and growth",
    text: "We fix bugs free of charge for one to three months, depending on the package. After that, we can develop it further as needed.",
  },
];

const AUTOMATION_PACKAGES: PricingPackage[] = [
  {
    name: "Basic",
    price: "€500",
    term: "1–2 weeks",
    items: [
      "One process without AI, for example enquiries in one queue, supplier orders based on stock, or a monthly report",
      "Connects up to 2 tools, for example your site and a messaging app",
      "Notifications where you want them: a messaging app, social media, push or email",
      "1 month of support",
    ],
  },
  {
    name: "Plus",
    // Launch offer, as on RU: remove after 31 Dec.
    price: "€900",
    oldPrice: "€1,000",
    promo: "Price until 31 December",
    term: "2–4 weeks",
    items: [
      "One process with AI, for example moving orders from emails and photos into your records, job site reports, marketplace fee checks, product listings or lead finding",
      "A bot for staff or clients on WhatsApp, Telegram or another messaging app",
      "Connects up to 4 tools, for example Holded, Xero, QuickBooks, Odoo, HubSpot, Pipedrive, spreadsheets and others",
      "You approve important steps first, such as a payment or sending an order",
      "Team training",
      "2 months of support",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "€2,000",
    term: "4–6 weeks",
    items: [
      "We study your processes and draw up an automation plan",
      "An AI assistant on your site with a knowledge base we build, or up to 3 connected processes",
      "Handover to a team member at the right moment",
      "A dashboard with your numbers: hours saved, enquiries, errors",
      "Team training",
      "3 months of support",
    ],
  },
];

function service(
  entry: Omit<PricingService, "id" | "from"> & { from?: string },
): PricingService {
  return {
    ...entry,
    id: entry.slug,
    from:
      entry.from ?? `from ${entry.packages[0]!.price.replace(/^from /, "")}`,
  };
}

export const internationalPricingServices: PricingService[] = [
  service({
    slug: "landing-pages",
    seoTitle: "Landing Page Cost: Packages and Prices",
    hall: "Hall 01",
    name: "Landing pages",
    lead: "One page that presents your product and brings in enquiries. A good fit for starting sales quickly, testing an idea or backing an ad campaign.",
    needs: NEEDS,
    related: [
      {
        text: "Need several pages about your business?",
        label: "Websites",
        href: "/services/website-packages",
      },
    ],
    examples: [
      {
        title: "A product landing page",
        text: "Shows what your app or service does and leads people to sign up or download.",
      },
      {
        title: "A page for enquiries",
        text: "For a service business or solo professional: prices, reviews, FAQs and a form. It works for months alongside your ads.",
      },
      {
        title: "An event page",
        text: "Programme, speakers, venue and tickets in the event's own look, ready in days.",
      },
      {
        title: "A product or offer launch",
        text: "A new product, collection or special offer, on one page built for a campaign.",
      },
      {
        title: "A waiting list",
        text: "Tell people about your idea before launch and collect contact details from people who are interested. It's how you test demand.",
      },
      {
        title: "A landing page with a blog",
        text: "Articles next to your sales page bring in visitors from search and answer common questions.",
      },
    ],
    benefits: LANDING_BENEFITS,
    packages: LANDING_PACKAGES,
    everywhere: SITE_EVERYWHERE,
    everywhereNote: "Domain and hosting are paid for separately.",
    detailHref: "/services/websites",
  }),
  service({
    slug: "website-packages",
    seoTitle: "Website Development Cost: Packages and Prices",
    hall: "Hall 02",
    name: "Websites",
    lead: "A multi-page site that tells the whole story of you or your business. Each page answers one visitor question and helps people find you in search.",
    needs: [
      "Your idea and goal",
      "A list of services or sections, if you have one",
      "Whatever you already have: copy, a logo, photos",
    ],
    related: [
      {
        text: "Need one page for one offer or promotion?",
        label: "Landing pages",
        href: "/services/landing-pages",
      },
      {
        text: "Need accounts, calculations or client data?",
        label: "Web apps",
        href: "/services/web-apps",
      },
      {
        text: "Need an AI assistant or a bot that answers clients?",
        label: "Automations",
        href: "/services/automation-packages",
      },
    ],
    examples: [
      {
        title: "A company or studio",
        text: "Services, prices, team, case studies, news and contacts.",
      },
      {
        title: "A creative's portfolio",
        text: "For an artist, photographer or videographer. You publish new work yourself.",
      },
      {
        title: "A restaurant or café",
        text: "A menu with photos, table booking or ordering, and a map.",
      },
      {
        title: "A tradesperson or solo professional",
        text: "Services and prices, reviews and online booking.",
      },
      {
        title: "A school, club or class",
        text: "Timetable, teachers or coaches, prices and sign-up.",
      },
      {
        title: "A small online shop",
        text: "A product catalogue with photos and prices, a basket and online payment.",
      },
    ],
    benefits: SITE_BENEFITS,
    packages: SITE_PACKAGES,
    everywhere: SITE_EVERYWHERE,
    everywhereNote: "Domain and hosting are paid for separately.",
    detailHref: "/services/websites",
  }),
  service({
    slug: "web-apps",
    seoTitle: "Web App Development Cost: Packages and Prices",
    hall: "Hall 03",
    name: "Web apps",
    lead: "An app where your clients or staff place orders, book, keep records and run calculations. We start with a first working version built around the main task, then grow it from real feedback.",
    needs: [
      "The problem the app solves",
      "Who will use it and what they will do",
      "Examples of similar apps, if you have any",
    ],
    related: [
      {
        text: "Need to present your business and take enquiries?",
        label: "Websites",
        href: "/services/website-packages",
      },
      {
        text: "Need to cut routine work or add an AI bot to what you already use?",
        label: "Automations",
        href: "/services/automation-packages",
      },
    ],
    examples: [
      {
        title: "A digital medical record for pets",
        text: "Our own smallFriendFiles: photograph a document and AI extracts the data, writes a short summary and flags what matters, such as a vaccination about to expire. Every document is in one place, searchable and easy to send to a vet.",
        link: { text: "smallFriendFiles", href: "/work/smallfriendfiles" },
      },
      {
        title: "A loyalty programme",
        text: "Customers collect points and reach new levels in their account, see their purchase history and get personal offers.",
      },
      {
        title: "An online school with accounts",
        text: "Students buy courses and hand in work, teachers review it, and you see payments and progress.",
      },
      {
        title: "A marketplace for digital goods",
        text: "Creators upload templates or presets, buyers pay and download, and you take a commission.",
      },
      {
        title: "Venue booking",
        text: "Meeting rooms, studios or courts: free slots in a calendar, booking and payment online, and reminders for guests.",
      },
      {
        title: "A product configurator with ordering",
        text: "Clients build furniture or windows to their own measurements and see the price at once, and your production team gets a complete order.",
      },
    ],
    benefits: WEBAPP_BENEFITS,
    packages: WEBAPP_PACKAGES,
    everywhere: [
      "Security review",
      "Backups",
      "Templates for your legal pages",
    ],
    tech: WEBAPP_TECH,
    everywhereNote:
      "A user journey is one person's path to a result, for example “found it, booked it, paid”. Sign-in, the account area and notifications are always included. Servers and third-party services (AI, SMS, APIs) are paid for separately.",
    detailHref: "/services/mvp-development",
  }),
  service({
    slug: "web-animation",
    seoTitle: "Website Animation: Packages and Prices",
    hall: "Hall 04",
    name: "Animations",
    lead: "Animation makes a site memorable, from a striking hero section to a story that unfolds as you scroll. We build it as a separate page or into your existing site.",
    needs: [
      "An idea or a mood",
      "Your logo, colours and examples you like",
      "Access to your site, or the design to animate",
      "Illustrations, if you want them animated",
    ],
    related: [
      {
        text: "Need a whole site with animation?",
        label: "Websites",
        href: "/services/website-packages",
      },
      {
        text: "Need one sales page?",
        label: "Landing pages",
        href: "/services/landing-pages",
      },
    ],
    examples: MOTION_EXAMPLES,
    gallery: true,
    benefits: MOTION_BENEFITS,
    packages: MOTION_PACKAGES,
    everywhere: [
      "Integration with your site, including Webflow and WordPress",
      "A motion preview before development",
      "Animation source code",
      "Loading speed report",
      "Testing across browsers",
    ],
    everywhereNote:
      "A separate page goes on your own domain. Domain, hosting, paid fonts and music are paid for separately. 3D models and product configurators, where buyers rotate and recolour a product, are quoted separately.",
  }),
  service({
    slug: "automation-packages",
    seoTitle: "Business Automation Cost: Packages and Prices",
    hall: "Hall 05",
    name: "Automations",
    lead: "Automation means software does the repetitive work: enquiries reach your messaging app or CRM on their own, a bot answers clients, and reports put themselves together. We start with the process that takes up the most time.",
    needs: [
      "How the process works today",
      "Access to your tools (we'll show you how to share it safely)",
      "A few real examples: enquiries, documents, reports",
    ],
    related: [
      {
        text: "Need a new app with user accounts?",
        label: "Web apps",
        href: "/services/web-apps",
      },
      {
        text: "Need a site that brings in enquiries?",
        label: "Websites",
        href: "/services/website-packages",
      },
    ],
    examples: AUTOMATION_EXAMPLES,
    benefits: AUTOMATION_BENEFITS,
    packages: AUTOMATION_PACKAGES,
    everywhere: [
      "A process diagram and instructions",
      "An action log: what the automation did and when",
      "Failure alerts",
      "Consent wording wherever client data is collected",
    ],
    everywhereNote:
      "Servers, AI models and paid services are paid for separately, usually from €20 a month. We tell you the exact amount before we start.",
    detailHref: "/services/workflow-automation",
  }),
];

export function getInternationalPricingService(slug: string) {
  return internationalPricingServices.find((s) => s.slug === slug);
}

const packageSlug = (pack: PricingPackage) => pack.name.toLowerCase();

export const internationalPricingCatalog: PricingCatalog = {
  services: internationalPricingServices,
  href: (id) => `/services/${id}`,
  orderHref: (s, pack) =>
    `/contact?service=${s.slug}&package=${packageSlug(pack)}`,
  galleryCaptions: [
    {
      title: "Light block animation",
      text: "Blocks appear in turn while a number counts up to 100%.",
    },
    {
      title: "Silk gradient",
      text: "Colours shift slowly, like silk.",
    },
    {
      title: "Liquid background",
      text: "The surface flows, and ripples spread from the cursor.",
    },
    {
      title: "Glass lens",
      text: "A lens follows the cursor and refracts the pattern below it.",
    },
    {
      title: "Jelly",
      text: "Poke the gummy bear. It wobbles, then settles.",
    },
    {
      title: "Particles",
      text: "Dots form a word and scatter away from the cursor.",
    },
  ],
  copy: {
    eyebrow: "Services and prices",
    hubTitle: ["What we build — ", "and what it costs."],
    tabTitle: "packages and prices.",
    lead: "We fix the price and timeline in a written agreement before work starts, so you know what you'll pay and what you'll get. Pick a service to compare packages.",
    tabsLabel: "Services",
    examples: "For example",
    galleryTitle: "Try them yourself",
    galleryHint: "Hover or tap: these animations respond to you.",
    benefits: "What you get",
    needsLabel: "From you",
    needsTail: "We handle the rest.",
    tech: "Under the hood",
    packages: "Packages",
    popular: "Most popular",
    order: "Get started",
    everywhereLabel: "In every package:",
    detailLink: "More about this service →",
    closing: {
      eyebrow: "Don't see what you need?",
      title: "Tell us the idea. We'll price it.",
      cta: "Discuss a project",
    },
  },
  jsonLd: {
    areaServed: "Worldwide",
    currency: "EUR",
    homeLabel: "Home",
    hubLabel: "Services",
    hubPath: "/services",
    trailingSlash: false,
  },
};

/** The message a package button fills in on /contact, by service/package. */
export const internationalOrderPrefills: Record<string, string> =
  Object.fromEntries([
    ["web-animation", "I'd like an animation like Ludvik for my site."],
    ...internationalPricingServices.flatMap((s) =>
      s.packages.map((pack) => [
        `${s.slug}/${packageSlug(pack)}`,
        `I'd like the ${pack.name} package: ${s.name} (${pack.price}).`,
      ]),
    ),
  ]);
