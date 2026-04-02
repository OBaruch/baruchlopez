# Propuesta de tech stack static-first

## Tesis

La mejor estrategia para este repo es **Astro SSG + islas React + TypeScript + GSAP/Lenis + Three.js/R3F como capa opcional de escenas**, desplegado estaticamente en **GitHub Pages** para v1.

Motivo: ese stack permite conservar HTML pre-renderizado, SEO, rutas estaticas y control de performance, pero deja espacio para introducir motion avanzado, overlays, audio opt-in, cursor reactivo y 3D sin convertir todo el sitio en una SPA pesada.

La referencia que mejor encaja como punto de partida no es Igloo sino **Valentin Cheval**: arquitectura editorial multi-pagina + transiciones + scroll choreography + cursor custom, con 3D reservado a heros o escenas puntuales. **One Studios** sirve como referencia para 3D contenido y sobrio. **Zolviz** e **Igloo** deben quedar como laboratorio de features mas agresivas, no como arquitectura base de v1.

## C) Stack recommendation

### Stack primario recomendado

| Capa | Decision |
| --- | --- |
| Framework | Astro en modo SSG |
| Lenguaje | TypeScript |
| UI interactiva | React islands dentro de Astro |
| Styling | Tailwind CSS + CSS Modules donde convenga + CSS custom properties para design tokens |
| Animacion UI/scroll | GSAP + ScrollTrigger |
| Smooth scroll | Lenis, activado de forma progresiva y con respeto a `prefers-reduced-motion` |
| Transiciones de pagina | Astro View Transitions primero; Swup solo si aparece un caso que Astro no cubra bien |
| 3D | Three.js + `@react-three/fiber` + `@react-three/drei` |
| Estado global ligero | Zustand para audio/cursor/menu/estado de escena |
| Contenido y rutas | Astro Content Collections / MDX o Markdown local, con rutas estaticas por slug |
| Assets | `src/assets/` para assets procesados por build, `public/` para posters/OG/audio/modelos servidos directo cuando tenga sentido |
| Deploy | `astro build` -> `dist/` -> GitHub Pages |

### Alternativa 1: Next.js static export + React + GSAP + R3F

**Cuando tendria sentido**: si mas adelante quieres quedarte 100% React-first y reutilizar patrones tipo One Studios/Zolviz con App Router o rutas generadas.

**Por que NO la pondria como primaria para este repo ahora**:

- agrega mas complejidad de framework de la necesaria para una fase static-first;
- `next/image` y ciertas optimizaciones/server features quedan limitadas o irrelevantes en export estatico;
- si el sitio principal sera mayormente editorial con islas interactivas, Astro da mejor control de "HTML primero, JS solo donde toca".

### Alternativa 2: Vite + React SPA + React Router + GSAP + R3F

**Cuando tendria sentido**: si decides construir una unica experiencia tipo microsite experimental donde casi todo sea una escena cliente y SEO importe menos.

**Por que NO la pondria como primaria**:

- una SPA completa es peor base para contenido indexable, rutas estaticas limpias y degradacion progresiva;
- es demasiado facil terminar con toda la navegacion, transiciones y scroll acoplados a JS;
- no se alinea tan bien con el objetivo de GitHub Pages + static hosting + evolucion gradual.

## D) Arquitectura static-first

### Principio de arquitectura

El sitio debe renderizar **contenido y rutas como HTML estatico preconstruido**, y montar **interactividad solo en islas cliente** donde la experiencia realmente lo exige.

Ese patron protege el SEO, reduce JS base, mantiene compatibilidad con GitHub Pages y aun asi permite recrear gradualmente motion/3D inspirado en Valentin, One Studios, Zolviz e Igloo.

### Que debe permanecer puramente estatico

- rutas principales y nested pages;
- contenido editorial de home, about, proyectos, research, contacto;
- metadata SEO, Open Graph, canonical URLs y sitemap estatico;
- estructura semantica de headings, texto, landmarks y links;
- posters fallback para videos y escenas 3D;
- listas de proyectos y metadata precomputada.

### Que puede ser client-side interactivo

- cursor custom;
- menu overlay;
- reveals, marquees, sticky timelines y scroll choreography;
- paneles editoriales al abrir proyectos o medias;
- audio opt-in y microinteracciones sonoras;
- escenas Three.js/R3F montadas bajo demanda;
- galerias horizontales pseudo-inerciales;
- experimentos de `/lab/` con fisica DOM o shaders.

### Que conviene precomputar en build time

