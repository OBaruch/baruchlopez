# Tracking del proyecto

## Estado actual

El repo tiene dos capas claras:

- Sitio publico estatico en Astro: `src/`, `public/`, `astro.config.mjs`, `package.json` y workflow de deploy.
- Snapshot legacy de referencia: `index.html`, `styles.css` y `CNAME` en raiz.

La prioridad vigente es mantener ambas capas simples, coherentes y faciles de publicar, sin runtime visual innecesario.

## Registro

| Fecha | Cambio | Archivos / carpetas |
| --- | --- | --- |
| 2026-05-07 | Limpieza completa del hero: se eliminaron fondos 3D simulados, runtime React/3D huerfano, placeholders basura y documentacion interna obsoleta. | `src/components/HeroPortal.astro`, `src/styles/global.css`, `src/data/portal.ts`, `src/components/react/`, `src/store/`, `index.html`, `styles.css`, `docs/` |
| 2026-04-03 | Migracion inicial del sitio a Astro static build y workflow de GitHub Pages. | `src/`, `public/`, `astro.config.mjs`, `package.json`, `.github/workflows/deploy.yml` |
| 2026-04-02 | Documentacion de arquitectura estructural del portal, navegacion, wireframes textuales y modelo de metadata. | `docs/arquitectura-portal-y-wireframes.md`, `docs/README.md` |
| 2026-04-02 | Auditoria comparativa de referencias scrapeadas y descomposicion tecnica de features, motion y riesgos. | `docs/auditoria-referencias-creativas.md`, `context/` |
| 2026-04-02 | Reorganizacion del tooling de scraping en un modulo independiente. | `scripts/mirror/` |
| 2026-04-02 | Creacion de documentacion de mirrors, indice de paginas scrapeadas y tracking del proyecto. | `README.md`, `docs/`, `scripts/mirror/README.md` |

## Decisiones vigentes

- El sitio publico debe seguir siendo static-first y sin backend/server runtime en v1.
- La home queda sin React, sin Three/WebGL y sin scroll runtime.
- `context/` no se borra: funciona como archivo de referencia y banco de material local.
- El scraping/mirroring queda aislado en `scripts/mirror/` para no contaminar la raiz del sitio publico.
- Los mirrors no se usan como contenido publico final; sirven como referencia de UX, layout y decisiones visuales.
- La estructura de informacion objetivo sigue siendo un portal jerarquico: Home como hub, Cyrus/Alpha como puertas explicitas, Corporate Profile como capa formal segura, Personal Project Lab como archivo curado y Talks/Writing como expansion publica.
- `Cyrus Global Capital` debe operar como gateway/redirect hacia `https://www.cyrusglobalcapital.com/`, no como una pagina interna larga duplicada.

## Backlog propuesto

- Revisar visualmente desktop/mobile del hero simplificado y ajustar detalles de espaciado o crop si hace falta.
- Convertir Alpha Signature, Corporate Profile, Personal Project Lab y Talks/Writing a rutas Astro separadas cuando el contenido este listo.
- Definir metadata estatica del Lab para filtros ligeros client-side solo si la cantidad de proyectos lo justifica.
