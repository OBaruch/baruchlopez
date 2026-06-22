# Comprensión de Código Legacy con IA (Hackathon)

> Proyecto de hackathon corporativo. Contenido anonimizado.

## Resumen
Motor de IA para **explicar código legacy y recomendar cómo modernizarlo**, orientado a evitar la pérdida de lógica de negocio en migraciones. Combina **análisis estático del código** (AST/CFG/call graph) con **RAG** y **LLMs**, y una capa de **verificación *grounded*** (cada afirmación cita líneas de código + score de confianza).

## Contexto
- Reto: la comprensión —no la conversión— es el cuello de botella real en la modernización de sistemas legacy.
- Enfoque diferenciador: **trust-first / anti-alucinación** (atribución de evidencia, model-agnostic).

## Mi participación
**Desarrollo del codebase y la ingeniería de prompts.** A partir de inputs iniciales del equipo (un script base y un par de documentos de ideas de **compañeros**), desarrollé el grueso de la implementación y aporté mejoras propias de arquitectura y prompting.

## Tecnologías usadas
- **LLMs (model-agnostic)**, **RAG** (embeddings + vector store).
- **Parsing/análisis estático:** AST, control-flow graph, call graph (vía herramientas de parsing de código).
- **Python** (orquestación del pipeline).
- Ingesta de repos AI-friendly; salida estructurada con atribución de spans y score de confianza.

## Actividades realizadas
- Diseño del **pipeline de 4 etapas** (Parse & Analyze → Index & Retrieve (RAG) → Grounded Reasoning → Verify & Render).
- Implementación del codebase del MVP y de los prompts.
- Definición de diferenciadores (verificable, multi-persona dev/negocio, portable).

## Impacto
- Propuesta técnica madura y diferenciada para modernización de legacy.
- Aplicación de patrones avanzados de IA (RAG grounded, atribución de evidencia).

## Complejidad técnica
Alta a nivel de diseño: combina análisis estático de código, RAG sobre código, orquestación de LLM y verificación con atribución — un sistema anti-alucinación no trivial.

## Habilidades / bullets para CV
- Co-diseñé y **desarrollé el codebase** de un motor de **comprensión de código legacy** con RAG, parsing/AST y verificación *grounded* (citas + score de confianza).
- Apliqué **ingeniería de prompts avanzada** (Chain-of-Thought, Tree of Thoughts, DSPy como referencia) en un enfoque model-agnostic.
