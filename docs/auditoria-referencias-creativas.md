# Auditoria de referencias creativas

## Alcance

Este documento analiza los mirrors locales en `context/` como banco de referencias visuales, interactivas y tecnicas para una futura evolucion de `baruchlopez.com`.

La lectura no se basa en percepcion subjetiva solamente: usa `raw.html`, `rendered.html`, `page.json`, `text.txt`, manifests de assets, JSON de inferencia tecnica, JSON de interacciones/animaciones y screenshots/estados capturados dentro de cada mirror.

## Referencias auditadas

| Referencia | Rol en benchmark | Complejidad |
| --- | --- | --- |
| `www.baruchlopez.com` | baseline actual del sitio propio | baja |
| `www.valentincheval.design` | benchmark editorial/cinematico multi-pagina | alta |
| `www.zolviz.xyz` | benchmark experimental con galeria pseudo-infinita y audio | alta / extrema en UX custom |
| `www.igloo.inc` | benchmark WebGL/3D inmersivo full-canvas | extrema |
| `www.onestudios.nl` | benchmark 3D minimalista premium con loader y objeto GLB | alta |

## Lectura ejecutiva

La direccion tecnica mas razonable no es copiar la arquitectura mas extrema desde el dia uno, sino separar dos capas:

- una capa estatica, indexable y editorial para rutas, proyectos, texto, SEO y contenido base;
- una capa de islas interactivas para motion, cursor, audio opt-in, overlays, scroll avanzado y escenas 3D puntuales.

Eso permite aproximarse gradualmente a Valentin / One Studios y reservar Igloo / Zolviz como laboratorio de interacciones mas agresivas.

## A) Auditoria por referencia

### 1) `context/www.valentincheval.design`

**Identidad visual**

Portafolio oscuro, editorial, cinematografico, con composicion muy controlada, contraste alto, acento naranja/rojo, fotografia protagonista, tipografia sans premium y una sensacion de direccion de arte mas cercana a film title design que a portfolio generico.

**Estilo de interaccion**

Navegacion multi-pagina con overlays, cursor custom, microinteracciones persistentes, transiciones entre rutas, piezas con comportamiento tipo showcase editorial y una capa clara de polish en hover/focus visual.

**Estilo de animacion probable**

Scroll-triggered reveals, texto en slide/fade, marquees, secciones sticky/pinned, transiciones de pagina con crossfade y capas overlay, cursor reactivo y fondos/canvas en hero. El sistema parece apoyarse en timeline orchestration mas que en animaciones CSS aisladas.

**Patrones tecnicos inferidos**

- Astro como framework principal, confirmado por `<meta name="generator" content="Astro v4.11.3">` en `context/www.valentincheval.design/pages/root/raw.html`.
- Islas interactivas con Solid dentro de Astro, visibles por `astro-island` y `data-solid-render-id`.
- Swup para transiciones entre paginas, visible en assets `Swup*.js`, `SwupA11yPlugin`, `SwupHeadPlugin`, `SwupPreloadPlugin`, `SwupRouteNamePlugin`, `SwupScriptsPlugin`.
- GSAP para timelines y scroll choreography.
- Lenis para smooth scroll.
- Canvas/WebGL o canvas 2D custom en hero y fondos, por `<canvas id="hero-bg">` y la inferencia `Three.js/WebGL` en el mirror.
- Cursor custom dedicado, visible en `/_astro/cursor.BZZUw5pY.js` y en DOM renderizado con `.mf-cursor`.

**Matriz de capacidades**

| Dimension | Diagnostico |
| --- | --- |
| Animacion UI normal | Si, intensa y refinada |
| Animacion vinculada a scroll | Si, con pinned/sticky y reveal |
| Smooth/custom scroll | Si, Lenis |
| Canvas/WebGL | Si, al menos en hero/fondos |
| 3D probable | Parcial; mas fuerte en fondos/escenas que en UI principal |
| Page transitions | Si, Swup |
| Cursor-driven interactions | Si, cursor custom sistematico |
| Video/audio | No dominante en evidencia principal |
| Riesgos de performance | exceso de JS por pagina, listeners de scroll/cursor, canvas + imagenes grandes, layout thrashing si los triggers no estan bien aislados |
| Riesgos de accesibilidad | cursor custom que puede ocultar estados reales, transiciones que rompen foco si no se controlan, motion excesivo sin respeto a `prefers-reduced-motion` |