- rutas por slug desde Markdown/MDX local;
- manifests de proyectos, tags, categorias y relaciones next/prev;
- imagenes responsive, thumbnails y blur/poster placeholders;
- metadata SEO por pagina;
- indice estatico para galerias o colecciones;
- datos estructurados JSON-LD;
- copias/variantes de contenido visibles aunque JS falle.

### Estructura de rutas y contenido sugerida

| Ruta | Proposito | Render |
| --- | --- | --- |
| `/` | landing editorial principal | SSG + motion island |
| `/about/` | historia, perfil, valores, CV narrativo | SSG |
| `/projects/` | indice de proyectos/casos | SSG + filtros cliente opcionales |
| `/projects/[slug]/` | detalle narrativo por proyecto | SSG + secciones sticky/3D opcionales |
| `/research/` | notas, exploracion, writing tecnico | SSG |
| `/contact/` | contacto y links | SSG |
| `/lab/` | indice de experimentos visuales | SSG |
| `/lab/[experiment-slug]/` | playground de interacciones/3D/audio | SSG + client-only islands |

### Como resolver infinite-scroll-like sin backend

No hace falta paginar desde servidor si el corpus es finito y el objetivo es sensacion de continuidad visual:

- preconstruir una lista estatica de proyectos/items;
- duplicar una secuencia finita en cliente para lograr loop visual;
- mover por `translate3d` y modulo/wrap en lugar de crear contenedores con dimensiones absurdas tipo `#tallDiv`;
- mantener un fallback simple con `overflow-x:auto`, botones y una lista semantica real;
- si la coleccion crece mucho, usar paginacion estatica por pagina/ruta generada en build, no fetch a servidor.

### Como manejar audio/musica de forma segura

- nunca autoplay con sonido;
- pedir opt-in explicito con un control visible y persistente;
- respetar `prefers-reduced-motion` y una preferencia local de mute;
- descargar audio solo despues de interaccion o cuando una isla experimental se monte;
- no hacer que el contenido principal dependa del audio;
- usar microsonidos solo como capa opcional, nunca como unica senal de estado.

### Como mantener SEO pese a interactividad rica

- todo contenido narrativo importante debe existir como HTML pre-renderizado;
- las animaciones no deben reemplazar headings/links reales por canvas-only;
- cada proyecto debe tener una URL propia y metadatos propios;
- overlays/paneles pueden existir como enhancement, pero debe haber una ruta estatica de detalle equivalente;
- clonar elementos para marquees o loops con `aria-hidden="true"` en copias decorativas;
- usar una jerarquia de headings consistente y controlar foco al abrir/cerrar overlays;
- en escenas WebGL, siempre conservar una descripcion textual y un poster fallback.

## E) Limitaciones de hosting estatico y mapa de migracion

### Limitaciones brutales de GitHub Pages / static hosting

- No hay endpoints backend propios para formularios, auth, personalizacion, previews editoriales, A/B testing server-side o procesamiento bajo demanda.
- No hay base de datos ni CMS server-side integrado por default.
- No puedes depender de renderizado dinamico por request ni de SSR real en runtime.
- Cualquier dato dinamico debe venir preconstruido en build o de un servicio externo opcional.
- Optimizaciones de imagen/video en tiempo de request no existen; hay que resolverlas en build o preprocesado.
- Experiencias WebGL muy pesadas siguen siendo posibles, pero el cuello de botella sera el cliente, no el hosting.
- Audio/3D/video grandes pueden volver el sitio lento si no se separan por ruta/isla y carga diferida.
- Si quieres features tipo login, dashboards privados, guardado de preferencias multi-dispositivo o comentarios, GitHub Pages no resuelve eso por si solo.

### Migration map

| Version | Plataforma | Que construir | Que desbloquea |
| --- | --- | --- | --- |
| v1 | Astro SSG + GitHub Pages | portfolio editorial estatico, rutas nested, design system base, motion ligero, 1 o 2 islas interactivas bien controladas | publicacion estable, SEO, base escalable sin backend |
| v2 | mismo stack static-compatible | page transitions, cursor custom, overlays, smooth scroll mas fino, una escena R3F lazy, audio opt-in, `/lab/` experimental | mayor personalidad visual sin romper el modelo estatico |
| v3 | Astro con adapter server o Next.js full, solo si aparece necesidad real | CMS/headless, previews, formularios server-side, contenido personalizado, endpoints propios, busqueda dinamica, features privadas | backend opcional, flujos editoriales y features que GitHub Pages no puede cubrir |

### Regla de migracion

No migrar a servidor solo por querer motion/3D. Casi todo lo observado en Valentin, One Studios, Zolviz e incluso partes de Igloo puede servirse estaticamente si se disena como HTML preconstruido + JS cliente progresivo + assets bien optimizados.

