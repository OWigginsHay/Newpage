"""Runtime configuration, read once from the environment (.env).

Kept dependency-light on purpose (stdlib only) so every other module can import
settings without pulling anything heavy.
"""
from __future__ import annotations

import os
from dataclasses import dataclass

try:  # load a local .env if python-dotenv is available (optional)
    from dotenv import load_dotenv

    load_dotenv()
except Exception:  # pragma: no cover
    pass


@dataclass(frozen=True)
class Settings:
    # LLM (the only vendor-specific piece; see llm.py)
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    reasoning: str = "none"  # none|low|medium|high|xhigh|max (reasoning-capable models)

    # Embeddings + vector store
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    chroma_path: str = "./.chroma"
    collection_name: str = "documents"

    # Chunking (character windows)
    chunk_window: int = 1000
    chunk_overlap: int = 150

    # Retrieval + agent loop
    top_k: int = 5
    max_tool_iterations: int = 6

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            openai_api_key=os.getenv("OPENAI_API_KEY", ""),
            openai_model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            reasoning=os.getenv("OPENAI_REASONING", "none"),
            embedding_model=os.getenv(
                "EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
            ),
            chroma_path=os.getenv("CHROMA_PATH", "./.chroma"),
            collection_name=os.getenv("CHROMA_COLLECTION", "documents"),
            chunk_window=int(os.getenv("CHUNK_WINDOW", "1000")),
            chunk_overlap=int(os.getenv("CHUNK_OVERLAP", "150")),
            top_k=int(os.getenv("TOP_K", "5")),
            max_tool_iterations=int(os.getenv("MAX_TOOL_ITERATIONS", "6")),
        )


settings = Settings.from_env()