**Clasificacion de complejidad**: alta.

### 2) `context/www.zolviz.xyz`

**Identidad visual**

Experiencia brutalista/editorial, negro y blanco, bordes gruesos, tipografia condensada y mono, sensacion de instalacion digital con paneles tipo archivo visual, ruido/grano y una intencion deliberadamente experimental.

**Estilo de interaccion**

Entrada gateada por letras flotantes, galeria horizontal pseudo-infinita controlada por scroll vertical remapeado, apertura de panel editorial al hacer click en una pieza, cursor custom con estado contextual y audio UI.

**Estilo de animacion probable**

Transiciones DOM por `transform`, reveals palabra por palabra, snapping horizontal, movimiento con inercia de cursor, pulsos de UI, simulacion fisica 2D para elementos flotantes y secuencias sincronizadas con sonidos.

**Patrones tecnicos inferidos**

- Next.js + React, confirmado por `__NEXT_DATA__`, rutas `/_next/static/...` y `page: "/"` en `context/www.zolviz.xyz/pages/root/raw.html`.
- Galeria en tiles cuadrados `100vh x 100vh` posicionados horizontalmente, con scroll virtual apoyado en un contenedor gigante `#tallDiv` y funciones tipo `handleScroll`, `target`, `adjustSquaresPosition`, `translateX` descritas en `page.json`.
- AudioController propio y microsonidos (`playSound`, `playTypingSound`, `startBackgroundMusic`).
- Simulacion fisica DOM custom para letras flotantes.
- No hay evidencia publica fuerte de Three.js/WebGL/canvas; el espectaculo parece venir de DOM transforms + fisica 2D + audio.
- Estilo con Tailwind utilities + CSS modules/global.

**Matriz de capacidades**

| Dimension | Diagnostico |
| --- | --- |
| Animacion UI normal | Si |
| Animacion vinculada a scroll | Si, scroll remapeado a movimiento horizontal |
| Smooth/custom scroll | Si, sistema custom y snapping |
| Canvas/WebGL | No evidente publicamente |
| 3D probable | No como base; mas bien 2D/DOM teatral |
| Page transitions | No es el foco principal; la pagina funciona mas como una escena interactiva |
| Cursor-driven interactions | Si, cursor reactivo contextual |
| Video/audio | Si, audio opt-in y microsonidos |
| Riesgos de performance | scroll container gigantesco, transforms continuos, simulacion fisica, audio, muchos listeners, riesgo alto de jank en mobile/low-power |
| Riesgos de accesibilidad | gate obligatorio antes del contenido, dependencia fuerte de interaccion de mouse/cursor, posible mala navegacion por teclado, audio intrusivo, semantica diluida por layout experimental |

**Clasificacion de complejidad**: alta, con picos de complejidad extrema en UX custom.

### 3) `context/www.igloo.inc`

**Identidad visual**

Experiencia glacial monocromatica, espacial, casi completamente dominada por una escena 3D inmersiva. La UI textual es secundaria; el valor visual viene del render, materiales, atmosfera y sensacion de entorno navegable.

**Estilo de interaccion**

Interaccion tipo experiencia WebGL: escena full-screen, estados hover/click capturados sobre canvas, probable respuesta a cursor/scroll y uso de audio. La pagina se siente mas como un microsite renderizado que como una pagina HTML tradicional.

**Estilo de animacion probable**

Animacion continua dentro de la escena 3D, particulas, shaders/data textures, transiciones de camara/objeto, niebla/humo/viento y estados visuales activados por scroll o input. La evidencia apunta mas a loop de render + uniforms que a animacion DOM clasica.

**Patrones tecnicos inferidos**

