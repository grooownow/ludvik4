import type {
  PackageText,
  PricingLocaleCopy,
  ServiceText,
} from "../../international-pricing";

// The Spanish (Spain) services and prices page. Same order and shape as
// `internationalPricingServices`: prices, slugs and "from" come from English
// by position (see `localizePricingServices`), so no price is typed here.

const NEEDS = [
  "Tu idea y tu objetivo",
  "Qué estilo te gusta",
  "Lo que ya tengas: textos, logotipo, fotos",
];

const OWN_CODE = {
  title: "El código es tuyo",
  text: "La web y su código fuente son tuyos, sin suscripciones. Usamos tecnología actual, así que es fácil ampliarla o llevarla a cualquier hosting.",
};
const FAST = {
  title: "Rápida en cualquier dispositivo",
  text: "Probamos la velocidad en móviles y con conexiones lentas, y te pasamos el informe.",
};
const HOSTING = {
  title: "Nos ocupamos del lanzamiento",
  text: "Te ayudamos a elegir dominio y hosting, en la UE por defecto. Después desplegamos la web, configuramos HTTPS y la publicamos.",
};
const GDPR = {
  title: "Plantillas RGPD incluidas",
  text: "Incluye plantillas de política de privacidad, formularios de consentimiento, aviso de cookies y aviso legal. Tú las revisas y las adaptas a tu negocio.",
};
const AGREEMENT = {
  title: "Contrato por escrito",
  text: "Alcance, plazos y precio quedan fijados en un contrato por escrito, para que sepas exactamente qué recibes.",
};
const SUPPORT = {
  title: "Soporte tras el lanzamiento",
  text: "Corregimos errores gratis durante uno a tres meses. Si necesitas más, podemos encargarnos de la web a largo plazo, actualizaciones incluidas.",
};

const LANDING_BENEFITS = [
  OWN_CODE,
  {
    title: "Diseño a medida",
    text: "Diseñada según tu estilo y tu marca. Incluye el archivo de Figma y una guía de estilo.",
  },
  {
    title: "Textos escritos para ti",
    text: "Escribimos los textos a partir de tu producto y de lo que representa, y de las búsquedas que traen a la página a las personas adecuadas.",
  },
  FAST,
  {
    title: "Visible para buscadores e IA",
    text: "Marcado y metadatos para Google, Bing y los asistentes de IA.",
  },
  HOSTING,
  GDPR,
  AGREEMENT,
  SUPPORT,
];

const LANDING_PACKAGES: PackageText[] = [
  {
    name: "Básico",
    term: "3–5 días laborables",
    items: [
      "2 propuestas de cabecera (hero)",
      "Textos a partir de lo que nos facilites",
      "Animación sencilla",
      "Enlaces a tus redes sociales y datos de contacto",
      "Se adapta a móviles y tabletas",
      "Preparada para buscadores",
      "1 mes de soporte",
    ],
  },
  {
    name: "Plus",
    promo: "Precio hasta el 31 de diciembre",
    term: "1–2 semanas",
    includes: "Todo lo de Básico, más:",
    items: [
      "3 propuestas de cabecera (hero)",
      "Textos que venden tu producto y posicionan en buscadores",
      "Formulario de contacto",
      "Envío a los buscadores para su indexación",
      "2 meses de soporte",
    ],
    featured: true,
  },
  {
    name: "Premium",
    term: "2–4 semanas",
    includes: "Todo lo de Plus, más:",
    items: [
      "Análisis de la competencia y del público, para que destaques",
      "3 líneas de diseño para elegir",
      "Animación a medida con el estilo de tu marca",
      "Pagos online",
      "Un cuestionario o reservas online, conectados a tu CRM si hace falta",
      "Analítica de visitas con banner de consentimiento, e informe al cabo de un mes",
      "3 meses de soporte",
    ],
  },
];

const SITE_EVERYWHERE = [
  "Código fuente",
  "Archivos de diseño con guía de estilo",
  "Configuración del hosting y publicación",
  "Prueba de velocidad",
  "Plantillas para tus páginas legales",
  "Contrato por escrito",
];

