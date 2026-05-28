# Tracking del proyecto

## Estado actual

El repo tiene dos capas claras:

- Sitio publico estatico en Astro: `src/`, `public/`, `astro.config.mjs`, `package.json` y workflow de deploy.
- Snapshot legacy de referencia: `index.html`, `styles.css` y `CNAME` en raiz.

La prioridad vigente es mantener ambas capas simples, coherentes y faciles de publicar, sin runtime visual innecesario.

## Registro

| Fecha | Cambio | Archivos / carpetas |
| --- | --- | --- |
| 2026-05-27 | Auditoria tecnica de stack, Codex-readiness y documentacion operativa. Se agrego `check`, se documentaron rutas reales y se retiraron archivos muertos confirmados. | `AGENTS.md`, `package.json`, `.env.example`, `docs/`, `src/components/HeroPortal.astro`, `src/data/portal.ts` |
| 2026-05-07 | Auditoria y alineacion documental del repo: se agregaron documentos source-of-truth para estado actual y deploy, se reclasifico `docs/` por vigencia/referencia/archivo y se marcaron documentos exploratorios para que no se lean como implementacion actual. | `docs/README.md`, `docs/estado-actual-del-repo.md`, `docs/deploy-github-pages.md`, `docs/propuesta-stack-static-first.md`, `docs/arquitectura-portal-y-wireframes.md`, `docs/auditoria-referencias-creativas.md`, `docs/mirrors.md` |
| 2026-05-07 | Limpieza del deploy: se audito `astro.config.mjs` y se dejo solo el alias minimo necesario para que el build local no falle en Windows, se actualizo el workflow de Pages a las majors vigentes de Astro/checkout, se agregaron guardrails `.nojekyll` y se recorto el README para alinearlo con la arquitectura real. | `astro.config.mjs`, `.github/workflows/deploy.yml`, `.nojekyll`, `public/.nojekyll`, `README.md` |
| 2026-05-07 | Limpieza completa del hero: se eliminaron fondos 3D simulados, runtime React/3D huerfano, placeholders basura y documentacion interna obsoleta. | `src/components/HeroPortal.astro`, `src/styles/global.css`, `src/data/portal.ts`, `src/components/react/`, `src/store/`, `index.html`, `styles.css`, `docs/` |
| 2026-04-03 | Migracion inicial del sitio a Astro static build y workflow de GitHub Pages. | `src/`, `public/`, `astro.config.mjs`, `package.json`, `.github/workflows/deploy.yml` |
| 2026-04-02 | Documentacion de arquitectura estructural del portal, navegacion, wireframes textuales y modelo de metadata. | `docs/arquitectura-portal-y-wireframes.md`, `docs/README.md` |
| 2026-04-02 | Auditoria comparativa de referencias scrapeadas y descomposicion tecnica de features, motion y riesgos. | `docs/auditoria-referencias-creativas.md`, `context/` |
| 2026-04-02 | Reorganizacion del tooling de scraping en un modulo independiente. | `scripts/mirror/` |
| 2026-04-02 | Creacion de documentacion de mirrors, indice de paginas scrapeadas y tracking del proyecto. | `README.md`, `docs/`, `scripts/mirror/README.md` |

## Decisiones vigentes

- El sitio publico debe seguir siendo static-first y sin backend/server runtime en v1.
- La home queda sin React, sin Three/WebGL y sin scroll runtime.
- GitHub Pages debe quedar configurado con `Source = GitHub Actions`; el snapshot root no debe ser la via primaria de deploy.
- `context/` no se borra: funciona como archivo de referencia y banco de material local.
- El scraping/mirroring queda aislado en `scripts/mirror/` para no contaminar la raiz del sitio publico.
- Los mirrors no se usan como contenido publico final; sirven como referencia de UX, layout y decisiones visuales.
- La estructura de informacion vigente es un hub personal/profesional con rutas Astro separadas para about, experience, projects, corporate, credentials, contact, manifesto y timeline.
- Alpha Signature y Cyrus deben apuntar directamente a sus sitios oficiales desde CTAs publicos.
- Las rutas internas `/alpha-signature/` y `/cyrus-global-capital/` son redirects de compatibilidad y deben mantenerse `noindex`.
- `Cyrus Global Capital` debe operar como gateway/redirect hacia `https://www.cyrusglobalcapital.com/`, no como una pagina interna larga duplicada.

## Backlog propuesto

- Revisar visualmente desktop/mobile despues de cambios grandes de contenido o layout.
- Verificar en GitHub `Settings > Pages` que la fuente de publicacion quede en `GitHub Actions` y no en `Deploy from a branch`.
- Optimizar imagenes grandes en `public/assets/images/`.
- Dividir `src/data/site.ts` y `src/styles/global.css` si siguen creciendo.
- Definir metadata estatica del Lab para filtros ligeros client-side solo si la cantidad de proyectos lo justifica.
