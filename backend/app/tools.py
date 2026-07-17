"""The tools the agent can call — every capability lives in this one file.

Each function is registered with ``@tool`` (see registry.py), which records the
reference from the tool's name back to the executable method. Adding a capability
is just adding a function here: the schema generator advertises it to the model
and the dispatcher makes it callable, both automatically.

Retrieval tools return ``{"text": ..., "chunks": [...]}`` — the ``text`` is what
the model reads, and ``chunks`` carry the ``{source, page}`` metadata the agent
turns into citations.
"""
from __future__ import annotations

import os
from typing import Annotated

from . import embeddings, vector_store
from .config import settings
from .registry import tool

_READ_FILE_LIMIT = 20_000  # characters


@tool
def read_file(
    path: Annotated[str, "Path to a UTF-8 text file to read."],
) -> str:
    """Read and return the raw text of a specific file.

    Use when the user names a file directly, or to inspect a source that a
    previous search surfaced.
    """
    if not os.path.isfile(path):
        return f"No such file: {path}"
    with open(path, "r", encoding="utf-8", errors="replace") as handle:
        return handle.read(_READ_FILE_LIMIT)


@tool
def search_keyword(
    keyword: Annotated[str, "Exact word or phrase to find literally in the documents."],
    limit: Annotated[int, "Maximum number of matches to return."] = 10,
) -> dict:
    """Literal keyword/substring search across the ingested documents.

    Use for names, IDs, codes or exact phrases where semantic search may drift.
    """
    hits = vector_store.keyword_search(keyword, limit=limit)
    text = (
        "\n\n".join(f"[{hit.get('source')}:{hit.get('page')}] {hit['text']}" for hit in hits)
        or f"No matches for {keyword!r}."
    )
    return {"text": text, "chunks": hits}


@tool
def query_rag(
    question: Annotated[str, "A natural-language question to answer from the documents."],
    k: Annotated[int, "How many passages to retrieve (0 = use the configured default)."] = 0,
) -> dict:
    """Semantic retrieval over the document collection.

    Embeds the question and returns the most similar passages. This is the
    primary tool for answering questions about document content.
    """
    top_k = k or settings.top_k
    vector = embeddings.embed_one(question)
    chunks = vector_store.query(vector, k=top_k)
    text = (
        "\n\n".join(f"[{chunk.get('source')}:{chunk.get('page')}] {chunk['text']}" for chunk in chunks)
        or "No relevant passages found."
    )
    return {"text": text, "chunks": chunks}