const SITE_BENEFITS = [
  {
    title: "Una estructura clara",
    text: "Organizamos secciones y menús para que tus visitas encuentren servicios, precios, proyectos y contacto en un par de clics.",
  },
  {
    title: "Tu propio sistema de diseño",
    text: "Unas mismas reglas para colores, tipografías, botones y secciones. La web se ve coherente y crece sin esfuerzo. Incluye los archivos de diseño.",
  },
  {
    title: "Preparada para buscadores y respuestas de IA",
    text: "Optimizamos cada página para Google, Bing y los asistentes de IA. En Plus y Premium, además, escribimos los textos según lo que buscan tus clientes.",
  },
  OWN_CODE,
  FAST,
  HOSTING,
  GDPR,
  AGREEMENT,
  SUPPORT,
];

const SITE_PACKAGES: PackageText[] = [
  {
    name: "Básico",
    term: "2–3 semanas",
    items: [
      "Hasta 5 páginas, por ejemplo inicio, servicios y contacto",
      "2 propuestas de diseño para la página de inicio",
      "Textos a partir de lo que nos facilites",
      "Animación sencilla",
      "Enlaces a redes sociales y un mapa",
      "Se adapta a móviles y tabletas",
      "Preparada para buscadores",
      "1 mes de soporte",
    ],
  },
  {
    name: "Plus",
    promo: "Precio hasta el 31 de diciembre",
    term: "3–4 semanas",
    includes: "Todo lo de Básico, más:",
    items: [
      "Hasta 10 páginas",
      "3 propuestas de diseño para la página de inicio",
      "Textos de venta para cada página, pensados para tu producto y para buscadores",
      "Puedes editar algunas páginas por tu cuenta",
      "Formularios de contacto y de solicitud",
      "Envío a los buscadores para su indexación",
      "2 meses de soporte",
    ],
    featured: true,
  },
  {
    name: "Premium",
    term: "5–8 semanas",
    includes: "Todo lo de Plus, más:",
    items: [
      "Análisis de la competencia y del público, para que destaques",
      "Hasta 20 páginas",
      "3 líneas de diseño para elegir",
      "Blog, catálogo o portfolio con filtros",
      "Animación a medida con el estilo de tu marca",
      "Pagos online",
      "Un cuestionario o reservas online, conectados a tu CRM si hace falta",
      "Analítica de visitas con banner de consentimiento, e informe al cabo de un mes",
      "3 meses de soporte",
    ],
  },
];

const WEBAPP_BENEFITS = [
  {
    title: "Una aplicación fiable",
    text: "Arquitectura bien pensada y tecnología actual elegida para cada caso. Los recorridos clave están cubiertos por tests, así que la aplicación es fácil de mantener y escalar.",
  },
  {
    title: "Un sistema de diseño completo",
    text: "Un UI kit y una librería de componentes basados en design tokens, para que el diseño crezca con el producto.",
  },
  {
    title: "Infraestructura lista para funcionar",
    text: "Servidores, despliegues automáticos, seguimiento de errores y copias de seguridad funcionan desde el primer día.",
  },
  {
    title: "Todo el código fuente es tuyo",
    text: "Te entregamos el código, los accesos y los derechos, para que puedas seguir con cualquier equipo.",
  },
  {
    title: "Documentación",
    text: "Documentamos cómo está construida y cómo funciona la aplicación, para que un equipo nuevo se ponga al día enseguida.",
  },
  {
    title: "Pruebas independientes",
    text: "Antes del lanzamiento, la aplicación la revisan testers que no han escrito el código.",
  },
  GDPR,
  AGREEMENT,
  {
    title: "Soporte y evolución",
    text: "Corregimos errores gratis durante 1 a 6 meses, según el paquete. Después, un paquete de desarrollo cubre nuevas funciones y mejoras.",
  },
];

