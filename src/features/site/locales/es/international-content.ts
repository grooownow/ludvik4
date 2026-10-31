import type {
  InternationalServicePage,
  InternationalWorkItem,
} from "../../international-content";

export const esServicePages: InternationalServicePage[] = [
  {
    slug: "websites",
    title: "Diseño y desarrollo de sitios web",
    description:
      "Diseño y desarrollo web para startups y pequeños negocios: estrategia, estructura de textos, desarrollo adaptable, base SEO, analítica y lanzamiento.",
    eyebrow: "Webs",
    h1: "Diseño y desarrollo web para una oferta clara",
    lead: "Un sitio web o una landing page enfocados, que explican qué haces, dan al visitante un siguiente paso claro y quedan listos para publicar en tu dominio.",
    outcome:
      "Un sitio web adaptado a cualquier pantalla y listo para producción, pensado para un público, una oferta y una vía principal de conversión.",
    fit: [
      "Vas a lanzar un servicio, un producto, un evento o un pequeño negocio",
      "Tu web actual se ve anticuada o no explica bien lo que ofreces",
      "Necesitas una página enfocada para una campaña, un lanzamiento o una prueba de mercado",
    ],
    deliverables: [
      "Análisis inicial del público, la oferta y la acción principal",
      "Estructura de la página y redacción de los textos en colaboración contigo",
      "Dirección visual y diseño de interfaz adaptable",
      "Desarrollo, base técnica de SEO y configuración de analítica",
      "Pruebas en distintos dispositivos, lanzamiento, entrega y correcciones en garantía",
    ],
    examples: [
      "La web de un negocio de servicios",
      "La landing page de un producto o una campaña",
      "Una web corporativa compacta de varias páginas",
    ],
    process: [
      "Aclarar la oferta, el público, las limitaciones y los criterios de éxito",
      "Acordar la estructura de la información, los textos y la dirección visual",
      "Desarrollar y probar el sitio web adaptable",
      "Publicarlo en tu dominio y entregarte los accesos y los archivos fuente",
    ],
    boundaries: [
      "Un idioma y una dirección visual en el alcance base",
      "Una landing page o una web enfocada con pocos tipos de página",
      "Los recursos de pago, el hosting y las integraciones complejas se presupuestan aparte",
    ],
  },
  {
    slug: "workflow-automation",
    title: "Automatización de procesos de negocio",
    description:
      "Automatización de procesos a medida para equipos pequeños: integraciones, documentos, informes, bots e IA, con registros, controles y aprobación humana.",
    eyebrow: "Automatización",
    h1: "Automatización de los procesos repetitivos de tu negocio",
    lead: "Convierte un proceso manual recurrente en un flujo controlado, con entradas claras, resultados visibles y revisión humana allí donde un error tiene un coste real.",
    outcome:
      "Una automatización que funciona, con registros, validación, gestión de errores y una guía de uso; no un script que nadie vigila.",
    fit: [
      "Tu equipo copia la misma información de una herramienta a otra",
      "Documentos, consultas, informes o contenidos siguen un proceso repetible",
      "Una integración estándar cubre el caso ideal, pero no tus reglas reales",
    ],
    deliverables: [
      "Un mapa del proceso actual, sus decisiones y sus puntos de fallo",
      "Una propuesta de flujo y un prototipo con datos representativos",
      "Scripts, APIs, integraciones, bots o IA a medida, donde tenga sentido",
      "Validación, registros, reintentos y aprobación humana en los pasos de riesgo",
      "Pruebas, despliegue, documentación y correcciones en garantía",
    ],
    examples: [
      "Recepción de consultas, asignación y preparación del seguimiento",
      "Extracción de datos estructurados de facturas, formularios o contratos",
      "Informes periódicos o contenidos preparados para su aprobación",
    ],
    process: [
      "Documentar el proceso actual y definir el resultado esperado",
      "Revisar la calidad de los datos, el acceso a APIs, las integraciones y los puntos de riesgo",
      "Prototipar el flujo con casos reales representativos",
      "Añadir controles, probar los casos límite, desplegar y entregar el proceso",
    ],
    boundaries: [
      "Un proceso con un disparador y un resultado definidos",
      "Las tarifas de APIs, modelos de IA, plataformas e infraestructura van aparte",
      "Si el proceso aún no está claro, primero se presupuesta una fase de análisis",
    ],
  },
  {
    slug: "mvp-development",
    title: "Desarrollo de MVP y aplicaciones web a medida",
    description:
      "Desarrollo de MVP y aplicaciones web a medida para fundadores y equipos pequeños: alcance, UX/UI, frontend, backend, pruebas y lanzamiento.",
    eyebrow: "Aplicaciones web",
    h1: "Desarrollo de MVP en torno a un recorrido de usuario completo",
    lead: "Una primera versión lista para producción que resuelve de principio a fin un problema importante, con un alcance lo bastante acotado para lanzar, aprender y ampliar sin funciones especulativas.",
    outcome:
      "Un producto web que funciona y que usuarios reales pueden probar, con código fuente, despliegue y un camino documentado para la siguiente iteración.",
    fit: [
      "Tienes una idea de producto, pero necesitas definir una primera versión creíble",
      "El software genérico no encaja con un proceso operativo importante",
      "Necesitas un portal de clientes, una herramienta interna, un SaaS de nicho o una función con IA",
    ],
    deliverables: [
      "Alcance de la primera versión, recorrido de usuario y criterios de aceptación",
      "Diseño del producto, de los datos y de la interfaz",
      "Frontend, backend, base de datos y las integraciones necesarias",
      "Cuentas, archivos, notificaciones, IA o pagos cuando el recorrido principal los necesita",
      "Tests automatizados, despliegue, estabilización y entrega técnica",
    ],
    examples: [
      "Un portal de clientes o una herramienta interna de operaciones",
      "Un producto de suscripción de nicho",
      "Una aplicación enfocada con IA",
    ],
    process: [
      "Definir el usuario principal, el problema y una condición de éxito medible",
      "Prototipar el recorrido y fijar los límites de la primera versión",
      "Construir en incrementos cortos y revisables, con controles de calidad automáticos",
      "Probar, lanzar, estabilizar y planificar las siguientes versiones con datos reales",
    ],
    boundaries: [
      "Un problema de producto y un recorrido principal de principio a fin",
      "Un producto web, sin aplicaciones nativas para iOS o Android",
      "El soporte continuo, las versiones posteriores, la infraestructura y las tarifas de proveedores van aparte",
    ],
  },
];

