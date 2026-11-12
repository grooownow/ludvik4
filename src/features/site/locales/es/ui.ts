import type { UiCopy } from "../../ui-copy";

export const esUi: UiCopy = {
  chrome: {
    navigation: "Navegación principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    homeAria: "Ludvik4 — inicio",
    language: "Idioma",
  },
  stage: { scroll: "Ir a la colección", push: "Empuja al tentetieso" },
  whatsapp: {
    label: "Escríbenos por WhatsApp",
    caption: "¿Una pregunta o una propuesta? Escríbenos por WhatsApp",
    greeting: "¡Hola! Te escribo desde ludvik4.dev.",
    hide: "Ocultar el botón de WhatsApp",
  },
  gallery: {
    open: "Abrir",
    newWindow: "(se abre en una ventana nueva)",
    about: "sobre el proyecto",
  },
  newTab: " (se abre en una pestaña nueva)",
  breadcrumbs: {
    aria: "Ruta de navegación",
    home: "Inicio",
    services: "Servicios",
    work: "Proyectos",
    about: "Estudio",
  },
  enquiry: {
    title: "¿Tienes un proyecto parecido?",
    body: "Describe el problema, la situación actual y el resultado que necesitas. Te propondremos un primer paso sensato.",
    cta: "Enviar consulta",
  },
  service: {
    outcome: "Resultado",
    fit: "Cuándo encaja",
    includes: "Qué incluye el encargo",
    examples: "Proyectos habituales",
    process: "Cómo lo hacemos",
    boundaries: "Alcance base",
    guideTitle: "Guía de planificación relacionada",
    guideBody:
      "Rellena esta plantilla práctica antes de pedir presupuesto. Así es más fácil revisar el punto de partida, las preguntas abiertas y el primer alcance útil.",
  },
  workIndex: {
    eyebrow: "Proyectos seleccionados",
    title: "Productos que puedes comprobar",
    lead: "Aquí solo aparecen proyectos cuyo producto, código o resultado se puede comprobar públicamente: una aplicación para el historial de mascotas, una herramienta de testing de código abierto y un producto para desarrollar con IA de forma estructurada.",
  },
  workPage: { problem: "Problema", built: "Qué construí", result: "Resultado" },
  about: {
    eyebrow: "Sobre Ludvik4",
    title: "Un estudio de producto web en España, con su fundadora al frente",
    lead: "Desde Valencia diseñamos y desarrollamos webs, automatizaciones y aplicaciones web para fundadores y equipos pequeños de todo el mundo. Cada proyecto tiene una única responsable, desde el primer planteamiento del problema hasta el lanzamiento y la entrega.",
    sections: [
      {
        title: "Comunicación directa, alcance claro",
        body: "Hablas directamente con quien toma las decisiones de producto y de ingeniería. Convertimos la idea inicial o el problema operativo en un alcance por escrito, sacamos a la luz los supuestos desde el principio y mantenemos el trabajo ligado a un resultado observable, no a una lista de funciones que no para de crecer.",
      },
      {
        title: "Pequeño a propósito, no limitado a una disciplina",
        body: "El estudio sigue en manos de su fundadora. Solo se suman especialistas de confianza cuando el trabajo acordado necesita una disciplina concreta; la responsabilidad y la comunicación del día a día no pasan a un intermediario.",
      },
      {
        title: "Pruebas de ingeniería, no teatro de IA",
        body: "La IA forma parte de las herramientas, junto con las especificaciones, el control de versiones, los tests automatizados, la revisión y las comprobaciones de despliegue. Proyectos públicos de código abierto como qa-pilot muestran cómo se aplican esos controles en la práctica.",
      },
    ],
    articlesTitle: "Artículos",
    articlesBody:
      "Escribimos (en inglés) sobre desarrollo con IA, especificaciones, tests y cómo lanzar productos.",
    articlesLink: "Leer los artículos →",
  },
  legal: {
    eyebrow: "Legal",
    updatedLabel: "Última actualización:",
    updated: "31 de octubre de 2026",
    back: "Volver a Ludvik4",
  },
  notFound: {
    title: "Página no encontrada",
    body: "La página que buscas no existe o se ha movido.",
    cta: "Ir al inicio",
  },
  meta: {
    services: {
      title: "Servicios y precios",
      description:
        "Landing pages, webs, aplicaciones web, animaciones y automatizaciones: qué incluye cada paquete, plazos y precios en euros.",
    },
    about: {
      title: "Sobre el estudio",
      description:
        "Ludvik4 es un estudio de producto web en España, con su fundadora al frente: webs, automatizaciones, MVP y aplicaciones web a medida para todo el mundo.",
      ogTitle: "Sobre Ludvik4",
      ogDescription:
        "Un estudio de producto web en España, con su fundadora al frente, para clientes de todo el mundo.",
    },
    contact: {
      title: "Contacto",
      description:
        "Cuéntale a Ludvik4 tu proyecto de web, automatización o aplicación web: envía una consulta o escríbenos por Telegram.",
      ogTitle: "Contacto — Ludvik4",
    },
    work: {
      title: "Proyectos seleccionados",
      description:
        "Proyectos seleccionados de Ludvik4 que puedes comprobar públicamente: productos para desarrolladores, documentación y código a la vista.",
      ogTitle: "Proyectos seleccionados — Ludvik4",
      ogDescription: "Productos digitales con pruebas públicas y verificables.",
    },
    caseStudy: (title) => ({
      title: `${title} — Caso de estudio`,
      ogTitle: `${title} — Caso de estudio de Ludvik4`,
    }),
    privacy: {
      title: "Política de privacidad",
      description:
        "Cómo recoge, utiliza, conserva y protege Ludvik4 los datos personales.",
    },
    cookies: {
      title: "Política de cookies",
      description:
        "Qué cookies utiliza Ludvik4, para qué y cómo cambiar tu elección.",
    },
    legalNotice: {
      title: "Aviso legal",
      description:
        "Quién está detrás de Ludvik4: titular, dirección, NIF y datos de contacto.",
    },
    terms: {
      title: "Condiciones del servicio",
      description:
        "Cómo trabaja Ludvik4 con sus clientes: alcance, pago, derechos y desistimiento.",
    },
  },
  vatLabel: "IVA incl.",
};