const WEBAPP_TECH = [
  {
    title: "Tecnología actual",
    text: "Elegimos las tecnologías según la tarea y la carga prevista: actuales, probadas y fiables.",
  },
  {
    title: "Arquitectura bien pensada",
    text: "Construimos sobre patrones de arquitectura probados, para que el sistema sea fácil de escalar, cambiar y migrar.",
  },
  {
    title: "Tests automáticos",
    text: "Cada actualización se prueba con los recorridos clave de los usuarios antes de publicarse.",
  },
  {
    title: "Seguimiento de errores",
    text: "Los fallos se registran automáticamente. A menudo nos enteramos de un problema antes que tus usuarios.",
  },
  {
    title: "Despliegue continuo (CI/CD)",
    text: "Cada cambio pasa controles automáticos y se publica solo en minutos, de forma predecible y con opción de volver atrás.",
  },
  {
    title: "Design tokens",
    text: "Colores, tipografías y espaciados viven en variables compartidas, así que diseño y código cambian a la vez.",
  },
];

const WEBAPP_PACKAGES: PackageText[] = [
  {
    name: "Básico",
    priceNote:
      "Búsquedas y filtros complejos, subida de archivos, IA o integraciones se presupuestan aparte",
    term: "3–4 semanas",
    items: [
      "Preparación: objetivo del producto, recorridos de usuario y especificación",
      "Un prototipo de las pantallas clave, para validar la idea antes de desarrollar",
      "Una aplicación construida en torno a un recorrido de usuario principal",
      "Acceso de usuarios y panel de administración",
      "Notificaciones por email o por app de mensajería",
      "1 mes de soporte",
    ],
  },
  {
    name: "Plus",
    priceNote: "El precio final depende del alcance del segundo recorrido",
    term: "2–3 meses",
    includes: "Todo lo de Básico, más:",
    items: [
      "Análisis de la competencia y de los usuarios: qué te diferencia",
      "2 recorridos de usuario: el principal y uno más",
      "Roles y permisos adaptados a tu proceso",
      "Una copia de pruebas de la aplicación, para ver los cambios antes de publicarlos",
      "4 meses de soporte",
    ],
    featured: true,
  },
  {
    name: "Premium",
    priceNote:
      "El precio final depende del número y la complejidad de los recorridos",
    term: "4–6 meses",
    includes: "Todo lo de Plus, más:",
    items: [
      "Estrategia de producto: visión, posicionamiento y hoja de ruta",
      "Hasta 4 recorridos de usuario en torno al objetivo principal",
      "Analítica de usuarios e informes, con banner de consentimiento",
      "Monitorización de disponibilidad 24/7 y de la carga",
      "6 meses de soporte",
    ],
  },
];

const MOTION_EXAMPLES = [
  {
    title: "Una cabecera que impacta",
    text: "Un personaje o tu logotipo sigue el cursor, como Ludvik en nuestra página de inicio, mientras una lente de cristal se desliza tras el ratón. Se queda en la memoria desde el primer segundo. Podemos dibujar un personaje (se presupuesta aparte) o usar el tuyo.",
    href: "/",
  },
  {
    title: "Una historia con scroll",
    text: "Al hacer scroll, las pantallas cambian: las fotos del producto se acercan, los pasos aparecen uno a uno y la historia lleva a la solicitud.",
  },
  {
    title: "Un fondo en movimiento",
    text: "Un degradado de seda, partículas o una superficie líquida detrás del texto. La página cobra vida y se sigue leyendo con facilidad.",
  },
  {
    title: "Infografías animadas",
    text: "Las cifras se cuentan solas, los diagramas y los pasos aparecen al hacer scroll, y las ideas complejas se entienden en segundos.",
  },
  {
    title: "Un lanzamiento que no pasa desapercibido",
    text: "Un producto o una colección nueva se presenta con animación mientras corre la cuenta atrás. Es el tipo de página que la gente comparte.",
  },
  {
    title: "Botones e iconos interactivos",
    text: "Botones, iconos y menús reaccionan al pulsarlos, y la web se nota cuidada y pensada al detalle.",
  },
];