export const esWork: InternationalWorkItem[] = [
  {
    slug: "smallfriendfiles",
    title: "smallFriendFiles",
    kind: "Aplicación web",
    description:
      "El historial médico de tu mascota en un solo lugar: pasaportes, análisis e informes veterinarios, con extracción de datos, búsqueda y archivos listos para compartir.",
    image: "/cases/smallfriendfiles-en.webp",
    imageAlt:
      "Landing en inglés de smallFriendFiles con el historial médico de una mascota en ordenador y móvil",
    lead: "smallFriendFiles convierte los papeles dispersos de una mascota en un historial ordenado que su dueño puede buscar, revisar y compartir con el veterinario.",
    problem:
      "Pasaportes, análisis e informes veterinarios suelen acabar repartidos entre carpetas y fotos del móvil. Encontrar el documento correcto y preparar el papeleo para una clínica nueva, una mudanza o una segunda opinión se convierte en una tarea manual que se repite una y otra vez.",
    solution: [
      "Un historial médico propio para cada mascota, con los datos del pasaporte, las vacunas y los documentos originales",
      "Extracción automática y resúmenes breves de cada documento, que el dueño puede contrastar con el original y corregir",
      "Búsqueda y filtros por tipo de documento, fecha, clínica, veterinario y etiquetas",
      "Paquetes de documentos seleccionados con enlace temporal o código QR, acceso revocable y descarga en PDF o archivo comprimido; quien los recibe no necesita cuenta",
      "Una interfaz web adaptable en inglés, español, ucraniano y ruso",
    ],
    result:
      "La aplicación ya está disponible en beta abierta. Reúne en un mismo flujo la subida, la organización, la búsqueda y el envío de documentos. El procesamiento automático se encarga del trabajo rutinario, mientras que las decisiones médicas siguen en manos del veterinario.",
    website: "https://smallfriendfiles.fyi/en",
    websiteLabel: "Abrir smallFriendFiles",
  },
  {
    slug: "gridfin",
    title: "Gridfin",
    kind: "SaaS",
    description:
      "Un starter para Claude Code con esqueleto de aplicación, especificaciones, tests, hooks, controles de calidad y flujos de ingeniería reutilizables.",
    image: "/cases/gridfin-en.webp",
    imageAlt:
      "Landing del producto Gridfin con una vista previa del terminal de Claude Code",
    lead: "Gridfin da al desarrollo de producto con IA una base de arquitectura que funciona y un proceso de entrega que se cumple desde el primer commit.",
    problem:
      "Los agentes de programación con IA avanzan rápido, pero un prompt por sí solo no preserva la arquitectura, la disciplina de testing, las decisiones de producto ni la calidad de cada versión a medida que crece el código.",
    solution: [
      "Un esqueleto de aplicación pensado para producción, con una arquitectura explícita",
      "Especificaciones y un contexto de proyecto persistente para tomar decisiones de forma coherente",
      "Tests automatizados, hooks y controles de calidad que hacen cumplir el flujo acordado",
      "Skills y playbooks reutilizables para implementar, revisar y publicar",
    ],
    result:
      "La landing internacional del producto, la explicación técnica, la guía de ingeniería y el acceso anticipado están disponibles públicamente.",
    website: "https://ludvik4.dev/gridfin/es",
    websiteLabel: "Ver la landing de Gridfin",
    cardLink: {
      href: "/gridfin/es",
      label: "Ver la landing de Gridfin",
      newTab: true,
    },
  },
  {
    slug: "qa-pilot",
    title: "qa-pilot",
    kind: "Plugin de IA",
    description:
      "Un plugin de IA que planifica, escribe, audita y ejecuta tests de software con el contexto de cada proyecto y controles de calidad basados en pruebas.",
    image: "/cases/qa-pilot-en.webp",
    imageAlt: "Landing de qa-pilot: un plugin de QA para Claude Code",
    lead: "qa-pilot convierte el testing, que solía dejarse para el final, en un flujo repetible que un agente de programación con IA puede seguir y verificar.",
    problem:
      "Las herramientas de programación con IA generan tests en un momento, pero esa cobertura suele ser superficial, abusa de los mocks o no demuestra que proteja el comportamiento real.",
    solution: [
      "Un proceso de incorporación que registra el stack real del proyecto y sus convenciones de testing",
      "Flujos separados para planificar tests, implementarlos, hacer testing exploratorio y auditar la suite",
      "Una prueba obligatoria de que cada nuevo test automatizado puede fallar por el motivo previsto",
      "Un contexto de proyecto persistente para que las decisiones de calidad se mantengan de una sesión a otra",
    ],
    result:
      "El plugin está disponible públicamente para agentes de programación con IA y se desarrolla en abierto en GitHub.",
    website: "https://ludvik4.dev/qa-pilot",
    websiteLabel: "Ver la landing de qa-pilot",
  },
];
