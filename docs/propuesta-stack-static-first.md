# Propuesta de stack static-first

## Tesis

La direccion correcta para este repo es **Astro SSG + CSS propio + contenido estatico**, desplegado en **GitHub Pages** y con JavaScript solo como enhancement puntual cuando exista una necesidad real.

La home no necesita runtime visual complejo. La prioridad es claridad, mantenimiento simple, buen HTML base y una experiencia consistente en desktop y mobile.

## Stack recomendado

| Capa | Decision |
| --- | --- |
| Framework | Astro en modo SSG |
| Lenguaje | TypeScript solo para el proyecto Astro |
| Styling | CSS global + custom properties |
| Interactividad | Progressive enhancement puntual, sin depender de React en la home |
| Contenido y rutas | Astro pages + data local |
| Assets | `public/` para paths estables y `assets/` solo si un build asset lo justifica |
| Deploy | `astro build` -> `dist/` -> GitHub Pages |

## Principios vigentes

- El HTML principal debe existir pre-renderizado y ser legible sin JS.
- La home debe mantenerse sobria: sin 3D, sin canvas, sin escenas cliente, sin scroll runtimes.
- Las animaciones deben ser discretas y prescindibles.
- El costo de mantenimiento pesa mas que una capa visual "premium" si esa capa complica lectura, performance o build.
- `context/` y `scripts/mirror/` siguen aislados del sitio publico.

## Estructura recomendada

```text
.
|-- public/
|-- src/
|   |-- components/
|   |-- data/
|   |-- layouts/
|   |-- pages/
|   `-- styles/
|-- docs/
|-- scripts/
`-- context/
```

## Roadmap razonable

1. Mantener la home como hub simple y estatico.
2. Separar Alpha, Corporate, Lab y Talks/Writing en rutas Astro propias cuando el contenido este listo.
3. Definir metadata estatica para el Lab antes de pensar en filtros o interaccion.
4. Introducir enhancement cliente solo si resuelve una necesidad concreta y medible.

## Lo que queda descartado

- React islands en la portada sin necesidad funcional.
- Fondos 3D o escenas R3F/WebGL en la home.
- Scroll runtimes tipo Lenis/GSAP para la estructura base del sitio.
- Experimentos visuales que obliguen a duplicar estados, estilos o rutas.
