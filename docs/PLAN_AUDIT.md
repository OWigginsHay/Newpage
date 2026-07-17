# Plan audit — "Chat With Your Docs" (Option 1)

Audit of [`System Requirments.md`](../System%20Requirments.md) against the assignment brief (`Assignment - AI FDE.docx`). Goal: check the plan will score well on what's actually graded, and catch gaps/risks before building.

## Verdict

The plan has a **sound backbone** — a clean three-system decomposition, a local-first stack that's easy for reviewers to run, and good instincts (provider-agnostic, query expansion). The **single biggest risk is scope**: the brief triple-emphasises *"start simple… a basic working version with great engineering > a complex broken one… we value a solid & well-engineered basic solution A LOT MORE than an over-engineered complex one,"* yet several planned items are custom infrastructure (dynamic cross-provider tool-schema generation, a query-expansion LLM branch, OCR, STT) that can eat the schedule before the core RAG loop works. The plan is also **silent on ~half of the criteria the brief explicitly grades**: prompt engineering, guardrails, quality/evaluation, observability, citations, testing, containerisation, and productionisation.

Net: **keep the backbone, cut/defer the plumbing, and add the missing "quality" surface.** Build a walking skeleton first.

## What the brief actually grades

From the docx, reviewers score on (and the README must cover):

- **Core functionality** — working RAG + a simple interface.
- **Creativity in UI/UX** — a well-designed app.
- **Thought process on:** Chunking · Embedding & LLM selection · Retrieval · **Prompt engineering** · **Context management** · **Guardrails** · **Quality controls** · **Observability**.
- **Engineering excellence** — clean, readable, well-structured code; *ideally containerised, well-tested, observable*.
- **AI-assisted development** — how you use AI coding tools, kept repeatable/maintainable; your do's & don'ts.
- **README** — setup, architecture, **productionise/scale/deploy on a hyperscaler**, RAG/LLM choices considered vs chosen, key decisions & why, standards followed/skipped, how AI was used, what you'd do differently.
- Repeated constraint: **"We need your thoughts, not an LLM's direct output."**

## Coverage matrix

| Graded area | In the plan? | Status |
|---|---|---|
| Core RAG loop | Ingestion + embedding + query layer | ✅ Covered |
| Simple interface | React UI + design system | ✅ Covered (scaffold started) |
| UI/UX creativity | Brand + Claude design | ✅ Covered |
| Chunking | "chunk those files" | ⚠️ No strategy (size/overlap/token vs char/structure) |
| Embedding model | "HFSentenceTransformerV2" | ⚠️ Not a real model name — must specify |
| LLM selection | "APIs Directly or Ollama" | ✅ Flexible; no concrete model/rationale yet |
| Retrieval approach | Vector query + optional question-expansion | ✅ Decent; no reranking/hybrid |
| **Prompt engineering** | — | ❌ Missing |
| **Context management** | Message tracking | ⚠️ Conversation state only; no token-budget / chunk-packing |
| **Guardrails** | — | ❌ Missing (grounding, "I don't know", prompt injection, PII) |
| **Quality / evaluation** | — | ❌ Missing |
| **Observability** | — | ❌ Missing |
| **Citations / source attribution** | — | ❌ Missing (table-stakes for RAG trust) |
| Testing | — | ❌ Missing |
| Containerisation | — | ❌ Missing (brief explicitly values it) |
| Productionise / scale / deploy | — | ❌ Missing (required README item) |
| AI-assisted dev writeup | — | ❌ Not planned (document as you go) |

## Strengths (keep these)

- **Three-system decomposition** (ingestion+embedding · tool-schema · chat/state) is a clean, testable boundary set.
- **Local-first stack** (Ollama, local embeddings, local Chroma) → self-contained, **no API keys needed to run** → directly serves "quick setup instructions" and lets reviewers actually run it. Strong choice.
- **Provider-agnostic instinct** ("don't tie ourselves to the OpenAI Agents SDK") is exactly the FDE signal reviewers want — *as long as it doesn't become a build cost* (see risks).
- **Query-expansion idea** (turn one question into sub-questions) shows retrieval sophistication; good as an *optional* enhancement.
- **Design/brand attention** aligns with the "well-designed application" criterion.

## Risks & over-engineering (address before building)

1. **Dynamic cross-provider tool-schema generation** (inspect + Pydantic → OpenAI/Anthropic schemas) is a whole sub-project. Note that (a) a straight RAG loop — retrieve → stuff context → generate — often needs **no tool-calling at all**, and (b) libraries already unify this: Pydantic's `model_json_schema()`, `instructor`, and `litellm` (one interface across providers). **Recommendation:** don't hand-roll it for the demo. If you keep it as a deliberate "engineering philosophy" showpiece, timebox it and say so in the README; otherwise use `litellm`/`instructor` and spend the time on retrieval quality.
2. **Query-expansion branch** adds latency, token cost, and failure modes. Make it **off by default**, added only after the skeleton works.
3. **STT is out of scope for Option 1.** Speech-to-text is the *bonus for Option 3 (Meeting Intelligence)*, not Chat With Your Docs. Drop it unless you specifically want voice queries as a late stretch — and even then, only after core is done.
4. **OCR is being over-weighted.** Most PDFs are born-digital (they already have a text layer). Leading with a "Textract equivalent" risks building for the rare scanned case first. Extract embedded text first and **OCR only as a per-page fallback** (see [`research/ocr-alternatives.md`](research/ocr-alternatives.md)).

