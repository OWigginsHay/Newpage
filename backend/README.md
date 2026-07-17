# Backend — Chat With Your Docs

A document-grounded **tool-using agent** over a local RAG store. The LLM is given
three tools (`query_rag`, `search_keyword`, `read_file`) and decides which to call;
their JSON schemas are generated automatically from the Python function
signatures. This is the real implementation of the `pseudocode/` sketches.

## Architecture

```
React UI ──HTTP──▶ FastAPI (main.py)
                      │
                      ▼
                  agents.py  ── conversation state + tool-call loop
                   │   │   │
       llm.py ◀────┘   │   └────▶ registry.dispatch(name, args) ──▶ tools.py
    (OpenAI, the        │                                            read_file
     only vendor        │                                            search_keyword
     import)            │                                            query_rag ─┐
                        ▼                                                        │
                 tool_schema.py  ── signature/Pydantic ▶ JSON schema            │
                 (advertises tools to the model)                                │
                                                                                ▼
   ingestion.py ─ extract (PyMuPDF, +OCR fallback) ─▶ chunking.py ─▶ embeddings ─▶ vector_store (Chroma)
```

The **tool registry** (`registry.py`) is the hinge: `@tool` records `name -> function`
in one dict that both `tool_schema` (to *describe* tools) and `dispatch` (to *run*
them) read. A tool can't be advertised without also being callable.

## Setup

```bash
cd backend
python -m venv .venv && .venv/Scripts/activate      # Windows
#  source .venv/bin/activate                          # macOS/Linux
pip install -r requirements.txt
cp .env.example .env      # then add your OPENAI_API_KEY
```

## Run

```bash
uvicorn app.main:app --reload           # http://localhost:8000  (docs at /docs)
```

Ingest some documents, then chat:

```bash
curl -X POST localhost:8000/ingest -H "content-type: application/json" \
     -d '{"path": "C:/path/to/docs"}'
curl -X POST localhost:8000/chat -H "content-type: application/json" \
     -d '{"message": "What does the handbook say about refunds?"}'
```

## Test

The pure core (registry, schema generation, chunking, agent loop) is tested
without any heavy dependencies or network:

```bash
python -m unittest discover -s tests -v     # or: pytest
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET  | `/health` | liveness + chunk count |
| POST | `/ingest` | `{path}` — ingest a file or folder |
| POST | `/chat` | `{message, conversation_id?}` — ask a question |
| GET  | `/conversations` | list conversation ids |
| GET  | `/conversations/{id}` | full message history |
| GET  | `/tools` | the auto-generated tool schemas (debugging) |

## Key decisions

- **Tool-using agent, not fixed retrieve-then-stuff.** The model chooses between
  semantic search, literal keyword search, and reading a named file — more capable
  and more transparent (every answer carries the tool calls that produced it).
- **Schema generation over an SDK.** `tool_schema.py` inspects signatures (and
  defers to Pydantic `model_json_schema()` for model params), emitting either the
  OpenAI or Anthropic envelope from one core schema — the provider-agnostic seam.
- **Vendor isolation.** Only `llm.py` imports `openai`; everything else speaks the
  normalised `{content, tool_calls}` shape, so swapping to Anthropic/Ollama is a
  one-file change.
- **Citations by construction.** Every chunk stores `{source, page, offsets}`;
  retrieval tools return those alongside text, and the agent surfaces them.
- **Text-first ingestion.** Read the embedded PDF text layer; only rasterise + OCR
  a page that has no text but does have images (see `docs/research/`).

## Known limitations (demo scope)

- **Conversation state is in-memory** — lost on restart. Swap `CONVERSATIONS` for
  SQLite/Redis to persist.
- **`read_file` reads any path** the process can access — fine locally, but sandbox
  it to an allow-listed docs directory before exposing this anywhere.
- **No reranking / hybrid search yet** — pure vector similarity.
- **No auth, rate limiting, or streaming** — see the plan audit for the productionisation list.
