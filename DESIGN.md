# Diseño — completar para cada cliente

Estado: BASE TÉCNICA, no diseño final del cliente.

## Dirección aprobada
- Idea visual y por qué representa a este negocio: [PENDIENTE]
- Referencias (qué tomar y qué evitar): [PENDIENTE]
- Capturas aprobadas: plan/mockups/ (escritorio y móvil).
- Tipografía, colores, espaciado y tratamiento de fotos: [PENDIENTE]
- Traducir tokens a @theme en src/styles/global.css.

## Hero
- Mensaje, CTA y prueba inmediata: [PENDIENTE]
- Imagen, video o 3D y su función: [PENDIENTE]
- Encuadre de escritorio y móvil: [PENDIENTE]
- La base usa object-fit: cover; si necesita foco o medios distintos en móvil, añadir campos al JSON/CMS y probarlos.

## Movimiento
CSS ligero por defecto. Una animación protagonista como máximo inicialmente; ninguna si no ayuda. Los estados hover y focus no cuentan como protagonistas.
- Elemento y propósito: [PENDIENTE]
- Comportamiento con reducción de movimiento: imagen estática, contenido visible.
- Video: sin audio, 6–10 s orientativos, objetivo 2–5 MiB y máximo 8 MiB local. Imagen de respaldo siempre. Pausa accesible.

## Criterios
Legibilidad, CTA visible, contraste, foco de teclado y buena adaptación de 375 px a escritorio. El diseño base no obliga a reutilizar la misma composición para cada cliente.

## Iconos

SVG locales integrados en Astro; sin librería JavaScript ni fuente de iconos. Usa Lucide para iconos de interfaz cuando hagan falta y conserva su licencia. Los logos de redes se incorporan desde recursos de marca autorizados. Conserva nombres visibles y un enlace de texto como fallback para redes nuevas. Los iconos decorativos llevan aria-hidden="true"; un botón sin texto necesita nombre accesible. No instales React ni una librería de iconos para esta base.
