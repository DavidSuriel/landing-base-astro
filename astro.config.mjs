import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
const content = JSON.parse(readFileSync(new URL('./src/content/landing.json', import.meta.url), 'utf8'));
export default defineConfig({
  // Mientras negocio.web esté vacío o el dominio real no apunte aquí, canonical y og:url no sirven: por eso seo.indexar=false.
  site: content.negocio.web || 'https://example.com',
  output: 'static',
  // CSS en línea: quita la petición que bloquea el primer render en móvil lento.
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
  // Fuentes de Google descargadas en la compilación y servidas desde el propio sitio. Para usarlas:
  // 1) añade `fontProviders` al import de 'astro/config' y descomenta;
  // 2) en Layout.astro: import { Font } from 'astro:assets' y <Font cssVariable="--font-display" preload /> (preload solo en las del primer pantallazo);
  // 3) en global.css: --font-sans: var(--font-display);
  // fonts: [
  //   { provider: fontProviders.google(), name: 'Inter', cssVariable: '--font-display', weights: ['400 700'], styles: ['normal'], subsets: ['latin'], fallbacks: ['system-ui', 'sans-serif'] },
  // ],
});
