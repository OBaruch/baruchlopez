# Arquitectura estructural del portal y wireframes textuales

## Objetivo

Definir una arquitectura de informacion y una estructura de paginas para una futura evolucion de `baruchlopez.com` sin implementar aun el sitio.

La regla de contenido es estricta: **no inventar informacion factual**. Si falta copy, dato, metrica, descripcion o link, se marca con `{dummie text}` para identificarlo despues y reemplazarlo de forma controlada.

## Principio rector

La web no debe comportarse como un portfolio lineal plano. Debe comportarse como un **portal jerarquico de identidad profesional**, donde:

- **Home** funciona como hub de orientacion;
- **Cyrus Global Capital** y **Alpha Signature** aparecen como puertas explicitas desde raiz;
- **Cyrus Global Capital** debe funcionar como gateway externo hacia `https://www.cyrusglobalcapital.com/`, no como una pagina interna de storytelling propia;
- **Corporate Profile** concentra el perfil profesional formal y la capa corporate-safe;
- **Personal Project Lab** funciona como archivo curado, filtrable y etiquetado;
- **Talks / Writing** deja abierta la capa publica de pensamiento, medios y conferencias;
- **Contact** cierra rutas de colaboracion sin ruido.

## Brand guide operativo a respetar

Esta arquitectura debe seguir el lenguaje visual que ya existe en `styles.css` y la inspiracion material del moodboard `context/Concept board/`.

### Base visual actual desde CSS

- Fondo negro profundo y gradientes oscuros con ruido/luz sutil.
- Superficies glass / frosted con bordes hairline y blur.
- Tipografia serif editorial para titulares: `Cormorant Garamond`.
- Tipografia sans para cuerpo/UI tecnica: `Manrope`.
- Color principal claro tipo marfil sobre negro, con secundarios grises desaturados.
- Microetiquetas uppercase con tracking alto.
- Bordes redondeados amplios y tarjetas flotantes con sombra controlada.

### Inspiracion visual observada en Concept board

- Textura negra fluida tipo aceite/liquido pulido.
- Capsulas de vidrio/metal apiladas, bordes suaves, highlight especular.
- Papel oscuro con emboss fino y sensacion tactil premium.
- Fotografia de lujo en clave oscura: fachadas, reflejos, metal, tipografia serif elegante.
- Composicion editorial con tipografia grande, overlays glass y contraste alto.

### Traduccion estructural de ese brand guide

- Navegacion sobria, pocos items, mucho aire y microcopy uppercase.
- Home con 4 gateways grandes como placas o capsulas dark-glass, no como cards genericas coloridas.
- Corporate/Profile y Cyrus/Alpha con tono institucional oscuro, no UI juguetona.
- Lab puede tener mas experimentacion cinetica, pero sin romper la base editorial.
- Highlights y credentials deben sentirse como una franja o strip premium, no como dashboard denso.
- El lenguaje visual puede mezclar serif editorial grande + paneles translucid dark + textura liquida negra como recurso ambiental.

## Navegacion principal recomendada

### Desktop

Opcion recomendada por claridad y visibilidad de entidades raiz:

```text
Home
Cyrus Global Capital
Alpha Signature
Corporate Profile
Personal Project Lab
Talks / Writing
Contact
```

### Alternativa mas corta

Solo si se decide compactar la barra superior en una iteracion posterior:

```text
Home
Ventures
Corporate
Lab
Media
Contact
```

### Decision propuesta

Mantener **Cyrus Global Capital** y **Alpha Signature** explicitos en la navegacion principal, porque el objetivo estrategico es que esas dos puertas sean visibles desde raiz y no queden escondidas bajo una taxonomia ambigua.

## Sitemap recomendado

