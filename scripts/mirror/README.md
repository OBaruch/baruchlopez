# Modulo de mirroring

## Objetivo

Aislar en un modulo independiente el tooling necesario para generar mirrors tecnicos y visuales de sitios de referencia, sin mezclar esos scripts con la raiz del sitio estatico que se publica en GitHub Pages.

Estos mirrors sirven para construir una biblioteca de ejemplos y patrones que puedan inspirar futuras iteraciones de `baruchlopez.com`.

## Scripts

- `advanced_mirror_site.mjs`: scraper/mirror generico guiado por `context/prompt de scraping.md`.
- `mirror_zolviz.mjs`: scraper legacy especializado usado para `www.zolviz.xyz`.

## Uso

Ejemplo con el scraper generico:

```powershell
$env:MIRROR_MAX_PAGES='120'
node scripts/mirror/advanced_mirror_site.mjs 'https://www.igloo.inc' 'C:\Users\baruc\OneDrive\Desktop\proyectos\baruchlopez\context\www.igloo.inc'
```

Ejemplo con el scraper legacy de Zolviz:

```powershell
node scripts/mirror/mirror_zolviz.mjs 'https://www.zolviz.xyz/' 'C:\Users\baruc\OneDrive\Desktop\proyectos\baruchlopez\context\www.zolviz.xyz'
```

## Salida esperada

Cada mirror debe escribirse en `context/<host>/` y contener, como minimo:

- `site_index.json`
- `pages.csv`
- `assets_manifest.json`
- `internal_link_graph.json`
- `interaction_patterns.json`
- `animation_patterns.json`
- `design_system_inference.json`
- `tech_stack_inference.json`
- `domain_summary.md`
- `pages/<slug>/...` con HTML, screenshots, estados y analisis por pagina.

## Notas operativas

- Respetar las restricciones del prompt en `context/prompt de scraping.md`.
- Evitar acciones autenticadas, destructivas o fuera del dominio objetivo.
- Documentar cualquier nuevo mirror en `docs/mirrors.md` y registrar el cambio en `docs/tracking.md`.
