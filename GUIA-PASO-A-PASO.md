# De la plantilla al cliente publicado

Seis pasos. Cada uno tiene un prompt listo para el agente (Claude Code o Codex). Un agente principal basta.

## 0. Una sola vez: herramientas y skills

Node 24, Git y GitHub CLI (`gh auth login`, comprueba con `gh auth status`).

**Skills a nivel de usuario** (se instalan una vez y sirven para todos los clientes; no se versionan en el repo, el `.gitignore` ya excluye `.claude/skills/`, `.agents/` y `.codex/`):

| Skill | Para qué | Instalar |
| --- | --- | --- |
| impeccable | Diseño, crítica y pulido de interfaz | `npx impeccable install` |
| grill-me | Entrevista para cerrar vacíos de PRODUCT.md | `npx skills@latest add mattpocock/skills --skill grill-me --skill grilling` |
| **hyperframes** (sugerida) | Crear el **video del hero** o un video promo desde HTML/CSS → MP4. Apache 2.0, requiere Node 22+ y FFmpeg | `claude plugin marketplace add heygen-com/hyperframes` y `claude plugin install hyperframes@hyperframes` (otros agentes: `npx skills add heygen-com/hyperframes`) |
| **anatomy** (sugerida) | **Ilustraciones isométricas SVG que explican** cómo funciona un equipo, proceso o sistema. MIT, solo Node 20.10+ | `npx skills add wheresryan22/anatomy -g -a claude-code` |

Los instaladores pueden cambiar: si las opciones difieren, usa su documentación oficial. Vuelve a abrir la sesión del agente para que las detecte.

### Video con HyperFrames → hero
1. Crea el proyecto de video **fuera del repo** o en `plan/originales/video/` (excluida de Git): `npx hyperframes init video-hero`.
2. Prompt: «Con /hyperframes crea un loop de 8 s, 1280×720, sin audio ni texto indispensable, con los colores de DESIGN.md, para el fondo del hero».
3. `npx hyperframes render` y comprime (README › Fotos y videos) a 2–5 MiB.
4. Copia solo el MP4 final a `public/videos/` (o súbelo desde el CMS), pon `hero.modo: video` y una imagen de portada (un fotograma del mismo video).

### Ilustración con anatomy → sección explicativa
1. Prompt: «Con /anatomy explica cómo funciona [equipo/proceso del cliente]. Entrega un **.svg suelto** (no React), con las piezas reales que aparecen en PRODUCT.md».
2. Estático: guárdalo en `src/assets/images/ilustraciones/` y úsalo como `hero.imagen` o con `<MediaImage>`. Animado: pégalo en un componente `Ilustracion.astro` (dentro de `<div class="hero-media">`) y en Landing.astro usa `<Hero><Ilustracion /></Hero>`.
3. Revisa: `role="img"` y `<title>`/aria-label con la explicación, animación desactivada con `prefers-reduced-motion`, sin texto indispensable solo dentro del dibujo, que no invente piezas ni datos técnicos.
4. Nada de React ni salida WebGL en esta base; si hace falta 3D real, usa `modulos/hero-3d`.

## 1. Crear el proyecto

Desde la carpeta padre:

```bash
gh repo create PROPIETARIO/cliente-x --template TU_USUARIO/landing-base --private --clone
cd cliente-x
npm ci
npm run dev
```

El propietario debe ser una cuenta u organización donde tengas permisos; preferible que el cliente conserve sus cuentas y dominio. Las mejoras futuras de la plantilla no se propagan solas.

## 2. Entender (investigación → PRODUCT.md)

1. Rescata el sitio actual si existe (plan/brief.md › 1).
2. Entrevista con las tres preguntas clave y el resto de plan/brief.md.
3. Consolida en PRODUCT.md con etiquetas [DECIDIDO]/[PROPUESTA]/[SITIO]/[PENDIENTE].

Prompt: «Lee plan/brief.md y plan/originales/sitio-actual/. Resuelve solo los vacíos que afecten tipo de sitio, público, CTA, pruebas y alcance (usa grill-me si hace falta). Actualiza PRODUCT.md con etiquetas. No escribas componentes todavía».

## 3. Dirección visual (DESIGN.md)

1. Explora dos direcciones con el contenido real (Stitch, impeccable o capturas). Elige una.
2. Guarda capturas en plan/mockups y la dirección en DESIGN.md › Dirección vigente, incluido el medio del hero (imagen, video, 3D o ilustración).

Prompt: «Compara estas capturas con PRODUCT.md. Detecta problemas de mensaje, jerarquía, móvil y CTA. Escribe DESIGN.md › Dirección vigente. No agregues efectos por decoración».

## 4. Construir la página completa

Prompt: «Lee AGENTS.md, PRODUCT.md y DESIGN.md. Personaliza esta base para el cliente: tokens, componentes y orden en Landing.astro. Integra los textos [DECIDIDO] en landing.json y mantén .pages.yml sincronizado. Muéstrame hero y una sección; después construye toda la página sin detenerte por cada sección. Comprueba móvil y escritorio».

- Segundo idioma: README › Segundo idioma.
- Muestra al cliente la **página completa en preview** antes de pulir 3D, video o microinteracciones: el rediseño suele llegar al ver todo.
- Si cambia la dirección, reescribe DESIGN.md/PRODUCT.md (no apiles parches).

## 5. Publicar y conectar

1. Sube el repo. En Cloudflare **Pages** conecta GitHub: rama `main`, build `npm run build`, salida `dist`, variable `NODE_VERSION=24`.
2. Cambios visuales en una rama → preview de Cloudflare → merge a main al aprobar.
3. **`seo.indexar=false` mientras el dominio real no apunte a este sitio.** Evita que se indexe el dominio de prueba `*.pages.dev`. Lighthouse SEO marcará ~69 por el `noindex`: es intencional, no lo «arregles». JSON-LD solo se emite con `indexar=true`.
4. Pages CMS: en https://app.pagescms.org autoriza el repo e invita al cliente.
5. Formulario por correo: crea la clave en Web3Forms con la cuenta del destinatario (anota el dueño en PRODUCT.md › Cuentas). Cloudflare Pages → Settings → Variables: `PUBLIC_WEB3FORMS_ACCESS_KEY` **para Production y Preview**, y vuelve a desplegar. Comprueba: en el HTML publicado debe existir `name="access_key"` con tu clave. Sin la clave la compilación falla a propósito.
6. **Día del cambio de DNS:** dominio en Cloudflare, `negocio.web` con la URL HTTPS final, `seo.indexar=true`, `npm run release:check` y push a main.

No hace falta GitHub Actions: Cloudflare construye. Cliente guarda en Pages CMS → commit en GitHub → Cloudflare publica (tarda unos minutos).

## 6. Entregar

- Recorre VERIFICACION.md con la web publicada.
- Prueba con el cliente: editar texto, subir imagen, añadir red; espera el deploy.
- Envío de formulario autorizado y recepción comprobada (también spam).
- Entrega ENTREGA-CLIENTE.md personalizado y un video corto usando SU panel.
- Registra quién conserva cada cuenta (PRODUCT.md › Cuentas).

## Llevar mejoras a la plantilla

Lo que aprendas en un cliente y sirva a todos: anota el **patrón** (no el contenido del cliente) y aplícalo en una rama de landing-base.
