# Tech stack audit

Fecha: 2026-05-27

## Stack detectado

| Area | Estado real |
| --- | --- |
| Framework | Astro 6 en modo static site generation |
| Lenguaje | Astro + TypeScript |
| Rutas | File-based routing en `src/pages/` |
| Estilos | CSS global propio en `src/styles/global.css` |
| UI library | Ninguna |
| Animacion | CSS nativo; sin librerias de motion |
| Formularios | Sin libreria de formularios |
| Datos | Data local en TypeScript (`src/data/site.ts`, `src/data/manifesto.ts`) |
| Charts/tablas | Ninguna libreria |
| Build | `astro build` |
| Typecheck | `tsc --noEmit` |
| Lint/formato | No configurado |
| Deploy | GitHub Pages con `.github/workflows/deploy.yml` |
| Hosting | `baruchlopez.com` |

## Dependencias

Dependencias declaradas:

- `astro`
- `typescript`
- `@types/node`

No se detectaron dependencias de React, Next.js, Tailwind, shadcn/ui, Radix, Chakra, Mantine, GSAP, Motion, data fetching, dashboards o backend.

## Dependencias dudosas o innecesarias

No hay dependencias dudosas en `package.json`.

Una inspeccion local con `npm.cmd ls --depth=0` mostro paquetes `extraneous` dentro de `node_modules`, pero no estan declarados en `package.json`. Esto apunta a higiene local de instalacion, no a complejidad real del repo.

Recomendacion:

- No cambiar `package.json` por esos paquetes.
- Si se quiere limpiar el entorno local, regenerar `node_modules` con una instalacion limpia.

## Complejidad del stack

Nivel: bajo y adecuado.

El stack actual resuelve bien el objetivo del proyecto: sitio personal/profesional estatico, SEO-friendly, rapido, mantenible y desplegable en GitHub Pages. No hay senales de que se necesite SSR, backend, auth, estado global, librerias de UI o herramientas de dashboard.

## Hallazgos principales

- La documentacion tecnica estaba parcialmente obsoleta: mencionaba rutas y archivos que ya no representaban el sitio actual.
- Existian `src/components/HeroPortal.astro` y `src/data/portal.ts` sin referencias reales en `src/`.
- Faltaba un comando unico de verificacion para Codex y mantenimiento.
- No hay lint ni formatter configurados.
- `src/data/site.ts`, `src/data/manifesto.ts` y `src/styles/global.css` son funcionales pero grandes.
- El retrato principal en `public/assets/images/baruch-lopez-portrait.jpg` es pesado para web y deberia optimizarse.

## Recomendacion tecnica

Mantener y simplificar, no migrar.

Justificacion:

- Astro ya cubre las necesidades de SEO, rutas estaticas y performance.
- La ausencia de UI kits y runtime cliente mantiene bajo el costo de mantenimiento.
- GitHub Pages es suficiente para el alcance actual.
- La deuda principal no es el framework, sino documentacion, contenido, estructura de datos/estilos y validacion operativa.

## Cambios aplicados

- Se agrego `npm run check` como verificacion compuesta.
- Se retiraron archivos no usados confirmados por busqueda de referencias:
  - `src/components/HeroPortal.astro`
  - `src/data/portal.ts`
- Se actualizo documentacion para reflejar rutas, stack y reglas reales.
- Se agrego `.env.example` para dejar claro que variables locales no son necesarias para el build Astro.

## No recomendado por ahora

- Migrar a Next.js.
- Agregar React solo para componentes visuales.
- Agregar Tailwind o una libreria UI sin necesidad repetible.
- Agregar Motion/GSAP/Lenis para efectos de scroll.
- Convertir el sitio en app con backend o SSR.