- Three.js/WebGL como tecnologia central, inferido en `context/www.igloo.inc/tech_stack_inference.json` y `context/www.igloo.inc/pages/root/tech_inference.json`.
- Carga de geometria comprimida Draco (`.drc`) como `mountain.drc`, `ground.drc`, `igloo.drc`, `intro_particles.drc`, `shattered_ring2.drc`, `smoke_trail.drc`.
- Texturas y data textures `.ktx2` como `scroll-datatexture.ktx2`, `frost-datatexture.ktx2`, `sound-datatexture.ktx2`, `arrow-datatexture.ktx2`, `close-datatexture.ktx2`, `wind_noise.ktx2`.
- Decodificacion Draco en cliente por `draco_decoder.js` / `.wasm`.
- Render CSR full-canvas, con poca huella SSR/HTML util segun `rendering_hints`.
- Audio presente (`audio_like: true` y assets `.ogg`).

**Matriz de capacidades**

| Dimension | Diagnostico |
| --- | --- |
| Animacion UI normal | Baja en DOM; la animacion principal vive en WebGL |
| Animacion vinculada a scroll | Probable, por data textures de scroll y patrones `smooth_scroll_like` |
| Smooth/custom scroll | Probable |
| Canvas/WebGL | Si, core del sitio |
| 3D probable | Si, 3D central |
| Page transitions | No es el foco; experiencia parece mas single-scene |
| Cursor-driven interactions | Si, inferencia `cursor-reactive` |
| Video/audio | Si, audio y posible render cinematico en tiempo real |
| Riesgos de performance | muy alto consumo GPU/VRAM, transferencia pesada de geometria/texturas, stutter por decodificacion Draco/KTX2, caidas severas en mobile |
| Riesgos de accesibilidad | casi ausencia de contenido semantico en HTML, interacciones atrapadas en canvas, potencial inaccesibilidad por teclado/lectores, motion intenso sin alternativa clara |

**Clasificacion de complejidad**: extrema.

### 4) `context/www.onestudios.nl`

**Identidad visual**

Minimalismo premium oscuro con acento neon verde, composicion sobria, tipografia muy cuidada y foco fuerte en una pieza/escena 3D central. Tiene lenguaje mas "brand system" que "experimento caotico".

**Estilo de interaccion**

Loader numerico grande, botones/folders de navegacion, canvas protagonista, microinteracciones en header/footer y una sensacion de control tipografico fuerte. Menos radical que Zolviz, pero con calidad de ejecucion alta.

**Estilo de animacion probable**

Secuencia de loader, entrada controlada de escena/objeto 3D, hover en folders/nav, transiciones suaves de elementos y scroll container custom o estructura de escena con canvas persistente.

**Patrones tecnicos inferidos**

- Next.js exportado de forma estatica, confirmado por `__NEXT_DATA__` con `"nextExport":true,"autoExport":true` en `context/www.onestudios.nl/pages/root/raw.html`.
- Three.js/WebGL con un modelo GLB `https://onestudios.nl/gltf/model_centered.glb`.
- HDR environment externo de `pmndrs/drei-assets`, lo que sugiere uso de tooling tipo drei/Three ecosystem.
- Un canvas principal y un `main.scroll-container`.
- Estilos con utilidades tipo Tailwind y tipografia custom (`ASTherma`, `PolySans`).

**Matriz de capacidades**

| Dimension | Diagnostico |
| --- | --- |
| Animacion UI normal | Si, pero sobria |
| Animacion vinculada a scroll | Posible via `scroll-container` |
| Smooth/custom scroll | Probable, pero menos evidente que Valentin |
| Canvas/WebGL | Si, canvas principal |
| 3D probable | Si, modelo GLB central |
| Page transitions | No es la evidencia principal |
| Cursor-driven interactions | Parcial, hover en botones/folders y posible cursor custom |
| Video/audio | No dominante en la evidencia principal |
| Riesgos de performance | loader + escena 3D + HDR externo, dependencia de red para asset remoto, riesgo de bloqueo inicial si el modelo pesa demasiado |
| Riesgos de accesibilidad | loader con contenido principal posiblemente oculto, canvas central con semantica limitada, contraste/acento muy estilizado que debe verificarse |

**Clasificacion de complejidad**: alta.

### 5) `context/www.baruchlopez.com`

**Identidad visual**

