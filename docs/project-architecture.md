# Project architecture

Fecha: 2026-05-27

## Proposito del proyecto

Sitio personal/profesional de Baruch Lopez. Debe funcionar como hub publico para identidad profesional, perfil ejecutivo, Alpha Signature, iniciativas financieras publicas, proyectos seleccionados, manifesto y contacto.

## Estructura actual

```text
.
|-- .github/workflows/
|   `-- deploy.yml
|-- public/
|   |-- assets/
|   |-- CNAME
|   |-- robots.txt
|   `-- sitemap.xml
|-- src/
|   |-- components/
|   |-- data/
|   |-- layouts/
|   |-- pages/
|   `-- styles/
|-- docs/
|-- scripts/
|-- context/        # local-only, ignored
|-- index.html      # legacy snapshot
|-- styles.css      # legacy snapshot
|-- astro.config.mjs
|-- package.json
|-- package-lock.json
`-- tsconfig.json
```

## Fuente de verdad

La fuente de verdad para el sitio publico es:

- `src/`
- `public/`
- `astro.config.mjs`
- `tsconfig.json`
- `package.json`
- `.github/workflows/deploy.yml`

La raiz legacy (`index.html`, `styles.css`, `CNAME`) no debe recibir nuevas funcionalidades.

## Rutas

Rutas principales:

- `/`
- `/about/`
- `/experience/`
- `/projects/`
- `/projects/[slug]/`
- `/corporate/`
- `/credentials/`
- `/contact/`
- `/manifesto/`
- `/timeline/`

Rutas de compatibilidad:

- `/alpha-signature/` redirige a `https://alphasignaturefirm.com/`.
- `/cyrus-global-capital/` redirige a `https://www.cyrusglobalcapital.com/`.

## Convenciones de carpetas

### `src/pages/`

Una carpeta por ruta publica. Mantener las paginas como ensambladores de contenido: importan data, layout y componentes, pero no deben acumular logica compleja.

### `src/components/`

Componentes Astro reutilizables. Preferir props claras y nombres orientados a uso:

- `PageHero`
- `SectionHeader`
- `CTASection`
- `ProjectCard`
- `LinkButton`

Evitar componentes demasiado especificos si solo encapsulan un texto que pertenece a `src/data/`.

### `src/data/`

Contenido estructurado y reusable. Reglas:

- Usar objetos tipados.
- Evitar duplicar el mismo claim en varias rutas.
- Mantener links oficiales en un solo lugar cuando sea posible.
- No poner contenido no verificado en data publica.
- `recognitions.ts` contiene solo datos publicos del Mural de Reconocimientos; el inventario maestro con rutas locales vive en `data/recognitions.json`.

Pendiente recomendado: dividir `site.ts` en modulos por dominio cuando el mantenimiento lo justifique:

```text
src/data/
|-- site.ts
|-- navigation.ts
|-- projects.ts
|-- profile.ts
|-- ventures.ts
`-- manifesto.ts
```

### `src/styles/`

`global.css` contiene tokens, base, layouts y componentes visuales. Mantener CSS propio mientras siga siendo simple. Si crece mas, dividir por capas:

```text
src/styles/
|-- global.css
|-- tokens.css
|-- base.css
|-- layout.css
`-- components.css
```

### `public/`

Assets servidos directamente. Reglas:

- Usar nombres descriptivos.
- Optimizar imagenes grandes antes de produccion.
- Mantener `robots.txt`, `sitemap.xml`, `CNAME` y `.nojekyll` aqui.
- No publicar archivos de trabajo, mirrors ni material sensible.
- `public/recognitions/` contiene previews WebP optimizadas para el Mural de Reconocimientos, no documentos originales.

### `docs/`

Documentacion tecnica, editorial, operativa y de decisiones. Todo cambio relevante debe quedar registrado si afecta futuras sesiones de trabajo.

### `context/`

Material local-only. No exponer ni referenciar desde UI publica.

## Convenciones de componentes

- Un componente debe tener responsabilidad clara.
- Props con nombres publicos y explicitos.
- Links externos deben tener `target="_blank"` y `rel="noreferrer"` cuando corresponda.
- CTAs hacia Alpha Signature y Cyrus deben usar sus dominios oficiales.
- Evitar estado cliente salvo que haya una interaccion real.

## Convenciones de contenido

- Copy publico debe estar verificado o ser neutral.
- No inventar clientes, metricas, roles, fondos, alianzas o resultados.
- Usar comentarios TODO cuando falte confirmacion.
- Mantener tono personal, ejecutivo, sobrio y humano.

## Convenciones de estilos

- Mantener custom properties para color, espaciado y sombras.
- Evitar paletas de una sola nota.
- Mantener focus states visibles.
- Evitar efectos visuales que compitan con lectura.
- Verificar mobile antes de cerrar cambios visuales.

## Estructura recomendada

Mantener la estructura actual. La mejora prioritaria no es mover carpetas, sino:

1. Seguir extrayendo contenido largo de `site.ts` cuando sea necesario.
2. Dividir `global.css` si el archivo se vuelve dificil de auditar.
3. Optimizar imagenes.
4. Agregar tooling liviano de calidad solo cuando aporte valor real.
