# Chat With Your Docs — Newpage AI FDE assignment (Option 1)

A local-first RAG assistant. Point it at a folder of documents, then ask questions
and get answers grounded in your files, with citations. The LLM is a **tool-using
agent** — it decides when to run semantic search, keyword search, or read a named
file — and the OpenAI API key is entered **in the UI**, so nothing is hard-coded.

- **Frontend** — React + TypeScript + Vite, on the Newpage Design System.
- **Backend** — FastAPI, a local ChromaDB vector store, `sentence-transformers`
  embeddings, PyMuPDF ingestion (OCR fallback for scanned pages), and an
  auto-generated tool schema over plain Python functions.

## Architecture

```
  Browser (React, :5173)                 FastAPI backend (:8000)
  ┌───────────────────────┐   HTTP       ┌──────────────────────────────────────┐
  │ chat UI + API-key box  │ ───────────▶ │ /chat  ─ agents: tool-call loop        │
  │ ingest bar             │              │ /ingest ─ extract→chunk→embed→Chroma   │
  │ citations              │ ◀─────────── │ /config ─ set OpenAI key at runtime    │
  └───────────────────────┘   JSON       │ /health /tools /conversations          │
                                          └──────────────────────────────────────┘
        agents ─▶ llm.py (OpenAI, the only vendor import)
        agents ─▶ registry.dispatch(name, args) ─▶ tools.py (query_rag / search_keyword / read_file)
        tool_schema ─ generates JSON schemas from the tool signatures
```

See [docs/PLAN_AUDIT.md](docs/PLAN_AUDIT.md) for the design rationale and
[backend/README.md](backend/README.md) for backend internals.

## Repo layout

```
frontend/      React + TypeScript app (Vite) + the Newpage Design System
backend/       FastAPI app, RAG pipeline, tool registry + schema generation, tests
pseudocode/    the original architecture sketches this implements
docs/          plan audit, tech research (vector DBs, OCR), design-system reference
```

## Prerequisites

- **Node.js** 18+ and npm (frontend)
- **Python** 3.11+ (backend)
- An **OpenAI API key** — added in the UI, no need to put it on disk

## 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate         # macOS / Linux
pip install -r requirements.txt     # installs FastAPI, openai, chromadb, sentence-transformers, pymupdf, …
uvicorn app.main:app --reload       # serves http://localhost:8000  (interactive docs at /docs)
```

> First run downloads the embedding model (~90 MB for `all-MiniLM-L6-v2`).
> You don't need a `.env` — the API key can be entered in the UI. To use one
> anyway, `cp .env.example .env` and fill in `OPENAI_API_KEY`.

## 2. Frontend

```bash
cd frontend
npm install                         # download the npm packages
npm run dev                         # serves http://localhost:5173
```

The frontend calls `http://localhost:8000` by default. To point elsewhere, copy
`frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.

## 3. Use it

1. Open **http://localhost:5173**.
2. Click **API key** (top right), paste your OpenAI key, Save. The status badge
   flips to **Ready**. (The key goes to your local backend and is cached in your
   browser only — never committed.)
3. In the **ingest bar**, enter a path to a file or folder and click **Ingest**.
   The chunk count updates when it finishes.
4. Ask a question. Answers show the **files/pages** they drew from as citation chips.

## Testing

The backend's pure core (tool registry + dispatch, schema generation, chunking,
the agent loop) is covered by tests that need no API key or heavy dependencies:

```bash
cd backend
python -m unittest discover -s tests -v     # or: pytest
```

## Tech stack & key decisions

| Area | Choice | Why (see docs for alternatives considered) |
|---|---|---|
| Vector DB | ChromaDB (embedded) | zero-service local persistence — [research](docs/research/vector-db-alternatives.md) |
| Embeddings | `all-MiniLM-L6-v2` | fast, CPU-friendly, good default |
| Ingestion | PyMuPDF + OCR fallback | text-first; OCR only scanned pages — [research](docs/research/ocr-alternatives.md) |
| LLM | OpenAI (isolated in `llm.py`) | one-file swap to Anthropic/Ollama later |
| Tool schemas | generated from signatures/Pydantic | provider-agnostic; no SDK lock-in |
| Frontend | React + TS + Vite + Design System | typed, fast, on-brand |

## Productionising this

Summarised in [docs/PLAN_AUDIT.md](docs/PLAN_AUDIT.md#productionise--scale--deploy);
the short version: move conversation state to a real store, sandbox `read_file`,
put the API behind auth + rate limiting, run embeddings/vector DB as managed
services, containerise (a starter `backend/Dockerfile` is included), and add
tracing + an eval harness.

## Notes for the reviewer

> _This section is intentionally a placeholder — fill it in your own voice per the
> brief ("we need your thoughts, not an LLM's direct output"):_
>
> - **How I used AI tools** in building this, and my do's & don'ts.
> - **Engineering standards** I followed, and the ones I consciously skipped for time.
> - **What I'd do differently / add next** (reranking, hybrid search, streaming,
>   evaluation set, file-upload ingestion, auth).

## Known limitations (demo scope)

- Conversation state is in-memory (lost on restart).
- `read_file` can read any path the server can access — sandbox before exposing.
- Retrieval is pure vector similarity (no reranking/hybrid yet).
- No auth, rate limiting, or response streaming yet.
