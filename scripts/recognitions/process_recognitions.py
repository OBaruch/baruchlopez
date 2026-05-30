from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF
import pytesseract
from PIL import Image, ImageOps, UnidentifiedImageError


PROJECT_ROOT = Path(__file__).resolve().parents[2]
TRAJECTORY_ROOT = Path(os.environ.get("RECOGNITIONS_TRAJECTORY_ROOT", Path.home() / "OneDrive" / "Trayectoria Baruch"))
CERTIFICATES_ROOT = TRAJECTORY_ROOT / "Certificados"
NOMINATION_ROOT = TRAJECTORY_ROOT / "Nominación al Premio Estatal a la Juventud"
PUBLIC_PREVIEW_DIR = PROJECT_ROOT / "public" / "recognitions"
INTERNAL_DATA_DIR = PROJECT_ROOT / "data"
PUBLIC_DATA_FILE = PROJECT_ROOT / "src" / "data" / "recognitions.ts"
MASTER_DATA_FILE = INTERNAL_DATA_DIR / "recognitions.json"
DOCS_DIR = PROJECT_ROOT / "docs"
TESSERACT_EXE = Path(os.environ.get("TESSERACT_EXE", r"C:\Program Files\Tesseract-OCR\tesseract.exe"))
TESSDATA_DIR = Path(os.environ.get("TESSDATA_DIR", r"C:\tmp\tessdata"))

SUPPORTED_PDF = {".pdf"}
SUPPORTED_IMAGES = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp", ".heic"}
CERTIFICATE_AUXILIARY_EXTENSIONS = {".txt", ".xml", ".py", ".ini"}
SUPPORTED_EXTENSIONS = SUPPORTED_PDF | SUPPORTED_IMAGES | CERTIFICATE_AUXILIARY_EXTENSIONS

PUBLIC_CONFIDENCE_ORDER = {"alto": 0, "medio": 1, "bajo": 2, "por confirmar": 3}

POSITIVE_KEYWORDS = {
    "certificate",
    "certificado",
    "certificacion",
    "certificación",
    "constancia",
    "recognition",
    "reconocimiento",
    "diploma",
    "award",
    "premio",
    "nomination",
    "nominacion",
    "nominación",
    "course",
    "curso",
    "completed",
    "completion",
    "participation",
    "participación",
    "participacion",
    "taller",
    "workshop",
    "hackathon",
    "challenge",
    "scholarship",
    "beca",
    "toefl",
    "coursera",
    "linkedin learning",
    "aws",
    "atlassian",
    "cognigy",
    "lean six sigma",
    "deeplearning.ai",
    "universidad de guadalajara",
    "bosch",
}

NEGATIVE_KEYWORDS = {
    "factura",
    "invoice",
    "recibo",
    "comprobante de domicilio",
    "estado de cuenta",
    "bank",
    "banco",
    "credencial de elector",
    "ine",
    "pasaporte",
    "acta",
    "contrato",
    "nomina",
    "nómina",
    "payroll",
    "ticket",
}

SENSITIVE_KEYWORDS = {
    "curp",
    "rfc",
    "domicilio",
    "credencial de elector",
    "ine",
    "pasaporte",
    "nss",
    "numero de seguridad social",
    "número de seguridad social",
    "cuenta bancaria",
    "clabe",
    "salario",
    "nomina",
    "nómina",
    "telefono",
    "teléfono",
    "address",
    "home address",
    "global id",
    "employee id",
    "student number",
    "dob",
    "codigo",
    "código",
}

KNOWN_INSTITUTIONS = [
    ("Universidad de Guadalajara", ["universidad de guadalajara", "udg"]),
    ("Bosch México", ["bosch mexico", "bosch méxico", "bosch", "robert bosch"]),
    ("Coursera", ["coursera"]),
    ("DeepLearning.AI", ["deeplearning.ai", "deep learning ai"]),
    ("LinkedIn Learning", ["linkedin learning", "linkedin"]),
    ("AWS", ["amazon web services", "aws", "amazon athena", "amazon kinesis", "amazon sagemaker"]),
    ("Atlassian", ["atlassian", "jira"]),
    ("ETS", ["ets", "toefl"]),
    ("NiCE Cognigy", ["nice cognigy", "cognigy"]),
    ("International Lean Six Sigma", ["international lean six sigma", "lean six sigma"]),
    ("University of Colorado Boulder", ["university of colorado boulder", "colorado boulder"]),
    ("University of Illinois Urbana-Champaign", ["university of illinois", "urbana-champaign"]),
    ("SEP", ["secretaria de educacion publica", "secretaría de educación pública", "sep"]),
    ("Sulens / BYW Consulting Services", ["sulens", "byw consulting"]),
    ("MIU City University Miami", ["miu city university", "miami"]),
    ("UNIR México", ["unir mexico", "unir méxico", "universidad internacional de la rioja"]),
    ("Teleperformance", ["teleperformance"]),
]

KNOWN_TITLES = [
    "Lean Six Sigma White Belt Certification",
    "White Belt Lean Six Sigma",
    "AI Agents for Cognigy Users",
    "Cognigy Foundations",
    "Principles of Leadership: Leading Technical Teams Specialization",
    "A Technical Leader's Qualities and Effectiveness",
    "Challenges of Leading Individuals in the Tech Industry",
    "Challenges of Leading Technical Teams",
    "Introduction to Finance: The Basics",
    "Mathematical Foundations and Quantum Mechanics Essentials",
    "Introduction to Generative AI",
    "Introduction to Amazon Athena",
    "Introduction to Amazon Kinesis Streams",
    "AWS Shared Responsibility Model",
    "Introduction to Amazon SageMaker",
    "Machine Learning Data Lifecycle in Production",
    "Introduction to Machine Learning in Production",
    "Deploy Models with TensorFlow Serving and Flask",
    "AWS Elastic Beanstalk: Deploy a Python (Flask) Web Application",
    "MySQL 8.0",
    "Agile with Atlassian Jira",
    "IoT Foundations: Operating Systems Fundamentals",
    "Building and Deploying Deep Learning Applications with TensorFlow",
    "Reality Capture Foundations for AEC",
    "TOEFL iBT Score 78",
    "Dibujo y Pintura",
    "Expresión Teatral",
    "Instalaciones eléctricas residenciales",
    "Premio Estatal a la Juventud",
    "Mexcellence Scholarship Program",
]

PUBLIC_EXCLUDE_TERMS = [
    "carta compromiso",
    "certificado parcial",
    "comprobante",
    "constancia de situación fiscal",
    "constancia de situacion fiscal",
    "datos de cuenta",
    "formato de declaración",
    "formato de declaracion",
    "gastos",
    "informe-de-actividades",
    "kardex",
    "buena conducta",
    "codigo 213605572",
    "constancia de estudios",
    "no parentesco",
    "score report",
    "semblanza",
    "situación fiscal",
    "situacion fiscal",
    "student number",
    "tofel",
    "toefl",
]

MONTHS = {
    "january": 1,
    "jan": 1,
    "enero": 1,
    "february": 2,
    "feb": 2,
    "febrero": 2,
    "march": 3,
    "mar": 3,
    "marzo": 3,
    "april": 4,
    "apr": 4,
    "abril": 4,
    "may": 5,
    "mayo": 5,
    "june": 6,
    "jun": 6,
    "junio": 6,
    "july": 7,
    "jul": 7,
    "julio": 7,
    "august": 8,
    "aug": 8,
    "agosto": 8,
    "september": 9,
    "sep": 9,
    "sept": 9,
    "septiembre": 9,
    "setiembre": 9,
    "october": 10,
    "oct": 10,
    "octubre": 10,
    "november": 11,
    "nov": 11,
    "noviembre": 11,
    "december": 12,
    "dec": 12,
    "diciembre": 12,
}