const MOTION_BENEFITS = [
  {
    title: "Animación con el estilo de tu marca",
    text: "Con tus colores y tipografías, y un movimiento que encaja con tu empresa: tranquilo, divertido o preciso.",
  },
  {
    title: "Carga rápida",
    text: "Primero carga el texto y luego la animación. Los móviles más lentos reciben una versión más ligera del efecto.",
  },
  {
    title: "Donde la necesites",
    text: "Como página independiente en tu dominio o como sección de tu web, también en Webflow y WordPress.",
  },
  {
    title: "El código es tuyo",
    text: "Te entregamos el código de la animación, para que puedas modificarla, ampliarla o llevarla a otra web.",
  },
  {
    title: "Amigable con los buscadores",
    text: "El texto de la página sigue siendo texto, así que Google, Bing y los asistentes de IA pueden leerlo.",
  },
  {
    title: "Una versión más tranquila",
    text: "Si el móvil de una visita tiene activada la reducción de movimiento, la animación se detiene o se suaviza, y la página resulta cómoda para todo el mundo.",
  },
  {
    title: "Aprobada antes de desarrollar",
    text: "Te enseñamos cómo se moverá la animación, recogemos tus cambios en una sola lista y los aplicamos antes de la aprobación final.",
  },
  AGREEMENT,
  {
    title: "Soporte tras el lanzamiento",
    text: "Corregimos errores gratis durante una semana a un mes, según el paquete.",
  },
];

const MOTION_PACKAGES: PackageText[] = [
  {
    name: "Básico",
    term: "3–5 días laborables",
    items: [
      "Animación ligera de la página: los bloques aparecen suavemente al hacer scroll",
      "Botones, iconos y transiciones animados",
      "Cifras que se cuentan solas e ilustraciones animadas",
      "1 semana de soporte",
    ],
  },
  {
    name: "Plus",
    term: "1–2 semanas",
    items: [
      "Gráficos interactivos directamente en el navegador (WebGL): fondo líquido, degradado de seda, partículas, lente de cristal o gominola, como en la galería de arriba",
      "Reacciona al cursor, al tacto y al scroll",
      "2 semanas de soporte",
    ],
    featured: true,
  },
  {
    name: "Premium",
    priceNote: "El precio final depende de la complejidad de la historia",
    term: "desde 3 semanas",
    items: [
      "Una página-historia: las pantallas cambian al hacer scroll o clic",
      "Guion de movimiento y transiciones entre pantallas",
      "Un storyboard: apruebas cada pantalla antes del desarrollo",
      "Varios efectos de la galería dentro de la historia",
      "Sonido si lo quieres: de bibliotecas gratuitas o el tuyo",
      "Analítica: hasta dónde llegan las visitas en la historia",
      "1 mes de soporte",
    ],
  },
];

const AUTOMATION_EXAMPLES = [
  {
    title: "Recoger y repartir solicitudes",
    text: "Las solicitudes de tu web, redes sociales, anuncios y marketplaces llegan a una sola cola y van a la persona adecuada. Un bot avisa al equipo cuando un cliente está esperando y, un par de días después, envía un recordatorio amable a quien no ha vuelto a responder.",
  },
  {
    title: "Un asistente de IA en tu web",
    text: "Creamos la base de conocimiento a partir de tu web, tu lista de precios y las preguntas frecuentes. El asistente atiende a las visitas a cualquier hora, recoge solicitudes y pasa las preguntas difíciles a alguien del equipo junto con la conversación.",
  },
  {
    title: "Buscar clientes en chats y anuncios",
    text: "Cada día, un bot revisa chats de Telegram, portales de anuncios, plataformas de licitaciones públicas y otras fuentes. La IA detecta quién busca lo que ofreces y te lo envía con los enlaces. Nuestro propio bot funciona así.",
  },
  {
    title: "De emails, fotos y PDF a tus registros",
    text: "La foto del pedido de un cliente se convierte en un borrador de pedido en Holded, Xero o tu programa de contabilidad, y la tarifa en PDF de un proveedor, en un resumen de subidas de precio. La IA relaciona los artículos con tu catálogo y una persona del equipo lo confirma.",
  },
  {
    title: "Revisar pagos y comisiones de marketplaces",
    text: "Cada semana, un bot revisa lo que Amazon y eBay te han descontado: envíos, tarifas por tamaño y comisiones. Detecta cobros de más, te recuerda el plazo para reclamar y prepara la reclamación.",
  },
  {
    title: "Partes desde obras y talleres",
    text: "Un encargado o un técnico manda al bot fotos y una nota de voz. El bot ordena los datos por proyecto, rellena los partes de trabajo, calcula lo realizado y por la tarde envía un resumen al responsable, en lugar de cien chats de trabajo.",
  },
  {
    title: "Informes para clientes y dirección",
    text: "Los datos de las cuentas publicitarias, tu CRM y tus hojas de cálculo se reúnen en un informe mensual, y la IA redacta las conclusiones. A una agencia con 50 clientes, eso le libera decenas de horas a la semana.",
  },
  {
    title: "Pedidos a proveedores según el stock",
    text: "Un bot revisa el stock y las ventas y propone un pedido. Lo confirmas con un clic y los pedidos llegan a cada proveedor como prefiera: por app de mensajería o por email.",
  },
  {
    title: "Fichas de producto para marketplaces",
    text: "Sube unas fotos y unas palabras sobre el producto. La IA escribe el título, la descripción y las características para Amazon, eBay, Etsy, tu web y otros canales.",
  },
];

