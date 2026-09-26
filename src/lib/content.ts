import raw from '../content/landing.json';
const data = { ...raw, servicios: raw.servicios ?? [], proyectos: raw.proyectos ?? [], redes: raw.redes ?? [] };
export default data;
export const whatsapp = /^\d{8,15}$/.test(data.contacto.whatsapp || '')
  ? `https://wa.me/${data.contacto.whatsapp}?text=${encodeURIComponent(data.contacto.mensajeWhatsapp || '')}` : '';
export const email = data.contacto.email ? `mailto:${data.contacto.email}` : '';
export const mainContact = whatsapp || email || '#contacto';
