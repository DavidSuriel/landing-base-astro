# Optimización: rendimiento móvil y SEO

> **Para la IA que lea esto:** método para optimizar una landing hecha con esta base. Copia el **patrón** y el **proceso de medición**, no las cifras de ningún cliente. Antes, lee AGENTS.md, PRODUCT.md y DESIGN.md del proyecto.

Caso de referencia (primer cliente, Lighthouse móvil sobre `astro preview`): FCP 1,8 → 1,1 s; LCP 2,2 → 1,8 s; SEO 69 → 100 al publicar; fuentes iniciales 119 → 58 KB. Sirve como orden de magnitud, no como promesa.

## 1. Método: medir, encontrar la causa, cambiar una cosa, volver a medir
1. `npm run build && npm run preview` y Lighthouse **móvil** (con throttling) sobre la build, nunca sobre `astro dev`.
2. Lee el informe por causas, no por la nota: *LCP element*, *Render-blocking requests*, *Network dependency tree*, *Forced reflow*, *Long main-thread tasks*, peso de fuentes e imágenes.
3. Un cambio por commit, con el antes y el después medidos en el mensaje.
4. Si un arreglo empeora otra cosa, busca el término medio (ver §3, logos).
5. No sacrifiques el aspecto aprobado: cada optimización deja la página visualmente idéntica.

## 2. Fuentes: alojadas y recortadas a lo que usa el CSS
Las variables de Google traen todos los pesos y anchos y compiten con la imagen del hero.
- Anota en el CSS qué pesos y anchos se usan de verdad.
- Recorta los ejes y el subconjunto latino con fontTools y guarda el woff2 en `src/assets/fonts/`:
  ```bash
  pip install fonttools brotli
  fonttools varLib.instancer Fuente[wdth,wght].ttf wght=700:800 wdth=110:116 -o fuente-cut.ttf
  pyftsubset fuente-cut.ttf --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" \
    --layout-features='*' --flavor=woff2 --output-file=fuente-700-800-wdth110-116.woff2
  ```
- El rango va en el nombre del archivo, para que nadie use un peso que no existe. La licencia OFL va al lado (`OFL-Fuente.txt`).
- `fontProviders.local()` en astro.config.mjs (ejemplo comentado allí) con `display: 'swap'` y `fallbacks` de métricas parecidas.
- Anota el rango en DESIGN.md › Tipografía: un peso o ancho fuera de él obliga a regenerar la fuente.
- La base ya trae `build.inlineStylesheets: 'always'` (CSS en línea, sin petición que bloquee el primer render): mantenlo.

## 3. Imágenes: prioridad para el LCP, lazy para lo demás
- **Elemento LCP** (normalmente la imagen del hero): `eager` + `fetchpriority="high"`. En MediaImage, `eager` sin `priority` ya es `high`. Solo **una** imagen por página; el logo de la barra va `eager` con `priority="auto"`.
- **Carrusel de logos.** `lazy` solo los pinta en blanco (el lazy del navegador no sigue una pista animada con `transform`); todo en `eager` compite con el hero y baja el rendimiento. Término medio, ya en LogoMarquee: `lazy` + un `IntersectionObserver` con `rootMargin: '800px 0px'` que los pasa a `eager` antes de que la sección llegue.
- Siempre `<Image>` (MediaImage) con `widths` y `sizes` reales.

## 4. JavaScript: nada que fuerce layout ni trabajo caro al abrir
- Ningún script lee layout (`scrollY`, `offsetWidth`, `getBoundingClientRect`) en la carga: la primera pasada va en `requestAnimationFrame` (Navbar ya lo hace). Leerlo antes del primer pintado aparece como *Forced reflow*.
- Lo caro (WebGL, librerías grandes, mapas, video) espera a interacción + visibilidad + `requestIdleCallback`, con `import()` dinámico y respaldo estático en el HTML. Hero 3D: crear el contexto WebGL de prueba también es caro, por eso se comprueba dentro de `start()` (modulos/hero-3d).

## 5. SEO
- Lighthouse marca ~69 mientras `seo.indexar=false` (`noindex`): es intencional en preview.
- Al publicar: `negocio.web` = la URL que de verdad sirve la página (canonical, hreflang, og:url y JSON-LD dependen de ella) y `seo.indexar=true` en todos los idiomas. Hazlo el día del cambio de DNS (GUIA-PASO-A-PASO.md › 5); si el cliente decide quedarse en `*.pages.dev`, esa es la URL, y regístralo en PRODUCT.md.
- Indexa solo con el contenido aprobado por el cliente.

## 6. Pages CMS
Que guardar en el panel no rompa el build: README › Pages CMS y campos vacíos.

## 7. Lista para otra landing
- [ ] Lighthouse móvil sobre la build y FCP, LCP, TBT y CLS anotados **antes** de cambiar nada.
- [ ] Elemento LCP identificado: `eager` + `fetchpriority="high"`, ningún otro `high`.
- [ ] CSS en línea.
- [ ] Fuentes alojadas, recortadas a pesos/anchos/subconjunto usados, `swap`, licencia al lado.
- [ ] Imágenes bajo el primer pantallazo en `lazy`; carruseles animados con carga anticipada.
- [ ] Ningún script lee layout en la carga.
- [ ] Nada caro antes de interacción + visibilidad + idle, con `import()` y respaldo estático.
- [ ] `content-visibility: auto` solo donde no rompa anclas ni el carrusel (la base solo lo usa en el pie).
- [ ] SEO al publicar: sin `noindex` y `negocio.web` correcto.
- [ ] `npm run check`, `npm run build` y, para la entrega, `npm run release:check`.
- [ ] Móvil y escritorio: el aspecto **no cambió**; teclado, `prefers-reduced-motion`, imágenes y enlaces.

## 8. Lo que no conviene hacer
- Poner todo en `eager` para arreglar un parpadeo: se paga en el LCP.
- Añadir librerías (GSAP, iconos, React) para optimizar: casi siempre bastan CSS y unas líneas de JS.
- Subir la nota quitando contenido o funciones aprobadas.
- Publicar métricas que no hayas medido.