```text
/
|-- /cyrus-global-capital/ -> https://www.cyrusglobalcapital.com/
|-- /alpha-signature/
|-- /corporate-profile/
|-- /personal-project-lab/
|   |-- /personal-project-lab/[project-slug]/
|-- /talks-writing/
`-- /contact/
```

## Flujos de usuario que la arquitectura debe soportar

| Usuario | Ruta ideal | Objetivo |
| --- | --- | --- |
| Reclutador / corporate | Home -> Corporate Profile -> LinkedIn / CV / Selected Safe Work | entender perfil profesional formal sin friccion |
| Cliente / partner | Home -> Alpha Signature o Cyrus Global Capital -> Contact / sitio oficial Cyrus | entender propuesta institucional y abrir conversacion |
| Tecnico / curioso | Home -> Personal Project Lab -> Proyecto individual -> GitHub | explorar proyectos, stacks y artefactos publicos |
| Audiencia publica / media | Home -> Talks / Writing -> Contact / LinkedIn | acceder a charlas, escritura y futuros medios |

## Arquitectura exacta recomendada de Home

Orden de secciones:

1. Hero
2. 4 Main Gateways
3. Executive Overview
4. Selected Highlights
5. Optional Selected Projects Preview
6. Credibility Strip
7. Contact Footer

### Logica del orden

- primero orienta;
- luego abre puertas;
- luego da contexto ejecutivo;
- luego prueba credibilidad;
- luego ofrece salida/contacto.

### Que NO debe cargar la Home

- lista larga de certificaciones;
- timeline completa;
- blog feed extenso;
- todos los proyectos del Lab;
- demasiados links sociales;
- videos viejos o informales;
- narrativa autobiografica demasiado larga.

La Home debe **abrir puertas**, no agotar al usuario.

## Wireframe textual exacto de Home

### 1) Hero

**Funcion**

- presentar a Baruch;
- ubicar al visitante en 1-2 segundos;
- explicar que puertas existen en el sitio;
- ofrecer un CTA principal y uno secundario.

**Estructura**

```text
[Top Nav]

[Hero Section]
Eyebrow: BARUCHLOPEZ.COM / {dummie text}
H1: Baruch Lopez
Subheadline: {dummie text}
One-liner: {dummie text}
Short supporting copy: {dummie text}

[Primary CTA] Explore Personal Project Lab
[Secondary CTA] View Corporate Profile

[Optional ambient visual]
- dark liquid texture / glass capsule / subtle reflective motion
- no full WebGL obligatorio en v1
```

### 2) 4 Main Gateways

**Funcion**

Mostrar las 4 puertas principales sin sobrecargar texto.

**Estructura de cada gateway card**

```text
[Gateway Card]
Section label: {dummie text}
Title: Cyrus Global Capital / Alpha Signature / Corporate Profile / Personal Project Lab
One sentence summary: {dummie text}
Tags: {dummie text} / {dummie text} / {dummie text} / {dummie text}
CTA: Explore
```

**Regla visual**

Cards tipo placa/capsula dark-glass, borde hairline, serif grande para titulo, microcopy uppercase, textura negra liquida o highlight metalico muy sutil.

### 3) Executive Overview

**Funcion**

Dar una lectura rapida del ecosistema profesional para quien llega sin contexto.

**Estructura**

```text
[Section Label] EXECUTIVE OVERVIEW
[Title] {dummie text}
[Body]
- {dummie text}
- {dummie text}
- {dummie text}

[Intersection Strip]
AI / Data / Finance / Strategy / {dummie text}
```

### 4) Selected Highlights

**Funcion**

Dar densidad y prueba de trayectoria sin obligar a leer todas las paginas.

**Regla**

No mas de 4-6 highlights.

**Estructura**

```text
[Highlight Card]
Label: {dummie text}
Title: {dummie text}
1-line summary: {dummie text}
Meta: {dummie text}
```

**Buckets posibles**

- Bosch / enterprise data & AI;
- Cyrus / finance & governance;
- Alpha / consulting;
- talks / speaking;
- selected project;
- MBA / current academic direction.

### 5) Optional Selected Projects Preview

**Funcion**

Previsualizar 2-4 proyectos representativos del Lab sin duplicar todo el archivo.

**Estructura**

```text
[Project Preview Rail or Grid]
Project title: {dummie text}
One-line summary: {dummie text}
Tags: {dummie text}
Status: Public / Private Summary / In Progress / Archived
CTA: Open Project
```

### 6) Credibility Strip

**Funcion**

Reforzar confianza de forma ligera, no convertirla en una seccion pesada.

**Estructura**

```text
[Credibility Strip]
Bosch Mexico
UdeG
MBA in progress
{dummie text}
GitHub
LinkedIn
```

### 7) Contact Footer

**Funcion**

Dar un siguiente paso claro.

**Estructura**

```text
[Section Label] CONTACT
[Title] {dummie text}
[Short intro] {dummie text}
[Contact Links]
- Email: {dummie text}
- LinkedIn: {dummie text}
- GitHub: https://github.com/OBaruch
- Collaboration focus: {dummie text}
```

## Arquitectura por pagina

## 1) Cyrus Global Capital

Esta entrada **no debe evolucionar como una pagina interna larga**. Su comportamiento principal debe ser **redirigir a `https://www.cyrusglobalcapital.com/`**.

