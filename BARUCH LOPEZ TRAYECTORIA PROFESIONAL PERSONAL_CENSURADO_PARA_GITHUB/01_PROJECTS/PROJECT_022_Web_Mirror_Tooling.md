# Tooling para mirror e inventario de sitios web

## Clasificación
- Tipo: Proyecto de automatización, scraping y documentación web.
- Estado: POC / herramienta interna.
- Área: Web archiving y análisis de assets.
- Empresa/iniciativa relacionada: Carpeta `hackathon`.
- Potencial CV: Medio-alto.
- Potencial portafolio: Medio.
- Riesgo de privacidad: Medio.

## Resumen ejecutivo

Conjunto de scripts Node.js para copiar un sitio, reescribir enlaces, descargar assets CSS e inventariar un mirror local utilizado como contexto de marca.

## Contexto

La carpeta contiene un mirror amplio de un sitio corporativo y herramientas propias de soporte.

## Mi participación

No hay Git en la carpeta. La ubicación y metadata sugieren creación/uso local, pero autoría queda por confirmar.

***************
| Fecha/Periodo | Evidencia | Evento identificado | Confianza |
|---|---|---|---|
| 26 marzo 2026 | Metadata | Creación de cuatro scripts de tooling | Medio-alto |

## Tecnologías usadas
| Tecnología | Uso identificado | Evidencia | Confianza |
|---|---|---|---|
| Node.js/JavaScript | Mirroring e inventario | Scripts `.mjs` | Alto |
| HTML/CSS/assets | Contenido procesado | Mirror | Alto |

## Arquitectura o estructura técnica

`context\brand_guide_web\mirror` contiene el sitio copiado y `tools` contiene cuatro utilidades.

## Entregables encontrados

- `mirror_site.mjs`.
- `inventory_mirror.mjs`.
- `rewrite_mirror_links.mjs`.
- `fetch_css_assets.mjs`.

## Impacto o valor profesional

Demuestra capacidad de extraer contexto web y construir tooling reusable. El propósito final del hackathon no quedó documentado.

## Complejidad técnica

Media por manejo de URLs, assets y reescritura.

## Relevancia para CV

Puede presentarse como tooling de research/competitive analysis, sin atribuir contenido del sitio original.

## Posibles bullets para CV

- Construyó utilidades Node.js para mirror, reescritura de enlaces e inventario de assets web.
- Preparó contexto local reproducible para análisis de marca y prototipado.

## Posible historia STAR para entrevista
### Situation
Se necesitaba analizar un sitio como referencia sin depender de navegación manual.
### Task
Crear un mirror navegable e inventariable.
### Action
Desarrolló scripts especializados.
### Result
Mirror local creado; uso en hackathon por confirmar.

## Evidencia encontrada
| Evidencia | Ruta original | Tipo | Qué demuestra | Confianza |
|---|---|---|---|---|
| Scripts `.mjs` | `***************` | Código | Tooling | Alto |

## Riesgos de privacidad

El mirror puede contener contenido y datos de terceros. No copiar ni publicar assets.

## Open points

- Confirmar hackathon, equipo y producto resultante.

