# Plataforma de IA de Automatización de Comercio Exterior

> Proyecto para **un cliente externo (bajo NDA)**. Contenido anonimizado.

## Resumen
Plataforma de software con IA que **automatiza la conciliación de pedimentos y los descargos de inventario** de comercio exterior (régimen IMMEX / Anexo 24) en México. Se expone como **API web (FastAPI) sobre Azure**, integrada con **un sistema interno de gestión de pedimentos** del cliente.

## Contexto
- Dominio: comercio exterior mexicano (control de inventarios; descargo de materia prima importada temporalmente contra producto terminado exportado; conciliación de pedimentos).
- Modelo de trabajo: desarrollo/consultoría de tecnología para **un cliente externo**; la herramienta está pensada para que el cliente la use con sus propios clientes.

## Mi participación
**Desarrollador / AI Engineer** del backend: endpoints, motores de conciliación, integración de datos, pruebas, documentación y despliegue (CI/CD por sprints). Trabajé con **un arquitecto de soluciones y otros compañeros**.

## 🔑 Logro de ingeniería
El enfoque heredado usaba un **LLM** para conciliar (recibía dos tablas y producía un JSON "a su criterio"): **costoso, complejo y propenso a errores**. Lo **rediseñé/reemplacé por un motor de conciliación 100% determinístico**, llevando el **costo de IA a prácticamente nulo** y haciendo el resultado **trazable y reproducible**.

## Tecnologías usadas
- **Python**, **FastAPI**, **Gunicorn + Uvicorn (ASGI)**.
- **Azure App Service** (hosting) y **Azure DevOps** (repos, sprints, CI/CD).
- Arquitectura **multi-tenant**; **SQLite**; **pytest**; **Swagger/OpenAPI**.
- IA/LLM (Azure OpenAI / Anthropic Claude) como **opción**, no como motor de producción.
- Integración con **un sistema interno de pedimentos** y con **un datamart interno que replica datos de SAP**.

## Actividades realizadas
- Diseño de endpoints de conciliación y descargos (modalidades estándar de Anexo 24).
- Motor de conciliación **determinístico** versionado, con reglas de negocio finas.
- **Catálogo extenso de errores/warnings** para trazabilidad y detección de problemas originados *upstream*.
- Procesamiento **por lotes** (rangos de fecha, **cientos de transacciones por ejecución**).
- Gestión DevOps (despliegue, configuración de servidor, sprints).

## Impacto
- **Reducción del tiempo del proceso de negocio de meses a semanas**; conciliaciones que tardaban días ahora se ejecutan en minutos.
- **Costo de IA prácticamente nulo** tras el rediseño determinístico.
- **Trazabilidad y auditabilidad** vía catálogo de errores.
- Usuarios: **un equipo reducido** del cliente.

## Complejidad técnica
Alta: dominio regulatorio complejo, motor de conciliación con reglas de negocio sutiles, arquitectura multi-tenant, integración con sistemas externos/empresariales y despliegue cloud con CI/CD.

## Habilidades / bullets para CV
- Diseñé y puse en producción una **API en Python/FastAPI sobre Azure** para automatizar conciliación de comercio exterior (IMMEX/Anexo 24).
- **Rediseñé un motor de IA basado en LLM a uno determinístico**, reduciendo el costo de IA a ~nulo y el tiempo del proceso de **meses a semanas**, con procesamiento por lotes y catálogo de errores para trazabilidad.
- Gestioné el ciclo DevOps (CI/CD, sprints) e integré sistemas empresariales (datos SAP vía datamart interno).
