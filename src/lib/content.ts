import estructura from '../content/estructura.json';
import { rellenar } from './normalize.mjs';

export type Servicio = { nombre: string; descripcion?: string; foto?: string; alt?: string };
export type Proyecto = { titulo: string; descripcion?: string; foto?: string; alt?: string };
export type Marca = { nombre: string; logo?: string };
export type Red = { nombre: string; url: string };
// El tipo sale de estructura.json, no de landing.json: Pages CMS borra las claves vacías al guardar.
// Las listas se tipan a mano: una lista vacía en el JSON no dice qué forma tienen sus elementos.
export type Content = Omit<typeof estructura, 'servicios' | 'proyectos' | 'marcas' | 'redes'> & {
  servicios: Servicio[]; proyectos: Proyecto[]; marcas: Marca[]; redes: Red[];
};
export type Lang = string;

// Idiomas detectados por archivo: landing.json es el principal (/) y landing.<código>.json se publica en /<código>/.
// Para añadir uno basta con copiar el JSON (ver README › Segundo idioma).
const files = import.meta.glob<{ default: unknown }>('../content/landing*.json', { eager: true });

// Única normalización: los componentes reciben todas las claves (texto ausente = "", lista ausente = []).
const normalize = (raw: unknown) => rellenar(estructura, raw) as Content;

export const LANGS = Object.entries(files)
  .map(([file, mod]) => {
    const data = normalize(mod.default);
    const main = file.endsWith('/landing.json');
    return { lang: data.idioma, path: main ? '/' : `/${data.idioma}/`, main, data };
  })
  .sort((a, b) => Number(b.main) - Number(a.main));
export const DEFAULT_LANG: Lang = LANGS[0].lang;

/** Contenido del idioma pedido; sin idioma (o desconocido) devuelve el principal. Uso: getContent(Astro.params.lang). */
export function getContent(lang?: Lang): Content {
  return (LANGS.find((l) => l.lang === lang) ?? LANGS[0]).data;
}

/** Sustituye {clave} en una plantilla de texto: fill('{campo} es requerido.', { campo: 'Nombre' }). */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
}

/** Enlace wa.me con mensaje precargado; vacío si el número no es válido. */
export function waLink(numero: string, mensaje = ''): string {
  if (!/^[1-9]\d{7,14}$/.test(numero || '')) return '';
  return `https://wa.me/${numero}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;
}

export const telLink = (tel: string) => (tel ? `tel:${tel.replace(/[^+\d]/g, '')}` : '');
export const mailLink = (email: string) => (email ? `mailto:${email}` : '');

/** Acción principal del hero: WhatsApp, correo o, si no hay ninguno, la sección de contacto. */
export const mainContact = (d: Content) =>
  waLink(d.contacto.whatsapp, d.contacto.mensajeWhatsapp) || mailLink(d.contacto.email) || '#contacto';
