import { ConsentSettingsButton } from "@/components/consent-settings-button";
import { LegalLayout, LegalLink, Mail, Part } from "../../legal-en";
import { localizeHrefs } from "../../localize";
import { esContent } from "./content";
import { esUi } from "./ui";

// The Spanish (es-ES) legal pages. The business is established in Spain, so
// these use the standard Spanish legal terminology, but they state exactly the
// same facts, scope and commitments as the English pages (../../legal-en.tsx,
// ../../privacy-page.tsx). Awaiting a lawyer's review.

const content = localizeHrefs("es", esContent);

const extLink = "text-foreground underline underline-offset-4";

export function EsLegalNotice() {
  return (
    <LegalLayout title="Aviso legal" content={content} ui={esUi}>
      <Part title="Titular del sitio web">
        <p>
          Este sitio web es gestionado por Ekaterina Pustovaia, profesional
          autónoma establecida en España, que opera con el nombre comercial
          Ludvik4.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Domicilio: Avenida de Francia 79, 46024 Valencia, España</li>
          <li>NIF: Z2391039X</li>
          <li>
            Correo electrónico: <Mail />
          </li>
          <li>Actividad: diseño y desarrollo de software</li>
        </ul>
      </Part>
      <Part title="Precios">
        <p>
          Los precios de este sitio web se expresan en euros y no incluyen el
          IVA ni otros impuestos aplicables. Cuando proceda el IVA, se indicará
          en el contrato escrito.
        </p>
      </Part>
      <Part title="Propiedad intelectual">
        <p>
          Los contenidos, el diseño y el código de este sitio web pertenecen a
          Ludvik4 o se utilizan con autorización. No está permitido copiarlos
          sin consentimiento por escrito. Los trabajos de clientes que se
          muestran aquí pertenecen a sus respectivos titulares.
        </p>
      </Part>
      <Part title="Uso del sitio web">
        <p>
          La información de este sitio es de carácter general y puede cambiar.
          No constituye una oferta vinculante: un proyecto solo comienza con un
          contrato escrito, tal como se describe en las{" "}
          <LegalLink locale="es" href="/terms-of-service">
            Condiciones del servicio
          </LegalLink>
          . Los enlaces a otros sitios web se ofrecen por comodidad y Ludvik4 no
          se responsabiliza de su contenido.
        </p>
      </Part>
      <Part title="Datos personales y cookies">
        <p>
          Consulta la{" "}
          <LegalLink locale="es" href="/privacy">
            Política de privacidad
          </LegalLink>{" "}
          y la{" "}
          <LegalLink locale="es" href="/cookies">
            Política de cookies
          </LegalLink>
          .
        </p>
      </Part>
    </LegalLayout>
  );
}

export function EsCookiePolicy() {
  return (
    <LegalLayout title="Política de cookies" content={content} ui={esUi}>
      <Part title="Qué son las cookies">
        <p>
          Las cookies y tecnologías similares almacenan y leen pequeñas
          cantidades de información en tu navegador. Sirven para reconocer un
          navegador que vuelve, medir cómo se usa un sitio o recordar un ajuste.
        </p>
      </Part>
      <Part title="Qué utiliza este sitio web">
        <p>
          Ekaterina Pustovaia, que opera con el nombre comercial Ludvik4,
          gestiona este sitio web y decide cómo se utilizan estas tecnologías.
          No se utilizan cookies publicitarias.
        </p>
        <p>
          Por defecto, la analítica funciona sin cookies y no almacena nada en
          tu navegador con esa finalidad.
        </p>
        <p>
          <span className="text-foreground font-medium">
            Solo si aceptas las cookies:
          </span>{" "}
          PostHog, un servicio de analítica de terceros, almacena un
          identificador en una cookie propia persistente (cuyo nombre empieza
          por <code>ph_</code>) durante un máximo de 12 meses y en el
          almacenamiento del navegador. Permite reconocer las visitas
          recurrentes y activa la grabación de sesiones, en la que todo lo que
          escribes en el formulario de contacto queda oculto.
        </p>
        <p>
          <span className="text-foreground font-medium">
            Necesarias para el funcionamiento del sitio:
          </span>{" "}
          tu elección sobre las cookies y pequeños ajustes guardados en tu
          navegador, como el botón de WhatsApp que ocultaste en el móvil. El
          formulario de contacto utiliza Cloudflare Turnstile para bloquear el
          spam.
        </p>
        <p>
          <span className="text-foreground font-medium">
            Cuando eliges un idioma:
          </span>{" "}
          una cookie propia, <code>ludvik4_lang</code>, y el mismo valor en el
          almacenamiento del navegador lo recuerdan durante 12 meses, para que
          el sitio se abra en ese idioma la próxima vez. Solo se crea cuando
          usas el selector de idioma y no contiene más que el código del idioma.
        </p>
      </Part>
      <Part title="Tu elección">
        <p>
          El banner te permite aceptar o rechazar las cookies. Si las rechazas o
          ignoras el banner, la analítica sigue funcionando sin cookies. Puedes
          cambiar tu elección en cualquier momento, con la misma facilidad con
          la que la hiciste, mediante el control que aparece a continuación o el
          del pie de cada página. También puedes bloquear o eliminar las cookies
          en la configuración de tu navegador.
        </p>
        <ConsentSettingsButton className="text-foreground h-auto p-0 underline underline-offset-4" />
      </Part>
      <Part title="Más información">
        <p>
          PostHog está alojado en la UE. La{" "}
          <LegalLink locale="es" href="/privacy">
            Política de privacidad
          </LegalLink>{" "}
          recoge las bases jurídicas, los proveedores, las transferencias
          internacionales y tus derechos. Para cualquier consulta, escribe a{" "}
          <Mail />.
        </p>
      </Part>
    </LegalLayout>
  );
}

