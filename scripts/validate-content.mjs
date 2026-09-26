import { readFileSync, existsSync, statSync } from 'node:fs';
const d = JSON.parse(readFileSync('src/content/landing.json', 'utf8'));
const release = process.argv.includes('--release');
const errors = [];
const fail = (s) => errors.push(s);
for (const key of ['negocio','hero','secciones','contacto','seo','formulario','interfaz']) {
  if (!d[key] || typeof d[key] !== 'object') fail(`Falta el objeto ${key}. Guarda el contenido completo desde el panel.`);
}
for (const key of ['servicios','proyectos','redes']) {
  d[key] ??= [];
  if (!Array.isArray(d[key])) fail(`${key} debe ser una lista (puede estar vacía).`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
const walk = (obj, parent = '') => {
  for (const [key, value] of Object.entries(obj)) {
    const path = parent ? `${parent}.${key}` : key;
    if (value && typeof value === 'object') { walk(value, path); continue; }
    if (typeof value !== 'string' || !value) continue;
    if (release && value.includes('[PENDIENTE]')) fail(`Completar ${path}.`);
    if (['imagen','logo','foto'].includes(key)) {
      if (!value.startsWith('/src/assets/images/') || value.includes('..') || !existsSync(`.${value}`)) fail(`Imagen inexistente o ruta incorrecta: ${path}`);
      if (release && value.includes('placeholder.svg')) fail(`Reemplazar imagen de ejemplo: ${path}`);
    }
    if (key === 'video') {
      if (!/^\/videos\/[^?#]+\.mp4$/i.test(value) || value.includes('..') || !existsSync(`public${value}`)) fail(`Video local inexistente: ${path}`);
      else if (statSync(`public${value}`).size > 8 * 1024 * 1024) fail('Comprimir el video a menos de 8 MiB antes de subirlo.');
    }
    if (['url','web','videoExterno'].includes(key)) {
      try { if (new URL(value).protocol !== 'https:') fail(`${path}: usa HTTPS.`); } catch { fail(`${path}: URL inválida.`); }
    }
  }
};
walk(d);
if (d.contacto.whatsapp && !/^[1-9]\d{7,14}$/.test(d.contacto.whatsapp)) fail('WhatsApp: solo dígitos, código de país incluido.');
if (d.contacto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contacto.email)) fail('Correo de contacto inválido.');
if (!['imagen','video'].includes(d.hero.modo)) fail('hero.modo debe ser imagen o video.');
if (d.hero.modo === 'video' && (!d.hero.imagen || !(d.hero.video || d.hero.videoExterno))) fail('El hero de video necesita video y una imagen de portada.');
if (release) {
  for (const [name,value] of [['nombre',d.negocio.nombre],['web',d.negocio.web],['título hero',d.hero.titulo],['CTA',d.hero.cta],['título SEO',d.seo.titulo],['descripción SEO',d.seo.descripcion]]) if (!value) fail(`Falta ${name}.`);
  if (!d.contacto.whatsapp && !d.contacto.email && !d.contacto.telefono) fail('Configurar al menos un contacto real.');
  if (!d.seo.indexar) fail('Activa seo.indexar para la publicación definitiva.');
}
if (errors.length) { console.error(errors.map(e => `- ${e}`).join('\n')); process.exit(1); }
console.log(`Contenido válido (${release ? 'publicación' : 'borrador'}).`);
