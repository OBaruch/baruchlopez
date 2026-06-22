# Ardilla — Experimento Apache Airflow

## Clasificación
- Tipo: Proyecto de automatización y datos.
- Estado: Experimento.
- Área: Orquestación de workflows.
- Empresa/iniciativa relacionada: Proyecto personal.
- Potencial CV: Medio.
- Potencial portafolio: Bajo.
- Riesgo de privacidad: Bajo.

## Resumen ejecutivo

Experimento local con DAGs de Apache Airflow: uno con `PythonOperator`, requests y pandas programado cada hora; otro con `BashOperator` diario.

## Contexto

Parece ser un laboratorio de aprendizaje de orquestación. La mayoría de archivos son logs generados.

## Mi participación

No hay Git ni autoría explícita. La ubicación sugiere uso personal, pero queda por confirmar.

***************
| Fecha/Periodo | Evidencia | Evento identificado | Confianza |
|---|---|---|---|
| Febrero 2023 | Logs y metadata | Ejecuciones locales | Medio-alto |

## Tecnologías usadas
| Tecnología | Uso identificado | Evidencia | Confianza |
|---|---|---|---|
| Apache Airflow | DAGs y scheduling | Código | Alto |
| Python/pandas/requests | Tarea de datos | Imports | Alto |
| BashOperator | Automatización shell | Código | Alto |

## Arquitectura o estructura técnica

Dos DAGs y logs del scheduler.

## Entregables encontrados

- `dag1.py`.
- `dagtest.py`.
- Logs de ejecución.

## Impacto o valor profesional

***************

## Complejidad técnica

Baja.

## Relevancia para CV

Registrar como exposición o uso básico.

## Posibles bullets para CV

- Configuró DAGs de aprendizaje en Apache Airflow con operadores Python y Bash.

## Posible historia STAR para entrevista
### Situation
Se buscaba entender scheduling y operadores.
### Task
Crear DAGs simples.
### Action
Implementó tareas y frecuencias.
### Result
Ejecuciones locales registradas.

## Evidencia encontrada
| Evidencia | Ruta original | Tipo | Qué demuestra | Confianza |
|---|---|---|---|---|
| DAGs | `***************` | Python | Uso de Airflow | Alto |

## Riesgos de privacidad

Bajo.

## Open points

- Confirmar objetivo de `dag1.py` y fuente consultada.

