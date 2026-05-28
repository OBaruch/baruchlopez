# Estado actual del repo

## Resumen

Este repo es un sitio personal/profesional **Astro static-first**. La fuente publica vigente vive en `src/` y `public/`; la raiz conserva una fotografia legacy de la etapa pre-Astro solo como referencia/fallback.

La prioridad tecnica actual es mantener el sitio sobrio, estatico, rapido, documentado y facil de seguir trabajando con Codex.

## Capa publica vigente

Fuente primaria del sitio:

- `src/pages/`: rutas Astro.
- `src/components/`: componentes reutilizables.
- `src/data/`: contenido estructurado local.
- `src/layouts/`: layout base y metadata.
- `src/styles/global.css`: sistema visual global.
- `public/`: imagenes, robots, sitemap, CNAME y assets servidos tal cual.
- `astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`.
- `.github/workflows/deploy.yml`: deploy a GitHub Pages.

## Rutas Astro actuales

- `/`
- `/about/`
- `/experience/`
- `/projects/`
- `/projects/[slug]/`
- `/corporate/`
- `/credentials/`
- `/contact/`
- `/manifesto/`
- `/timeline/`

Tambien existen estas rutas de compatibilidad:

- `/alpha-signature/`: redireccion a `https://alphasignaturefirm.com/`.
- `/cyrus-global-capital/`: redireccion a `https://www.cyrusglobalcapital.com/`.

Estas rutas de compatibilidad deben mantenerse `noindex` mientras las paginas oficiales externas sean la fuente publica principal.

## Implementacion actual

- `src/pages/index.astro`: hub principal.
- `src/layouts/BaseLayout.astro`: shell base, metadata, canonical, Open Graph, Twitter card, noindex y redirects.
- `src/components/SiteHeader.astro`: navegacion principal con soporte para links externos.
- `src/components/SiteFooter.astro`: pie de sitio y enlaces.
- `src/components/PageHero.astro`, `SectionHeader.astro`, `CTASection.astro`, `LinkButton.astro`: bloques base de contenido.
- `src/components/ProjectCard.astro`, `PathwayCard.astro`, `VerticalCard.astro`, `CertificationCard.astro`, `SkillCluster.astro`: tarjetas y agrupadores.
- `src/components/Timeline.astro`: timeline visual.
- `src/data/site.ts`: contenido principal del sitio.
- `src/data/manifesto.ts`: contenido del manifesto.

## Capa legacy conservada

Archivos legacy en raiz:

- `index.html`
- `styles.css`
- `CNAME`

No son la fuente primaria del sitio. Solo deben tocarse por higiene de fallback, por ejemplo para evitar enlaces publicos rotos o inseguros.

## Build y deploy vigentes

- Instalacion: `npm.cmd install`
- Dev local: `npm.cmd run dev`
- Typecheck: `npm.cmd run typecheck`
- Build: `npm.cmd run build`
- Verificacion completa: `npm.cmd run check`
- Output: `dist/`
- Hosting: GitHub Pages
- Dominio: `baruchlopez.com`

GitHub Pages debe usar `Source = GitHub Actions`. El workflow oficial vive en `.github/workflows/deploy.yml`.

## Restricciones tecnicas conocidas

### Alias de prerender en `astro.config.mjs`

El alias a `astro/entrypoints/prerender` es un workaround tecnico para el entorno Windows/OneDrive con la version actual de Astro. No debe quitarse sin validar `npm.cmd run check`.

### Dependencias locales extraneous

Una inspeccion local con `npm.cmd ls --depth=0` mostro paquetes extraneous dentro de `node_modules`. Eso no viene de `package.json`; parece higiene local de instalacion. Si molesta, regenerar `node_modules` con una instalacion limpia.

### Archivos grandes

`src/data/site.ts`, `src/data/manifesto.ts` y `src/styles/global.css` son funcionales pero grandes. Conviene dividirlos en una fase posterior para mejorar mantenibilidad.

## Fuera de alcance para v1

- Migrar a Next.js sin necesidad real.
- Agregar React runtime en portada.
- Agregar UI kit, Tailwind o animaciones pesadas sin justificacion.
- Backend/server runtime.
- Escenas 3D/WebGL o scroll runtimes para la estructura base.

## Lectura recomendada

Para entender el proyecto hoy:

1. `AGENTS.md`
2. `docs/README.md`
3. `docs/tech-stack-audit.md`
4. `docs/project-architecture.md`
5. `docs/development-workflow.md`
6. `docs/public-content-source-of-truth.md`
