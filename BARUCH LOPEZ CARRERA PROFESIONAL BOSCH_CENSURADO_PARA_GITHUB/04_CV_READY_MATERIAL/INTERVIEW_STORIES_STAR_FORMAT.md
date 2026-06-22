# Historias para Entrevista (STAR) — público

> Anonimizadas (sin clientes/sistemas/métricas internas).

## STAR 1 — Plataforma de IA de comercio exterior (ownership + GenAI)
- **S:** Un cliente externo necesitaba automatizar la conciliación de comercio exterior; el proceso tardaba meses y un enfoque heredado con LLM era costoso y propenso a errores.
- **T:** Entregar una plataforma confiable, trazable y eficiente en costo.
- **A:** Desarrollé una API en Python/FastAPI sobre Azure y **rediseñé el motor de conciliación a un proceso 100% determinístico**, con procesamiento por lotes y un catálogo de errores; gestioné CI/CD por sprints.
- **R:** Proceso reducido **de meses a semanas** y **costo de IA prácticamente nulo**.

## STAR 2 — Plataforma de analítica/presupuesto de planta (data engineering end-to-end)
- **S:** El presupuesto y los KPIs de una planta dependían de procesos manuales sobre SAP y datos de producción.
- **T:** Construir una plataforma de datos automatizada y gobernada.
- **A:** Diseñé la cadena completa: SAP/data-lake → ETL (Alteryx/Python + RPA) → SQL Server → Power BI, con una *master table*, gestión segura de credenciales y runbooks.
- **R:** Presupuesto **en producción** y cockpits operativos; **ahorro de cientos de horas/mes**.

## STAR 3 — Hackathon de recomendación de ventas (resultado + GenAI)
- **S:** Un cliente del sector bebidas necesitaba ayudar a su fuerza de ventas de ruta a vender de forma proactiva.
- **T:** Construir, en 24 horas, una solución que recomendara y explicara.
- **A:** Desarrollé el codebase y la capa de IA (prompts + enriquecimiento contextual).
- **R:** **1er lugar** del hackathon.

## STAR 4 — Liderazgo en visión por computadora
- **S:** Reto interno de detectar vehículos en imágenes de dron.
- **T:** Organizar y liderar al equipo y entregar modelos.
- **A:** Propuse participar, conseguí infraestructura GPU e implementé el pipeline (Detectron2/YOLOv5-OBB).
- **R:** Modelos entrenados; **primera experiencia de liderazgo técnico**.

## STAR 5 — Un PoC que no se implementó (criterio)
- **S:** Mi manager me asignó un PoC de detección de anomalías en compras.
- **T:** Explorar si se podían detectar patrones con los datos disponibles.
- **A:** Construí notebooks con clustering y reducción de dimensionalidad; descubrí que otro equipo ya hacía algo más estándar.
- **R:** Lo dejé documentado como **PoC** y evité duplicar esfuerzo.
