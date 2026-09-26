import type { ImageMetadata } from 'astro';
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{png,jpg,jpeg,webp,avif,svg}', { eager: true });
export function resolveImage(path?: string): ImageMetadata | undefined {
  return path ? images[path]?.default : undefined;
}
