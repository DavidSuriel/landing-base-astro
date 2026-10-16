// Pages CMS borra al guardar las claves vacías ("", [], objetos sin datos) y no recorta espacios.
// rellenar(estructura, datos) devuelve los datos con toda la forma de src/content/estructura.json:
// texto ausente = "", lista ausente = [], textos recortados. Lo usan getContent() y el validador.
// Un tipo incorrecto (texto donde va un objeto) se deja tal cual para que el validador lo señale.
const isObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

export function rellenar(molde, datos) {
  if (typeof datos === 'string') return datos.trim();
  if (Array.isArray(molde)) return Array.isArray(datos) ? datos.map((d) => rellenar(undefined, d)) : (datos ?? []);
  if (isObject(molde) || isObject(datos)) {
    if (datos != null && !isObject(datos)) return datos;
    const out = {};
    for (const k of new Set([...Object.keys(molde ?? {}), ...Object.keys(datos ?? {})])) out[k] = rellenar(molde?.[k], datos?.[k]);
    return out;
  }
  return datos ?? molde;
}
