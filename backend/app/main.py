"""FastAPI surface consumed by the React frontend."""
from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import agents, filepicker, ingestion, llm, tools, vector_store  # noqa: F401  (tools import registers them)
from .config import persist_env, settings

app = FastAPI(title="Newpage — Chat With Your Docs", version="0.1.0")

# Dev CORS: the Vite frontend runs on a different origin. Tighten for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None


class IngestRequest(BaseModel):
    path: str
    recursive: bool = True


class ConfigRequest(BaseModel):
    openai_api_key: str | None = None
    model: str | None = None
    reasoning: str | None = None


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "configured": llm.is_configured(), "chunks": _safe_count()}


@app.get("/config")
def get_config() -> dict:
    """Report configuration state — never returns the key itself."""
    return {
        "configured": llm.is_configured(),
        "model": llm.current_model(),
        "reasoning": llm.current_reasoning(),
        "has_env_key": bool(settings.openai_api_key),
    }


@app.post("/config")
def set_config(request: ConfigRequest) -> dict:
    """Set the OpenAI key/model/reasoning at runtime (from the UI). Held in memory only."""
    llm.set_credentials(
        api_key=request.openai_api_key, model=request.model, reasoning=request.reasoning
    )
    # Persist locally (gitignored .env) so it survives backend restarts.
    persist_env(
        OPENAI_API_KEY=request.openai_api_key or None,
        OPENAI_MODEL=request.model,
        OPENAI_REASONING=request.reasoning,
    )
    return {
        "configured": llm.is_configured(),
        "model": llm.current_model(),
        "reasoning": llm.current_reasoning(),
    }


@app.get("/browse")
def browse(mode: str = "directory") -> dict:
    """Open a native OS file/folder dialog and return the chosen path (local only)."""
    return {"path": filepicker.pick_path("file" if mode == "file" else "directory")}


@app.post("/chat")
def chat(request: ChatRequest) -> dict:
    if not llm.is_configured():
        raise HTTPException(status_code=400, detail="No OpenAI API key configured. Add it in Settings.")
    try:
        return agents.send_chat(request.message, request.conversation_id)
    except Exception as exc:  # surface LLM/auth/network errors cleanly, not as a 500
        raise HTTPException(status_code=502, detail=f"LLM request failed: {exc}") from exc


@app.get("/conversations")
def list_conversations() -> dict:
    return {"conversations": agents.get_chats()}


@app.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: str) -> dict:
    history = agents.get_conversation_history(conversation_id)
    if not history:
        raise HTTPException(status_code=404, detail="Unknown conversation")
    return {"conversation_id": conversation_id, "messages": history}


@app.get("/tools")
def list_tools() -> dict:
    """The auto-generated tool schemas — handy for debugging the schema generator."""
    return {"tools": agents.get_tool_schema()}


@app.post("/ingest")
def ingest(request: IngestRequest) -> dict:
    return ingestion.ingest_path(request.path, recursive=request.recursive)


@app.get("/chunks")
def list_chunks() -> dict:
    """All indexed chunks grouped by source file — powers the document tree."""
    try:
        return vector_store.list_all()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not list chunks: {exc}") from exc


@app.delete("/chunks")
def delete_chunks(source: str | None = None) -> dict:
    """Remove one file's chunks (?source=...), or clear the whole index (no source)."""
    if source:
        removed = vector_store.delete_by_source(source)
        return {"deleted": removed, "source": source}
    vector_store.clear()
    return {"cleared": True}


@app.get("/chunk_context")
def chunk_context(source: str, start: int, end: int, page: int | None = None) -> dict:
    """A chunk plus surrounding document text, for the citation/preview hover."""
    return ingestion.get_chunk_context(source, start, end, page)


def _safe_count() -> int | None:
    try:
        return vector_store.count()
    except Exception:
        return None
