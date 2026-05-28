# Codex operating guide

Fecha: 2026-05-27

## Modo de trabajo esperado

Codex debe tratar este repo como un sitio Astro existente y en produccion, no como un prototipo. El objetivo es hacer cambios pequenos, verificables y documentados.

## Antes de modificar

Revisar primero:

- `AGENTS.md`
- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `src/pages/`
- `src/data/site.ts`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `docs/README.md`
- `docs/public-content-source-of-truth.md`
- `docs/tech-stack-audit.md`

Usar `rg` para verificar referencias antes de eliminar, mover o renombrar.

## Comandos

Instalar:

```powershell
npm.cmd install
```

Desarrollo:

```powershell
npm.cmd run dev
```

Verificacion:

```powershell
npm.cmd run check
```

Build individual:

```powershell
npm.cmd run build
```

Typecheck individual:

```powershell
npm.cmd run typecheck
```

## Que no debe hacer Codex

- No migrar a otro framework sin justificacion tecnica documentada.
- No agregar dependencias por preferencia.
- No editar `dist/`.
- No usar `context/` como fuente publica directa.
- No publicar mirrors, prompts, extracts o screenshots locales.
- No inventar claims profesionales, financieros, legales o comerciales.
- No convertir Alpha Signature o Cyrus en landings internas si la regla vigente es enviar a sitios oficiales.
- No eliminar archivos sin `rg` y sin documentar.

## Dependencias

Codex solo puede agregar una dependencia si:

1. El stack actual no resuelve el problema de forma razonable.
2. La dependencia no duplica una capacidad existente.
3. El paquete esta mantenido.
4. El cambio queda documentado en `docs/tech-stack-audit.md` y `docs/change-log-codex.md`.

## Reglas de contenido

- Lo publico debe ser verificable desde repo, docs o fuentes confirmadas por Baruch.
- Si falta confirmacion, usar copy neutral o dejar el bloque minimo.
- Para hechos incompletos, agregar comentarios como:

```ts
// TODO(content): Confirm the official public name and description before expanding this section.
```

- No dejar TODOs visibles en la UI.

## Reglas de arquitectura

- Mantener paginas como ensambladores.
- Mantener contenido estructurado en `src/data/`.
- Mantener componentes pequenos y reutilizables.
- Preferir HTML estatico y CSS propio.
- Agregar JavaScript cliente solo para interacciones que el usuario realmente necesita.

## Reglas de SEO tecnico

- Cada pagina publica debe tener titulo y descripcion utiles.
- Mantener canonical consistente con `https://baruchlopez.com`.
- Usar `noindex` para rutas de compatibilidad o paginas no pensadas para indexacion.
- Evitar keyword stuffing.
- Mantener sitemap y robots alineados con rutas indexables.

## Regla Alpha/Cyrus

Los botones, tarjetas y CTAs publicos de Alpha Signature y Cyrus deben dirigir siempre a:

- `https://alphasignaturefirm.com/`
- `https://www.cyrusglobalcapital.com/`

Las rutas internas `/alpha-signature/` y `/cyrus-global-capital/` existen solo para compatibilidad y deben redirigir.

## Cierre de una sesion

Antes de entregar:

1. Ejecutar `npm.cmd run check`.
2. Documentar cambios relevantes en `docs/change-log-codex.md`.
3. Actualizar `docs/technical-todos.md` si queda deuda nueva.
4. Reportar comandos ejecutados y riesgos pendientes.
