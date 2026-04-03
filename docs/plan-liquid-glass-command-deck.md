# Plan Liquid Glass Command Deck

## Idea

La home debe sentirse como un **command deck editorial de identidad central**: una primera pantalla con texto muy conciso, retrato cinematico al lado derecho, 4 puertas principales flotando en un panel liquid-glass, y una capa 3D ligera que reacciona al dominio activo sin convertir todo el sitio en una escena pesada.

## Decisiones aplicadas

- **Astro SSG** como capa base para seguir publicando HTML estatico.
- **React islands** solo donde hace falta interaccion o runtime visual.
- **Liquid glass** con `liquid-glass-react` como enhancement en cliente y **fallback glass propio** en SSR para no perder render estatico ni SEO.
- **GSAP + Lenis** para smooth scroll y reveal progresivo.
- **Three/R3F** en una escena ligera, diferida, desktop-only y desactivada con `prefers-reduced-motion`.
- **Zustand** para sincronizar el dominio activo entre gateways y la escena 3D.

## Direccion visual

- Mantener fondo negro, tipografia editorial serif + sans tecnica, bordes finos, blur controlado, y material glass/chrome inspirado en `context/Concept board`.
- El panel de **Core Domains** debe ser el objeto principal de experimentacion liquid-glass.
- El retrato no debe perder identidad por exceso de niebla/oscurecimiento.
- La escena 3D debe sentirse como acento premium, no como protagonista que compite con el contenido.

## Orden de evolucion

### v1 inmediato

- Consolidar Hero + Core Domains en Astro/React.
- Mantener todas las secciones informativas en HTML estatico.
- Usar `{dummie text}` donde falte informacion verificada.
- Conservar redirect estatico de Cyrus hacia `https://www.cyrusglobalcapital.com/`.

### v2

- Crear paginas internas reales para Alpha, Corporate, Lab y Talks/Writing.
- Convertir Lab en un sistema filtrable por metadata estatica.
- Agregar transiciones editoriales entre paginas.
- Refinar 3D y liquid-glass con mas control de performance y fallback.

### v3

- Si aparece una necesidad real de runtime/backend, evaluar migracion fuera de GitHub Pages o agregar un adapter server.
- No migrar a backend solo por motion o 3D.

## Riesgos tecnicos

- `liquid-glass-react` tiene soporte parcial en Safari/Firefox para displacement; por eso se deja fallback visual propio.
- La escena R3F es pesada en bundle; por eso se difiere en idle, solo desktop, y se apaga con `prefers-reduced-motion`.
- El HTML critico debe seguir existiendo pre-renderizado para evitar una home dependiente de JS.

## Siguiente iteracion recomendada

1. Revisar visualmente el Hero en browser y ajustar proporciones/crop del retrato.
2. Medir si el panel liquid-glass necesita mas o menos deformacion.
3. Convertir Alpha, Corporate, Lab y Talks/Writing a rutas Astro separadas.
4. Introducir un primer sistema de project cards con metadata y filtros client-side sobre contenido estatico.
