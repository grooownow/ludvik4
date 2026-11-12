import type { LeadFormLabels } from "@/features/lead";
import { enContent, TELEGRAM_URL, type MarketContent } from "../../content";

const ES_LEAD_LABELS: LeadFormLabels = {
  nameLabel: "Nombre",
  nameOptional: "opcional",
  messageLabel: "Tu proyecto",
  messagePlaceholder: "Cuéntanos qué necesitas…",
  contactLabel: "Cómo contactarte",
  contactPlaceholder: "email, teléfono o enlace de mensajería",
  submit: "Enviar consulta",
  submitting: "Enviando…",
  success: "Consulta enviada. Te responderemos pronto. ¡Gracias!",
};

export const esContent: MarketContent = {
  market: "en",
  lang: "es",
  locale: "es",
  ogLocale: "es_ES",
  title: "Diseño web a medida, automatización y apps web — Ludvik4",
  shareTitle: "Ludvik4 — estudio de producto web con su fundadora al frente",
  description:
    "Estudio de producto web en España con su fundadora al frente: webs a medida, automatizaciones, MVP y aplicaciones web para clientes de todo el mundo.",
  keywords: [
    "diseño web",
    "desarrollo web a medida",
    "diseño de páginas web",
    "landing page",
    "automatización de procesos",
    "desarrollo de aplicaciones web",
    "desarrollo de MVP",
    "SaaS a medida",
    "desarrollo con IA",
    "Ludvik4",
  ],
  nav: {
    cta: "Contacto",
    links: [
      { href: "/#work", label: "Proyectos" },
      { href: "/services", label: "Servicios" },
      { href: "/guides", label: "Guías" },
      { href: "/about", label: "Estudio" },
    ],
  },
  // Unrendered legacy blocks of the old home, kept in English on purpose.
  intro: enContent.intro,
  hero: enContent.hero,
  howItWorks: enContent.howItWorks,
  scopes: enContent.scopes,
  aiBlock: enContent.aiBlock,
  about: enContent.about,
  services: {
    eyebrow: "Qué hago",
    title: "Desarrollo de webs, automatizaciones y aplicaciones web",
    items: [
      {
        module: "Módulo / Web",
        title: "Sitio web o landing page",
        body: "Un sitio web adaptado a cualquier pantalla para un producto, un servicio, un evento o un pequeño negocio: desde la estructura de la oferta y los textos hasta el SEO técnico, la analítica y el lanzamiento.",
        href: "/services/websites",
        linkLabel: "Ver desarrollo web",
      },
      {
        module: "Módulo / Automatización",
        title: "Automatización de procesos de negocio",
        body: "Un proceso manual y repetitivo convertido en un flujo controlado, con integraciones, validación, registros y aprobación humana allí donde un error sale caro.",
        href: "/services/workflow-automation",
        linkLabel: "Ver automatización de procesos",
      },
      {
        module: "Módulo / App",
        title: "Aplicación web o SaaS compacto",
        body: "Una primera versión lista para producción, centrada en una tarea importante y un recorrido de usuario completo, con cuentas, datos, IA o pagos cuando el producto los necesita.",
        href: "/services/mvp-development",
        linkLabel: "Ver desarrollo de MVP",
      },
    ],
  },
  h1: "Webs, automatización de procesos y aplicaciones web, listas para lanzar",
  home: {
    exhibit: {
      name: "Ludvik",
      lines: [
        "Puro código, WebGL, cero polígonos.",
        "Manipular con curiosidad.",
      ],
      cta: {
        label: "Quiero esta animación",
        contactHref: "/contact?service=web-animation",
      },
    },
    collection: {
      eyebrow: "Qué hacemos",
      title: ["Si vive en un navegador,", "lo construimos."],
      halls: [
        {
          name: "Landing pages",
          line: "una oferta, una acción",
          exhibit: "landing",
          href: "/services/landing-pages",
        },
        {
          name: "Webs",
          line: "para productos, estudios y eventos",
          exhibit: "browser",
          href: "/services/website-packages",
        },
        {
          name: "Aplicaciones web",
          line: "cuentas, datos, pagos, IA",
          exhibit: "app",
          href: "/services/web-apps",
        },
        {
          name: "Animaciones",
          line: "personajes animados e interacción, como Ludvik",
          exhibit: "motion",
          href: "/services/web-animation",
        },
        {
          name: "Automatizaciones",
          line: "lo tedioso, resuelto",
          exhibit: "gears",
          href: "/services/automation-packages",
        },
        {
          name: "¿Otra cosa?",
          line: "pregunta: seguro que se puede",
          exhibit: "question",
          cta: "Cuéntanos la idea",
        },
      ],
    },
    steps: {
      eyebrow: "Cómo trabajamos",
      title: ["Tres pasos,", "sin rodeos."],
      items: [
        {
          n: "01",
          title: "Hablamos",
          body: "Damos forma al problema y acordamos alcance y precio.",
        },
        {
          n: "02",
          title: "Construimos",
          body: "La primera versión útil, y la ves crecer paso a paso.",
        },
        {
          n: "03",
          title: "Lanzamos",
          body: "Publicada y entregada con su código; a partir de ahí, evoluciona.",
        },
      ],
    },
    work: {
      eyebrow: "Proyectos seleccionados",
      title: ["Proyectos", "a la vista."],
    },
    about: {
      eyebrow: "Sobre mí",
      title: ["Una persona,", "de principio a fin."],
      body: [
        "Soy Kate Pustovaya, fundadora de Ludvik4 y desarrolladora full‑stack con experiencia en UX/UI. Llevo más de 8 años creando aplicaciones web de todos los tamaños y sé lo que hace falta para que un producto sea sólido, escalable y realmente útil para el negocio que lo sostiene.",
        "El estudio está en España y trabaja con clientes de todo el mundo. Nos encargamos del proyecto de principio a fin: de la idea al lanzamiento, con diseño, desarrollo y todo lo que el producto necesite. Hablas directamente conmigo, y yo reúno la experiencia que pida cada encargo.",
      ],
      photoAlt:
        "Retrato de la fundadora de Ludvik4 con sudadera oscura, sonriendo y mirando hacia arriba sobre un fondo rosa",
      linkLabel: "Más sobre mí",
    },
    closing: {
      eyebrow: "Hacemos lo que necesitas",
      title: "¿Tienes algo en mente?",
      cta: "Hablemos de tu proyecto",
    },
    footerReach: "España · Todo el mundo",
  },
  contact: {
    eyebrow: "Contacto",
    title: "Cuéntanos qué debería funcionar mejor",
    body: "Describe el problema, en qué punto estás y el resultado que buscas. Lo revisamos y te proponemos un primer paso sensato.",
    telegramText: "O escríbenos por Telegram → t.me/ludvik4work",
    form: {
      labels: ES_LEAD_LABELS,
      privacyNotice: {
        text: "Ludvik4 utiliza tus datos para responder a tu consulta y para tomar las medidas precontractuales que solicites. Los formularios se envían por correo electrónico a través de Resend, que puede tratar datos fuera del EEE.",
        linkLabel: "Lee la Política de privacidad.",
        href: "/privacy",
      },
    },
  },
  footer: {
    links: [
      { href: "/privacy", label: "Privacidad", external: false, newTab: true },
      { href: "/cookies", label: "Cookies", external: false, newTab: true },
      {
        href: "/terms-of-service",
        label: "Condiciones",
        external: false,
        newTab: true,
      },
      {
        href: "/legal-notice",
        label: "Aviso legal",
        external: false,
        newTab: true,
      },
      { href: TELEGRAM_URL, label: "Telegram", external: true },
    ],
  },
};
