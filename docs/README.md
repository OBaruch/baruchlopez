# Docs

Esta carpeta concentra la documentacion operativa del repo, auditorias, decisiones tecnicas, trazabilidad de contenido y material de referencia que no debe mezclarse con la capa publica del sitio.

## Objetivo

Mantener separada la capa publica estatica del contexto de trabajo. El sitio publicado debe seguir siendo simple; `docs/` sirve para registrar decisiones, riesgos, pendientes y reglas para continuar el proyecto con Codex sin perder contexto.

Nota: `context/` es una carpeta local-only e ignorada por Git. No debe publicarse porque puede contener mirrors, capturas, prompts, raw extracts y material pesado o sensible.

## Como leer esta carpeta

La documentacion se divide en tres estados:

- **Vigente**: describe arquitectura, stack, deploy, operacion, contenido y reglas reales del repo hoy.
- **Referencia**: conserva analisis, mirrors o planeacion futura que puede inspirar cambios, pero no siempre describe el estado actual.
- **Archivo**: documenta experimentos descartados para no reintroducir deuda tecnica.

## Indice operativo

### Vigente

- `estado-actual-del-repo.md`: estado actual del sitio, capas del repo, rutas reales y restricciones tecnicas.
- `tech-stack-audit.md`: auditoria del stack, dependencias, complejidad y recomendacion tecnica.
- `project-architecture.md`: estructura actual, estructura recomendada y convenciones de trabajo.
- `codex-operating-guide.md`: reglas operativas para futuras sesiones de Codex.
- `development-workflow.md`: instalacion, comandos, build, preview y despliegue.
- `technical-todos.md`: pendientes tecnicos priorizados.
- `change-log-codex.md`: bitacora tecnica de cambios hechos por Codex.
- `visual-engagement-audit.md`: auditoria de atencion visual, ritmo y engagement.
- `motion-interaction-strategy.md`: reglas de animacion e interaccion para el sitio.
- `engagement-improvements-log.md`: cambios visuales/motion implementados y riesgos.
- `reading-retention-notes.md`: notas para mejorar lectura y permanencia sin manipulacion.
- `public-image-sources.md`: fuentes, autores y licencia de imagenes publicas usadas.
- `content-audit-production-readiness.md`: auditoria editorial, UX, SEO y SEM del contenido publico.
- `public-content-source-of-truth.md`: hechos publicos usados, hechos no publicables y naming pendiente.
- `content-todos.md`: pendientes de contenido, enlaces, proyectos e imagenes.
- `deploy-github-pages.md`: configuracion correcta de GitHub Pages y troubleshooting.
- `propuesta-stack-static-first.md`: principios de arquitectura static-first vigentes.
- `tracking.md`: bitacora historica y backlog.
- `preview-local.md`: forma recomendada de correr el sitio en local.

### Referencia

- `mirrors.md`: inventario de mirrors y paginas scrapeadas.
- `auditoria-referencias-creativas.md`: benchmark visual/interactivo; no es plan de implementacion obligatorio.
- `arquitectura-portal-y-wireframes.md`: arquitectura exploratoria de informacion; validar antes de aplicar.

### Archivo

- `plan-liquid-glass-command-deck.md`: nota del experimento descartado de hero con runtime visual complejo.

## Regla de trabajo

Cada cambio relevante de arquitectura, stack, contenido publico, deploy, scraper o convencion de Codex debe quedar documentado aqui. Si una fuente o hecho no es verificable, no debe convertirse en copy publico sin confirmacion.
