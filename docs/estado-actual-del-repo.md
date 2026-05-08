# Estado actual del repo

## Resumen

Este repo ya no esta en fase experimental de motion/3D. El estado vigente es un sitio **Astro static-first**, con HTML pre-renderizado, CSS propio y JavaScript solo donde agrega valor real.

La documentacion de esta carpeta debe leerse con tres niveles:

- **Vigente**: define como funciona hoy el repo y como se publica.
- **Referencia**: sirve para inspiracion, mirrors o planeacion futura, pero no describe lo que ya esta shipping.
- **Archivo**: conserva decisiones descartadas para no reabrirlas por error.

## Capa publica vigente

La fuente primaria del sitio publico vive en:

- `src/`
- `public/`
- `astro.config.mjs`
- `package.json`
- `.github/workflows/deploy.yml`

### Implementacion actual

- `src/pages/index.astro`: homepage principal.
- `src/pages/cyrus-global-capital/index.astro`: bridge/redirect al sitio oficial de Cyrus.
- `src/components/HeroPortal.astro`: hero principal con retrato + gateways.
- `src/data/portal.ts`: contenido estructurado de navegacion, highlights, lab, talks y contacto.
- `src/layouts/BaseLayout.astro`: shell base y metadata principal.
- `src/styles/global.css`: estilos globales del sitio Astro.

### Rutas publicas actuales

Rutas reales que hoy genera Astro:

- `/`
- `/cyrus-global-capital/`

Secciones internas activas en la home:

- `#top`
- `#overview`
- `#selected-highlights`
- `#alpha-signature`
- `#corporate-profile`
- `#personal-project-lab`
- `#talks-writing`
- `#contact`

Importante: `Alpha Signature`, `Corporate Profile`, `Personal Project Lab`, `Talks / Writing` y `Contact` **todavia no existen como rutas Astro separadas**. Hoy viven como secciones de la home.

## Capa legacy conservada

La capa legacy sigue existiendo en la raiz del repo:

- `index.html`
- `styles.css`
- `CNAME`

Esta capa se conserva como **snapshot/fallback de la etapa pre-Astro**. No es la fuente primaria del sitio ni debe usarse como base de nuevas implementaciones.

## Build y deploy vigentes

- Build local: `npm.cmd run build`
- Typecheck: `npm.cmd run typecheck`
- Output: `dist/`
- Hosting: GitHub Pages
- Dominio: `baruchlopez.com`

### Reglas de publicacion

- GitHub Pages debe usar `Source = GitHub Actions`.
- El workflow oficial vive en `.github/workflows/deploy.yml`.
- `public/CNAME` es la fuente principal del custom domain dentro del build Astro.
- `.nojekyll` en raiz y `public/.nojekyll` existen como guardrail para evitar builds Jekyll accidentales.

## Restricciones tecnicas conocidas

### Alias de prerender en `astro.config.mjs`

El alias a `astro/entrypoints/prerender` sigue presente por una razon concreta: con la version bloqueada de Astro en este repo, el build local en Windows/OneDrive falla si se elimina. No debe quitarse sin volver a validar `npm.cmd run build`.

### `spawn EPERM` dentro del sandbox

En este entorno de trabajo, `astro build` puede fallar dentro del sandbox con `spawn EPERM`. Ese error no implica por si solo un problema del repo. El build ya fue validado fuera del sandbox y compila correctamente.

## Fuera de alcance actual

Estas lineas quedan descartadas para la home y para v1:

- React runtime en portada
- fondos 3D simulados
- escenas WebGL/R3F/Three.js
- scroll runtimes tipo Lenis/GSAP
- backend/server runtime
- overlays o effects que compliquen lectura, mantenimiento o deploy

## Como leer el resto de `docs/`

- Si necesitas saber **como funciona hoy el repo**, empieza aqui y sigue con `deploy-github-pages.md` y `propuesta-stack-static-first.md`.
- Si necesitas **mirrors o referencias visuales**, ve a `mirrors.md` y `auditoria-referencias-creativas.md`.
- Si necesitas **planeacion futura**, consulta `arquitectura-portal-y-wireframes.md`, pero tomandolo como documento de exploracion, no como estado implementado.
- Si necesitas entender **decisiones descartadas**, revisa `plan-liquid-glass-command-deck.md`.
