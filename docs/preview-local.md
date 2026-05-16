# Preview Local

## Inicio oficial

Desde la raiz del repo, el comando oficial para levantar el sitio en local es:

```powershell
npm.cmd run dev -- --port 43127
```

## Que hace

- Ejecuta el script `dev` definido en `package.json`.
- Fuerza el uso del puerto `43127` para el servidor local.
- Deja Astro corriendo en la terminal actual y observando cambios de archivos.

## Nota

Si `43127` ya estuviera ocupado, Astro no podra arrancar en ese puerto y habra que liberar ese proceso o elegir otro puerto de forma explicita.
