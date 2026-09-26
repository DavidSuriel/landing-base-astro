# Landing base · v1.1

Base técnica reutilizable: Astro estático + TypeScript + Tailwind 4 + Pages CMS + GitHub + Cloudflare Pages. Web3Forms opcional. Sin React, base de datos ni servidor propio. Los servicios externos del CMS y formulario sí tienen su propia infraestructura.

## Inicio

Requisitos: Node 24, npm, Git. GitHub CLI (`gh`) para subir automáticamente.

```bash
npm ci
npm run dev
```

Abre la dirección que imprime Astro. No ejecutes `npm create astro`: el proyecto ya está creado. El contenido de muestra está marcado [PENDIENTE] y tiene indexación desactivada. El diseño inicial sirve para comprobar conexiones; personalízalo para cada cliente.

```bash
npm run check
npm run build
npm run preview
```

`build` permite borradores; `release:check` exige contenido real, contacto, dominio e indexación. Este último se ejecuta antes de la entrega pública, no al guardar la plantilla.

## Archivos que vas a tocar

- PRODUCT.md: objetivo, público, alcance, pruebas y decisiones.
- DESIGN.md: dirección aprobada y movimiento.
- AGENTS.md: reglas comunes; CLAUDE.md importa esas reglas.
- plan/brief.md: notas; plan/mockups/: capturas aprobadas.
- src/content/landing.json: textos, contacto, medios, servicios y redes.
- .pages.yml: panel Pages CMS; no es configuración de Cloudflare.
- src/styles/global.css: tokens Tailwind y estilos.
- src/components/: Hero, Contact y MediaImage.
- astro.config.mjs: salida estática y `site` tomado de negocio.web.
- GUIA-PASO-A-PASO.md: subir plantilla y flujo por cliente.
- modulos/: piezas opcionales que se copian solo al cliente que las necesita (hero 3D).
- ENTREGA-CLIENTE.md: instrucciones básicas del panel.

## Fotos y videos

Pages CMS guarda fotos en src/assets/images y referencias /src/assets/images/... en el JSON. MediaImage resuelve esas referencias mediante import.meta.glob y Astro genera los archivos finales optimizados. Nunca uses la referencia /src/... directamente como src HTML. Reemplaza placeholder.svg y favicon.svg.

Video: elige modo `video`, sube MP4 comprimido y define imagen de portada. Alternativamente usa videoExterno con URL directa HTTPS; tiene prioridad sobre el archivo subido. Borra esa URL para volver a usar el archivo local. No se necesita video para que la landing funcione. Con movimiento reducido no se asigna la fuente del video.

Compresión opcional si ya tienes FFmpeg (ejemplo; revisa el resultado y peso):

```bash
ffmpeg -i original.mp4 -t 10 -an -vf "scale=1280:-2" -c:v libx264 -crf 28 -preset medium -pix_fmt yuv420p -movflags +faststart hero.mp4
```

No subas originales pesados. El límite 8 MiB es una decisión de esta plantilla, no la cuota de Cloudflare. Los videos externos tampoco se comprimen automáticamente.

## Tres tipos de landing

| Tipo | Cómo | Dependencias extra |
| --- | --- | --- |
| Simple con imagen | `hero.modo: imagen` (por defecto) | Ninguna |
| Con video | `hero.modo: video` + MP4 y portada | Ninguna |
| Con modelo 3D | Módulo `modulos/hero-3d` (ver su README) | three.js, solo en ese cliente |

En celular y con ahorro de datos, el video y el 3D muestran la imagen de portada. Si un cliente necesita video en celular, quita esa condición en `Hero.astro` y pruébalo con datos móviles.

## Formulario

1. Obtén una clave en Web3Forms vinculada al correo del cliente.
2. Copia .env.example a .env y completa PUBLIC_WEB3FORMS_ACCESS_KEY para desarrollo.
3. En Cloudflare Pages añade esa variable de compilación; necesita nuevo deploy.
4. Activa formulario.activo en el CMS.
5. Envía una prueba autorizada y confirma recepción y spam.

La clave Web3Forms es pública en el HTML; no uses aquí claves privadas. El correo de contacto editable NO cambia el destinatario de Web3Forms. Gestiona destinatario/clave en la cuenta de ese servicio. El formulario básico hace POST nativo y muestra la respuesta del proveedor; no requiere JavaScript. Incluye honeypot; CAPTCHA adicional se incorpora si el spam real lo justifica.

## Cloudflare Pages

Conecta GitHub en Cloudflare **Pages**. Rama de producción: main. Build: `npm run build`. Salida: `dist`. Raíz: la carpeta que contiene package.json (vacía si está en raíz del repo). Variable NODE_VERSION: `24`.

Sin adaptador Cloudflare, sin Workers y sin wrangler para este despliegue estático. Sin GitHub Actions duplicados. Un commit a main dispara la compilación. La primera conexión con GitHub y el dominio requiere acceso del propietario; gh no configura por sí solo Cloudflare ni Pages CMS.

## Verificación y límites

Ver VERIFICACION.md. No se incluyen cuentas, claves ni contenido real. La integración con cuentas externas debe comprobarse en el primer proyecto. No se ha medido un rendimiento real de producción ni se promete una puntuación Lighthouse.

## Documentación oficial

- https://docs.astro.build/en/guides/deploy/cloudflare/
- https://tailwindcss.com/docs/installation/framework-guides/astro
- https://pagescms.org/docs/configuration/
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://cli.github.com/manual/gh_repo_create
- https://docs.web3forms.com/getting-started/installation
- https://impeccable.style/
- https://github.com/mattpocock/skills

## Iconos

SVG locales integrados en Astro; sin librería JavaScript ni fuente de iconos. Usa Lucide para iconos de interfaz cuando hagan falta y conserva su licencia. Los logos de redes se incorporan desde recursos de marca autorizados. Conserva nombres visibles y un enlace de texto como fallback para redes nuevas. Los iconos decorativos llevan aria-hidden="true"; un botón sin texto necesita nombre accesible. No instales React ni una librería de iconos para esta base.
