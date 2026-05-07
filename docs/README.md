# Docs

Esta carpeta concentra la documentacion operativa del repo y el tracking de trabajo.

## Objetivo

Separar la documentacion de proyecto, mirrors y tooling del sitio publico estatico. El sitio publicado debe seguir siendo simple; `docs/` sirve para registrar contexto, decisiones y referencias sin mezclar ese material con la capa publica.

Nota: `context/` es una carpeta local-only y esta ignorada por Git para no publicar mirrors, capturas ni material pesado en el repositorio publico.

## Indice

- `preview-local.md`: comando de una sola linea para levantar Astro en un puerto poco comun libre y abrirlo en el navegador.
- `mirrors.md`: inventario completo de mirrors y paginas scrapeadas.
- `arquitectura-portal-y-wireframes.md`: arquitectura de informacion, sitemap, wireframes textuales y modelo de contenido con placeholders `{dummie text}`.
- `auditoria-referencias-creativas.md`: analisis comparativo de referencias visuales/interactivas scrapeadas y descomposicion de features.
- `plan-liquid-glass-command-deck.md`: nota de archivo del experimento descartado de Hero con runtime visual complejo.
- `propuesta-stack-static-first.md`: propuesta vigente para mantener el sitio en Astro SSG con CSS propio y enhancement puntual.
- `tracking.md`: bitacora de trabajo, cambios recientes, decisiones y backlog.

## Regla de trabajo

Cada vez que se agregue un nuevo mirror, se ajuste el scraper o se tome una decision de estructura del repo, se debe actualizar esta carpeta para mantener trazabilidad.
