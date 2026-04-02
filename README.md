# baruchlopez.com

Sitio estatico minimal de Baruch Lopez, pensado para publicarse directo desde GitHub Pages con el dominio `baruchlopez.com`.

## Objetivo actual

Por el momento el objetivo principal de este repo es mantener una pagina basica, rapida y 100% estatica que se pueda desplegar desde la rama principal de GitHub sin backend, sin build obligatorio y sin infraestructura extra.

La exploracion visual y tecnica de sitios de referencia no vive en el sitio publico: se guarda como material local en `context/` y se documenta en `docs/` para reutilizar ideas cuando el desarrollo de `baruchlopez.com` avance mas adelante.

## Estructura principal

- `index.html`: pagina publica actual.
- `styles.css`: estilos del sitio estatico.
- `CNAME`: dominio custom para GitHub Pages.
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

Opcion rapida:

```powershell
start index.html
```

O con servidor local:

```powershell
py -m http.server 3000
```

Luego abre `http://localhost:3000`.

## Publicacion en GitHub Pages

1. Sube los cambios a GitHub.
2. En `Settings > Pages`, selecciona `Deploy from a branch`.
3. Usa la rama `main` y la carpeta `/ (root)`.
4. Conserva el dominio custom `baruchlopez.com`.

## Documentacion y tracking

- `docs/README.md`: mapa general de documentacion.
- `docs/mirrors.md`: indice de todas las paginas scrapeadas y su carpeta mirror local.
- `docs/tracking.md`: registro de decisiones, avances y siguientes tareas.
- `scripts/mirror/README.md`: uso del modulo de mirroring/scraping.
