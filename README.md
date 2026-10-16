# Landing base · v2.0

Base técnica reutilizable para landings distintas entre sí, hechas rápido con IA: Astro estático + TypeScript + Tailwind 4 + Pages CMS + GitHub + Cloudflare Pages. Formulario opcional por WhatsApp y/o Web3Forms. Sin React, base de datos ni servidor propio.

El diseño incluido solo comprueba conexiones. Lo que se reutiliza son las reglas, el contenido editable, la validación y los patrones accesibles; el aspecto se rehace en cada cliente.

## Inicio

Requisitos: Node 24, npm, Git. GitHub CLI (`gh`) para crear y subir repos.

```bash
npm ci
npm run dev            # desarrollo
npm run check          # tipos
npm run build          # valida contenido (borrador) y compila
npm run release:check  # exige contenido real, dominio e indexación: solo para la entrega
```

El contenido de muestra está marcado [PENDIENTE] y no se indexa. Flujo completo: **GUIA-PASO-A-PASO.md**.

## Archivos que vas a tocar

| Archivo | Qué es |
| --- | --- |
| PRODUCT.md / DESIGN.md | Decisiones del cliente (con etiquetas e historial) |
| AGENTS.md | Reglas para el agente (CLAUDE.md las importa) |
| plan/brief.md | Investigación; plan/originales/ queda fuera de Git |
| src/content/landing.json | Todo el texto publicado y los medios |
| src/content/estructura.json | Todas las claves vacías: forma del contenido y origen de los tipos (Pages CMS borra las vacías al guardar) |
| .pages.yml | Panel de Pages CMS (no es configuración de Cloudflare) |
| src/components/Landing.astro | Orden de la página: quita, reordena o cambia secciones aquí |
| src/styles/global.css | Tokens y estilos |
| VERIFICACION.md | Lista de comprobación antes de entregar |
| OPTIMIZACION.md | Método para rendimiento móvil y SEO (medir, causa, un cambio, medir) |

## Componentes base

Todos leen el contenido con `getContent(Astro.params.lang)` y **se omiten solos si su contenido está vacío**. Reemplaza o borra los que no encajen (y actualiza esta tabla en el proyecto del cliente).

| Componente | Qué hace | Se desactiva con |
| --- | --- | --- |
| Navbar | Barra que se oculta al bajar; menú móvil con `popover` nativo; selector de idioma si hay más de uno | — |
| Hero | Textos + medio intercambiable: imagen/SVG, video (HeroVideo, su JS solo se carga en modo video) o cualquier componente como hijo | — |
| CardGrid | Tarjetas genéricas (servicios, proyectos) | lista vacía |
| LogoMarquee | Logos; con 6 o más, carrusel CSS con pausa | `marcas` vacía |
| Contact | Enlaces directos, formulario WhatsApp/correo con validación accesible, mapa estático | `formulario.whatsapp/correo` en false, `contacto.mapa.imagen` vacío |
| FloatingCta | Botón flotante móvil hacia #contacto | `interfaz.contactoFlotante` vacío |
| Footer | Nombre, redes y pie | — |
| MediaImage / Icon | Imágenes optimizadas desde el CMS / iconos Lucide locales | — |

## Segundo idioma

1. Copia `src/content/landing.json` a `src/content/landing.en.json` y cambia `"idioma": "en"` y `seo.locale`. Traduce los textos.
2. Listo: `/en/` se genera solo (`src/pages/[lang]/index.astro`), aparecen el selector y `hreflang`.
3. En `.pages.yml` añade al final de `content`:
   ```yaml
   - name: landing-en
     label: Página en inglés
     type: file
     path: src/content/landing.en.json
     format: json
     operations:
       delete: false
     fields: *campos
   ```
El validador exige la misma cantidad de elementos en cada lista que el idioma principal; un texto vacío (o ausente) en un idioma no es error. Con un solo idioma no se genera `hreflang`.

## Pages CMS y campos vacíos

Al guardar, Pages CMS **borra las claves vacías** (`"horario": ""`, `"redes": []`, un objeto sin datos) y no recorta espacios. Si el build falla, Cloudflare sigue sirviendo la versión anterior y el panel no muestra error: el cliente cree que «no funciona». Por eso:

- `src/content/estructura.json` tiene todas las claves vacías. `rellenar()` (src/lib/normalize.mjs) la combina con cada JSON y recorta textos; lo usan `getContent()` y el validador. Los tipos de `Content` salen de ahí, no de landing.json.
- Campo nuevo: añádelo a landing.json, estructura.json y .pages.yml. El validador avisa si falta en estructura.json. Marca `required: true` en .pages.yml solo lo obligatorio.
- Prueba antes de entregar: VERIFICACION.md › guardado del CMS.

