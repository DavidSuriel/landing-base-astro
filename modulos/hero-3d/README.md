# Módulo opcional: hero con modelo 3D

Úsalo solo en el cliente que lo necesite. La plantilla base no instala three.js.

## Qué hace

- Muestra un modelo `.glb` en el hero con una entrada suave, giro lento y algo de giro al hacer scroll dentro del hero.
- Pausa el render cuando el hero sale de la pantalla.
- En celular, con movimiento reducido o ahorro de datos, muestra solo la imagen de portada (`hero.imagen`). three.js ni siquiera se descarga.
- Si el modelo falla, queda la imagen de portada.

## Activarlo en un proyecto de cliente

1. Instala three:
   ```bash
   npm i three
   npm i -D @types/three
   ```
2. Copia `modulos/hero-3d/Hero3D.astro` a `src/components/Hero3D.astro`.
3. Coloca el modelo en `public/modelos/hero.glb`. Objetivo: menos de 2–3 MB. Reduce polígonos en Blender (Decimate) antes de exportar.
4. En `src/components/Hero.astro`:
   - importa `Hero3D from './Hero3D.astro'`;
   - si `data.hero.modo === '3d'`, renderiza `<Hero3D />` en lugar del bloque `hero-media` de imagen/video.
5. Agrega `3d` a los valores de `modo` en `.pages.yml` y en la validación de `scripts/validate-content.mjs`.
6. Pon `"modo": "3d"` en `src/content/landing.json` y sube una imagen de portada (render del mismo modelo).
7. Ejecuta `npm run check` y `npm run build`, y prueba en escritorio, en celular y con movimiento reducido.

Prompt para el agente: «Activa el módulo modulos/hero-3d siguiendo su README. El modelo está en public/modelos/hero.glb».

## De dónde sale el modelo

- **Blender** (piezas propias, más acabado): exporta GLB con piezas nombradas.
- **Tripo / Meshy** (objetos realistas): descarga GLB y redúcelo en Blender. Uso comercial requiere plan pagado.
- **img2threejs** (desde una foto, en código): no produce `.glb`, produce una función TypeScript que devuelve un `THREE.Group`. En ese caso, reemplaza en `Hero3D.astro` la carga con `GLTFLoader` por la importación de esa función y usa el grupo como `model`.

Si quieres que el modelo se arme por piezas, pídele al agente que anime las piezas por nombre dentro de `frame()`. Mantén la animación dentro del hero.

## El cliente

El cliente no cambia el modelo desde Pages CMS. Puede cambiar textos y la imagen de portada. Cambiar el modelo es un trabajo técnico.
