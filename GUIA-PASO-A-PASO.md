# De la plantilla al primer cliente

## A. Subir la plantilla — una sola vez

1. Descomprime files.zip. Abre la carpeta landing-base en tu editor y terminal. package.json debe estar directamente en esa carpeta.
2. Instala Node 24, Git y GitHub CLI si faltan. Autentica tu cuenta: `gh auth login`; comprueba `gh auth status`.
3. Ejecuta `npm ci`, `npm run check` y `npm run build`.
4. Reemplaza TU_USUARIO en los comandos por el propietario correcto. Si ya existe el repo, no lo recrees: usa su remoto.

```bash
git init -b main
git add .
git commit -m "Plantilla Astro estatica v1"
gh repo create TU_USUARIO/landing-base --private --source=. --remote=origin --push
gh repo edit TU_USUARIO/landing-base --template
```

Si Git pide identidad, configura tu nombre y correo de commits. Mantén el repositorio privado inicialmente. No subas node_modules, dist, .env ni credenciales.

Puedes pedir al agente: «Lee AGENTS.md, verifica la plantilla y súbela a TU_USUARIO/landing-base como repositorio privado de plantilla. Está autorizado crear el repo, hacer commit y push. No modifiques mi autenticación ni publiques una web de cliente todavía». El agente requiere tu sesión de GitHub CLI y permisos sobre ese propietario.

## B. Crear el proyecto de un cliente

Desde la carpeta PADRE (fuera de landing-base):

```bash
gh repo create PROPIETARIO/cliente-industrial --template TU_USUARIO/landing-base --private --clone
cd cliente-industrial
npm ci
npm run dev
```

El propietario debe ser una cuenta u organización donde tengas permisos. Acuerda la propiedad con el cliente; preferible que conserve sus cuentas y dominio. Una plantilla crea un proyecto independiente: futuras correcciones de la base no se propagan automáticamente.

## C. Preparar las skills

Dentro del proyecto:

```bash
npx impeccable install
npx skills@latest add mattpocock/skills --skill grill-me --skill grilling
```

Selecciona el agente que usarás y vuelve a abrir su sesión. Revisa que las skills aparezcan. grill-me utiliza grilling; no son dos entrevistas que debas repetir. Los instaladores pueden cambiar: usa su documentación oficial si las opciones difieren. No necesitas instalar todo el catálogo ni crear tu propia skill.

La skill de gh es opcional: el agente puede ejecutar git y gh directamente. Este ZIP no incluye ni instala skills de terceros automáticamente.

## D. Investigar y decidir

1. Llena plan/brief.md con el cliente y sus materiales. Anota hechos confirmados, supuestos y pendientes por separado.
2. Usa grill-me para resolver dudas relevantes; consolida las decisiones en PRODUCT.md.
3. Redacta y aprueba los textos reales. Puedes usar un borrador temporal; al integrarlos, landing.json será la fuente publicada.
4. Si usas `/impeccable init`, indícale que aproveche PRODUCT.md y no repita la entrevista.

Prompt: «Lee plan/brief.md. Ayúdame a resolver solo los vacíos que afecten público, propuesta, CTA, pruebas y alcance. Actualiza PRODUCT.md. No escribas componentes todavía».

## E. Aprobar diseño y recursos

1. En Stitch explora dos direcciones con el mismo contenido real. Elige una; revisa escritorio y móvil.
2. Guarda capturas en plan/mockups y decisiones en DESIGN.md.
3. Planifica el movimiento ahora. CSS/SVG ligero por defecto. Video solo si ayuda a mostrar proceso, escala o atmósfera.
4. Si corresponde, usa Flow después de aprobar la composición. Exporta, comprime y prueba encuadre móvil. Una imagen generada no debe presentarse como un proyecto real.
5. Segunda entrevista solo si quedan contradicciones. Cierra diseño y textos antes del desarrollo detallado.

Prompt: «Compara estas capturas con PRODUCT.md. Detecta problemas de mensaje, jerarquía, móvil y CTA. Actualiza DESIGN.md con lo aprobado, incluido movimiento. No agregues efectos por decoración».

## F. Construir

Prompt: «Lee AGENTS.md, PRODUCT.md y DESIGN.md. Personaliza esta base para el cliente. Integra los textos aprobados en landing.json y conserva el panel sincronizado. Muéstrame hero y una sección para confirmar dirección; después implementa el resto sin detenerte por cada sección. Respeta el stack y comprueba móvil y escritorio».

Usa un agente principal (Claude Code o Codex). La segunda revisión es opcional. Impeccable audit/polish debe corregir hallazgos, no reiniciar un diseño aprobado.

## G. Conectar publicación y panel

1. Sube el proyecto a su repo. En Cloudflare Pages conecta GitHub, selecciona repo y main; build `npm run build`, salida `dist`, NODE_VERSION `24`.
2. Mantén seo.indexar=false durante borradores. Eso evita indexación solicitada, no hace privada una URL. Usa previews sin información confidencial.
3. En https://app.pagescms.org autoriza el repositorio. Pages CMS leerá .pages.yml en la raíz. Configura al cliente como colaborador con el acceso permitido por el servicio.
4. Si hay formulario: configura Web3Forms y variable de compilación antes de activarlo.
5. Configura dominio, actualiza negocio.web a su URL HTTPS final y comprueba DNS y certificado.
6. Tras aprobación, activa seo.indexar y ejecuta `npm run release:check` con la variable del formulario configurada cuando aplique. Haz commit y push a main; verifica el resultado del deploy.

No se requiere un workflow YAML de GitHub Actions. Cloudflare construye la web. El cliente guarda en Pages CMS; este guarda en GitHub y Cloudflare vuelve a publicar. No es instantáneo.

## H. Entregar

- Prueba edición real de texto, nueva imagen y nueva red; espera a ver el deploy.
- Si usa video, prueba reemplazo, portada, pausa y reducción de movimiento.
- Revisa navegador a 375 px y escritorio, foco con teclado, zoom, contraste y enlaces.
- Envía formulario de prueba autorizado y comprueba recepción.
- Entrega ENTREGA-CLIENTE.md personalizado y un video corto usando SU panel.
- Registra quién conserva las cuentas y cómo recuperar accesos. Explica qué mantenimiento técnico futuro no cubre el CMS.
