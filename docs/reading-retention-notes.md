# Reading retention notes

Fecha: 2026-05-28

## Problemas de lectura detectados

- El sitio ya tenia buen contenido, pero muchas secciones compartian el mismo ritmo visual.
- En mobile, el Page Guide se sentia largo porque cada item era texto sobre texto.
- El hero no mostraba de inmediato algunas senales importantes: CFO y MBA en progreso.
- Las imagenes de areas centrales no ayudaban suficiente a entender cada capa profesional.

## Bloques densos

Bloques a vigilar:

- Page Guide en mobile.
- Executive Snapshot.
- Timeline cuando se ve como lista compacta.
- Project cards si se agregan mas tecnologias o notas.

## Jerarquias debiles

La jerarquia principal funciona, pero necesitaba mas anclas visuales:

- Iconos pequenos para rutas.
- Badges del hero.
- Assets visuales propios por area.
- Indicador de progreso para orientar al usuario en paginas largas.

## Frases que conviene destacar

Ya se destacaron como badges:

- AI Engineer II
- Co-Founder & CFO / Cyrus Global Capital
- MBA in progress

Frases que pueden convertirse en callouts en otro ciclo:

- Robotics engineer and AI specialist.
- Systems-minded way of working.
- Public-safe corporate context.
- Consulting and implementation layer.

## Secciones que podrian dividirse

- `src/data/site.ts` podria dividirse en contenido de home, experiencia, proyectos, credenciales y contacto.
- Si el manifesto sigue creciendo, conviene conservar su experiencia de lectura separada y no mezclarlo con la home.

## Ideas para aumentar permanencia sin manipulacion

- Usar el scroll cue del hero como invitacion inicial, no como insistencia.
- Agregar una mini navegacion contextual por seccion solo si el contenido crece mas.
- Agregar micro-resumen al final de Project Lab.
- Incluir iconos tecnicos pequenos en cards de proyectos si no saturan.
- Agregar capturas reales de proyectos solo cuando sean publicas y seguras.

## Lo que debe evitarse

- Gamificacion infantil.
- Contadores o metricas no verificadas.
- Claims de impacto no confirmados.
- Animaciones que retrasen la lectura.
- Imagenes de stock que parezcan de otra marca.