Si por razones de UX o tracking se conserva una ruta interna `/cyrus-global-capital/`, esa ruta debe comportarse como **pagina puente de salida** con mensaje minimo y redireccion/CTA al sitio oficial, no como una landing narrativa duplicada.

### Secciones

```text
[Redirect / Bridge]
Label: CYRUS GLOBAL CAPITAL
H1: Cyrus Global Capital
Summary: Estas siendo redirigido al sitio oficial de Cyrus Global Capital.
Primary CTA: Continue to Cyrus Global Capital
Primary CTA URL: https://www.cyrusglobalcapital.com/
Contact route: /contact/
```

### Que no meter

- una landing institucional duplicada si el sitio oficial ya vive en `https://www.cyrusglobalcapital.com/`;
- demasiado personal branding;
- tono informal;
- proyectos mezclados que no pertenezcan a esta capa;
- detalle sensible que no este validado publicamente.

## 2) Alpha Signature

Debe funcionar como landing clara de consultoria/servicios, con posicionamiento sobrio y CTA de contacto o sitio oficial.

### Secciones

```text
[Intro]
Label: ALPHA SIGNATURE
H1: Alpha Signature
Summary: {dummie text}
CTA: {dummie text}

[What Alpha Signature Is]
Description: {dummie text}

[Problems It Solves]
- {dummie text}
- {dummie text}
- {dummie text}

[Areas of Work]
- {dummie text}
- {dummie text}
- {dummie text}

[Operating Model]
Model summary: {dummie text}

[Why It Exists]
Thesis: {dummie text}

[Founder / Led by Baruch Lopez]
Founder note: {dummie text}

[CTA / Link out]
Official site: {dummie text}
Contact route: /contact/
```

## 3) Corporate Profile

Esta pagina resuelve la capa profesional formal y corporate-safe sin convertir la Home en CV ni mezclar ruido de compliance con el Lab.

### Secciones

```text
[Intro]
Label: CORPORATE PROFILE
H1: Corporate Profile
Professional intro: {dummie text}
Current focus summary: {dummie text}

[Current Role]
Company/context: Bosch Mexico
High-level role description: {dummie text}
Work scope:
- AI / data / analytics
- SAP-to-modern-data / dashboards / business systems
- {dummie text}

[Capabilities]
- AI / ML: {dummie text}
- Data engineering: {dummie text}
- BI / dashboards: {dummie text}
- Business-facing analytics: {dummie text}
- Documentation / enablement / workshops: {dummie text}

[Selected Safe Work]
- Production analytics: {dummie text}
- Scrap / PPC dashboards: {dummie text}
- SAP data modernization: {dummie text}
- Cross-functional analytics support: {dummie text}

[Credentials]
- LinkedIn: {dummie text}
- CV: {dummie text}
- Selected certifications: {dummie text}

[Compliance Note]
Only non-confidential, high-level summaries are presented.
```

### Navegacion secundaria interna

```text
Overview
Experience
Capabilities
Selected Work
Credentials
```

### Reglas de contenido

- no usar branding o claims no validados;
- no publicar detalles sensibles, cifras internas, nombres de sistemas no publicos o capturas con informacion operativa;
- si una descripcion no esta revisada, dejar `{dummie text}`;
- mantener esta pagina mas sobria e institucional que Lab.

## 4) Personal Project Lab

Esta debe ser la parte mas estructurada del sitio. No debe ser una simple galeria; debe ser un **archivo navegable con taxonomia clara**.

### Landing del Lab

