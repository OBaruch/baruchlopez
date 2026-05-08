# Deploy en GitHub Pages

## Objetivo

Dejar una sola via de publicacion: **Astro build -> artifact -> GitHub Pages via GitHub Actions**.

## Configuracion correcta

### En el repo

- Workflow: `.github/workflows/deploy.yml`
- Build output: `dist/`
- Dominio custom dentro del build: `public/CNAME`
- Guardrails anti-Jekyll: `.nojekyll` y `public/.nojekyll`

### En GitHub

Ir a `Settings > Pages` y dejar:

- `Source = GitHub Actions`

No usar `Deploy from a branch` como fuente primaria mientras este repo publique con Astro.

## Workflow vigente

El workflow actual hace esto:

1. Checkout con `actions/checkout@v6`
2. Build/upload con `withastro/action@v6`
3. Node fijado en `24`
4. Deploy con `actions/deploy-pages@v4`
5. `concurrency` para cancelar deploys superpuestos

Ademas, el trigger se limita a cambios relevantes del sitio:

- `src/**`
- `public/**`
- `.github/workflows/deploy.yml`
- `astro.config.mjs`
- `package.json`
- `package-lock.json`
- `tsconfig.json`

## Sintomas comunes y su causa probable

### Caso 1: el log menciona Jekyll, `_site`, `github-pages`, `checkout@v4` o warnings de Node 20

Eso normalmente indica que GitHub esta intentando publicar la rama como Pages legacy o esta corriendo el flujo interno de Jekyll en vez del deploy Astro por Actions.

Causa probable:

- `Settings > Pages > Source` sigue en `Deploy from a branch`

Que hacer:

1. Cambiar `Source` a `GitHub Actions`
2. Volver a disparar el workflow

### Caso 2: el build local falla con `spawn EPERM`

En esta maquina ese error aparece dentro del sandbox de Windows/OneDrive. No necesariamente es un fallo del repo.

Que hacer:

1. Validar `npm.cmd run typecheck`
2. Revalidar `npm.cmd run build` fuera del sandbox

### Caso 3: alguien quiere volver a publicar desde la raiz del repo

No es la via recomendada. La raiz contiene un snapshot legacy (`index.html`, `styles.css`, `CNAME`) que solo se conserva como referencia/fallback.

## Checklist rapido de validacion

Antes de cerrar cambios de deploy:

1. `npm.cmd run typecheck`
2. `npm.cmd run build`
3. Confirmar que `Settings > Pages > Source = GitHub Actions`
4. Confirmar que el dominio custom sigue configurado en GitHub Pages

## Decision vigente

La publicacion oficial del sitio se considera correcta solo cuando:

- el contenido publico sale de `src/` y `public/`
- el artifact publicado proviene del workflow Astro
- GitHub Pages no intenta reconstruir la raiz con Jekyll
