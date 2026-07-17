"""ChromaDB persistence wrapper (lazy).

A thin seam over Chroma so the tools and ingestion code speak in plain dicts and
never import chromadb directly. Swapping to Qdrant/LanceDB later is contained
here (see docs/research/vector-db-alternatives.md).
"""
from __future__ import annotations

from functools import lru_cache
from typing import Any

from .config import settings


@lru_cache(maxsize=1)
def _collection() -> Any:
    import chromadb

    client = chromadb.PersistentClient(path=settings.chroma_path)
    return client.get_or_create_collection(settings.collection_name)


def add_chunks(
    ids: list[str],
    embeddings: list[list[float]],
    documents: list[str],
    metadatas: list[dict],
) -> None:
    # upsert so re-ingesting a file replaces its chunks instead of duplicating
    _collection().upsert(
        ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas
    )


def query(embedding: list[float], k: int = 5) -> list[dict]:
    """Nearest-neighbour search; returns [{text, score, source, page, ...}]."""
    res = _collection().query(
        query_embeddings=[embedding],
        n_results=k,
        include=["documents", "metadatas", "distances"],
    )
    documents = (res.get("documents") or [[]])[0]
    metadatas = (res.get("metadatas") or [[]])[0]
    distances = (res.get("distances") or [[]])[0]
    hits: list[dict] = []
    for document, metadata, distance in zip(documents, metadatas, distances):
        score = (1.0 - distance) if distance is not None else None
        hits.append({"text": document, "score": score, **(metadata or {})})
    return hits


def keyword_search(keyword: str, limit: int = 10) -> list[dict]:
    """Literal substring match over stored chunk text (Chroma full-text filter)."""
    res = _collection().get(
        where_document={"$contains": keyword},
        include=["documents", "metadatas"],
        limit=limit,
    )
    documents = res.get("documents") or []
    metadatas = res.get("metadatas") or []
    return [
        {"text": document, **(metadata or {})}
        for document, metadata in zip(documents, metadatas)
    ]


def count() -> int:
    return _collection().count()


def list_all() -> dict:
    """Every stored chunk's metadata (+ a short preview), grouped by source file.

    Used by the document-tree viewer. Chunk text itself is fetched on demand via
    the context endpoint, so this payload stays light.
    """
    got = _collection().get(include=["metadatas", "documents"])
    ids = got.get("ids") or []
    metadatas = got.get("metadatas") or []
    documents = got.get("documents") or []

    by_file: dict[str, list[dict]] = {}
    for chunk_id, metadata, document in zip(ids, metadatas, documents):
        metadata = metadata or {}
        source = metadata.get("source", "(unknown)")
        start = metadata.get("start", 0)
        end = metadata.get("end", 0)
        by_file.setdefault(source, []).append(
            {
                "id": chunk_id,
                "page": metadata.get("page"),
                "start": start,
                "end": end,
                "length": max(0, end - start),
                "preview": (document or "")[:120].replace("\n", " ").strip(),
            }
        )

    files = []
    for source in sorted(by_file):
        chunks = sorted(
            by_file[source],
            key=lambda c: ((c["page"] if c["page"] is not None else -1), c["start"]),
        )
        files.append({"source": source, "chunk_count": len(chunks), "chunks": chunks})

    return {
        "files": files,
        "total_files": len(files),
        "total_chunks": sum(f["chunk_count"] for f in files),
    }


def delete_by_source(source: str) -> int:
    """Remove all chunks belonging to one source file. Returns the count removed."""
    collection = _collection()
    before = collection.count()
    collection.delete(where={"source": source})
    return before - collection.count()


def clear() -> None:
    """Drop the whole collection (wipe the index)."""
    import chromadb

    client = chromadb.PersistentClient(path=settings.chroma_path)
    try:
        client.delete_collection(settings.collection_name)
    except Exception:
        pass
    _collection.cache_clear()  # next access re-creates an empty collection


def get_text(source: str, start: int) -> str:
    """Fallback lookup of a chunk's stored text by (source, start offset)."""
    try:
        res = _collection().get(
            where={"$and": [{"source": source}, {"start": start}]},
            include=["documents"],
            limit=1,
        )
        documents = res.get("documents") or []
        return documents[0] if documents else ""
    except Exception:
        return ""
