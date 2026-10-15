# Diseño — completar para cada cliente

Estado: BASE TÉCNICA, no diseño final del cliente. El diseño base solo comprueba conexiones: cada landing debe tener su propia dirección.

## Dirección vigente
Esta sección es la única que manda. Si la dirección cambia, **reescríbela** y anota el cambio en «Historial».

- Idea visual y por qué representa a este negocio: [PENDIENTE]
- Referencias (qué tomar y qué evitar): [PENDIENTE]
- Capturas aprobadas: plan/mockups/ (escritorio y móvil).
- Tipografía (fuentes con la API `fonts` de Astro, ver astro.config.mjs): [PENDIENTE]
- Colores y contraste (un acento que no llegue a AA no se usa como texto sobre ese fondo): [PENDIENTE]
- Secciones claras/oscuras, espaciado y tratamiento de fotos: [PENDIENTE]
- Traducir tokens a @theme en src/styles/global.css.

## Hero
- Mensaje, CTA y prueba inmediata: [PENDIENTE]
- Medio: imagen / video (HyperFrames o grabado) / 3D / ilustración SVG (anatomy) y su función: [PENDIENTE]
- Encuadre de escritorio y móvil: [PENDIENTE]

## Movimiento
CSS ligero por defecto. Una animación protagonista como máximo; ninguna si no ayuda. Hover y focus no cuentan.
- Elemento y propósito: [PENDIENTE]
- Con reducción de movimiento: imagen estática, contenido visible.
- Video: sin audio, 6–10 s orientativos, 2–5 MiB (máximo 8 MiB local). Imagen de respaldo siempre. Pausa accesible.

## Criterios de aceptación (medibles)
- CTA principal visible sin scroll a 375 × 667.
- Sin scroll horizontal de 320 px a 1440 px.
- Foco visible en todos los controles; todo usable con teclado.
- Funciona sin JS (enlaces de contacto), sin WebGL y con movimiento reducido.
- Saltos de ancla (menú y botón flotante) quedan bajo la barra, también en móvil.
- Lighthouse móvil ≥ 90 en rendimiento y accesibilidad (SEO bajo con `indexar=false` es esperado).

## Historial
Una línea por cambio (fecha, qué se descartó, por qué).
