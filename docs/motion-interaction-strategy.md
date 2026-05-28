# Motion interaction strategy

Fecha: 2026-05-28

## Principios

- La animacion debe apoyar lectura, no competir con ella.
- El movimiento debe ser escaso, suave y coherente.
- Los efectos deben ser reversibles, rapidos y ligeros.
- La pagina debe funcionar sin JavaScript.
- Todo debe respetar `prefers-reduced-motion`.

## Donde usar animacion

- Entrada inicial del hero y bloques principales.
- Reveal por scroll en secciones y cards.
- Hover/focus de botones.
- Hover/focus de tarjetas.
- Barra de progreso de lectura.
- Pequena respuesta de iconos en el Page Guide.
- Scroll cue del hero como invitacion discreta a continuar.

## Donde no usar animacion

- Texto largo mientras se esta leyendo.
- Loops infinitos en zonas de contenido.
- Parallax agresivo.
- Scroll hijacking.
- Popups, confetti, sonidos o efectos de urgencia.
- Animaciones que oculten informacion critica.
- Indicadores persistentes que compitan con el contenido despues del primer viewport.

## Duraciones recomendadas

- Reveal de secciones: 650ms a 760ms.
- Microinteracciones de hover: 180ms a 260ms.
- Escala de imagen en cards: 500ms a 650ms.
- Progreso de lectura: respuesta casi inmediata, 100ms a 140ms.

## Easing

Easing principal:

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

Este easing da sensacion premium porque sale rapido y llega suave sin rebote exagerado.

## Reglas de hover

- Mover maximo 2px a 3px.
- Evitar sombras masivas.
- Usar borde, brillo o escala minima como feedback.
- No depender solo del color.
- Mantener focus visible para teclado.

## Reglas de scroll reveal

- Usar `IntersectionObserver`.
- Aplicar una sola vez por elemento.
- Animar `opacity` y `transform`.
- No animar layout, width, height, top o left.
- No ocultar contenido si JavaScript esta deshabilitado.

## Reglas mobile

- No aumentar la altura de cards por animaciones.
- No retrasar contenido esencial.
- Mantener targets tactiles amplios.
- Reducir efectos a opacity/transform.
- Evitar blur o filtros pesados en scroll.

## Reduced motion

Con `prefers-reduced-motion: reduce`:

- Sin scroll smooth.
- Sin reveal animado.
- Sin transiciones largas.
- El contenido aparece visible inmediatamente.
- El scroll cue deja de animarse por la regla global de reduced motion.

## Dependencias

No se agrego Framer Motion, GSAP, Lenis ni otra libreria. CSS nativo + JavaScript pequeno cubren la necesidad actual.
