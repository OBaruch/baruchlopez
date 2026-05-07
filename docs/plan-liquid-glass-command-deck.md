# Nota de archivo: Hero experimental descartado

## Estado

El experimento de Hero con `liquid-glass`, runtime cliente y capa 3D fue descartado el **2026-05-07**.

## Motivo

- Sobrecargaba la primera pantalla.
- Introducia una implementacion paralela en React que ya no formaba parte del build principal.
- Complicaba mantenimiento, auditoria y lectura del repo sin mejorar la claridad del sitio.

## Direccion actual

- Hero estatico en Astro.
- Retrato + copy + gateways como estructura principal.
- CSS sobrio, sin fondos 3D simulados ni runtime de scroll.
- Cualquier enhancement futuro debe justificarse por utilidad real, no por novelty visual.
