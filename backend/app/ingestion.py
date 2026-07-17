"""Document ingestion: extract text (with OCR fallback for scanned pages), chunk
with citation metadata, embed, and persist to Chroma.

Text-first, OCR-only-when-needed — most PDFs are born-digital, so we read the
embedded text layer and only rasterise + OCR a page when it has effectively no
text but does contain images.
"""
from __future__ import annotations

import os

from . import embeddings, vector_store
from .chunking import chunk_text
from .config import settings

TEXT_EXTENSIONS = {".txt", ".md", ".markdown", ".rst", ".csv", ".json", ".log"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff", ".gif"}
SUPPORTED_EXTENSIONS = TEXT_EXTENSIONS | IMAGE_EXTENSIONS | {".pdf"}

# A page with fewer than this many characters but with images is treated as scanned.
_SCANNED_TEXT_THRESHOLD = 20


def get_pages(path: str) -> list[tuple[int | None, str]]:
    """Return ``[(page_number, text), ...]``.

    PDFs are read per page via PyMuPDF (page numbers 1-based); plain-text files
    come back as a single ``(None, text)`` entry.
    """
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return _pdf_pages(path)
    if ext in IMAGE_EXTENSIONS:
        from .ocr import ocr_image  # the image's content is text we OCR

        return [(None, ocr_image(path))]
    if ext in TEXT_EXTENSIONS:
        with open(path, "r", encoding="utf-8", errors="replace") as handle:
            return [(None, handle.read())]
    raise ValueError(f"Unsupported file type: {ext or '(none)'}")


def _pdf_pages(path: str) -> list[tuple[int | None, str]]:
    import fitz  # PyMuPDF

    pages: list[tuple[int | None, str]] = []
    with fitz.open(path) as doc:
        for number, page in enumerate(doc, start=1):
            text = page.get_text("text").strip()
            if len(text) < _SCANNED_TEXT_THRESHOLD and page.get_images():
                text = _ocr_page(page) or text  # scanned-page fallback
            pages.append((number, text))
    return pages


def _ocr_page(page) -> str:
    from .ocr import ocr_pixmap

    pixmap = page.get_pixmap(dpi=200)
    return ocr_pixmap(pixmap)


def ingest_file(path: str) -> dict:
    """Ingest a single file into the vector store; returns a small summary."""
    chunks = []
    for page_number, text in get_pages(path):
        chunks.extend(
            chunk_text(
                text,
                source=path,
                page=page_number,
                window=settings.chunk_window,
                overlap=settings.chunk_overlap,
            )
        )
    if not chunks:
        return {"file": path, "chunks": 0}

    vectors = embeddings.embed([chunk.text for chunk in chunks])
    vector_store.add_chunks(
        ids=[chunk.id for chunk in chunks],
        embeddings=vectors,
        documents=[chunk.text for chunk in chunks],
        metadatas=[chunk.metadata() for chunk in chunks],
    )
    return {"file": path, "chunks": len(chunks)}


def get_chunk_context(
    source: str, start: int, end: int, page: int | None = None, context: int = 400
) -> dict:
    """Return a chunk plus the surrounding document text, for previews.

    Re-reads the source so the chunk can be shown highlighted in context
    (`before` / `text` / `after`). Falls back to the stored chunk text if the
    file is gone or unreadable. Note: for scanned PDFs this re-runs extraction,
    so it's cheapest on born-digital / text files.
    """
    full = ""
    try:
        pages = get_pages(source)
        if len(pages) == 1 and pages[0][0] is None:  # plain-text file
            full = pages[0][1]
        elif page is not None and page >= 0:
            full = next((text for number, text in pages if number == page), "")
        else:
            full = "\n".join(text for _number, text in pages)
    except Exception:
        full = ""

    if full:
        start = max(0, min(start, len(full)))
        end = max(start, min(end, len(full)))
        return {
            "source": source,
            "page": page,
            "start": start,
            "end": end,
            "before": full[max(0, start - context) : start],
            "text": full[start:end],
            "after": full[end : end + context],
            "before_truncated": start - context > 0,
            "after_truncated": end + context < len(full),
        }

    # fallback: the chunk text stored in the vector store
    return {
        "source": source,
        "page": page,
        "start": start,
        "end": end,
        "before": "",
        "text": vector_store.get_text(source, start),
        "after": "",
        "before_truncated": False,
        "after_truncated": False,
    }


def ingest_path(path: str) -> dict:
    """Ingest a file, or every supported file under a directory."""
    results: list[dict] = []
    if os.path.isdir(path):
        for root, _dirs, files in os.walk(path):
            for name in files:
                if os.path.splitext(name)[1].lower() in SUPPORTED_EXTENSIONS:
                    file_path = os.path.join(root, name)
                    try:
                        results.append(ingest_file(file_path))
                    except Exception as exc:
                        results.append({"file": file_path, "error": str(exc)})
    else:
        results.append(ingest_file(path))

    total = sum(result.get("chunks", 0) for result in results)
    return {"ingested": results, "total_chunks": total}
