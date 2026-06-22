# Motor de Recomendación de Ventas con IA (Hackathon — 1er Lugar) 🏆

> Proyecto de hackathon para **un cliente externo del sector bebidas (bajo NDA)**. Contenido anonimizado.

## Resumen
Motor de **recomendación de ventas explicable con IA** que ayuda a un **vendedor de ruta** a pasar de "tomar pedido" a **recomendar proactivamente qué vender** en cada punto de venta y momento, **explicando el porqué** con GenAI. Se expone como **API REST** con backend y **app móvil**. **Ganó el 1er lugar** del hackathon.

## Contexto
Reto: el vendedor tiene poco tiempo por cliente y vende de forma reactiva; la solución entrega recomendaciones accionables y explicables. Desarrollado en **~24 horas**.

## Mi participación
**Desarrollo del codebase y la capa de IA** (prompts para generar insights inteligentes a partir de los datos), con asistentes de codificación (Claude/Codex). Trabajé con **dos compañeros** (uno hizo estudio de mercado y otro el análisis determinístico de ventas y métricas).

## Tecnologías usadas
- **LLM / GenAI** (capa explicativa), **Python**, **SQLite**, **API REST**, **app móvil (Next.js)**.
- **Enriquecimiento multi-fuente:** clima, eventos, puntos de interés/relevancia por ubicación, etc. (**170+ data points** de endpoints públicos).

## Actividades realizadas
- Diseño e implementación del backend de recomendación (reglas + scoring + GenAI explicativo).
- Integración de collectors de enriquecimiento (clima/eventos/ubicación).
- Generación de insights combinando datos cuantitativos + contexto + IA.

## Impacto
- **1er lugar** del hackathon. PoC funcional de recomendación de ventas explicable para fuerza de ventas de ruta.

## Complejidad técnica
Media-alta: reglas de negocio + scoring multi-fuente + enriquecimiento externo + GenAI explicativo en una API REST, en un plazo de 24 horas.

## Habilidades / bullets para CV
- **Gané el 1er lugar** en un hackathon corporativo desarrollando un **motor de recomendación de ventas con IA** (Python/SQLite/REST + app móvil) con **GenAI explicativo** y enriquecimiento de 170+ data points (clima/eventos/ubicación).
