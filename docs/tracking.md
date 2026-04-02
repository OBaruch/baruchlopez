# Tracking del proyecto

## Estado actual

El repo tiene dos frentes separados:

- Sitio publico estatico: una pagina simple en `index.html` + `styles.css`, lista para GitHub Pages.
- Biblioteca de referencia privada dentro del repo: mirrors en `context/` y tooling de scraping en `scripts/mirror/`.

La prioridad inmediata sigue siendo mantener el sitio principal simple y publicable. Los mirrors se estan usando para analizar referencias visuales y tecnicas para etapas posteriores.

## Registro

| Fecha | Cambio | Archivos / carpetas |
| --- | --- | --- |
| 2026-04-02 | Captura del mirror de `www.igloo.inc` con screenshots, estados WebGL/canvas, assets y resumen de dominio. | `context/www.igloo.inc` |
| 2026-04-02 | Reorganizacion del tooling de scraping en un modulo independiente. | `scripts/mirror/` |
| 2026-04-02 | Creacion de documentacion de mirrors, indice de paginas scrapeadas y tracking del proyecto. | `README.md`, `docs/`, `context/README.md`, `scripts/mirror/README.md` |

## Decisiones vigentes

- El sitio publico debe seguir siendo estatico y minimalista hasta que haya una razon fuerte para introducir frameworks o build steps.
- `context/` no se borra: funciona como archivo de referencia y banco de material.
- El scraping/mirroring queda aislado en `scripts/mirror/` para no contaminar la raiz del sitio publico.
- Los mirrors no se usan como contenido publico final; se usan como ejemplos para extraer referencias de UX, layout, motion, sistemas visuales y stacks tecnicos.

## Backlog propuesto

- Extraer patrones visuales reutilizables desde `context/www.igloo.inc` y `context/www.valentincheval.design`.
- Definir una primera direccion visual propia para la siguiente version de `baruchlopez.com` sin perder la simplicidad de despliegue.
- Crear un documento de benchmark comparando referencias por navegacion, motion, tipografia, composicion y tratamiento 3D.
- Evaluar si conviene mantener una version estatica pura o migrar mas adelante a un build ligero cuando el contenido y las interacciones crezcan.
