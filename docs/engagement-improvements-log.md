# Engagement improvements log

Fecha: 2026-05-28

## Cambios implementados

### Segunda pasada de atencion / 2026-05-28

Se agrego un scroll cue sobrio en el hero y marcadores visuales pequenos en encabezados de seccion.

Justificacion: mejorar orientacion inicial y ritmo de lectura sin agregar efectos pesados, librerias o patrones manipulativos.

### Hero con identidad mas completa

Se agregaron badges visibles para:

- AI Engineer II
- Co-Founder & CFO / Cyrus Global Capital
- MBA in progress

Justificacion: el primer viewport ahora comunica mejor el rango profesional sin alargar el headline.

### Page Guide con iconografia

Se agrego `IconGlyph.astro` y soporte de iconos en `ContextNav.astro`.

Justificacion: el bloque guia deja de sentirse como lista plana y se vuelve mas facil de escanear en mobile.

### Imagenes de areas centrales reemplazadas de nuevo

Las imagenes SVG propias fueron retiradas por solicitud de direccion visual. Se reemplazaron por imagenes publicas neutrales de Unsplash:

- `alpha-architecture-katya-azimova-unsplash.jpg`
- `cyrus-architecture-mike-hindle-unsplash.jpg`
- `corporate-data-eric-stoynov-unsplash.jpg`
- `project-lab-adrian-gonzalez-unsplash.jpg`

Justificacion: mantener solo el retrato de Baruch como imagen personal y usar visuales publicos, artisticos, neutrales y alineados al branding para el resto de tarjetas.

### Motion de lectura

Se agrego:

- Barra superior de progreso de lectura.
- Reveal por scroll con `IntersectionObserver`.
- Microinteracciones en botones.
- Hover sutil en tarjetas e imagenes.

Justificacion: mejorar ritmo, orientacion y sensacion de respuesta sin saturar.

## Archivos modificados

- `src/components/IconGlyph.astro`
- `src/components/ContextNav.astro`
- `src/components/PageHero.astro`
- `src/data/site.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/styles/global.css`
- `public/assets/public-images/alpha-architecture-katya-azimova-unsplash.jpg`
- `public/assets/public-images/cyrus-architecture-mike-hindle-unsplash.jpg`
- `public/assets/public-images/corporate-data-eric-stoynov-unsplash.jpg`
- `public/assets/public-images/project-lab-adrian-gonzalez-unsplash.jpg`
- `docs/public-image-sources.md`

## Animaciones agregadas

- Reveal progresivo por scroll.
- Barra de progreso de lectura.
- Scroll cue del hero.
- Sheen sutil en botones.
- Elevacion/escala minima en cards.
- Respuesta visual en iconos.
- Marcadores visuales en encabezados de seccion.

## Animaciones removidas o reemplazadas

- Se reemplazo el reveal CSS inmediato por una version progresiva con fallback sin JavaScript.

## Riesgos pendientes

- Verificar visualmente en desktop ancho que las nuevas imagenes publicas se sientan suficientemente premium.
- Ajustar color/acento si el conjunto queda demasiado oscuro.
- Optimizar retrato principal en una fase separada.

## Validacion

- `npm.cmd run check` paso correctamente.
- Smoke test en navegador local: hero, badges, iconos, barra de progreso e imagenes publicas cargaron sin errores de consola.
- Mobile 390x844 revisado para hero, Page Guide y Core Areas.

## Siguientes mejoras recomendadas

- Hacer una pasada con capturas desktop/mobile despues de estabilizar contenido.
- Evaluar una version WebP del retrato.
- Revisar si las cards de proyectos necesitan mini-iconos o no; por ahora no es necesario.
