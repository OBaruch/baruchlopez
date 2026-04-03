# baruchlopez.com

Portal estatico premium de Baruch Lopez, construido con Astro SSG + React islands + TypeScript + GSAP + Lenis + Three/R3F + Zustand, y desplegado en GitHub Pages con el dominio `baruchlopez.com`.

## Objetivo actual

El objetivo actual es mantener una arquitectura static-first que ya permita motion premium, liquid glass, una capa 3D opcional y rutas estaticas, sin introducir backend, auth, bases de datos ni APIs obligatorias en v1.

La exploracion visual y tecnica de sitios de referencia no vive en el sitio publico: se guarda como material local en `context/` y se documenta en `docs/` para reutilizar ideas cuando el desarrollo de `baruchlopez.com` avance mas adelante.

## Estructura principal

- `src/`: codigo fuente Astro/React del sitio.
- `public/`: assets estaticos servidos directo por el build, incluyendo `CNAME`.
- `astro.config.mjs`: configuracion del build Astro estatico.
- `.github/workflows/deploy.yml`: pipeline de despliegue a GitHub Pages.
- `index.html` y `styles.css`: snapshot legacy de la fase estatica pre-Astro.
- `context/`: mirrors, capturas, prompts y material de referencia local. Esta carpeta es local-only y no se versiona en Git.
- `scripts/mirror/`: tooling de scraping/mirroring aislado del sitio publico.
- `docs/`: documentacion, indice de mirrors y tracking del proyecto.

## Mirrors de referencia disponibles

| Sitio | Mirror local | Paginas scrapeadas | Indice detallado |
| --- | --- | --- | --- |
| `baruchlopez.com` | `context/www.baruchlopez.com` | 16 | `docs/mirrors.md` |
| `valentincheval.design` | `context/www.valentincheval.design` | 6 | `docs/mirrors.md` |
| `zolviz.xyz` | `context/www.zolviz.xyz` | 5 | `docs/mirrors.md` |
| `igloo.inc` | `context/www.igloo.inc` | 1 | `docs/mirrors.md` |
| `onestudios.nl` | `context/www.onestudios.nl` | 1 | `docs/mirrors.md` |

Estos mirrors no son el producto final. Son una libreria de ejemplos visuales, de interaccion, de estructura y de assets para tomar referencias cuando se evolucione el sitio principal.

## Preview local

Instala dependencias:

```powershell
npm.cmd install
```

Servidor de desarrollo:

```powershell
npm.cmd run dev
```

Build estatico:

```powershell
npm.cmd run build
```

Luego abre el servidor local que Astro imprima en terminal.

## Publicacion en GitHub Pages

1. Sube los cambios a GitHub.
2. En `Settings > Pages`, selecciona GitHub Actions como fuente de deploy.
3. El workflow `.github/workflows/deploy.yml` construye Astro y publica `dist/`.
4. Conserva el dominio custom `baruchlopez.com`.

## Documentacion y tracking

- `docs/README.md`: mapa general de documentacion.
- `docs/mirrors.md`: indice de todas las paginas scrapeadas y su carpeta mirror local.
- `docs/plan-liquid-glass-command-deck.md`: idea visual y plan de implementacion del Hero/portal bajo el stack nuevo.
- `docs/tracking.md`: registro de decisiones, avances y siguientes tareas.
- `scripts/mirror/README.md`: uso del modulo de mirroring/scraping.
