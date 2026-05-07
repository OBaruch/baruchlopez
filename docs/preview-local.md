# Preview Local

## Comando unico

Pega esta linea en PowerShell desde la raiz del repo:

```powershell
if (!(Test-Path .\node_modules)) { npm.cmd install }; $port=@(43127,43128,43129,45123,48765,51234,54321,61001) | Where-Object { try { $l=[System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback,$_); $l.Start(); $l.Stop(); $true } catch { $false } } | Select-Object -First 1; if (-not $port) { throw 'No hay puertos libres en la lista predefinida.' }; Start-Job -ScriptBlock { param($p) Start-Sleep -Seconds 6; Start-Process "http://localhost:$p" } -ArgumentList $port | Out-Null; .\node_modules\.bin\astro.cmd dev --host 0.0.0.0 --port $port
```

## Que hace

- Instala dependencias solo si `node_modules` no existe.
- Busca el primer puerto libre dentro de una lista de puertos poco comunes.
- Abre el navegador automaticamente en `http://localhost:<puerto>`.
- Arranca Astro en ese puerto y deja el servidor corriendo en la terminal actual.

## Nota

El 2026-05-07 se comprobaron en esta maquina estos puertos y estaban libres en ese momento: `43127`, `43128`, `43129`, `45123`, `48765`, `51234`, `54321` y `61001`.

El comando vuelve a validar disponibilidad antes de arrancar, asi que no depende de que alguno de esos puertos siga libre despues.