La razon legitima para salir de GitHub Pages seria **necesidad de datos o logica runtime**, no animacion.

## F) Proposed project blueprint

### Estructura de carpetas sugerida

```text
.
|-- public/
|   |-- models/
|   |-- audio/
|   |-- posters/
|   `-- og/
|-- src/
|   |-- assets/
|   |   |-- images/
|   |   |-- textures/
|   |   `-- icons/
|   |-- components/
|   |   |-- ui/
|   |   |-- layout/
|   |   |-- sections/
|   |   |-- motion/
|   |   |-- three/
|   |   `-- overlays/
|   |-- content/
|   |   |-- projects/
|   |   |-- research/
|   |   `-- lab/
|   |-- data/
|   |-- layouts/
|   |-- pages/
|   |   |-- projects/
|   |   |   `-- [slug].astro
|   |   |-- lab/
|   |   |   `-- [slug].astro
|   |   |-- about.astro
|   |   |-- contact.astro
|   |   |-- projects.astro
|   |   `-- index.astro
|   |-- styles/
|   |   |-- tokens.css
|   |   |-- global.css
|   |   `-- motion.css
|   |-- store/
|   `-- utils/
|-- docs/
|-- scripts/
`-- context/
```

### Dependencias sugeridas

**Base**

- `astro`
- `@astrojs/react`
- `react`
- `react-dom`
- `typescript`

**Styling y sistema visual**

- `tailwindcss`
- `postcss`
- `autoprefixer`
- `clsx`

**Motion y scroll**

- `gsap`
- `lenis`

**3D**

- `three`
- `@react-three/fiber`
- `@react-three/drei`

**Estado UI**

- `zustand`

**Contenido opcional**

- `@astrojs/mdx` si los case studies necesitan narrativa rica en Markdown/MDX.

**Calidad**

- `eslint`
- `prettier`

### Naming conventions

- Componentes Astro/React en `PascalCase`.
- Utilidades en `camelCase`.
- Carpetas y slugs en `kebab-case`.
- Tokens CSS con prefijo semantico: `--color-bg`, `--color-accent`, `--font-display`, `--space-4`, `--ease-soft`.
- Componentes de motion con nombre de comportamiento, no de efecto generico: `HeroReveal`, `PinnedNarrativeSection`, `ProjectMarquee`, `MagneticCursor`.

### Component architecture

- **`components/ui/`**: botones, links, tags, cards, badges, icon buttons, captions.
- **`components/layout/`**: header, footer, shell, page wrappers, grids.
- **`components/sections/`**: bloques de pagina con contenido real.
- **`components/motion/`**: wrappers y controllers de animacion scroll/cursor/reveal.
- **`components/three/`**: escenas R3F aisladas, nunca mezcladas con UI editorial base.
- **`components/overlays/`**: menu, project panel, audio toggle, command/palette experimental si aparece.

### Animation architecture

- Un sistema de motion por capas:
  - **CSS primero** para hover, transitions simples y estados UI baratos;
  - **GSAP** para secuencias, scroll narratives, pinned sections y transforms coordinados;
  - **Lenis** como scroll enhancement, no como requisito funcional;
  - **R3F/Three** solo para escenas puntuales.
- Cada animacion compleja debe tener cleanup, soporte de resize y condicion de desactivacion por `prefers-reduced-motion`.
- Evitar que el contenido solo exista dentro de timelines; el DOM base debe ser legible sin JS.

### 3D architecture

- Tratar cada escena como una isla lazy:
  - montar R3F solo cuando la seccion entra a viewport o cuando el usuario activa una experiencia;
  - mostrar poster estatico mientras carga;
  - separar assets GLB/texturas por escena;
  - evitar postprocessing pesado por default;
  - definir un presupuesto por escena antes de producirla.
- Para escenas tipo Igloo, reservar una ruta `/lab/[experiment-slug]/` en lugar de contaminar la home.
- Para heros tipo One Studios, empezar con un unico modelo optimizado y fallback poster.

### Asset organization strategy

- `src/assets/` para imagenes que el build puede procesar/optimizar.
- `public/models/` para `.glb`, `.drc`, `.ktx2` y assets que deban servirse con path estable.
- `public/audio/` para loops y microsonidos, con archivos comprimidos y nombres versionados.
- `public/posters/` para fallbacks visuales de escenas 3D o video.
- Mantener assets fuente pesados, referencias scrapeadas y experimentos sin publicar dentro de `context/`, nunca en la raiz publica.