```text
[Intro]
Label: PERSONAL PROJECT LAB
H1: Personal Project Lab
Short explanation: {dummie text}
Visibility system explanation: {dummie text}

[Filters / Controls]
Category: All / AI-ML / Finance / Data Engineering / Automation / Robotics / Experimental
Visibility: All / Public / Private Summary / In Progress / Archived
Affiliation: All / Independent / Cyrus / Alpha / Corporate-safe
Year: {dummie text}

[Featured Projects]
Curated set of top projects

[Browse by Category]
AI / ML
Finance
Data Engineering
Automation
Robotics
Experimental

[Browse by Visibility]
Public
Private Summary
In Progress
Archived

[All Projects]
Full curated list
```

### Estructura de cada project card

```text
[Project Card]
Project name: {dummie text}
One-line description: {dummie text}
Type: Tool / Dashboard / Model / Research / Automation / Concept
Affiliation: Independent / Cyrus / Alpha / Corporate-safe
Visibility: Public / Private Summary / In Progress / Archived
Status: Public / Private Summary / In Progress / Archived
Domain tags: AI / Finance / Data / Ops / Robotics / {dummie text}
Year: {dummie text}
CTA: Open Project
```

### Navegacion secundaria interna

```text
Featured
Categories
Visibility
All Projects
```

### Estructura base de una pagina individual de proyecto

```text
[Project Hero]
Title: {dummie text}
Short summary: {dummie text}
Metadata chips:
- Status: Public / Private Summary / In Progress / Archived
- Affiliation: Independent / Cyrus / Alpha / Corporate-safe
- Type: Tool / Dashboard / Model / Research / Automation / Concept
- Domain: AI / Finance / Data / Ops / Robotics / {dummie text}
- Year: {dummie text}

[Context]
{dummie text}

[Objective]
{dummie text}

[Approach]
{dummie text}

[Stack]
{dummie text}

[Outcome]
{dummie text}

[Notes / Constraints]
{dummie text}

[Links if Public]
GitHub: {dummie text}
Demo: {dummie text}
Related writing: {dummie text}
```

### Variantes de profundidad por tipo de proyecto

| Variante | Uso | Regla |
| --- | --- | --- |
| Full Public Project | proyecto con repo/demo/publicacion visible | mostrar stack, proceso, resultados y links |
| Private Summary | proyecto real pero con restricciones | mostrar solo descripcion high-level y constraints |
| Concept / In Progress | idea, prototipo o experimento no cerrado | marcar estado claramente y evitar claims fuertes |

## 5) Talks / Writing

Aunque el contenido no este completo, esta ruta debe existir como contenedor desde temprano porque abre la capa de charlas, escritura, libros, podcast, YouTube o pensamiento publico futuro.

### Secciones

```text
[Intro]
Label: TALKS / WRITING
H1: Talks / Writing
Summary: {dummie text}

[Talks]
- Talk title: {dummie text}
  Date: {dummie text}
  Venue/Event: {dummie text}
  Summary: {dummie text}
  Link: {dummie text}

[Writing / Essays]
- Essay title: {dummie text}
  Summary: {dummie text}
  Status: {dummie text}

[Media / Interviews]
- Media item: {dummie text}

[Future Work]
- Books / podcast / YouTube / {dummie text}
```

### Navegacion secundaria interna

```text
Talks
Writing
Media
```

## 6) Contact

Pagina simple, directa, sin sobrecargar.

### Secciones

```text
[Intro]
Label: CONTACT
H1: Contact
Short intro: {dummie text}

[Collaboration Types]
- Consulting: {dummie text}
- Ventures: {dummie text}
- Speaking / media: {dummie text}
- Technical collaborations: {dummie text}

[Contact Methods]
Email: {dummie text}
LinkedIn: {dummie text}
GitHub: https://github.com/OBaruch

[Optional simple form]
No implementar en v1 si requiere backend.
```

## Modelo de contenido recomendado

## 1) Metadata de paginas principales

| Campo | Home | Cyrus | Alpha | Corporate | Lab | Talks/Writing | Contact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `title` | si | si | si | si | si | si | si |
| `seoDescription` | si | si | si | si | si | si | si |
| `heroLabel` | si | si | si | si | si | si | si |
| `heroTitle` | si | si | si | si | si | si | si |
| `heroSummary` | si | si | si | si | si | si | si |
| `primaryCtaLabel` | si | si | si | opcional | si | opcional | opcional |
| `primaryCtaHref` | si | si | si | opcional | si | opcional | opcional |
| `secondaryCtaLabel` | si | opcional | opcional | opcional | opcional | opcional | opcional |
| `secondaryCtaHref` | si | opcional | opcional | opcional | opcional | opcional | opcional |
| `sections[]` | si | si | si | si | si | si | si |

