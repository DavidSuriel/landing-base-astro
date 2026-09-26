# Cambios de v1.1 — 26 de septiembre de 2026

- Pages CMS: corregidas dos etiquetas engañosas. «interfaz.whatsapp» es el texto del botón (antes pedía un número) y «seo.imagen» es la imagen para compartir en redes (antes decía portada del video).
- Video del hero: no se descarga en pantallas de 760 px o menos ni con ahorro de datos; se muestra la portada.
- Nuevo módulo opcional modulos/hero-3d (excluido de tsconfig para no afectar `npm run check` de la base).
- Pendiente: estos cambios no se compilaron en el entorno donde se hicieron (npm bloqueado). Ejecuta `npm ci`, `npm run check` y `npm run build` antes de subir.

# Verificación de v1.0 — 25 de septiembre de 2026

## Comprobado en este entorno
- Instalación npm realizada sin forzar dependencias. TypeScript 6.0.3 se eligió por compatibilidad con @astrojs/check; las versiones están fijadas en package.json y package-lock.json.
- Node 24.19.0; Astro 7.3.5; Tailwind 4.3.3.
- npm run check: 0 errores, 0 advertencias.
- npm run build: salida estática correcta, inicio y 404.
- JSON y YAML válidos y esquema alineado con los campos de contenido.
- Imágenes de ejemplo resueltas a archivos compilados; no quedan URLs /src/... como src de imagen.
- Servicios y proyectos vacíos no generan esas secciones.
- Una red nueva se refleja como enlace visible.
- El formulario se genera con clave configurada; la compilación falla si está activo sin clave. No se envió ningún correo.
- Validador rechaza imagen inexistente y URL de red con protocolo no permitido.
- El control de publicación rechaza el contenido pendiente de esta plantilla, como corresponde.
- Se restauró el contenido de ejemplo al terminar. Sin datos de prueba externos ni claves incluidas.

## Pendiente de verificar al configurar el primer cliente
- Revisión visual en navegador a 375 px y escritorio, foco con teclado, contraste y zoom. El navegador de pruebas de este entorno no pudo instalarse; no se declara QA visual completada.
- Reproducción, pausa, fallback y reducción de movimiento con el video real. El código está incluido, pero no se completó una prueba de reproducción en navegador.
- Guardar desde Pages CMS con la cuenta del cliente, subir una imagen y comprobar el despliegue de Cloudflare Pages.
- Recepción real de Web3Forms, incluidos errores, spam y destinatario.
- Dominio, HTTPS y rendimiento con medios reales.

Esta es una primera versión técnica ejecutable para personalizar, no una landing de cliente aprobada ni publicada.