## Specific corrections / nits in the doc

- **Brand palette is wrong.** The plan says *"Yellow, Blue, White,"* but the logo SVG has **no blue and no white** — it's teal `#08BDB8`, yellow `#FFCF36`, dark-teal `#008C85`, orange `#FF7F1F`, on a black wordmark. The design system should use the actual palette. *(Already applied in the scaffold.)*
- **"HFSentenceTransformerV2" is not a model.** Pick a concrete one and justify it: `sentence-transformers/all-MiniLM-L6-v2` (fast, 384-d, excellent CPU default), or `BAAI/bge-small-en-v1.5` / `Alibaba-NLP/gte-*` for better quality, or `all-mpnet-base-v2` for higher quality at more cost.
- **"Textract equivalent"** — Textract is OCR *plus* layout/table extraction; the closest local analogue is **Docling** (or PyMuPDF + RapidOCR + pdfplumber). See the OCR research doc.
- **ChromaDB is a fine default** — research confirms it; keep it, and cite LanceDB (embedded) and Qdrant (container) as *alternatives considered*, which directly feeds the README's "choices considered and final choice." See [`research/vector-db-alternatives.md`](research/vector-db-alternatives.md).
- **Tidy the typos** before anything ships near the submission: "Requirments", "Convsersation", "signautre", "equivelent".

## Missing pieces to fold into the plan

- **Chunking strategy** — token-based size + overlap (e.g. ~512 tokens / ~64 overlap), consider structure-aware splitting on headings.
- **Chunk metadata schema** — source path, page, char offsets → this is what makes citations possible.
- **Citations in answers** — show which doc/page each claim came from. Table-stakes for trust and easy UX credit.
- **Retrieval quality** — top-k + similarity threshold; optional cross-encoder reranker (`bge-reranker`) or hybrid BM25+vector if pure vector under-retrieves.
- **Prompt/grounding template** — system prompt that says "answer only from the provided context; if it isn't there, say you don't know."
- **Guardrails** — refuse when no relevant context; treat document text as untrusted (prompt-injection awareness); a note on PII.
- **Evaluation** — even a tiny hand-labelled Q/A set + retrieval hit-rate + a few golden answers; mention LLM-as-judge as a stretch.
- **Observability** — structured logs of query → retrieved chunks → prompt → token counts → latency; surfacing a "sources/trace" panel doubles as a UI feature.
- **Conversation state persistence** — in-memory vs SQLite; single vs multi-session.
- **Testing** — unit tests for the chunker (and schema-gen if kept) + one smoke test of retrieve→answer.
- **Containerisation** — Dockerfile(s) + `docker-compose` (frontend + backend + optional Chroma). Explicitly valued.
- **Config/secrets** — `.env` for optional API keys; keep **Ollama as the zero-key default** so reviewers run it without keys.
- **README productionisation section** — reserve space now: managed vector DB, autoscaled API, ingestion queue, object storage for docs, auth, cost + observability on AWS/GCP/Azure/Cloudflare. Required even if not built.
- **Ingestion error handling** — bad/encrypted PDFs, odd encodings, empty extracts.

## Concrete stack recommendation (post-research)

| Layer | Pick | Why / alternatives considered |
|---|---|---|
| Vector DB | **ChromaDB** (embedded `PersistentClient`) | Purpose-built, zero-service. Alts: LanceDB (embedded), Qdrant (container upgrade). *Not Milvus Lite — no native Windows.* |
| Embeddings | **`all-MiniLM-L6-v2`** | Fast CPU default; upgrade to `bge-small-en-v1.5` for quality. |
| Ingestion | **PyMuPDF** (text) + **RapidOCR** (scanned fallback) + **pdfplumber** (tables) — or **Docling** as the one-dep option | Text-first, OCR only when needed. |
| LLM | **Ollama** local (Llama 3.x / Qwen) default; Anthropic/OpenAI via config | Zero-key so reviewers can run it. |
| Backend | **FastAPI (Python)** | Async, typed, Pydantic-native — fits the schema/ingestion work. |
| Frontend | **React + TS + Vite** | Scaffolded. |
| Packaging | **docker-compose** | Frontend + backend (+ optional Chroma). |

## One meta-note

The brief says twice it wants **your** thoughts, not an LLM's output. Treat this audit and the research docs as **inputs and scaffolding** — the submission README must be written in your own voice, with your reasoning and trade-offs. Don't paste these files into it.
