# Verificación

## Lista antes de entregar un cliente
Marca solo lo comprobado de verdad, con la fecha.

- [ ] `npm run check` y `npm run release:check` sin errores.
- [ ] 375 px y escritorio: sin scroll horizontal, CTA visible sin scroll, foco visible, todo con teclado.
- [ ] Menú móvil abre, cierra al elegir enlace y con Esc.
- [ ] **Saltos de ancla** desde el menú y el botón flotante quedan bajo la barra en móvil.
- [ ] Botón flotante aparece al salir del hero y se oculta en contacto.
- [ ] **Logos del carrusel visibles al primer pase** (no en blanco) y pausa funcional.
- [ ] Formulario: errores bajo el campo, **los campos no se estiran al mostrar el error**, foco en el primero.
- [ ] Formulario por correo: `name="access_key"` presente en el HTML **de producción**; envío autorizado recibido (y revisado spam).
- [ ] Formulario por WhatsApp abre el chat con el mensaje armado.
- [ ] Con movimiento reducido: sin animaciones, video detenido, logos en cuadrícula.
- [ ] Sin JS: contenido visible y enlaces de contacto funcionan.
- [ ] Video: reproducción, pausa, portada y fallback si falla.
- [ ] Segundo idioma (si aplica): selector, `hreflang`, textos traducidos.
- [ ] **Guardado del CMS simulado:** borra del JSON todas las claves con `""`, las listas `[]` y los objetos que queden vacíos, en todos los idiomas y luego en uno solo; añade un espacio al final de un texto. `npm run check` y `npm run build` pasan y el texto sale recortado.
- [ ] Ciclo CMS → commit → check de Cloudflare Pages en verde → cambio visible en el sitio, con una edición real.
- [ ] Dominio y HTTPS; `seo.indexar=true` solo tras el cambio de DNS.
- [ ] Lighthouse móvil ≥ 90 en rendimiento y accesibilidad, medido sobre la build (`npm run preview`); método en OPTIMIZACION.md.

# Cambios de v2.0 — 15 de octubre de 2026

Aprendizajes del primer cliente llevados a la base como patrones (sin contenido del cliente):
- i18n opcional: idiomas detectados por archivo (`landing.<código>.json`), página `/[lang]/` automática, `hreflang` solo con más de un idioma.
- `Landing.astro` compone la página; componentes nuevos: Navbar (barra inteligente + popover), CardGrid, LogoMarquee, FloatingCta, Footer; Contact con WhatsApp/correo, validación accesible y mapa estático.
- Validador: `alt` obligatorio, paridad entre idiomas, listas normalizadas, clave de Web3Forms exigida si el correo está activo (lee `.env`).
- CSS en línea, ejemplo de fuentes con la API de Astro, `scroll-padding-top` ligado a la barra, `content-visibility` solo en el pie.
- Hero con medio intercambiable (`<Hero><Lo-que-sea /></Hero>`); el JS del video solo se incluye en modo video.
- Hero 3D: carga tras interacción, filtro por dispositivo, vigilante de fps.
- Documentos: etiquetas de estado, promesas prohibidas, cuentas, Dirección vigente + Historial, rescate del sitio actual, procedencia de imágenes, guía en 6 pasos, skills sugeridas (HyperFrames, anatomy) a nivel de usuario.
- Corregido: el JSON-LD escapaba `<` con un literal que no tenía efecto.

## Comprobado en este entorno (Node 24.18, Astro 7.3.5)
- `npm run check`: 0 errores. `npm run build`: correcto con un idioma (/, 404) y con un segundo idioma de prueba (/en/ con hreflang y selector).
- Validador: detecta alt faltante, diferencia de estructura entre idiomas, WhatsApp sin número y correo activo sin clave. `release:check` falla con el contenido [PENDIENTE] (correcto).
- `.pages.yml` alineado con las claves de landing.json.
- Medido (contenido de ejemplo, móvil): HTML total ~21 KB con CSS y JS en línea; LCP 1,07 s con 4G lento y CPU 4x; CLS 0; Lighthouse accesibilidad 100, buenas prácticas 100 (SEO 63 por `noindex`, esperado).
- Hero en tres modos: imagen (sin JS de video), video (con su script) y componente propio como hijo.
- Navegador (Chrome, 375 px y 1280 px, contenido de prueba temporal): sin scroll horizontal; menú popover abre/cierra y actualiza aria-expanded; el salto a #contacto queda bajo la barra; validación muestra errores sin estirar campos y enfoca el primero; botón de WhatsApp visible con JS; con movimiento reducido los logos quedan en cuadrícula sin botón.

## Pendiente de verificar
- Envío real de Web3Forms y apertura real de WhatsApp (no se enviaron mensajes).
- Hero 3D actualizado (excluido de `check`; probar al activarlo en un cliente).
- Guardado desde Pages CMS con el ancla `*campos` en un segundo idioma.
- Lighthouse medido con contenido real.
