# Change log Codex

## 2026-06-22 / Selector de bienvenida multilingüe

### Resumen

Se agregó un popup de primera visita con bienvenida y pregunta en español, inglés, francés, alemán y portugués. El visitante elige entre `Español` y `English`; la selección se aplica al sistema bilingüe existente y se recuerda mediante `localStorage` y cookie.

### Archivos modificados

- `src/components/LanguageWelcome.astro`
- `src/i18n/config.ts`
- `src/i18n/runtime.ts`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `docs/change-log-codex.md`

### Decisiones técnicas

- Mantener Astro estático y JavaScript de mejora progresiva.
- No agregar dependencias.
- Mostrar el selector una sola vez por navegador y conservar el selector EN/ES del encabezado.
- Mantener el contenido multilingüe del popup fuera de la traducción automática.
- Bloquear temporalmente el contenido de fondo con `inert` mientras el diálogo está abierto.

### Validación

- `npm.cmd run check` pasó correctamente y Astro generó 18 páginas.
- Prueba automatizada en Chromium a 1440 × 1000 y 390 × 844.
- Se verificaron los cinco saludos, las cinco preguntas y exactamente dos botones.
- `Español` aplicó `lang="es"`, tradujo la navegación y persistió tras recargar.
- `English` aplicó `lang="en"`, restauró la navegación en inglés y persistió tras recargar.
- No hubo desbordamiento horizontal ni excepciones de JavaScript.

## 2026-05-28 / Public Guidance Cleanup

### Resumen

Se removieron los bloques visibles de guia interna tipo `PUBLIC-SAFE GUIDANCE` de Timeline, Corporate y Projects. La cautela editorial queda integrada como copy natural en vez de mostrarse como listas operativas para el visitante.

### Archivos modificados

- `src/pages/timeline/index.astro`
- `src/pages/corporate/index.astro`
- `src/pages/projects/index.astro`
- `src/data/site.ts`
- `src/styles/global.css`
- `src/components/SafeDisclosure.astro`
- `docs/content-audit-production-readiness.md`
- `docs/estado-actual-del-repo.md`
- `docs/change-log-codex.md`

### Validacion

`npm.cmd run check` paso correctamente. No quedan referencias en `src/` a `PUBLIC-SAFE GUIDANCE`, `SafeDisclosure` ni `projects-boundaries`.

## 2026-05-28 / Hero Badge Update

### Resumen

Se agrego `Founder / Alpha Signature` como primer badge del hero para reforzar desde el inicio la relacion entre Baruch y Alpha Signature.

### Archivos modificados

- `src/data/site.ts`
- `docs/public-content-source-of-truth.md`
- `docs/change-log-codex.md`

### Validacion

`npm.cmd run check` paso correctamente.

## 2026-05-28 / Favicon

### Resumen

Se reemplazo el favicon implicito/default por un monograma SVG mas elegante y alineado al branding oscuro del sitio.

### Archivos modificados

- `public/favicon.svg`
- `src/layouts/BaseLayout.astro`

### Resultado

`npm.cmd run check` paso correctamente. El favicon queda enlazado desde el layout base.

### Follow-up Page Guide

Se pulieron los iconos SVG profesionales del Page Guide con aro interno, acento lateral y chevron sutil. No se usan emojis.

### Segunda pasada de engagement

Se agrego un scroll cue sobrio al hero y marcadores pequenos en encabezados de seccion para mejorar orientacion y ritmo de lectura. No se agregaron dependencias.

Validacion: `npm.cmd run check` paso correctamente.

Smoke local: `http://localhost:4321/` respondio 200 y el HTML incluye `hero-scroll-cue`, `/favicon.svg` y `data-site-progress`.

## 2026-05-28

### Resumen

Pasada de engagement visual, motion ligero y atencion lectora para hacer la home mas viva sin cambiar el stack ni agregar dependencias.

### Archivos modificados

- `src/components/IconGlyph.astro`
- `src/components/ContextNav.astro`
- `src/components/PageHero.astro`
- `src/data/site.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/styles/global.css`
- `public/assets/public-images/alpha-architecture-katya-azimova-unsplash.jpg`
- `public/assets/public-images/cyrus-architecture-mike-hindle-unsplash.jpg`
- `public/assets/public-images/corporate-data-eric-stoynov-unsplash.jpg`
- `public/assets/public-images/project-lab-adrian-gonzalez-unsplash.jpg`
- `docs/public-image-sources.md`
- `docs/visual-engagement-audit.md`
- `docs/motion-interaction-strategy.md`
- `docs/engagement-improvements-log.md`
- `docs/reading-retention-notes.md`
- `docs/README.md`

### Decisiones tecnicas

- No se agregaron librerias de animacion.
- Se uso CSS nativo, SVG propio e `IntersectionObserver`.
- El contenido permanece visible sin JavaScript.
- Se respeta `prefers-reduced-motion`.
- Las imagenes no personales se reemplazaron por fuentes publicas de Unsplash documentadas.
- La capa anterior `public/assets/concept-board/` fue removida.

### Dependencias agregadas o removidas

Ninguna.

### Comandos ejecutados

- `rg --files src public docs`
- `rg -n "ContextNav|context-nav|pathways|visual|image|img|portrait|CFO|MBA|Co-Founder|Alpha Signature|Cyrus Global Capital|Corporate / Bosch|Projects and experiments" src`
- `npm.cmd run typecheck`
- `npm.cmd run check`
- Browser smoke test en `http://localhost:4321/`
- Mobile viewport smoke test en 390x844

### Resultado

`npm.cmd run check` paso correctamente. Astro genero 17 paginas en `dist/`.

