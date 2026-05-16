# Docs

Esta carpeta concentra la documentacion operativa del repo, el tracking de trabajo y el material de referencia que no debe mezclarse con la capa publica del sitio.

## Objetivo

Separar la documentacion de proyecto, mirrors y tooling del sitio publico estatico. El sitio publicado debe seguir siendo simple; `docs/` sirve para registrar contexto, decisiones y referencias sin mezclar ese material con la capa publica.

Nota: `context/` es una carpeta local-only y esta ignorada por Git para no publicar mirrors, capturas ni material pesado en el repositorio publico.

## Como leer esta carpeta

La documentacion se divide en tres estados:

- **Vigente**: describe la arquitectura, el deploy y la operacion real del repo hoy.
- **Referencia**: conserva analisis, mirrors o planeacion futura.
- **Archivo**: documenta experimentos descartados para no reintroducir deuda tecnica.

## Indice operativo

### Vigente

- `estado-actual-del-repo.md`: source of truth del estado actual del sitio, capas del repo, rutas reales y restricciones tecnicas vigentes.
- `deploy-github-pages.md`: configuracion correcta de GitHub Pages, workflow actual y troubleshooting del conflicto Astro vs Jekyll legacy.
- `propuesta-stack-static-first.md`: principios de arquitectura vigentes para mantener el sitio lean y static-first.
- `tracking.md`: bitacora de trabajo, decisiones recientes y backlog.
- `preview-local.md`: inicio oficial del sitio en local con `npm.cmd run dev -- --port 43127`.

### Referencia

- `mirrors.md`: inventario completo de mirrors y paginas scrapeadas.
- `auditoria-referencias-creativas.md`: analisis comparativo de referencias visuales/interactivas. Sirve como benchmark, no como plan de implementacion vigente.
- `arquitectura-portal-y-wireframes.md`: arquitectura de informacion y modelo de contenido exploratorio para futuras rutas, con placeholders de contenido pendiente.

### Archivo

- `plan-liquid-glass-command-deck.md`: nota de archivo del experimento descartado de Hero con runtime visual complejo.

## Regla de trabajo

Cada vez que se agregue un nuevo mirror, se ajuste el scraper o se tome una decision de estructura del repo, se debe actualizar esta carpeta para mantener trazabilidad.