Diagnóstico cuando un guardado no aparece:

```bash
git fetch && git log origin/main -3 --format='%h %s'                       # ¿commits «via Pages CMS»?
gh api repos/OWNER/REPO/commits/SHA/check-runs --jq '.check_runs[] | "\(.name) \(.conclusion)"'   # ¿Cloudflare Pages en failure?
git worktree add ../cms-check origin/main && cd ../cms-check && npm ci && npm run build   # reproduce el error
```

## Fotos y videos

Pages CMS guarda fotos en src/assets/images y referencias /src/assets/images/... en el JSON. MediaImage las resuelve y Astro genera archivos optimizados. Nunca uses la referencia /src/... como src HTML. Reemplaza placeholder.svg y favicon.svg.

**Procedencia:** cada imagen tomada de terceros (sitio actual del cliente, fabricantes, mapas) lleva al lado una ficha `nombre.ext.json`:

```json
{ "origen": "https://...", "fecha": "2026-10-15", "licencia": "cedida por el cliente | pendiente | CC BY-SA (OSM)", "nota": "" }
```

Logos con leyendas como «Authorized Dealer» quedan [PENDIENTE] hasta tener prueba (PRODUCT.md).

**Video:** modo `video`, MP4 comprimido e imagen de portada. `videoExterno` (URL directa HTTPS) tiene prioridad sobre el archivo subido. Con movimiento reducido, en celular o con ahorro de datos se muestra la portada. Para crear el video, ver la skill HyperFrames en la guía.

```bash
ffmpeg -i original.mp4 -t 10 -an -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p -movflags +faststart hero.mp4
```

Límite 8 MiB (decisión de la plantilla). Los videos externos no se comprimen automáticamente.

**Mapa:** imagen estática (por ejemplo, de OpenStreetMap recoloreada, ~50 KB) + crédito + enlace «Cómo llegar». No se carga ningún iframe ni cookie de terceros.

## Tipos de hero

El hero mantiene textos y CTA; el medio se elige por cliente. Lo que no se usa no se carga.

| Tipo | Cómo | Dependencias extra |
| --- | --- | --- |
| Imagen | `hero.modo: imagen` (por defecto) | Ninguna |
| SVG estático | `hero.modo: imagen` con un `.svg` como imagen | Ninguna |
| Video | `hero.modo: video` + MP4 y portada (se puede generar con HyperFrames) | Ninguna en el sitio |
| SVG animado / ilustración (anatomy) o composición propia | En Landing.astro: `<Hero><Ilustracion /></Hero>` | Ninguna en el sitio |
| Modelo 3D | `<Hero><Hero3D /></Hero>` con `modulos/hero-3d` | three.js, solo en ese cliente |

Cualquier componente pasado como hijo de `<Hero>` reemplaza al bloque de imagen/video; usa la clase `hero-media` para heredar el encuadre. Mantén siempre una imagen de respaldo y sin información indispensable dentro del medio.

## Formulario

Dos canales independientes en `formulario`:
- `whatsapp: true` — arma un mensaje con los campos y abre WhatsApp con el número de Contacto. No necesita cuentas.
- `correo: true` — envía con Web3Forms sin salir de la página; sin JS hace POST nativo. Requiere `PUBLIC_WEB3FORMS_ACCESS_KEY` en `.env` y en Cloudflare (Production y Preview). **Sin clave la compilación falla**; nunca pongas una clave de respaldo en el código.

La clave es pública en el HTML. El correo visible del CMS no cambia el destinatario de Web3Forms. Incluye honeypot; CAPTCHA solo si el spam real lo justifica.

## Rendimiento por defecto

CSS en línea (`build.inlineStylesheets: 'always'`), fuentes servidas desde el propio sitio con la API `fonts` de Astro (ejemplo comentado en astro.config.mjs), imágenes optimizadas, sin JS de terceros. `content-visibility` solo en el pie: en secciones destino de anclas rompe el salto en móvil.

## Cloudflare Pages

Rama de producción `main`, build `npm run build`, salida `dist`, `NODE_VERSION=24`. Sin adaptador, Workers ni wrangler. Sin GitHub Actions duplicados. La primera conexión con GitHub y el dominio requiere acceso del propietario.

## Documentación oficial

- https://docs.astro.build/en/guides/deploy/cloudflare/
- https://docs.astro.build/en/guides/fonts/
- https://tailwindcss.com/docs/installation/framework-guides/astro
- https://pagescms.org/docs/configuration/
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://docs.web3forms.com/getting-started/installation
- https://impeccable.style/
- https://github.com/mattpocock/skills
- https://github.com/heygen-com/hyperframes
- https://github.com/wheresryan22/anatomy
