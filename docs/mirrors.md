# Mirrors de referencia

## Objetivo

Estos mirrors guardan ejemplos reales de estructura, UI, motion, interacciones, tipografia, assets y decisiones tecnicas de sitios de referencia. La intencion no es publicar estos mirrors tal cual, sino usarlos como biblioteca de inspiracion y analisis para futuras iteraciones de `baruchlopez.com`.

Los mirrors viven en `context/` de forma local-only y el tooling para generarlos vive en `scripts/mirror/`.

## Indice general

| Sitio | Mirror local | Paginas | Assets | Resumen |
| --- | --- | --- | --- | --- |
| `www.baruchlopez.com` | `context/www.baruchlopez.com` | 16 | 95 | Mirror de referencia del sitio original y sus secciones internas. |
| `www.valentincheval.design` | `context/www.valentincheval.design` | 6 | 131 | Portfolio con navegacion por proyectos y fuerte direccion visual. |
| `www.zolviz.xyz` | `context/www.zolviz.xyz` | 5 | 58 | Experiencia 3D/WebGL y rutas internas Next.js/componentes. |
| `www.igloo.inc` | `context/www.igloo.inc` | 1 | 102 | Home WebGL/canvas con assets 3D, audio y estados sinteticos de hover/click. |
| `www.onestudios.nl` | `context/www.onestudios.nl` | 1 | 34 | Landing principalmente visual con deteccion limitada de rutas internas. |

## www.baruchlopez.com

- Mirror local: `context/www.baruchlopez.com`
- Root final: `https://www.baruchlopez.com/`
- Archivo indice: `context/www.baruchlopez.com/site_index.json`
- Resumen automatico: `context/www.baruchlopez.com/domain_summary.md`

| Pagina scrapeada | Carpeta mirror | Title |
| --- | --- | --- |
| `https://www.baruchlopez.com/` | `pages/root` | Baruch Lopez - AI Specialist & Capital Strategist |
| `https://www.baruchlopez.com/about` | `pages/about` | About / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/contact` | `pages/contact` | Contact / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/cookie-policy` | `pages/cookie-policy` | Cookie Policy / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/curriculum` | `pages/curriculum` | Curriculum / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/cyrus-global-capital` | `pages/cyrus-global-capital` | Cyrus Global Capital / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/engineering-ai` | `pages/engineering-ai` | Engineering & AI / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/mba-business-thinking` | `pages/mba-business-thinking` | MBA & Business Thinking / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/my-ethos` | `pages/my-ethos` | My Ethos / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/pol%C3%ADtica-de-privacidad` | `pages/pol-tica-de-privacidad` | Terms & Conditions / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/privacy-policy` | `pages/privacy-policy` | Privacy Policy / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/projects` | `pages/projects` | Projects / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/research-insights` | `pages/research-insights` | Research & Insights / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/talks-appearances` | `pages/talks-appearances` | Talks & Appearances / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/talks-workshops` | `pages/talks-workshops` | Talks & Workshops / Baruch Lopez Oficial |
| `https://www.baruchlopez.com/thinkroom` | `pages/thinkroom` | Thinkroom / Baruch Lopez Oficial |

## www.valentincheval.design

- Mirror local: `context/www.valentincheval.design`
- Root final: `https://valentincheval.design/`
- Archivo indice: `context/www.valentincheval.design/site_index.json`
- Resumen automatico: `context/www.valentincheval.design/domain_summary.md`

| Pagina scrapeada | Carpeta mirror | Title |
| --- | --- | --- |
| `https://valentincheval.design/` | `pages/root` | Valentin Cheval / UX/UI & Brand Design Leader |
| `https://valentincheval.design/projects` | `pages/projects` | My Projects / Valentin Cheval |
| `https://valentincheval.design/about` | `pages/about` | Valentin Cheval: Crafting User-Centered Design for Global Fintech |
| `https://valentincheval.design/project/bitmex` | `pages/project__bitmex` | BitMEX |
| `https://valentincheval.design/project/definchain` | `pages/project__definchain` | Defichain |
| `https://valentincheval.design/project/gotymebank` | `pages/project__gotymebank` | Tyme Bank |

## www.zolviz.xyz

- Mirror local: `context/www.zolviz.xyz`
- Root final: `https://www.zolviz.xyz/`
- Archivo indice: `context/www.zolviz.xyz/site_index.json`

| Pagina scrapeada | Carpeta mirror | Title |
| --- | --- | --- |
| `https://www.zolviz.xyz/` | `pages/root` | zolviz - Transform Your Space with Expert 3D Room Design |
| `https://www.zolviz.xyz/components/AudioController` | `pages/components__AudioController` | (sin title renderizado) |
| `https://www.zolviz.xyz/components/PhysicsSimulation` | `pages/components__PhysicsSimulation` | (sin title renderizado) |
| `https://www.zolviz.xyz/components/ToggleAudio` | `pages/components__ToggleAudio` | (sin title renderizado) |
| `https://www.zolviz.xyz/indexMobile` | `pages/indexMobile` | zolviz - Transform Your Space with Expert 3D Room Design |

## www.igloo.inc

- Mirror local: `context/www.igloo.inc`
- Root final: `https://www.igloo.inc/`
- Archivo indice: `context/www.igloo.inc/site_index.json`
- Resumen automatico: `context/www.igloo.inc/domain_summary.md`

| Pagina scrapeada | Carpeta mirror | Title |
| --- | --- | --- |
| `https://www.igloo.inc/` | `pages/root` | Igloo Inc. |

Notas de captura:

- Es una SPA WebGL/canvas con poco DOM textual, por eso `text.txt` puede quedar vacio aunque la escena visual si se renderice en screenshot.
- Se generaron estados sinteticos de hover/click sobre canvas y viewport mobile.
- Los assets capturados incluyen geometria `.drc`, texturas `.ktx2`, audio `.ogg`, workers y decoder `.wasm`.

## www.onestudios.nl

- Mirror local: `context/www.onestudios.nl`
- Root final: `https://onestudios.nl/`
- Archivo indice: `context/www.onestudios.nl/site_index.json`
- Resumen automatico: `context/www.onestudios.nl/domain_summary.md`

| Pagina scrapeada | Carpeta mirror | Title |
| --- | --- | --- |
| `https://onestudios.nl/` | `pages/root` | (sin title renderizado) |

## Checklist al agregar un nuevo mirror

- Guardar la salida dentro de `context/<host>`.
- Confirmar que exista `site_index.json`, `pages.csv`, `assets_manifest.json` y `domain_summary.md`.
- Agregar el sitio y sus paginas a este documento.
- Registrar la accion en `docs/tracking.md`.
