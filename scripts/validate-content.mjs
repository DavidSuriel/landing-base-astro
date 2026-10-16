// Valida src/content/landing.json y cada idioma extra (landing.<código>.json). Con --release exige contenido definitivo.
// Los mensajes están pensados para quien edita en Pages CMS.
// Pages CMS borra las claves vacías al guardar: un texto ausente equivale a "" y una lista ausente a [] (src/lib/normalize.mjs).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { rellenar } from '../src/lib/normalize.mjs';
const release = process.argv.includes('--release');
if (existsSync('.env')) process.loadEnvFile('.env');
const DIR = 'src/content';
const OBJECTS = ['negocio', 'hero', 'secciones', 'contacto', 'seo', 'formulario', 'interfaz'];
const LISTS = ['servicios', 'proyectos', 'marcas', 'redes'];
const files = readdirSync(DIR).filter((f) => /^landing(\.[a-z]{2,3})?\.json$/.test(f)).sort((a, b) => (a === 'landing.json' ? -1 : b === 'landing.json' ? 1 : a.localeCompare(b)));
const errors = [];
const docs = {};
const estructura = JSON.parse(readFileSync(`${DIR}/estructura.json`, 'utf8'));
// Claves que no están en estructura.json: el panel o el JSON tienen un campo que los tipos no conocen.
const extras = (molde, d, p = '') => Object.keys(d).flatMap((k) => (!(k in molde) ? [p + k] : molde[k] && typeof molde[k] === 'object' && !Array.isArray(molde[k]) && d[k] && typeof d[k] === 'object' ? extras(molde[k], d[k], `${p}${k}.`) : []));

for (const file of files) {
  const tag = files.length > 1 ? `[${file}] ` : '';
  const fail = (s) => errors.push(`${tag}${s}`);
  const before = errors.length;
  let d;
  try { d = rellenar(estructura, JSON.parse(readFileSync(`${DIR}/${file}`, 'utf8'))); } catch (e) { fail(`No se pudo leer: ${e.message}`); continue; }
  for (const key of OBJECTS) if (!d[key] || typeof d[key] !== 'object' || Array.isArray(d[key])) fail(`${key} debe ser un grupo de campos.`);
  for (const key of LISTS) if (!Array.isArray(d[key])) fail(`${key} debe ser una lista (puede estar vacía).`);
  for (const p of extras(estructura, d)) fail(`${p} no existe en src/content/estructura.json: añádelo allí (tarea técnica).`);
  const code = file.match(/^landing\.([a-z]{2,3})\.json$/)?.[1];
  if (!d.idioma) fail('Falta idioma (por ejemplo "es").');
  else if (code && d.idioma !== code) fail(`idioma debe ser "${code}", como el nombre del archivo.`);
  if (errors.length > before) continue;
  docs[file] = d;

  const walk = (obj, parent = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const path = parent ? `${parent}.${key}` : key;
      if (value && typeof value === 'object') { walk(value, path); continue; }
      if (typeof value !== 'string' || !value) continue;
      if (release && value.includes('[PENDIENTE]')) fail(`Completar ${path}.`);
      if (['imagen', 'logo', 'foto'].includes(key)) {
        if (!value.startsWith('/src/assets/images/') || value.includes('..') || !existsSync(`.${value}`)) fail(`Imagen inexistente o ruta incorrecta: ${path}`);
        if (release && value.includes('placeholder.svg')) fail(`Reemplazar imagen de ejemplo: ${path}`);
        // Toda foto visible necesita descripción (alt). Logos usan el nombre; la imagen SEO no se muestra.
        if (key !== 'logo' && !path.startsWith('seo.') && !obj.alt) fail(`${parent}: falta la descripción de la imagen (alt).`);
      }
      if (key === 'video') {
        if (!/^\/videos\/[^?#]+\.mp4$/i.test(value) || value.includes('..') || !existsSync(`public${value}`)) fail(`Video local inexistente: ${path}`);
        else if (statSync(`public${value}`).size > 8 * 1024 * 1024) fail('Comprimir el video a menos de 8 MiB antes de subirlo.');
      }
      if (['url', 'web', 'videoExterno', 'enlace'].includes(key)) {
        try { if (new URL(value).protocol !== 'https:') fail(`${path}: usa HTTPS.`); } catch { fail(`${path}: URL inválida.`); }
      }
    }
  };
  walk(d);
  d.marcas.forEach((m, i) => { if (m.logo && !m.nombre) fail(`marcas[${i}]: falta el nombre de la marca (se usa como descripción del logo).`); });
  if (d.contacto.whatsapp && !/^[1-9]\d{7,14}$/.test(d.contacto.whatsapp)) fail('WhatsApp: solo dígitos, código de país incluido.');
  if (d.contacto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contacto.email)) fail('Correo de contacto inválido.');
  if (!['imagen', 'video'].includes(d.hero.modo)) fail('hero.modo debe ser imagen o video.');
  if (d.hero.modo === 'video' && (!d.hero.imagen || !(d.hero.video || d.hero.videoExterno))) fail('El hero de video necesita video y una imagen de portada.');
  if (d.formulario.whatsapp && !d.contacto.whatsapp) fail('Formulario por WhatsApp activo sin número en Contacto.');
  // Sin valor de respaldo en el código: si falta la clave, se detiene aquí con un mensaje claro.
  if (d.formulario.correo && !process.env.PUBLIC_WEB3FORMS_ACCESS_KEY) fail('Formulario por correo activo sin PUBLIC_WEB3FORMS_ACCESS_KEY. Configúrala en .env (local) y en Cloudflare Pages › Settings › Variables, para Production y Preview; luego vuelve a desplegar.');
  if (release) {
    for (const [name, value] of [['nombre', d.negocio.nombre], ['web', d.negocio.web], ['título hero', d.hero.titulo], ['CTA', d.hero.cta], ['título SEO', d.seo.titulo], ['descripción SEO', d.seo.descripcion]]) if (!value) fail(`Falta ${name}.`);
    if (!d.contacto.whatsapp && !d.contacto.email && !d.contacto.telefono) fail('Configurar al menos un contacto real.');
    if (!d.seo.indexar) fail('Activa seo.indexar para la publicación definitiva.');
  }
}

// Idiomas extra: misma cantidad de elementos en cada lista que el principal. Un texto ausente no es diferencia (el CMS lo borra si está vacío).
const shape = (v) => (Array.isArray(v) ? `lista de ${v.length}` : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).map((k) => [k, shape(v[k])])) : 'valor');
const diff = (a, b, path = '') => {
  if (typeof a !== 'object' || typeof b !== 'object') return a === b ? [] : [`${path || '(raíz)'} (${a} / ${b})`];
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => (k in a && k in b ? diff(a[k], b[k], path ? `${path}.${k}` : k) : (a[k] ?? b[k]) === 'valor' ? [] : [path ? `${path}.${k}` : k]));
};
const [main, ...extra] = Object.keys(docs);
for (const file of extra) for (const p of diff(shape(docs[main]), shape(docs[file]))) errors.push(`${main} y ${file} no coinciden en ${p}.`);

if (errors.length) { console.error(errors.map((e) => `- ${e}`).join('\n')); process.exit(1); }
console.log(`Contenido válido: ${Object.keys(docs).join(', ')} (${release ? 'publicación' : 'borrador'}).`);
