# Reglas de la plantilla

La mejor pieza es la que no existe. El mejor proceso es el que no existe.

## Antes de implementar
Lee PRODUCT.md y DESIGN.md. Usa plan/brief.md (y plan/originales/sitio-actual/ si existe) como material de investigación, no como otra fuente de decisiones. Si hay una contradicción material, resuélvela con el usuario. No repitas preguntas ya respondidas. No inventes métricas, años, certificaciones, proyectos ni testimonios: revisa la lista de promesas prohibidas de PRODUCT.md. Solo se publica lo marcado [DECIDIDO].

## Implementación
- Astro estático, TypeScript y Tailwind 4 mediante @tailwindcss/vite. Sin adaptador ni backend propio. Versiones fijadas y package-lock.json versionado; npm ci para instalar.
- Las dependencias declaradas están autorizadas para instalarse. Consulta antes de ampliar el stack, incorporar un servicio de pago o cambiar de proveedor.
- La página se compone en src/components/Landing.astro. Cada landing debe verse distinta: cambia tokens, orden y componentes; no clones el diseño base. Reemplazar o borrar un componente base está permitido; actualiza la lista del README.
- Los textos publicados viven en src/content/landing.json (y landing.<código>.json por idioma, misma estructura). Lee el contenido con getContent(Astro.params.lang). Modifica .pages.yml cuando agregues campos. No reemplaces contenido del cliente por el ejemplo del starter.
- Imágenes en src/assets/images: usa MediaImage o resolveImage; no pongas rutas /src/... directamente en el HTML final. No elimines archivos que estén referenciados. Toda foto visible lleva alt (el validador lo exige). Imágenes de terceros llevan su ficha de procedencia (README › Fotos).
- Opcionales vacíos se omiten. Mantén los objetos y listas del JSON aunque estén vacíos. Las redes son una lista de nombre y URL, con enlaces de texto accesibles.
- Pages CMS borra al guardar las claves vacías (`""`, `[]`, objetos sin datos), en cualquier nivel, y no recorta espacios. Nunca asumas que una clave opcional existe: los tipos salen de src/content/estructura.json y getContent() normaliza en un solo sitio (src/lib/normalize.mjs); los componentes muestran opcionales con condición. Campo nuevo → landing.json, estructura.json y .pages.yml (`required: true` solo si es obligatorio). El validador falla solo por obligatorios ausentes o formato inválido, nunca por un texto ausente ni por paridad de textos entre idiomas.
- El cliente puede cambiar video y portada. MP4 optimizado, objetivo 2–5 MiB, límite de proyecto 8 MiB; para videos grandes o reemplazos frecuentes usa URL directa HTTPS. Pages CMS no comprime videos. No uses enlaces de páginas de YouTube como archivo MP4.
- CSS/SVG primero. Movimiento útil, no fundidos obligatorios en cada sección. Respeta prefers-reduced-motion y no ocultes contenido esperando JS. GSAP solo si el diseño aprobado lo necesita.
- Rendimiento: mide antes de optimizar y sigue OPTIMIZACION.md. Solo el elemento LCP lleva fetchpriority="high"; ningún script lee layout al cargar; lo caro espera a interacción, visibilidad e idle.
- No uses content-visibility en secciones destino de anclas (rompe el salto en móvil). scroll-padding-top sigue a --nav-h.
- Hero 3D: sigue modulos/hero-3d/README.md. No instales three.js en la plantilla base; solo en el proyecto del cliente que lo use. El 3D va solo en el hero, con imagen de portada como respaldo. Cualquier medio de hero distinto de imagen/video se pasa como hijo: `<Hero><Componente /></Hero>`.
- El video de fondo no debe contener información indispensable; usa la imagen de respaldo y control de pausa. Mantén fallback si autoplay falla.
- Formulario opcional (WhatsApp y/o correo con Web3Forms). La clave PUBLIC_WEB3FORMS_ACCESS_KEY es pública y pertenece al destinatario configurado en Web3Forms. Nunca un valor de respaldo de la clave en el código. Cambiar el correo visible del CMS no cambia ese destinatario. No enviar pruebas a terceros sin autorización.
- JSON-LD solo con hechos confirmados. El horario libre es informativo; no lo conviertas automáticamente a openingHours sin normalizarlo.
- No publiques secretos, entrevistas completas, datos privados del cliente ni videos originales. plan/originales está excluida de Git; conserva originales por separado. No versiones skills de agentes (.claude/skills, .agents, .codex).

## Documentos de decisión
Cuando cambie la dirección, reescribe la sección afectada de PRODUCT.md o DESIGN.md y deja una línea en su «Historial». No apiles parches («[Actualizado]», «v2 manda sobre…»).

## Trabajo y entrega
Una muestra inicial (hero y una sección) confirma la dirección; después construye la página completa y muéstrala en preview al cliente antes de pulir detalles (3D, microinteracciones). Un agente principal; segunda revisión solo si aporta.

Ejecuta npm run check y npm run build, también tras simular un guardado del CMS (VERIFICACION.md). Para entrega definitiva, npm run release:check. Revisa VERIFICACION.md. Prueba el correo real con autorización y el ciclo CMS → commit → Cloudflare → sitio.

## GitHub y publicación
Usa git y gh existentes; una skill adicional es opcional. Comprueba cuenta, dueño, repositorio y remoto. Si el usuario autoriza subir cambios al repositorio indicado, realiza commit y push sin solicitar autorización repetida. Nunca uses force-push ni borres historial sin instrucción explícita. Un push a la rama de producción conectada a Pages publica automáticamente. Para cambios visuales usa una rama con preview y pasa a producción cuando se apruebe el resultado. No añadas GitHub Actions para duplicar el despliegue de Cloudflare Pages.

## Iconos
SVG locales en src/components/Icon.astro (Lucide, licencia en LICENSE-lucide.txt); sin librería JavaScript ni fuente de iconos. Los logos de redes se incorporan desde recursos de marca autorizados. Conserva nombres visibles y un enlace de texto como fallback para redes nuevas. Los iconos decorativos llevan aria-hidden="true"; un botón sin texto necesita nombre accesible. No instales React ni una librería de iconos para esta base.
