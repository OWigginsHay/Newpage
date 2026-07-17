"""Pure chunking logic.

Split extracted page text into overlapping character windows, each carrying the
citation metadata (source, page, char offsets) that lets the agent point back to
where an answer came from. No I/O and no heavy dependencies, so this is fully
unit-testable on its own.

Note the corrected stride: ``step = window - overlap`` (the pseudocode's
``i += i - overlap`` grew ``i`` geometrically).
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Chunk:
    id: str
    text: str
    source: str
    page: int | None
    start: int
    end: int

    def metadata(self) -> dict:
        # page may be None for plain-text files; Chroma rejects None, so coerce to -1
        return {
            "source": self.source,
            "page": self.page if self.page is not None else -1,
            "start": self.start,
            "end": self.end,
        }


def chunk_text(
    text: str,
    source: str,
    page: int | None = None,
    window: int = 1000,
    overlap: int = 150,
) -> list[Chunk]:
    """Slide a fixed window over ``text`` with ``overlap`` characters of carry-over.

    Empty/whitespace-only windows are skipped. Chunk ids are stable and unique
    per (source, page, offset), so re-ingesting a file upserts rather than
    duplicates.
    """
    if window <= 0:
        raise ValueError("window must be > 0")
    if overlap < 0 or overlap >= window:
        raise ValueError("overlap must satisfy 0 <= overlap < window")

    text = text or ""
    n = len(text)
    step = window - overlap
    chunks: list[Chunk] = []

    i = 0
    while i < n:
        piece = text[i : i + window]
        if piece.strip():
            chunks.append(
                Chunk(
                    id=f"{source}::p{page}::{i}",
                    text=piece,
                    source=source,
                    page=page,
                    start=i,
                    end=min(i + window, n),
                )
            )
        i += step
    return chunks
