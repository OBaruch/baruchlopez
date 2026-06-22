# GAIA-1: Planetary Biological Computing

## Clasificación
- Tipo: Proyecto de IA, investigación, full-stack y experimento creativo.
- Estado: MVP / en progreso.
- Área: Simulación planetaria, señales, neural computing y visualización 3D.
- Empresa/iniciativa relacionada: Cortical Labs / proyecto personal experimental.
- Potencial CV: Alto.
- Potencial portafolio: Alto.
- Riesgo de privacidad: Medio.

## Resumen ejecutivo

Prototipo científico-artístico que codifica señales planetarias sintéticas u opcionalmente reales como estímulos neuronales simulados, decodifica actividad y la representa en una Tierra digital en tiempo real.

## Contexto

Explora una interfaz futura entre datos planetarios, simulación neural y visualización interactiva, con preparación para un posible uso posterior de infraestructura biológica de Cortical Labs.

## Mi participación

Los tres commits están atribuidos a Baruch Lopez. La evidencia confirma autoría Git directa del MVP local. No se verificó integración con hardware biológico real.

***************
| Fecha/Periodo | Evidencia | Evento identificado | Confianza |
|---|---|---|---|
| 16 junio 2026 | Git | Construcción del MVP GAIA-1 | Alto |
| 16 junio 2026 | Git | Hardening del simulador | Alto |
| 18 junio 2026 | Git | Fuentes de datos reales por usuario y panel Settings | Alto |

## Tecnologías usadas
| Tecnología | Uso identificado | Evidencia | Confianza |
|---|---|---|---|
| FastAPI/Python | Backend y streaming | `requirements.txt`, 62 archivos Python | Alto |
| React/Vite/TypeScript | Frontend | `frontend/package.json` | Alto |
| Three.js / React Three Fiber | Tierra digital 3D | Dependencias frontend | Alto |
| Cortical Labs CL SDK | Simulación neural | `cl-sdk` y README | Alto |
| Pytest/HTTPX | Pruebas | Dependencias backend | Alto |

## Arquitectura o estructura técnica

Separa `backend`, `frontend`, `docs`, `scripts` y `artifacts`. El backend expone señales y simulación; el frontend renderiza una experiencia 3D y panel de configuración.

## Entregables encontrados

- Backend FastAPI.
- Frontend 3D.
- Simulación y datasets JSONL.
- Pruebas y scripts.
- Documentación del MVP.

## Impacto o valor profesional

Demuestra capacidad para combinar APIs, simulación, visualización 3D y framing de investigación. No hay evidencia de validación científica ni despliegue en neuronas reales.

## Complejidad técnica

Alta por integración de dominios: ingestión de señales, codificación/decodificación, tiempo real, frontend 3D y abstracción para hardware futuro.

## Relevancia para CV

Proyecto flagship para IA experimental, prototipado rápido, FastAPI, React/Three.js y comunicación de ideas de frontera.

## Posibles bullets para CV

- Construyó un MVP full-stack que transforma señales planetarias en actividad neural simulada y visualización 3D en tiempo real.
- Integró FastAPI, React, Three.js y el simulador del CL SDK en una arquitectura extensible.
- Añadió fuentes de datos configurables y controles por usuario para evolucionar de señales sintéticas a fuentes reales.

## Posible historia STAR para entrevista
### Situation
Una idea de computación biológica planetaria requería un prototipo demostrable sin hardware biológico real.
### Task
Diseñar una arquitectura simulada, visual y extensible.
### Action
Construyó backend, frontend 3D, simulación, pruebas y configuración de fuentes.
### Result
MVP funcional documentado; validación científica y hardware real permanecen como siguientes fases.

## Evidencia encontrada
| Evidencia | Ruta original | Tipo | Qué demuestra | Confianza |
|---|---|---|---|---|
| README | `***************` | Markdown | Propósito y límites | Alto |
| Git log | Repo local | Git | Autoría y fechas | Alto |
| Manifests | `frontend\package.json`, `backend\requirements.txt` | Código | Stack exacto | Alto |

## Riesgos de privacidad

***************

## Open points

- Confirmar demo desplegada.
- Confirmar cobertura de pruebas y resultados de simulación.
- No describir como sistema biológico real hasta contar con evidencia.

