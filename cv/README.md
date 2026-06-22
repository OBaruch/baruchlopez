# CVs por rol — Baruch Lopez

Esta carpeta contiene un CV por cada rol al que se aplica. **Cada rol vive en su propia
subcarpeta** y dentro están su HTML y su PDF (y notas opcionales del rol).

## Estructura

```
cv/
├── README.md                ← este índice y la convención (no borrar)
└── <rol-en-kebab-case>/
    ├── baruch-lopez-<rol>-cv.html   ← CV premium standalone
    ├── baruch-lopez-<rol>-cv.pdf    ← PDF para ATS y revisión humana
    └── README-CV.md                 ← notas, fuentes y matriz de claims del rol
```

### Convención de nombres

- Subcarpeta: nombre del rol en `kebab-case`, en inglés y conciso.
  Ej.: `gen-ai-architect`, `ml-engineer`, `data-engineer`, `solutions-architect`.
- Archivos: `baruch-lopez-<rol>-cv.html` y `baruch-lopez-<rol>-cv.pdf`.

## CVs disponibles

| Rol | Carpeta | Estado |
| --- | --- | --- |
| GenAI Architect | [gen-ai-architect/](gen-ai-architect/) | Activo |

## Cómo se crea un CV nuevo (para otro rol)

1. Crear `cv/<rol-en-kebab-case>/`.
2. Generar `baruch-lopez-<rol>-cv.html` reaprovechando el diseño del CV existente
   (`gen-ai-architect`) como base y **re-enfocando** resumen, skills, bullets y
   posicionamiento hacia el rol objetivo.
3. Generar el PDF desde el HTML (ver comando abajo).
4. Escribir `README-CV.md` del rol con: política de fuentes, matriz de claims,
   alineación rol↔evidencia y pendientes por confirmar.
5. Agregar la fila correspondiente en la tabla "CVs disponibles".

## Fuente de verdad: SIEMPRE usar todo el contexto profesional

Todo CV debe construirse usando **todo** el material de la trayectoria profesional,
no solo lo que ya está en un CV previo. Fuentes priorizadas en este repo:

- `BARUCH LOPEZ TRAYECTORIA PORFESIONAL PERSONAL/` — archivo maestro privado
  (proyectos, participaciones, universidad, iniciativas, tech stack, material
  CV-ready en `08_CV_READY_MATERIAL/`). **Está en `.gitignore`, no se publica.**
- `BARUCH LOPEZ TRAYECTORIA PROFESIONAL PERSONAL_CENSURADO_PARA_GITHUB/` — versión
  censurada y publicable de lo anterior.
- Sitio público Astro (`src/`, `content/`), `index.html`, `README.md` del repo.
- Datos de LinkedIn, certificados y metadatos de repos públicos de GitHub.
- Actualizaciones directas del usuario (registrarlas con fecha en el `README-CV.md`
  del rol).



## Regeneración del PDF (desde la raíz del repo)

```powershell
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$PWD\cv\<rol>\baruch-lopez-<rol>-cv.pdf" "$PWD\cv\<rol>\baruch-lopez-<rol>-cv.html"
```

Validar extracción de texto (ATS) con PyMuPDF:

```powershell
@'
import fitz
doc = fitz.open(r"cv/<rol>/baruch-lopez-<rol>-cv.pdf")
text = "\n".join(page.get_text() for page in doc)
print(len(text))
print(text[:2000])
'@ | py -3 -
```
