# Visual engagement audit

Fecha: 2026-05-28

## Diagnostico general

La pagina ya tenia una base editorial sobria, consistente y profesional, pero en mobile se sentia demasiado estatica: mucho bloque oscuro, muchas tarjetas con comportamiento similar y algunas imagenes que parecian placeholders o referencias ajenas al sitio.

La oportunidad principal no era hacer que "todo se mueva", sino mejorar la orientacion visual, agregar pequenas recompensas de lectura y reemplazar imagenes que rompian la confianza.

## Primera impresion

Funciona:

- El nombre de Baruch Lopez queda claro en el primer viewport.
- El tono oscuro/editorial se siente serio y premium.
- Los CTAs principales son visibles.

Problemas:

- El hero no mostraba de inmediato el rol financiero publico ni el MBA en progreso.
- La primera pantalla dependia demasiado de texto y botones.
- La navegacion inicial se sentia plana en mobile por falta de iconografia o anclas visuales.

## Jerarquia visual

Funciona:

- H1, H2 y eyebrows crean una estructura clara.
- Las secciones principales estan bien separadas.
- Los CTAs son faciles de detectar.

Problemas:

- Varias tarjetas compartian el mismo peso visual.
- El "Page Guide" parecia una lista funcional, no una pieza de orientacion.
- Las tarjetas de areas centrales tenian imagenes poco alineadas al branding.

## Ritmo narrativo

Funciona:

- El orden Home -> Page Guide -> Pathways -> Core Areas -> Snapshot -> Trajectory es logico.
- La pagina ya se entiende como hub, no como CV plano.

Problemas:

- El scroll no daba suficiente sensacion de avance.
- Faltaban pequenos momentos de recompensa visual entre secciones.
- Algunas imagenes reducian credibilidad porque parecian de otro proyecto.

## Engagement y permanencia

Mejoras necesarias:

- Agregar iconos al Page Guide para aumentar escaneo y orientacion.
- Agregar barra discreta de progreso de lectura.
- Usar reveal por scroll para hacer que las secciones aparezcan con ritmo.
- Hacer que cards y botones respondan de forma mas tactil.
- Reemplazar imagenes por visuales publicos, seguros, neutrales y coherentes con el sitio.

## Riesgos visuales encontrados

- Exceso de oscuridad si no se agregan acentos sutiles.
- Imagenes genericas o ajenas pueden hacer que el sitio parezca template.
- Movimiento excesivo podria dañar el tono ejecutivo.
- Es importante evitar loops, parallax agresivo o gamificacion infantil.

## Recomendaciones principales

1. Mantener el sistema oscuro/editorial.
2. Usar motion solo para entrada, hover y progreso.
3. Reemplazar imagenes ajenas por visuales publicos, seguros, neutrales y coherentes con el sitio.
4. Mostrar CFO y MBA en progreso como badges sobrios en hero.
5. Mantener `prefers-reduced-motion`.
6. No agregar librerias de animacion por ahora.

## Segunda pasada / 2026-05-28

Despues de los ajustes de imagenes, iconos y favicon, la pagina ya se siente mas viva. El punto pendiente era la orientacion inicial: el hero comunicaba identidad, pero no tenia una senal clara de continuidad hacia el Page Guide.

Mejoras aplicadas:

- Scroll cue sobrio en el hero para invitar a explorar sin manipular.
- Marcadores pequenos en encabezados de seccion para reforzar ritmo y escaneo.
- Movimiento limitado a opacity, transform y microinteracciones.
- Sin nuevas dependencias ni scroll runtimes.
