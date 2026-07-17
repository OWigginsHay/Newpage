"""Local sentence-transformer embeddings (lazy-loaded and cached).

The model is only imported/loaded on first use, so importing this module is
cheap and the rest of the app stays testable without the ML stack installed.
"""
from __future__ import annotations

from functools import lru_cache
from typing import Any

from .config import settings


@lru_cache(maxsize=1)
def _model() -> Any:
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(settings.embedding_model)


def embed(texts: list[str]) -> list[list[float]]:
    """Embed a batch of texts into L2-normalised vectors (cosine-ready)."""
    vectors = _model().encode(list(texts), normalize_embeddings=True)
    return [vector.tolist() for vector in vectors]


def embed_one(text: str) -> list[float]:
    return embed([text])[0]