const AUTOMATION_BENEFITS = [
  {
    title: "Un proceso que funciona solo",
    text: "Hace el trabajo, comprueba los datos y te avisa cuando hace falta una persona.",
  },
  {
    title: "Todo bajo control",
    text: "Un registro de acciones y alertas de fallos te muestran qué ha pasado y te avisan en cuanto algo va mal.",
  },
  {
    title: "Opciones de datos en la UE",
    text: "Usamos hosting en la UE cuando la tarea lo permite, y proveedores de IA que firman un acuerdo de tratamiento de datos.",
  },
  {
    title: "Esquema e instrucciones",
    text: "Describimos cómo funciona el proceso y qué hacer si algo cambia.",
  },
  {
    title: "Las cuentas y los accesos siguen siendo tuyos",
    text: "Bots, flujos y accesos a servicios se configuran a tu nombre, para que puedas seguir con cualquier equipo.",
  },
  {
    title: "Ninguna solicitud se pierde",
    text: "Cada solicitud llega a alguien del equipo exactamente una vez, sin duplicados ni huecos.",
  },
  {
    title: "Resultados medibles",
    text: "Medimos el antes y el después: tiempo de respuesta, solicitudes perdidas y horas de trabajo manual.",
  },
  AGREEMENT,
  {
    title: "Soporte y evolución",
    text: "Corregimos errores gratis durante uno a tres meses, según el paquete. Después, podemos seguir desarrollándolo según lo necesites.",
  },
];

const AUTOMATION_PACKAGES: PackageText[] = [
  {
    name: "Básico",
    term: "1–2 semanas",
    items: [
      "Un proceso sin IA, por ejemplo las solicitudes en una sola cola, pedidos a proveedores según el stock o un informe mensual",
      "Conecta hasta 2 herramientas, por ejemplo tu web y una app de mensajería",
      "Notificaciones donde las quieras: app de mensajería, redes sociales, push o email",
      "1 mes de soporte",
    ],
  },
  {
    name: "Plus",
    promo: "Precio hasta el 31 de diciembre",
    term: "2–4 semanas",
    items: [
      "Un proceso con IA, por ejemplo pasar pedidos de emails y fotos a tus registros, partes de obra, revisión de comisiones de marketplaces, fichas de producto o búsqueda de clientes",
      "Un bot para el equipo o para clientes en WhatsApp, Telegram u otra app de mensajería",
      "Conecta hasta 4 herramientas, por ejemplo Holded, Xero, QuickBooks, Odoo, HubSpot, Pipedrive, hojas de cálculo y otras",
      "Tú apruebas antes los pasos importantes, como un pago o el envío de un pedido",
      "Formación del equipo",
      "2 meses de soporte",
    ],
    featured: true,
  },
  {
    name: "Premium",
    term: "4–6 semanas",
    items: [
      "Analizamos tus procesos y preparamos un plan de automatización",
      "Un asistente de IA en tu web con una base de conocimiento que creamos nosotros, o hasta 3 procesos conectados",
      "Traspaso a una persona del equipo en el momento oportuno",
      "Un panel con tus cifras: horas ahorradas, solicitudes, errores",
      "Formación del equipo",
      "3 meses de soporte",
    ],
  },
];