Si algun campo aun no esta definido, no forzar copy provisional inventado: usar `{dummie text}`.

## 2) Metadata de proyectos del Lab

| Campo | Tipo | Valores / notas |
| --- | --- | --- |
| `slug` | string | identificador de ruta |
| `title` | string | nombre del proyecto |
| `summary` | string | 1 linea; `{dummie text}` si no hay copy validado |
| `status` | enum | `Public`, `Private Summary`, `In Progress`, `Archived` |
| `affiliation` | enum | `Independent`, `Cyrus`, `Alpha`, `Corporate-safe` |
| `type` | enum | `Tool`, `Dashboard`, `Model`, `Research`, `Automation`, `Concept` |
| `domain` | string[] | `AI`, `Finance`, `Data`, `Ops`, `Robotics`, `Experimental`, `{dummie text}` |
| `year` | number/string | `{dummie text}` si no esta confirmado |
| `featured` | boolean | si aparece en Home o en Featured Projects |
| `heroAsset` | string | poster/imagen/video; `{dummie text}` si falta |
| `stack` | string[] | tecnologias publicables |
| `visibilityNote` | string | restricciones o nota corporate-safe |
| `links.github` | string | `{dummie text}` si no aplica o no esta listo |
| `links.demo` | string | `{dummie text}` si no aplica o no esta listo |
| `links.external` | string | Cyrus/Alpha/article/etc si aplica |

## 3) Metadata de talks / writing

| Campo | Tipo | Notas |
| --- | --- | --- |
| `kind` | enum | `Talk`, `Essay`, `Media`, `Future` |
| `title` | string | `{dummie text}` si falta titulo final |
| `date` | string | `{dummie text}` si no esta validado |
| `venue` | string | aplica a talks/media |
| `summary` | string | descripcion corta |
| `status` | string | draft, upcoming, published, archived, `{dummie text}` |
| `url` | string | link publico si existe |

## Sistema minimo viable recomendado para v1

### Paginas obligatorias

- Home
- Cyrus Global Capital
- Alpha Signature
- Corporate Profile
- Personal Project Lab
- Contact

### Pagina opcional desde v1

- Talks / Writing

### Decisiones de contenido que deben definirse antes de disenar

1. **Que si y que no va en Home**
   - lista final de 4 gateways;
   - one-liner real del Hero;
   - 4-6 Selected Highlights;
   - items exactos del Credibility Strip.

2. **Que proyectos entran al Lab**
   - lista inicial de proyectos;
   - status de cada uno;
   - affiliation y domain tags;
   - cuales son `Public` vs `Private Summary`.

3. **Que puede mostrarse en Corporate Profile**
   - copy corporate-safe;
   - lista de capacidades publicables;
   - selected safe work sin riesgo de compliance;
   - links publicos permitidos.

4. **Que links publicos si se van a mostrar**
   - LinkedIn: `{dummie text}`
   - GitHub: `https://github.com/OBaruch`
   - Sitio Cyrus: `https://www.cyrusglobalcapital.com/`
   - Sitio Alpha: `{dummie text}`
   - CV publico: `{dummie text}`

## Reglas para placeholders `{dummie text}`

- Usar `{dummie text}` solo cuando falte informacion factual, copy validado o un link confirmado.
- No reemplazar `{dummie text}` por frases "bonitas" sin fuente.
- En futuras implementaciones, poder buscar ese tag para localizar rapidamente todo el contenido pendiente.
- No usar `{dummie text}` para decisiones de arquitectura ya definidas; solo para contenido/datos aun no cerrados.

## Conclusion estructural

La arquitectura recomendada queda asi:

- **Home como hub**;
- **4 bloques principales como puertas raiz**;
- **Corporate Profile como capa formal y compliance-safe**;
- **Personal Project Lab como archivo filtrable y etiquetado**;
- **Talks / Writing como expansion publica de pensamiento y media**;
- **Contact como salida clara**.

La prioridad de diseno no debe ser densidad informativa, sino una estructura jerarquica clara con estetica dark luxury / liquid glass alineada al CSS actual y al moodboard local.