Nota: el build mostro el warning interno no bloqueante de Vite/Astro sobre imports no usados en `astro/dist/assets/utils/index.js`.

### Resultado de preview local

La home cargo correctamente en navegador local. Se verificaron los badges del hero, los seis iconos del Page Guide, los cuatro nuevos assets publicos de Core Areas, la barra de progreso y ausencia de errores de consola.

### Follow-up de imagenes publicas

Por direccion de contenido, se retiraron todas las imagenes no personales anteriores y se dejo el retrato de Baruch como unica imagen personal. Las tarjetas de Core Areas ahora usan imagenes publicas de Unsplash documentadas en `docs/public-image-sources.md`.

Validacion adicional:

- `npm.cmd run check` paso correctamente despues del reemplazo.
- Browser smoke test confirmo que no quedan referencias activas a `public/assets/concept-board/`.
- Las cuatro imagenes publicas cargaron correctamente al hacer scroll hasta Core Areas.

## 2026-05-29

### Mural de Reconocimientos

Se agrego una nueva seccion publica y ruta `/recognitions/` para mostrar un mural visual, cronologico e interactivo de reconocimientos, certificados y premios publicables.

Archivos principales agregados:

- `scripts/recognitions/process_recognitions.py`
- `src/data/recognitions.ts`
- `src/components/RecognitionCard.astro`
- `src/pages/recognitions/index.astro`
- `data/recognitions.json`
- `docs/recognitions-inventory.md`
- `docs/recognitions-duplicates-report.md`
- `docs/recognitions-processing-log.md`
- `docs/recognitions-pending-review.md`
- `public/recognitions/*.webp`

Archivos modificados:

- `src/pages/index.astro`
- `src/data/site.ts`
- `src/styles/global.css`
- `public/sitemap.xml`

Decisiones:

- Mantener Astro static-first y usar data local tipada en `src/data/recognitions.ts`.
- Separar el registro maestro interno con rutas locales en `data/recognitions.json` de la data publica usada por Astro.
- No publicar rutas locales, PDFs originales ni enlaces a documentos fuente.
- Publicar solo documentos con preview optimizada, metadatos razonables y sin banderas de privacidad.
- Excluir del mural publico documentos con CURP/RFC/domicilio/codigos escolares/Global ID, OCR dudoso o contenido administrativo.

Herramientas usadas:

- PyMuPDF para extraccion/render de PDF.
- Pillow para hashes visuales y previews WebP.
- Tesseract OCR 5.5 instalado con `winget`.
- Modelo OCR en espanol descargado en `C:\tmp\tessdata\spa.traineddata`.

Dependencias npm agregadas:

Ninguna.

Validacion:

- `npm.cmd run check` paso correctamente.
- Chrome headless reviso `/recognitions/` en desktop y mobile.
- Se corrigio un problema responsive donde el hero largo del mural recortaba texto en viewport movil.

## 2026-05-27

### Resumen

Auditoria tecnica y limpieza controlada de infraestructura para dejar el proyecto mas claro, mantenible y preparado para futuras sesiones de Codex.

### Archivos modificados

- `.env.example`
- `AGENTS.md`
- `package.json`
- `docs/README.md`
- `docs/estado-actual-del-repo.md`
- `docs/preview-local.md`
- `docs/propuesta-stack-static-first.md`
- `docs/tech-stack-audit.md`
- `docs/project-architecture.md`
- `docs/codex-operating-guide.md`
- `docs/development-workflow.md`
- `docs/technical-todos.md`
- `docs/change-log-codex.md`

### Archivos eliminados

- `src/components/HeroPortal.astro`
- `src/data/portal.ts`

Motivo: no tenian referencias activas dentro de `src/` y la documentacion que los presentaba como vigentes estaba obsoleta.

### Decisiones tecnicas

- Mantener Astro static-first como stack principal.
- No migrar a Next.js, React, Tailwind, UI kits ni runtime cliente.
- Agregar un script `check` para facilitar verificacion completa.
- Mantener las rutas `/alpha-signature/` y `/cyrus-global-capital/` como redirects de compatibilidad.
- Reforzar la regla de que los CTAs publicos de Alpha Signature y Cyrus deben apuntar a sus sitios oficiales.
- Documentar el uso de `.env.example` como referencia de tooling local, no como requisito del build.

### Dependencias agregadas o removidas

Ninguna dependencia fue agregada o removida.

### Comandos ejecutados

- `rg --files`
- `rg -n "HeroPortal|portal\\.ts|gatewayItems|data/portal" src docs AGENTS.md package.json`
- `npm.cmd ls --depth=0`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `npm.cmd run check`
- `npm.cmd run dev -- --port 4322`
- Browser smoke test en `http://localhost:4322/`

### Resultado del build

`npm.cmd run check` paso correctamente despues de la limpieza tecnica. Astro genero 17 paginas en `dist/`.

Nota: el build mostro un warning interno de Vite/Astro sobre imports no usados en `astro/dist/assets/utils/index.js`. No bloqueo el build.

### Resultado de preview local

El sitio cargo correctamente en navegador local. El `<h1>` de la home es `Baruch Lopez`, el titulo de documento cargo y los enlaces oficiales a Alpha Signature y Cyrus aparecen en la home. No se detectaron errores de consola en el smoke test.

### Riesgos pendientes

- Confirmar con un build final que la eliminacion de archivos muertos no afecto rutas.
- Optimizar imagen principal pesada.
- Decidir si conviene agregar lint/formato.
- Dividir `src/data/site.ts` y `src/styles/global.css` en una fase posterior.
