# Módulo opcional: hero con modelo 3D

Úsalo solo en el cliente que lo necesite. La plantilla base no instala three.js.

## Reglas de carga (ya implementadas en Hero3D.astro)

- **El titular es el LCP.** El 3D nunca bloquea el primer pantallazo: se importa tras la primera interacción (mover el puntero, scroll, tecla, toque), en tiempo libre (`requestIdleCallback`) y solo con el hero a la vista.
- **Se descarta** (queda la portada y three.js no se descarga) con: celular o puntero táctil, movimiento reducido, ahorro de datos, sin WebGL2, `deviceMemory < 4` o menos de 4 núcleos.
- **Vigilante de fps:** si en los primeros 2 s con el hero visible no llega a 30 fps, se apaga y vuelve la portada.
- **Pausa fuera de pantalla** con `IntersectionObserver`.
- **Respaldo con renders reales** del modelo (webp, ~10–20 KB), no un SVG plano: la portada debe parecerse a lo que verá quien sí tiene 3D.
- Si el modelo falla al cargar, queda la portada.

## Activarlo en un proyecto de cliente

1. Instala three (solo en ese proyecto):
   ```bash
   npm i three
   npm i -D @types/three
   ```
2. Copia `modulos/hero-3d/Hero3D.astro` a `src/components/Hero3D.astro`.
3. Coloca el modelo en `public/modelos/hero.glb`. Objetivo: menos de 2–3 MB. Reduce polígonos en Blender (Decimate) antes de exportar.
4. En `src/components/Landing.astro`: importa `Hero3D` y cambia `<Hero />` por `<Hero><Hero3D /></Hero>`. No hace falta tocar Hero.astro, el CMS ni el validador.
5. Sube como imagen de portada (`hero.imagen`) un render del mismo modelo: es el respaldo.
6. `npm run check`, `npm run build`; prueba escritorio, celular, movimiento reducido y CPU lenta (DevTools › Performance › 4x).

Prompt: «Activa el módulo modulos/hero-3d siguiendo su README. El modelo está en public/modelos/hero.glb».

## De dónde sale el modelo

- **Blender** (piezas propias, más acabado): exporta GLB con piezas nombradas.
- **Tripo / Meshy** (objetos realistas): descarga GLB y redúcelo en Blender. Uso comercial requiere plan pagado.
- **img2threejs** (desde una foto, en código): produce una función TypeScript que devuelve un `THREE.Group`. Reemplaza la carga con `GLTFLoader` por esa función.

Si el objetivo es **explicar** cómo funciona algo (piezas, flujo, capas) y no lucir un producto, considera antes una ilustración SVG con la skill `anatomy` (ver GUIA-PASO-A-PASO.md › Skills): pesa menos, no necesita WebGL y se ve igual en celular.

## El cliente

No cambia el modelo desde Pages CMS. Puede cambiar textos y la imagen de portada. Cambiar el modelo es un trabajo técnico.