### Performance checklist

- Definir un presupuesto de JS inicial por ruta y medirlo antes de sumar islas interactivas.
- Lazy-load de escenas 3D, audio y overlays que no sean necesarios en first paint.
- No bloquear LCP con loaders esteticos salvo que exista un motivo narrativo fuerte.
- Optimizar imagenes y servir dimensiones correctas; evitar PNG gigante si WebP/AVIF alcanza.
- Evitar listeners globales duplicados en scroll/mouse; centralizar controladores.
- Throttle/debounce donde aplique y preferir transforms GPU-friendly.
- No usar fisica DOM, shaders pesados y audio al mismo tiempo en mobile v1/v2.
- Medir con Lighthouse/Web Vitals y testear en laptop modesta + telefono real.

### Accessibility checklist

- Respetar `prefers-reduced-motion` y ofrecer una experiencia usable sin animacion intensa.
- Mantener foco visible y controlado, especialmente en overlays, menus y page transitions.
- No depender de cursor custom en touch; no ocultar estados nativos sin alternativa.
- Todo boton/control de audio debe ser alcanzable por teclado y tener nombre accesible.
- No bloquear contenido detras de gates obligatorios en la experiencia principal.
- Mantener jerarquia semantica (`header`, `main`, `nav`, `section`, headings reales).
- Asegurar contraste suficiente, especialmente sobre fondos fotograficos o escenas 3D.
- Duplicados decorativos de marquees/loops con `aria-hidden="true"`.

## G) Implementacion prioritaria

### Orden realista

1. **Base Astro estatica + rutas + layout + SEO**: home, about, projects, project detail, contact, 404, metadata por pagina.
2. **Design tokens + UI system**: tipografia, escala de color, espaciado, grid, buttons, cards, tags, nav.
3. **Motion editorial v1**: reveals, hover states, uno o dos marquees, transiciones CSS/GSAP discretas.
4. **Case studies con narrativa**: paginas de proyecto con imagenes fuertes, secciones sticky moderadas y estructura textual solida.
5. **Menu overlay + cursor custom + project panel opcional**: inspirado en Valentin, pero sin romper teclado/mobile.
6. **Una unica escena 3D hero lazy**: inspiracion One Studios, no Igloo completo; poster fallback obligatorio.
7. **Audio opt-in y microinteracciones sonoras**: solo cuando la base visual ya este estable.
8. **Galeria horizontal / pseudo-infinite loops y experimentos Zolviz-like en `/lab/`**.
9. **Escenas WebGL full-canvas de alta complejidad tipo Igloo**: ultima fase y preferiblemente aisladas por ruta.

### Que debe esperar

- intro gate obligatoria;
- fisica DOM compleja;
- musica ambiente como parte central de home;
- scroll hacks gigantes;
- multiples escenas 3D simultaneas;
- CMS/backend/auth;
- migracion fuera de GitHub Pages solo por ambicion visual.

## H) Decision final

### Stack recomendado unico

**Astro SSG + React islands + TypeScript + Tailwind/CSS Modules + GSAP + Lenis + Three.js/R3F + Zustand + contenido local Markdown/MDX + deploy estatico en GitHub Pages.**

### Por que gana sobre las alternativas

- preserva HTML estatico, SEO y nested routing desde v1;
- permite sumar solo el JS necesario por isla, en lugar de convertir todo el sitio en una SPA;
- encaja naturalmente con una direccion tipo Valentin Cheval: editorial multi-pagina, transiciones, scroll choreography y cursor custom;
- deja una ruta clara para escenas 3D tipo One Studios y laboratorios extremos tipo Igloo/Zolviz sin reescribir todo;
- no te obliga a backend ni Node server en produccion;
- si algun dia necesitas backend/CMS, la migracion puede ser incremental en vez de empezar de cero.

### Que construir ahora mismo para la primera version

Construir **una base Astro estatica y editorial**, no una experiencia full-WebGL:

- home con hero visual fuerte y narrativa clara;
- `/projects/` y `/projects/[slug]/` pre-renderizados;
- design system base;
- motion sobrio pero premium con GSAP;
- una sola isla experimental bien elegida (por ejemplo cursor custom o una micro-escena 3D lazy), no todas a la vez;
- `/lab/` reservado para experimentar sin comprometer la accesibilidad, performance y claridad del sitio principal.

La meta de v1 deberia ser **subir de nivel desde el baseline actual hacia una direccion editorial cinematografica tipo Valentin + One Studios, manteniendo GitHub Pages y dejando Igloo/Zolviz como expansion posterior controlada**.