Landing estatica con hero fotografico urbano, nombre en serif grande, descripcion profesional y CTA simple. Es clara, sobria y mucho mas cercana a una pagina editorial estatica que a un microsite inmersivo.

**Estilo de interaccion**

Navegacion y lectura lineal simple, sin evidencia de sistemas complejos de motion, 3D o audio. Este mirror sirve como baseline de simplicidad y como punto de partida para no perder publicabilidad.

**Estilo de animacion probable**

Practicamente ninguna o muy ligera. La pagina actual parece optimizada para claridad y despliegue simple, no para experimentacion cinetica.

**Patrones tecnicos inferidos**

- HTML/CSS estatico directo en la raiz publica.
- Arquitectura compatible con GitHub Pages sin build step.
- Complejidad tecnica intencionalmente baja.

**Matriz de capacidades**

| Dimension | Diagnostico |
| --- | --- |
| Animacion UI normal | Baja |
| Animacion vinculada a scroll | No relevante actualmente |
| Smooth/custom scroll | No |
| Canvas/WebGL | No |
| 3D probable | No |
| Page transitions | No |
| Cursor-driven interactions | No |
| Video/audio | No |
| Riesgos de performance | bajos |
| Riesgos de accesibilidad | relativamente bajos, pero depende de jerarquia semantica, contraste y estados focus |

**Clasificacion de complejidad**: baja.

## B) Feature decomposition maestro

