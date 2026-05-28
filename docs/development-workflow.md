# Development workflow

Fecha: 2026-05-27

## Requisitos

- Node.js compatible con Astro 6.
- npm en Windows. En este entorno usar `npm.cmd`.

## Instalacion

```powershell
npm.cmd install
```

El sitio no requiere variables de entorno para desarrollar, hacer typecheck o compilar.

`.env.example` existe solo para documentar variables opcionales de tooling local.

## Desarrollo local

```powershell
npm.cmd run dev
```

Por defecto abre Astro en:

```text
http://localhost:4321
```

Si el puerto esta ocupado:

```powershell
npm.cmd run dev -- --port 43127
```

## Typecheck

```powershell
npm.cmd run typecheck
```

Ejecuta TypeScript sin emitir archivos.

## Build

```powershell
npm.cmd run build
```

Genera `dist/`.

## Preview de produccion

```powershell
npm.cmd run preview
```

Sirve el output de produccion.

## Verificacion recomendada

```powershell
npm.cmd run check
```

Este comando ejecuta:

1. `npm run typecheck`
2. `npm run build`

## Scripts existentes

| Script | Comando | Uso |
| --- | --- | --- |
| `dev` | `astro dev --host 0.0.0.0 --port 4321` | Desarrollo local |
| `build` | `astro build` | Build estatico |
| `preview` | `astro preview --host 0.0.0.0 --port 4321` | Preview de output |
| `typecheck` | `tsc --noEmit` | Validacion TypeScript |
| `check` | `npm run typecheck && npm run build` | Validacion completa |

## Scripts faltantes

No existen por ahora:

- `lint`
- `format`
- `test`
- `check:links`
- `check:a11y`

No se agregaron porque el proyecto aun se beneficia de mantener una base minima. Se recomienda agregarlos solo si se decide mantener una disciplina formal de calidad automatizada.

## Deploy

El deploy oficial usa GitHub Pages con GitHub Actions:

- Workflow: `.github/workflows/deploy.yml`
- Output: `dist/`
- Dominio: `baruchlopez.com`

Revisar `docs/deploy-github-pages.md` para detalles de Pages y troubleshooting.

## Variables de entorno

El build Astro no requiere `.env`.

Si alguna herramienta local necesita GitHub API, usar:

```text
GITHUB_TOKEN=
```

No commitear tokens reales.

## Recomendaciones de mejora

- Agregar lint/formato solo si se quiere estandarizar revisiones.
- Agregar link checker antes de campañas o despliegues importantes.
- Agregar auditoria Lighthouse manual o automatizada cuando se estabilicen imagenes.
- Optimizar imagenes grandes antes de considerar performance "final".
