from __future__ import annotations

import hashlib
import json
import os
import re
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import fitz
import pytesseract
from PIL import Image, ImageDraw, ImageFilter, ImageOps, UnidentifiedImageError


PROJECT_ROOT = Path(__file__).resolve().parents[2]
TRAJECTORY_ROOT = Path(os.environ.get("RECOGNITIONS_TRAJECTORY_ROOT", Path.home() / "OneDrive" / "Trayectoria Baruch"))
SOURCE_ROOT = TRAJECTORY_ROOT / "Certificados"
PUBLIC_PREVIEW_DIR = PROJECT_ROOT / "public" / "recognitions"
PUBLIC_DATA_FILE = PROJECT_ROOT / "src" / "data" / "recognitions.ts"
AUDIT_REPORT = PROJECT_ROOT / "docs" / "mural-document-audit.md"
CONTEXT_DIR = PROJECT_ROOT / "context" / "recognitions-curation"
TEXT_CACHE = CONTEXT_DIR / "visual_text_extracts.json"
TESSERACT_EXE = Path(os.environ.get("TESSERACT_EXE", r"C:\Program Files\Tesseract-OCR\tesseract.exe"))

PDF_EXTENSIONS = {".pdf"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp"}
AUXILIARY_EXTENSIONS = {".txt", ".xml", ".py", ".ini"}
SUPPORTED_EXTENSIONS = PDF_EXTENSIONS | IMAGE_EXTENSIONS | AUXILIARY_EXTENSIONS


def load_text_cache() -> dict[str, dict[str, Any]]:
    if not TEXT_CACHE.exists():
        return {}
    try:
        rows = json.loads(TEXT_CACHE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return {row["hash"]: row for row in rows if isinstance(row, dict) and row.get("hash")}


TEXT_CACHE_BY_HASH = load_text_cache()

MONTHS = {
    "jan": 1,
    "january": 1,
    "enero": 1,
    "feb": 2,
    "february": 2,
    "febrero": 2,
    "mar": 3,
    "march": 3,
    "marzo": 3,
    "apr": 4,
    "april": 4,
    "abril": 4,
    "may": 5,
    "mayo": 5,
    "jun": 6,
    "june": 6,
    "junio": 6,
    "jul": 7,
    "july": 7,
    "julio": 7,
    "aug": 8,
    "august": 8,
    "agosto": 8,
    "sep": 9,
    "sept": 9,
    "september": 9,
    "septiembre": 9,
    "oct": 10,
    "october": 10,
    "octubre": 10,
    "nov": 11,
    "november": 11,
    "noviembre": 11,
    "dec": 12,
    "december": 12,
    "diciembre": 12,
}


def strip_accents(value: str) -> str:
    return "".join(char for char in unicodedata.normalize("NFD", value) if unicodedata.category(char) != "Mn")


def normalize(value: str) -> str:
    value = strip_accents(value).lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def clean(value: str) -> str:
    value = re.sub(r"\s+", " ", value or "")
    value = value.replace("–", "-").replace("—", "-")
    return value.strip(" \t\r\n-|")


def title_case(value: str) -> str:
    value = clean(value)
    if not value:
        return ""
    if value.isupper() and len(value) > 6:
        return value.title()
    return value


def slugify(value: str, fallback: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", normalize(value)).strip("-")
    return slug[:92].strip("-") or fallback


def make_date(year: int, month: int, day: int) -> str | None:
    try:
        return datetime(year, month, day).date().isoformat()
    except ValueError:
        return None


def parse_date_from_text(text: str) -> tuple[str, str, str | None, int | None]:
    source = clean(text)
    normalized = strip_accents(source).lower()
    month_names = "|".join(sorted(map(re.escape, MONTHS), key=len, reverse=True))

    scoped_patterns = [
        r"completion date\s+([^\n\r]+)",
        r"course completed on\s+([a-z]{3,9}\s+\d{1,2},?\s+\d{4})",
        r"completed on\s+([a-z]{3,9}\s+\d{1,2},?\s+\d{4})",
        r"on\s+(\d{1,2}/\d{1,2}/\d{4})",
    ]
    for pattern in scoped_patterns:
        match = re.search(pattern, normalized, re.I)
        if match:
            candidate = clean(match.group(1).split(" america/")[0])
            visible, precision, sort_date, year = parse_date_literal(candidate)
            if sort_date or year:
                return visible, precision, sort_date, year

    range_match = re.search(r"\b(\d{1,2})\s*,\s*(\d{1,2})\s*y\s*(\d{1,2})\s+de\s+(" + month_names + r")\s+de\s+((?:19|20)\d{2})\b", normalized)
    if range_match:
        day = int(range_match.group(1))
        month = MONTHS[range_match.group(4)]
        year = int(range_match.group(5))
        return clean(range_match.group(0)), "day", make_date(year, month, day), year

    visible, precision, sort_date, year = parse_date_literal(source)
    return visible, precision, sort_date, year


def parse_date_literal(value: str) -> tuple[str, str, str | None, int | None]:
    normalized = strip_accents(value).lower()
    month_names = "|".join(sorted(map(re.escape, MONTHS), key=len, reverse=True))

    for match in re.finditer(rf"\b(\d{{1,2}})[/\-| ]({month_names})[/\-| ]((?:19|20)\d{{2}})\b", normalized):
        day = int(match.group(1))
        month = MONTHS[match.group(2)]
        year = int(match.group(3))
        return clean(match.group(0)), "day", make_date(year, month, day), year

    for match in re.finditer(rf"\b(\d{{1,2}})\s+de\s+({month_names})\s+de\s+((?:19|20)\d{{2}})\b", normalized):
        day = int(match.group(1))
        month = MONTHS[match.group(2)]
        year = int(match.group(3))
        return clean(match.group(0)), "day", make_date(year, month, day), year

    for match in re.finditer(rf"\b({month_names})\s+(\d{{1,2}}),?\s+((?:19|20)\d{{2}})\b", normalized):
        month = MONTHS[match.group(1)]
        day = int(match.group(2))
        year = int(match.group(3))
        return clean(match.group(0)), "day", make_date(year, month, day), year

    for match in re.finditer(r"\b(\d{1,2})/(\d{1,2})/((?:19|20)\d{2})\b", normalized):
        first = int(match.group(1))
        second = int(match.group(2))
        year = int(match.group(3))
        month, day = (first, second) if first <= 12 else (second, first)
        return clean(match.group(0)), "day", make_date(year, month, day), year

    for match in re.finditer(rf"\b({month_names})\s+((?:19|20)\d{{2}})\b", normalized):
        month = MONTHS[match.group(1)]
        year = int(match.group(2))
        return clean(match.group(0)), "month", make_date(year, month, 1), year

    return "", "", None, None


def render_pdf(path: Path, zoom: float = 1.7) -> tuple[Image.Image | None, int, str]:
    try:
        with fitz.open(path) as doc:
            page = doc.load_page(0)
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
            return Image.frombytes("RGB", [pix.width, pix.height], pix.samples), doc.page_count, ""
    except Exception as exc:
        return None, 0, str(exc)


def extract_text_and_image(path: Path) -> tuple[str, Image.Image | None, int, str, str]:
    ext = path.suffix.lower()
    file_hash = hashlib.sha256(path.read_bytes()).hexdigest()
    cached = TEXT_CACHE_BY_HASH.get(file_hash)
    text = ""
    image: Image.Image | None = None
    page_count = 0
    source = ""
    error = ""

    if ext in PDF_EXTENSIONS:
        try:
            with fitz.open(path) as doc:
                page_count = doc.page_count
                text = "\n".join(page.get_text("text") or "" for page in list(doc)[: min(3, page_count)])
                source = "pdf-text" if len(normalize(text)) > 40 else ""
        except Exception as exc:
            error = str(exc)
        image, _, render_error = render_pdf(path)
        error = "; ".join(part for part in [error, render_error] if part)
    elif ext in IMAGE_EXTENSIONS:
        try:
            with Image.open(path) as raw:
                image = ImageOps.exif_transpose(raw.convert("RGB"))
        except (UnidentifiedImageError, OSError) as exc:
            error = str(exc)
    elif ext in AUXILIARY_EXTENSIONS:
        try:
            raw = path.read_bytes()
            for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
                try:
                    text = raw.decode(encoding)
                    source = "text-file"
                    break
                except UnicodeDecodeError:
                    continue
        except Exception as exc:
            error = str(exc)

    if cached:
        text = cached.get("text") or text
        source = cached.get("text_source") or source
        page_count = cached.get("page_count") or page_count
        error = error or cached.get("render_error") or ""

    if image is not None and not cached and len(normalize(text)) < 80 and TESSERACT_EXE.exists():
        pytesseract.pytesseract.tesseract_cmd = str(TESSERACT_EXE)
        try:
            prepared = ImageOps.autocontrast(image.convert("L"))
            max_side = max(prepared.size)
            if max_side < 1800:
                scale = min(3, 1800 / max_side)
                prepared = prepared.resize((int(prepared.width * scale), int(prepared.height * scale)))
            try:
                osd = pytesseract.image_to_osd(prepared, config="--psm 0", timeout=8)
                rotate_match = re.search(r"Rotate:\s*(\d+)", osd)
                if rotate_match:
                    rotation = int(rotate_match.group(1))
                    if rotation:
                        image = image.rotate(360 - rotation, expand=True)
                        prepared = prepared.rotate(360 - rotation, expand=True)
            except Exception:
                pass
            ocr_text = pytesseract.image_to_string(prepared, lang="spa+eng", config="--psm 6", timeout=20)
            if len(normalize(ocr_text)) > len(normalize(text)):
                text = ocr_text
                source = "ocr"
        except Exception as exc:
            error = "; ".join(part for part in [error, f"OCR: {exc}"] if part)

    return text, image, page_count, source, error


def is_sensitive(text: str) -> bool:
    normalized = normalize(text)
    sensitive_terms = [
        "global id",
        "curp",
        "rfc",
        "folio",
        "cedula",
        "qr",
        "codigo qr",
        "fecha de nacimiento",
        "nacimiento",
        "student number",
        "matricula",
        "telefono",
        "domicilio",
    ]
    if any(term in normalized for term in sensitive_terms):
        return True
    if re.search(r"\b[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d\b", strip_accents(text).upper()):
        return True
    return False


def category_from_title(title: str, text: str) -> tuple[str, str, list[str]]:
    normalized = normalize(f"{title} {text}")
    title_normalized = normalize(title)
    topics: list[str] = []
    category = ""
    secondary = ""
    checks = [
        ("Liderazgo", ["leadership", "leading people", "leading technical teams", "liderazgo"]),
        ("Inteligencia Artificial", ["artificial intelligence", "machine learning", "deep learning", "tensorflow", "sagemaker", "ai", "inteligencia artificial"]),
        ("Robótica", ["robotica", "robotics", "ingenieria robotica"]),
        ("Tecnología", ["aws", "cloud", "software", "data", "mysql", "jira", "iot", "cyber", "information security"]),
        ("Negocio", ["lean six sigma", "continuous improvement", "supply chain", "business", "compliance", "conduct", "antitrust", "money laundering"]),
        ("Finanzas", ["finance", "finanzas"]),
        ("Deporte", ["taekwondo", "carrera", "race", "run", "paracaidismo", "medalla", "virtual race", "5 km", "10km"]),
        ("Escolar", ["preparatoria", "bachillerato", "olimpiada", "campamento", "buena conducta", "dibujo", "pintura", "teatral"]),
        ("Institucional", ["cedula profesional", "titulo electronico", "universidad de guadalajara", "secretaria de educacion publica"]),
        ("Personal", ["covid", "obesidad", "hipertension", "adultas mayores"]),
    ]
    for label, terms in checks:
        if any(term in title_normalized for term in terms):
            category = label
            topics.extend(term for term in terms if term in normalized and len(term) > 2)
            break
    for label, terms in checks:
        if any(term in normalized for term in terms):
            if not category:
                category = label
            elif label != category and not secondary:
                secondary = label
            topics.extend(term for term in terms if term in normalized and len(term) > 2)
    return category, secondary, sorted(set(title_case(topic) for topic in topics))[:6]


def institution_from_text(text: str, rel: str) -> tuple[str, str, str, str]:
    normalized = normalize(f"{text} {rel}")
    if "aws training and certification" in normalized:
        return "AWS Training and Certification", "AWS", "AWS", ""
    if "bosch" in normalized:
        return "Bosch", "Bosch", "Bosch México", ""
    if "universidad de guadalajara" in normalized or "udg" in normalized:
        return "Universidad de Guadalajara", "Universidad de Guadalajara", "Universidad de Guadalajara", "Sistema de Educación Media Superior"
    if "coursera" in normalized:
        issuer = "Coursera"
        group = "Coursera"
        if "university of colorado boulder" in normalized:
            issuer = "University of Colorado Boulder"
        elif "university of illinois" in normalized or "illinois" in normalized:
            issuer = "University of Illinois Urbana-Champaign"
        elif "deeplearning ai" in normalized:
            issuer = "DeepLearning.AI"
        elif "duke university" in normalized:
            issuer = "Duke University"
        elif "packt" in normalized:
            issuer = "Packt"
        elif "atlassian university" in normalized:
            issuer = "Atlassian University"
        elif "coursera project network" in normalized:
            issuer = "Coursera Project Network"
        return issuer, issuer, group, "Coursera"
    if "instituto mexicano del seguro social" in normalized:
        return "Instituto Mexicano del Seguro Social", "Gobierno de México", "Gobierno de México", ""
    if "harvard business impact" in normalized:
        return "Harvard Business Impact", "Harvard Business Impact", "Harvard Business Impact", ""
    if "linkedin learning" in normalized:
        return "LinkedIn Learning", "LinkedIn Learning", "LinkedIn Learning", ""
    if "lean six sigma" in normalized or "coparmex jalisco" in normalized and "white belt" in normalized:
        return "International Lean Six Sigma Group", "International Lean Six Sigma Group", "COPARMEX Jalisco", ""
    if "sulens" in normalized:
        return "Sulens", "Sulens", "Sulens", ""
    if "moo duk kwan" in normalized or "tae kwon do" in normalized:
        return "Asociación Moo Duk Kwan de México", "Asociación Moo Duk Kwan de México", "Organizaciones deportivas", ""
    if "paracaidismo queretaro" in normalized or "flight north queretaro" in normalized:
        return "Paracaidismo Querétaro", "Flight North Querétaro", "Organizaciones deportivas", ""
    if "kingala" in normalized or "coparmex" in normalized:
        return "Kingala / COPARMEX Jalisco", "Kingala / COPARMEX Jalisco", "COPARMEX Jalisco", ""
    if "ayuntamiento constitucional" in normalized or "poder joven" in normalized:
        return "H. Ayuntamiento Constitucional de Degollado", "Poder Joven Degollado", "Instituciones públicas", ""
    if "colegio octavio cesar cossio" in normalized:
        return "Colegio Octavio César Cossío", "Colegio Octavio César Cossío", "Instituciones escolares", ""
    return "", "", "", ""


def extract_title(text: str, rel: str) -> str:
    normalized = normalize(text)
    compact = re.sub(r"\s+", " ", text)
    course_patterns = [
        r"Omar Baruch Mor[oó]n L[oó]pez\s+(.+?)\s+an online non-credit",
        r"Omar Baruch Moron Lopez\s+(.+?)\s+an online non-credit",
        r"has successfully completed the online, non-credit Specialization\s+(.+?)\s+This class",
        r"Congratulations,\s+Omar Baruch Mor[oó]n L[oó]pez\s+(.+?)\s+Course completed on",
        r"Congratulations,\s+O\. Baruch L[oó]pez\s+(.+?)\s+Course completed on",
        r"^(.+?)\s+Course completed by Omar Baruch Mor[oó]n L[oó]pez",
    ]
    for pattern in course_patterns:
        match = re.search(pattern, compact, re.I)
        if match:
            title = clean(match.group(1))
            if is_clean_title(title):
                return title_case(title)

    patterns = [
        r"successfully completed\s+(.+?)\s+on\s+\d",
        r"training title\s+(.+?)\s+name\s+",
        r"por haber concluido satisfactoriamente el curso:\s+(.+?)(?:\s+duracion|\s+duración|$)",
        r"has successfully completed\s+(.+?)(?:\s+an online|\s+through coursera|\s+course completed|$)",
        r"course completed\s+(.+?)(?:\s+by continuing|\s+top skills|$)",
        r"ha completado el programa.*?presented in\s+(.+?)(?:\s+presented by|$)",
    ]
    for pattern in patterns:
        match = re.search(pattern, compact, re.I)
        if match:
            title = clean(match.group(1))
            title = re.sub(r"^\[[^\]]+\]\s*", "", title)
            title = re.sub(r"\s+Name\s+.*$", "", title, flags=re.I)
            if is_clean_title(title):
                return title_case(title)

    known = [
        ("aws shared responsibility model", "AWS Shared Responsibility Model"),
        ("introduction to amazon sagemaker", "Introduction to Amazon SageMaker"),
        ("leading people", "Leading People"),
        ("white belt", "White Belt Lean Six Sigma"),
        ("building and deploying deep learning applications with tensorflow", "Building and Deploying Deep Learning Applications with TensorFlow"),
        ("iot foundations operating systems fundamentals", "IoT Foundations: Operating Systems Fundamentals"),
        ("reality capture foundations for aec", "Reality Capture Foundations for AEC"),
        ("acreditacion en liderazgo internacional", "Acreditación en Liderazgo Internacional 2026"),
        ("titulo electronico", "Título electrónico: Licenciatura en Ingeniería Robótica"),
        ("tituloelectronico", "Título electrónico: Licenciatura en Ingeniería Robótica"),
        ("licenciatura en ingenieria robotica", "Título electrónico: Licenciatura en Ingeniería Robótica"),
        ("cedula profesional", "Cédula Profesional"),
        ("creacion de dibujo y pintura", "Creación de Dibujo y Pintura"),
        ("expresion teatral", "Expresión Teatral"),
        ("olimpiada estatal de biologia", "Participación en Olimpiada Estatal de Biología"),
        ("campamento pascua", "Campamento Pascua 2015"),
        ("buena conducta", "Buena Conducta"),
        ("carrera de 5km", "Carrera de 5 km"),
        ("carrera de 5 km", "Carrera de 5 km"),
        ("third place award", "Third Place Award - Virtual Race 10 km"),
        ("primer curso taller de robotica", "Primer Curso-Taller de Robótica"),
        ("paracaidismo", "Capacitación en paracaidismo tándem"),
        ("my sql 8 0", "MySQL 8.0"),
        ("mysql 8 0", "MySQL 8.0"),
        ("tae kwon do", "Certificado de grado Taekwondo"),
        ("taekwondo", "Certificado de grado Taekwondo"),
        ("abc de la obesidad", "ABC de la Obesidad"),
        ("cuidado de personas adultas mayores ante el covid", "Cuidado de personas adultas mayores ante el COVID-19"),
        ("cuidando tu corazon hipertension", "Cuidando tu corazón: Hipertensión"),
        ("plan de accion para el hogar ante covid", "Plan de acción para el hogar ante COVID-19"),
        ("recomendaciones para un retorno seguro al trabajo ante covid", "Recomendaciones para un retorno seguro al trabajo ante COVID-19"),
        ("todo sobre la prevencion del covid", "Todo sobre la prevención del COVID-19"),
        ("motivacion de la inteligencia artificial explicable", "Charla: Motivación de la Inteligencia Artificial Explicable"),
        ("connectory talks data analytics", "Connectory Talks: Data Analytics"),
    ]
    for needle, title in known:
        if needle in normalized:
            return title

    if "medallas" in normalize(rel):
        return ""
    return ""


def is_clean_title(title: str) -> bool:
    normalized = normalize(title)
    if len(normalized) < 4:
        return False
    if normalized in {"certificate of completion", "certificate of attendance", "constancia", "reconocimiento", "diploma"}:
        return False
    if len(re.findall(r"[a-zA-ZáéíóúÁÉÍÓÚñÑ]", title)) < 4:
        return False
    if re.search(r"[<>{}\\]{2,}", title):
        return False
    return True


def document_type(text: str, rel: str, title: str) -> str:
    normalized = normalize(f"{text} {rel} {title}")
    if "medallas" in normalized:
        return "Medalla / logro deportivo"
    if "titulo electronico" in normalized or "tituloelectronico" in normalized:
        return "Evidencia documental"
    if "cedula profesional" in normalized:
        return "Evidencia documental"
    if "constancia" in normalized:
        return "Constancia"
    if "diploma" in normalized:
        return "Diploma"
    if "reconocimiento" in normalized or "award" in normalized:
        return "Reconocimiento"
    if "certificate" in normalized or "certificado" in normalized:
        return "Certificado"
    if Path(rel).suffix.lower() in AUXILIARY_EXTENSIONS:
        return ""
    return ""


def life_stage_for(text: str, rel: str, institution: str, category: str) -> str:
    normalized = normalize(f"{text} {rel} {institution} {category}")
    if "bosch" in normalized:
        return "Bosch"
    if "universidad de guadalajara" in normalized or "titulo electronico" in normalized or "tituloelectronico" in normalized or "licenciatura" in normalized:
        return "Universidad"
    if "preparatoria" in normalized or "bachillerato" in normalized:
        return "Preparatoria"
    if "taekwondo" in normalized or "medallas" in normalized or "paracaidismo" in normalized or "carrera" in normalized:
        return "Personal / deportivo"
    if "coursera" in normalized or "linkedin" in normalized or "aws" in normalized or "harvard" in normalized:
        return "Vida profesional"
    if "kingala" in normalized or "coparmex" in normalized:
        return "Vida profesional"
    return ""


def make_description(item: dict[str, Any]) -> tuple[str, str]:
    title = item["title"]
    doc_type = item["document_type"]
    institution = item["institution"] or item["issuer"]
    category = item["category_primary"]
    topics = item["skills_or_topics"][:2]
    descriptor = {
        "Certificado": "Certificado emitido",
        "Constancia": "Constancia emitida",
        "Diploma": "Diploma emitido",
        "Reconocimiento": "Reconocimiento emitido",
        "Evidencia documental": "Evidencia documental emitida",
    }.get(doc_type, "Documento emitido")
    if title and institution and category:
        short = f"{descriptor} por {institution}, relacionado con {category.lower()}."
    elif title and institution:
        short = f"{descriptor} por {institution}."
    elif doc_type == "Medalla / logro deportivo":
        short = "Registro visual de medalla o logro deportivo."
    elif category:
        short = f"Registro documental asociado a {category.lower()}."
    else:
        short = ""

    expanded = short
    if topics and short:
        expanded = f"{short} Temas visibles: {', '.join(topics)}."
    return short, expanded


def is_internal_auxiliary_file(path: Path, rel: str) -> bool:
    normalized_rel = normalize(rel)
    if path.suffix.lower() in {".ini", ".py"}:
        return True
    return "txt resumen de certificados" in normalized_rel


def public_preview(image: Image.Image, target: Path, protected: bool) -> str:
    PUBLIC_PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    preview = ImageOps.exif_transpose(image.convert("RGB"))
    if protected:
        preview = preview.filter(ImageFilter.GaussianBlur(8))
        overlay = Image.new("RGBA", preview.size, (7, 7, 8, 54))
        preview = Image.alpha_composite(preview.convert("RGBA"), overlay).convert("RGB")
    preview.thumbnail((1200, 1500), Image.Resampling.LANCZOS)
    preview.save(target, format="WEBP", quality=82, method=6)
    return f"/recognitions/{target.name}"


def placeholder_preview(target: Path) -> str:
    PUBLIC_PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    image = Image.new("RGB", (900, 650), "#e9e4da")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((150, 120, 750, 530), radius=18, outline="#bdb4a4", width=4)
    draw.line((220, 240, 680, 240), fill="#bdb4a4", width=3)
    draw.line((220, 310, 600, 310), fill="#c9c0b2", width=3)
    draw.line((220, 380, 540, 380), fill="#d1c8bb", width=3)
    image.save(target, format="WEBP", quality=82, method=6)
    return f"/recognitions/{target.name}"


def make_item(index: int, path: Path, text: str, image: Image.Image | None, page_count: int, text_source: str, error: str) -> tuple[dict[str, Any], dict[str, Any]]:
    rel = str(path.relative_to(SOURCE_ROOT)).replace("\\", "/")
    internal_auxiliary = is_internal_auxiliary_file(path, rel)
    title = extract_title(text, rel)
    institution, issuer, issuer_group, platform = institution_from_text(text, rel)
    date_visible, date_precision, sort_date, year = parse_date_from_text(text)
    doc_type = document_type(text, rel, title)
    category, secondary, topics = category_from_title(title, text)
    life_stage = life_stage_for(text, rel, institution, category)
    protected = is_sensitive(text) or internal_auxiliary
    if "medallas/" in normalize(rel) and not category:
        category = "Deporte"
        life_stage = "Personal / deportivo"
    if "medallas/" in normalize(rel) and not doc_type:
        doc_type = "Medalla / logro deportivo"
    if internal_auxiliary:
        title = ""
        institution = ""
        issuer = ""
        issuer_group = ""
        platform = ""
        date_visible = ""
        date_precision = ""
        sort_date = None
        year = None
        doc_type = ""
        category = ""
        secondary = ""
        topics = []
        life_stage = ""

    base_for_slug = title or doc_type or category or f"documento-{index:03d}"
    slug_parts = [str(year) if year else "", institution or issuer_group, base_for_slug]
    slug = slugify("-".join(part for part in slug_parts if part), f"documento-{index:03d}")
    filename = f"{index:03d}-{slug}.webp"
    preview_target = PUBLIC_PREVIEW_DIR / filename
    display_image = ""
    if image is not None:
        display_image = public_preview(image, preview_target, protected)
    elif path.suffix.lower() in AUXILIARY_EXTENSIONS:
        display_image = placeholder_preview(preview_target)

    item = {
        "id": f"mural-{index:03d}",
        "slug": slug,
        "source_file": rel,
        "thumbnail_file": display_image,
        "display_image": display_image,
        "original_format": path.suffix.lower().lstrip("."),
        "title": title,
        "date_visible": date_visible,
        "date_precision": date_precision,
        "year": year,
        "institution": institution,
        "issuer": issuer,
        "issuing_department_or_program": "",
        "credential_platform": platform,
        "person_name_visible": "Omar Baruch Morón López" if "baruch" in normalize(text) and ("lopez" in normalize(text) or "moron" in normalize(text)) else "",
        "document_type": doc_type,
        "category_primary": category,
        "category_secondary": secondary,
        "life_stage": life_stage,
        "issuer_group": issuer_group,
        "context": "",
        "description_short": "",
        "description_expanded": "",
        "skills_or_topics": topics,
        "tags": [tag for tag in [category, secondary, life_stage] if tag],
        "privacy_level": "protected" if protected else "public",
        "evidence_notes": [],
        "sort_date": sort_date,
        "sort_group": year or 0,
        "related_items": [],
        "duplicate_group_id": "",
    }
    short, expanded = make_description(item)
    item["description_short"] = short
    item["description_expanded"] = expanded

    audit = {
        "id": item["id"],
        "source_file": rel,
        "text_source": text_source,
        "page_count": page_count,
        "hash": hashlib.sha256(path.read_bytes()).hexdigest(),
        "privacy_level": item["privacy_level"],
        "fields_completed": [key for key in ["title", "date_visible", "institution", "document_type", "category_primary", "life_stage"] if item.get(key)],
        "needs_human_review": not item["title"] or not item["institution"] or bool(error),
        "error": error,
    }
    return item, audit


def assign_duplicate_groups(items: list[dict[str, Any]], audits: list[dict[str, Any]]) -> None:
    by_hash: defaultdict[str, list[int]] = defaultdict(list)
    by_key: defaultdict[str, list[int]] = defaultdict(list)
    for index, (item, audit) in enumerate(zip(items, audits)):
        by_hash[audit["hash"]].append(index)
        key = normalize(f"{item['title']} {item['institution']} {item['date_visible']}")
        if item["title"] and item["institution"] and item["date_visible"]:
            by_key[key].append(index)

    group_number = 1
    seen: set[int] = set()
    for group in list(by_hash.values()) + list(by_key.values()):
        if len(group) < 2:
            continue
        fresh = [index for index in group if index not in seen]
        if len(fresh) < 2:
            continue
        group_id = f"dup-{group_number:03d}"
        group_number += 1
        for index in fresh:
            items[index]["duplicate_group_id"] = group_id
            audits[index]["duplicate_group_id"] = group_id
            seen.add(index)


def write_ts(items: list[dict[str, Any]]) -> None:
    years = [item["year"] for item in items if item["year"]]
    summary = {
        "total": len(items),
        "withImages": sum(1 for item in items if item["display_image"]),
        "protected": sum(1 for item in items if item["privacy_level"] == "protected"),
        "yearRange": [min(years), max(years)] if years else None,
        "categories": sorted({item["category_primary"] for item in items if item["category_primary"]}),
        "types": sorted({item["document_type"] for item in items if item["document_type"]}),
        "issuers": sorted({(item["issuer_group"] or item["institution"]) for item in items if item["issuer_group"] or item["institution"]}),
        "lifeStages": sorted({item["life_stage"] for item in items if item["life_stage"]}),
    }
    interface = """export interface RecognitionItem {
  id: string;
  slug: string;
  source_file: string;
  thumbnail_file: string;
  display_image: string;
  original_format: string;
  title: string;
  date_visible: string;
  date_precision: string;
  year: number | null;
  institution: string;
  issuer: string;
  issuing_department_or_program: string;
  credential_platform: string;
  person_name_visible: string;
  document_type: string;
  category_primary: string;
  category_secondary: string;
  life_stage: string;
  issuer_group: string;
  context: string;
  description_short: string;
  description_expanded: string;
  skills_or_topics: string[];
  tags: string[];
  privacy_level: string;
  evidence_notes: string[];
  sort_date: string | null;
  sort_group: number;
  related_items: string[];
  duplicate_group_id: string;
}

"""
    content = (
        interface
        + f"export const recognitionsGeneratedAt = {json.dumps(datetime.now(timezone.utc).isoformat(timespec='seconds'))};\n\n"
        + f"export const recognitionsSummary = {json.dumps(summary, ensure_ascii=False, indent=2)} as const;\n\n"
        + f"export const recognitionItems = {json.dumps(items, ensure_ascii=False, indent=2)} satisfies RecognitionItem[];\n"
    )
    PUBLIC_DATA_FILE.write_text(content, encoding="utf-8")


def write_report(items: list[dict[str, Any]], audits: list[dict[str, Any]]) -> None:
    completed = Counter()
    for item in items:
        for field in ["title", "date_visible", "institution", "document_type", "category_primary", "life_stage"]:
            if item.get(field):
                completed[field] += 1
    duplicates = [item for item in items if item["duplicate_group_id"]]
    review = [audit for audit in audits if audit["needs_human_review"]]
    lines = [
        "# Auditoría documental del Mural",
        "",
        f"Generado: {datetime.now(timezone.utc).isoformat(timespec='seconds')}",
        "",
        "## Estructura encontrada",
        "",
        "- Página: `src/pages/recognitions/index.astro`",
        "- Tarjeta: `src/components/RecognitionCard.astro`",
        "- Modelo público: `src/data/recognitions.ts`",
        "- Assets públicos: `public/recognitions/`",
        "- Script de curaduría: `scripts/recognitions/curate_mural.py`",
        "",
        "## Totales",
        "",
        f"- Archivos analizados: {len(items)}",
        f"- Registros actualizados: {len(items)}",
        f"- Miniaturas generadas: {sum(1 for item in items if item['display_image'])}",
        f"- Miniaturas protegidas por privacidad: {sum(1 for item in items if item['privacy_level'] == 'protected')}",
        f"- Posibles duplicados agrupados: {len(duplicates)}",
        "",
        "## Campos principales completados",
        "",
    ]
    for field, count in completed.most_common():
        lines.append(f"- `{field}`: {count}")
    lines.extend(
        [
            "",
            "## Posibles duplicados",
            "",
        ]
    )
    duplicate_groups: defaultdict[str, list[str]] = defaultdict(list)
    for item in duplicates:
        duplicate_groups[item["duplicate_group_id"]].append(item["source_file"])
    if duplicate_groups:
        for group, files in sorted(duplicate_groups.items()):
            lines.append(f"### {group}")
            lines.extend(f"- {file}" for file in files)
            lines.append("")
    else:
        lines.append("- No se detectaron duplicados fuertes.")
    lines.extend(
        [
            "## Revisión humana recomendada",
            "",
            "Estos registros se conservaron en el mural, pero requieren revisión editorial si se desea completar título, institución o lectura fina del documento.",
            "",
        ]
    )
    if review:
        for audit in review[:80]:
            reasons = []
            if audit["error"]:
                reasons.append("error técnico")
            if "title" not in audit["fields_completed"]:
                reasons.append("sin título confirmado")
            if "institution" not in audit["fields_completed"]:
                reasons.append("sin institución confirmada")
            lines.append(f"- `{audit['source_file']}`: {', '.join(reasons)}")
    else:
        lines.append("- Sin pendientes mayores.")
    lines.extend(
        [
            "",
            "## Cambios realizados en código",
            "",
            "- Sustitución del modelo público anterior por un modelo documental con campos opcionales.",
            "- Eliminación del uso público de estados heredados de revisión de metadatos.",
            "- Filtros por año, tipo, área, etapa de vida e institución/emisor.",
            "- Tarjetas que ocultan campos vacíos sin mostrar textos de relleno.",
            "- Miniaturas protegidas para documentos con señales de folio, identificador, CURP, QR o datos privados.",
        ]
    )
    AUDIT_REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    if not SOURCE_ROOT.exists():
        raise SystemExit(f"No existe la carpeta fuente: {SOURCE_ROOT}")
    if PUBLIC_PREVIEW_DIR.exists():
        for child in PUBLIC_PREVIEW_DIR.glob("*.webp"):
            child.unlink()
    files = sorted([path for path in SOURCE_ROOT.rglob("*") if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS], key=lambda item: str(item).lower())
    items: list[dict[str, Any]] = []
    audits: list[dict[str, Any]] = []
    for index, path in enumerate(files, 1):
        text, image, page_count, text_source, error = extract_text_and_image(path)
        item, audit = make_item(index, path, text, image, page_count, text_source, error)
        items.append(item)
        audits.append(audit)
    assign_duplicate_groups(items, audits)
    items.sort(key=lambda item: (-(item["year"] or 0), item["sort_date"] or "", item["title"] or item["source_file"]))
    write_ts(items)
    write_report(items, audits)
    print(json.dumps({"files": len(files), "items": len(items), "report": str(AUDIT_REPORT), "data": str(PUBLIC_DATA_FILE)}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
