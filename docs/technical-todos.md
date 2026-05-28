# Technical todos

Fecha: 2026-05-27

## Alta prioridad

| Area | Pendiente | Motivo |
| --- | --- | --- |
| Build/operacion | Ejecutar `npm.cmd run check` antes de cada entrega tecnica | Evita publicar errores de typecheck o build |
| Documentacion | Mantener `docs/change-log-codex.md` actualizado | Permite continuidad entre sesiones de Codex |
| Contenido publico | Mantener Alpha Signature y Cyrus apuntando a dominios oficiales | Regla explicita del proyecto |
| SEO | Confirmar que `sitemap.xml` y `robots.txt` sigan alineados con rutas indexables | Evita indexar redirects o paginas de compatibilidad |
| Entorno local | Considerar reinstalar `node_modules` si siguen apareciendo paquetes extraneous | Limpieza local; no afecta `package.json` |

## Media prioridad

| Area | Pendiente | Motivo |
| --- | --- | --- |
| Datos | Dividir `src/data/site.ts` por dominios de contenido | Mejora mantenibilidad |
| Estilos | Dividir `src/styles/global.css` por capas si sigue creciendo | Facilita auditoria visual |
| Performance | Optimizar `public/assets/images/baruch-lopez-portrait.jpg` | Imagen pesada para web |
| Accesibilidad | Hacer revision manual de focus states y navegacion por teclado | Refuerza produccion |
| SEO tecnico | Automatizar revision de enlaces internos/externos | Reduce riesgo de links rotos |
| Documentacion | Revisar docs historicos de referencia y marcar obsoletos si aplica | Evita que Codex siga instrucciones viejas |

## Baja prioridad

| Area | Pendiente | Motivo |
| --- | --- | --- |
| Tooling | Evaluar ESLint/Prettier | Util solo si se quiere estandarizacion formal |
| Testing | Agregar smoke test de rutas | Util cuando el sitio crezca |
| Visual QA | Agregar capturas Playwright en cambios visuales grandes | Ayuda con regresiones responsive |
| Assets | Crear variantes responsive de imagenes | Mejora performance futura |
| Legacy | Decidir si `index.html` y `styles.css` deben moverse a archivo historico | Reduciria confusion, pero no es urgente |

## Pendientes de contenido relacionados

Ver tambien:

- `docs/content-todos.md`
- `docs/public-content-source-of-truth.md`

## Pendientes de stack

No hay migracion recomendada. Mantener Astro y evitar nuevas dependencias salvo necesidad real.
