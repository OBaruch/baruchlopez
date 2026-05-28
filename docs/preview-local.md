# Preview local

## Inicio oficial

Desde la raiz del repo:

```powershell
npm.cmd run dev
```

El script usa el puerto `4321` y host `0.0.0.0` por configuracion de `package.json`.

## Cambiar puerto

Si `4321` esta ocupado, usa un puerto explicito:

```powershell
npm.cmd run dev -- --port 43127
```

## Build y preview de produccion

Validar salida estatica:

```powershell
npm.cmd run build
```

Previsualizar el build:

```powershell
npm.cmd run preview
```

## Verificacion recomendada

Antes de entregar cambios tecnicos o editoriales:

```powershell
npm.cmd run check
```

`check` ejecuta typecheck y build.
