# Automatización de Presupuesto y Controlling de Planta

> Contenido anonimizado. Cliente interno: **una planta de manufactura de Bosch (México)**.

## Resumen
Solución end-to-end de **automatización de planeación financiera y controlling de planta**: **presupuesto diario**, **carga de escenarios**, **cierre mensual y de año**, costo de fallas y entregas. Construida sobre **ETL (Alteryx/Python + RPA)**, **SQL Server** y **Power BI**, con documentación, runbooks y capacitación a usuarios.

## Contexto
Proceso de controlling/finanzas de planta (presupuesto, actuals, escenarios con ajuste por tipo de cambio, cierres periódicos), antes manual/disperso sobre datos de SAP y producción.

## Mi participación
**Owner técnico** de extremo a extremo: diseñé la cadena completa de datos, **publiqué los workflows** (con scheduling y gestión segura de credenciales) y **autoré los runbooks**. Trabajé con **el equipo de datos y los controllers de la planta**.

## Tecnologías usadas
- **Alteryx** (ETL/workflows; publicación y scheduling), **RPA** (bots de automatización), **Python**.
- **SQL Server** (capa gobernada), **Power BI** (modelado estrella, DAX, Power Query M).
- Integración con **SAP** (reportes estándar de costos/producción), **un data lake corporativo** y **una herramienta de planeación financiera (OLAP)**.
- Gobierno: gestión de tickets/SLA, control de cambios e incidentes.

## Actividades realizadas
- Cadena: **SAP + data lake → ETL (Alteryx/Python + RPA) → SQL Server → Power BI**.
- Procesos: **Daily** / **Cierre Mensual** / **Carga de Escenarios** / **Cierre de Año**.
- Quality gates (validaciones de datos), normalización, runbooks, change/incident management.
- Documentación técnica y capacitación (tutoriales, workshops).

## Impacto
- **Automatización y estandarización** del proceso de presupuesto/cierre, **en producción**.
- **Ahorro de cientos de horas/mes** y habilitación de usuarios (menos dependencia de soporte).
- Trazabilidad y gobierno (DataOps).

## Complejidad técnica
Alta: orquestación de múltiples workflows con lógica financiera (escenarios, FX, actuals), modelo dimensional en Power BI, integración multi-fuente (SAP/data-lake/OLAP) y prácticas DataOps.

## Habilidades / bullets para CV
- **Owner técnico** de la automatización del **presupuesto y cockpits de una planta de manufactura**: de SAP/data-lake → ETL (Alteryx/RPA) → SQL Server → Power BI, **en producción**, ahorrando **cientos de horas/mes**.
- Apliqué **prácticas DataOps** (scheduling, quality gates, gestión de credenciales, runbooks, change/incident management).
