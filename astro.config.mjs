import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
const content = JSON.parse(readFileSync(new URL('./src/content/landing.json', import.meta.url), 'utf8'));
export default defineConfig({
  site: content.negocio.web || 'https://example.com',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
