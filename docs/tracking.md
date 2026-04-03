# Tracking del proyecto

## Estado actual

El repo tiene dos frentes separados:

- Sitio publico estatico: una pagina simple en `index.html` + `styles.css`, lista para GitHub Pages.
- Biblioteca de referencia privada dentro del repo: mirrors en `context/` y tooling de scraping en `scripts/mirror/`.

La prioridad inmediata sigue siendo mantener el sitio principal simple y publicable. Los mirrors se estan usando para analizar referencias visuales y tecnicas para etapas posteriores.

## Registro

| Fecha | Cambio | Archivos / carpetas |
| --- | --- | --- |
| 2026-04-03 | Migracion inicial del sitio a Astro SSG + React islands con Hero Liquid Glass Command Deck, escena R3F diferida, Lenis/GSAP runtime, Zustand y workflow GitHub Pages. | `src/`, `public/`, `astro.config.mjs`, `package.json`, `.github/workflows/deploy.yml`, `docs/plan-liquid-glass-command-deck.md` |
| 2026-04-02 | Documentacion de arquitectura estructural del portal, navegacion, wireframes textuales, modelo de metadata y reglas de placeholders `{dummie text}`. | `docs/arquitectura-portal-y-wireframes.md`, `docs/README.md` |
| 2026-04-02 | Auditoria comparativa de referencias scrapeadas y descomposicion tecnica de features, motion, 3D, scroll y riesgos. | `docs/auditoria-referencias-creativas.md`, `context/` |
| 2026-04-02 | Definicion de propuesta de stack static-first y arquitectura evolutiva para una futura version premium de `baruchlopez.com`. | `docs/propuesta-stack-static-first.md`, `docs/README.md` |
| 2026-04-02 | Captura del mirror de `www.igloo.inc` con screenshots, estados WebGL/canvas, assets y resumen de dominio. | `context/www.igloo.inc` |
| 2026-04-02 | Reorganizacion del tooling de scraping en un modulo independiente. | `scripts/mirror/` |
| 2026-04-02 | Creacion de documentacion de mirrors, indice de paginas scrapeadas y tracking del proyecto. | `README.md`, `docs/`, `context/README.md`, `scripts/mirror/README.md` |

## Decisiones vigentes

- El sitio publico ya migro a un modelo Astro static build + React islands, pero debe seguir siendo static-first y sin backend/server runtime en v1.
- `context/` no se borra: funciona como archivo de referencia y banco de material.
- El scraping/mirroring queda aislado en `scripts/mirror/` para no contaminar la raiz del sitio publico.
- Los mirrors no se usan como contenido publico final; se usan como ejemplos para extraer referencias de UX, layout, motion, sistemas visuales y stacks tecnicos.
- Para una futura version avanzada, la direccion recomendada es Astro SSG + React islands + TypeScript + Tailwind/CSS Modules + GSAP + Lenis + Three/R3F + Zustand, manteniendo GitHub Pages como objetivo de v1.
- El Hero/Core Domains puede usar `liquid-glass-react` solo como enhancement client-side; el SSR debe conservar fallback glass propio porque Safari/Firefox tienen soporte parcial y el paquete no es SSR-safe de forma directa en este entorno.
- Las referencias mas adecuadas como norte arquitectonico inicial son `www.valentincheval.design` y `www.onestudios.nl`; `www.zolviz.xyz` y `www.igloo.inc` deben tratarse como laboratorio experimental, no como base de v1.
- La estructura de informacion objetivo pasa a ser un portal jerarquico: Home como hub, Cyrus/Alpha como puertas explicitas, Corporate Profile como capa formal segura, Personal Project Lab como archivo filtrable y Talks/Writing como expansion publica.
- `Cyrus Global Capital` debe operar como gateway/redirect hacia `https://www.cyrusglobalcapital.com/`, no como una pagina interna larga duplicada.

## Backlog propuesto

- Revisar visualmente la primera pantalla del nuevo Hero Astro/React y ajustar crop, jerarquia tipografica, deformacion liquid-glass y peso de la escena 3D.
- Extraer un primer sistema de tokens visuales propio tomando referencias de `context/www.valentincheval.design`, `context/www.onestudios.nl` y el concept board local.
- Convertir Alpha Signature, Corporate Profile, Personal Project Lab y Talks/Writing a rutas Astro separadas, manteniendo `Home` como hub.
- Diseñar la arquitectura de metadata estatica del Lab para filtros client-side sin backend.