export const esPricingTexts: ServiceText[] = [
  {
    seoTitle: "Precio de una landing page: paquetes y tarifas",
    hall: "Sala 01",
    name: "Landing pages",
    lead: "Una sola página que presenta tu producto y te trae solicitudes. Ideal para empezar a vender rápido, validar una idea o acompañar una campaña de publicidad.",
    needs: NEEDS,
    related: [
      {
        text: "¿Necesitas varias páginas sobre tu negocio?",
        label: "Webs",
        href: "/services/website-packages",
      },
    ],
    examples: [
      {
        title: "Landing de producto",
        text: "Muestra qué hace tu app o tu servicio y lleva a la gente a registrarse o descargarla.",
      },
      {
        title: "Una página para captar solicitudes",
        text: "Para negocios de servicios o profesionales autónomos: precios, opiniones, preguntas frecuentes y un formulario. Funciona durante meses junto a tus anuncios.",
      },
      {
        title: "La página de un evento",
        text: "Programa, ponentes, lugar y entradas con la imagen propia del evento, lista en días.",
      },
      {
        title: "Lanzamiento de un producto u oferta",
        text: "Un producto nuevo, una colección o una oferta especial, en una página creada para una campaña.",
      },
      {
        title: "Una lista de espera",
        text: "Da a conocer tu idea antes del lanzamiento y recoge los contactos de quienes se interesen. Así validas la demanda.",
      },
      {
        title: "Landing page con blog",
        text: "Los artículos junto a tu página de venta atraen visitas desde los buscadores y responden a las preguntas frecuentes.",
      },
    ],
    benefits: LANDING_BENEFITS,
    packages: LANDING_PACKAGES,
    everywhere: SITE_EVERYWHERE,
    everywhereNote: "El dominio y el hosting se pagan aparte.",
    detailHref: "/services/websites",
  },
  {
    seoTitle: "Precio de una página web: paquetes y tarifas",
    hall: "Sala 02",
    name: "Webs",
    lead: "Un sitio web de varias páginas que cuenta toda tu historia o la de tu negocio. Cada página responde a una pregunta de tus visitas y ayuda a que te encuentren en los buscadores.",
    needs: [
      "Tu idea y tu objetivo",
      "Una lista de servicios o secciones, si ya la tienes",
      "Lo que ya tengas: textos, logotipo, fotos",
    ],
    related: [
      {
        text: "¿Necesitas una sola página para una oferta o promoción?",
        label: "Landing pages",
        href: "/services/landing-pages",
      },
      {
        text: "¿Necesitas áreas de cliente, cálculos o datos de clientes?",
        label: "Aplicaciones web",
        href: "/services/web-apps",
      },
      {
        text: "¿Necesitas un asistente de IA o un bot que atienda a tus clientes?",
        label: "Automatizaciones",
        href: "/services/automation-packages",
      },
    ],
    examples: [
      {
        title: "Una empresa o un estudio",
        text: "Servicios, precios, equipo, casos de éxito, noticias y contacto.",
      },
      {
        title: "Portfolio creativo",
        text: "Para artistas, fotógrafos o videógrafos. Publicas tus nuevos trabajos por tu cuenta.",
      },
      {
        title: "Un restaurante o una cafetería",
        text: "Carta con fotos, reservas de mesa o pedidos, y un mapa.",
      },
      {
        title: "Oficios y profesionales autónomos",
        text: "Servicios y precios, opiniones y reservas online.",
      },
      {
        title: "Una academia, un club o unas clases",
        text: "Horarios, profesores o entrenadores, precios e inscripción.",
      },
      {
        title: "Una pequeña tienda online",
        text: "Catálogo de productos con fotos y precios, carrito y pago online.",
      },
    ],
    benefits: SITE_BENEFITS,
    packages: SITE_PACKAGES,
    everywhere: SITE_EVERYWHERE,
    everywhereNote: "El dominio y el hosting se pagan aparte.",
    detailHref: "/services/websites",
  },
  {
    seoTitle: "Precio de una aplicación web: paquetes y tarifas",
    hall: "Sala 03",
    name: "Aplicaciones web",
    lead: "Una aplicación en la que tus clientes o tu equipo hacen pedidos, reservan, llevan registros y hacen cálculos. Empezamos con una primera versión funcional centrada en la tarea principal y la hacemos crecer con el feedback real.",
    needs: [
      "El problema que resuelve la aplicación",
      "Quién la va a usar y para qué",
      "Ejemplos de aplicaciones parecidas, si los tienes",
    ],
    related: [
      {
        text: "¿Necesitas presentar tu negocio y recibir solicitudes?",
        label: "Webs",
        href: "/services/website-packages",
      },
      {
        text: "¿Quieres reducir tareas repetitivas o añadir un bot con IA a lo que ya usas?",
        label: "Automatizaciones",
        href: "/services/automation-packages",
      },
    ],
    examples: [
      {
        title: "Historial médico digital para mascotas",
        text: "Nuestro propio smallFriendFiles: haces una foto de un documento y la IA extrae los datos, escribe un breve resumen y señala lo importante, como una vacuna a punto de caducar. Todos los documentos en un solo sitio, fáciles de buscar y de enviar al veterinario.",
        link: { text: "smallFriendFiles", href: "/work/smallfriendfiles" },
      },
      {
        title: "Un programa de fidelización",
        text: "Los clientes acumulan puntos y suben de nivel en su cuenta, consultan su historial de compras y reciben ofertas personalizadas.",
      },
      {
        title: "Una escuela online con cuentas de alumno",
        text: "Los alumnos compran cursos y entregan tareas, los profesores las corrigen y tú ves los pagos y el progreso.",
      },
      {
        title: "Un marketplace de productos digitales",
        text: "Los creadores suben plantillas o presets, los compradores pagan y descargan, y tú te llevas una comisión.",
      },
      {
        title: "Reserva de espacios",
        text: "Salas de reuniones, estudios o pistas: huecos libres en un calendario, reserva y pago online, y recordatorios para los clientes.",
      },
      {
        title: "Configurador de producto con pedido",
        text: "Tus clientes diseñan muebles o ventanas a medida y ven el precio al instante, y tu equipo de producción recibe un pedido completo.",
      },
    ],
    benefits: WEBAPP_BENEFITS,
    packages: WEBAPP_PACKAGES,
    everywhere: [
      "Revisión de seguridad",
      "Copias de seguridad",
      "Plantillas para tus páginas legales",
    ],
    tech: WEBAPP_TECH,
    everywhereNote:
      "Un recorrido de usuario es el camino de una persona hasta un resultado, por ejemplo «lo encontré, lo reservé, lo pagué». El acceso, el área de cliente y las notificaciones siempre están incluidos. Los servidores y los servicios de terceros (IA, SMS, API) se pagan aparte.",
    detailHref: "/services/mvp-development",
  },
  {
    seoTitle: "Animaciones para webs: paquetes y precios",
    hall: "Sala 04",
    name: "Animaciones",
    lead: "La animación hace que una web se recuerde, desde una cabecera que impacta hasta una historia que se despliega al hacer scroll. La creamos como página independiente o dentro de tu web actual.",
    needs: [
      "Una idea o una sensación",
      "Tu logotipo, tus colores y ejemplos que te gusten",
      "Acceso a tu web, o el diseño que quieres animar",
      "Ilustraciones, si quieres animarlas",
    ],
    related: [
      {
        text: "¿Necesitas una web completa con animación?",
        label: "Webs",
        href: "/services/website-packages",
      },
      {
        text: "¿Necesitas una sola página de venta?",
        label: "Landing pages",
        href: "/services/landing-pages",
      },
    ],
    examples: MOTION_EXAMPLES,
    gallery: true,
    benefits: MOTION_BENEFITS,
    packages: MOTION_PACKAGES,
    everywhere: [
      "Integración en tu web, también en Webflow y WordPress",
      "Vista previa del movimiento antes del desarrollo",
      "Código fuente de la animación",
      "Informe de velocidad de carga",
      "Pruebas en distintos navegadores",
    ],
    everywhereNote:
      "La página independiente va en tu propio dominio. El dominio, el hosting, las tipografías de pago y la música se pagan aparte. Los modelos 3D y los configuradores de producto, en los que el comprador gira el producto y le cambia el color, se presupuestan aparte.",
  },
  {
    seoTitle: "Precio de automatizar tu negocio: paquetes y tarifas",
    hall: "Sala 05",
    name: "Automatizaciones",
    lead: "Automatizar es que el software haga el trabajo repetitivo: las solicitudes llegan solas a tu app de mensajería o a tu CRM, un bot atiende a los clientes y los informes se preparan solos. Empezamos por el proceso que más tiempo te quita.",
    needs: [
      "Cómo funciona hoy el proceso",
      "Acceso a tus herramientas (te enseñamos a compartirlo de forma segura)",
      "Algunos ejemplos reales: solicitudes, documentos, informes",
    ],
    related: [
      {
        text: "¿Necesitas una aplicación nueva con cuentas de usuario?",
        label: "Aplicaciones web",
        href: "/services/web-apps",
      },
      {
        text: "¿Necesitas una web que te traiga solicitudes?",
        label: "Webs",
        href: "/services/website-packages",
      },
    ],
    examples: AUTOMATION_EXAMPLES,
    benefits: AUTOMATION_BENEFITS,
    packages: AUTOMATION_PACKAGES,
    everywhere: [
      "Esquema del proceso e instrucciones",
      "Registro de acciones: qué hizo la automatización y cuándo",
      "Alertas de fallos",
      "Textos de consentimiento allí donde se recogen datos de clientes",
    ],
    everywhereNote:
      "Los servidores, los modelos de IA y los servicios de pago se pagan aparte, normalmente desde 20 € al mes. Te decimos el importe exacto antes de empezar.",
    detailHref: "/services/workflow-automation",
  },
];

