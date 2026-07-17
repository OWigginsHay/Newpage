"""OCR backends for scanned PDF pages and image files.

Tries EasyOCR first (uses the local GPU if Torch/CUDA is present — fast and
accurate), then RapidOCR (pip-only, CPU), then Tesseract. Returns "" if none is
installed, so ingestion degrades gracefully to text-only.
"""
from __future__ import annotations

from functools import lru_cache
from typing import Any


@lru_cache(maxsize=1)
def _engine() -> tuple[str | None, Any]:
    try:
        import easyocr

        # verbose=False avoids a Windows console crash: the download progress bar
        # prints a U+2588 block char that cp1252 can't encode.
        return "easyocr", easyocr.Reader(["en"], verbose=False)  # GPU auto-detected
    except Exception:
        pass
    try:
        from rapidocr_onnxruntime import RapidOCR

        return "rapidocr", RapidOCR()
    except Exception:
        pass
    try:
        import pytesseract  # noqa: F401

        return "tesseract", None
    except Exception:
        return None, None


def engine_name() -> str:
    """Which OCR backend is active (for reporting)."""
    return _engine()[0] or "none"


def _ocr_array(image: Any) -> str:
    """Run OCR over an RGB numpy image and return the text."""
    kind, engine = _engine()
    if kind == "easyocr":
        lines = engine.readtext(image, detail=0, paragraph=True)
        return "\n".join(lines)
    if kind == "rapidocr":
        result, _elapsed = engine(image)
        return "\n".join(line[1] for line in (result or []))
    if kind == "tesseract":
        import pytesseract
        from PIL import Image

        return pytesseract.image_to_string(Image.fromarray(image))
    return ""


def ocr_pixmap(pix: Any) -> str:
    """OCR a PyMuPDF pixmap (rasterised PDF page)."""
    if _engine()[0] is None:
        return ""
    import numpy as np

    image = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    return _ocr_array(image[:, :, :3])


@lru_cache(maxsize=64)
def ocr_image(path: str) -> str:
    """OCR an image file directly (its content is the text). Cached by path."""
    if _engine()[0] is None:
        return ""
    try:
        import numpy as np
        from PIL import Image

        image = np.array(Image.open(path).convert("RGB"))
        return _ocr_array(image)
    except Exception:
        return ""
