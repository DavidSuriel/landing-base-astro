# Reglas de la plantilla

La mejor pieza es la que no existe. El mejor proceso es el que no existe.

## Antes de implementar
Lee PRODUCT.md y DESIGN.md. Usa plan/brief.md como material de investigación, no como otra fuente de decisiones. Si hay una contradicción material, resuélvela con el usuario. No repitas preguntas ya respondidas. No inventes métricas, años, certificaciones, proyectos ni testimonios.

## Implementación
- Astro estático, TypeScript y Tailwind 4 mediante @tailwindcss/vite. Sin adaptador ni backend propio. Versiones fijadas y package-lock.json versionado; npm ci para instalar.
- Las dependencias declaradas están autorizadas para instalarse. Consulta antes de ampliar el stack, incorporar un servicio de pago o cambiar de proveedor.
- Los textos publicados viven en src/content/landing.json. Modifica .pages.yml cuando agregues campos. No reemplaces contenido del cliente por el ejemplo del starter.
- Imágenes en src/assets/images: usa MediaImage o resolveImage; no pongas rutas /src/... directamente en el HTML final. No elimines archivos que estén referenciados.
- Opcionales vacíos se omiten. Mantén los objetos y listas del JSON aunque estén vacíos. Las redes son una lista de nombre y URL, con enlaces de texto accesibles: no requieren librería de iconos.
- El cliente puede cambiar video y portada. MP4 optimizado, objetivo 2–5 MiB, límite de proyecto 8 MiB; para videos grandes o reemplazos frecuentes usa URL directa HTTPS. Pages CMS no comprime videos. No uses enlaces de páginas de YouTube como archivo MP4.
- CSS/SVG primero. Movimiento útil, no fundidos obligatorios en cada sección. Respeta prefers-reduced-motion y no ocultes contenido esperando JS. GSAP solo si el diseño aprobado lo necesita.
- Hero 3D: sigue modulos/hero-3d/README.md. No instales three.js en la plantilla base; solo en el proyecto del cliente que lo use. El 3D va solo en el hero, con imagen de portada como respaldo.
- El video de fondo no debe contener información indispensable; usa la imagen de respaldo y control de pausa. Mantén fallback si autoplay falla.
- Formulario opcional con Web3Forms. La clave PUBLIC_WEB3FORMS_ACCESS_KEY es pública y pertenece al destinatario configurado en Web3Forms. Cambiar el correo visible del CMS no cambia ese destinatario. No enviar pruebas a terceros sin autorización.
- JSON-LD solo con hechos confirmados. El horario libre es informativo; no lo conviertas automáticamente a openingHours sin normalizarlo.
- No publiques secretos, entrevistas completas, datos privados del cliente ni videos originales. plan/originales está excluida de Git; conserva originales por separado.

## Trabajo y entrega
Una muestra inicial (hero y una sección) confirma el diseño; después continúa con toda la página sin bloquear cada sección. Un agente principal; segunda revisión solo si aporta.

Ejecuta npm run check y npm run build. Para entrega definitiva, npm run release:check. Revisa en navegador móvil y escritorio, teclado, enlaces, reducción de movimiento, imágenes y video. Prueba el correo real con autorización y el ciclo CMS → commit → Cloudflare → sitio.

## GitHub y publicación
Usa git y gh existentes; una skill adicional es opcional. Comprueba cuenta, dueño, repositorio y remoto. Si el usuario autoriza subir cambios al repositorio indicado, realiza commit y push sin solicitar autorización repetida. Nunca uses force-push ni borres historial sin instrucción explícita. Un push a la rama de producción conectada a Pages publica automáticamente. Para cambios visuales usa una rama con preview y pasa a producción cuando se apruebe el resultado. No añadas GitHub Actions para duplicar el despliegue de Cloudflare Pages.

## Iconos

SVG locales integrados en Astro; sin librería JavaScript ni fuente de iconos. Usa Lucide para iconos de interfaz cuando hagan falta y conserva su licencia. Los logos de redes se incorporan desde recursos de marca autorizados. Conserva nombres visibles y un enlace de texto como fallback para redes nuevas. Los iconos decorativos llevan aria-hidden="true"; un botón sin texto necesita nombre accesible. No instales React ni una librería de iconos para esta base.