@dataclass
class SourceFile:
    path: Path
    extension: str
    size: int
    modified: str
    source_area: str


def strip_accents(value: str) -> str:
    return "".join(
        char
        for char in unicodedata.normalize("NFD", value)
        if unicodedata.category(char) != "Mn"
    )


def normalize_text(value: str) -> str:
    value = strip_accents(value).lower()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def has_term(normalized_haystack: str, keyword: str) -> bool:
    normalized_keyword = normalize_text(keyword)
    if not normalized_keyword:
        return False
    if " " in normalized_keyword:
        return normalized_keyword in normalized_haystack
    return re.search(rf"(?:^|\s){re.escape(normalized_keyword)}(?:\s|$)", normalized_haystack) is not None


def slugify(value: str, fallback: str = "recognition") -> str:
    value = normalize_text(value)
    slug = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return slug[:92].strip("-") or fallback


def clean_line(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip(" \t\r\n-_|")


def safe_relative(path: Path) -> str:
    try:
        return str(path.relative_to(TRAJECTORY_ROOT))
    except ValueError:
        return str(path)


def enumerate_files() -> tuple[list[SourceFile], list[str]]:
    files: list[SourceFile] = []
    errors: list[str] = []

    def walk(root: Path) -> None:
        for current_root, dirs, names in os.walk(root, topdown=True, onerror=lambda err: errors.append(str(err))):
            current_path = Path(current_root)
            dirs[:] = [
                item
                for item in dirs
                if item.lower() not in {"node_modules", ".git", "dist", ".astro", "__pycache__"}
            ]
            for name in names:
                path = current_path / name
                ext = path.suffix.lower()
                is_certificate_auxiliary = is_relative_to(path, CERTIFICATES_ROOT) and ext in CERTIFICATE_AUXILIARY_EXTENSIONS
                if ext not in (SUPPORTED_PDF | SUPPORTED_IMAGES) and not is_certificate_auxiliary:
                    continue
                try:
                    stat = path.stat()
                except OSError as exc:
                    errors.append(f"No se pudo leer stat: {path} :: {exc}")
                    continue
                if is_relative_to(path, CERTIFICATES_ROOT):
                    source_area = "Certificados"
                elif is_relative_to(path, NOMINATION_ROOT):
                    source_area = "Nominación Premio Estatal a la Juventud"
                else:
                    source_area = "Trayectoria Baruch"
                files.append(
                    SourceFile(
                        path=path,
                        extension=ext,
                        size=stat.st_size,
                        modified=datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds"),
                        source_area=source_area,
                    )
                )

    if TRAJECTORY_ROOT.exists():
        walk(TRAJECTORY_ROOT)
    else:
        errors.append(f"No existe la carpeta raíz: {TRAJECTORY_ROOT}")

    files.sort(key=lambda item: str(item.path).lower())
    return files, errors


def is_relative_to(path: Path, parent: Path) -> bool:
    try:
        path.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False
    except OSError:
        return str(path).lower().startswith(str(parent).lower())


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def tesseract_ready() -> bool:
    if TESSERACT_EXE.exists():
        pytesseract.pytesseract.tesseract_cmd = str(TESSERACT_EXE)
    try:
        pytesseract.get_tesseract_version()
        return True
    except Exception:
        return False


def ocr_image(image: Image.Image) -> str:
    if not tesseract_ready():
        return ""
    prepared = image.convert("L")
    prepared = ImageOps.autocontrast(prepared)
    max_side = max(prepared.size)
    if max_side < 1800:
        scale = min(3.0, 1800 / max_side)
        prepared = prepared.resize((int(prepared.width * scale), int(prepared.height * scale)))
    config_parts = ["--psm 6"]
    if TESSDATA_DIR.exists():
        config_parts.append(f'--tessdata-dir "{TESSDATA_DIR}"')
    try:
        return pytesseract.image_to_string(prepared, lang="spa+eng", config=" ".join(config_parts), timeout=18)
    except Exception:
        try:
            return pytesseract.image_to_string(prepared, lang="eng", config="--psm 6", timeout=12)
        except Exception:
            return ""


def render_pdf_page(doc: fitz.Document, page_index: int, zoom: float = 1.8) -> Image.Image:
    page = doc.load_page(page_index)
    matrix = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    return Image.frombytes("RGB", [pix.width, pix.height], pix.samples)


def extract_pdf(path: Path) -> tuple[str, int, int, Image.Image | None, list[str]]:
    errors: list[str] = []
    text_parts: list[str] = []
    page_count = 0
    preview_page = 0
    preview_image: Image.Image | None = None
    try:
        with fitz.open(path) as doc:
            page_count = doc.page_count
            page_scores: list[tuple[int, int, int]] = []
            max_pages = min(page_count, 5)
            for index in range(max_pages):
                page = doc.load_page(index)
                page_text = page.get_text("text") or ""
                text_parts.append(page_text)
                page_scores.append((score_text(page_text), len(page_text), index))

            combined = "\n".join(text_parts)
            if len(normalize_text(combined)) < 80 and should_ocr_path(path):
                ocr_parts: list[str] = []
                for index in range(min(page_count, 2)):
                    try:
                        image = render_pdf_page(doc, index, zoom=2.2)
                        ocr_parts.append(ocr_image(image))
                    except Exception as exc:
                        errors.append(f"OCR PDF página {index + 1}: {exc}")
                if normalize_text("\n".join(ocr_parts)):
                    combined = f"{combined}\n" + "\n".join(ocr_parts)
                    text_parts = [combined]

            if page_scores:
                preview_page = sorted(page_scores, reverse=True)[0][2]
            try:
                preview_image = render_pdf_page(doc, preview_page, zoom=1.6)
            except Exception as exc:
                errors.append(f"Preview PDF: {exc}")
    except Exception as exc:
        errors.append(f"No se pudo abrir PDF: {exc}")
    return "\n".join(text_parts), page_count, preview_page, preview_image, errors


def extract_image(path: Path) -> tuple[str, Image.Image | None, list[str]]:
    errors: list[str] = []
    image: Image.Image | None = None
    text = ""
    try:
        with Image.open(path) as raw:
            image = raw.convert("RGB")
            if should_ocr_path(path):
                text = ocr_image(image)
    except UnidentifiedImageError as exc:
        errors.append(f"Imagen no identificada: {exc}")
    except Exception as exc:
        errors.append(f"No se pudo abrir imagen: {exc}")
    return text, image, errors


def load_image_preview(path: Path) -> tuple[Image.Image | None, list[str]]:
    try:
        with Image.open(path) as raw:
            return raw.convert("RGB"), []
    except Exception as exc:
        return None, [f"No se pudo abrir imagen para preview: {exc}"]


def extract_text_file(path: Path) -> tuple[str, list[str]]:
    errors: list[str] = []
    try:
        raw = path.read_bytes()
    except Exception as exc:
        return "", [f"No se pudo leer archivo auxiliar: {exc}"]

    for encoding in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            return raw.decode(encoding, errors="strict"), errors
        except UnicodeDecodeError:
            continue

    errors.append("Archivo auxiliar decodificado con reemplazo por caracteres no reconocidos.")
    return raw.decode("utf-8", errors="replace"), errors


def should_ocr_path(path: Path) -> bool:
    normalized = normalize_text(str(path))
    if is_relative_to(path, CERTIFICATES_ROOT) or is_relative_to(path, NOMINATION_ROOT):
        return True
    return any(has_term(normalized, keyword) for keyword in POSITIVE_KEYWORDS)


def score_text(value: str) -> int:
    normalized = normalize_text(value)
    score = 0
    for keyword in POSITIVE_KEYWORDS:
        if has_term(normalized, keyword):
            score += 4
    for keyword in NEGATIVE_KEYWORDS:
        if has_term(normalized, keyword):
            score -= 5
    return score


def classify_candidate(path: Path, text: str, source_area: str) -> tuple[int, list[str]]:
    combined = f"{path.name}\n{safe_relative(path)}\n{text}"
    normalized = normalize_text(combined)
    reasons: list[str] = []
    score = 0
    if source_area == "Certificados":
        score += 8
        reasons.append("Ubicado en carpeta Certificados")
    if source_area == "Nominación Premio Estatal a la Juventud":
        score += 5
        reasons.append("Ubicado en carpeta de nominación")
    for keyword in sorted(POSITIVE_KEYWORDS):
        if has_term(normalized, keyword):
            score += 3
            reasons.append(f"Coincide palabra clave: {keyword}")
    for keyword in sorted(NEGATIVE_KEYWORDS):
        if has_term(normalized, keyword):
            score -= 6
            reasons.append(f"Riesgo/no reconocimiento: {keyword}")
    if re.search(r"\b(20[0-2]\d|19[8-9]\d)\b", normalized):
        score += 1
    return score, reasons[:8]


def classify_path_only(path: Path, source_area: str) -> int:
    normalized = normalize_text(f"{path.name}\n{safe_relative(path)}")
    score = 0
    if source_area == "Certificados":
        score += 8
    if source_area == "Nominación Premio Estatal a la Juventud":
        score += 5
    for keyword in POSITIVE_KEYWORDS:
        if has_term(normalized, keyword):
            score += 3
    for keyword in NEGATIVE_KEYWORDS:
        if has_term(normalized, keyword):
            score -= 6
    return score


def detect_sensitive(path: Path, text: str) -> list[str]:
    combined = normalize_text(f"{path.name}\n{text}")
    flags: list[str] = []
    for keyword in sorted(SENSITIVE_KEYWORDS):
        if has_term(combined, keyword):
            flags.append(keyword)
    if re.search(r"\b[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d\b", strip_accents(text).upper()):
        flags.append("posible CURP")
    if has_term(combined, "rfc") and re.search(r"\b[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}\b", strip_accents(text).upper()):
        flags.append("posible RFC")
    email_count = len(re.findall(r"[\w.\-+]+@[\w.\-]+\.\w+", text))
    if email_count:
        flags.append("correo electrónico")
    phone_count = len(re.findall(r"(?:tel[eé]fono|telefono|phone|celular|cel)\D{0,14}(?:\+?\d[\s().-]*){10,}", text, re.I))
    if phone_count:
        flags.append("posible teléfono/folio numérico")
    return sorted(set(flags))


def detect_type(text: str, filename: str) -> str:
    normalized = normalize_text(f"{filename}\n{text}")
    checks = [
        ("Premio", ["premio", "award"]),
        ("Nominación", ["nominacion", "nominación", "nomination"]),
        ("Reconocimiento", ["reconocimiento", "recognition", "recognized"]),
        ("Diploma", ["diploma"]),
        ("Constancia", ["constancia"]),
        ("Certificado", ["certificado", "certificate", "certification"]),
        ("Hackathon", ["hackathon"]),
        ("Taller", ["taller", "workshop"]),
        ("Curso", ["curso", "course", "completed", "completion"]),
        ("Participación", ["participacion", "participación", "participation"]),
    ]
    for label, keywords in checks:
        if any(normalize_text(keyword) in normalized for keyword in keywords):
            return label
    image_words = ["logo", "captura", "screenshot", "imagen", "jpg", "png"]
    if any(word in normalized for word in image_words):
        return "Logo / evidencia visual"
    return "Otro"


def detect_category(text: str, filename: str, institution: str) -> str:
    normalized = normalize_text(f"{filename}\n{text}\n{institution}")
    categories = [
        ("Inteligencia Artificial", ["ai", "artificial intelligence", "machine learning", "deep learning", "tensorflow", "sagemaker", "cognigy", "agents"]),
        ("Robótica", ["robotica", "robótica", "robotics", "iot", "embedded", "arduino"]),
        ("Innovación", ["innovation", "innovacion", "innovación", "hackathon", "challenge", "premio"]),
        ("Liderazgo", ["leadership", "liderazgo", "leading", "technical teams"]),
        ("Emprendimiento", ["founder", "emprendimiento", "startup", "alpha signature"]),
        ("Finanzas", ["finance", "finanzas", "financial"]),
        ("Tecnología", ["aws", "cloud", "mysql", "jira", "software", "data", "sql"]),
        ("Participación social", ["social", "comunidad", "community", "movimiento adolescente"]),
        ("Reconocimiento institucional", ["bosch", "universidad", "premio estatal", "institucional"]),
        ("Académico", ["universidad", "university", "academico", "académico", "toefl", "sep"]),
        ("Profesional", ["coursera", "linkedin", "bosch", "professional"]),
    ]
    for label, keywords in categories:
        if any(has_term(normalized, keyword) for keyword in keywords):
            return label
    return "Otro"


def category_from_title(title: str, fallback: str) -> str:
    normalized = normalize_text(title)
    if any(has_term(normalized, term) for term in ["leadership", "leading", "technical teams"]):
        return "Liderazgo"
    if any(has_term(normalized, term) for term in ["machine learning", "deep learning", "tensorflow", "cognigy", "sagemaker", "generative ai"]):
        return "Inteligencia Artificial"
    if any(has_term(normalized, term) for term in ["aws", "amazon", "jira", "mysql", "iot", "reality capture", "quantum"]):
        return "Tecnología"
    if any(has_term(normalized, term) for term in ["finance"]):
        return "Finanzas"
    if any(has_term(normalized, term) for term in ["lean six sigma"]):
        return "Profesional"
    if any(has_term(normalized, term) for term in ["award", "premio", "hackathon"]):
        return "Innovación"
    return fallback


def detect_institution(text: str, filename: str) -> str:
    normalized = normalize_text(f"{filename}\n{text}")
    for institution, aliases in KNOWN_INSTITUTIONS:
        if any(normalize_text(alias) in normalized for alias in aliases):
            return institution
    lines = [clean_line(line) for line in text.splitlines()]
    for line in lines[:24]:
        if 4 <= len(line) <= 80 and re.search(r"(university|universidad|instituto|foundation|coursera|bosch|aws|ets)", line, re.I):
            return line
    return "Por confirmar"


def detect_person(text: str, filename: str) -> str:
    normalized = normalize_text(f"{filename}\n{text}")
    if "baruch" in normalized and ("lopez" in normalized or "moran" in normalized or "moron" in normalized):
        return "Baruch López"
    if "omar baruch" in normalized:
        return "Omar Baruch Morón López"
    return "Por confirmar"


def detect_title(text: str, path: Path, doc_type: str) -> str:
    normalized = normalize_text(text)
    if "white belt" in normalized and "lean six sigma" in normalized:
        return "Lean Six Sigma White Belt Certification"
    if "third place award" in normalized:
        return "Third Place Award"
    if has_term(normalized, "principles of leadership") and has_term(normalized, "leading technical teams") and has_term(normalized, "specialization"):
        return "Principles of Leadership: Leading Technical Teams Specialization"
    for known in KNOWN_TITLES:
        if normalize_text(known) in normalized or normalize_text(known) in normalize_text(path.name):
            return known

    lines = [clean_line(line) for line in text.splitlines()]
    lines = [line for line in lines if 4 <= len(line) <= 120]
    priority_words = re.compile(
        r"(certificate|certificado|constancia|reconocimiento|diploma|award|premio|course|curso|hackathon|toefl|leadership|machine learning|tensorflow|aws|cognigy|finance|jira|mysql)",
        re.I,
    )
    for line in lines[:45]:
        if priority_words.search(line) and not re.search(r"^(this|este|se otorga|awarded to|presented to)\b", line, re.I):
            return tidy_title(line)

    for line in lines[:30]:
        if not re.search(r"^(baruch|omar|date|fecha|issued|id|verify|folio|page)\b", normalize_text(line)):
            if len(line.split()) >= 2:
                return tidy_title(line)

    stem = re.sub(r"[_\-]+", " ", path.stem)
    stem = re.sub(r"\b(copy|copia|scan|scanned|page|pagina|página|final|nuevo|new)\b", " ", stem, flags=re.I)
    stem = clean_line(stem)
    if not stem:
        return f"{doc_type} por confirmar"
    return tidy_title(stem)


def tidy_title(value: str) -> str:
    value = clean_line(value)
    value = re.sub(r"\s+-\s+Coursera$", "", value, flags=re.I)
    if value.isupper() and len(value) > 8:
        return value.title()
    return value[:120]


def detect_date(text: str, filename: str) -> tuple[str | None, int | None, str]:
    combined = f"{text}\n{filename}"
    normalized = strip_accents(combined).lower()
    candidates: list[tuple[str | None, int, int, str]] = []

    month_names = "|".join(sorted(map(re.escape, MONTHS.keys()), key=len, reverse=True))

    for match in re.finditer(rf"\b(\d{{1,2}})(?:st|nd|rd|th)?\s+(?:de\s+)?({month_names})\s+(?:de\s+)?((?:19|20)\d{{2}})\b", normalized):
        day = int(match.group(1))
        month = MONTHS[match.group(2)]
        year = int(match.group(3))
        iso = make_date(year, month, day)
        if iso:
            candidates.append((iso, year, match.start(), "fecha completa"))

    for match in re.finditer(rf"\b({month_names})\s+(\d{{1,2}})(?:st|nd|rd|th)?[,]?\s+((?:19|20)\d{{2}})\b", normalized):
        month = MONTHS[match.group(1)]
        day = int(match.group(2))
        year = int(match.group(3))
        iso = make_date(year, month, day)
        if iso:
            candidates.append((iso, year, match.start(), "fecha completa"))

    for match in re.finditer(r"\b(\d{1,2})[/-](\d{1,2})[/-]((?:19|20)\d{2})\b", normalized):
        first = int(match.group(1))
        second = int(match.group(2))
        year = int(match.group(3))
        day, month = (first, second) if first > 12 else (second, first)
        iso = make_date(year, month, day)
        if iso:
            candidates.append((iso, year, match.start(), "fecha numérica"))

    for match in re.finditer(rf"\b({month_names})\s+((?:19|20)\d{{2}})\b", normalized):
        month = MONTHS[match.group(1)]
        year = int(match.group(2))
        iso = make_date(year, month, 1)
        if iso:
            candidates.append((iso, year, match.start(), "mes y año"))

    if candidates:
        candidates.sort(key=lambda item: item[2])
        iso, year, _, note = candidates[0]
        return iso, year, note

    years = [int(year) for year in re.findall(r"\b(20[0-2]\d|19[8-9]\d)\b", normalized)]
    years = [year for year in years if 1990 <= year <= 2026]
    if years:
        year = max(Counter(years).items(), key=lambda item: (item[1], item[0]))[0]
        return None, year, "año detectado"

    return None, None, "sin fecha detectada"


def make_date(year: int, month: int, day: int) -> str | None:
    try:
        return datetime(year, month, day).date().isoformat()
    except ValueError:
        return None


def detect_location(text: str) -> str:
    patterns = [
        r"(guadalajara,\s*jalisco)",
        r"(guadalajara,\s*m[eé]xico)",
        r"(zapopan,\s*jalisco)",
        r"(m[eé]xico)",
        r"(miami,\s*florida)",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            return clean_line(match.group(1)).title().replace("MéXico", "México")
    return "Por confirmar"


def confidence_for(title: str, institution: str, year: int | None, text: str, sensitive: list[str]) -> str:
    if sensitive:
        return "por confirmar"
    points = 0
    if title and "confirmar" not in normalize_text(title):
        points += 2
    if institution != "Por confirmar":
        points += 2
    if year:
        points += 2
    if len(normalize_text(text)) > 120:
        points += 1
    if points >= 6:
        return "alto"
    if points >= 4:
        return "medio"
    if points >= 2:
        return "bajo"
    return "por confirmar"


def make_description(item: dict[str, Any]) -> str:
    title = item["title"]
    institution = item["institution"]
    doc_type = item["type"].lower()
    category = item["category"].lower()
    if institution != "Por confirmar" and item.get("year"):
        return f"{item['type']} emitido por {institution} en {item['year']}, asociado a {category}."
    if institution != "Por confirmar":
        return f"{item['type']} emitido por {institution}, asociado a {category}."
    if item.get("year"):
        return f"{title} registrado como {doc_type} en {item['year']}; la institución requiere confirmación."
    return f"{title} registrado como {doc_type}; fecha e institución pendientes de confirmación."


def average_hash(image: Image.Image, hash_size: int = 8) -> str:
    small = ImageOps.grayscale(image).resize((hash_size, hash_size), Image.Resampling.LANCZOS)
    pixels = list(small.getdata())
    avg = sum(pixels) / len(pixels)
    bits = "".join("1" if pixel >= avg else "0" for pixel in pixels)
    return f"{int(bits, 2):0{hash_size * hash_size // 4}x}"


def hamming_hex(left: str, right: str) -> int:
    return bin(int(left, 16) ^ int(right, 16)).count("1")


def crop_preview(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    bg = Image.new("RGB", rgb.size, rgb.getpixel((0, 0)))
    diff = ImageOps.invert(ImageOps.grayscale(Image.blend(rgb, bg, 0.5)))
    bbox = diff.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        pad_x = int((right - left) * 0.035)
        pad_y = int((bottom - top) * 0.035)
        left = max(0, left - pad_x)
        top = max(0, top - pad_y)
        right = min(rgb.width, right + pad_x)
        bottom = min(rgb.height, bottom + pad_y)
        if (right - left) > rgb.width * 0.42 and (bottom - top) > rgb.height * 0.42:
            rgb = rgb.crop((left, top, right, bottom))
    return rgb


def save_preview(image: Image.Image, filename: str) -> str:
    PUBLIC_PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    preview = crop_preview(image)
    preview.thumbnail((1200, 1500), Image.Resampling.LANCZOS)
    target = PUBLIC_PREVIEW_DIR / filename
    preview.save(target, format="WEBP", quality=82, method=6)
    return f"/recognitions/{filename}"


def build_record(source: SourceFile, text: str, page_count: int, preview_page: int, image_hash: str | None, file_hash: str) -> dict[str, Any]:
    source_context = str(source.path)
    doc_type = detect_type(text, source_context)
    institution = detect_institution(text, source_context)
    title = detect_title(text, source.path, doc_type)
    date, year, date_note = detect_date(text, source.path.name)
    person = detect_person(text, source.path.name)
    location = detect_location(text)
    category = category_from_title(title, detect_category(text, source_context, institution))
    sensitive = detect_sensitive(source.path, text)
    confidence = confidence_for(title, institution, year, text, sensitive)
    normalized_title = normalize_text(title)
    item = {
        "id": "",
        "title": title,
        "type": doc_type,
        "category": category,
        "institution": institution,
        "issuer": institution,
        "date": date,
        "year": year,
        "dateLabel": date or (str(year) if year else "Por confirmar"),
        "location": location,
        "person": person,
        "description": "",
        "confidence": confidence,
        "sourceFile": source.path.name,
        "sourcePath": str(source.path),
        "sourceRelativePath": safe_relative(source.path),
        "sourceArea": source.source_area,
        "extension": source.extension,
        "fileSize": source.size,
        "modified": source.modified,
        "hash": file_hash,
        "textHash": hashlib.sha256(normalize_text(text).encode("utf-8")).hexdigest() if normalize_text(text) else None,
        "imageHash": image_hash,
        "pageCount": page_count,
        "previewPage": preview_page + 1 if page_count else None,
        "publicImage": None,
        "duplicateGroup": None,
        "duplicateStatus": "principal",
        "excludedFromPublic": False,
        "privacyFlags": sensitive,
        "candidateTitleKey": normalized_title,
        "dateDetection": date_note,
        "textSample": clean_line(text[:600]),
        "notes": [],
    }
    item["description"] = make_description(item)
    if sensitive:
        item["excludedFromPublic"] = True
        item["notes"].append("Excluido de publicación automática por posible dato sensible.")
    if source.extension in CERTIFICATE_AUXILIARY_EXTENSIONS:
        item["excludedFromPublic"] = True
        item["confidence"] = "por confirmar"
        item["notes"].append("Archivo auxiliar de Certificados inventariado para cobertura 100%; no se publica como reconocimiento visual sin revision manual.")
    if item["confidence"] in {"bajo", "por confirmar"}:
        item["notes"].append("Requiere revisión manual de metadatos antes de considerarse definitivo.")
    return item


def assign_ids(records: list[dict[str, Any]]) -> None:
    counts: Counter[str] = Counter()
    for item in sorted(records, key=sort_record_key):
        parts = []
        if item.get("year"):
            parts.append(str(item["year"]))
        if item.get("institution") and item["institution"] != "Por confirmar":
            parts.append(item["institution"])
        parts.append(item["title"])
        base = slugify("-".join(parts), "recognition")
        counts[base] += 1
        item["id"] = base if counts[base] == 1 else f"{base}-{counts[base]}"


def sort_record_key(item: dict[str, Any]) -> tuple[int, str, str]:
    year = item.get("year") or 0
    date = item.get("date") or f"{year:04d}-01-01" if year else "0000-00-00"
    return (-year, date, item.get("title", ""))


def deduplicate(records: list[dict[str, Any]]) -> dict[str, Any]:
    duplicate_groups: list[dict[str, Any]] = []
    parent = list(range(len(records)))

    def find(index: int) -> int:
        while parent[index] != index:
            parent[index] = parent[parent[index]]
            index = parent[index]
        return index

    def union(left: int, right: int) -> None:
        root_left = find(left)
        root_right = find(right)
        if root_left != root_right:
            parent[root_right] = root_left

    def reason(left: dict[str, Any], right: dict[str, Any]) -> str | None:
        same_title = left.get("candidateTitleKey") and left.get("candidateTitleKey") == right.get("candidateTitleKey")
        if left["hash"] == right["hash"]:
            return "Duplicado exacto por SHA-256"
        if left.get("textHash") and left.get("textHash") == right.get("textHash"):
            return "Duplicado probable por texto extraído idéntico"
        left_key = (left.get("candidateTitleKey"), left.get("year"), normalize_text(left.get("institution", "")))
        right_key = (right.get("candidateTitleKey"), right.get("year"), normalize_text(right.get("institution", "")))
        if left_key[0] and left_key == right_key and left_key[1]:
            return "Versión alternativa por título, institución y año"
        if left.get("imageHash") and right.get("imageHash"):
            distance = hamming_hex(left["imageHash"], right["imageHash"])
            if same_title and distance <= 4 and left.get("year") == right.get("year"):
                return f"Duplicado probable por similitud visual (distancia {distance})"
        text_left = normalize_text(left.get("textSample", ""))
        text_right = normalize_text(right.get("textSample", ""))
        if same_title and len(text_left) > 180 and len(text_right) > 180:
            ratio = SequenceMatcher(None, text_left[:1500], text_right[:1500]).ratio()
            if ratio >= 0.92:
                return f"Duplicado probable por similitud textual ({ratio:.2f})"
        return None

    pair_reasons: dict[tuple[int, int], str] = {}
    for left_index in range(len(records)):
        for right_index in range(left_index + 1, len(records)):
            why = reason(records[left_index], records[right_index])
            if why:
                union(left_index, right_index)
                pair_reasons[(left_index, right_index)] = why

    groups: dict[int, list[int]] = defaultdict(list)
    for index in range(len(records)):
        groups[find(index)].append(index)

    group_number = 0
    for indexes in groups.values():
        if len(indexes) == 1:
            continue
        group_number += 1
        group_id = f"dup-{group_number:03d}"
        sorted_indexes = sorted(indexes, key=lambda idx: principal_score(records[idx]), reverse=True)
        principal_index = sorted_indexes[0]
        principal = records[principal_index]
        principal["duplicateGroup"] = group_id
        principal["duplicateStatus"] = "principal"
        duplicates = []
        reasons = set()
        for index in sorted_indexes[1:]:
            item = records[index]
            item["duplicateGroup"] = group_id
            item["duplicateStatus"] = "duplicado"
            item["excludedFromPublic"] = True
            item["notes"].append(f"Excluido del mural público; principal: {principal['sourceRelativePath']}")
            duplicates.append(item)
            for pair, why in pair_reasons.items():
                if index in pair and principal_index in pair:
                    reasons.add(why)
        if not reasons:
            reasons.add("Agrupación por equivalencia entre duplicados del mismo grupo")
        duplicate_groups.append(
            {
                "id": group_id,
                "principal": principal["sourceRelativePath"],
                "principalTitle": principal["title"],
                "reason": sorted(reasons),
                "excluded": [item["sourceRelativePath"] for item in duplicates],
            }
        )
    return {"duplicateGroups": duplicate_groups}


def principal_score(item: dict[str, Any]) -> tuple[int, int, int, int, int]:
    confidence_score = 4 - PUBLIC_CONFIDENCE_ORDER.get(item["confidence"], 3)
    source_score = 3 if item["sourceArea"] == "Certificados" else 2 if "Nominación" in item["sourceArea"] else 1
    text_score = min(len(normalize_text(item.get("textSample", ""))), 1000)
    size_score = min(item.get("fileSize", 0) // 1024, 5000)
    privacy_score = -10 if item.get("privacyFlags") else 0
    return confidence_score, source_score, text_score, size_score, privacy_score


def is_public_quality_record(item: dict[str, Any]) -> bool:
    combined = normalize_text(f"{item.get('title', '')}\n{item.get('sourceRelativePath', '')}\n{item.get('textSample', '')}")
    if any(normalize_text(term) in combined for term in PUBLIC_EXCLUDE_TERMS):
        return False
    if item.get("type") == "Otro":
        return False
    title = item.get("title", "")
    normalized_title = normalize_text(title)
    if len(normalized_title) < 8:
        return False
    if len(re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]", title)) < 8:
        return False
    noisy_chars = len(re.findall(r"[#<>\\{}_=€Â¢®*]", title))
    if noisy_chars >= 2:
        return False
    if re.search(r"(pag\.?|hoja|anexo|oficina central|recomendaciones para|print date)", title, re.I):
        return False
    if title.lower().strip() in {"certificate", "certificate of completion", "certificate of attendance"}:
        return False
    if normalize_text(title).startswith("an online non credit course"):
        return False
    return True


def prepare_public_records(records: list[dict[str, Any]], preview_images: dict[str, Image.Image]) -> list[dict[str, Any]]:
    public: list[dict[str, Any]] = []
    used_filenames: Counter[str] = Counter()
    for item in sorted(records, key=sort_record_key):
        if item.get("excludedFromPublic"):
            continue
        if item["confidence"] in {"bajo", "por confirmar"}:
            continue
        if item.get("institution") == "Por confirmar":
            continue
        if not is_public_quality_record(item):
            continue
        if not item.get("year"):
            item["notes"].append("Sin fecha clara; se conserva en inventario interno y revisión manual.")
            continue
        image = preview_images.get(item["hash"])
        if image is None:
            item["notes"].append("Sin preview generada; se conserva fuera del mural público.")
            continue
        base = slugify(f"{item.get('year', 'fecha')}-{item['institution']}-{item['title']}", item["id"])
        used_filenames[base] += 1
        suffix = "" if used_filenames[base] == 1 else f"-{used_filenames[base]}"
        filename = f"{base}{suffix}.webp"
        item["publicImage"] = save_preview(image, filename)
        public.append(
            {
                "id": item["id"],
                "title": item["title"],
                "type": item["type"],
                "category": item["category"],
                "institution": item["institution"],
                "issuer": item["issuer"],
                "date": item["date"],
                "year": item["year"],
                "dateLabel": item["dateLabel"],
                "location": None if item["location"] == "Por confirmar" else item["location"],
                "description": item["description"],
                "confidence": item["confidence"],
                "publicImage": item["publicImage"],
                "alt": f"Vista previa de {item['title']} emitido por {item['institution']}.",
            }
        )
    return public


def prepare_certificate_mural_records(records: list[dict[str, Any]], preview_images: dict[str, Image.Image]) -> list[dict[str, Any]]:
    public: list[dict[str, Any]] = []
    used_filenames: Counter[str] = Counter()

    for item in sorted(records, key=sort_record_key):
        if item.get("sourceArea") != "Certificados":
            continue

        image = preview_images.get(item["hash"])
        has_sensitive_flags = bool(item.get("privacyFlags"))
        is_auxiliary = item.get("extension") in CERTIFICATE_AUXILIARY_EXTENSIONS
        can_publish_preview = image is not None and not has_sensitive_flags and not is_auxiliary
        public_image = None
        visual_status = "preview"

        if can_publish_preview:
            base = slugify(f"{item.get('year', 'fecha')}-{item['institution']}-{item['title']}", item["id"])
            used_filenames[base] += 1
            suffix = "" if used_filenames[base] == 1 else f"-{used_filenames[base]}"
            filename = f"{base}{suffix}.webp"
            item["publicImage"] = save_preview(image, filename)
            public_image = item["publicImage"]
        elif is_auxiliary:
            visual_status = "auxiliar"
            item["notes"].append("Archivo auxiliar visible en el mural como registro inventariado, sin preview documental.")
        elif has_sensitive_flags:
            visual_status = "privacidad"
            item["notes"].append("Preview no publicada por posible dato sensible; el registro permanece visible en el mural.")
        else:
            visual_status = "sin-preview"
            item["notes"].append("Sin preview generada; el registro permanece visible en el mural.")

        review_reasons = []
        if has_sensitive_flags:
            review_reasons.append("Revisión de privacidad")
        if item["confidence"] in {"bajo", "por confirmar"} or item.get("institution") == "Por confirmar" or not item.get("year"):
            review_reasons.append("Metadatos por confirmar")
        if item.get("duplicateStatus") == "duplicado":
            review_reasons.append("Duplicado documentado")
        if is_auxiliary:
            review_reasons.append("Archivo auxiliar")
        review_status = " / ".join(dict.fromkeys(review_reasons)) if review_reasons else "Preview publicada"

        description = item["description"]
        if has_sensitive_flags:
            description = "Registro incluido en el mural de certificados; la vista completa queda reservada por posible información sensible."
        elif is_auxiliary:
            description = "Archivo auxiliar asociado al expediente de certificados; pendiente de validación manual antes de tratarlo como documento visual."
        elif item["confidence"] in {"bajo", "por confirmar"}:
            description = "Documento inventariado desde la carpeta de certificados; sus metadatos requieren confirmación manual."

        public.append(
            {
                "id": item["id"],
                "title": item["title"],
                "type": item["type"],
                "category": item["category"],
                "institution": item["institution"],
                "issuer": item["issuer"],
                "date": item["date"],
                "year": item["year"],
                "dateLabel": item["dateLabel"],
                "location": None if item["location"] == "Por confirmar" else item["location"],
                "description": description,
                "confidence": item["confidence"],
                "publicImage": public_image,
                "alt": f"Vista previa de {item['title']} emitido por {item['institution']}.",
                "reviewStatus": review_status,
                "visualStatus": visual_status,
                "duplicateStatus": item["duplicateStatus"],
            }
        )
    return public


def write_public_data(public_records: list[dict[str, Any]], summary: dict[str, Any]) -> None:
    PUBLIC_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": summary["generatedAt"],
        "summary": {
            "uniquePublic": len(public_records),
            "certificateFolderRecords": len(public_records),
            "yearRange": summary.get("yearRange"),
            "categories": sorted({item["category"] for item in public_records}),
            "types": sorted({item["type"] for item in public_records}),
            "institutions": sorted({item["institution"] for item in public_records}),
            "reviewStatuses": sorted({item["reviewStatus"] for item in public_records}),
        },
        "items": public_records,
    }
    content = (
        "export interface RecognitionItem {\n"
        "  id: string;\n"
        "  title: string;\n"
        "  type: string;\n"
        "  category: string;\n"
        "  institution: string;\n"
        "  issuer: string;\n"
        "  date: string | null;\n"
        "  year: number | null;\n"
        "  dateLabel: string;\n"
        "  location: string | null;\n"
        "  description: string;\n"
        "  confidence: string;\n"
        "  publicImage: string | null;\n"
        "  alt: string;\n"
        "  reviewStatus: string;\n"
        "  visualStatus: string;\n"
        "  duplicateStatus: string;\n"
        "}\n\n"
        f"export const recognitionsGeneratedAt = {json.dumps(payload['generatedAt'], ensure_ascii=False)};\n\n"
        f"export const recognitionsSummary = {json.dumps(payload['summary'], ensure_ascii=False, indent=2)} as const;\n\n"
        f"export const recognitionItems = {json.dumps(public_records, ensure_ascii=False, indent=2)} satisfies RecognitionItem[];\n"
    )
    PUBLIC_DATA_FILE.write_text(content, encoding="utf-8")


def write_master_data(records: list[dict[str, Any]], public_records: list[dict[str, Any]], duplicate_report: dict[str, Any], summary: dict[str, Any], errors: list[str]) -> None:
    INTERNAL_DATA_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": summary["generatedAt"],
        "summary": summary,
        "recognitions": records,
        "publicRecognitions": public_records,
        "duplicateGroups": duplicate_report["duplicateGroups"],
        "errors": errors,
    }
    MASTER_DATA_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def md_escape(value: Any) -> str:
    text = "" if value is None else str(value)
    return text.replace("|", "\\|").replace("\n", " ")


def write_docs(records: list[dict[str, Any]], public_records: list[dict[str, Any]], duplicate_report: dict[str, Any], summary: dict[str, Any], errors: list[str], commands: list[str]) -> None:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    unique_records = [item for item in records if item["duplicateStatus"] == "principal"]
    pending = [
        item
        for item in records
        if item["confidence"] in {"bajo", "por confirmar"}
        or item.get("privacyFlags")
        or not item.get("year")
        or item.get("institution") == "Por confirmar"
    ]

    inventory_lines = [
        "# Recognitions Inventory",
        "",
        f"Generated: {summary['generatedAt']}",
        "",
        "## Summary",
        "",
        f"- Supported files found: {summary['supportedFilesFound']}",
        f"- Files selected by path heuristics: {summary['pathCandidateFiles']}",
        f"- Files skipped by path heuristics: {summary['skippedByPathHeuristics']}",
        f"- PDFs processed: {summary['pdfsProcessed']}",
        f"- Images processed: {summary['imagesProcessed']}",
        f"- Auxiliary Certificados files processed: {summary.get('auxiliaryFilesProcessed', 0)}",
        f"- Candidate recognition records: {summary['candidateRecords']}",
        f"- Unique principal records: {len(unique_records)}",
        f"- Public mural records: {len(public_records)}",
        f"- Duplicate groups: {len(duplicate_report['duplicateGroups'])}",
        f"- Duplicates excluded: {summary['duplicatesDetected']}",
        "",
        "## Unique Public Records",
        "",
        "| Year | Title | Institution | Type | Category | Confidence | Preview |",
        "| --- | --- | --- | --- | --- | --- | --- |",
    ]
    for item in public_records:
        inventory_lines.append(
            f"| {item['year']} | {md_escape(item['title'])} | {md_escape(item['institution'])} | {md_escape(item['type'])} | {md_escape(item['category'])} | {item['confidence']} | {md_escape(item['publicImage'])} |"
        )

    inventory_lines.extend(
        [
            "",
            "## All Candidate Documents Analyzed",
            "",
            "| Status | Confidence | Year | Title | Institution | Source area | Source file | Notes |",
            "| --- | --- | --- | --- | --- | --- | --- | --- |",
        ]
    )
    for item in sorted(records, key=lambda rec: (rec["duplicateStatus"], sort_record_key(rec))):
        notes = "; ".join(item.get("notes", []))
        inventory_lines.append(
            f"| {item['duplicateStatus']} | {item['confidence']} | {item.get('year') or 'por confirmar'} | {md_escape(item['title'])} | {md_escape(item['institution'])} | {md_escape(item['sourceArea'])} | {md_escape(item['sourceRelativePath'])} | {md_escape(notes)} |"
        )

    inventory_lines.extend(
        [
            "",
            "## Detected Institutions",
            "",
        ]
    )
    for institution, count in Counter(item["institution"] for item in records).most_common():
        inventory_lines.append(f"- {institution}: {count}")

    inventory_lines.extend(
        [
            "",
            "## Detected Years",
            "",
        ]
    )
    for year, count in sorted(Counter(item.get("year") or "por confirmar" for item in records).items(), key=lambda item: str(item[0]), reverse=True):
        inventory_lines.append(f"- {year}: {count}")

    inventory_lines.extend(
        [
            "",
            "## Processing Errors",
            "",
        ]
    )
    if errors:
        inventory_lines.extend(f"- {error}" for error in errors[:200])
    else:
        inventory_lines.append("- No processing errors detected.")

    (DOCS_DIR / "recognitions-inventory.md").write_text("\n".join(inventory_lines) + "\n", encoding="utf-8")

    duplicate_lines = [
        "# Recognitions Duplicates Report",
        "",
        f"Generated: {summary['generatedAt']}",
        "",
    ]
    if duplicate_report["duplicateGroups"]:
        for group in duplicate_report["duplicateGroups"]:
            duplicate_lines.extend(
                [
                    f"## {group['id']}",
                    "",
                    f"- Principal: {group['principal']}",
                    f"- Principal title: {group['principalTitle']}",
                    f"- Reason: {'; '.join(group['reason'])}",
                    "- Excluded from public mural:",
                ]
            )
            duplicate_lines.extend(f"  - {path}" for path in group["excluded"])
            duplicate_lines.append("")
    else:
        duplicate_lines.append("No duplicate groups detected.")
    (DOCS_DIR / "recognitions-duplicates-report.md").write_text("\n".join(duplicate_lines) + "\n", encoding="utf-8")

    log_lines = [
        "# Recognitions Processing Log",
        "",
        f"Generated: {summary['generatedAt']}",
        "",
        "## Tools Used",
        "",
        "- Python via `py`",
        "- PyMuPDF (`fitz`) for PDF text extraction and rendering",
        "- Pillow for image normalization, perceptual hashes and WebP previews",
        "- Tesseract OCR 5.5.0 via `pytesseract`",
        "- Spanish OCR model stored in `C:\\tmp\\tessdata\\spa.traineddata`",
        "- Existing Astro/TypeScript stack; no npm dependency added",
        "",
        "## Commands Executed",
        "",
    ]
    log_lines.extend(f"- `{command}`" for command in commands)
    log_lines.extend(
        [
            "",
            "## Counts",
            "",
            f"- Supported files found: {summary['supportedFilesFound']}",
            f"- Files selected by path heuristics: {summary['pathCandidateFiles']}",
            f"- Files skipped by path heuristics: {summary['skippedByPathHeuristics']}",
            f"- PDFs processed: {summary['pdfsProcessed']}",
            f"- Images processed: {summary['imagesProcessed']}",
            f"- Auxiliary Certificados files processed: {summary.get('auxiliaryFilesProcessed', 0)}",
            f"- Candidate recognition records: {summary['candidateRecords']}",
            f"- Public records generated: {len(public_records)}",
            f"- Duplicate groups: {len(duplicate_report['duplicateGroups'])}",
            f"- Duplicates detected: {summary['duplicatesDetected']}",
            f"- Pending manual review: {len(pending)}",
            "",
            "## Errors",
            "",
        ]
    )
    if errors:
        log_lines.extend(f"- {error}" for error in errors[:200])
    else:
        log_lines.append("- No processing errors detected.")
    (DOCS_DIR / "recognitions-processing-log.md").write_text("\n".join(log_lines) + "\n", encoding="utf-8")

    pending_lines = [
        "# Recognitions Pending Review",
        "",
        f"Generated: {summary['generatedAt']}",
        "",
        "| Reason | Year | Title | Institution | Source file | Privacy flags |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for item in pending:
        reasons = []
        if not item.get("year"):
            reasons.append("sin fecha")
        if item.get("institution") == "Por confirmar":
            reasons.append("sin institución clara")
        if item["confidence"] in {"bajo", "por confirmar"}:
            reasons.append(f"confianza {item['confidence']}")
        if item.get("privacyFlags"):
            reasons.append("posible dato sensible")
        pending_lines.append(
            f"| {md_escape('; '.join(reasons))} | {item.get('year') or 'por confirmar'} | {md_escape(item['title'])} | {md_escape(item['institution'])} | {md_escape(item['sourceRelativePath'])} | {md_escape(', '.join(item.get('privacyFlags', [])))} |"
        )
    if not pending:
        pending_lines.append("| Sin pendientes | - | - | - | - | - |")
    (DOCS_DIR / "recognitions-pending-review.md").write_text("\n".join(pending_lines) + "\n", encoding="utf-8")


def remove_old_previews() -> None:
    if PUBLIC_PREVIEW_DIR.exists():
        for child in PUBLIC_PREVIEW_DIR.iterdir():
            if child.is_file() and child.suffix.lower() == ".webp":
                child.unlink()


def publish_from_master() -> int:
    if not MASTER_DATA_FILE.exists():
        print(f"No existe el registro maestro: {MASTER_DATA_FILE}", file=sys.stderr)
        return 1

    payload = json.loads(MASTER_DATA_FILE.read_text(encoding="utf-8"))
    records = payload.get("recognitions", [])
    duplicate_report = {"duplicateGroups": payload.get("duplicateGroups", [])}
    errors: list[str] = list(payload.get("errors", []))
    preview_images: dict[str, Image.Image] = {}

    for item in records:
        if item.get("sourceArea") != "Certificados":
            continue
        if item.get("privacyFlags") or item.get("extension") in CERTIFICATE_AUXILIARY_EXTENSIONS:
            continue

        path = Path(item.get("sourcePath", ""))
        if not path.exists():
            errors.append(f"No existe archivo fuente para preview: {path}")
            continue

        image = None
        preview_errors: list[str] = []
        if item.get("extension") in SUPPORTED_PDF:
            try:
                with fitz.open(path) as doc:
                    page_index = max(0, min((item.get("previewPage") or 1) - 1, doc.page_count - 1))
                    image = render_pdf_page(doc, page_index, zoom=1.6)
            except Exception as exc:
                preview_errors.append(f"No se pudo renderizar preview PDF: {exc}")
        elif item.get("extension") in SUPPORTED_IMAGES:
            image, preview_errors = load_image_preview(path)

        errors.extend(f"{path}: {error}" for error in preview_errors)
        if image is not None:
            preview_images[item["hash"]] = image

    remove_old_previews()
    public_records = prepare_certificate_mural_records(records, preview_images)
    years = [item["year"] for item in public_records if item.get("year")]
    summary = dict(payload.get("summary", {}))
    summary.update(
        {
            "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "publicRecords": len(public_records),
            "certificateFolderPublicRecords": len(public_records),
            "yearRange": [min(years), max(years)] if years else None,
        }
    )

    commands = [
        "py scripts/recognitions/process_recognitions.py --publish-from-master",
    ]
    write_public_data(public_records, summary)
    write_master_data(records, public_records, duplicate_report, summary, errors)
    write_docs(records, public_records, duplicate_report, summary, errors, commands)

    print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)
    return 0


def process() -> int:
    commands = [
        "winget install --id tesseract-ocr.tesseract --accept-source-agreements --accept-package-agreements --silent",
        "Invoke-WebRequest -Uri https://github.com/tesseract-ocr/tessdata_fast/raw/main/spa.traineddata -OutFile C:\\tmp\\tessdata\\spa.traineddata",
        "py scripts/recognitions/process_recognitions.py",
    ]
    files, errors = enumerate_files()
    records: list[dict[str, Any]] = []
    preview_images: dict[str, Image.Image] = {}
    extraction_cache: dict[str, tuple[str, int, int, Image.Image | None, list[str], bool]] = {}
    pdf_count = 0
    image_count = 0
    auxiliary_count = 0
    scanned_ocr_count = 0
    path_candidate_count = 0
    skipped_by_path = 0

    print(f"Supported files found: {len(files)}", flush=True)
    for index, source in enumerate(files, start=1):
        if index % 50 == 0:
            print(f"Processed {index}/{len(files)} files", flush=True)
        if classify_path_only(source.path, source.source_area) < 4:
            skipped_by_path += 1
            continue
        path_candidate_count += 1
        try:
            file_hash = sha256_file(source.path)
        except Exception as exc:
            errors.append(f"No se pudo hashear {source.path}: {exc}")
            continue

        if file_hash in extraction_cache:
            text, page_count, preview_page, preview_image, extraction_errors, had_ocr_text = extraction_cache[file_hash]
        else:
            text = ""
            page_count = 0
            preview_page = 0
            preview_image = None
            extraction_errors = []
            had_ocr_text = False
            if source.extension in SUPPORTED_PDF:
                pdf_count += 1
                text, page_count, preview_page, preview_image, extraction_errors = extract_pdf(source.path)
                had_ocr_text = bool(normalize_text(text) and should_ocr_path(source.path))
            elif source.extension in SUPPORTED_IMAGES:
                image_count += 1
                text, preview_image, extraction_errors = extract_image(source.path)
                had_ocr_text = bool(normalize_text(text))
            else:
                auxiliary_count += 1
                text, extraction_errors = extract_text_file(source.path)
                had_ocr_text = bool(normalize_text(text))
            extraction_cache[file_hash] = (text, page_count, preview_page, preview_image.copy() if preview_image else None, extraction_errors, had_ocr_text)
        if had_ocr_text:
            scanned_ocr_count += 1
        errors.extend(f"{source.path}: {error}" for error in extraction_errors)

        candidate_score, reasons = classify_candidate(source.path, text, source.source_area)
        if candidate_score < 7:
            continue

        image_hash = None
        if preview_image is not None:
            try:
                image_hash = average_hash(preview_image)
                preview_images[file_hash] = preview_image.copy()
            except Exception as exc:
                errors.append(f"No se pudo crear hash visual {source.path}: {exc}")
        record = build_record(source, text, page_count, preview_page, image_hash, file_hash)
        record["candidateScore"] = candidate_score
        record["candidateReasons"] = reasons
        if not normalize_text(text):
            record["notes"].append("Sin texto extraído/OCR útil.")
            record["confidence"] = "por confirmar"
        records.append(record)

    assign_ids(records)
    duplicate_report = deduplicate(records)
    remove_old_previews()
    public_records = prepare_certificate_mural_records(records, preview_images)

    years = [item["year"] for item in public_records if item.get("year")]
    summary = {
        "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "trajectoryRoot": str(TRAJECTORY_ROOT),
        "supportedFilesFound": len(files),
        "pathCandidateFiles": path_candidate_count,
        "skippedByPathHeuristics": skipped_by_path,
        "pdfsProcessed": pdf_count,
        "imagesProcessed": image_count,
        "auxiliaryFilesProcessed": auxiliary_count,
        "ocrTextExtractions": scanned_ocr_count,
        "candidateRecords": len(records),
        "uniquePrincipalRecords": sum(1 for item in records if item["duplicateStatus"] == "principal"),
        "duplicatesDetected": sum(1 for item in records if item["duplicateStatus"] == "duplicado"),
        "publicRecords": len(public_records),
        "yearRange": [min(years), max(years)] if years else None,
        "tools": {
            "python": sys.version.split()[0],
            "pymupdf": fitz.version[0],
            "pillow": Image.__version__,
            "tesseract": "5.5.0.20241111",
        },
    }

    write_public_data(public_records, summary)
    write_master_data(records, public_records, duplicate_report, summary, errors)
    write_docs(records, public_records, duplicate_report, summary, errors, commands)

    print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Process Baruch López recognition and certificate documents.")
    parser.add_argument("--publish-from-master", action="store_true", help="Regenerate the public mural from data/recognitions.json without rerunning OCR.")
    args = parser.parse_args()
    if args.publish_from_master:
        return publish_from_master()
    return process()


if __name__ == "__main__":
    raise SystemExit(main())