export function EsTerms() {
  return (
    <LegalLayout title="Condiciones del servicio" content={content} ui={esUi}>
      <Part title="1. A quién se aplican estas condiciones">
        <p>
          Estas condiciones regulan los servicios de diseño y desarrollo
          prestados por Ekaterina Pustovaia, que opera con el nombre comercial
          Ludvik4 (datos en el{" "}
          <LegalLink locale="es" href="/legal-notice">
            Aviso legal
          </LegalLink>
          ). Cada proyecto comienza con un contrato escrito. Si el contrato y
          estas condiciones difieren, prevalece el contrato, salvo en lo que la
          ley te proteja como consumidor.
        </p>
      </Part>
      <Part title="2. Alcance y precio">
        <p>
          Los paquetes de este sitio web describen un alcance habitual. El
          alcance definitivo, los plazos y el precio se fijan en el contrato
          escrito una vez acordado el alcance. Los precios se expresan en euros
          y no incluyen el IVA ni otros impuestos aplicables. Cuando proceda el
          IVA, el contrato lo indica junto con el importe total a pagar.
        </p>
      </Part>
      <Part title="3. Pago">
        <p>
          En las landing pages, sitios web, animaciones y automatizaciones,
          pagas el 50 % antes de empezar el trabajo y el 50 % a la entrega. Las
          aplicaciones web se pagan por fases, según lo establecido en el
          contrato.
        </p>
      </Part>
      <Part title="4. Entrega y aceptación">
        <p>
          Revisas cada entrega y nos indicas qué hay que corregir, si es el
          caso, respecto al alcance acordado. Tu silencio no se considera
          aceptación.
        </p>
      </Part>
      <Part title="5. Código y derechos">
        <p>
          Los derechos sobre el código y el diseño creados para ti se te
          transmiten una vez abonado el precio íntegro. Los componentes de
          terceros se rigen por sus propias licencias.
        </p>
      </Part>
      <Part title="6. Si eres un cliente particular: derecho de desistimiento">
        <p>
          Si eres consumidor y el contrato se celebra a distancia, puedes
          desistir en un plazo de 14 días naturales desde su celebración, sin
          necesidad de justificación. Envía una declaración inequívoca a{" "}
          <Mail />. Te reembolsaremos lo que hayas pagado sin demoras indebidas
          y, a más tardar, en un plazo de 14 días.
        </p>
        <p>
          Solo empezamos dentro de esos 14 días si nos lo solicitas
          expresamente. Si después desistes, abonarás un importe proporcional al
          trabajo realizado hasta ese momento. Una vez que el servicio se haya
          prestado por completo a petición expresa tuya, y sabiendo que con ello
          perdías el derecho de desistimiento, ya no podrás desistir.
        </p>
      </Part>
      <Part title="7. Responsabilidad">
        <p>
          Corregimos los defectos dentro del alcance acordado durante el periodo
          de soporte de tu paquete. Frente a empresas y profesionales, la
          responsabilidad se limita al precio pagado en virtud del contrato,
          salvo en caso de dolo o culpa grave. Nada de lo aquí dispuesto limita
          los derechos que la ley reconoce a los consumidores.
        </p>
      </Part>
      <Part title="8. Legislación aplicable">
        <p>
          Estas condiciones se rigen por la legislación española. Los litigios
          con empresas y profesionales se someten a los juzgados y tribunales de
          Valencia (España). Los consumidores conservan las protecciones
          imperativas y los tribunales a los que pueden acudir en su lugar de
          residencia.
        </p>
      </Part>
    </LegalLayout>
  );
}

