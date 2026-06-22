# Plataforma de Cockpits de KPIs de Planta (Power BI)

> Contenido anonimizado. Cliente interno: **una planta de manufactura de Bosch (México)**.

## Resumen
Plataforma de **Power BI** que centraliza los **KPIs operativos de una planta** (desempeño/piezas, productividad, utilización, eficiencia de herramientas, costo de personal, headcount, seguridad, activos en construcción) en un conjunto de reportes, alimentada por **ETL hacia SQL Server** desde múltiples fuentes.

## Mi participación
**Lado de datos:** investigación en **un datamart interno que replica datos de SAP**, extracción, **arquitectura y modelado de datos, estructura de base de datos, relaciones y auditoría** de correctitud; alimentación de múltiples dashboards y workflows de ETL. Trabajé con **una compañera** (visualización).

## Tecnologías usadas
- **Power BI** (modelo dimensional + Power Query M), **SQL Server**, **ETL (Alteryx/Python)**.
- Fuentes: **SAP** (piezas/horas/productividad), **un datamart interno (réplica de SAP)**, **una herramienta de planeación financiera (OLAP)**.
- **Master table** (mapeo organizacional: centro de costo → planta) como modelo de referencia.

## Actividades realizadas
- Diseño/mantenimiento de los **flujos ETL** multi-fuente → SQL Server.
- Modelado de datos (master table, relaciones) y auditoría de correctitud.
- Soporte a la app Power BI de cockpits.

## Impacto
- **Visibilidad unificada** del desempeño de planta para decisiones operativas (cientos de centros de costo).
- Estandarización de KPIs.

## Complejidad técnica
Alta: integración ETL de múltiples fuentes heterogéneas (SAP/datamart/OLAP) en un modelo gobernado en SQL Server, con modelo dimensional y app Power BI multi-reporte.

## Habilidades / bullets para CV
- Diseñé los **procesos ETL (multi-fuente → SQL Server)** y el **modelo de datos** de una plataforma Power BI de **cockpits de KPIs de planta**, con auditoría de datos y una *master table* de referencia.