| Feature | Que hace visualmente | Implementacion probable | Libreria/herramienta recomendada | Dificultad | Costo perf | Compatibilidad static-host | Version sugerida | Fallback mobile/low-power |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Reveals editoriales al entrar en viewport | texto, imagenes y bloques aparecen con timing premium | Intersection/ScrollTrigger + transforms/opacity | GSAP + ScrollTrigger | 4 | 3 | si | v1 | desactivar stagger largo y reducir distancia; usar fade simple |
| Sticky/pinned storytelling sections | secciones se fijan mientras cambia el contenido o la narrativa | layout sticky + timelines scroll-linked | CSS sticky + GSAP ScrollTrigger | 6 | 5 | si | v1/v2 | convertir a scroll normal sin pin en pantallas chicas |
| Smooth scroll premium | scroll con inercia y sensacion de continuidad | scroll virtual + RAF | Lenis | 5 | 4 | si | v1/v2 | desactivar Lenis en `prefers-reduced-motion` o mobile problematico |
| Page transitions cinematograficas | crossfade/slide entre rutas sin corte brusco | wrapper persistente + snapshots + lifecycle de rutas | Astro View Transitions o Swup | 6 | 4 | si | v2 | fallback a navegacion nativa instantanea |
| Cursor custom reactivo | cursor visual cambia por contexto, hover, drag, close, etc. | overlay fixed + pointer tracking + estados por target | React island + Zustand + CSS transforms o `mouse-follower` | 5 | 4 | si | v2 | desactivar en touch y mantener cursor nativo |
| Marquees / loops tipograficos | texto o elementos se desplazan en loop | transform translate con timeline o CSS | CSS keyframes o GSAP | 3 | 3 | si | v1 | pausar/reducir velocidad; ocultar clones con `aria-hidden` |
| Galeria horizontal controlada por scroll | scroll vertical mueve una tira horizontal de proyectos | mapping scroll -> `translateX`, snapping, bounds/wrap | GSAP ScrollTrigger o Motion custom + Lenis | 7 | 6 | si | v2/v3 | usar carrusel horizontal nativo con botones y `overflow-x:auto` |
| Galeria pseudo-infinita | sensacion de loop continuo en tiles/proyectos | duplicacion de items + modulo/recycle, no scroll container infinito absurdo | logica custom + GSAP/Lenis | 8 | 7 | si | v3 | lista finita paginada o loop desactivado en mobile |
| Panel editorial al click | click en card abre overlay con texto, imagen grande y metadata | estado UI + animacion layout/overlay + focus trap | React + Zustand + Framer Motion o GSAP | 5 | 4 | si | v2 | navegar a pagina detalle estatica en lugar de overlay |
| Menu overlay con microinteracciones | navegacion fullscreen/panel con entrada animada | estado global + timelines + bloqueo de scroll | React + GSAP | 5 | 4 | si | v2 | menu simple desplegable |
| Custom intro gate interactivo | el usuario desbloquea la experiencia clicando elementos | estado de onboarding + fisica DOM + animaciones | React + motor propio o Matter.js | 8 | 6 | si | v3 | omitir gate y entrar directo al contenido |
| Fisica 2D DOM | letras/elementos flotan, chocan o reaccionan | motor fisico sobre elementos DOM/SVG | Matter.js o motor custom ligero | 8 | 7 | si | v3 | animacion decorativa pregrabada o static hero |
| Hero canvas 2D con depth/parallax | imagen con profundidad o deformacion sutil | canvas shader/parallax con depth map | Three.js shader, pixi.js o shader custom | 7 | 6 | si | v2/v3 | poster estatico + parallax CSS muy leve |
| Escena 3D con modelo GLB | objeto 3D renderizado en hero/seccion | Three.js + GLTF/GLB + HDR env + postprocessing | `@react-three/fiber`, `@react-three/drei`, Three.js | 7 | 7 | si | v2 | imagen poster/webp fallback y carga lazy con boton o viewport |
| Escena 3D full-canvas tipo microsite | entorno inmersivo con camara, particulas y shaders | loop WebGL completo, assets Draco/KTX2, uniforms, scroll/cursor input | Three.js + R3F + shaders + Draco/KTX2 | 10 | 10 | parcial/si, pero muy pesada | v3 | modo estatico/video fallback, reducir escena a una pieza hero |
| Particulas / humo / ruido procedural | atmosfera y movimiento continuo | shaders, sprites, noise textures, instancing | Three.js shader materials o VFX shader custom | 8 | 8 | si | v3 | textura estatica + gradientes/blur CSS |
| Audio ambiente opt-in | musica/ambiente que refuerza inmersion | Web Audio / `<audio>` + estado global + gesture unlock | HTMLAudioElement o Web Audio API + Zustand | 6 | 4 | si | v2/v3 | default mute, control visible, persistencia `localStorage`, no autoplay |
| Microsonidos de UI | click/hover/typing sound design | audio sprites o pequenos archivos por evento | Howler.js o Web Audio API simple | 5 | 3 | si | v3 | desactivar por defecto, solo despues de opt-in |
| Loaders numericos cinematicos | loader que marca progreso y crea tension visual | preload control + animacion del texto/progreso | React + GSAP + preload manual | 6 | 5 | si | v2 | skeleton simple y ocultar loader si la pagina ya esta cacheada |
| Video hero / poster cinematico | fondo con movimiento premium sin 3D real | `video` muted loop + poster | HTML5 video + poster responsive | 4 | 6 | si | v1/v2 | poster estatico en mobile o `prefers-reduced-motion` |
| Rutas nested de proyectos | arquitectura multi-pagina con detalle por caso | SSG con rutas por slug | Astro content collections + paginas estaticas | 3 | 1 | si | v1 | no necesita fallback |
| SEO y metadata por proyecto | cada proyecto tiene title/description/OG propio | metadata en build + rutas SSG | Astro + frontmatter/collections | 3 | 1 | si | v1 | no necesita fallback |

## Features que NO conviene copiar literalmente en v1

- **Gate obligatorio tipo Zolviz**: es memorable, pero castiga UX, SEO y accesibilidad si bloquea el acceso al contenido principal. Mejor dejar el contenido entrar directo y reservar un gate experimental para una ruta `/lab/`.
- **Scroll container gigante tipo `#tallDiv` de Zolviz**: funciona como hack de escena, pero es fragil y puede generar jank o bugs raros. Si se busca loop horizontal, mejor usar una lista finita duplicada con modulo/wrap y fallback a `overflow-x:auto`.
- **Full-canvas WebGL como base total tipo Igloo**: visualmente potente, pero demasiado caro y riesgoso como fundamento de v1. Mejor una pagina editorial estatica con una o dos islas 3D opcionales y poster fallback.
- **Audio activo o demasiado protagonista en landing principal**: usar audio solo con opt-in explicito y control visible.