export function EsPrivacy() {
  return (
    <LegalLayout title="Política de privacidad" content={content} ui={esUi}>
      <Part title="1. Responsable del tratamiento">
        <p>
          La responsable del tratamiento es Ekaterina Pustovaia, que opera con
          el nombre comercial Ludvik4, con domicilio en Avenida de Francia 79,
          46024 Valencia, España. Para consultas sobre privacidad o para ejercer
          tus derechos, escribe a <Mail />.
        </p>
      </Part>

      <Part title="2. Datos que se recogen">
        <p>
          Cuando envías el formulario de contacto, Ludvik4 recibe el nombre que
          indiques, tus datos de contacto y el contenido de tu mensaje. El
          nombre es opcional. Te rogamos que no incluyas datos personales
          sensibles, salvo que sean realmente necesarios para tu consulta.
        </p>
        <p>
          El servidor también lee tu dirección IP para limitar los envíos
          repetidos. Con esta finalidad, se conserva en el proceso del servidor
          durante aproximadamente un minuto. El proveedor de alojamiento puede
          tratar los registros habituales de solicitudes y de seguridad
          necesarios para operar y proteger el sitio web.
        </p>
        <p>
          En el sitio web internacional, PostHog recibe datos técnicos de uso
          limitados, como las URL de las páginas, las páginas de procedencia,
          información sobre el dispositivo y el navegador, y eventos de
          interacción. Por defecto funciona sin cookies: el sitio web no
          almacena ningún identificador analítico en tu navegador ni crea
          perfiles persistentes de personas.
        </p>
        <p>
          Si aceptas las cookies, PostHog además almacena un identificador
          analítico en tu navegador y graba tu visita: las páginas que ves y
          dónde haces clic, te desplazas y mueves el cursor. El texto que
          escribes en el formulario de contacto se oculta y nunca se graba. Los
          perfiles persistentes de personas siguen desactivados. Consulta el
          apartado 9.
        </p>
        <p>
          Cuando algo falla en el sitio web, Sentry recibe un informe de
          diagnóstico: el error y su traza técnica, la dirección de la página en
          la que se produjo, tu navegador y sistema operativo, y una ubicación
          aproximada obtenida de la dirección de red desde la que se hizo la
          solicitud. Estos informes no están vinculados a ningún identificador
          analítico ni se utilizan para elaborar un perfil sobre ti.
        </p>
      </Part>

      <Part title="3. Finalidades y bases jurídicas">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Responder a tu consulta, hablar del trabajo solicitado y aplicar, a
            petición tuya, medidas precontractuales. La base jurídica es el
            artículo 6.1.b) del RGPD.
          </li>
          <li>
            Prevenir el spam, los abusos y los incidentes de seguridad. La base
            jurídica es el interés legítimo de Ludvik4 en proteger el sitio web
            y las comunicaciones, conforme al artículo 6.1.f) del RGPD.
          </li>
          <li>
            Conocer el uso agregado del sitio web y mejorar el servicio. La base
            jurídica es el interés legítimo de Ludvik4 en medir y mejorar el
            sitio web, conforme al artículo 6.1.f) del RGPD. La analítica
            funciona sin almacenamiento en el navegador ni perfiles persistentes
            de personas.
          </li>
          <li>
            Detectar, diagnosticar y corregir fallos para que el sitio web siga
            funcionando. La base jurídica es el interés legítimo de Ludvik4 en
            la seguridad y la fiabilidad del servicio, conforme al artículo
            6.1.f) del RGPD.
          </li>
          <li>
            Conservar información cuando sea necesario para la formulación, el
            ejercicio o la defensa de reclamaciones o para cumplir una
            obligación legal. Las bases jurídicas son los artículos 6.1.f) y
            6.1.c) del RGPD, según corresponda.
          </li>
        </ul>
      </Part>

      <Part title="4. Proveedores de servicios y destinatarios">
        <p>
          El sitio web está alojado en Vercel. Los envíos del formulario llegan
          a Ludvik4 por correo electrónico a través de Resend (Plus Five Five,
          Inc.). La analítica de uso limitada la proporciona PostHog, mediante
          su servicio en la nube de la UE. Los diagnósticos de errores los trata
          Sentry (Functional Software, Inc.). Estos proveedores tratan datos
          técnicos y de los mensajes en la medida necesaria para prestar sus
          servicios. La información también puede comunicarse a asesores
          profesionales o a autoridades públicas cuando sea necesario y lo
          permita la ley.
        </p>
        <p>
          Si contactas con Ludvik4 directamente por Telegram, Telegram trata los
          datos de tu cuenta y de tus mensajes conforme a su propia{" "}
          <a
            className={extLink}
            href="https://telegram.org/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            política de privacidad
          </a>
          . Lo mismo ocurre con WhatsApp (WhatsApp Ireland Limited, empresa de
          Meta) si escribes a Ludvik4 por allí, conforme a su{" "}
          <a
            className={extLink}
            href="https://www.whatsapp.com/legal/privacy-policy-eea"
            target="_blank"
            rel="noopener noreferrer"
          >
            política de privacidad
          </a>
          .
        </p>
      </Part>

      <Part title="5. Transferencias internacionales de datos">
        <p>
          Vercel, Resend, PostHog y Sentry pueden tratar datos personales fuera
          del Espacio Económico Europeo. Cuando es necesario, las transferencias
          están amparadas por una decisión de adecuación o por garantías
          adecuadas conforme al capítulo V del RGPD. Vercel incorpora las
          cláusulas contractuales tipo de la Comisión Europea en sus condiciones
          de tratamiento de datos. Las condiciones de tratamiento de datos de
          Resend incluyen las cláusulas contractuales tipo y declaran su
          adhesión al Marco de Privacidad de Datos UE-EE. UU.
        </p>
      </Part>

      <Part title="6. Conservación">
        <p>
          Los mensajes de consulta se conservan normalmente hasta 12 meses desde
          el último contacto relevante y después se eliminan de los canales de
          comunicación por los que se recibieron. Si la consulta da lugar a un
          contrato, la correspondencia pertinente puede conservarse durante los
          plazos legales de prescripción y los plazos de conservación fiscales,
          contables y legales aplicables. Los datos de seguridad se conservan
          solo el tiempo necesario para investigar o prevenir abusos. Los
          eventos de analítica se conservan según el plazo de conservación
          configurado en PostHog y se revisan periódicamente para eliminarlos o
          reducirlos.
        </p>
      </Part>

      <Part title="7. Tus derechos">
        <p>
          Según las circunstancias, puedes solicitar el acceso, la
          rectificación, la supresión, la limitación del tratamiento o la
          portabilidad de tus datos personales, así como oponerte al tratamiento
          basado en el interés legítimo. Envía tu solicitud a <Mail />. Puede
          ser necesario verificar tu identidad antes de atender la solicitud.
        </p>
        <p>
          También puedes presentar una reclamación ante la{" "}
          <a
            className={extLink}
            href="https://www.aepd.es/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Agencia Española de Protección de Datos (AEPD)
          </a>{" "}
          o ante la autoridad de control de tu lugar de residencia.
        </p>
      </Part>

      <Part title="8. Información obligatoria y decisiones automatizadas">
        <p>
          Facilitar un mensaje y una forma de contactarte es necesario para que
          Ludvik4 pueda responderte. No existe obligación legal de facilitar
          esta información. Los datos del formulario no se utilizan para tomar
          decisiones automatizadas ni para elaborar perfiles.
        </p>
      </Part>

      <Part title="9. Cookies y analítica">
        <p>
          Ludvik4 utiliza PostHog para una medición limitada de audiencia y
          analítica de producto en el sitio web internacional. Ludvik4 no
          utiliza cookies publicitarias, y la analítica está completamente
          desactivada en ludvik4.ru, el sitio web independiente para el mercado
          ruso.
        </p>
        <p>
          Salvo que aceptes las cookies, PostHog funciona sin cookies y no
          almacena nada en tu navegador: ni cookie analítica ni identificador en
          el almacenamiento local o de sesión. La base jurídica de esa medición
          es el interés legítimo de Ludvik4, conforme al artículo 6.1.f) del
          RGPD. Si rechazas las cookies o simplemente ignoras el banner, el
          sitio web se mantiene en este estado.
        </p>
        <p>
          Aceptar las cookies es opcional y añade dos cosas: un identificador
          analítico almacenado en tu navegador, para reconocer las visitas
          recurrentes como del mismo visitante, y la grabación de sesiones. La
          base jurídica de ambas es tu consentimiento, conforme al artículo
          6.1.a) del RGPD.
        </p>
        <p>
          Puedes retirar tu consentimiento en cualquier momento, con la misma
          facilidad con la que lo diste: el control que aparece a continuación,
          también disponible en el pie de cada página, borra tu elección,
          detiene cualquier grabación de sesión y te permite decidir de nuevo.
          La retirada no afecta al tratamiento realizado antes de ella.
          Encontrarás los detalles en la{" "}
          <LegalLink locale="es" href="/cookies">
            Política de cookies
          </LegalLink>
          .
        </p>
        <ConsentSettingsButton className="text-foreground h-auto p-0 underline underline-offset-4" />
      </Part>

      <Part title="10. Cambios">
        <p>
          Esta política puede actualizarse cuando cambien el sitio web o sus
          proveedores de servicios. La versión vigente y su fecha de
          actualización seguirán disponibles en esta página.
        </p>
      </Part>
    </LegalLayout>
  );
}