export const esPricingCopy: PricingLocaleCopy = {
  copy: {
    eyebrow: "Servicios y precios",
    hubTitle: ["Qué hacemos — ", "y cuánto cuesta."],
    tabTitle: "paquetes y precios.",
    lead: "Fijamos el precio y el plazo en un contrato por escrito antes de empezar, para que sepas qué vas a pagar y qué vas a recibir. Elige un servicio para comparar paquetes.",
    tabsLabel: "Servicios",
    examples: "Por ejemplo",
    galleryTitle: "Pruébalas tú",
    galleryHint: "Pasa el ratón o toca: estas animaciones reaccionan a ti.",
    benefits: "Qué recibes",
    needsLabel: "De tu parte",
    needsTail: "Del resto nos encargamos nosotros.",
    tech: "Por dentro",
    packages: "Paquetes",
    popular: "El más elegido",
    order: "Lo quiero",
    everywhereLabel: "En todos los paquetes:",
    detailLink: "Más sobre este servicio →",
    closing: {
      eyebrow: "¿No encuentras lo que buscas?",
      title: "Cuéntanos la idea. Te damos precio.",
      cta: "Hablemos de tu proyecto",
    },
  },
  galleryCaptions: [
    {
      title: "Animación ligera de bloques",
      text: "Los bloques aparecen uno a uno mientras una cifra sube hasta el 100 %.",
    },
    {
      title: "Degradado de seda",
      text: "Los colores cambian despacio, como la seda.",
    },
    {
      title: "Fondo líquido",
      text: "La superficie fluye y el cursor deja ondas a su paso.",
    },
    {
      title: "Lente de cristal",
      text: "Una lente sigue el cursor y refracta el dibujo que hay debajo.",
    },
    {
      title: "Gominola",
      text: "Toca el osito de gominola. Tiembla y luego se queda quieto.",
    },
    {
      title: "Partículas",
      text: "Los puntos forman una palabra y se dispersan al acercar el cursor.",
    },
  ],
  vatLabel: "IVA incl.",
  jsonLd: { homeLabel: "Inicio", hubLabel: "Servicios" },
  prefill: {
    animation: "Quiero una animación como Ludvik para mi web.",
    pack: (pack, service, price) =>
      `Me interesa el paquete ${pack} de ${service} (${price}).`,
  },
};
