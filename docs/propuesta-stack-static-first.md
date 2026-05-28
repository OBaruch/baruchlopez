# Propuesta de stack static-first

## Tesis

La direccion correcta para este repo sigue siendo **Astro SSG + TypeScript + CSS propio + contenido local estructurado**, desplegado en **GitHub Pages** y con JavaScript solo como enhancement puntual cuando exista una necesidad real.

El sitio no necesita runtime visual complejo para cumplir su proposito: debe funcionar como hub personal/profesional claro, rapido, elegante y mantenible.

## Stack recomendado y vigente

| Capa | Decision |
| --- | --- |
| Framework | Astro en modo SSG |
| Lenguaje | Astro + TypeScript |
| Styling | CSS global + custom properties |
| Interactividad | Progressive enhancement puntual |
| Contenido | Data local en `src/data/` |
| Rutas | `src/pages/` |
| Assets | `public/` para paths estables |
| Deploy | `astro build` -> `dist/` -> GitHub Pages |

## Estado aplicado al repo

Hoy esta tesis ya se refleja en la implementacion:

- Rutas Astro publicas en `src/pages/`.
- Contenido principal en `src/data/site.ts`.
- Contenido editorial extendido en `src/data/manifesto.ts`.
- Layout y metadata en `src/layouts/BaseLayout.astro`.
- Estilos en `src/styles/global.css`.
- Deploy con `.github/workflows/deploy.yml`.

`/alpha-signature/` y `/cyrus-global-capital/` no son landings internas; son rutas de compatibilidad con redireccion a los sitios oficiales externos.

## Principios vigentes

- El HTML principal debe existir pre-renderizado y ser legible sin JS.
- La experiencia debe mantenerse sobria: sin 3D, canvas, escenas cliente o scroll runtimes para la base.
- Las animaciones deben ser discretas, prescindibles y accesibles.
- El costo de mantenimiento pesa mas que una capa visual llamativa si esa capa complica lectura, performance o build.
- `context/` y `scripts/mirror/` siguen aislados del sitio publico.
- Alpha Signature y Cyrus deben usar sus dominios oficiales en CTAs publicos.

## Guardrails de deploy

- GitHub Pages debe usar `Source = GitHub Actions`.
- `public/CNAME` mantiene el dominio custom dentro del build Astro.
- `.nojekyll` en raiz y `public/.nojekyll` reducen el riesgo de que GitHub intente reconstruir el sitio como Jekyll legacy.
- El alias de `astro/entrypoints/prerender` en `astro.config.mjs` no debe eliminarse sin validar build en Windows/OneDrive.

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

1. Mantener Astro como stack principal.
2. Dividir `src/data/site.ts` cuando el contenido crezca o requiera ownership mas claro.
3. Dividir `src/styles/global.css` por capas si empieza a ser dificil de auditar.
4. Optimizar imagenes grandes en `public/assets/images/`.
5. Agregar tooling de lint/formato solo si aporta disciplina real al mantenimiento.

## Lo que queda descartado

- Migrar a Next.js sin necesidad funcional clara.
- React islands en la portada sin necesidad.
- Fondos 3D o escenas R3F/WebGL.
- Scroll runtimes tipo Lenis/GSAP para la estructura base.
- UI kits que hagan que el sitio parezca template generico.
