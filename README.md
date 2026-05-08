# baruchlopez.com

Portal estatico de Baruch Lopez, construido con Astro y desplegado en GitHub Pages con el dominio `baruchlopez.com`.

## Objetivo actual

Mantener una arquitectura static-first, simple de publicar y simple de mantener. La home y las rutas publicas deben vivir en Astro con HTML/CSS estaticos y JavaScript solo cuando aporte una mejora real.

## Estructura principal

- `src/`: codigo fuente Astro del sitio.
- `public/`: assets estaticos servidos directo por el build, incluyendo `CNAME`.
- `astro.config.mjs`: configuracion del build Astro estatico.
- `.github/workflows/deploy.yml`: pipeline de despliegue a GitHub Pages.
- `index.html`, `styles.css` y `CNAME`: snapshot legacy de la fase estatica pre-Astro.
- `context/`: mirrors, capturas, prompts y material de referencia local. Esta carpeta es local-only y no se versiona en Git.
- `scripts/mirror/`: tooling de scraping/mirroring aislado del sitio publico.
- `docs/`: documentacion, indice de mirrors y tracking del proyecto.

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

Chequeo de tipos:

```powershell
npm.cmd run typecheck
```

Luego abre el servidor local que Astro imprima en terminal.

## Publicacion en GitHub Pages

1. Sube los cambios a GitHub.
2. En `Settings > Pages`, selecciona GitHub Actions como fuente de deploy.
3. El workflow `.github/workflows/deploy.yml` construye Astro desde `src/` y `public/` y publica `dist/`.
4. El snapshot root (`index.html`, `styles.css`, `CNAME`) queda solo como referencia/fallback, no como fuente primaria de publicacion.
5. Los archivos `.nojekyll` en raiz y `public/` existen como guardrail para evitar builds Jekyll accidentales, pero no reemplazan la configuracion correcta de Pages.

## Documentacion y tracking

- `docs/estado-actual-del-repo.md`: estado implementado real del sitio, capas del repo, rutas activas y restricciones tecnicas vigentes.
- `docs/deploy-github-pages.md`: deploy actual en GitHub Pages, configuracion correcta y troubleshooting Astro vs Jekyll legacy.
- `docs/README.md`: mapa general de documentacion.
- `docs/mirrors.md`: indice de todas las paginas scrapeadas y su carpeta mirror local.
- `docs/plan-liquid-glass-command-deck.md`: archivo del experimento descartado de hero visual complejo.
- `docs/tracking.md`: registro de decisiones, avances y siguientes tareas.
- `scripts/mirror/README.md`: uso del modulo de mirroring/scraping.
